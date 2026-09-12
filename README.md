# ✦ POLARIS — AI Polar Navigation Co-Pilot

> **SIH-2026 Problem Statement 26059**: *"AI-Enabled Antarctic Sea-Ice, Iceberg Trajectory, and Navigation Decision Support System"*

**Polaris** is an autonomous AI polar navigation decision-support web application designed for research vessels and icebreakers navigating the treacherous waters of the Southern Ocean and Antarctic coastline.

---

## 🌟 Key Features

- **Mission Control UI**: Dark, polar-themed HUD with glowing cyan telemetry, glassmorphism panels, and tactical navigation aids.
- **Interactive Antarctic Polar Map (Leaflet)**:
  - High-contrast CartoDB Dark Matter tile layer.
  - Multi-tier dynamic sea-ice risk zones (Red = Severe Pack/Icebergs, Amber = Moving Floes, Green = Open Leads).
  - Custom SVG markers for vessel origin, destination stations (Bharati, Maitri, McMurdo, Davis), and active icebergs.
  - Interactive iceberg drift popups with 24-hour hydrodynamic drift projections and confidence ratings.
- **30-Second AI Route Optimization Demo**:
  - Sequential, staggered AI analysis overlay with checkmark animations.
  - Generates optimal Route B that actively avoids high-risk pack ice and iceberg collision perimeters.
  - Dynamic risk recalculation across Sea Ice, Icebergs, Weather, and Vessel Strain factors.
  - Multi-route trade-off analysis (Route A: direct/high danger, Route B: optimal/recommended, Route C: conservative detour).
- **Ice Intelligence Tab**:
  - Synthetic Aperture Radar (SAR) concentration telemetry.
  - 24-hour diurnal ice motion and hazard index charts (Recharts).
  - Iceberg Trajectory Matrix with coordinates, drift vectors, and dimensions.
- **Route Planner Tab**:
  - Interactive *Safety ↔ Fuel Economy* priority slider with real-time recalculation of transit parameters.
  - Waypoint coordinate breakdown table.
- **Alerts & Sensor Telemetry Tab**:
  - Filterable situational awareness alert stream.
  - Live vessel hardware sensor telemetry (X-band radar, bow hull strain, multibeam sonar).

---

## 🚀 Quickstart

### Prerequisites
- Node.js (v18 or higher, tested on Node v24)
- npm (v9 or higher)

### 1. Installation
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build (Vercel / Netlify)
```bash
npm run build
```
The compiled static assets will be output to the `dist/` directory, ready to deploy.

---

## 🧭 30-Second Hackathon Demo Flow

1. Open the **Dashboard** tab.
2. Under **Voyage Planner** in the left sidebar:
   - Origin: **Bharati Research Station**
   - Destination: **Maitri Research Station**
   - Vessel: **Research Vessel Polaris-01**
3. Click the prominent **`[GENERATE ROUTE →]`** button.
4. Watch the multi-step AI analysis sequence:
   - `✓ Loading sea-ice forecast`
   - `✓ Tracking icebergs`
   - `✓ Analyzing ocean conditions`
   - `✓ Calculating navigation risk`
   - `✓ ROUTE GENERATED`
5. Observe:
   - Route B draws on the map, skirting safely north of the red high-risk iceberg zone.
   - The Risk Panel score updates smoothly.
   - The Route Analysis panel opens with Route B highlighted and Routes A & C clickable for comparison.
   - A new proximity alert appears in the Navigation Alerts panel.
6. Click any iceberg icon (e.g. `🧊 Berg #A17`) on the map to inspect its 24h drift projection.
7. Switch to the **Ice Intelligence** and **Route Planner** tabs to demonstrate SAR modeling and the Safety vs Fuel priority slider.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla CSS animations
- **Mapping**: Leaflet + react-leaflet with CartoDB Dark Matter tiles
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Data Layer**: High-fidelity simulated Antarctic datasets (`icebergs.js`, `routes.js`, `forecast.js`, `vessels.js`)

---

## 📄 Note on Data

*All navigational data, satellite radar imagery metrics, and iceberg coordinates displayed in this prototype are simulated demo models developed for the SIH-2026 demonstration.*
