import React, { useState } from 'react';
import { 
  Plus, FileText, Download, Copy, Trash2, Edit3, 
  Sparkles, Upload, Calendar, ArrowRight, CheckCircle2,
  Layers, Search, SlidersHorizontal
} from 'lucide-react';
import { 
  getStoredResumes, createNewResume, duplicateResume, 
  deleteResume, exportResumeAsJson, importResumeFromJson 
} from '../utils/storage';
import { calculateAtsScore } from '../utils/atsScore';
import { TEMPLATES } from '../constants/templates';
import { DublinTemplate } from './ResumePreview/DublinTemplate';
import { StockholmTemplate } from './ResumePreview/StockholmTemplate';
import { SydneyTemplate } from './ResumePreview/SydneyTemplate';
import { HarvardTemplate } from './ResumePreview/HarvardTemplate';
import { BerlinTemplate } from './ResumePreview/BerlinTemplate';

export function Dashboard({ onSelectResume, onGoHome }) {
  const [resumes, setResumes] = useState(getStoredResumes());
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('My Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('dublin');

  const refreshList = () => {
    setResumes(getStoredResumes());
  };

  const handleCreate = () => {
    const created = createNewResume(newTitle || 'Untitled Resume', selectedTemplate);
    setShowNewModal(false);
    onSelectResume(created);
  };

  const handleDuplicate = (id) => {
    duplicateResume(id);
    refreshList();
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteResume(id);
      refreshList();
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = importResumeFromJson(event.target.result);
        refreshList();
        onSelectResume(imported);
      } catch (err) {
        alert('Invalid resume JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const filteredResumes = resumes.filter((r) => 
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.personalDetails?.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dashboard Top Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900">cvset</span>
                <span className="text-[10px] font-semibold text-blue-600 ml-1.5 uppercase px-1.5 py-0.5 bg-blue-50 rounded">
                  Free
                </span>
              </div>
            </button>

            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-600">My Resumes</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Import JSON */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {/* Create Resume Button */}
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>100% Free Multiple Resumes</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Manage Your Resumes</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Create and tailor custom resumes for each job application. Switch templates in 1-click, check ATS scores, and export unlimited high-resolution PDFs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-md transition shrink-0"
          >
            + Add Another Resume
          </button>
        </div>

        {/* Search & Counter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm font-semibold text-slate-700">
            All Resumes <span className="text-slate-400 font-normal">({resumes.length})</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Resume Card */}
          <div
            onClick={() => setShowNewModal(true)}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px] transition group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition shadow-2xs mb-3">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition">
              New Resume
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Start fresh or choose from modern ATS-approved design templates.
            </p>
          </div>

          {/* List of Resumes */}
          {filteredResumes.map((resume) => {
            const { score, level } = calculateAtsScore(resume);
            return (
              <div
                key={resume.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                {/* Resume Card Header */}
                <div className="p-5 pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base hover:text-blue-600 transition line-clamp-1">
                        {resume.title || 'Untitled Resume'}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {resume.personalDetails?.jobTitle || 'No job title specified'}
                      </p>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {resume.template}
                    </span>
                  </div>

                  {/* Completeness bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-500">ATS Strength</span>
                      <span className={score >= 80 ? 'text-emerald-600 font-bold' : 'text-blue-600'}>
                        {score}% ({level})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          score >= 85 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Date updated */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="bg-slate-50/80 border-t border-slate-100 p-3 flex items-center justify-between gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => onSelectResume(resume)}
                    className="flex items-center gap-1.5 font-bold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit CV</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(resume.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => exportResumeAsJson(resume)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition"
                      title="Download JSON Backup"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(resume.id, resume.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* New Resume Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Create New Resume</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resume Name / Target Role
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer - Google"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Choose Starting Template
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedTemplate === tpl.id
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{tpl.name}</span>
                      <span 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: tpl.previewColor }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 line-clamp-1">{tpl.badge} • {tpl.tags[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition"
              >
                Create Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
