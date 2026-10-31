import React from 'react';
import { Mail, Phone, MapPin, Globe, Award, Languages as LangIcon, ExternalLink, Briefcase, GraduationCap } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';
import { SkillBar } from './SkillBar';
import { FormattedText } from './FormattedText';
import { paginateDublinResume } from '../../utils/pagePaginator';

export function DublinTemplate({ resume = {}, debug = false, pagePadding = 45 }) {
  const {
    personalDetails = {},
    themeColor = '#1a91f0',
    fontFamily = 'Inter'
  } = resume;

  // Split long tool/skill lists into chips if they contain commas
  const parseToolList = (name = '') => {
    if (name.includes(',') && name.length > 25) {
      return name.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return null;
  };

  const pages = paginateDublinResume(resume, { pagePadding });

  // Reusable Main Column Section Renderer (works for both two-column and full-width layouts)
  const renderMainContent = (page) => (
    <>
      {/* Candidate Name & Title Header */}
      {page.showHeader && (
        <header className="border-b pb-3" style={{ borderColor: `${themeColor}30` }}>
          <h1 className="text-2xl sm:text-[27px] font-extrabold tracking-tight text-slate-900 uppercase font-sans">
            {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
          </h1>
          {personalDetails.jobTitle && (
            <p className="text-[12.5px] font-semibold tracking-wide uppercase mt-1" style={{ color: themeColor }}>
              {personalDetails.jobTitle}
            </p>
          )}
        </header>
      )}

      {/* Profile Summary */}
      {page.showSummary && page.summary && (
        <section>
          <h2 
            className="text-xs uppercase font-bold tracking-wider mb-1.5 pb-0.5"
            style={{ color: themeColor }}
          >
            Profile
          </h2>
          <FormattedText text={page.summary} className="text-slate-700 text-[11.5px] leading-relaxed" />
        </section>
      )}

      {/* Employment History */}
      {page.jobs && page.jobs.length > 0 && (
        <section>
          {page.jobsHeading && (
            <h2 
              className="text-xs uppercase font-bold tracking-wider mb-2.5 pb-0.5 border-b flex items-center gap-1.5"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{page.jobsHeading}</span>
            </h2>
          )}
          <div className="space-y-3.5">
            {page.jobs.map((job) => (
              <div key={job.id} className="relative pl-3 border-l-2" style={{ borderColor: `${themeColor}40` }}>
                <div className="flex flex-wrap justify-between items-baseline gap-1">
                  <h3 className="font-bold text-slate-900 text-[12px]">
                    {job.jobTitle} <span className="font-normal text-slate-600">at {job.employer}</span>
                  </h3>
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {job.startDate} — {job.endDate || 'Present'}
                  </span>
                </div>
                {job.city && (
                  <div className="text-slate-500 text-[10.5px] mb-1">{job.city}</div>
                )}
                {job.description && (
                  <FormattedText text={job.description} className="text-slate-700 text-[11px] leading-snug mt-1" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects Section */}
      {page.projects && page.projects.length > 0 && (
        <section>
          {page.projectsHeading && (
            <h2 
              className="text-xs uppercase font-bold tracking-wider mb-2.5 pb-1 border-b flex items-center justify-between"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              <span>{page.projectsHeading}</span>
              <span className="text-[10px] font-normal text-slate-400 normal-case">Featured Technical Work & Delivery</span>
            </h2>
          )}

          <div className="space-y-3">
            {page.projects.map((proj) => {
              const isOtherProjects = proj.name && proj.name.toLowerCase().includes('other project');

              if (isOtherProjects) {
                const items = (proj.description || '').split(/\||\n/).map((s) => s.trim()).filter(Boolean);
                return (
                  <div key={proj.id} className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                    <div className="font-bold text-slate-800 text-[12px] mb-1.5">{proj.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((it, idx) => (
                        <span key={idx} className="bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10.5px] font-medium shadow-2xs">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={proj.id} data-card="true" className="relative bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                  <div className="flex flex-wrap justify-between items-baseline gap-2">
                    <span className="font-bold text-slate-900 text-[12.5px] leading-tight">{proj.name}</span>
                    {proj.link && (
                      <a 
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10.5px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[10.5px] font-medium text-slate-600 mt-0.5">
                      <span className="font-semibold text-slate-700">Stack: </span>
                      {proj.technologies}
                    </div>
                  )}
                  {proj.description && (
                    <FormattedText text={proj.description} className="text-slate-700 text-[11px] leading-snug mt-1.5" />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {page.certifications && page.certifications.length > 0 && (
        <section>
          {page.certificationsHeading && (
            <h2 
              className="text-xs uppercase font-bold tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{page.certificationsHeading}</span>
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px]">
            {page.certifications.map((cert) => (
              <div key={cert.id} className="border border-slate-200/80 p-2.5 rounded-lg bg-slate-50/60 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-800 leading-snug">{cert.name}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{cert.issuer}</div>
                </div>
                {cert.date && (
                  <div className="text-slate-400 text-[9.5px] mt-1 font-mono">{cert.date}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {page.customSections && page.customSections.length > 0 && page.customSections.map((sec, sIdx) => (
        <section key={sec.id || sIdx}>
          {sec.title && (
            <h2
              className="text-xs uppercase font-bold tracking-wider mb-2 pb-0.5 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              {sec.title}
            </h2>
          )}
          {sec.content && (
            <FormattedText text={sec.content} className="text-slate-700 text-[11px] leading-snug" />
          )}
          {sec.items && sec.items.length > 0 && (
            <div className="space-y-2.5">
              {sec.items.map((it, iIdx) => (
                <div key={it.id || iIdx} className="relative pl-3 border-l-2" style={{ borderColor: `${themeColor}40` }}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="font-bold text-slate-900 text-[12px]">
                      {it.title} {it.subtitle && <span className="font-normal text-slate-600">at {it.subtitle}</span>}
                    </h3>
                  </div>
                  {it.description && (
                    <FormattedText text={it.description} className="text-slate-700 text-[11px] leading-snug mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  );

  return (
    <div 
      className="resume-pages-container flex flex-col gap-6 no-print:gap-6 print:gap-0"
      style={{ fontFamily }}
    >
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          data-page-number={page.pageNumber}
          data-layout-mode={page.layout}
          className="resume-page w-[794px] h-[1123px] bg-white text-slate-800 shadow-md relative overflow-hidden box-border"
          style={{
            width: '794px',
            height: '1123px',
            minHeight: '1123px',
            maxHeight: '1123px',
            boxSizing: 'border-box'
          }}
        >
          {/* Debug Layout Overlay */}
          {debug && (
            <>
              {page.diagnostics && (
                <div className="no-print absolute top-2 right-2 z-50 bg-slate-900/90 text-white text-[9.5px] font-mono px-2.5 py-1 rounded-md shadow-md pointer-events-none flex items-center gap-2">
                  <span className="text-blue-400 font-bold">P{page.pageNumber}</span>
                  <span>•</span>
                  <span className="text-emerald-300">{page.diagnostics.utilizationPercentage}% Utilized</span>
                  <span>•</span>
                  <span className="text-slate-300">{page.diagnostics.occupiedHeight}px / {page.diagnostics.printableHeight}px</span>
                </div>
              )}
              <div 
                className="no-print absolute pointer-events-none z-40 border border-dashed border-blue-400/40"
                style={{
                  top: `${page.pagePadding}px`,
                  bottom: `${page.pagePadding}px`,
                  left: page.layout === 'two-column' ? '20px' : '36px',
                  right: page.layout === 'two-column' ? '28px' : '36px'
                }}
              >
                <span className="absolute -top-3 left-2 bg-blue-600/90 text-white text-[8px] font-mono px-1 rounded">
                  Printable Boundary: {page.diagnostics?.printableHeight || 1033}px
                </span>
                {page.diagnostics?.remainingHeight > 30 && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/10 border-t border-dashed border-blue-400/50 text-blue-800 font-mono text-[9px] flex items-center justify-center select-none"
                    style={{ height: `${page.diagnostics.remainingHeight}px` }}
                  >
                    Unused Area: {page.diagnostics.remainingHeight}px ({100 - page.diagnostics.utilizationPercentage}% available)
                  </div>
                )}
              </div>
            </>
          )}

          {/* TWO-COLUMN LAYOUT */}
          {page.layout === 'two-column' && (
            <div 
              className="flex flex-row w-full h-full relative"
              style={{
                background: 'linear-gradient(to right, #f8fafc 0%, #f8fafc 32%, #e2e8f0 32%, #e2e8f0 calc(32% + 1px), #ffffff calc(32% + 1px), #ffffff 100%)'
              }}
            >
              {/* Left Sidebar (32%) */}
              <aside 
                className="w-[32%] bg-slate-50 border-r border-slate-200 flex flex-col gap-4 shrink-0 box-border text-[11.5px]"
                style={{
                  paddingTop: `${page.pagePadding}px`,
                  paddingBottom: `${page.pagePadding}px`,
                  paddingLeft: '20px',
                  paddingRight: '20px'
                }}
              >
                {/* Photo */}
                {page.sidebar?.showPhoto && personalDetails.photo && (
                  <div className="flex justify-center mb-1">
                    <img
                      src={personalDetails.photo}
                      alt={`${personalDetails.firstName || ''} ${personalDetails.lastName || ''}`}
                      className="w-24 h-24 rounded-full object-cover border-3 shadow-xs"
                      style={{ borderColor: themeColor }}
                    />
                  </div>
                )}

                {/* Details */}
                {page.sidebar?.showDetails && (
                  <section>
                    <h3 
                      className="text-xs uppercase font-bold tracking-wider mb-2 pb-1 border-b"
                      style={{ color: themeColor, borderColor: `${themeColor}40` }}
                    >
                      Details
                    </h3>
                    <div className="space-y-1.5 text-slate-600 text-[11px]">
                      {(personalDetails.address || personalDetails.postalCode) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0 opacity-70" style={{ color: themeColor }} />
                          <span className="truncate">{personalDetails.address}{personalDetails.postalCode ? `, ${personalDetails.postalCode}` : ''}</span>
                        </div>
                      )}
                      {personalDetails.city && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0 opacity-70" style={{ color: themeColor }} />
                          <span className="truncate">{personalDetails.city}{personalDetails.country ? `, ${personalDetails.country}` : ''}</span>
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
                          <span className="truncate">{personalDetails.email}</span>
                        </div>
                      )}
                      {personalDetails.nationality && (
                        <div className="text-[10.5px] text-slate-500 pt-0.5">
                          <span className="font-medium text-slate-700">Nationality: </span>
                          {personalDetails.nationality}
                        </div>
                      )}
                      {personalDetails.drivingLicense && (
                        <div className="text-[10.5px] text-slate-500">
                          <span className="font-medium text-slate-700">License: </span>
                          {personalDetails.drivingLicense}
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Links */}
                {page.sidebar?.showLinks && (
                  <section>
                    <h3 
                      className="text-xs uppercase font-bold tracking-wider mb-2 pb-1 border-b"
                      style={{ color: themeColor, borderColor: `${themeColor}40` }}
                    >
                      Links
                    </h3>
                    <div className="space-y-1.5 text-[11px]">
                      {personalDetails.website && (
                        <a 
                          href={personalDetails.website.startsWith('http') ? personalDetails.website : `https://${personalDetails.website}`} 
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
                          href={personalDetails.linkedin.startsWith('http') ? personalDetails.linkedin : `https://${personalDetails.linkedin}`} 
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
                          href={personalDetails.github.startsWith('http') ? personalDetails.github : `https://${personalDetails.github}`} 
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
                {page.sidebar?.skills && page.sidebar.skills.length > 0 && (
                  <section>
                    <h3 
                      className="text-xs uppercase font-bold tracking-wider mb-2 pb-1 border-b"
                      style={{ color: themeColor, borderColor: `${themeColor}40` }}
                    >
                      Skills
                    </h3>
                    <div className="space-y-1 text-[11px]">
                      {page.sidebar.skills.map((skill) => {
                        const tools = parseToolList(skill.name);
                        if (tools) {
                          return (
                            <div key={skill.id} className="py-1">
                              <div className="text-[10px] font-semibold text-slate-700 mb-1">Tools & Ecosystem</div>
                              <div className="flex flex-wrap gap-1">
                                {tools.map((t, idx) => (
                                  <span key={idx} className="bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-medium leading-tight shadow-2xs">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={skill.id} className="flex items-center justify-between gap-1 py-0.5 border-b border-slate-100 last:border-b-0">
                            <span className="font-medium text-slate-700 leading-tight pr-1">{skill.name}</span>
                            {skill.level !== undefined && (
                              <SkillBar level={skill.level} color={themeColor} compact />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Languages */}
                {page.sidebar?.languages && page.sidebar.languages.length > 0 && (
                  <section>
                    <h3 
                      className="text-xs uppercase font-bold tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5"
                      style={{ color: themeColor, borderColor: `${themeColor}40` }}
                    >
                      <LangIcon className="w-3.5 h-3.5" />
                      Languages
                    </h3>
                    <div className="space-y-1 text-[11px]">
                      {page.sidebar.languages.map((lang) => (
                        <div key={lang.id} className="flex justify-between items-baseline py-0.5">
                          <span className="font-medium text-slate-700">{lang.name}</span>
                          <span className="text-slate-500 text-[10px]">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {page.sidebar?.education && page.sidebar.education.length > 0 && (
                  <section>
                    <h3 
                      className="text-xs uppercase font-bold tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5"
                      style={{ color: themeColor, borderColor: `${themeColor}40` }}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      Education
                    </h3>
                    <div className="space-y-2 text-[11px]">
                      {page.sidebar.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="font-bold text-slate-800 leading-tight">{edu.degree}</div>
                          <div className="text-slate-600 mt-0.5">{edu.school}{edu.city ? `, ${edu.city}` : ''}</div>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {edu.startDate} — {edu.endDate || 'Present'}
                          </div>
                          {edu.description && (
                            <FormattedText text={edu.description} className="text-[10.5px] text-slate-600 mt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </aside>

              {/* Right Main Column (68%) */}
              <div 
                className="w-[68%] flex flex-col gap-4 flex-1 bg-transparent box-border"
                style={{
                  paddingTop: `${page.pagePadding}px`,
                  paddingBottom: `${page.pagePadding}px`,
                  paddingLeft: '28px',
                  paddingRight: '28px'
                }}
              >
                {renderMainContent(page)}
              </div>
            </div>
          )}

          {/* FULL-WIDTH CONTINUATION LAYOUT */}
          {page.layout === 'full-width' && (
            <div 
              className="w-full h-full flex flex-col gap-4 bg-white box-border text-[12px]"
              style={{
                paddingTop: `${page.pagePadding}px`,
                paddingBottom: `${page.pagePadding}px`,
                paddingLeft: '36px',
                paddingRight: '36px'
              }}
            >
              {renderMainContent(page)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
