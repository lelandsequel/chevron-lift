// Demo data for C&L FracOps - FracFlow Command Center
// Realistic Permian Basin style wells and operations

export interface Well {
  id: string;
  name: string;
  pad: string;
  status: 'active' | 'standby' | 'complete' | 'scheduled';
  totalStages: number;
  completedStages: number;
  currentStage: number | null;
  location: string;
  depth: number;
  lateralLength: number;
}

export interface Stage {
  id: string;
  wellId: string;
  stageNumber: number;
  status: 'complete' | 'in-progress' | 'scheduled' | 'delayed';
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  crewId: string;
  equipmentIds: string[];
  pumpRate?: number;
  pressure?: number;
  proppant?: number;
}

export interface Crew {
  id: string;
  name: string;
  lead: string;
  members: number;
  status: 'on-site' | 'in-transit' | 'off-duty' | 'maintenance';
  currentWellId: string | null;
  certifications: string[];
  hoursWorked: number;
  shiftsRemaining: number;
}

export interface Equipment {
  id: string;
  type: 'pump' | 'blender' | 'hydration' | 'data-van' | 'sand-king' | 'chemical';
  name: string;
  status: 'operational' | 'in-use' | 'maintenance' | 'down';
  currentWellId: string | null;
  lastMaintenance: Date;
  nextMaintenance: Date;
  utilization: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  wellId?: string;
  crewId?: string;
  equipmentId?: string;
  acknowledged: boolean;
}

export interface ScheduleConflict {
  id: string;
  type: 'crew-overlap' | 'equipment-shortage' | 'maintenance-conflict' | 'weather-delay';
  description: string;
  affectedWells: string[];
  affectedStages: string[];
  severity: 'low' | 'medium' | 'high';
  suggestedResolution: string;
  potentialDelay: number; // hours
}

// Helper to create dates relative to now
const now = new Date();
const hour = (h: number) => {
  const d = new Date(now);
  d.setHours(now.getHours() + h, 0, 0, 0);
  return d;
};

const day = (d: number, h = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() + d);
  date.setHours(h, 0, 0, 0);
  return date;
};

export const wells: Well[] = [
  {
    id: 'well-1',
    name: 'Pecos Valley 14-3H',
    pad: 'Rattlesnake Pad A',
    status: 'active',
    totalStages: 42,
    completedStages: 28,
    currentStage: 29,
    location: 'Reeves County, TX',
    depth: 10450,
    lateralLength: 10200,
  },
  {
    id: 'well-2',
    name: 'Midland Basin 22-1H',
    pad: 'Rattlesnake Pad A',
    status: 'active',
    totalStages: 38,
    completedStages: 12,
    currentStage: 13,
    location: 'Midland County, TX',
    depth: 9800,
    lateralLength: 9500,
  },
  {
    id: 'well-3',
    name: 'Delaware Draw 7-2H',
    pad: 'Coyote Ridge B',
    status: 'standby',
    totalStages: 45,
    completedStages: 45,
    currentStage: null,
    location: 'Loving County, TX',
    depth: 11200,
    lateralLength: 10800,
  },
  {
    id: 'well-4',
    name: 'Wolfcamp State 33-5H',
    pad: 'Coyote Ridge B',
    status: 'scheduled',
    totalStages: 40,
    completedStages: 0,
    currentStage: null,
    location: 'Ward County, TX',
    depth: 10100,
    lateralLength: 9900,
  },
  {
    id: 'well-5',
    name: 'Bone Spring 18-4H',
    pad: 'Mesa Verde C',
    status: 'active',
    totalStages: 36,
    completedStages: 8,
    currentStage: 9,
    location: 'Eddy County, NM',
    depth: 9600,
    lateralLength: 8800,
  },
  {
    id: 'well-6',
    name: 'Spraberry Deep 41-2H',
    pad: 'Mesa Verde C',
    status: 'scheduled',
    totalStages: 44,
    completedStages: 0,
    currentStage: null,
    location: 'Upton County, TX',
    depth: 10800,
    lateralLength: 10500,
  },
];

export const crews: Crew[] = [
  {
    id: 'crew-1',
    name: 'Alpha Team',
    lead: 'Mike Rodriguez',
    members: 12,
    status: 'on-site',
    currentWellId: 'well-1',
    certifications: ['H2S', 'Well Control', 'Pressure Pumping'],
    hoursWorked: 847,
    shiftsRemaining: 3,
  },
  {
    id: 'crew-2',
    name: 'Bravo Team',
    lead: 'Sarah Chen',
    members: 11,
    status: 'on-site',
    currentWellId: 'well-2',
    certifications: ['H2S', 'Well Control', 'Pressure Pumping', 'Coiled Tubing'],
    hoursWorked: 623,
    shiftsRemaining: 5,
  },
  {
    id: 'crew-3',
    name: 'Charlie Team',
    lead: 'James Walker',
    members: 10,
    status: 'in-transit',
    currentWellId: null,
    certifications: ['H2S', 'Well Control', 'Pressure Pumping'],
    hoursWorked: 412,
    shiftsRemaining: 7,
  },
  {
    id: 'crew-4',
    name: 'Delta Team',
    lead: 'Maria Santos',
    members: 12,
    status: 'on-site',
    currentWellId: 'well-5',
    certifications: ['H2S', 'Well Control', 'Pressure Pumping', 'Wireline'],
    hoursWorked: 756,
    shiftsRemaining: 4,
  },
  {
    id: 'crew-5',
    name: 'Echo Team',
    lead: 'Tom Bradley',
    members: 11,
    status: 'off-duty',
    currentWellId: null,
    certifications: ['H2S', 'Well Control', 'Pressure Pumping'],
    hoursWorked: 892,
    shiftsRemaining: 1,
  },
];

export const equipment: Equipment[] = [
  {
    id: 'eq-1',
    type: 'pump',
    name: 'Quintuplex Pump Unit #1',
    status: 'in-use',
    currentWellId: 'well-1',
    lastMaintenance: day(-5),
    nextMaintenance: day(10),
    utilization: 87,
  },
  {
    id: 'eq-2',
    type: 'pump',
    name: 'Quintuplex Pump Unit #2',
    status: 'in-use',
    currentWellId: 'well-2',
    lastMaintenance: day(-8),
    nextMaintenance: day(7),
    utilization: 92,
  },
  {
    id: 'eq-3',
    type: 'pump',
    name: 'Quintuplex Pump Unit #3',
    status: 'operational',
    currentWellId: null,
    lastMaintenance: day(-3),
    nextMaintenance: day(12),
    utilization: 45,
  },
  {
    id: 'eq-4',
    type: 'blender',
    name: 'Blender Unit #1',
    status: 'in-use',
    currentWellId: 'well-1',
    lastMaintenance: day(-12),
    nextMaintenance: day(3),
    utilization: 78,
  },
  {
    id: 'eq-5',
    type: 'blender',
    name: 'Blender Unit #2',
    status: 'in-use',
    currentWellId: 'well-5',
    lastMaintenance: day(-6),
    nextMaintenance: day(9),
    utilization: 81,
  },
  {
    id: 'eq-6',
    type: 'hydration',
    name: 'Hydration Unit #1',
    status: 'in-use',
    currentWellId: 'well-2',
    lastMaintenance: day(-15),
    nextMaintenance: day(0),
    utilization: 95,
  },
  {
    id: 'eq-7',
    type: 'data-van',
    name: 'Data Acquisition Van #1',
    status: 'in-use',
    currentWellId: 'well-1',
    lastMaintenance: day(-20),
    nextMaintenance: day(10),
    utilization: 88,
  },
  {
    id: 'eq-8',
    type: 'sand-king',
    name: 'Sand King Unit #1',
    status: 'in-use',
    currentWellId: 'well-1',
    lastMaintenance: day(-7),
    nextMaintenance: day(8),
    utilization: 84,
  },
  {
    id: 'eq-9',
    type: 'sand-king',
    name: 'Sand King Unit #2',
    status: 'maintenance',
    currentWellId: null,
    lastMaintenance: day(-1),
    nextMaintenance: day(14),
    utilization: 0,
  },
  {
    id: 'eq-10',
    type: 'chemical',
    name: 'Chemical Add Unit #1',
    status: 'in-use',
    currentWellId: 'well-5',
    lastMaintenance: day(-4),
    nextMaintenance: day(11),
    utilization: 72,
  },
];

// Generate realistic stage schedule with some conflicts
function generateStages(): Stage[] {
  const stages: Stage[] = [];
  
  // Pecos Valley - Active, mid-completion
  for (let i = 1; i <= 42; i++) {
    const status = i < 29 ? 'complete' : i === 29 ? 'in-progress' : 'scheduled';
    const baseTime = i < 29 ? hour(-((29 - i) * 2)) : hour((i - 29) * 2);
    stages.push({
      id: `stage-1-${i}`,
      wellId: 'well-1',
      stageNumber: i,
      status,
      scheduledStart: baseTime,
      scheduledEnd: new Date(baseTime.getTime() + 1.5 * 60 * 60 * 1000),
      actualStart: status === 'complete' || status === 'in-progress' ? baseTime : undefined,
      actualEnd: status === 'complete' ? new Date(baseTime.getTime() + 1.5 * 60 * 60 * 1000) : undefined,
      crewId: 'crew-1',
      equipmentIds: ['eq-1', 'eq-4', 'eq-7', 'eq-8'],
      pumpRate: status === 'complete' ? 85 + Math.random() * 10 : undefined,
      pressure: status === 'complete' ? 8500 + Math.random() * 500 : undefined,
      proppant: status === 'complete' ? 450000 + Math.random() * 50000 : undefined,
    });
  }
  
  // Midland Basin - Active, early completion
  for (let i = 1; i <= 38; i++) {
    const status = i < 13 ? 'complete' : i === 13 ? 'in-progress' : 'scheduled';
    const baseTime = i < 13 ? hour(-((13 - i) * 2.5)) : hour((i - 13) * 2.5);
    stages.push({
      id: `stage-2-${i}`,
      wellId: 'well-2',
      stageNumber: i,
      status,
      scheduledStart: baseTime,
      scheduledEnd: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000),
      actualStart: status === 'complete' || status === 'in-progress' ? baseTime : undefined,
      actualEnd: status === 'complete' ? new Date(baseTime.getTime() + 2 * 60 * 60 * 1000) : undefined,
      crewId: 'crew-2',
      equipmentIds: ['eq-2', 'eq-6'],
      pumpRate: status === 'complete' ? 82 + Math.random() * 12 : undefined,
      pressure: status === 'complete' ? 8200 + Math.random() * 600 : undefined,
      proppant: status === 'complete' ? 420000 + Math.random() * 60000 : undefined,
    });
  }
  
  // Bone Spring - Active, early stages
  for (let i = 1; i <= 36; i++) {
    const status = i < 9 ? 'complete' : i === 9 ? 'in-progress' : i === 15 || i === 16 ? 'delayed' : 'scheduled';
    const baseTime = i < 9 ? hour(-((9 - i) * 2)) : hour((i - 9) * 2 + (status === 'delayed' ? 4 : 0));
    stages.push({
      id: `stage-5-${i}`,
      wellId: 'well-5',
      stageNumber: i,
      status,
      scheduledStart: baseTime,
      scheduledEnd: new Date(baseTime.getTime() + 1.75 * 60 * 60 * 1000),
      actualStart: status === 'complete' || status === 'in-progress' ? baseTime : undefined,
      actualEnd: status === 'complete' ? new Date(baseTime.getTime() + 1.75 * 60 * 60 * 1000) : undefined,
      crewId: 'crew-4',
      equipmentIds: ['eq-5', 'eq-10'],
      pumpRate: status === 'complete' ? 80 + Math.random() * 15 : undefined,
      pressure: status === 'complete' ? 7800 + Math.random() * 700 : undefined,
      proppant: status === 'complete' ? 400000 + Math.random() * 70000 : undefined,
    });
  }
  
  // Wolfcamp State - Scheduled for future
  for (let i = 1; i <= 40; i++) {
    stages.push({
      id: `stage-4-${i}`,
      wellId: 'well-4',
      stageNumber: i,
      status: 'scheduled',
      scheduledStart: day(3, 6 + i * 2),
      scheduledEnd: day(3, 8 + i * 2),
      crewId: 'crew-3',
      equipmentIds: ['eq-3'],
    });
  }
  
  // Spraberry Deep - Scheduled further out
  for (let i = 1; i <= 44; i++) {
    stages.push({
      id: `stage-6-${i}`,
      wellId: 'well-6',
      stageNumber: i,
      status: 'scheduled',
      scheduledStart: day(7, 6 + i * 2),
      scheduledEnd: day(7, 8 + i * 2),
      crewId: 'crew-5',
      equipmentIds: ['eq-9'],
    });
  }
  
  return stages;
}

export const stages = generateStages();

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'Equipment Maintenance Due',
    message: 'Hydration Unit #1 maintenance overdue by 6 hours. Schedule maintenance to avoid operational risk.',
    timestamp: hour(-1),
    equipmentId: 'eq-6',
    wellId: 'well-2',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Crew Shift Limit Approaching',
    message: 'Echo Team has 1 shift remaining before mandatory rest period. Plan crew rotation.',
    timestamp: hour(-3),
    crewId: 'crew-5',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    type: 'warning',
    title: 'Stage Delay Detected',
    message: 'Bone Spring 18-4H stages 15-16 delayed due to equipment repositioning. 4-hour impact to schedule.',
    timestamp: hour(-2),
    wellId: 'well-5',
    acknowledged: true,
  },
  {
    id: 'alert-4',
    type: 'info',
    title: 'Weather Advisory',
    message: 'High winds forecasted for Mesa Verde C pad area tomorrow. Monitor conditions.',
    timestamp: hour(-4),
    acknowledged: true,
  },
  {
    id: 'alert-5',
    type: 'critical',
    title: 'Crew Scheduling Conflict',
    message: 'Bravo Team scheduled for two wells simultaneously starting +24h. Requires immediate resolution.',
    timestamp: hour(0),
    crewId: 'crew-2',
    acknowledged: false,
  },
];

export const scheduleConflicts: ScheduleConflict[] = [
  {
    id: 'conflict-1',
    type: 'crew-overlap',
    description: 'Bravo Team assigned to both Midland Basin 22-1H and Wolfcamp State 33-5H',
    affectedWells: ['well-2', 'well-4'],
    affectedStages: ['stage-2-25', 'stage-2-26', 'stage-4-1', 'stage-4-2'],
    severity: 'high',
    suggestedResolution: 'Reassign Charlie Team to Wolfcamp State 33-5H',
    potentialDelay: 8,
  },
  {
    id: 'conflict-2',
    type: 'equipment-shortage',
    description: 'Insufficient blender units for parallel operations on Day 4',
    affectedWells: ['well-1', 'well-5'],
    affectedStages: ['stage-1-35', 'stage-5-18'],
    severity: 'medium',
    suggestedResolution: 'Stagger well operations by 6 hours or source additional blender',
    potentialDelay: 6,
  },
  {
    id: 'conflict-3',
    type: 'maintenance-conflict',
    description: 'Sand King Unit #2 maintenance overlaps with Spraberry Deep startup',
    affectedWells: ['well-6'],
    affectedStages: ['stage-6-1', 'stage-6-2', 'stage-6-3'],
    severity: 'medium',
    suggestedResolution: 'Expedite maintenance or delay Spraberry startup by 24h',
    potentialDelay: 24,
  },
];

// Optimization metrics for the AI optimizer feature
export interface OptimizationResult {
  originalMetrics: {
    totalDuration: number; // hours
    crewIdleTime: number; // hours
    equipmentUtilization: number; // percentage
    estimatedCost: number; // dollars
    conflicts: number;
  };
  optimizedMetrics: {
    totalDuration: number;
    crewIdleTime: number;
    equipmentUtilization: number;
    estimatedCost: number;
    conflicts: number;
  };
  changes: {
    description: string;
    impact: string;
  }[];
  savings: {
    hours: number;
    cost: number;
    efficiency: number; // percentage improvement
  };
}

export const mockOptimizationResult: OptimizationResult = {
  originalMetrics: {
    totalDuration: 312,
    crewIdleTime: 47,
    equipmentUtilization: 72,
    estimatedCost: 4850000,
    conflicts: 3,
  },
  optimizedMetrics: {
    totalDuration: 298,
    crewIdleTime: 18,
    equipmentUtilization: 89,
    estimatedCost: 4620000,
    conflicts: 0,
  },
  changes: [
    {
      description: 'Reassigned Charlie Team to Wolfcamp State 33-5H',
      impact: 'Resolved crew overlap conflict, saved 8 hours',
    },
    {
      description: 'Staggered Pecos Valley and Bone Spring operations',
      impact: 'Eliminated blender shortage, improved equipment flow',
    },
    {
      description: 'Accelerated Sand King Unit #2 maintenance',
      impact: 'Enabled on-time Spraberry Deep startup',
    },
    {
      description: 'Optimized stage sequencing on Midland Basin',
      impact: 'Reduced crew idle time by 29 hours',
    },
  ],
  savings: {
    hours: 14,
    cost: 230000,
    efficiency: 17,
  },
};
