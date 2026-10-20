import React from 'react';
import { Mail, Phone, MapPin, Globe, Terminal } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';

export function BerlinTemplate({ resume = {} }) {
  const {
    personalDetails = {},
    summary = '',
    employmentHistory = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    themeColor = '#dc2626',
    fontFamily = 'Inter'
  } = resume;

  return (
    <div 
      className="bg-white min-h-[1123px] w-full text-slate-800 p-8 flex flex-col gap-5 text-[12.5px] leading-relaxed"
      style={{ fontFamily }}
    >
      {/* Tech Header */}
      <header className="border-b-2 border-slate-900 pb-4 flex flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: themeColor }} />
            <span className="text-[11px] font-mono tracking-wider uppercase text-slate-500 font-semibold">
              Curriculum Vitae // {personalDetails.jobTitle || 'Tech Professional'}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase font-mono">
            {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
          </h1>
        </div>

        {/* Contact info in clean monospace table */}
        <div className="font-mono text-[11px] text-slate-600 space-y-1 text-right">
          {personalDetails.email && <div>{personalDetails.email}</div>}
          {personalDetails.phone && <div>{personalDetails.phone}</div>}
          {personalDetails.city && <div>{personalDetails.city}</div>}
          <div className="flex gap-2 justify-end text-[10.5px]">
            {personalDetails.github && (
              <a href={personalDetails.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                github
              </a>
            )}
            {personalDetails.linkedin && (
              <a href={personalDetails.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                linkedin
              </a>
            )}
            {personalDetails.website && (
              <a href={personalDetails.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                web
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="bg-slate-50 p-3.5 rounded border border-slate-200">
          <p className="text-slate-800 leading-relaxed text-[12.5px]">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Skills Grid */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: themeColor }}>
            <Terminal className="w-3.5 h-3.5" />
            Stack & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-medium text-slate-800"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Work History */}
      {employmentHistory.length > 0 && (
        <section>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: themeColor }}>
            <span>Experience</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </h2>
          <div className="space-y-4">
            {employmentHistory.map((job) => (
              <div key={job.id} className="border-l-2 pl-3" style={{ borderColor: themeColor }}>
                <div className="flex justify-between items-baseline font-mono text-[13px]">
                  <span className="font-bold text-slate-900">{job.jobTitle}</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {job.startDate} ~ {job.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-[11.5px] font-medium text-slate-600 mb-1">
                  {job.employer}{job.city ? ` // ${job.city}` : ''}
                </div>
                {job.description && (
                  <p className="text-slate-700 whitespace-pre-line text-[12px] leading-relaxed">
                    {job.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: themeColor }}>
            <span>Open Source & Projects</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-slate-200 p-2.5 rounded font-mono text-[11.5px]">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[10.5px]">
                      [link]
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <div className="text-[10.5px] text-slate-500 mt-0.5">{proj.technologies}</div>
                )}
                {proj.description && (
                  <p className="text-slate-600 font-sans text-[11.5px] mt-1 leading-normal">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
              Education
            </h2>
            <div className="space-y-2 text-[12px]">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600 text-[11px]">{edu.school} ({edu.startDate} - {edu.endDate || 'Present'})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
              Certifications & Langs
            </h2>
            <div className="space-y-1.5 text-[11.5px] text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  • <span className="font-semibold">{c.name}</span> <span className="text-slate-500">({c.issuer})</span>
                </div>
              ))}
              {languages.map((l) => (
                <div key={l.id}>
                  • <span className="font-semibold">{l.name}</span>: <span className="text-slate-500">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
