import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Layers, Maximize2, ShieldAlert } from 'lucide-react';

export function LayoutDiagnosticsPanel({ diagnostics = [], className = '' }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!diagnostics || diagnostics.length === 0) return null;

  const totalPages = diagnostics.length;
  const avgUtilization = Math.round(
    diagnostics.reduce((sum, d) => sum + (d.utilizationPercentage || 0), 0) / Math.max(1, totalPages)
  );
  const totalBlocks = diagnostics.reduce((sum, d) => sum + (d.blocksCount || 0), 0);
  const hasWarnings = diagnostics.some((d) => d.warnings && d.warnings.length > 0);

  return (
    <div className={`no-print bg-slate-900/95 text-slate-100 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md overflow-hidden text-xs transition-all ${className}`}>
      {/* Top Header Bar */}
      <div 
        onClick={() => setIsExpanded((prev) => !prev)}
        className="px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition select-none"
      >
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="font-bold tracking-tight text-white text-[12px]">Layout Telemetry & Diagnostics</span>
          <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
            {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
            avgUtilization >= 70 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
          }`}>
            Avg Util: {avgUtilization}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasWarnings && (
            <span className="flex items-center gap-1 text-amber-400 text-[10.5px] font-medium bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              <AlertTriangle className="w-3 h-3" />
              <span>Inspection Flag</span>
            </span>
          )}
          <button type="button" className="text-slate-400 hover:text-white p-0.5">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Telemetry Cards */}
      {isExpanded && (
        <div className="p-3.5 space-y-3 max-h-[380px] overflow-y-auto">
          {/* Summary Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-[10px]">Total Pages</div>
              <div className="font-bold text-white text-[13px]">{totalPages} A4 Sheets</div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-[10px]">Content Blocks</div>
              <div className="font-bold text-white text-[13px]">{totalBlocks} Blocks Placed</div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-[10px]">Printable Height</div>
              <div className="font-bold text-white text-[13px]">{diagnostics[0]?.printableHeight || 1033}px / Page</div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-[10px]">Space Efficiency</div>
              <div className="font-bold text-emerald-400 text-[13px]">{avgUtilization}% Utilized</div>
            </div>
          </div>

          {/* Per-Page Diagnostic Breakdown */}
          <div className="space-y-2">
            {diagnostics.map((diag) => {
              const utilPct = diag.utilizationPercentage || 0;
              const isLowUtil = utilPct < 55 && diag.pageNumber < totalPages;

              return (
                <div 
                  key={diag.pageNumber}
                  className={`p-2.5 rounded-lg border transition ${
                    isLowUtil 
                      ? 'bg-amber-950/20 border-amber-600/40' 
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-300 text-[11.5px]">
                        Page {diag.pageNumber}
                      </span>
                      <span className="text-slate-400 text-[10.5px]">
                        ({diag.layoutMode || 'full-width'})
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 text-[11px]">
                        {diag.blocksCount} Blocks
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-400">{diag.occupiedHeight}px / {diag.printableHeight}px</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[10.5px] ${
                        utilPct >= 70 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {utilPct}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        utilPct >= 70 ? 'bg-emerald-500' : utilPct >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, utilPct)}%` }}
                    />
                  </div>

                  {/* Warnings or Inspection Flags */}
                  {diag.warnings && diag.warnings.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {diag.warnings.map((w, wIdx) => (
                        <div key={wIdx} className="text-amber-300 text-[10.5px] flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Placement Decisions Log (First 2 decisions shown) */}
                  {diag.decisions && diag.decisions.length > 0 && (
                    <div className="mt-1.5 text-[10px] text-slate-400 font-mono flex flex-wrap gap-x-3 gap-y-0.5">
                      {diag.decisions
                        .filter((d) => d.action.includes('split') || d.action.includes('moved') || d.action.includes('pull'))
                        .map((d, dIdx) => (
                          <span key={dIdx} className="text-blue-300">
                            ↳ {d.action}: {d.blockId} ({d.reason || `${d.required}px needed`})
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Placed Blocks Bounding Box Telemetry */}
                  {diag.placedBlocks && diag.placedBlocks.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-700/40 text-[10px] text-slate-300 font-mono">
                      <div className="text-slate-400 font-semibold mb-1">Placed Content Bounding Boxes:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {diag.placedBlocks.map((b, bIdx) => (
                          <span key={bIdx} className="bg-slate-700/60 px-1.5 py-0.5 rounded border border-slate-600/50">
                            {b.type}: {b.title || b.id} ({b.height}px)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
