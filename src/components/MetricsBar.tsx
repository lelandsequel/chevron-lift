'use client';

import { wells, stages, crews, equipment } from '@/lib/data';

export default function MetricsBar() {
  // Calculate metrics
  const activeWells = wells.filter(w => w.status === 'active').length;
  const totalStagesCompleted = wells.reduce((acc, w) => acc + w.completedStages, 0);
  const totalStages = wells.reduce((acc, w) => acc + w.totalStages, 0);
  const completionRate = ((totalStagesCompleted / totalStages) * 100).toFixed(1);
  
  const activeCrew = crews.filter(c => c.status === 'on-site').length;
  const totalCrew = crews.length;
  
  const operationalEquipment = equipment.filter(e => e.status === 'operational' || e.status === 'in-use').length;
  const avgUtilization = Math.round(equipment.reduce((acc, e) => acc + e.utilization, 0) / equipment.length);
  
  // Stages in last 24h
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const stagesLast24h = stages.filter(s => {
    const completedTime = s.actualEnd ? new Date(s.actualEnd) : null;
    return completedTime && completedTime > dayAgo && completedTime <= now;
  }).length;

  const metrics = [
    {
      label: 'Active Wells',
      value: activeWells,
      subValue: `of ${wells.length}`,
      color: 'text-green-400',
    },
    {
      label: 'Overall Progress',
      value: `${completionRate}%`,
      subValue: `${totalStagesCompleted}/${totalStages} stages`,
      color: 'text-blue-400',
    },
    {
      label: 'Stages (24h)',
      value: stagesLast24h,
      subValue: 'completed',
      color: 'text-cyan-400',
    },
    {
      label: 'Crews Active',
      value: activeCrew,
      subValue: `of ${totalCrew}`,
      color: 'text-amber-400',
    },
    {
      label: 'Equipment Ready',
      value: operationalEquipment,
      subValue: `${avgUtilization}% utilization`,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="bg-[#111118] rounded-lg border border-[#1e1e2d] p-4">
      <div className="grid grid-cols-5 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="text-center">
            <div className={`text-2xl font-bold mono ${metric.color}`}>
              {metric.value}
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">{metric.label}</div>
            <div className="text-[10px] text-zinc-600">{metric.subValue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
