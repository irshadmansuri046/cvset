import React, { useState } from 'react';
import { Layers, Plus, Trash2, Globe, Award, FolderGit2 } from 'lucide-react';
import { BulletTextarea } from './BulletTextarea';

export function AdditionalSectionsForm({ resume, onChange }) {
  const { projects = [], languages = [], certifications = [] } = resume;

  // Handlers for Projects
  const handleAddProject = () => {
    const newProj = {
      id: "proj-" + Date.now(),
      name: "",
      technologies: "",
      link: "",
      description: ""
    };
    onChange({ ...resume, projects: [...projects, newProj] });
  };

  const handleUpdateProject = (id, field, val) => {
    onChange({
      ...resume,
      projects: projects.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    });
  };

  const handleDeleteProject = (id) => {
    onChange({ ...resume, projects: projects.filter((p) => p.id !== id) });
  };

  // Handlers for Languages
  const handleAddLanguage = () => {
    const newLang = {
      id: "lang-" + Date.now(),
      name: "",
      level: "Professional Working"
    };
    onChange({ ...resume, languages: [...languages, newLang] });
  };

  const handleUpdateLanguage = (id, field, val) => {
    onChange({
      ...resume,
      languages: languages.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    });
  };

  const handleDeleteLanguage = (id) => {
    onChange({ ...resume, languages: languages.filter((l) => l.id !== id) });
  };

  // Handlers for Certifications
  const handleAddCertification = () => {
    const newCert = {
      id: "cert-" + Date.now(),
      name: "",
      issuer: "",
      date: ""
    };
    onChange({ ...resume, certifications: [...certifications, newCert] });
  };

  const handleUpdateCertification = (id, field, val) => {
    onChange({
      ...resume,
      certifications: certifications.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    });
  };

  const handleDeleteCertification = (id) => {
    onChange({ ...resume, certifications: certifications.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Projects Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Projects</h2>
              <p className="text-xs text-slate-500">
                Showcase client work, personal software apps, or open-source repositories.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Project Details</span>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(proj.id)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. CloudScale Analytics"
                    value={proj.name || ''}
                    onChange={(e) => handleUpdateProject(proj.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Project URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={proj.link || ''}
                    onChange={(e) => handleUpdateProject(proj.id, 'link', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Next.js, Node.js, AWS"
                    value={proj.technologies || ''}
                    onChange={(e) => handleUpdateProject(proj.id, 'technologies', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <BulletTextarea
                    id={`proj-desc-${proj.id}`}
                    label="Description & Highlights"
                    value={proj.description || ''}
                    onChange={(val) => handleUpdateProject(proj.id, 'description', val)}
                    placeholder="Brief overview of features, user metrics, and what problem it solved...&#10;• Built high-concurrency real-time WebSocket dashboard"
                    rows={3}
                    tip="Tip: Use • Bullet List for project features and metric results."
                  />
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-400 italic">
              No projects added yet. Click "+ Add Project" above to highlight your work.
            </div>
          )}
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Languages</h2>
              <p className="text-xs text-slate-500">
                Specify spoken and written languages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddLanguage}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Language</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {languages.map((lang) => (
            <div key={lang.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Language (e.g. English)"
                value={lang.name || ''}
                onChange={(e) => handleUpdateLanguage(lang.id, 'name', e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden"
              />
              <select
                value={lang.level || 'Professional Working'}
                onChange={(e) => handleUpdateLanguage(lang.id, 'level', e.target.value)}
                className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-700"
              >
                <option value="Native / Bilingual">Native / Bilingual</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional Working">Professional Working</option>
                <option value="Conversational">Conversational</option>
                <option value="Elementary">Elementary</option>
              </select>
              <button
                type="button"
                onClick={() => handleDeleteLanguage(lang.id)}
                className="text-slate-400 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {languages.length === 0 && (
            <div className="sm:col-span-2 text-center py-4 text-xs text-slate-400 italic">
              No languages listed.
            </div>
          )}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Courses & Certifications</h2>
              <p className="text-xs text-slate-500">
                Add verified certifications, cloud badges, and professional licenses.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddCertification}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <div>
                <input
                  type="text"
                  placeholder="Certification Name"
                  value={cert.name || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Issuing Org (e.g. AWS, Google)"
                  value={cert.issuer || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'issuer', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Date (e.g. 2023-05)"
                  value={cert.date || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'date', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCertification(cert.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {certifications.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-400 italic">
              No certifications added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
