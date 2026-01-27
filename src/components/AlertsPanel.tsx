'use client';

import { useState } from 'react';
import { alerts, Alert } from '@/lib/data';

export default function AlertsPanel() {
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return (
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const acknowledgeAlert = (alertId: string) => {
    setLocalAlerts(prev => 
      prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a)
    );
  };

  const unacknowledgedCount = localAlerts.filter(a => !a.acknowledged).length;
  const criticalCount = localAlerts.filter(a => a.type === 'critical' && !a.acknowledged).length;

  return (
    <div className="bg-[#111118] rounded-lg border border-[#1e1e2d] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e1e2d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">Alerts</h2>
          {unacknowledgedCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-400 rounded-full font-medium">
              {unacknowledgedCount}
            </span>
          )}
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-400">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{criticalCount} critical</span>
          </div>
        )}
      </div>
      
      <div className="divide-y divide-[#1e1e2d] max-h-[320px] overflow-y-auto">
        {localAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`px-4 py-3 hover:bg-[#1a1a24] transition-colors ${
              alert.acknowledged ? 'opacity-60' : ''
            }`}
          >
            <div className="flex gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium">{alert.title}</h3>
                  <span className="text-[10px] text-zinc-500 flex-shrink-0">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
                  {alert.message}
                </p>
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="mt-2 text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
