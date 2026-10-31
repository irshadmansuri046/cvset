import React, { useState } from 'react';
import { 
  Briefcase, Plus, Trash2, ChevronDown, ChevronUp, 
  ArrowUp, ArrowDown, Sparkles 
} from 'lucide-react';
import { SuggestionsModal } from './SuggestionsModal';
import { BulletTextarea } from './BulletTextarea';

export function ExperienceForm({ experiences = [], onChange }) {
  const [expandedId, setExpandedId] = useState(experiences[0]?.id || null);
  const [activeSuggestionJobId, setActiveSuggestionJobId] = useState(null);

  const handleAddJob = () => {
    const newJob = {
      id: "emp-" + Date.now(),
      jobTitle: "",
      employer: "",
      city: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    onChange([...experiences, newJob]);
    setExpandedId(newJob.id);
  };

  const handleUpdateJob = (id, field, val) => {
    const updated = experiences.map((job) => {
      if (job.id === id) {
        if (field === 'current' && val === true) {
          return { ...job, current: true, endDate: 'Present' };
        }
        return { ...job, [field]: val };
      }
      return job;
    });
    onChange(updated);
  };

  const handleDeleteJob = (id) => {
    onChange(experiences.filter((job) => job.id !== id));
  };

  const handleMove = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= experiences.length) return;
    const copy = [...experiences];
    const temp = copy[index];
    copy[index] = copy[nextIndex];
    copy[nextIndex] = temp;
    onChange(copy);
  };

  const handleInsertBullet = (bulletText) => {
    if (!activeSuggestionJobId) return;
    const job = experiences.find(j => j.id === activeSuggestionJobId);
    if (!job) return;

    const currentDesc = job.description || '';
    const newDesc = currentDesc.trim() 
      ? `${currentDesc.trim()}\n${bulletText}`
      : bulletText;

    handleUpdateJob(activeSuggestionJobId, 'description', newDesc);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Employment History</h2>
            <p className="text-xs text-slate-500">
              List your relevant job positions in reverse chronological order.
            </p>
          </div>
        </div>
      </div>

      {/* Experience Item Accordions */}
      <div className="space-y-3">
        {experiences.map((job, idx) => {
          const isExpanded = expandedId === job.id;
          return (
            <div
              key={job.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition"
            >
              {/* Accordion Bar */}
              <div
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition bg-white"
                onClick={() => setExpandedId(isExpanded ? null : job.id)}
              >
                <div className="flex items-center gap-2.5">
                  <div className="text-xs font-bold text-slate-800">
                    {job.jobTitle || '(Not specified)'}
                    <span className="text-slate-400 font-normal">
                      {job.employer ? ` at ${job.employer}` : ''}
                    </span>
                  </div>
                  {job.startDate && (
                    <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {job.startDate} — {job.endDate || 'Present'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === experiences.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                    title="Delete Position"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : job.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Software Engineer"
                      value={job.jobTitle || ''}
                      onChange={(e) => handleUpdateJob(job.id, 'jobTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Employer / Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Google"
                      value={job.employer || ''}
                      onChange={(e) => handleUpdateJob(job.id, 'employer', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. New York, NY"
                      value={job.city || ''}
                      onChange={(e) => handleUpdateJob(job.id, 'city', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2021-03"
                        value={job.startDate || ''}
                        onChange={(e) => handleUpdateJob(job.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">End Date</label>
                      <input
                        type="text"
                        disabled={job.current}
                        placeholder={job.current ? 'Present' : 'e.g. 2023-08'}
                        value={job.current ? 'Present' : (job.endDate || '')}
                        onChange={(e) => handleUpdateJob(job.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${job.id}`}
                      checked={!!job.current}
                      onChange={(e) => handleUpdateJob(job.id, 'current', e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`current-${job.id}`} className="text-[11px] text-slate-600 cursor-pointer">
                      I currently work in this role
                    </label>
                  </div>

                  {/* Bullet description */}
                  <div className="sm:col-span-2 pt-2">
                    <BulletTextarea
                      id={`job-desc-${job.id}`}
                      label="Description & Key Achievements"
                      value={job.description || ''}
                      onChange={(val) => handleUpdateJob(job.id, 'description', val)}
                      placeholder="• Accelerated checkout conversion by 24% through redesigned one-click UI flow...&#10;• Reduced server response latency by 35% using caching..."
                      rows={5}
                      actionButton={
                        <button
                          type="button"
                          onClick={() => setActiveSuggestionJobId(job.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>+ Add Suggested Bullet</span>
                        </button>
                      }
                      tip="Tip: Press Enter on a bullet line to automatically insert the next bullet point."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Experience Button */}
      <button
        type="button"
        onClick={handleAddJob}
        className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 text-blue-600 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
      >
        <Plus className="w-4 h-4" />
        <span>Add Employment</span>
      </button>

      {/* Bullet suggestions modal */}
      <SuggestionsModal
        isOpen={!!activeSuggestionJobId}
        onClose={() => setActiveSuggestionJobId(null)}
        type="bullet"
        onSelectBullet={handleInsertBullet}
      />
    </div>
  );
}
