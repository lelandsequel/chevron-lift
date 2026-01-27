'use client';

import { useState } from 'react';
import { scheduleConflicts, mockOptimizationResult } from '@/lib/data';

interface OptimizerProps {
  onOptimize: (optimized: boolean) => void;
  isOptimized: boolean;
}

export default function Optimizer({ onOptimize, isOptimized }: OptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setShowResults(false);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsOptimizing(false);
    setShowResults(true);
    onOptimize(true);
  };

  const handleReset = () => {
    setShowResults(false);
    onOptimize(false);
  };

  const result = mockOptimizationResult;

  return (
    <div className="bg-[#111118] rounded-lg border border-[#1e1e2d] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e1e2d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">AI Schedule Optimizer</h2>
          {scheduleConflicts.length > 0 && !isOptimized && (
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">
              {scheduleConflicts.length} conflicts
            </span>
          )}
          {isOptimized && (
            <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">
              Optimized
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Conflict list (before optimization) */}
        {!isOptimized && !isOptimizing && (
          <div className="space-y-3 mb-4">
            {scheduleConflicts.map((conflict) => (
              <div 
                key={conflict.id}
                className="p-3 bg-[#1a1a24] rounded-lg border border-[#2d2d3d]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        conflict.severity === 'high' ? 'bg-red-500' :
                        conflict.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-xs font-medium capitalize">
                        {conflict.type.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{conflict.description}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500">+{conflict.potentialDelay}h delay</span>
                </div>
                <div className="mt-2 text-[10px] text-zinc-500">
                  Suggested: {conflict.suggestedResolution}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Optimizing animation */}
        {isOptimizing && (
          <div className="py-8 text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-2 border-2 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }} />
              <div className="absolute inset-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-zinc-300">Analyzing schedule...</p>
            <p className="text-xs text-zinc-500 mt-1">Resolving conflicts and optimizing crew allocation</p>
          </div>
        )}

        {/* Results */}
        {showResults && !isOptimizing && (
          <div className="space-y-4">
            {/* Savings highlight */}
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-green-400 mono">
                  {result.savings.hours}h
                </div>
                <div className="text-sm text-green-400/80">Time Saved This Week</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-white mono">
                    ${(result.savings.cost / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-zinc-500">Cost Savings</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white mono">
                    +{result.savings.efficiency}%
                  </div>
                  <div className="text-xs text-zinc-500">Efficiency Gain</div>
                </div>
              </div>
            </div>

            {/* Before/After comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#1a1a24] rounded-lg">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Before</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Duration</span>
                    <span className="mono">{result.originalMetrics.totalDuration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Idle Time</span>
                    <span className="mono">{result.originalMetrics.crewIdleTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Utilization</span>
                    <span className="mono">{result.originalMetrics.equipmentUtilization}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Conflicts</span>
                    <span className="mono text-red-400">{result.originalMetrics.conflicts}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="text-[10px] text-green-400 uppercase tracking-wider mb-2">After</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Duration</span>
                    <span className="mono text-green-400">{result.optimizedMetrics.totalDuration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Idle Time</span>
                    <span className="mono text-green-400">{result.optimizedMetrics.crewIdleTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Utilization</span>
                    <span className="mono text-green-400">{result.optimizedMetrics.equipmentUtilization}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Conflicts</span>
                    <span className="mono text-green-400">{result.optimizedMetrics.conflicts}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes made */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Changes Applied</div>
              <div className="space-y-2">
                {result.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <div className="text-zinc-300">{change.description}</div>
                      <div className="text-zinc-500">{change.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          {!isOptimized ? (
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Optimization
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 bg-[#1e1e2d] hover:bg-[#2d2d3d] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply to Schedule
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
