import { WebSocket, WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.join(__dirname, '..', '..', 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'vessels_cache.json');

// Map of MMSI -> vessel object
const vesselMap = new Map();
const connectedClients = new Set();
let aisWs = null;
let reconnectTimer = null;
let currentApiKey = process.env.AISSTREAM_API_KEY || '';

let aisStatus = {
  configured: !!currentApiKey,
  connected: false,
  statusText: currentApiKey ? "INITIALIZING" : "NO_KEY_CONFIGURED",
  message: currentApiKey 
    ? "Connecting to AISstream.io websocket relay..." 
    : "AISstream.io key not configured in .env. Showing NO FIX / NO DATA state per production specification.",
  lastMessageTime: null,
  totalMessagesReceived: 0,
  trackedVesselsCount: 0
};

// Map ship type number to readable maritime category
function decodeShipType(typeCode) {
  if (!typeCode) return "Other / Unspecified";
  if (typeCode >= 70 && typeCode <= 79) return "Cargo Vessel";
  if (typeCode >= 80 && typeCode <= 89) return "Tanker";
  if (typeCode === 30) return "Fishing";
  if (typeCode === 51) return "SAR / Search & Rescue";
  if (typeCode === 52) return "Tug / Towing";
  if (typeCode === 55) return "Law Enforcement / Patrol";
  if (typeCode >= 60 && typeCode <= 69) return "Passenger";
  if (typeCode === 50) return "Pilot";
  if (typeCode === 31 || typeCode === 32) return "Towing";
  if (typeCode >= 35 && typeCode <= 37) return "Military / Research";
  return "General Marine";
}

export function initAisRelay(server) {
  // 1. Create frontend WebSocket server attached to HTTP server at path /ws/ais
  const wss = new WebSocketServer({ server, path: '/ws/ais' });

  wss.on('connection', (ws) => {
    connectedClients.add(ws);

    // Immediately send current status and existing cached vessels
    ws.send(JSON.stringify({
      type: 'INIT_STATE',
      status: aisStatus,
      vessels: Array.from(vesselMap.values())
    }));

    ws.on('message', (msg) => {
      try {
        const parsed = JSON.parse(msg.toString());
        if (parsed.type === 'SET_API_KEY' && parsed.key) {
          updateApiKey(parsed.key);
        }
      } catch (e) {
        console.error("[AIS Relay] Error parsing client message:", e.message);
      }
    });

    ws.on('close', () => {
      connectedClients.delete(ws);
    });

    ws.on('error', (err) => {
      console.warn("[AIS Relay] Client WS error:", err.message);
      connectedClients.delete(ws);
    });
  });

  // Try to load any existing cache file from previous session
  loadCacheFromDisk();

  // Connect to upstream AISstream.io
  connectToAisStream();
}

export function updateApiKey(newKey) {
  currentApiKey = newKey.trim();
  aisStatus.configured = !!currentApiKey;
  aisStatus.statusText = "KEY_UPDATED";
  aisStatus.message = "Updated AISstream key. Connecting...";
  broadcastStatus();

  if (aisWs) {
    try { aisWs.close(); } catch (_) {}
  }
  connectToAisStream();
}

function connectToAisStream() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (!currentApiKey) {
    aisStatus.configured = false;
    aisStatus.connected = false;
    aisStatus.statusText = "NO_KEY_CONFIGURED";
    aisStatus.message = "AISstream API key not configured. Add AISSTREAM_API_KEY in .env to receive live global AIS.";
    broadcastStatus();
    console.log("[AIS Relay] No AISSTREAM_API_KEY configured. Running in explicit NO FIX / NO DATA state.");
    return;
  }

  try {
    aisWs = new WebSocket('wss://stream.aisstream.io/v0/stream');

    aisWs.on('open', () => {
      console.log("[AIS Relay] Connected to stream.aisstream.io successfully!");
      aisStatus.connected = true;
      aisStatus.statusText = "LIVE_STREAMING";
      aisStatus.message = "Live connection active to AISstream.io worldwide satellite/terrestrial relay.";
      broadcastStatus();

      // Subscribe to global bounding boxes (focus on Arctic, North Atlantic, Southern Ocean, & global traffic)
      const subMsg = {
        APIKey: currentApiKey,
        BoundingBoxes: [
          // Arctic & High North
          [[60.0, -180.0], [90.0, 180.0]],
          // Antarctic & Southern Ocean
          [[-90.0, -180.0], [-50.0, 180.0]],
          // Global Mid-Latitudes corridor sample
          [[50.0, -40.0], [75.0, 50.0]]
        ],
        FilterMessageTypes: ["PositionReport", "ShipStaticData"]
      };

      aisWs.send(JSON.stringify(subMsg));
    });

    aisWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        handleAisMessage(msg);
      } catch (err) {
        console.error("[AIS Relay] Error parsing incoming AIS message:", err.message);
      }
    });

    aisWs.on('close', (code, reason) => {
      aisStatus.connected = false;
      aisStatus.statusText = "DISCONNECTED";
      aisStatus.message = `AISstream connection closed (${code}: ${reason || 'Unknown'}). Reconnecting in 10s...`;
      broadcastStatus();
      console.warn(`[AIS Relay] Disconnected from AISstream.io: ${code}. Reconnecting in 10s...`);
      reconnectTimer = setTimeout(connectToAisStream, 10000);
    });

    aisWs.on('error', (err) => {
      aisStatus.connected = false;
      aisStatus.statusText = "CONNECTION_ERROR";
      aisStatus.message = `AISstream error: ${err.message}`;
      broadcastStatus();
      console.error("[AIS Relay] AISstream WS Error:", err.message);
    });
  } catch (e) {
    aisStatus.connected = false;
    aisStatus.statusText = "ERROR";
    aisStatus.message = e.message;
    broadcastStatus();
    reconnectTimer = setTimeout(connectToAisStream, 15000);
  }
}

function handleAisMessage(msg) {
  aisStatus.lastMessageTime = new Date().toISOString();
  aisStatus.totalMessagesReceived++;

  const meta = msg.MetaData || {};
  const mmsi = meta.MMSI || msg.Message?.PositionReport?.UserID || msg.Message?.ShipStaticData?.UserID;
  if (!mmsi) return;

  let existing = vesselMap.get(mmsi) || {
    mmsi: String(mmsi),
    name: meta.ShipName?.trim() || `VESSEL-${mmsi}`,
    latitude: meta.latitude,
    longitude: meta.longitude,
    cog: 0,
    sog: 0,
    heading: 0,
    shipType: "General Marine",
    lastReportTime: meta.time_utc || new Date().toISOString(),
    dataSource: "AISstream.io Live Relay"
  };

  if (meta.latitude && meta.longitude) {
    existing.latitude = parseFloat(meta.latitude.toFixed(5));
    existing.longitude = parseFloat(meta.longitude.toFixed(5));
  }

  if (msg.MessageType === 'PositionReport') {
    const pos = msg.Message.PositionReport;
    existing.latitude = parseFloat(pos.Latitude.toFixed(5));
    existing.longitude = parseFloat(pos.Longitude.toFixed(5));
    existing.cog = parseFloat(pos.Cog.toFixed(1));
    existing.sog = parseFloat(pos.Sog.toFixed(1));
    existing.heading = pos.TrueHeading === 511 ? existing.cog : pos.TrueHeading;
    existing.navStatus = pos.NavigationalStatus;
    existing.lastReportTime = meta.time_utc || new Date().toISOString();
  } else if (msg.MessageType === 'ShipStaticData') {
    const stat = msg.Message.ShipStaticData;
    if (stat.Name) existing.name = stat.Name.trim();
    if (stat.Type) existing.shipType = decodeShipType(stat.Type);
    if (stat.CallSign) existing.callSign = stat.CallSign.trim();
    if (stat.Destination) existing.destination = stat.Destination.trim();
  }

  vesselMap.set(mmsi, existing);
  aisStatus.trackedVesselsCount = vesselMap.size;

  // Broadcast single vessel delta to clients
  broadcastVesselUpdate(existing);
}

function broadcastVesselUpdate(vessel) {
  const payload = JSON.stringify({
    type: 'VESSEL_UPDATE',
    vessel
  });
  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastStatus() {
  const payload = JSON.stringify({
    type: 'STATUS_UPDATE',
    status: aisStatus
  });
  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function loadCacheFromDisk() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      if (Array.isArray(data.vessels)) {
        for (const v of data.vessels) {
          vesselMap.set(v.mmsi, v);
        }
        aisStatus.trackedVesselsCount = vesselMap.size;
        console.log(`[AIS Relay] Loaded ${vesselMap.size} vessels from local disk cache.`);
      }
    }
  } catch (e) {
    console.warn("[AIS Relay] Failed loading disk cache:", e.message);
  }
}

// Periodic disk persistence every 5 minutes
setInterval(() => {
  if (vesselMap.size > 0) {
    try {
      if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
      fs.writeFileSync(CACHE_FILE, JSON.stringify({
        savedAt: new Date().toISOString(),
        vesselsCount: vesselMap.size,
        vessels: Array.from(vesselMap.values())
      }, null, 2));
    } catch (e) {
      console.error("[AIS Relay] Cache save error:", e.message);
    }
  }
}, 5 * 60 * 1000);

export function getVessels() {
  return {
    status: aisStatus,
    count: vesselMap.size,
    vessels: Array.from(vesselMap.values())
  };
}

export function getAisStatus() {
  return aisStatus;
}
