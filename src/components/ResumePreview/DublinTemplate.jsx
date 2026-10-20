import { Mail, Phone, MapPin, Globe, Award, Languages as LangIcon } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';
import { SkillBar } from './SkillBar';

export function DublinTemplate({ resume = {} }) {
  const {
    personalDetails = {},
    summary = '',
    employmentHistory = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    themeColor = '#1a91f0',
    fontFamily = 'Inter'
  } = resume;

  return (
    <div 
      className="bg-white min-h-[1123px] w-full text-slate-800 flex flex-row text-[13px] leading-relaxed"
      style={{ fontFamily }}
    >
      {/* Left Sidebar */}
      <aside 
        className="w-[32%] bg-slate-50 p-6 border-r border-slate-200 flex flex-col gap-6 shrink-0"
      >
        {/* Photo */}
        {personalDetails.showPhoto && personalDetails.photo && (
          <div className="flex justify-center mb-2">
            <img
              src={personalDetails.photo}
              alt={`${personalDetails.firstName} ${personalDetails.lastName}`}
              className="w-28 h-28 rounded-full object-cover border-4 shadow-sm"
              style={{ borderColor: themeColor }}
            />
          </div>
        )}

        {/* Contact Info */}
        <section>
          <h3 
            className="text-xs uppercase font-bold tracking-wider mb-3 pb-1 border-b"
            style={{ color: themeColor, borderColor: `${themeColor}40` }}
          >
            Details
          </h3>
          <div className="space-y-2 text-slate-600 text-[12px]">
            {personalDetails.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-70" style={{ color: themeColor }} />
                <span>{personalDetails.city}{personalDetails.country ? `, ${personalDetails.country}` : ''}</span>
              </div>
            )}
            {personalDetails.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 opacity-70" style={{ color: themeColor }} />
                <span>{personalDetails.phone}</span>
              </div>
            )}
            {personalDetails.email && (
              <div className="flex items-center gap-2 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-70" style={{ color: themeColor }} />
                <span>{personalDetails.email}</span>
              </div>
            )}
            {personalDetails.nationality && (
              <div className="text-[11px] text-slate-500 pt-1">
                <span className="font-medium text-slate-700">Nationality: </span>
                {personalDetails.nationality}
              </div>
            )}
            {personalDetails.drivingLicense && (
              <div className="text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Driving License: </span>
                {personalDetails.drivingLicense}
              </div>
            )}
          </div>
        </section>

        {/* Links */}
        {(personalDetails.website || personalDetails.linkedin || personalDetails.github) && (
          <section>
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-3 pb-1 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Links
            </h3>
            <div className="space-y-2 text-[12px]">
              {personalDetails.website && (
                <a 
                  href={personalDetails.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 text-slate-600 hover:underline truncate"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{personalDetails.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {personalDetails.linkedin && (
                <a 
                  href={personalDetails.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 text-slate-600 hover:underline truncate"
                >
                  <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{personalDetails.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                </a>
              )}
              {personalDetails.github && (
                <a 
                  href={personalDetails.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 text-slate-600 hover:underline truncate"
                >
                  <Github className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{personalDetails.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-3 pb-1 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Skills
            </h3>
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

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-3 pb-1 border-b flex items-center gap-1.5"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              <LangIcon className="w-3.5 h-3.5" />
              Languages
            </h3>
            <div className="space-y-1.5 text-[12px]">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="font-medium text-slate-700">{lang.name}</span>
                  <span className="text-slate-500 text-[11px]">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education (in sidebar for Dublin style) */}
        {education.length > 0 && (
          <section>
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-3 pb-1 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Education
            </h3>
            <div className="space-y-3 text-[12px]">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-800">{edu.degree}</div>
                  <div className="text-slate-600">{edu.school}{edu.city ? `, ${edu.city}` : ''}</div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </div>
                  {edu.description && (
                    <p className="text-[11px] text-slate-600 mt-1 leading-normal">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="w-[68%] p-8 flex flex-col gap-6">
        {/* Header: Name and Title */}
        <header className="border-b pb-5" style={{ borderColor: `${themeColor}30` }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
            {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
          </h1>
          {personalDetails.jobTitle && (
            <p className="text-base font-semibold mt-1" style={{ color: themeColor }}>
              {personalDetails.jobTitle}
            </p>
          )}
        </header>

        {/* Profile Summary */}
        {summary && (
          <section>
            <h2 
              className="text-sm uppercase font-bold tracking-wider mb-2"
              style={{ color: themeColor }}
            >
              Profile
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[13px]">
              {summary}
            </p>
          </section>
        )}

        {/* Employment History */}
        {employmentHistory.length > 0 && (
          <section>
            <h2 
              className="text-sm uppercase font-bold tracking-wider mb-3"
              style={{ color: themeColor }}
            >
              Employment History
            </h2>
            <div className="space-y-5">
              {employmentHistory.map((job) => (
                <div key={job.id} className="relative pl-3 border-l-2" style={{ borderColor: `${themeColor}40` }}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="font-bold text-slate-900 text-[14px]">
                      {job.jobTitle} <span className="font-normal text-slate-600">at {job.employer}</span>
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {job.startDate} — {job.endDate || 'Present'}
                    </span>
                  </div>
                  {job.city && (
                    <div className="text-slate-500 text-[11px] mb-1.5">{job.city}</div>
                  )}
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

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 
              className="text-sm uppercase font-bold tracking-wider mb-3"
              style={{ color: themeColor }}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-800 text-[13px]">{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">
                        View Project →
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      Stack: {proj.technologies}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-slate-600 text-[12px] mt-1 leading-normal">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 
              className="text-sm uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: themeColor }}
            >
              <Award className="w-4 h-4" />
              Certifications
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {certifications.map((cert) => (
                <div key={cert.id} className="border border-slate-200/80 p-2.5 rounded bg-white">
                  <div className="font-semibold text-slate-800">{cert.name}</div>
                  <div className="text-slate-500 text-[11px]">{cert.issuer} {cert.date ? `• ${cert.date}` : ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
