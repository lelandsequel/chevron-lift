'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import MetricsBar from '@/components/MetricsBar';
import WellsOverview from '@/components/WellsOverview';
import ScheduleGantt from '@/components/ScheduleGantt';
import CrewPanel from '@/components/CrewPanel';
import EquipmentPanel from '@/components/EquipmentPanel';
import AlertsPanel from '@/components/AlertsPanel';
import Optimizer from '@/components/Optimizer';

export default function Home() {
  const [isOptimized, setIsOptimized] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 overflow-auto">
        {/* Metrics row */}
        <div className="mb-4">
          <MetricsBar />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left column - Wells overview */}
          <div className="col-span-3">
            <WellsOverview />
          </div>

          {/* Center column - Schedule + Optimizer */}
          <div className="col-span-6 space-y-4">
            <ScheduleGantt optimized={isOptimized} />
            <Optimizer 
              onOptimize={setIsOptimized}
              isOptimized={isOptimized}
            />
          </div>

          {/* Right column - Crew, Equipment, Alerts */}
          <div className="col-span-3 space-y-4">
            <AlertsPanel />
            <CrewPanel />
            <EquipmentPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-8 bg-[#0d0d14] border-t border-[#1e1e2d] flex items-center justify-between px-4 text-[10px] text-zinc-600">
        <div className="flex items-center gap-4">
          <span>C&L FracOps FracFlow Command Center v1.0</span>
          <span>|</span>
          <span>Permian Basin Operations</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Data refresh: 30s</span>
          <span>|</span>
          <span>Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
}
