import React from 'react';
import { FormattedText } from './FormattedText';
import { paginateGraphiteResume } from '../../utils/pagePaginator';

export function GraphiteTemplate({ resume = {}, debug = false, pagePadding = 45 }) {
  const {
    personalDetails = {},
    themeColor = '#23272e',
    fontFamily = "'Inter', sans-serif"
  } = resume;

  const accentColor = themeColor || '#23272e';
  const pages = paginateGraphiteResume(resume, { pagePadding });

  // Contact items for main header row (Page 1)
  const locationParts = [personalDetails.address, personalDetails.city, personalDetails.country].filter(Boolean);
  const locationStr = locationParts.join(', ');

  const primaryContacts = [];
  if (locationStr) primaryContacts.push({ id: 'loc', text: locationStr });
  if (personalDetails.email) primaryContacts.push({ id: 'email', text: personalDetails.email, href: `mailto:${personalDetails.email}` });
  if (personalDetails.phone) primaryContacts.push({ id: 'phone', text: personalDetails.phone, href: `tel:${personalDetails.phone}` });

  const webLinks = [];
  if (personalDetails.website) {
    webLinks.push({
      id: 'website',
      text: personalDetails.website.replace(/^https?:\/\/(www\.)?/, ''),
      href: personalDetails.website.startsWith('http') ? personalDetails.website : `https://${personalDetails.website}`
    });
  }
  if (personalDetails.linkedin) {
    webLinks.push({
      id: 'linkedin',
      text: personalDetails.linkedin.replace(/^https?:\/\/(www\.)?/, ''),
      href: personalDetails.linkedin.startsWith('http') ? personalDetails.linkedin : `https://${personalDetails.linkedin}`
    });
  }
  if (personalDetails.github) {
    webLinks.push({
      id: 'github',
      text: personalDetails.github.replace(/^https?:\/\/(www\.)?/, ''),
      href: personalDetails.github.startsWith('http') ? personalDetails.github : `https://${personalDetails.github}`
    });
  }

  // Reusable Main Column Content Stream
  const renderMainBlocks = (page) => (
    <>
      {/* Charcoal Name Band with Accent Highlight (Page 1) */}
      {page.showHeader && (
        <header 
          className="px-7 py-5 bg-[#23272e] text-white flex flex-col justify-center shrink-0 relative"
          style={{ borderBottom: `3.5px solid ${accentColor}` }}
        >
          <h1 className="text-[26px] font-extrabold tracking-[0.2em] text-white uppercase font-sans leading-tight">
            {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
          </h1>
          {personalDetails.jobTitle && (
            <p className="text-[10.5px] font-semibold tracking-[0.16em] uppercase mt-2 leading-relaxed text-slate-300">
              {personalDetails.jobTitle}
            </p>
          )}
        </header>
      )}

      <div 
        className="bg-white flex flex-col gap-4 flex-1 box-border"
        style={{
          paddingTop: page.showHeader ? '16px' : `${page.pagePadding}px`,
          paddingBottom: `${page.pagePadding}px`,
          paddingLeft: '28px',
          paddingRight: '28px'
        }}
      >
        {/* Contact Details (Page 1) */}
        {page.showHeader && (primaryContacts.length > 0 || webLinks.length > 0) && (
          <div className="space-y-1 text-[10.5px] text-slate-600 font-medium tracking-wide border-b border-slate-200/80 pb-3">
            {primaryContacts.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {primaryContacts.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <span className="text-slate-400 select-none">•</span>}
                    {item.href ? (
                      <a href={item.href} className="hover:underline transition-colors text-slate-700">
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            {webLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-500">
                {webLinks.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <span className="text-slate-400 select-none">•</span>}
                    <a href={item.href} target="_blank" rel="noreferrer" className="hover:underline hover:text-slate-800 transition-colors text-slate-600">
                      {item.text}
                    </a>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Summary (only on full-width continuation pages if summary spilled over) */}
        {page.showSummary && page.summary && page.layout === 'full-width' && (
          <section>
            <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 border-b-2" style={{ borderColor: accentColor }}>
              PROFESSIONAL SUMMARY
            </h2>
            <FormattedText text={page.summary} bulletColor={accentColor} className="text-stone-800 text-[10.5px] leading-relaxed mt-1" />
          </section>
        )}

        {/* Professional Experience */}
        {page.jobs && page.jobs.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 border-b-2" style={{ borderColor: accentColor }}>
              {page.jobsHeading ? page.jobsHeading.toUpperCase().replace('EMPLOYMENT HISTORY', 'PROFESSIONAL EXPERIENCE') : 'PROFESSIONAL EXPERIENCE'}
            </h2>
            <div className="space-y-3.5 mt-2.5">
              {page.jobs.map((job) => {
                const dateStr = [job.startDate, job.endDate || (job.startDate ? 'Present' : '')].filter(Boolean).join(' – ');
                const metaRight = [dateStr, job.city].filter(Boolean).join(' | ');

                return (
                  <div key={job.id} className="relative">
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <h3 className="font-bold text-slate-900 text-[12.5px]">{job.jobTitle}</h3>
                      {metaRight && <span className="text-[10.5px] text-slate-500 font-normal">{metaRight}</span>}
                    </div>
                    {job.employer && <div className="text-[11px] text-slate-600 font-medium mt-0.5">{job.employer}</div>}
                    {job.description && (
                      <FormattedText text={job.description} bulletColor={accentColor} className="text-[10.5px] text-slate-700 leading-snug mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Core Projects */}
        {page.projects && page.projects.length > 0 && (() => {
          const isTwoCol = page.layout === 'full-width' && page.projects.length >= 4;
          const otherProjects = page.projects.filter((p) => p.name && p.name.toLowerCase().includes('other project'));
          const featured = page.projects.filter((p) => !p.name || !p.name.toLowerCase().includes('other project'));

          // For 2-column layout: distribute into 2 balanced columns (masonry-style to prevent row height stretching)
          const col1 = [];
          const col2 = [];
          if (isTwoCol) {
            featured.forEach((p, idx) => {
              if (idx % 2 === 0) col1.push(p);
              else col2.push(p);
            });
          }

          const renderProjectCard = (proj) => (
            <div key={proj.id} data-card="true" className="relative flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <h3 className="font-bold text-slate-900 text-[11.5px] leading-tight">{proj.name}</h3>
                  {proj.link && (
                    <a 
                      href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[9.5px] text-blue-600 hover:text-blue-800 underline shrink-0"
                    >
                      View Project
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                    <span className="font-semibold text-slate-700">Stack: </span>
                    {proj.technologies}
                  </div>
                )}
                {proj.description && (
                  <FormattedText text={proj.description} bulletColor={accentColor} className="text-[10px] text-slate-700 leading-snug mt-1" />
                )}
              </div>
            </div>
          );

          const renderOtherProjectCard = (proj) => {
            const items = (proj.description || '').split(/\||\n/).map((s) => s.trim()).filter(Boolean);
            return (
              <div key={proj.id} className="w-full bg-stone-50 p-2.5 rounded border border-stone-200 mt-2.5">
                <div className="font-bold text-slate-800 text-[11px] mb-1">{proj.name}</div>
                <div className="flex flex-wrap gap-1">
                  {items.map((it, idx) => (
                    <span key={idx} className="bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-medium shadow-2xs">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            );
          };

          return (
            <section>
              <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 border-b-2" style={{ borderColor: accentColor }}>
                {page.projectsHeading ? page.projectsHeading.toUpperCase().replace('KEY PROJECTS', 'CORE PROJECTS') : 'CORE PROJECTS'}
              </h2>

              {isTwoCol ? (
                <>
                  <div 
                    className="flex flex-row gap-6 mt-2.5" 
                    style={{ display: 'flex', flexDirection: 'row', gap: '24px', width: '100%' }}
                  >
                    <div className="flex flex-col gap-3 flex-1" style={{ flex: '1 1 0%', minWidth: 0 }}>
                      {col1.map(renderProjectCard)}
                    </div>
                    <div className="flex flex-col gap-3 flex-1" style={{ flex: '1 1 0%', minWidth: 0 }}>
                      {col2.map(renderProjectCard)}
                    </div>
                  </div>
                  {otherProjects.map(renderOtherProjectCard)}
                </>
              ) : (
                <div className="space-y-3 mt-2.5">
                  {featured.map(renderProjectCard)}
                  {otherProjects.map(renderOtherProjectCard)}
                </div>
              )}
            </section>
          );
        })()}

        {/* Certifications (if full-width) */}
        {page.certifications && page.certifications.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 border-b-2" style={{ borderColor: accentColor }}>
              CERTIFICATIONS
            </h2>
            <div 
              className="grid grid-cols-3 gap-2.5 text-[10.5px] mt-2" 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}
            >
              {page.certifications.map((cert) => (
                <div key={cert.id} className="border border-stone-200 p-2.5 rounded bg-stone-50 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{cert.name}</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">{cert.issuer}</div>
                  </div>
                  {cert.date && (
                    <div className="text-slate-400 text-[9.5px] mt-1 font-mono truncate">{cert.date}</div>
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
              <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 border-b-2" style={{ borderColor: accentColor }}>
                {sec.title.toUpperCase()}
              </h2>
            )}
            {sec.content && (
              <FormattedText text={sec.content} bulletColor={accentColor} className="text-[10.5px] text-slate-700 leading-snug mt-1" />
            )}
            {sec.items && sec.items.length > 0 && (
              <div className="space-y-2 mt-1.5">
                {sec.items.map((it, iIdx) => (
                  <div key={it.id || iIdx}>
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <h3 className="font-bold text-slate-900 text-[12px]">{it.title}</h3>
                      {it.subtitle && <span className="text-[10.5px] text-slate-500 font-normal">{it.subtitle}</span>}
                    </div>
                    {it.description && (
                      <FormattedText text={it.description} bulletColor={accentColor} className="text-[10.5px] text-slate-700 leading-snug mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );

  return (
    <div className="resume-pages-container flex flex-col gap-6 no-print:gap-6 print:gap-0" style={{ fontFamily }}>
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          data-page-number={page.pageNumber}
          data-layout-mode={page.layout}
          className="resume-page w-[794px] h-[1123px] bg-white text-slate-800 shadow-md relative overflow-hidden box-border"
          style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', boxSizing: 'border-box' }}
        >
          {debug && (
            <>
              {page.diagnostics && (
                <div className="no-print absolute top-2 right-2 z-50 bg-slate-900/90 text-white text-[9.5px] font-mono px-2 py-0.5 rounded shadow pointer-events-none">
                  P{page.pageNumber} • {page.diagnostics.utilizationPercentage}% Utilized
                </div>
              )}
              <div 
                className="no-print absolute pointer-events-none z-40 border border-dashed border-blue-400/40"
                style={{
                  top: `${page.pagePadding}px`,
                  bottom: `${page.pagePadding}px`,
                  left: page.layout === 'two-column' ? '18px' : '28px',
                  right: page.layout === 'two-column' ? '28px' : '28px'
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
                background: 'linear-gradient(to right, #e8e6e1 0%, #e8e6e1 31%, #d6d3cd 31%, #d6d3cd calc(31% + 1px), #ffffff calc(31% + 1px), #ffffff 100%)'
              }}
            >
              {/* Full-Height Warm-Grey Left Sidebar */}
              <aside 
                className="w-[31%] bg-[#e8e6e1] border-r border-[#d6d3cd] flex flex-col gap-4 shrink-0 box-border text-[11px]"
                style={{
                  paddingTop: `${page.pagePadding}px`,
                  paddingBottom: `${page.pagePadding}px`,
                  paddingLeft: '18px',
                  paddingRight: '18px'
                }}
              >
                {/* Photo */}
                {page.sidebar?.showPhoto && personalDetails.photo && (
                  <div className="flex justify-center mb-1">
                    <img src={personalDetails.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-3 shadow-xs" style={{ borderColor: accentColor }} />
                  </div>
                )}

                {/* Professional Summary (Sidebar on Page 1) */}
                {page.sidebar?.showSummary && page.sidebar.summary && (
                  <section>
                    <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 mb-2 border-b border-stone-300">
                      PROFESSIONAL SUMMARY
                    </h2>
                    <FormattedText text={page.sidebar.summary} bulletColor={accentColor} className="text-stone-800 text-[10.5px] leading-relaxed" />
                  </section>
                )}

                {/* Core Competencies (Skills without dots) */}
                {page.sidebar?.skills && page.sidebar.skills.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 mb-2 border-b border-stone-300">
                      CORE PROJECT &amp; DELIVERY COMPETENCIES
                    </h2>
                    <div className="space-y-1.5 text-[10.5px] text-stone-800 font-medium">
                      {page.sidebar.skills.map((s) => (
                        <div key={s.id}>{s.name}</div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Languages */}
                {page.sidebar?.languages && page.sidebar.languages.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 mb-2 border-b border-stone-300">
                      LANGUAGES
                    </h2>
                    <div className="space-y-1.5 text-[10.5px] text-stone-800">
                      {page.sidebar.languages.map((l) => (
                        <div key={l.id} className="flex justify-between items-baseline">
                          <span className="font-semibold text-stone-900">{l.name}</span>
                          <span className="text-stone-500 text-[10px]">{l.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {page.sidebar?.education && page.sidebar.education.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 mb-2 border-b border-stone-300">
                      EDUCATION
                    </h2>
                    <div className="space-y-2 text-[10.5px] text-stone-800">
                      {page.sidebar.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="font-bold text-slate-900">{edu.degree}</div>
                          <div className="text-slate-600 text-[10px]">{edu.school}{edu.city ? `, ${edu.city}` : ''}</div>
                          <div className="text-slate-400 text-[9.5px] mt-0.5">{edu.startDate} – {edu.endDate || 'Present'}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications (Sidebar) */}
                {page.sidebar?.certifications && page.sidebar.certifications.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold tracking-[0.22em] text-slate-900 uppercase pb-1 mb-2 border-b border-stone-300">
                      CERTIFICATIONS
                    </h2>
                    <div className="space-y-2 text-[10.5px] text-stone-800">
                      {page.sidebar.certifications.map((cert) => (
                        <div key={cert.id}>
                          <div className="font-bold text-slate-900">{cert.name}</div>
                          <div className="text-slate-600 text-[10px]">{cert.issuer}</div>
                          {cert.date && (
                            <div className="text-slate-400 text-[9.5px] mt-0.5 truncate">{cert.date}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </aside>

              {/* Main Column */}
              <main className="w-[69%] flex flex-col flex-1 min-w-0 break-words bg-white">
                {renderMainBlocks(page)}
              </main>
            </div>
          )}

          {/* FULL-WIDTH CONTINUATION LAYOUT */}
          {page.layout === 'full-width' && (
            <div 
              className="w-full h-full flex flex-col bg-white box-border text-[12px]" 
              style={{
                paddingTop: '0px',
                paddingBottom: '0px'
              }}
            >
              {renderMainBlocks(page)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
