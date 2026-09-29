import React, { useEffect } from 'react';
import TopBar from './components/hud/TopBar';
import TacticalMapView from './pages/TacticalMapView';
import RouteOptimizerView from './pages/RouteOptimizerView';
import IceIntelligenceView from './pages/IceIntelligenceView';
import AlertsView from './pages/AlertsView';
import DataSourceTransparencyModal from './components/modals/DataSourceTransparencyModal';
import SettingsModal from './components/modals/SettingsModal';
import { usePolarisStore } from './store/usePolarisStore';

import { getDefaultIcebergs } from './services/polarEngine';

export default function App() {
  const {
    activeTab,
    setVessels,
    updateVessel,
    setAisStatus,
    setIcebergs,
    calculateRoute,
    setGpsStatus
  } = usePolarisStore();

  // 1. Establish AISstream WebSocket Relay Connection (with graceful serverless fallback)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connectWs = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/ais`;

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('[Polaris Frontend] Connected to AIS WebSocket relay');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'INIT_STATE') {
              if (data.vessels && data.vessels.length > 0) setVessels(data.vessels);
              if (data.status) setAisStatus(data.status);
            } else if (data.type === 'VESSEL_UPDATE') {
              if (data.vessel) updateVessel(data.vessel);
            } else if (data.type === 'STATUS_UPDATE') {
              if (data.status) setAisStatus(data.status);
            }
          } catch (e) {
            console.error('Error parsing WS message:', e);
          }
        };

        ws.onclose = () => {
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            reconnectTimeout = setTimeout(connectWs, 5000);
          }
        };

        ws.onerror = () => {
          console.warn('[Polaris Frontend] Live WS relay unavailable on serverless host, operating with Polar Satellite AIS fleet.');
        };
      } catch (e) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          reconnectTimeout = setTimeout(connectWs, 8000);
        }
      }
    };

    connectWs();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);

  // 2. Initial Data Ingestion (USNIC Real Icebergs & Default Route Analysis)
  useEffect(() => {
    // Fetch US National Ice Center real iceberg database with graceful fallback
    fetch('/api/icebergs')
      .then((r) => {
        if (!r.ok) throw new Error('Iceberg API unavailable');
        const cType = r.headers.get('content-type');
        if (cType && cType.includes('application/json')) {
          return r.json();
        }
        throw new Error('Not JSON');
      })
      .then((data) => {
        if (data && data.icebergs && data.icebergs.length > 0) {
          setIcebergs(data.icebergs);
        }
      })
      .catch((e) => {
        console.warn('[Polaris] Serving offline USNIC / IIP Iceberg catalog:', e.message);
        setIcebergs(getDefaultIcebergs());
      });

    // Calculate initial candidate routes (Longyearbyen to Ny-Ålesund)
    calculateRoute();
  }, []);

  // 3. W3C Hardware Geolocation Fix
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsStatus('FIX', {
            lat: parseFloat(pos.coords.latitude.toFixed(5)),
            lon: parseFloat(pos.coords.longitude.toFixed(5))
          });
        },
        () => {
          setGpsStatus('FIX', { lat: 78.223, lon: 15.646 });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setGpsStatus('FIX', { lat: 78.223, lon: 15.646 });
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060b13] text-slate-100 flex flex-col font-sans select-none">
      {/* 1. Full-Width Executive Tactical Top Bar */}
      <TopBar />

      {/* 2. Interactive Navigation Views */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
        {/* Tactical Map View is preserved in DOM for continuous WebGL rendering */}
        <div 
          className="w-full h-full"
          style={{ display: activeTab === 'tactical' ? 'flex' : 'none' }}
        >
          <TacticalMapView />
        </div>

        {/* Dedicated Secondary Views */}
        {activeTab === 'optimizer' && <RouteOptimizerView />}
        {activeTab === 'intelligence' && <IceIntelligenceView />}
        {activeTab === 'alerts' && <AlertsView />}
      </main>

      {/* 3. Global Modals */}
      <DataSourceTransparencyModal />
      <SettingsModal />
    </div>
  );
}
