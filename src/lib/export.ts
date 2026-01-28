// Export utilities for ChevronLift

import { Stage, Well, Crew, Equipment, wells, crews, equipment } from './data';

// Export schedule to CSV
export function exportScheduleToCSV(stages: Stage[]): string {
  const getWellName = (id: string) => wells.find(w => w.id === id)?.name || id;
  const getCrewName = (id: string) => crews.find(c => c.id === id)?.name || id;
  
  const headers = [
    'Stage ID',
    'Well',
    'Stage Number',
    'Status',
    'Scheduled Start',
    'Scheduled End',
    'Actual Start',
    'Actual End',
    'Crew',
    'Equipment',
    'Pump Rate',
    'Pressure',
    'Proppant'
  ];
  
  const rows = stages.map(stage => [
    stage.id,
    getWellName(stage.wellId),
    stage.stageNumber.toString(),
    stage.status,
    stage.scheduledStart.toISOString(),
    stage.scheduledEnd.toISOString(),
    stage.actualStart?.toISOString() || '',
    stage.actualEnd?.toISOString() || '',
    getCrewName(stage.crewId),
    stage.equipmentIds.join('; '),
    stage.pumpRate?.toFixed(1) || '',
    stage.pressure?.toFixed(0) || '',
    stage.proppant?.toFixed(0) || ''
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');
}

// Download CSV file
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate schedule report as HTML
export function generateScheduleReport(stages: Stage[]): string {
  const now = new Date();
  const getWellName = (id: string) => wells.find(w => w.id === id)?.name || id;
  const getCrewName = (id: string) => crews.find(c => c.id === id)?.name || id;
  
  const completed = stages.filter(s => s.status === 'complete');
  const inProgress = stages.filter(s => s.status === 'in-progress');
  const scheduled = stages.filter(s => s.status === 'scheduled');
  const delayed = stages.filter(s => s.status === 'delayed');
  
  const wellGroups = new Map<string, Stage[]>();
  stages.forEach(s => {
    if (!wellGroups.has(s.wellId)) wellGroups.set(s.wellId, []);
    wellGroups.get(s.wellId)!.push(s);
  });
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>ChevronLift Schedule Report - ${now.toLocaleDateString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a1a1a;
      padding: 40px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header p { color: #666; font-size: 14px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-card {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
    }
    .summary-card .label { font-size: 12px; color: #666; margin-bottom: 5px; }
    .summary-card .value { font-size: 24px; font-weight: 600; }
    .well-section { 
      margin-bottom: 30px; 
      page-break-inside: avoid;
    }
    .well-header {
      background: #1a1a1a;
      color: white;
      padding: 10px 15px;
      border-radius: 8px 8px 0 0;
    }
    .well-header h2 { font-size: 14px; font-weight: 600; }
    .well-header span { font-size: 12px; opacity: 0.7; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f9f9f9; font-weight: 600; }
    .status {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-complete { background: #d1fae5; color: #065f46; }
    .status-in-progress { background: #dbeafe; color: #1e40af; }
    .status-scheduled { background: #e5e7eb; color: #374151; }
    .status-delayed { background: #fee2e2; color: #991b1b; }
    .text-right { text-align: right; }
    .font-mono { font-family: 'SF Mono', Monaco, monospace; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ChevronLift FracFlow Schedule Report</h1>
    <p>Generated: ${now.toLocaleString()} | Permian Basin Operations</p>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="label">Total Stages</div>
      <div class="value">${stages.length}</div>
    </div>
    <div class="summary-card">
      <div class="label">Completed</div>
      <div class="value" style="color: #059669">${completed.length}</div>
    </div>
    <div class="summary-card">
      <div class="label">In Progress</div>
      <div class="value" style="color: #2563eb">${inProgress.length}</div>
    </div>
    <div class="summary-card">
      <div class="label">Scheduled</div>
      <div class="value">${scheduled.length}</div>
    </div>
  </div>

  ${Array.from(wellGroups.entries()).map(([wellId, wellStages]) => {
    const well = wells.find(w => w.id === wellId);
    const wellCompleted = wellStages.filter(s => s.status === 'complete').length;
    
    return `
    <div class="well-section">
      <div class="well-header">
        <h2>${well?.name || wellId}</h2>
        <span>${well?.location} | ${wellCompleted}/${wellStages.length} stages complete</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Status</th>
            <th>Scheduled Start</th>
            <th>Scheduled End</th>
            <th>Crew</th>
            <th>Pump Rate</th>
            <th>Pressure</th>
          </tr>
        </thead>
        <tbody>
          ${wellStages.slice(0, 20).map(stage => `
          <tr>
            <td class="font-mono">${stage.stageNumber}</td>
            <td>
              <span class="status status-${stage.status}">${stage.status.replace('-', ' ')}</span>
            </td>
            <td>${stage.scheduledStart.toLocaleString()}</td>
            <td>${stage.scheduledEnd.toLocaleString()}</td>
            <td>${getCrewName(stage.crewId)}</td>
            <td class="font-mono">${stage.pumpRate?.toFixed(1) || '-'}</td>
            <td class="font-mono">${stage.pressure?.toFixed(0) || '-'}</td>
          </tr>
          `).join('')}
          ${wellStages.length > 20 ? `
          <tr>
            <td colspan="7" style="text-align: center; color: #666; font-style: italic;">
              ... and ${wellStages.length - 20} more stages
            </td>
          </tr>
          ` : ''}
        </tbody>
      </table>
    </div>
    `;
  }).join('')}

  <div class="footer">
    <p>ChevronLift FracFlow Command Center | Permian Basin Operations</p>
    <p>Report generated for internal use only. Schedule subject to change based on field conditions.</p>
  </div>
</body>
</html>
  `;
}

// Open print dialog with report
export function printScheduleReport(stages: Stage[]) {
  const html = generateScheduleReport(stages);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  }
}
