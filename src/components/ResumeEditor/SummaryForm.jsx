import React, { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { SuggestionsModal } from './SuggestionsModal';

export function SummaryForm({ summary = '', onChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Professional Summary</h2>
            <p className="text-xs text-slate-500">
              Write 2-4 sentences summarizing your key achievements, strengths, and years of experience.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSuggestions(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition shadow-2xs shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Pre-Written Suggestions</span>
        </button>
      </div>

      <div>
        <textarea
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Results-driven Senior Full Stack Engineer with 7+ years of experience architecting high-scale web platforms..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-xs leading-relaxed text-slate-800"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
          <span>{summary.length < 50 ? 'Tip: Resumes with summaries longer than 50 characters pass ATS 40% more often.' : 'Great length!'}</span>
          <span>{summary.length} characters</span>
        </div>
      </div>

      <SuggestionsModal
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        type="summary"
        onSelectSummary={(text) => onChange(text)}
      />
    </div>
  );
}
