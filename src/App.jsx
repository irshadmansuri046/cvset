import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ResumeEditor } from './components/ResumeEditor/ResumeEditor';
import { CreateResumeModal } from './components/CreateResumeModal';
import { JobTailorModal } from './components/JobTailorModal';
import { getStoredResumes, createNewResume, setActiveResumeId, getActiveResumeId } from './utils/storage';
import { DEFAULT_RESUME } from './constants/sampleData';

export function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'editor'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalInitialMode, setCreateModalInitialMode] = useState('choice'); // 'choice' | 'blank' | 'ai'
  const [showJobTailorModal, setShowJobTailorModal] = useState(false);
  const [tailorTargetResume, setTailorTargetResume] = useState(null);
  const [activeResume, setActiveResume] = useState(() => {
    try {
      const resumes = getStoredResumes();
      const activeId = getActiveResumeId();
      return resumes.find((r) => r.id === activeId) || resumes[0] || DEFAULT_RESUME;
    } catch (e) {
      return DEFAULT_RESUME;
    }
  });

  // Open the 2-option creation modal (Choice / Blank / AI)
  const handleOpenCreateModal = (mode = 'choice') => {
    setCreateModalInitialMode(mode);
    setShowCreateModal(true);
  };

  // Create Blank Resume
  const handleCreateBlankResume = (title = 'My Resume', template = 'dublin') => {
    const newResume = createNewResume(title, template);
    setActiveResume(newResume);
    setActiveResumeId(newResume.id);
    setView('editor');
  };

  const handleOpenSample = () => {
    const resumes = getStoredResumes();
    const sample = resumes.find(r => r.id === 'cv-default-1') || DEFAULT_RESUME;
    setActiveResume(sample);
    setActiveResumeId(sample.id);
    setView('editor');
  };

  const handleSelectResume = (resume) => {
    setActiveResume(resume);
    setActiveResumeId(resume.id);
    setView('editor');
  };

  const handleOpenJobTailor = (resumeToTailor) => {
    setTailorTargetResume(resumeToTailor || activeResume);
    setShowJobTailorModal(true);
  };

  const handleApplyTailoredResume = (tailored) => {
    setActiveResume(tailored);
    setActiveResumeId(tailored.id);
    setView('editor');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      {/* If in editor view, render full-screen editor with its own toolbar */}
      {view === 'editor' && activeResume ? (
        <ResumeEditor
          initialResume={activeResume}
          onBackToDashboard={() => setView('dashboard')}
          onOpenJobTailor={handleOpenJobTailor}
        />
      ) : view === 'dashboard' ? (
        <Dashboard
          onSelectResume={handleSelectResume}
          onGoHome={() => setView('landing')}
          onOpenJobTailor={() => handleOpenCreateModal('ai')}
          onOpenCreateModal={handleOpenCreateModal}
        />
      ) : (
        /* Landing Page View */
        <>
          <Navbar
            onOpenDashboard={() => setView('dashboard')}
            onStartNew={() => handleOpenCreateModal('choice')}
            onGoHome={() => setView('landing')}
            onOpenJobTailor={() => handleOpenCreateModal('ai')}
          />
          <main className="flex-1">
            <LandingPage
              onStartResume={() => handleOpenCreateModal('choice')}
              onOpenSample={handleOpenSample}
              onOpenDashboard={() => setView('dashboard')}
              onOpenJobTailor={() => handleOpenCreateModal('ai')}
            />
          </main>
          <Footer
            onStartNew={() => handleOpenCreateModal('choice')}
            onOpenDashboard={() => setView('dashboard')}
          />
        </>
      )}

      {/* Global Create Resume Modal (Choice between Blank vs. AI Tailor with CV & JD) */}
      <CreateResumeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialMode={createModalInitialMode}
        onCreateBlank={handleCreateBlankResume}
        onApplyTailoredResume={handleApplyTailoredResume}
        currentResume={activeResume}
      />

      {/* Direct Job Tailor Modal (when opened from Editor toolbar) */}
      <JobTailorModal
        isOpen={showJobTailorModal}
        onClose={() => setShowJobTailorModal(false)}
        currentResume={tailorTargetResume || activeResume}
        onApplyTailoredResume={handleApplyTailoredResume}
      />
    </div>
  );
}

export default App;
