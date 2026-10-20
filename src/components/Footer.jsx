import React from 'react';
import { FileText, Heart, ShieldCheck, Zap } from 'lucide-react';

export function Footer({ onStartNew, onOpenDashboard }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">cvset</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              cvset is the free, ATS-friendly resume and CV builder modeled after industry-leading standards. Create multiple tailored resumes, use pre-written suggestions, and download high-resolution PDFs without any paywalls.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free & Privacy First</span>
            </div>
          </div>

          {/* Column: Templates */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">
              Popular Templates
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><button onClick={onStartNew} className="hover:text-white transition">Dublin (Modern 2-Column)</button></li>
              <li><button onClick={onStartNew} className="hover:text-white transition">Stockholm (ATS Minimalist)</button></li>
              <li><button onClick={onStartNew} className="hover:text-white transition">Sydney (Creative Banner)</button></li>
              <li><button onClick={onStartNew} className="hover:text-white transition">Harvard (Executive Serif)</button></li>
              <li><button onClick={onStartNew} className="hover:text-white transition">Berlin (Tech & Developer)</button></li>
            </ul>
          </div>

          {/* Column: Features */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">
              Features
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><span className="hover:text-white transition cursor-default">Real-Time Live Preview</span></li>
              <li><span className="hover:text-white transition cursor-default">Pre-Written Bullet Points</span></li>
              <li><span className="hover:text-white transition cursor-default">ATS Completeness Meter</span></li>
              <li><span className="hover:text-white transition cursor-default">Multiple CV Management</span></li>
              <li><span className="hover:text-white transition cursor-default">One-Click PDF Download</span></li>
              <li><span className="hover:text-white transition cursor-default">JSON Backup & Restore</span></li>
            </ul>
          </div>

          {/* Column: Quick Actions */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">
              Get Started
            </h4>
            <p className="text-slate-400 mb-4 text-xs">
              Ready to land your dream job? Join thousands of successful candidates using cvset.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onStartNew}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition text-center shadow-md"
              >
                Create Free CV
              </button>
              <button
                type="button"
                onClick={onOpenDashboard}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition text-center"
              >
                Go to My Resumes
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} cvset. All rights reserved. Free and open resume builder.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
            <span>for job seekers worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
