import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Printer, Scissors } from 'lucide-react';
import { DublinTemplate } from './DublinTemplate';
import { StockholmTemplate } from './StockholmTemplate';
import { SydneyTemplate } from './SydneyTemplate';
import { HarvardTemplate } from './HarvardTemplate';
import { BerlinTemplate } from './BerlinTemplate';
import { exportResumeToPdf, printResume } from '../../utils/pdfExport';

export function ResumeRenderer({ resume = {}, interactive = true }) {
  const [zoom, setZoom] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);
  const [paperHeight, setPaperHeight] = useState(1123);
  const paperRef = useRef(null);

  const templateMap = {
    dublin: DublinTemplate,
    stockholm: StockholmTemplate,
    sydney: SydneyTemplate,
    harvard: HarvardTemplate,
    berlin: BerlinTemplate
  };

  const TemplateComponent = templateMap[resume?.template] || DublinTemplate;

  // Measure content height whenever resume changes or paper is rendered
  useEffect(() => {
    const updateHeight = () => {
      if (paperRef.current) {
        const measured = paperRef.current.offsetHeight || 1123;
        setPaperHeight(Math.max(1123, measured));
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined' && paperRef.current) {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(paperRef.current);
      return () => observer.disconnect();
    }
  }, [resume]);

  const handleZoomIn = () => setZoom((prev) => Math.min(1.4, Math.round((prev + 0.1) * 100) / 100));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, Math.round((prev - 0.1) * 100) / 100));
  const handleResetZoom = () => setZoom(0.85);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const firstName = resume.personalDetails?.firstName || 'resume';
    const lastName = resume.personalDetails?.lastName || 'cvset';
    const safeName = `${firstName}_${lastName}`.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const fileName = `${safeName || 'resume'}.pdf`;
    // Targets live preview document directly for 100% fidelity
    await exportResumeToPdf('resume-preview-document', fileName);
    setIsExporting(false);
  };

  // Calculate page breaks for multi-page resumes (A4 height is 1123px at 96 DPI)
  const totalPages = Math.ceil(paperHeight / 1123);
  const breakMarkers = [];
  for (let page = 1; page < totalPages; page++) {
    breakMarkers.push(page * 1123);
  }

  return (
    <div className="flex flex-col h-full bg-slate-200/90 rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
      {/* Preview Top Control Bar */}
      {interactive && (
        <div className="no-print bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 z-10 shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">Live Resume Preview</span>
            <span className="text-slate-400 font-normal">({Math.round(zoom * 100)}%)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 hover:bg-white rounded transition text-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-0.5 hover:bg-white rounded transition text-slate-700 text-[11px] font-semibold"
                title="Reset Zoom (85%)"
              >
                Fit
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 hover:bg-white rounded transition text-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Print Button */}
            <button
              type="button"
              onClick={printResume}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-700 border border-slate-200"
              title="Browser Vector Print"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Preview Canvas with Exact Scaled Box */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex justify-center items-start">
        {/* Outer resizer reserving exact layout footprint including all pages */}
        <div 
          className="relative transition-all duration-100 flex justify-center"
          style={{
            width: `${794 * zoom}px`,
            height: `${paperHeight * zoom}px`,
            minHeight: `${1123 * zoom}px`
          }}
        >
          {/* Scaled resume wrapper */}
          <div
            style={{
              width: '794px',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              position: 'absolute',
              top: 0
            }}
          >
            <div 
              id="resume-preview-document"
              ref={paperRef}
              className="resume-paper w-[794px] bg-white text-slate-800 shadow-2xl relative"
              style={{ minHeight: '1123px' }}
            >
              <TemplateComponent resume={resume} />

              {/* Dynamic Page Break Markers for all pages */}
              {breakMarkers.map((breakTop, idx) => (
                <div 
                  key={breakTop}
                  className="no-print absolute left-0 right-0 border-b-2 border-dashed border-red-400/60 pointer-events-none flex items-center justify-end pr-4 text-[10px] text-red-500 font-mono"
                  style={{ top: `${breakTop}px` }}
                >
                  <span className="bg-red-50 px-2 py-0.5 rounded border border-red-200 shadow-2xs">
                    --- End of Page {idx + 1} / A4 Page Break ---
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
