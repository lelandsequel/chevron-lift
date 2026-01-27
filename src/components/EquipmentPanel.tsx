'use client';

import { equipment, wells } from '@/lib/data';

export default function EquipmentPanel() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'in-use': return 'text-blue-400';
      case 'maintenance': return 'text-amber-400';
      case 'down': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pump':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'blender':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'hydration':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'data-van':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'sand-king':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'chemical':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const isMaintenanceDue = (eq: typeof equipment[0]) => {
    const now = new Date();
    return eq.nextMaintenance <= now;
  };

  const operationalCount = equipment.filter(e => e.status === 'operational' || e.status === 'in-use').length;
  const avgUtilization = Math.round(equipment.reduce((acc, e) => acc + e.utilization, 0) / equipment.length);

  // Group by type
  const groupedEquipment = equipment.reduce((acc, eq) => {
    if (!acc[eq.type]) acc[eq.type] = [];
    acc[eq.type].push(eq);
    return acc;
  }, {} as Record<string, typeof equipment>);

  return (
    <div className="bg-[#111118] rounded-lg border border-[#1e1e2d] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e1e2d] flex items-center justify-between">
        <h2 className="font-semibold text-sm">Equipment</h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Ready:</span>
            <span className="font-medium text-green-400">{operationalCount}/{equipment.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Util:</span>
            <span className="font-medium mono">{avgUtilization}%</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {Object.entries(groupedEquipment).map(([type, items]) => (
          <div key={type}>
            <div className="px-4 py-2 bg-[#0d0d14] text-xs text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <span className="text-zinc-600">{getTypeIcon(type)}</span>
              {type.replace('-', ' ')}s
            </div>
            <div className="divide-y divide-[#1e1e2d]">
              {items.map((eq) => {
                const assignedWell = eq.currentWellId 
                  ? wells.find(w => w.id === eq.currentWellId)
                  : null;
                const maintenanceDue = isMaintenanceDue(eq);

                return (
                  <div key={eq.id} className="px-4 py-2.5 hover:bg-[#1a1a24] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{eq.name}</span>
                        {maintenanceDue && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Maintenance Due" />
                        )}
                      </div>
                      <span className={`text-xs capitalize ${getStatusColor(eq.status)}`}>
                        {eq.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <div className="text-zinc-500">
                        {assignedWell ? (
                          <span className="text-zinc-400">{assignedWell.name.split(' ')[0]}</span>
                        ) : (
                          <span>Unassigned</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-[#1e1e2d] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              eq.utilization > 90 ? 'bg-amber-500' :
                              eq.utilization > 70 ? 'bg-green-500' : 'bg-zinc-500'
                            }`}
                            style={{ width: `${eq.utilization}%` }}
                          />
                        </div>
                        <span className="text-zinc-500 mono w-8">{eq.utilization}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
