import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Download, Printer, Scissors, FileText, Bug } from 'lucide-react';
import { DublinTemplate } from './DublinTemplate';
import { StockholmTemplate } from './StockholmTemplate';
import { SydneyTemplate } from './SydneyTemplate';
import { HarvardTemplate } from './HarvardTemplate';
import { BerlinTemplate } from './BerlinTemplate';
import { GraphiteTemplate } from './GraphiteTemplate';
import { OsloTemplate } from './OsloTemplate';
import { LayoutDiagnosticsPanel } from './LayoutDiagnosticsPanel';
import { exportResumeToPdf, printResume } from '../../utils/pdfExport';
import { adjustPageBreakPadding, A4_PAGE_HEIGHT_PX, DEFAULT_PAGE_BREAK_PADDING } from '../../utils/pageBreaks';
import { paginateResume } from '../../utils/dynamicPaginator';

export function ResumeRenderer({ resume = {}, interactive = true }) {
  const [zoom, setZoom] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);
  const [paperHeight, setPaperHeight] = useState(A4_PAGE_HEIGHT_PX);
  const [pageBreakPadding, setPageBreakPadding] = useState(DEFAULT_PAGE_BREAK_PADDING);
  const [debugLayout, setDebugLayout] = useState(false);
  const paperRef = useRef(null);

  const templateMap = {
    dublin: DublinTemplate,
    stockholm: StockholmTemplate,
    sydney: SydneyTemplate,
    harvard: HarvardTemplate,
    berlin: BerlinTemplate,
    graphite: GraphiteTemplate,
    oslo: OsloTemplate
  };

  const TemplateComponent = templateMap[resume?.template] || DublinTemplate;

  // Calculate dynamic telemetry and pagination metadata
  const paginationMeta = paginateResume(resume, {
    template: resume?.template || 'dublin',
    pagePadding: pageBreakPadding
  });

  // Measure content height and adjust layout whenever resume, template, or padding changes
  useEffect(() => {
    let isMounted = true;

    const updateLayout = () => {
      if (!isMounted || !paperRef.current || typeof window === 'undefined') return;

      const pageEls = paperRef.current.querySelectorAll('.resume-page');
      if (pageEls.length > 0) {
        // Template uses true discrete A4 page containers
        const calculatedHeight = pageEls.length * A4_PAGE_HEIGHT_PX + Math.max(0, pageEls.length - 1) * 24;
        setPaperHeight(calculatedHeight);
      } else {
        // Legacy template using continuous canvas
        adjustPageBreakPadding(paperRef.current, pageBreakPadding, A4_PAGE_HEIGHT_PX);

        const offsetH = paperRef.current.offsetHeight || 0;
        const scrollH = paperRef.current.scrollHeight || 0;
        let maxChildH = 0;
        if (paperRef.current.firstElementChild) {
          const child = paperRef.current.firstElementChild;
          maxChildH = Math.max(child.scrollHeight || 0, child.offsetHeight || 0);
          Array.from(child.children || []).forEach((c) => {
            const b = (c.offsetTop || 0) + (c.offsetHeight || 0);
            if (b > maxChildH) maxChildH = b;
          });
        }
        const measured = Math.max(A4_PAGE_HEIGHT_PX, offsetH, scrollH, maxChildH);
        setPaperHeight(measured);
      }
    };

    updateLayout();

    const timer = setTimeout(updateLayout, 20);

    let observer = null;
    if (typeof ResizeObserver !== 'undefined' && paperRef.current) {
      observer = new ResizeObserver(updateLayout);
      observer.observe(paperRef.current);
    }

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [resume, pageBreakPadding, debugLayout]);

  const handleZoomIn = () => setZoom((prev) => Math.min(1.4, Math.round((prev + 0.1) * 100) / 100));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, Math.round((prev - 0.1) * 100) / 100));
  const handleResetZoom = () => setZoom(0.85);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const firstName = resume.personalDetails?.firstName || 'resume';
    const lastName = resume.personalDetails?.lastName || 'cvset';
    const safeName = `${firstName}_${lastName}`.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const fileName = `${safeName || 'resume'}.pdf`;
    await exportResumeToPdf('resume-preview-document', fileName);
    setIsExporting(false);
  };

  // Calculate page count and break markers for multi-page resumes
  const discretePages = paperRef.current?.querySelectorAll('.resume-page');
  const hasDiscretePages = discretePages && discretePages.length > 0;
  const totalPages = hasDiscretePages
    ? discretePages.length
    : Math.max(1, Math.ceil((paperHeight - 15) / A4_PAGE_HEIGHT_PX));

  const breakMarkers = [];
  if (!hasDiscretePages) {
    for (let page = 1; page < totalPages; page++) {
      breakMarkers.push(page * A4_PAGE_HEIGHT_PX);
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-200/90 rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
      {/* Preview Top Control Bar */}
      {interactive && (
        <div className="no-print bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 z-10 shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">Live Resume Preview</span>
            <span className="text-slate-400 font-normal">({Math.round(zoom * 100)}%)</span>
            {hasDiscretePages && (
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Page Break Padding Controls */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              <span className="px-1.5 text-[11px] text-slate-500 font-medium hidden sm:inline" title="Adjust page breaker padding between pages">
                Page Pad:
              </span>
              {[
                { label: '20px', value: 20, name: 'Compact' },
                { label: '28px', value: 28, name: 'Balanced' },
                { label: '40px', value: 40, name: 'Spacious' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPageBreakPadding(opt.value)}
                  className={`px-2 py-0.5 rounded font-semibold text-[11px] transition ${
                    pageBreakPadding === opt.value
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`${opt.name} page breaker padding (${opt.value}px)`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Developer Layout Debugging Button */}
            <button
              type="button"
              onClick={() => setDebugLayout((prev) => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                debugLayout
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-white text-slate-700 border-slate-200'
              }`}
              title="Toggle PDF Layout Debugging overlay and boundary markers"
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Debug Layout</span>
            </button>

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

      {/* Developer Layout Diagnostics Overlay Panel */}
      {interactive && debugLayout && (
        <div className="px-4 sm:px-6 pt-3 shrink-0">
          <LayoutDiagnosticsPanel diagnostics={paginationMeta.diagnostics} />
        </div>
      )}

      {/* Scrollable Preview Canvas with Exact Scaled Box */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex justify-center items-start">
        {/* Outer resizer reserving exact layout footprint including all pages */}
        <div 
          className="resume-zoom-outer relative transition-all duration-100 flex justify-center"
          style={{
            width: `${794 * zoom}px`,
            height: `${paperHeight * zoom}px`,
            minHeight: `${A4_PAGE_HEIGHT_PX * zoom}px`
          }}
        >
          {/* Scaled resume wrapper */}
          <div
            className="resume-zoom-wrapper"
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
              data-paper-height={paperHeight}
              data-total-pages={totalPages}
              data-page-break-padding={pageBreakPadding}
              className="resume-paper w-[794px] bg-transparent text-slate-800 relative"
              style={{ minHeight: `${A4_PAGE_HEIGHT_PX}px` }}
            >
              <TemplateComponent 
                resume={resume} 
                debug={debugLayout} 
                pagePadding={pageBreakPadding} 
              />

              {/* Dynamic Page Break Markers & Padding Zones for Legacy Single-Canvas Templates */}
              {!hasDiscretePages && breakMarkers.map((breakTop, idx) => (
                <div 
                  key={breakTop}
                  className="no-print absolute left-0 right-0 pointer-events-none select-none z-10"
                  style={{ 
                    top: `${breakTop - pageBreakPadding}px`,
                    height: `${pageBreakPadding * 2}px`
                  }}
                >
                  <div className="w-full h-full relative flex flex-col justify-center">
                    <div className="absolute top-0 left-0 right-0 border-b border-dashed border-slate-300/60" />
                    <div className="w-full h-0 border-b-2 border-dashed border-blue-400/80 shadow-xs relative flex items-center justify-between px-3">
                      <div className="bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-slate-300/80 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>Page {idx + 1}</span>
                      </div>
                      <div className="bg-slate-900/90 text-white px-3 py-0.5 rounded-full shadow-md flex items-center gap-1.5 text-[10px] font-mono tracking-tight font-medium">
                        <Scissors className="w-3 h-3 text-blue-400" />
                        <span>Page Break</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-blue-300">{pageBreakPadding}px Pad</span>
                      </div>
                      <div className="bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-slate-300/80 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                        <span>Page {idx + 2}</span>
                        <FileText className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 border-t border-dashed border-slate-300/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
