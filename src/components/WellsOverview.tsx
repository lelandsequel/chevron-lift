'use client';

import { wells, stages } from '@/lib/data';

export default function WellsOverview() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-amber-500';
      case 'scheduled': return 'bg-blue-500';
      case 'complete': return 'bg-emerald-400';
      default: return 'bg-zinc-500';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20';
      case 'standby': return 'bg-amber-500/20';
      case 'complete': return 'bg-emerald-400/20';
      default: return 'bg-zinc-500/20';
    }
  };

  const activeWells = wells.filter(w => w.status === 'active');
  const totalStagesCompleted = wells.reduce((acc, w) => acc + w.completedStages, 0);
  const totalStages = wells.reduce((acc, w) => acc + w.totalStages, 0);

  return (
    <div className="bg-[#111118] rounded-lg border border-[#1e1e2d] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e1e2d] flex items-center justify-between">
        <h2 className="font-semibold text-sm">Well Operations</h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Active:</span>
            <span className="font-medium text-green-400">{activeWells.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Progress:</span>
            <span className="font-medium mono">{totalStagesCompleted}/{totalStages}</span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-[#1e1e2d]">
        {wells.map((well) => {
          const progress = well.totalStages > 0 
            ? (well.completedStages / well.totalStages) * 100 
            : 0;
          
          const wellStages = stages.filter(s => s.wellId === well.id);
          const inProgressStage = wellStages.find(s => s.status === 'in-progress');
          
          return (
            <div key={well.id} className="px-4 py-3 hover:bg-[#1a1a24] transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(well.status)}`} />
                    <span className="font-medium text-sm">{well.name}</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">{well.pad}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400 capitalize">{well.status}</div>
                  {well.currentStage && (
                    <div className="text-xs text-zinc-500">Stage {well.currentStage}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-[#1e1e2d] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getStatusColor(well.status)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs mono text-zinc-400 w-12 text-right">
                  {progress.toFixed(0)}%
                </span>
              </div>
              
              {inProgressStage && (
                <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                  <span>Rate: {inProgressStage.pumpRate?.toFixed(0) || '—'} bpm</span>
                  <span>Pressure: {inProgressStage.pressure?.toFixed(0) || '—'} psi</span>
                </div>
              )}
              
              <div className="mt-2 flex items-center gap-3 text-xs text-zinc-600">
                <span>{well.location}</span>
                <span>•</span>
                <span>{well.lateralLength.toLocaleString()} ft lateral</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
