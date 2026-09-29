import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initAisRelay, getVessels, getAisStatus, updateApiKey } from './services/aisRelay.js';
import { getIcebergs } from './services/icebergService.js';
import { getMetOceanData } from './services/weatherService.js';
import { calculateIcebergDrift } from './services/driftModel.js';
import { generateCandidateRoutes } from './services/routeEngine.js';
import { getSarStatus } from './services/sarService.js';
import { getIceConcentrationMetadata } from './services/iceConcentrationService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Server creation for Express + WebSockets
const server = http.createServer(app);

// 1. Initialize AISstream WebSocket Relay
initAisRelay(server);

// --- REST API ENDPOINTS ---

// Health & Data Integrity Check
app.get('/api/health', async (req, res) => {
  const ais = getAisStatus();
  const sar = getSarStatus();

  res.json({
    status: 'ONLINE',
    service: 'Polaris Polar Navigation Co-Pilot API',
    version: '2.0.0-production',
    timestamp: new Date().toISOString(),
    dataSources: {
      basemap: {
        provider: 'Esri World Imagery',
        type: 'Public Satellite Tiles',
        status: 'OPERATIONAL'
      },
      aisRelay: {
        provider: 'AISstream.io',
        configured: ais.configured,
        connected: ais.connected,
        status: ais.statusText,
        trackedVessels: ais.trackedVesselsCount,
        message: ais.message
      },
      icebergs: {
        provider: 'US National Ice Center (NIC) / NOAA ASCAT',
        status: 'OPERATIONAL',
        type: 'Near Real-Time Polar Iceberg Catalog'
      },
      iceConcentration: {
        provider: 'NASA GIBS / NSIDC AMSR2',
        status: 'OPERATIONAL',
        type: 'Daily 12km Microwave Concentration'
      },
      metocean: {
        provider: 'Open-Meteo Marine & Weather API',
        status: 'OPERATIONAL',
        type: 'Live Wave Height, Direction, Wind & Pressure'
      },
      sarRadar: {
        provider: 'Copernicus Sentinel-1 / Sentinel Hub',
        configured: sar.isConfigured,
        status: sar.status,
        revisitCadence: sar.revisitCadence
      },
      astronomy: {
        engine: 'SunCalc.js Deterministic Astronomy',
        status: 'LOCAL_OPERATIONAL'
      },
      gnssGeolocation: {
        engine: 'W3C Geolocation API / Device Fix',
        status: 'CLIENT_ATTACHED'
      }
    }
  });
});

// Live Vessels
app.get('/api/ships', (req, res) => {
  res.json(getVessels());
});

// Icebergs from USNIC
app.get('/api/icebergs', async (req, res) => {
  try {
    const data = await getIcebergs();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: "ERROR" });
  }
});

// Iceberg Dead-Reckoning Drift (§6)
app.post('/api/iceberg-drift', async (req, res) => {
  try {
    const { iceberg } = req.body;
    if (!iceberg || iceberg.latitude === undefined || iceberg.longitude === undefined) {
      return res.status(400).json({ error: "Missing valid iceberg coordinates in body" });
    }
    const driftResult = await calculateIcebergDrift(iceberg);
    res.json(driftResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MetOcean Weather & Waves
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Query parameters 'lat' and 'lon' are required" });
  }
  const data = await getMetOceanData(parseFloat(lat), parseFloat(lon));
  res.json(data);
});

// Sea Ice Concentration Metadata & Tiles
app.get('/api/ice-concentration', (req, res) => {
  res.json(getIceConcentrationMetadata());
});

// Route Generation with Weighted-Risk Model (§5)
app.post('/api/route', async (req, res) => {
  try {
    const { origin, destination, vesselClass } = req.body;
    const routes = await generateCandidateRoutes(origin, destination, vesselClass);
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sentinel-1 SAR Status & Metadata (§9)
app.get('/api/sar/status', (req, res) => {
  res.json(getSarStatus());
});

// Dynamic AIS Key Configuration
app.post('/api/config/ais-key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: "apiKey is required in JSON body" });
  }
  updateApiKey(apiKey);
  res.json({ success: true, message: "AISstream API key updated. Reconnecting stream." });
});

server.listen(PORT, () => {
  console.log(`[POLARIS Backend] Server running on http://localhost:${PORT}`);
  console.log(`[POLARIS Backend] WebSocket AIS relay available on ws://localhost:${PORT}/ws/ais`);
});
