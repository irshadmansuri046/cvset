import React, { useState, useEffect } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { PersonalDetailsForm } from './PersonalDetailsForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { AdditionalSectionsForm } from './AdditionalSectionsForm';
import { ResumeRenderer } from '../ResumePreview/ResumeRenderer';
import { ScoreModal } from './ScoreModal';
import { saveResume } from '../../utils/storage';
import { Eye, Edit3, Check } from 'lucide-react';
import { DEFAULT_RESUME } from '../../constants/sampleData';
import { exportResumeToPdf } from '../../utils/pdfExport';

export function ResumeEditor({ 
  initialResume = DEFAULT_RESUME, 
  onBackToDashboard,
  onOpenJobTailor 
}) {
  const [resume, setResume] = useState(initialResume || DEFAULT_RESUME);
  const [activeTab, setActiveTab] = useState('editor'); // for mobile: 'editor' or 'preview'
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);

  useEffect(() => {
    if (initialResume) {
      setResume(initialResume);
    }
  }, [initialResume?.id, initialResume?.updatedAt]);

  // Auto-save on change
  const handleChange = (updatedResume) => {
    setResume(updatedResume);
    saveResume(updatedResume);
    setLastSaved(true);
    setTimeout(() => setLastSaved(false), 1500);
  };

  const handleDownloadPdf = async (fileName) => {
    // If user is on mobile editor tab, switch to preview tab so resume is visible for capture
    if (activeTab === 'editor') {
      setActiveTab('preview');
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    await exportResumeToPdf('resume-preview-document', fileName);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Top sticky navigation toolbar */}
      <div className="no-print">
        <EditorToolbar
          resume={resume}
          onChange={handleChange}
          onBackToDashboard={onBackToDashboard}
          onOpenScoreModal={() => setShowScoreModal(true)}
          onOpenJobTailor={() => onOpenJobTailor && onOpenJobTailor(resume)}
          onDownloadPdf={handleDownloadPdf}
        />
      </div>

      {/* Mobile Tab Switcher */}
      <div className="no-print lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'editor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Form</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor (never printed) */}
        <div className={`no-print lg:col-span-6 xl:col-span-6 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Subtle auto-save status bar */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-500">
            <span className="font-medium text-slate-600">CV Sections & Content</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <Check className="w-3 h-3" />
              <span>{lastSaved ? 'Saving changes...' : 'Auto-saved to cvset'}</span>
            </span>
          </div>

          <PersonalDetailsForm
            details={resume.personalDetails}
            onChange={(personalDetails) => handleChange({ ...resume, personalDetails })}
          />

          <SummaryForm
            summary={resume.summary}
            onChange={(summary) => handleChange({ ...resume, summary })}
          />

          <ExperienceForm
            experiences={resume.employmentHistory}
            onChange={(employmentHistory) => handleChange({ ...resume, employmentHistory })}
          />

          <SkillsForm
            skills={resume.skills}
            onChange={(skills) => handleChange({ ...resume, skills })}
          />

          <EducationForm
            education={resume.education}
            onChange={(education) => handleChange({ ...resume, education })}
          />

          <AdditionalSectionsForm
            resume={resume}
            onChange={handleChange}
          />
        </div>

        {/* Right Column: Live Sticky Preview (6 cols on lg) */}
        <div className={`lg:col-span-6 xl:col-span-6 lg:sticky lg:top-18 h-[calc(100vh-5.5rem)] ${activeTab === 'editor' ? 'hidden lg:block print:!block' : 'block'}`}>
          <ResumeRenderer resume={resume} interactive={true} />
        </div>
      </div>

      {/* ATS Score Modal */}
      <ScoreModal
        resume={resume}
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
      />
    </div>
  );
}
