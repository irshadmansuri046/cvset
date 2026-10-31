import React from 'react';
import { FileText, Sparkles, Layout, CheckCircle, ShieldCheck, Target } from 'lucide-react';

export function Navbar({ onOpenDashboard, onStartNew, onGoHome, onOpenJobTailor }) {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2 group cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">cvset</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                100% Free
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Free Professional Resume Builder
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <a href="#templates" className="hover:text-blue-600 transition">
            Resume Templates
          </a>
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">
            How It Works
          </a>
          <a href="#faq" className="hover:text-blue-600 transition">
            FAQ
          </a>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-100">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>No Credit Card</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          {onOpenJobTailor && (
            <button
              type="button"
              onClick={onOpenJobTailor}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition"
              title="Tailor your CV to match any job description from LinkedIn/Indeed"
            >
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Match Job (JD)</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenDashboard}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
          >
            My Resumes
          </button>
          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Create My Resume</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
