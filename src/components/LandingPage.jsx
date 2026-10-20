import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, 
  Download, FileText, Star, ChevronDown, ChevronUp, Layers, 
  Award, Clock, Check, Eye 
} from 'lucide-react';
import { TEMPLATES, COLOR_THEMES } from '../constants/templates';
import { DEFAULT_RESUME } from '../constants/sampleData';
import { DublinTemplate } from './ResumePreview/DublinTemplate';
import { StockholmTemplate } from './ResumePreview/StockholmTemplate';
import { SydneyTemplate } from './ResumePreview/SydneyTemplate';
import { HarvardTemplate } from './ResumePreview/HarvardTemplate';
import { BerlinTemplate } from './ResumePreview/BerlinTemplate';

export function LandingPage({ onStartResume, onOpenSample, onOpenDashboard }) {
  const [heroTemplate, setHeroTemplate] = useState('dublin');
  const [heroColor, setHeroColor] = useState('#1a91f0');
  const [openFaq, setOpenFaq] = useState(null);

  const previewResume = {
    ...DEFAULT_RESUME,
    template: heroTemplate,
    themeColor: heroColor
  };

  const templateMap = {
    dublin: DublinTemplate,
    stockholm: StockholmTemplate,
    sydney: SydneyTemplate,
    harvard: HarvardTemplate,
    berlin: BerlinTemplate
  };

  const ActiveHeroTemplate = templateMap[heroTemplate] || DublinTemplate;

  const faqs = [
    {
      q: "Is cvset really 100% free to use?",
      a: "Yes! Unlike other resume tools that force you into recurring subscriptions when you try to download, cvset lets you build, customize, and export high-resolution vector PDFs completely free without requiring a credit card."
    },
    {
      q: "Can I create multiple resumes for different job applications?",
      a: "Absolutely. With cvset, you can create unlimited resumes in your dashboard. You can duplicate existing resumes with a single click and tailor them specifically for different job postings and companies."
    },
    {
      q: "Are cvset templates compatible with Applicant Tracking Systems (ATS)?",
      a: "Yes. All our templates follow strict ATS parsing guidelines: structured headings, standard font hierarchies, machine-readable layouts, and clear chronological sequences tested against major ATS software."
    },
    {
      q: "How does cvset protect my personal information and privacy?",
      a: "Your resume data is saved directly in your browser's LocalStorage. It is never uploaded to any third-party marketing servers. You have complete ownership of your data and can export/import JSON backups anytime."
    },
    {
      q: "Can I edit and update my resumes later?",
      a: "Yes! Every change is automatically saved. When you return to cvset, all your resumes will be right in your dashboard ready to be edited, duplicated, or downloaded."
    }
  ];

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-blue-50/60 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold border border-blue-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Online Resume Builder • 100% Free Forever</span>
            </div>

            {/* Headline matching resume.io */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Only <span className="text-blue-600 underline decoration-blue-300 decoration-wavy decoration-2">2% of resumes</span> make it past the first round. <br className="hidden sm:inline" />
              Be in the top 2% with <span className="text-blue-600">cvset</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Create a recruiter-approved, ATS-compliant resume in minutes. Choose from modern templates, use pre-written phrases for your industry, and download for free.
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={onStartResume}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2 text-sm group"
              >
                <span>Create My Resume Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                type="button"
                onClick={onOpenSample}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition text-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Try Demo Sample</span>
              </button>
            </div>

            {/* Rating & Trust Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-800">4.9 / 5</span>
                <span>(45,000+ ratings)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-700 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Unlimited Free Multiple CVs</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Hero Preview Widget */}
          <div className="mt-12 md:mt-16 max-w-5xl mx-auto bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800">
            {/* Interactive Control Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Interactive Preview:</span>
                <span className="text-slate-400">Switch templates to see real-time formatting:</span>
              </div>

              {/* Template switcher pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setHeroTemplate(tpl.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                      heroTemplate === tpl.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tpl.previewColor }}
                    />
                    <span>{tpl.name}</span>
                  </button>
                ))}
              </div>

              {/* Color Picker dots */}
              <div className="hidden lg:flex items-center gap-1.5">
                {COLOR_THEMES.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setHeroColor(c.hex)}
                    className={`w-5 h-5 rounded-full transition ${
                      heroColor === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Live Resume Sheet inside Hero (fully scrollable, never truncated) */}
            <div className="pt-6 pb-4 flex justify-center">
              <div className="w-[794px] max-w-full max-h-[600px] overflow-y-auto bg-slate-800/40 p-2 sm:p-4 rounded-2xl border border-slate-700/60 shadow-inner flex justify-center">
                <div 
                  className="w-[794px] bg-white rounded-lg shadow-2xl overflow-visible border border-slate-200 pointer-events-none transform scale-[0.65] sm:scale-[0.78] md:scale-[0.85] origin-top my-2 shrink-0"
                  style={{ minHeight: '1123px' }}
                >
                  <ActiveHeroTemplate resume={previewResume} />
                </div>
              </div>
            </div>

            {/* Bottom Bar inside Hero Demo */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onStartResume}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <span>Customize this {heroTemplate.toUpperCase()} Template in cvset Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Social Proof Companies */}
          <div className="mt-16 text-center">
            <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-6">
              Our users have been hired by top technology companies worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-lg opacity-75">
              <span className="hover:text-slate-800 transition">Google</span>
              <span className="hover:text-slate-800 transition">Apple</span>
              <span className="hover:text-slate-800 transition">Microsoft</span>
              <span className="hover:text-slate-800 transition">Amazon</span>
              <span className="hover:text-slate-800 transition">Meta</span>
              <span className="hover:text-slate-800 transition">Netflix</span>
              <span className="hover:text-slate-800 transition">Tesla</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works 3 Steps */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Build your resume in under 10 minutes
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              cvset simplifies resume writing with smart assistance and intuitive controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">Pick a Tested Template</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from 5 recruiter-approved templates designed for high readability, modern typography, and 100% ATS compliance.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">Add Pre-Written Phrases</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stuck on what to write? Click our pre-written suggestions to insert role-specific achievement bullet points and executive summaries.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">Download Vector PDF Free</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect your real-time ATS score, customize color accents, and download clean printable PDFs with zero paywalls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                Professional Designs
              </h2>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed for every industry & career level
              </h3>
            </div>
            <button
              type="button"
              onClick={onStartResume}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              Start With Any Template →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition group"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-extrabold text-sm text-slate-900">{tpl.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {tpl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-normal">
                    {tpl.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartResume(tpl.id)}
                    className="w-full py-2 bg-white group-hover:bg-blue-600 group-hover:text-white border border-slate-300 group-hover:border-blue-600 text-slate-800 font-bold text-xs rounded-lg transition text-center shadow-2xs"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Why Choose cvset
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Features engineered for interview success
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Manage Multiple Resumes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create and tailor distinct versions of your resume for every job application. Duplicate, rename, and organize them in one unified dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">AI Pre-Written Suggestions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access dozens of high-impact achievement bullets and summaries for software engineering, product, marketing, design, and data roles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Real-Time ATS Score</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our dynamic ATS checker scores your profile completeness as you type and gives actionable advice to ensure you pass automated applicant screens.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Instant PDF & Print Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export crisp vector PDFs at 300 DPI or use native browser printing without any watermarks or hidden payment prompts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Live Real-Time Preview</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                See your resume transform synchronously as you type in the editor with responsive zoom controls and mobile split views.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Privacy & JSON Backup</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your data stays in your browser. Export JSON backups to keep your resumes permanently safe on your machine and restore anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Reviews & Success Stories
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by job seekers across top companies
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "I was tired of sites like resume.io charging \$30/month just to download my own resume. cvset is identical in quality, completely free, and landed me 4 interviews in two weeks!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  DK
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">David Kim</div>
                  <div className="text-[11px] text-slate-500">Software Engineer at Microsoft</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The pre-written bullet suggestions saved me hours of staring at a blank screen. Being able to duplicate my resume for different product management roles made all the difference."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  SL
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Sarah Lin</div>
                  <div className="text-[11px] text-slate-500">Senior Product Manager</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The ATS score meter showed me exactly where my resume was lacking. I added the recommended sections and received an offer within 30 days."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  MR
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Marcus Rodriguez</div>
                  <div className="text-[11px] text-slate-500">Data Analyst at Stripe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              Questions & Answers
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 flex justify-between items-center gap-4 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-100 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>100% Free • No Sign-Up Barrier • No Paywalls</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Build a resume that gets you hired today.
          </h2>

          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Take 5 minutes to create your professional, recruiter-approved resume and accelerate your career.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onStartResume}
              className="px-8 py-4 bg-white hover:bg-slate-100 text-blue-700 font-extrabold rounded-xl shadow-xl transition transform active:scale-98 text-sm inline-flex items-center gap-2 group"
            >
              <span>Create My Free Resume Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
