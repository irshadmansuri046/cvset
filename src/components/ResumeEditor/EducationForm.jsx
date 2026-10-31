import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import { BulletTextarea } from './BulletTextarea';

export function EducationForm({ education = [], onChange }) {
  const [expandedId, setExpandedId] = useState(education[0]?.id || null);

  const handleAddEducation = () => {
    const newEdu = {
      id: "edu-" + Date.now(),
      school: "",
      degree: "",
      city: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    onChange([...education, newEdu]);
    setExpandedId(newEdu.id);
  };

  const handleUpdate = (id, field, val) => {
    onChange(education.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  const handleDelete = (id) => {
    onChange(education.filter((item) => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= education.length) return;
    const copy = [...education];
    const temp = copy[index];
    copy[index] = copy[nextIndex];
    copy[nextIndex] = temp;
    onChange(copy);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Education</h2>
            <p className="text-xs text-slate-500">
              A varied education on your resume summons the value that your learning background contributes.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {education.map((edu, idx) => {
          const isExpanded = expandedId === edu.id;
          return (
            <div key={edu.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition bg-white"
                onClick={() => setExpandedId(isExpanded ? null : edu.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {edu.degree || '(Not specified)'}
                    <span className="text-slate-400 font-normal">
                      {edu.school ? ` at ${edu.school}` : ''}
                    </span>
                  </span>
                  {edu.startDate && (
                    <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {edu.startDate} — {edu.endDate || 'Present'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === education.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">School / University</label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford University"
                      value={edu.school || ''}
                      onChange={(e) => handleUpdate(edu.id, 'school', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Degree / Field of Study</label>
                    <input
                      type="text"
                      placeholder="e.g. Bachelor of Science in Computer Science"
                      value={edu.degree || ''}
                      onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford, CA"
                      value={edu.city || ''}
                      onChange={(e) => handleUpdate(edu.id, 'city', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2016-09"
                        value={edu.startDate || ''}
                        onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2020-05"
                        value={edu.endDate || ''}
                        onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <BulletTextarea
                      id={`edu-desc-${edu.id}`}
                      label="Description / Honors / GPA"
                      value={edu.description || ''}
                      onChange={(val) => handleUpdate(edu.id, 'description', val)}
                      placeholder="e.g. • Graduated Magna Cum Laude, GPA 3.8/4.0.&#10;• Capstone project on distributed systems."
                      rows={3}
                      tip="Tip: Use • Bullet List for honors, relevant courses, or achievements."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAddEducation}
        className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30 text-emerald-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
      >
        <Plus className="w-4 h-4" />
        <span>Add Education</span>
      </button>
    </div>
  );
}
