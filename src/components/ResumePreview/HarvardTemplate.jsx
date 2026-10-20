import React from 'react';

export function HarvardTemplate({ resume = {} }) {
  const {
    personalDetails = {},
    summary = '',
    employmentHistory = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    themeColor = '#1e293b',
    fontFamily = "'Merriweather', Georgia, serif"
  } = resume;

  return (
    <div 
      className="bg-white min-h-[1123px] w-full text-slate-900 p-12 flex flex-col gap-6 text-[12.5px] leading-relaxed font-serif"
      style={{ fontFamily: resume.fontFamily || fontFamily }}
    >
      {/* Centered Classic Header */}
      <header className="text-center pb-4 border-b-2" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-bold tracking-normal uppercase text-slate-950 font-serif">
          {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
        </h1>
        {personalDetails.jobTitle && (
          <p className="text-sm italic font-medium text-slate-700 mt-1">
            {personalDetails.jobTitle}
          </p>
        )}

        {/* Contact info separated by bullets */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 text-[11.5px] text-slate-600 font-sans">
          {personalDetails.city && <span>{personalDetails.city}{personalDetails.country ? `, ${personalDetails.country}` : ''}</span>}
          {personalDetails.phone && <span>• {personalDetails.phone}</span>}
          {personalDetails.email && <span>• {personalDetails.email}</span>}
          {personalDetails.linkedin && <span>• {personalDetails.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {personalDetails.website && <span>• {personalDetails.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b font-sans"
            style={{ color: themeColor, borderColor: '#cbd5e1' }}
          >
            Executive Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-[12.5px] text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Education First (classic academic standard) */}
      {education.length > 0 && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b font-sans"
            style={{ color: themeColor, borderColor: '#cbd5e1' }}
          >
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-950">
                  <span>{edu.school}{edu.city ? `, ${edu.city}` : ''}</span>
                  <span className="text-[11.5px] font-normal text-slate-600 font-sans">
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </span>
                </div>
                <div className="italic text-slate-700">{edu.degree}</div>
                {edu.description && (
                  <p className="text-[11.5px] text-slate-600 mt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {employmentHistory.length > 0 && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b font-sans"
            style={{ color: themeColor, borderColor: '#cbd5e1' }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {employmentHistory.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-950">
                  <span>{job.employer}{job.city ? `, ${job.city}` : ''}</span>
                  <span className="text-[11.5px] font-normal text-slate-600 font-sans">
                    {job.startDate} — {job.endDate || 'Present'}
                  </span>
                </div>
                <div className="italic font-medium text-slate-700 text-[12px] mb-1">
                  {job.jobTitle}
                </div>
                {job.description && (
                  <div className="text-slate-800 whitespace-pre-line text-[12px] leading-relaxed pl-3 border-l border-slate-300">
                    {job.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b font-sans"
            style={{ color: themeColor, borderColor: '#cbd5e1' }}
          >
            Key Initiatives & Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[11px] font-normal text-slate-500 font-sans italic">
                      {proj.technologies}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-700 text-[11.5px] mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Additional Info */}
      {(skills.length > 0 || languages.length > 0 || certifications.length > 0) && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b font-sans"
            style={{ color: themeColor, borderColor: '#cbd5e1' }}
          >
            Skills, Honors & Certifications
          </h2>
          <div className="space-y-1.5 text-[11.5px]">
            {skills.length > 0 && (
              <div>
                <span className="font-bold text-slate-900">Core Competencies: </span>
                <span className="text-slate-700 font-sans">
                  {skills.map((s) => s.name).join(', ')}
                </span>
              </div>
            )}
            {certifications.length > 0 && (
              <div>
                <span className="font-bold text-slate-900">Certifications: </span>
                <span className="text-slate-700 font-sans">
                  {certifications.map((c) => `${c.name} (${c.issuer})`).join('; ')}
                </span>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <span className="font-bold text-slate-900">Languages: </span>
                <span className="text-slate-700 font-sans">
                  {languages.map((l) => `${l.name} (${l.level})`).join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
