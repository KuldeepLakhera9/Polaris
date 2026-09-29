import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePolarisStore } from '../store/usePolarisStore';
import { getDistanceAndBearing } from '../utils/geo';

export default function MapLibreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const vesselMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const icebergMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const ownShipMarkerRef = useRef<maplibregl.Marker | null>(null);

  const {
    mapCenter,
    setMapCenter,
    setCursor,
    ownShip,
    vessels,
    icebergs,
    selectedVessel,
    selectVessel,
    selectedIceberg,
    selectIceberg,
    selectedIcebergDrift,
    setIcebergDrift,
    setIsLoadingDrift,
    layers,
    routePlan,
    selectedRouteId,
    mapFlyToTarget,
    clearFlyTo,
    isSidebarCollapsed
  } = usePolarisStore();

  // Resize map when sidebar collapses/expands
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed]);

  // Smooth camera flyTo on preset or target change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapFlyToTarget) return;

    map.flyTo({
      center: [mapFlyToTarget.lon, mapFlyToTarget.lat],
      zoom: mapFlyToTarget.zoom !== undefined ? mapFlyToTarget.zoom : map.getZoom(),
      bearing: mapFlyToTarget.bearing !== undefined ? mapFlyToTarget.bearing : 0,
      pitch: mapFlyToTarget.pitch !== undefined ? mapFlyToTarget.pitch : 0,
      speed: 1.2,
      curve: 1.4,
      essential: true
    });

    clearFlyTo();
  }, [mapFlyToTarget]);


  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
          },
          'nasa-sea-ice': {
            type: 'raster',
            tiles: [
              'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/AMSRU2_Sea_Ice_Concentration_12km/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png'
            ],
            tileSize: 256,
            maxzoom: 6,
            attribution: 'NASA GIBS / JAXA AMSR2 Sea Ice'
          },
          'nasa-truecolor': {
            type: 'raster',
            tiles: [
              'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'
            ],
            tileSize: 256,
            maxzoom: 9,
            attribution: 'NASA GIBS / Suomi NPP VIIRS'
          }
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 19
          },
          {
            id: 'sea-ice-layer',
            type: 'raster',
            source: 'nasa-sea-ice',
            paint: {
              'raster-opacity': 0.65
            },
            layout: {
              visibility: 'visible'
            }
          },
          {
            id: 'truecolor-layer',
            type: 'raster',
            source: 'nasa-truecolor',
            paint: {
              'raster-opacity': 0.7
            },
            layout: {
              visibility: 'none'
            }
          }
        ]
      },
      center: [mapCenter.lon, mapCenter.lat],
      zoom: mapCenter.zoom,
      bearing: mapCenter.bearing,
      pitch: mapCenter.pitch,
      attributionControl: false
    });

    // Add scale bar control at bottom-right
    const scale = new maplibregl.ScaleControl({
      maxWidth: 120,
      unit: 'metric'
    });
    map.addControl(scale, 'bottom-right');

    // Add attribution at bottom-right collapsed
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    // Track cursor movements
    map.on('mousemove', (e) => {
      const lat = parseFloat(e.lngLat.lat.toFixed(5));
      const lon = parseFloat(e.lngLat.lng.toFixed(5));

      const curOwnShip = usePolarisStore.getState().ownShip;
      let distBearing = null;
      if (curOwnShip) {
        distBearing = getDistanceAndBearing(curOwnShip.latitude, curOwnShip.longitude, lat, lon);
      }
      setCursor({ lat, lon }, distBearing);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenter({
        lat: parseFloat(center.lat.toFixed(4)),
        lon: parseFloat(center.lng.toFixed(4)),
        zoom: parseFloat(map.getZoom().toFixed(2)),
        bearing: Math.round(map.getBearing()),
        pitch: Math.round(map.getPitch())
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('sea-ice-layer')) {
      map.setLayoutProperty('sea-ice-layer', 'visibility', layers.iceConcentration ? 'visible' : 'none');
    }
    if (map.getLayer('truecolor-layer')) {
      map.setLayoutProperty('truecolor-layer', 'visibility', layers.weatherClouds ? 'visible' : 'none');
    }
  }, [layers.iceConcentration, layers.weatherClouds]);

  // Render Own-Ship Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ownShip) return;

    if (ownShipMarkerRef.current) {
      ownShipMarkerRef.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'own-ship-marker cursor-pointer select-none';
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <!-- Pulsing radar rings -->
        <div class="absolute -inset-3 rounded-full border border-amber-400/40 animate-ping opacity-75"></div>
        <div class="absolute -inset-2 rounded-full border border-amber-400/60"></div>
        <!-- Own Ship Chevron Arrow -->
        <div class="relative z-10 w-9 h-9 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" style="transform: rotate(${ownShip.heading || ownShip.cog || 0}deg);">
          <svg viewBox="0 0 24 24" class="w-8 h-8 fill-amber-500 stroke-white stroke-[1.5]">
            <path d="M12 2L4 20L12 16L20 20L12 2Z" />
          </svg>
        </div>
        <!-- Vessel Callout Tag -->
        <div class="absolute top-10 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/90 border border-amber-400/60 text-[10px] font-mono text-amber-300 font-bold shadow-lg pointer-events-none">
          POLARIS-01
        </div>
      </div>
    `;

    el.onclick = () => {
      selectVessel(ownShip);
    };

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([ownShip.longitude, ownShip.latitude])
      .addTo(map);

    ownShipMarkerRef.current = marker;
  }, [ownShip]);

  // Render Live AIS Vessel Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!layers.aisVessels) {
      vesselMarkersRef.current.forEach((m) => m.remove());
      vesselMarkersRef.current.clear();
      return;
    }

    const currentMmsis = new Set<string>();

    for (const ship of vessels) {
      // Don't duplicate own ship
      if (ownShip && ship.mmsi === ownShip.mmsi) continue;

      currentMmsis.add(ship.mmsi);
      const isSelected = selectedVessel?.mmsi === ship.mmsi;

      let marker = vesselMarkersRef.current.get(ship.mmsi);

      if (!marker) {
        const el = document.createElement('div');
        el.className = 'ais-ship-marker cursor-pointer select-none';
        
        // Color code based on ship type
        let colorClass = 'fill-sky-400 stroke-slate-900';
        if (ship.shipType?.includes('Tanker')) colorClass = 'fill-red-400 stroke-slate-950';
        else if (ship.shipType?.includes('Fishing')) colorClass = 'fill-emerald-400 stroke-slate-950';
        else if (ship.shipType?.includes('Passenger')) colorClass = 'fill-purple-400 stroke-slate-950';

        el.innerHTML = `
          <div class="group relative flex items-center justify-center">
            <div class="w-6 h-6 flex items-center justify-center transform transition-transform filter drop-shadow-[0_0_4px_rgba(56,189,248,0.7)]" style="transform: rotate(${ship.heading || ship.cog || 0}deg);">
              <svg viewBox="0 0 24 24" class="w-5 h-5 ${colorClass} stroke-[1.2]">
                <path d="M12 2L5 20L12 16.5L19 20L12 2Z" />
              </svg>
            </div>
            <!-- Hover Tooltip -->
            <div class="hidden group-hover:block absolute -top-8 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/95 border border-sky-500/50 text-[10px] font-mono text-sky-200 z-30 pointer-events-none">
              ${ship.name} (${ship.sog.toFixed(1)} kn)
            </div>
          </div>
        `;

        el.onclick = () => {
          selectVessel(ship);
        };

        marker = new maplibregl.Marker({ element: el })
          .setLngLat([ship.longitude, ship.latitude])
          .addTo(map);

        vesselMarkersRef.current.set(ship.mmsi, marker);
      } else {
        marker.setLngLat([ship.longitude, ship.latitude]);
        const inner = marker.getElement().querySelector('.transform') as HTMLElement;
        if (inner) {
          inner.style.transform = `rotate(${ship.heading || ship.cog || 0}deg)`;
        }
      }
    }

    // Cleanup vanished markers
    vesselMarkersRef.current.forEach((marker, mmsi) => {
      if (!currentMmsis.has(mmsi)) {
        marker.remove();
        vesselMarkersRef.current.delete(mmsi);
      }
    });
  }, [vessels, layers.aisVessels, selectedVessel, ownShip]);

  // Render US NIC Iceberg Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!layers.icebergs) {
      icebergMarkersRef.current.forEach((m) => m.remove());
      icebergMarkersRef.current.clear();
      return;
    }

    const currentBergIds = new Set<string>();

    for (const berg of icebergs) {
      currentBergIds.add(berg.id);
      let marker = icebergMarkersRef.current.get(berg.id);

      if (!marker) {
        const el = document.createElement('div');
        el.className = 'iceberg-marker cursor-pointer select-none';
        const isSelected = selectedIceberg?.id === berg.id;

        el.innerHTML = `
          <div class="group relative flex items-center justify-center">
            <div class="w-6 h-6 flex items-center justify-center rounded-sm bg-cyan-950/80 border ${isSelected ? 'border-cyan-300 ring-2 ring-cyan-400' : 'border-cyan-500/80'} shadow-md transform hover:scale-125 transition-all">
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-cyan-300 stroke-cyan-100 stroke-1">
                <polygon points="12 2, 22 12, 12 22, 2 12" />
              </svg>
            </div>
            <!-- Iceberg Label -->
            <div class="absolute -bottom-5 whitespace-nowrap px-1 py-0.2 rounded bg-slate-950/90 text-[9px] font-mono text-cyan-300 border border-cyan-800 pointer-events-none">
              ${berg.id}
            </div>
          </div>
        `;

        el.onclick = async () => {
          selectIceberg(berg);
          // Request real 24h dead-reckoning drift projection
          setIsLoadingDrift(true);
          try {
            const res = await fetch('/api/iceberg-drift', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ iceberg: berg })
            });
            if (res.ok) {
              const drift = await res.json();
              setIcebergDrift(drift);
            }
          } catch (e) {
            console.error('Failed to calculate iceberg drift:', e);
          } finally {
            setIsLoadingDrift(false);
          }
        };

        marker = new maplibregl.Marker({ element: el })
          .setLngLat([berg.longitude, berg.latitude])
          .addTo(map);

        icebergMarkersRef.current.set(berg.id, marker);
      }
    }

    icebergMarkersRef.current.forEach((marker, id) => {
      if (!currentBergIds.has(id)) {
        marker.remove();
        icebergMarkersRef.current.delete(id);
      }
    });
  }, [icebergs, layers.icebergs, selectedIceberg]);

  // Render Routes and Drift Projections on map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Remove existing route layers/sources if any
    const cleanupLayers = ['route-b-glow', 'route-b-line', 'route-a-line', 'route-c-line', 'drift-projection-line', 'drift-projection-points'];
    for (const lId of cleanupLayers) {
      if (map.getLayer(lId)) map.removeLayer(lId);
    }
    const cleanupSources = ['route-b-src', 'route-a-src', 'route-c-src', 'drift-src', 'drift-pts-src'];
    for (const sId of cleanupSources) {
      if (map.getSource(sId)) map.removeSource(sId);
    }

    // Add candidate routes if available
    if (layers.routes && routePlan && routePlan.routes) {
      for (const r of routePlan.routes) {
        const coords = r.waypoints.map(w => [w.longitude, w.latitude]);
        const sId = `route-${r.id.toLowerCase()}-src`;
        
        map.addSource(sId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coords
            },
            properties: { id: r.id }
          }
        });

        if (r.id === 'B') {
          // Glow layer for optimal route
          map.addLayer({
            id: 'route-b-glow',
            type: 'line',
            source: sId,
            paint: {
              'line-color': '#38bdf8',
              'line-width': 8,
              'line-opacity': 0.35,
              'line-blur': 4
            }
          });
          map.addLayer({
            id: 'route-b-line',
            type: 'line',
            source: sId,
            paint: {
              'line-color': '#0284c7',
              'line-width': 3,
              'line-dasharray': [2, 1]
            }
          });
        } else {
          map.addLayer({
            id: `route-${r.id.toLowerCase()}-line`,
            type: 'line',
            source: sId,
            paint: {
              'line-color': r.id === 'A' ? '#f43f5e' : '#94a3b8',
              'line-width': 2,
              'line-dasharray': [3, 2],
              'line-opacity': 0.7
            }
          });
        }
      }
    }

    // Add Iceberg 24h drift vector if selected
    if (selectedIcebergDrift && selectedIcebergDrift.forecast24h) {
      const lineCoords = [
        [selectedIcebergDrift.initialPosition.longitude, selectedIcebergDrift.initialPosition.latitude],
        ...selectedIcebergDrift.forecast24h.map(f => [f.longitude, f.latitude])
      ];

      map.addSource('drift-src', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: lineCoords },
          properties: {}
        }
      });

      map.addLayer({
        id: 'drift-projection-line',
        type: 'line',
        source: 'drift-src',
        paint: {
          'line-color': '#22d3ee',
          'line-width': 2.5,
          'line-dasharray': [2, 2]
        }
      });

      // Point features for 6h, 12h, 18h, 24h steps
      const ptFeatures = selectedIcebergDrift.forecast24h.map(f => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [f.longitude, f.latitude] },
        properties: { hours: `${f.hoursForward}h`, radius: f.uncertaintyRadiusNm }
      }));

      map.addSource('drift-pts-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: ptFeatures }
      });

      map.addLayer({
        id: 'drift-projection-points',
        type: 'circle',
        source: 'drift-pts-src',
        paint: {
          'circle-radius': 5,
          'circle-color': '#06b6d4',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff'
        }
      });
    }
  }, [layers.routes, routePlan, selectedRouteId, selectedIcebergDrift]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-[#070c14]" />
    </div>
  );
}
