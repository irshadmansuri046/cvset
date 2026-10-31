import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, FileText, Target, ArrowRight, ArrowLeft, 
  CheckCircle2, Upload, RefreshCw, Check, Briefcase, 
  Layers, Copy, HelpCircle, FileCheck
} from 'lucide-react';
import { TEMPLATES } from '../constants/templates';
import { 
  parseJobDescription, 
  parseResumeText, 
  extractTextFromPdf,
  analyzeJobMatch, 
  tailorResumeToJob,
  SAMPLE_JOB_DESCRIPTIONS 
} from '../utils/jobMatcher';
import { getStoredResumes, createNewResume, saveResume, setActiveResumeId } from '../utils/storage';
import { DEFAULT_RESUME } from '../constants/sampleData';

export function CreateResumeModal({
  isOpen,
  onClose,
  initialMode = 'choice', // 'choice' | 'blank' | 'ai'
  onCreateBlank,
  onApplyTailoredResume,
  currentResume
}) {
  const [mode, setMode] = useState(initialMode); // 'choice' | 'blank' | 'ai'
  
  // Blank Resume Mode State
  const [blankTitle, setBlankTitle] = useState('My Professional Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('dublin');

  // AI Tailor Mode State
  const [aiStep, setAiStep] = useState(1); // 1: Input (CV + JD), 2: Generated Results
  const [jdText, setJdText] = useState('');
  const [cvSource, setCvSource] = useState('upload'); // 'upload' | 'paste' | 'existing'
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [pastedCvText, setPastedCvText] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState(currentResume?.id || 'cv-default-1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [activeDiffTab, setActiveDiffTab] = useState('summary');
  const [copySuccess, setCopySuccess] = useState(false);

  const storedResumes = getStoredResumes();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'choice');
      setAiStep(1);
      setCopySuccess(false);
      if (currentResume?.id) {
        setSelectedResumeId(currentResume.id);
      }
    }
  }, [isOpen, initialMode, currentResume]);

  if (!isOpen) return null;

  // Determine active candidate resume for AI tailor
  const getCandidateResume = () => {
    if (cvSource === 'upload' && uploadedResume) {
      return uploadedResume;
    }
    if (cvSource === 'paste' && pastedCvText.trim()) {
      return parseResumeText(pastedCvText) || currentResume || DEFAULT_RESUME;
    }
    if (cvSource === 'existing') {
      const found = storedResumes.find(r => r.id === selectedResumeId);
      return found || currentResume || DEFAULT_RESUME;
    }
    return uploadedResume || currentResume || DEFAULT_RESUME;
  };

  const candidateResume = getCandidateResume();

  // Handle file upload (PDF, JSON, TXT, MD)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result);
          setUploadedResume(parsed);
          setCvSource('upload');
        } catch (err) {
          alert('Could not parse JSON file. Please check format or paste as text.');
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.pdf')) {
      const extractedText = await extractTextFromPdf(file);
      if (extractedText) {
        const parsed = parseResumeText(extractedText);
        if (parsed) {
          setUploadedResume(parsed);
          setCvSource('upload');
        } else {
          alert('Extracted text from PDF, but could not detect sections. Please paste text directly.');
          setPastedCvText(extractedText);
          setCvSource('paste');
        }
      } else {
        alert('Could not automatically parse this PDF. Please copy and paste your resume text directly into the "Paste CV Text" tab.');
        setCvSource('paste');
      }
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const parsed = parseResumeText(content);
          if (parsed) {
            setUploadedResume(parsed);
            setCvSource('upload');
          } else {
            setPastedCvText(content);
            setCvSource('paste');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle Preset JD
  const handleApplyPreset = (presetId) => {
    const preset = SAMPLE_JOB_DESCRIPTIONS.find(p => p.id === presetId);
    if (preset) {
      setJdText(preset.description);
    }
  };

  // Submit Blank Resume
  const handleCreateBlankResume = () => {
    if (onCreateBlank) {
      onCreateBlank(blankTitle || 'My Resume', selectedTemplate);
    } else {
      const created = createNewResume(blankTitle || 'My Resume', selectedTemplate);
      if (onApplyTailoredResume) {
        onApplyTailoredResume(created);
      }
    }
    onClose();
  };

  // Submit AI Generation
  const handleRunAiGeneration = () => {
    if (!jdText.trim()) {
      alert('Please enter or paste the target Job Description.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const result = tailorResumeToJob(candidateResume, jdText);
      setTailorResult(result);
      setIsProcessing(false);
      setAiStep(2);
    }, 350);
  };

  // Apply AI Tailored Resume
  const handleApplyTailored = () => {
    if (!tailorResult?.tailoredResume) return;
    const tailored = tailorResult.tailoredResume;
    saveResume(tailored);
    setActiveResumeId(tailored.id);
    if (onApplyTailoredResume) {
      onApplyTailoredResume(tailored);
    }
    onClose();
  };

  const handleSaveAsNewTailored = () => {
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
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            {mode !== 'choice' && (
              <button
                type="button"
                onClick={() => {
                  if (mode === 'ai' && aiStep === 2) {
                    setAiStep(1);
                  } else {
                    setMode('choice');
                  }
                }}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition mr-1"
                title="Back to Options"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-xs">
              {mode === 'ai' ? <Target className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5 text-blue-400" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {mode === 'choice' && 'Create Your Resume'}
                  {mode === 'blank' && 'Option 1: Blank Resume (Manual Entry)'}
                  {mode === 'ai' && (aiStep === 1 ? 'Option 2: AI Tailor (Upload CV + Job Description)' : 'AI Tailored Resume Generated')}
                </h2>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {mode === 'choice' && 'Select how you would like to build your resume today.'}
                {mode === 'blank' && 'Choose a starting template and fill in your details manually.'}
                {mode === 'ai' && (aiStep === 1 ? 'Upload your existing CV and paste a job posting to generate an ATS-matched resume.' : 'Review your optimized resume and ATS score boost.')}
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

          {/* ========================================================== */}
          {/* SCREEN 1: THE 2 OPTIONS CHOICE SCREEN                      */}
          {/* ========================================================== */}
          {mode === 'choice' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  How would you like to create your resume?
                </h3>
                <p className="text-xs text-slate-500">
                  Select whether you want to start from scratch or use our AI algorithm to tailor your CV to a specific job opening.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* OPTION 1: BLANK RESUME */}
                <div 
                  onClick={() => setMode('blank')}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/20 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between group space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Classic Manual
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Option 1: Blank Resume (Manual)
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Start with a clean slate. Pick your starting template and manually fill in your personal details, work history, skills, and education.
                      </p>
                    </div>

                    <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Choose from 5 modern ATS templates</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Real-time ATS completeness score</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Pre-written phrase suggestions for every role</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMode('blank');
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-blue-600 group-hover:bg-blue-600 text-slate-800 group-hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>Create Blank Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* OPTION 2: AI RESUME TAILOR */}
                <div 
                  onClick={() => setMode('ai')}
                  className="p-6 rounded-2xl border-2 border-indigo-300 hover:border-indigo-600 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/30 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between group space-y-5 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase">
                        AI Recommended
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        Option 2: AI Tailor (Upload CV + Job Description)
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Upload your own CV and paste a target job description. The AI engine understands both and creates a job-matched resume to beat ATS screening.
                      </p>
                    </div>

                    <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-indigo-100/60">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Upload PDF, JSON, TXT, or paste resume text</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Paste job posting from LinkedIn, Indeed, etc.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Auto-aligns skills, keywords, and summary</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Shows Before vs. After ATS match score</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMode('ai');
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Upload CV & Paste Job Description</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SCREEN 2: OPTION 1 - BLANK RESUME BUILDER                   */}
          {/* ========================================================== */}
          {mode === 'blank' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Resume Name / Target Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer - New Application"
                  value={blankTitle}
                  onChange={(e) => setBlankTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Choose Starting Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        selectedTemplate === tpl.id
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{tpl.name}</span>
                        <span 
                          className="w-3 h-3 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: tpl.previewColor }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tpl.badge} • {tpl.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  ← Back to Options
                </button>
                <button
                  type="button"
                  onClick={handleCreateBlankResume}
                  className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <span>Start Editing Blank Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SCREEN 3: OPTION 2 - AI TAILOR (UPLOAD CV + JOB DESCRIPTION)*/}
          {/* ========================================================== */}
          {mode === 'ai' && (
            aiStep === 1 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Job Description Input */}
                <div className="lg:col-span-7 space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span>1. Paste Target Job Description (JD)</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {jdText.length} characters
                    </span>
                  </div>

                  {/* Sample JD Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">Try Sample JD:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('fullstack-senior')}
                      className="px-2.5 py-1 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition"
                    >
                      Senior Full Stack
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('frontend-lead')}
                      className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition"
                    >
                      Lead Frontend
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('devops-cloud')}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                    >
                      DevOps & Cloud
                    </button>
                  </div>

                  <div className="relative flex-1">
                    <textarea
                      rows={12}
                      placeholder="Paste the job description here... (e.g. from LinkedIn, Indeed, Glassdoor, etc.)&#10;&#10;Role: Senior Software Engineer&#10;Responsibilities: Build scalable web services with React and Node.js...&#10;Requirements: 5+ years experience with AWS, PostgreSQL, Docker..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      className="w-full h-full min-h-[250px] p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-slate-800"
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

                {/* Right Column: Upload Resume / Source */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>2. Upload Your Existing Resume (CV)</span>
                    </label>

                    {/* Source tabs */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-3 text-xs font-medium text-slate-600">
                      <button
                        type="button"
                        onClick={() => setCvSource('upload')}
                        className={`py-1.5 rounded-lg text-center transition ${
                          cvSource === 'upload' ? 'bg-white text-indigo-600 font-bold shadow-xs' : 'hover:text-slate-900'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setCvSource('paste')}
                        className={`py-1.5 rounded-lg text-center transition ${
                          cvSource === 'paste' ? 'bg-white text-indigo-600 font-bold shadow-xs' : 'hover:text-slate-900'
                        }`}
                      >
                        Paste Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setCvSource('existing')}
                        className={`py-1.5 rounded-lg text-center transition ${
                          cvSource === 'existing' ? 'bg-white text-indigo-600 font-bold shadow-xs' : 'hover:text-slate-900'
                        }`}
                      >
                        Saved CVs ({storedResumes.length})
                      </button>
                    </div>

                    {/* Upload File Box */}
                    {cvSource === 'upload' && (
                      <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl p-5 text-center bg-indigo-50/20 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.json,.txt,.md"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="cv-upload-modal-file"
                        />
                        <label htmlFor="cv-upload-modal-file" className="cursor-pointer space-y-2 block">
                          <div className="w-10 h-10 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">
                            {uploadedFileName ? `File: ${uploadedFileName}` : 'Click to Upload Your Resume'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Supports .pdf, .json, .txt, or .md
                          </p>
                          {uploadedResume && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Parsed: {uploadedResume.personalDetails?.firstName} {uploadedResume.personalDetails?.lastName}</span>
                            </div>
                          )}
                        </label>
                      </div>
                    )}

                    {/* Paste CV text */}
                    {cvSource === 'paste' && (
                      <textarea
                        rows={7}
                        placeholder="Paste your CV text here (Contact, Experience, Skills, Education)..."
                        value={pastedCvText}
                        onChange={(e) => setPastedCvText(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-100 text-slate-800"
                      />
                    )}

                    {/* Existing CV Select */}
                    {cvSource === 'existing' && (
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:ring-2 focus:ring-indigo-100"
                      >
                        {storedResumes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title} — {r.personalDetails?.jobTitle || 'No Title'}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Candidate Preview Card */}
                    <div className="mt-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Source</span>
                      <p className="text-xs font-bold text-slate-900">
                        {candidateResume.personalDetails?.firstName} {candidateResume.personalDetails?.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Title: <strong className="text-slate-700">{candidateResume.personalDetails?.jobTitle || 'Software Professional'}</strong> • {candidateResume.skills?.length || 0} skills
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    disabled={!jdText.trim() || isProcessing}
                    onClick={handleRunAiGeneration}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Generating Tailored Resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Generate Job-Matched Resume with AI</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* RESULTS AFTER AI GENERATION */
              tailorResult && (
                <div className="space-y-6">
                  {/* Score Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-amber-300">{tailorResult.afterScore}%</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase">ATS Match</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            Generated for "{tailorResult.newTitle}"
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                            +{tailorResult.scoreDelta}% Match Boost
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Original Match: <strong className="text-slate-100">{tailorResult.beforeScore}%</strong> → AI Tailored Match: <strong className="text-emerald-300">{tailorResult.afterScore}%</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setAiStep(1)}
                        className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                      >
                        ← Edit Inputs
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAsNewTailored}
                        className="px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition"
                      >
                        Save as New Resume
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyTailored}
                        className="px-4 py-2 text-xs font-bold bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Open in Editor</span>
                      </button>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Matched Skills ({tailorResult.matchedSkills?.length || 0})</span>
                        </span>
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
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Skills Injected from JD ({tailorResult.addedSkills?.length || 0})</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tailorResult.addedSkills?.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
                          >
                            + {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Diff Tabs */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">Preview Changes:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setActiveDiffTab('summary')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                              activeDiffTab === 'summary' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600'
                            }`}
                          >
                            Optimized Summary
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveDiffTab('skills')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                              activeDiffTab === 'skills' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600'
                            }`}
                          >
                            Skills Matrix ({tailorResult.tailoredResume?.skills?.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveDiffTab('experience')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                              activeDiffTab === 'experience' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600'
                            }`}
                          >
                            Enhanced Experience
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
                      {activeDiffTab === 'summary' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="line-through text-slate-400">{tailorResult.oldTitle}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {tailorResult.newTitle}
                            </span>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                            {tailorResult.tailoredSummary}
                          </div>
                        </div>
                      )}

                      {activeDiffTab === 'skills' && (
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
                                        dot <= s.level ? 'bg-indigo-600' : 'bg-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeDiffTab === 'experience' && (
                        <div className="space-y-4">
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
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Free • Unlimited CVs • Privacy Protected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg transition"
            >
              Cancel
            </button>
            {mode === 'ai' && aiStep === 2 && (
              <button
                type="button"
                onClick={handleApplyTailored}
                className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Open in Live Editor</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
