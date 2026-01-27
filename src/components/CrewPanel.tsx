'use client';

import { crews, wells } from '@/lib/data';

export default function CrewPanel() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-site':
        return <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">On Site</span>;
      case 'in-transit':
        return <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded">In Transit</span>;
      case 'off-duty':
        return <span className="px-1.5 py-0.5 text-[10px] bg-zinc-500/20 text-zinc-400 rounded">Off Duty</span>;
      case 'maintenance':
        return <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">Maintenance</span>;
      default:
        return null;
    }
  };

  const getShiftIndicator = (shiftsRemaining: number) => {
    if (shiftsRemaining <= 1) {
      return <span className="text-red-400">!</span>;
    }
    if (shiftsRemaining <= 3) {
      return <span className="text-amber-400">•</span>;
    }
    return <span className="text-green-400">•</span>;
  };

  const activeCrew = crews.filter(c => c.status === 'on-site').length;

  return (
    <div className="bg-[#111118] rounded-lg border border-[#1e1e2d] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e1e2d] flex items-center justify-between">
        <h2 className="font-semibold text-sm">Crew Status</h2>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Active:</span>
          <span className="font-medium text-green-400">{activeCrew}/{crews.length}</span>
        </div>
      </div>
      
      <div className="divide-y divide-[#1e1e2d]">
        {crews.map((crew) => {
          const assignedWell = crew.currentWellId 
            ? wells.find(w => w.id === crew.currentWellId)
            : null;

          return (
            <div key={crew.id} className="px-4 py-3 hover:bg-[#1a1a24] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{crew.name}</span>
                  {getStatusBadge(crew.status)}
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  {getShiftIndicator(crew.shiftsRemaining)}
                  <span>{crew.shiftsRemaining} shifts</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="text-zinc-500">
                  <span className="text-zinc-400">{crew.lead}</span>
                  <span className="mx-1">•</span>
                  <span>{crew.members} members</span>
                </div>
                {assignedWell && (
                  <div className="text-zinc-400 truncate max-w-[140px]">
                    {assignedWell.name}
                  </div>
                )}
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#1e1e2d] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, (crew.hoursWorked / 1000) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mono">{crew.hoursWorked}h</span>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {crew.certifications.slice(0, 3).map((cert) => (
                  <span 
                    key={cert}
                    className="px-1.5 py-0.5 text-[9px] bg-[#1e1e2d] text-zinc-500 rounded"
                  >
                    {cert}
                  </span>
                ))}
                {crew.certifications.length > 3 && (
                  <span className="text-[9px] text-zinc-600">+{crew.certifications.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
