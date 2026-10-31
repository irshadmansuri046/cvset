import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Target, ArrowRight, CheckCircle2, AlertCircle, 
  Upload, FileText, RefreshCw, Zap, Check, ChevronRight,
  Briefcase, Award, TrendingUp, Sliders, Copy, Download
} from 'lucide-react';
import { 
  parseJobDescription, 
  parseResumeText, 
  analyzeJobMatch, 
  tailorResumeToJob,
  SAMPLE_JOB_DESCRIPTIONS 
} from '../utils/jobMatcher';
import { getStoredResumes, saveResume, setActiveResumeId, createNewResume } from '../utils/storage';
import { DEFAULT_RESUME } from '../constants/sampleData';

export function JobTailorModal({
  isOpen,
  onClose,
  currentResume,
  onApplyTailoredResume
}) {
  const [step, setStep] = useState(1); // 1: Input, 2: Match & Tailored Results
  const [jdText, setJdText] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState(currentResume?.id || 'cv-default-1');
  const [resumeSource, setResumeSource] = useState('existing'); // 'existing' | 'upload' | 'paste'
  const [pastedCvText, setPastedCvText] = useState('');
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [activeDiffTab, setActiveDiffTab] = useState('summary'); // 'summary' | 'skills' | 'experience'
  const [copySuccess, setCopySuccess] = useState(false);

  const storedResumes = getStoredResumes();

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      if (currentResume?.id) {
        setSelectedResumeId(currentResume.id);
      }
      setStep(1);
      setCopySuccess(false);
    }
  }, [isOpen, currentResume]);

  if (!isOpen) return null;

  // Determine active candidate resume
  const getCandidateResume = () => {
    if (resumeSource === 'paste' && pastedCvText.trim()) {
      return parseResumeText(pastedCvText) || currentResume || DEFAULT_RESUME;
    }
    if (resumeSource === 'upload' && uploadedResume) {
      return uploadedResume;
    }
    const found = storedResumes.find(r => r.id === selectedResumeId);
    return found || currentResume || DEFAULT_RESUME;
  };

  const candidateResume = getCandidateResume();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          setUploadedResume(parsed);
          setResumeSource('upload');
        } catch (err) {
          alert('Could not parse JSON file. Please check format or paste as text.');
        }
      } else {
        // Plain text or markdown
        const parsed = parseResumeText(content);
        if (parsed) {
          setUploadedResume(parsed);
          setResumeSource('upload');
        } else {
          alert('Could not extract sections from text file. You can paste the text directly.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPreset = (presetId) => {
    const preset = SAMPLE_JOB_DESCRIPTIONS.find(p => p.id === presetId);
    if (preset) {
      setJdText(preset.description);
    }
  };

  const handleAnalyzeAndTailor = () => {
    if (!jdText.trim()) {
      alert('Please enter or paste a Job Description.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const result = tailorResumeToJob(candidateResume, jdText);
      setTailorResult(result);
      setIsProcessing(false);
      setStep(2);
    }, 300);
  };

  const handleApplyToEditor = () => {
    if (!tailorResult?.tailoredResume) return;
    const tailored = tailorResult.tailoredResume;
    saveResume(tailored);
    setActiveResumeId(tailored.id);
    if (onApplyTailoredResume) {
      onApplyTailoredResume(tailored);
    }
    onClose();
  };

  const handleSaveAsNew = () => {
    if (!tailorResult?.tailoredResume) return;
    const newId = "cv-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
    const saved = {
      ...tailorResult.tailoredResume,
      id: newId,
      title: `${tailorResult.newTitle} (Tailored)`
    };
    saveResume(saved);
    setActiveResumeId(newId);
    if (onApplyTailoredResume) {
      onApplyTailoredResume(saved);
    }
    onClose();
  };

  const handleCopySummary = () => {
    if (tailorResult?.tailoredSummary) {
      navigator.clipboard.writeText(tailorResult.tailoredSummary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-xs">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Match Job Description & Tailor CV
                </h2>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Paste any job posting from LinkedIn, Indeed, or career portals to align your CV with ATS algorithms.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 1 ? (
            /* STEP 1: INPUT JD & SELECT CV */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Job Description Input */}
              <div className="lg:col-span-7 space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>1. Paste Target Job Description (JD)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {jdText.length} characters
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Try Sample JD:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('fullstack-senior')}
                    className="px-2 py-1 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition"
                  >
                    Senior Full Stack
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('frontend-lead')}
                    className="px-2 py-1 text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition"
                  >
                    Lead Frontend
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('devops-cloud')}
                    className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                  >
                    DevOps & Cloud
                  </button>
                </div>

                <div className="relative flex-1">
                  <textarea
                    rows={13}
                    placeholder="Paste the job description here... (e.g. from LinkedIn, Indeed, Wellfound, Monster)&#10;&#10;Example:&#10;Role: Senior Software Engineer&#10;Responsibilities: Architect cloud microservices with React & Node.js...&#10;Requirements: 5+ years experience with AWS, PostgreSQL, Docker..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="w-full h-full min-h-[260px] p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-800"
                  />
                  {jdText && (
                    <button
                      type="button"
                      onClick={() => setJdText('')}
                      className="absolute top-2 right-2 px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700 bg-white/80 rounded border border-slate-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: CV Source Selection */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>2. Candidate CV to Match & Tailor</span>
                  </label>

                  {/* Tabs: Existing CV / Upload / Paste */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-3 text-xs font-medium text-slate-600">
                    <button
                      type="button"
                      onClick={() => setResumeSource('existing')}
                      className={`py-1.5 rounded-lg text-center transition ${
                        resumeSource === 'existing' ? 'bg-white text-blue-600 font-bold shadow-xs' : 'hover:text-slate-900'
                      }`}
                    >
                      My CVs ({storedResumes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeSource('upload')}
                      className={`py-1.5 rounded-lg text-center transition ${
                        resumeSource === 'upload' ? 'bg-white text-blue-600 font-bold shadow-xs' : 'hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeSource('paste')}
                      className={`py-1.5 rounded-lg text-center transition ${
                        resumeSource === 'paste' ? 'bg-white text-blue-600 font-bold shadow-xs' : 'hover:text-slate-900'
                      }`}
                    >
                      Paste Text
                    </button>
                  </div>

                  {/* Tab 1: Existing CV Selector */}
                  {resumeSource === 'existing' && (
                    <div className="space-y-2">
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      >
                        {storedResumes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title} — {r.personalDetails?.jobTitle || 'No Title'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Tab 2: Upload File */}
                  {resumeSource === 'upload' && (
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center bg-slate-50/50 cursor-pointer">
                      <input
                        type="file"
                        accept=".json,.txt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="cv-file-upload-input"
                      />
                      <label htmlFor="cv-file-upload-input" className="cursor-pointer space-y-2 block">
                        <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">
                          Click to upload your CV
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Supports .json (cvset export), .txt, or .md
                        </p>
                        {uploadedResume && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Loaded: {uploadedResume.personalDetails?.firstName} {uploadedResume.personalDetails?.lastName}</span>
                          </div>
                        )}
                      </label>
                    </div>
                  )}

                  {/* Tab 3: Paste CV Text */}
                  {resumeSource === 'paste' && (
                    <textarea
                      rows={8}
                      placeholder="Paste your resume text here (Name, Contact, Experience, Skills)..."
                      value={pastedCvText}
                      onChange={(e) => setPastedCvText(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-100 text-slate-800"
                    />
                  )}

                  {/* Selected CV Profile Badge */}
                  <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-blue-50/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Candidate Preview</span>
                      <span className="text-blue-600 uppercase text-[10px] tracking-wider">Ready to Match</span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p className="font-bold text-slate-900">
                        {candidateResume.personalDetails?.firstName} {candidateResume.personalDetails?.lastName}
                      </p>
                      <p className="text-slate-500">
                        Current Title: <strong className="text-slate-700">{candidateResume.personalDetails?.jobTitle || 'Software Engineer'}</strong>
                      </p>
                      <p className="text-slate-500">
                        Existing Skills: {candidateResume.skills?.length || 0} skills listed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  disabled={!jdText.trim() || isProcessing}
                  onClick={handleAnalyzeAndTailor}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing & Algorithmic Tailoring...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Run ATS Match & Tailor My CV</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: RESULTS & TAILORED CV DIFF */
            tailorResult && (
              <div className="space-y-6">
                {/* Match Score Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-amber-300">{tailorResult.afterScore}%</span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase">ATS Match</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          Tailored for "{tailorResult.newTitle}"
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                          +{tailorResult.scoreDelta}% Match Boost
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Before: <strong className="text-slate-100">{tailorResult.beforeScore}%</strong> → After Optimization: <strong className="text-emerald-300">{tailorResult.afterScore}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      ← Edit Inputs
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAsNew}
                      className="px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition"
                    >
                      Save as New Resume
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyToEditor}
                      className="px-4 py-2 text-xs font-bold bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Open in Editor</span>
                    </button>
                  </div>
                </div>

                {/* Skills & Keywords Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matched Keywords */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Matched Required Skills ({tailorResult.matchedSkills?.length || 0})</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold uppercase">Validated</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tailorResult.matchedSkills?.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200"
                        >
                          ✓ {s.name}
                        </span>
                      ))}
                      {(!tailorResult.matchedSkills || tailorResult.matchedSkills.length === 0) && (
                        <span className="text-xs text-slate-400">None detected initially</span>
                      )}
                    </div>
                  </div>

                  {/* Newly Injected / Aligned Skills */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>Skills Aligned to Match JD ({tailorResult.addedSkills?.length || 0})</span>
                      </span>
                      <span className="text-[10px] text-blue-700 font-semibold uppercase">Added</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tailorResult.addedSkills?.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
                        >
                          + {s.name} (Proficiency: {s.level}/5)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Diff Viewer Tabs */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Preview Changes:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveDiffTab('summary')}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                            activeDiffTab === 'summary' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Optimized Summary
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDiffTab('skills')}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                            activeDiffTab === 'skills' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Skills Alignment ({tailorResult.tailoredResume?.skills?.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDiffTab('experience')}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                            activeDiffTab === 'experience' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Experience Bullets
                        </button>
                      </div>
                    </div>

                    {activeDiffTab === 'summary' && (
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white rounded-md border border-slate-200 transition"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copySuccess ? 'Copied!' : 'Copy Summary'}</span>
                      </button>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Summary Tab */}
                    {activeDiffTab === 'summary' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Original Title vs. Target Title
                          </span>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="line-through text-slate-400">{tailorResult.oldTitle}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {tailorResult.newTitle}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Tailored ATS-Optimized Professional Summary
                          </span>
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                            {tailorResult.tailoredSummary}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Skills Tab */}
                    {activeDiffTab === 'skills' && (
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Re-ordered & Aligned Skills Taxonomy (Highest JD Relevance First)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {tailorResult.tailoredResume?.skills?.map((s) => (
                            <div
                              key={s.id || s.name}
                              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                            >
                              <span className="text-xs font-semibold text-slate-800 line-clamp-1">{s.name}</span>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                                <span>Level {s.level}/5</span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((dot) => (
                                    <span
                                      key={dot}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        dot <= s.level ? 'bg-blue-600' : 'bg-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Bullets Tab */}
                    {activeDiffTab === 'experience' && (
                      <div className="space-y-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Tailored Work Experience (Primary Role Enhanced with JD Focus)
                        </span>
                        {tailorResult.tailoredResume?.employmentHistory?.map((exp, idx) => (
                          <div key={exp.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <div className="flex justify-between items-start text-xs font-bold text-slate-800">
                              <span>{exp.jobTitle} at {exp.employer}</span>
                              <span className="text-slate-400 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                              {exp.description}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Client-side algorithm • Private & 100% Free</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg transition"
            >
              Cancel
            </button>
            {step === 2 && (
              <button
                type="button"
                onClick={handleApplyToEditor}
                className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Live Editor</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
