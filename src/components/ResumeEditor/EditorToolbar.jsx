import React, { useState } from 'react';
import { 
  ArrowLeft, Edit2, Check, Download, Printer, Share2, 
  Palette, Type, Layout, Sparkles, FileJson, Target 
} from 'lucide-react';
import { TEMPLATES, COLOR_THEMES, FONT_OPTIONS } from '../../constants/templates';
import { calculateAtsScore } from '../../utils/atsScore';
import { exportResumeAsJson } from '../../utils/storage';
import { exportResumeToPdf, printResume } from '../../utils/pdfExport';

export function EditorToolbar({
  resume = {},
  onChange,
  onBackToDashboard,
  onOpenScoreModal,
  onOpenJobTailor,
  onDownloadPdf
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resume?.title || 'Untitled Resume');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { score, level } = calculateAtsScore(resume);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onChange({ ...resume, title: titleInput.trim() });
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const firstName = resume.personalDetails?.firstName || 'resume';
    const lastName = resume.personalDetails?.lastName || 'cvset';
    const safeName = `${firstName}_${lastName}`.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const fileName = `${safeName || 'resume'}.pdf`;
    if (onDownloadPdf) {
      await onDownloadPdf(fileName);
    } else {
      await exportResumeToPdf('resume-preview-document', fileName);
    }
    setIsExporting(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
            title="Back to All Resumes"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">My Resumes</span>
          </button>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Editable Title */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="text-sm font-bold text-slate-800 border border-blue-400 rounded-md px-2 py-0.5 outline-hidden focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={handleTitleSubmit}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setTitleInput(resume.title);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 cursor-pointer group"
              title="Click to rename"
            >
              <h1 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition truncate max-w-[200px]">
                {resume.title || 'Untitled Resume'}
              </h1>
              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-blue-500 opacity-60 group-hover:opacity-100 transition" />
            </div>
          )}

          {/* Resume Completeness Meter */}
          <button
            type="button"
            onClick={onOpenScoreModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
              score >= 85
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : score >= 60
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title="Click to inspect ATS completeness tips"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score: {score}%</span>
          </button>

          {/* Match Job Description (JD) Button */}
          {onOpenJobTailor && (
            <button
              type="button"
              onClick={onOpenJobTailor}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition shadow-2xs"
              title="Tailor this CV to match any job description from LinkedIn or Indeed"
            >
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Match Job (JD)</span>
            </button>
          )}
        </div>

        {/* Center / Right Side: Controls & Export */}
        <div className="flex items-center gap-2">
          {/* Template Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTemplateMenu(!showTemplateMenu);
                setShowThemeMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            >
              <Layout className="w-3.5 h-3.5 text-slate-500" />
              <span>Template: <strong className="capitalize">{resume.template}</strong></span>
            </button>

            {showTemplateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Choose Template
                </div>
                <div className="space-y-1">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        onChange({ ...resume, template: tpl.id });
                        setShowTemplateMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                        resume.template === tpl.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: tpl.previewColor }}
                        />
                        <span>{tpl.name}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        {tpl.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color & Font Customizer Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowTemplateMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                style={{ backgroundColor: resume.themeColor || '#1a91f0' }}
              />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Accent Color
                </div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {COLOR_THEMES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onChange({ ...resume, themeColor: c.hex })}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                        resume.themeColor === c.hex ? 'ring-2 ring-blue-500 ring-offset-2 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {resume.themeColor === c.hex && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Typography
                </div>
                <div className="space-y-1">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onChange({ ...resume, fontFamily: f.id })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition ${
                        resume.fontFamily === f.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                      style={{ fontFamily: f.family }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export JSON backup */}
          <button
            type="button"
            onClick={() => exportResumeAsJson(resume)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            title="Export JSON Data Backup"
          >
            <FileJson className="w-4 h-4" />
          </button>

          {/* Quick Print */}
          <button
            type="button"
            onClick={printResume}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            title="Browser Print (Vector PDF)"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Primary CTA: Download PDF */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
