import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ResumeEditor } from './components/ResumeEditor/ResumeEditor';
import { getStoredResumes, createNewResume, setActiveResumeId, getActiveResumeId } from './utils/storage';
import { DEFAULT_RESUME } from './constants/sampleData';

export function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'editor'
  const [activeResume, setActiveResume] = useState(() => {
    try {
      const resumes = getStoredResumes();
      const activeId = getActiveResumeId();
      return resumes.find((r) => r.id === activeId) || resumes[0] || DEFAULT_RESUME;
    } catch (e) {
      return DEFAULT_RESUME;
    }
  });

  // Handlers
  const handleStartResume = (templateId = 'dublin') => {
    const newResume = createNewResume('My Professional Resume', templateId);
    setActiveResume(newResume);
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

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      {/* If in editor view, render full-screen editor with its own toolbar */}
      {view === 'editor' && activeResume ? (
        <ResumeEditor
          initialResume={activeResume}
          onBackToDashboard={() => setView('dashboard')}
        />
      ) : view === 'dashboard' ? (
        <Dashboard
          onSelectResume={handleSelectResume}
          onGoHome={() => setView('landing')}
        />
      ) : (
        /* Landing Page View */
        <>
          <Navbar
            onOpenDashboard={() => setView('dashboard')}
            onStartNew={() => handleStartResume('dublin')}
            onGoHome={() => setView('landing')}
          />
          <main className="flex-1">
            <LandingPage
              onStartResume={handleStartResume}
              onOpenSample={handleOpenSample}
              onOpenDashboard={() => setView('dashboard')}
            />
          </main>
          <Footer
            onStartNew={() => handleStartResume('dublin')}
            onOpenDashboard={() => setView('dashboard')}
          />
        </>
      )}
    </div>
  );
}

export default App;
