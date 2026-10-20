import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';
import { SkillBar } from './SkillBar';

export function SydneyTemplate({ resume = {} }) {
  const {
    personalDetails = {},
    summary = '',
    employmentHistory = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    themeColor = '#7c3aed',
    fontFamily = 'Outfit'
  } = resume;

  return (
    <div 
      className="bg-white min-h-[1123px] w-full text-slate-800 flex flex-col text-[13px] leading-relaxed shadow-sm"
      style={{ fontFamily }}
    >
      {/* Top Banner Header */}
      <header 
        className="p-8 text-white relative flex flex-row items-center justify-between gap-6"
        style={{ backgroundColor: themeColor }}
      >
        <div className="flex-1 text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
          </h1>
          {personalDetails.jobTitle && (
            <p className="text-lg font-medium text-white/90 mt-1">
              {personalDetails.jobTitle}
            </p>
          )}

          {/* Quick Contact Chips in banner */}
          <div className="flex flex-wrap items-center justify-start gap-3 mt-4 text-[12px] text-white/80">
            {personalDetails.city && (
              <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <MapPin className="w-3.5 h-3.5" />
                {personalDetails.city}
              </span>
            )}
            {personalDetails.email && (
              <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Mail className="w-3.5 h-3.5" />
                {personalDetails.email}
              </span>
            )}
            {personalDetails.phone && (
              <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Phone className="w-3.5 h-3.5" />
                {personalDetails.phone}
              </span>
            )}
            {personalDetails.linkedin && (
              <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </span>
            )}
          </div>
        </div>

        {personalDetails.showPhoto && personalDetails.photo && (
          <img
            src={personalDetails.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        )}
      </header>

      {/* Body Area */}
      <div className="p-8 flex flex-row gap-8">
        {/* Left main: Summary, Experience, Projects */}
        <div className="flex-1 space-y-6">
          {summary && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider mb-2" style={{ color: themeColor }}>
                About Me
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[13px]">
                {summary}
              </p>
            </section>
          )}

          {employmentHistory.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider mb-3" style={{ color: themeColor }}>
                Professional Experience
              </h2>
              <div className="space-y-5">
                {employmentHistory.map((job) => (
                  <div key={job.id} className="relative pl-3 border-l-2" style={{ borderColor: `${themeColor}50` }}>
                    <div className="flex justify-between items-baseline font-bold text-slate-900 text-[14px]">
                      <span>{job.jobTitle}</span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {job.startDate} — {job.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="text-[12px] font-medium text-slate-600 mb-1">
                      {job.employer}{job.city ? `, ${job.city}` : ''}
                    </div>
                    {job.description && (
                      <p className="text-slate-700 whitespace-pre-line text-[12.5px] leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider mb-3" style={{ color: themeColor }}>
                Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-baseline font-bold text-slate-800 text-[13px]">
                      <span>{proj.name}</span>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] hover:underline" style={{ color: themeColor }}>
                          Visit Project ↗
                        </a>
                      )}
                    </div>
                    {proj.technologies && (
                      <div className="text-[11px] text-slate-500 font-medium">{proj.technologies}</div>
                    )}
                    {proj.description && (
                      <p className="text-slate-600 text-[12px] mt-1">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right side: Skills, Education, Languages */}
        <div className="w-[35%] space-y-6 shrink-0">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider mb-3" style={{ color: themeColor }}>
                Key Skills
              </h2>
              <div className="space-y-2.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-[12px]">
                    <div className="flex justify-between font-medium text-slate-700">
                      <span>{skill.name}</span>
                    </div>
                    <SkillBar level={skill.level} color={themeColor} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider mb-3" style={{ color: themeColor }}>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[12px]">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.school}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{edu.startDate} — {edu.endDate || 'Present'}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider mb-2" style={{ color: themeColor }}>
                Languages
              </h2>
              <div className="space-y-1.5 text-[12px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium text-slate-700">{l.name}</span>
                    <span className="text-slate-500 text-[11px]">{l.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider mb-2" style={{ color: themeColor }}>
                Certifications
              </h2>
              <div className="space-y-2 text-[12px]">
                {certifications.map((c) => (
                  <div key={c.id} className="border border-slate-100 p-2 rounded bg-slate-50/50">
                    <div className="font-semibold text-slate-800">{c.name}</div>
                    <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
