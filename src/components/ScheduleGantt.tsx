'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { wells, stages as initialStages, Stage } from '@/lib/data';

interface ScheduleGanttProps {
  optimized?: boolean;
}

interface DragState {
  stage: Stage;
  startX: number;
  originalLeft: number;
}

interface Conflict {
  type: 'crew' | 'equipment' | 'overlap';
  message: string;
  stages: string[];
}

export default function ScheduleGantt({ optimized = false }: ScheduleGanttProps) {
  const [selectedWellId, setSelectedWellId] = useState<string | null>(null);
  const [hoveredStage, setHoveredStage] = useState<Stage | null>(null);
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPreviewOffset, setDragPreviewOffset] = useState<number>(0);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const ganttRef = useRef<HTMLDivElement>(null);

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

  const getStagePosition = useCallback((stage: Stage, applyOptimization = true) => {
    const stageStart = new Date(stage.scheduledStart);
    const stageEnd = new Date(stage.scheduledEnd);
    
    // Apply optimization offset if optimized
    if (applyOptimization && optimized) {
      const wellNum = parseInt(stage.wellId.split('-')[1]);
      if (wellNum === 4) {
        stageStart.setHours(stageStart.getHours() - 8);
        stageEnd.setHours(stageEnd.getHours() - 8);
      }
      if (wellNum === 5 && stage.status === 'delayed') {
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
      startOffset,
      duration,
    };
  }, [optimized, startTime, hourWidth, totalHours]);

  const getStatusClass = (status: string, isOptimized: boolean) => {
    if (isOptimized && status === 'delayed') return 'scheduled';
    return status;
  };

  // Check for conflicts after a move
  const detectConflicts = useCallback((movedStage: Stage, allStages: Stage[]): Conflict[] => {
    const newConflicts: Conflict[] = [];
    const movedStart = new Date(movedStage.scheduledStart).getTime();
    const movedEnd = new Date(movedStage.scheduledEnd).getTime();

    // Find other stages that overlap in time
    const overlappingStages = allStages.filter(s => {
      if (s.id === movedStage.id) return false;
      const sStart = new Date(s.scheduledStart).getTime();
      const sEnd = new Date(s.scheduledEnd).getTime();
      return movedStart < sEnd && movedEnd > sStart;
    });

    // Check crew conflicts
    const crewConflicts = overlappingStages.filter(s => s.crewId === movedStage.crewId);
    if (crewConflicts.length > 0) {
      newConflicts.push({
        type: 'crew',
        message: `Crew ${movedStage.crewId} is already scheduled for another stage during this time`,
        stages: [movedStage.id, ...crewConflicts.map(s => s.id)],
      });
    }

    // Check equipment conflicts
    const movedEquipment = movedStage.equipmentIds || [];
    overlappingStages.forEach(s => {
      const sharedEquipment = (s.equipmentIds || []).filter(e => movedEquipment.includes(e));
      if (sharedEquipment.length > 0) {
        newConflicts.push({
          type: 'equipment',
          message: `Equipment conflict: ${sharedEquipment.join(', ')} already in use`,
          stages: [movedStage.id, s.id],
        });
      }
    });

    // Check for overlapping stages on the same well
    const sameWellOverlaps = overlappingStages.filter(s => s.wellId === movedStage.wellId);
    if (sameWellOverlaps.length > 0) {
      newConflicts.push({
        type: 'overlap',
        message: `Stage overlaps with existing stages on this well`,
        stages: [movedStage.id, ...sameWellOverlaps.map(s => s.id)],
      });
    }

    return newConflicts;
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, stage: Stage) => {
    // Don't allow dragging completed or in-progress stages
    if (stage.status === 'complete' || stage.status === 'in-progress') return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = getStagePosition(stage);
    
    setDragState({
      stage,
      startX: clientX,
      originalLeft: pos.left,
    });
    setDragPreviewOffset(0);
    setConflicts([]);
    setShowConflictWarning(false);
  }, [getStagePosition]);

  // Handle drag move
  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragState.startX;
    setDragPreviewOffset(deltaX);
  }, [dragState]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!dragState) return;
    
    // Calculate new time based on drag offset
    const hoursShifted = dragPreviewOffset / hourWidth;
    const roundedHours = Math.round(hoursShifted * 2) / 2; // Snap to 30-minute increments
    
    if (Math.abs(roundedHours) < 0.5) {
      // Less than 30 min shift, cancel
      setDragState(null);
      setDragPreviewOffset(0);
      return;
    }

    // Create updated stage
    const updatedStage: Stage = {
      ...dragState.stage,
      scheduledStart: new Date(new Date(dragState.stage.scheduledStart).getTime() + roundedHours * 60 * 60 * 1000),
      scheduledEnd: new Date(new Date(dragState.stage.scheduledEnd).getTime() + roundedHours * 60 * 60 * 1000),
    };

    // Update stages array
    const newStages = stages.map(s => s.id === updatedStage.id ? updatedStage : s);
    
    // Detect conflicts
    const newConflicts = detectConflicts(updatedStage, newStages);
    
    if (newConflicts.length > 0) {
      setConflicts(newConflicts);
      setShowConflictWarning(true);
    }
    
    setStages(newStages);
    setDragState(null);
    setDragPreviewOffset(0);
  }, [dragState, dragPreviewOffset, hourWidth, stages, detectConflicts]);

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
  }, [startTime, totalHours]);

  // Current time marker position
  const nowOffset = useMemo(() => {
    return ((now.getTime() - startTime.getTime()) / (1000 * 60 * 60)) * hourWidth;
  }, [now, startTime, hourWidth]);

  // Dismiss conflict warning
  const dismissConflictWarning = () => {
    setShowConflictWarning(false);
  };

  return (
    <div 
      className="bg-[#111118] rounded-lg border border-[#1e1e2d] overflow-hidden"
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="px-4 py-3 border-b border-[#1e1e2d] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-sm">Stage Schedule</h2>
          {optimized && (
            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
              Optimized
            </span>
          )}
          <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
            Drag to reschedule
          </span>
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

      {/* Conflict Warning Banner */}
      {showConflictWarning && conflicts.length > 0 && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-xs text-amber-400">
              <span className="font-medium">Schedule Conflict Detected: </span>
              {conflicts.map((c, i) => (
                <span key={i}>
                  {c.message}
                  {i < conflicts.length - 1 ? '; ' : ''}
                </span>
              ))}
            </div>
          </div>
          <button 
            onClick={dismissConflictWarning}
            className="text-amber-500 hover:text-amber-400 text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

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
        <div className="flex-1 overflow-x-auto" ref={ganttRef}>
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
                .slice(0, 20);

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
                    const isDragging = dragState?.stage.id === stage.id;
                    const isDraggable = stage.status !== 'complete' && stage.status !== 'in-progress';
                    const hasConflict = conflicts.some(c => c.stages.includes(stage.id));
                    
                    // Calculate position with drag offset
                    const displayLeft = isDragging ? pos.left + dragPreviewOffset : pos.left;
                    
                    return (
                      <div
                        key={stage.id}
                        className={`
                          gantt-bar ${statusClass} 
                          ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-80'}
                          ${isDragging ? 'z-30 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50' : ''}
                          ${hasConflict ? 'ring-2 ring-amber-500/70 animate-pulse' : ''}
                          transition-shadow
                        `}
                        style={{
                          left: displayLeft,
                          width: pos.width,
                          top: 8,
                          transform: isDragging ? 'scale(1.05)' : 'scale(1)',
                          transition: isDragging ? 'none' : 'transform 0.15s ease',
                        }}
                        onMouseDown={(e) => handleDragStart(e, stage)}
                        onTouchStart={(e) => handleDragStart(e, stage)}
                        onMouseEnter={() => !dragState && setHoveredStage(stage)}
                        onMouseLeave={() => !dragState && setHoveredStage(null)}
                      >
                        <span className="text-white/80">{stage.stageNumber}</span>
                        {isDragging && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                            {Math.round(dragPreviewOffset / hourWidth * 2) / 2 > 0 ? '+' : ''}
                            {Math.round(dragPreviewOffset / hourWidth * 2) / 2}h
                          </div>
                        )}
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
      {hoveredStage && !dragState && (
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
            {hoveredStage.status !== 'complete' && hoveredStage.status !== 'in-progress' && (
              <div className="text-blue-400 mt-1">Drag to reschedule</div>
            )}
          </div>
        </div>
      )}

      {/* Drag instruction overlay */}
      {dragState && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
          Dragging Stage {dragState.stage.stageNumber} • Release to reschedule
        </div>
      )}
    </div>
  );
}
