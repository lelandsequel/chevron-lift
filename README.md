# C&L FracOps - FracFlow Command Center

Real-time completions & logistics cockpit for multi-well frac operations.

![C&L FracOps](https://img.shields.io/badge/Status-MVP-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## Overview

C&L FracOps is an operations command center for managing hydraulic fracturing (frac) operations across multiple wells. It provides:

- **Real-time well status monitoring** - Track active, standby, and scheduled wells
- **Gantt-style stage scheduling** - Visual timeline of frac stages across wells
- **Crew management** - Track crew assignments, certifications, and shift status
- **Equipment tracking** - Monitor pumps, blenders, and other frac equipment
- **AI Schedule Optimizer** - Identify conflicts and optimize scheduling for efficiency
- **Alerts system** - Critical notifications for equipment, crews, and operations

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Demo Data

The MVP includes realistic demo data for:
- **6 wells** in the Permian Basin (Reeves, Midland, Loving, Ward, Eddy, Upton counties)
- **5 crews** with certifications and shift tracking
- **10 equipment units** (pumps, blenders, hydration, data vans, sand kings, chemical units)
- **Stage schedules** with conflicts and delays for optimizer demo

## Features

### Dashboard
- Key metrics: active wells, progress, stages completed, crew status, equipment utilization
- Real-time clock and system status

### Schedule View
- Interactive Gantt chart showing frac stages
- Filter by well
- Visual status indicators (complete, in-progress, scheduled, delayed)
- Current time marker

### AI Schedule Optimizer
The key "sell" feature:
1. Identifies scheduling conflicts (crew overlaps, equipment shortages, maintenance conflicts)
2. Runs optimization algorithm (simulated)
3. Shows before/after comparison
4. Displays time and cost savings ("**14 hours saved this week**")

### Alerts
- Critical, warning, and info alerts
- Equipment maintenance due
- Crew shift limits approaching
- Weather advisories
- Scheduling conflicts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Language**: TypeScript
- **State**: React useState (no external state management needed for MVP)
- **Data**: Static demo data (no backend)

## What Would Make It "Real"

### Backend Requirements
1. **Database**: PostgreSQL or similar for wells, crews, equipment, stages
2. **Real-time updates**: WebSocket connections for live data from field
3. **Authentication**: Role-based access (operators, supervisors, managers)
4. **API integrations**:
   - SCADA systems for real-time well data
   - Fleet management for equipment tracking
   - HR systems for crew scheduling
   - Weather APIs for operational planning

### AI Optimizer (Production Version)
1. **Constraint solver**: Use OR-Tools or similar for actual optimization
2. **ML model**: Train on historical data for accurate time predictions
3. **What-if scenarios**: Allow manual adjustments with impact analysis

### Additional Features
1. **Mobile app**: Field crews need mobile access
2. **Reporting**: Export to PDF, integrate with BI tools
3. **Audit trail**: Track all changes for compliance
4. **Notifications**: Push/SMS alerts for critical issues
5. **Integration with accounting**: Track costs per stage/well

### Data Integrations
- **WITSML** for drilling data
- **EDI** for vendor/supplier coordination
- **GIS** for location/mapping
- **ERP** systems (SAP, Oracle) for financials

## Project Structure

```
src/
├── app/
│   ├── globals.css     # Global styles + Tailwind theme
│   ├── layout.tsx      # Root layout with fonts
│   └── page.tsx        # Main dashboard page
├── components/
│   ├── Header.tsx      # Navigation header
│   ├── MetricsBar.tsx  # KPI summary bar
│   ├── WellsOverview.tsx
│   ├── ScheduleGantt.tsx
│   ├── CrewPanel.tsx
│   ├── EquipmentPanel.tsx
│   ├── AlertsPanel.tsx
│   └── Optimizer.tsx   # AI Schedule Optimizer
└── lib/
    └── data.ts         # Demo data and types
```

## License

Proprietary - JourdanLabs

---

Built for enterprise frac operations. Not a hackathon project.
