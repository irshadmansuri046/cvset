import React from 'react';
import { X, CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';
import { calculateAtsScore } from '../../utils/atsScore';

export function ScoreModal({ resume = {}, isOpen, onClose }) {
  if (!isOpen) return null;

  const { score, level, color, items } = calculateAtsScore(resume);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Resume Analysis</span>
            </div>
            <h2 className="text-xl font-bold">Resume Score: {score}/100</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white mt-2 border border-white/20">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{level}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div
            className={`h-full transition-all duration-500 ${
              score >= 85 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Checklist Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3.5">
          <p className="text-xs text-slate-500 font-medium">
            Applicant Tracking Systems (ATS) and hiring recruiters scan for clear formatting, measurable achievements, and key skills. Follow this checklist to maximize your score:
          </p>

          <div className="space-y-2.5 pt-1">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition ${
                  item.passed
                    ? 'bg-emerald-50/50 border-emerald-100 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className={`text-xs font-semibold ${item.passed ? 'text-emerald-950' : 'text-slate-800'}`}>
                        {item.label}
                      </span>
                      <span className="text-[11px] font-mono font-medium text-slate-400">
                        +{item.points} pts
                      </span>
                    </div>
                    {item.tip && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        {item.tip}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Got it, continue editing
          </button>
        </div>
      </div>
    </div>
  );
}
