# ChevronLift Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        ChevronLift UI                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Header  │ │ Metrics  │ │  Wells   │ │ Schedule │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   Crew   │ │Equipment │ │  Alerts  │ │Optimizer │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer (lib/data.ts)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Wells   │ │  Crews   │ │Equipment │ │ Schedules│           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
app/
├── layout.tsx          # Root layout (Inter + JetBrains Mono fonts)
└── page.tsx            # Main dashboard (orchestrates all panels)
    ├── Header          # Nav + system status + clock
    ├── MetricsBar      # KPIs: wells, progress, stages, crews, equipment
    ├── WellsOverview   # Left sidebar: well list with status
    ├── ScheduleGantt   # Center: Gantt chart of frac stages
    │   └── Optimizer   # AI Schedule Optimizer overlay
    ├── AlertsPanel     # Right sidebar: alerts feed
    ├── CrewPanel       # Right sidebar: crew status
    └── EquipmentPanel  # Right sidebar: equipment utilization
```

## Data Models

### Well
```typescript
interface Well {
  id: string;
  name: string;
  pad: string;
  status: 'active' | 'standby' | 'scheduled' | 'complete';
  currentStage: number;
  totalStages: number;
  depth: string;
  location: string;
  county: string;
  state: string;
}
```

### Crew
```typescript
interface Crew {
  id: string;
  name: string;
  lead: string;
  members: number;
  status: 'on-site' | 'in-transit' | 'off-duty';
  certifications: string[];
  assignedWell?: string;
  shiftHours: number;
}
```

### Equipment
```typescript
interface Equipment {
  id: string;
  name: string;
  type: 'pump' | 'blender' | 'hydration' | 'data-van' | 'sand-king' | 'chemical';
  status: 'in-use' | 'available' | 'maintenance' | 'in-transit';
  location: string;
  utilization: number;
  maintenanceDue?: string;
}
```

### Stage
```typescript
interface Stage {
  id: string;
  wellId: string;
  stageNumber: number;
  status: 'complete' | 'in-progress' | 'scheduled' | 'delayed';
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
}
```

### Alert
```typescript
interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  category: 'equipment' | 'crew' | 'schedule' | 'weather' | 'safety';
}
```

## Styling System

### Color Palette (Dark Theme)
```css
--bg-primary: #0a0a0f       /* Main background */
--bg-secondary: #12121a     /* Card backgrounds */
--bg-tertiary: #1a1a24      /* Hover states */
--border: #2a2a3a           /* Borders */
--text-primary: #ffffff     /* Primary text */
--text-secondary: #a0a0b0   /* Secondary text */
--text-muted: #606070       /* Muted text */

/* Status Colors */
--active: #22c55e           /* Green - active/complete */
--warning: #f59e0b          /* Amber - warning/in-progress */
--critical: #ef4444         /* Red - critical/delayed */
--info: #3b82f6             /* Blue - info/scheduled */
```

### Typography
- **Headers**: Inter (system font fallback)
- **Data/Numbers**: JetBrains Mono (monospace for alignment)

## Production Roadmap

### Phase 1: Backend Foundation
1. PostgreSQL database setup
2. REST API for CRUD operations
3. Authentication (JWT + RBAC)
4. WebSocket server for real-time updates

### Phase 2: Real Data Integration
1. SCADA integration adapters
2. Equipment telematics connectors
3. Weather API integration
4. HR system sync for crew data

### Phase 3: AI Optimizer
1. Constraint satisfaction solver (OR-Tools)
2. Historical data training pipeline
3. What-if scenario engine
4. Recommendation explanation system

### Phase 4: Mobile & Alerts
1. React Native mobile app
2. Push notification service
3. SMS gateway integration
4. PagerDuty/OpsGenie integration

## API Design (Future)

```
GET    /api/wells                 # List all wells
GET    /api/wells/:id             # Get well details
GET    /api/wells/:id/stages      # Get stages for well
POST   /api/wells/:id/stages      # Create new stage

GET    /api/crews                 # List all crews
PATCH  /api/crews/:id             # Update crew status
POST   /api/crews/:id/assign      # Assign crew to well

GET    /api/equipment             # List all equipment
PATCH  /api/equipment/:id         # Update equipment status

GET    /api/alerts                # Get active alerts
POST   /api/alerts/:id/ack        # Acknowledge alert

POST   /api/optimizer/run         # Run schedule optimization
GET    /api/optimizer/suggestions # Get current suggestions
```

## Security Considerations

1. **Authentication**: OAuth 2.0 / SAML for enterprise SSO
2. **Authorization**: Role-based (Operator, Supervisor, Manager, Admin)
3. **Data Encryption**: TLS 1.3 in transit, AES-256 at rest
4. **Audit Logging**: All state changes logged with user/timestamp
5. **API Security**: Rate limiting, request signing, IP allowlists

---

*Architecture document for ChevronLift FracFlow Command Center*
