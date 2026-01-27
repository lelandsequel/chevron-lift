'use client';

import { useState, useMemo } from 'react';
import { wells, stages, Stage } from '@/lib/data';

interface ScheduleGanttProps {
  optimized?: boolean;
}

export default function ScheduleGantt({ optimized = false }: ScheduleGanttProps) {
  const [selectedWellId, setSelectedWellId] = useState<string | null>(null);
  const [hoveredStage, setHoveredStage] = useState<Stage | null>(null);

  // Time range: -24h to +72h from now
  const now = useMemo(() => new Date(), []);
  const startTime = useMemo(() => {
    const d = new Date(now);
    d.setHours(d.getHours() - 24);
    return d;
  }, [now]);
  const endTime = useMemo(() => {
    const d = new Date(now);
    d.setHours(d.getHours() + 72);
    return d;
  }, [now]);
  
  const totalHours = 96; // -24 to +72
  const hourWidth = 40; // pixels per hour

  const getStagePosition = (stage: Stage) => {
    const stageStart = new Date(stage.scheduledStart);
    const stageEnd = new Date(stage.scheduledEnd);
    
    // Apply optimization offset if optimized
    if (optimized) {
      // Shift some stages to show optimization effect
      const wellNum = parseInt(stage.wellId.split('-')[1]);
      if (wellNum === 4) {
        // Wolfcamp gets moved earlier
        stageStart.setHours(stageStart.getHours() - 8);
        stageEnd.setHours(stageEnd.getHours() - 8);
      }
      if (wellNum === 5 && stage.status === 'delayed') {
        // Fix delayed stages
        stageStart.setHours(stageStart.getHours() - 4);
        stageEnd.setHours(stageEnd.getHours() - 4);
      }
    }
    
    const startOffset = (stageStart.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const duration = (stageEnd.getTime() - stageStart.getTime()) / (1000 * 60 * 60);
    
    return {
      left: Math.max(0, startOffset * hourWidth),
      width: Math.max(20, duration * hourWidth - 2),
      visible: startOffset + duration > 0 && startOffset < totalHours,
    };
  };

  const getStatusClass = (status: string, optimized: boolean) => {
    if (optimized && status === 'delayed') return 'scheduled';
    return status;
  };

  const filteredWells = selectedWellId 
    ? wells.filter(w => w.id === selectedWellId)
    : wells;

  // Generate hour markers
  const hourMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i < totalHours; i += 6) {
      const time = new Date(startTime);
      time.setHours(time.getHours() + i);
      markers.push({ offset: i, time });
    }
    return markers;
  }, [startTime]);

  // Current time marker position
  const nowOffset = useMemo(() => {
    return ((now.getTime() - startTime.getTime()) / (1000 * 60 * 60)) * hourWidth;
  }, [now, startTime]);

  return (
    <div className="bg-[#111118] rounded-lg border border-[#1e1e2d] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e1e2d] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-sm">Stage Schedule</h2>
          {optimized && (
            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
              Optimized
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="bg-[#1e1e2d] border-none text-xs px-2 py-1 rounded text-zinc-300"
            value={selectedWellId || ''}
            onChange={(e) => setSelectedWellId(e.target.value || null)}
          >
            <option value="">All Wells</option>
            {wells.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-3 text-xs text-zinc-500 ml-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 rounded-sm bg-green-600" />
              <span>Complete</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 rounded-sm bg-blue-600" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 rounded-sm bg-zinc-600" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 rounded-sm bg-red-600" />
              <span>Delayed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Well labels */}
        <div className="w-48 flex-shrink-0 border-r border-[#1e1e2d]">
          <div className="h-8 border-b border-[#1e1e2d] px-3 flex items-center">
            <span className="text-xs text-zinc-500 font-medium">Well</span>
          </div>
          {filteredWells.map((well) => (
            <div 
              key={well.id}
              className="h-10 border-b border-[#1e1e2d] px-3 flex items-center hover:bg-[#1a1a24]"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  well.status === 'active' ? 'bg-green-500' :
                  well.status === 'standby' ? 'bg-amber-500' :
                  well.status === 'complete' ? 'bg-emerald-400' : 'bg-blue-500'
                }`} />
                <span className="text-xs font-medium truncate">{well.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gantt chart */}
        <div className="flex-1 overflow-x-auto">
          <div style={{ width: totalHours * hourWidth }}>
            {/* Time header */}
            <div className="h-8 border-b border-[#1e1e2d] relative flex">
              {hourMarkers.map((marker) => (
                <div 
                  key={marker.offset}
                  className="absolute top-0 bottom-0 flex items-center"
                  style={{ left: marker.offset * hourWidth }}
                >
                  <div className="text-xs text-zinc-500 pl-2">
                    {marker.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                </div>
              ))}
              {/* Now indicator */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-amber-500 z-20"
                style={{ left: nowOffset }}
              >
                <div className="absolute -top-0 -left-2 px-1 bg-amber-500 text-[10px] text-black font-medium rounded-b">
                  NOW
                </div>
              </div>
            </div>

            {/* Rows */}
            {filteredWells.map((well) => {
              const wellStages = stages
                .filter(s => s.wellId === well.id)
                .filter(s => {
                  const pos = getStagePosition(s);
                  return pos.visible;
                })
                .slice(0, 20); // Limit visible stages

              return (
                <div 
                  key={well.id}
                  className="h-10 border-b border-[#1e1e2d] relative"
                >
                  {/* Grid lines */}
                  {hourMarkers.map((marker) => (
                    <div 
                      key={marker.offset}
                      className="absolute top-0 bottom-0 w-px bg-[#1e1e2d]/50"
                      style={{ left: marker.offset * hourWidth }}
                    />
                  ))}
                  
                  {/* Now line */}
                  <div 
                    className="absolute top-0 bottom-0 w-px bg-amber-500/30 z-10"
                    style={{ left: nowOffset }}
                  />

                  {/* Stage bars */}
                  {wellStages.map((stage) => {
                    const pos = getStagePosition(stage);
                    const statusClass = getStatusClass(stage.status, optimized);
                    
                    return (
                      <div
                        key={stage.id}
                        className={`gantt-bar ${statusClass} cursor-pointer`}
                        style={{
                          left: pos.left,
                          width: pos.width,
                          top: 8,
                        }}
                        onMouseEnter={() => setHoveredStage(stage)}
                        onMouseLeave={() => setHoveredStage(null)}
                      >
                        <span className="text-white/80">{stage.stageNumber}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredStage && (
        <div className="fixed z-50 bg-[#1a1a24] border border-[#2d2d3d] rounded-lg p-3 shadow-xl pointer-events-none"
          style={{ 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="text-sm font-medium mb-1">
            Stage {hoveredStage.stageNumber}
          </div>
          <div className="text-xs text-zinc-400 space-y-1">
            <div>Status: <span className="capitalize">{hoveredStage.status}</span></div>
            <div>Crew: {hoveredStage.crewId}</div>
            <div>Start: {new Date(hoveredStage.scheduledStart).toLocaleString()}</div>
            {hoveredStage.pumpRate && <div>Rate: {hoveredStage.pumpRate.toFixed(0)} bpm</div>}
            {hoveredStage.pressure && <div>Pressure: {hoveredStage.pressure.toFixed(0)} psi</div>}
          </div>
        </div>
      )}
    </div>
  );
}
