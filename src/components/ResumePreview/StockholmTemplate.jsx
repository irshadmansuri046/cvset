import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';

export function StockholmTemplate({ resume = {} }) {
  const {
    personalDetails = {},
    summary = '',
    employmentHistory = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    themeColor = '#0f766e',
    fontFamily = 'Inter'
  } = resume;

  return (
    <div 
      className="bg-white min-h-[1123px] w-full text-slate-800 p-10 flex flex-col gap-6 text-[13px] leading-relaxed"
      style={{ fontFamily }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b pb-6" style={{ borderColor: `${themeColor}30` }}>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
          </h1>
          {personalDetails.jobTitle && (
            <p className="text-base font-semibold mt-1" style={{ color: themeColor }}>
              {personalDetails.jobTitle}
            </p>
          )}

          {/* Contact Details inline */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[12px] text-slate-600">
            {personalDetails.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {personalDetails.city}{personalDetails.country ? `, ${personalDetails.country}` : ''}
              </span>
            )}
            {personalDetails.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {personalDetails.phone}
              </span>
            )}
            {personalDetails.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {personalDetails.email}
              </span>
            )}
            {personalDetails.linkedin && (
              <a href={personalDetails.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                LinkedIn
              </a>
            )}
            {personalDetails.github && (
              <a href={personalDetails.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                GitHub
              </a>
            )}
            {personalDetails.website && (
              <a href={personalDetails.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Portfolio
              </a>
            )}
          </div>
        </div>

        {personalDetails.showPhoto && personalDetails.photo && (
          <img
            src={personalDetails.photo}
            alt="Profile"
            className="w-20 h-20 rounded-lg object-cover ml-6 shadow-sm border"
            style={{ borderColor: themeColor }}
          />
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h2 
            className="text-xs uppercase font-extrabold tracking-wider mb-2 flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span>Summary</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[13px]">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {employmentHistory.length > 0 && (
        <section>
          <h2 
            className="text-xs uppercase font-extrabold tracking-wider mb-3 flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span>Employment History</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </h2>
          <div className="space-y-4">
            {employmentHistory.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-[14px]">
                    {job.jobTitle} <span className="font-medium text-slate-600">at {job.employer}</span>
                  </h3>
                  <span className="text-[12px] text-slate-500 font-medium">
                    {job.startDate} — {job.endDate || 'Present'}
                  </span>
                </div>
                {job.city && <div className="text-[11px] text-slate-500 mb-1">{job.city}</div>}
                {job.description && (
                  <p className="text-slate-700 whitespace-pre-line text-[12.5px] leading-relaxed mt-1">
                    {job.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 
            className="text-xs uppercase font-extrabold tracking-wider mb-2.5 flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span>Skills & Expertise</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 rounded-md text-[12px] font-medium border"
                style={{
                  backgroundColor: `${themeColor}08`,
                  borderColor: `${themeColor}25`,
                  color: '#1e293b'
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 
            className="text-xs uppercase font-extrabold tracking-wider mb-3 flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span>Education</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold text-slate-900 text-[13px]">{edu.degree}</div>
                  <div className="text-slate-600 text-[12px]">{edu.school}{edu.city ? `, ${edu.city}` : ''}</div>
                  {edu.description && <p className="text-slate-500 text-[11.5px] mt-0.5">{edu.description}</p>}
                </div>
                <div className="text-[11.5px] text-slate-500 whitespace-nowrap">
                  {edu.startDate} — {edu.endDate || 'Present'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 
            className="text-xs uppercase font-extrabold tracking-wider mb-3 flex items-center gap-2"
            style={{ color: themeColor }}
          >
            <span>Projects</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-slate-200 p-3 rounded-lg">
                <div className="flex justify-between items-baseline font-bold text-slate-800 text-[13px]">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] text-teal-600 hover:underline">
                      Link ↗
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{proj.technologies}</div>
                )}
                {proj.description && (
                  <p className="text-slate-600 text-[12px] mt-1 leading-normal">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Certifications bottom row */}
      {(languages.length > 0 || certifications.length > 0) && (
        <div className="grid grid-cols-2 gap-6 pt-2">
          {languages.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-wider mb-2" style={{ color: themeColor }}>
                Languages
              </h3>
              <div className="space-y-1 text-[12px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-slate-700">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-wider mb-2" style={{ color: themeColor }}>
                Certifications
              </h3>
              <div className="space-y-1 text-[12px]">
                {certifications.map((c) => (
                  <div key={c.id} className="text-slate-700">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-slate-500"> ({c.issuer})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
