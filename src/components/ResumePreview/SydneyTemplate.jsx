import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';
import { SkillBar } from './SkillBar';
import { FormattedText } from './FormattedText';
import { paginateResume } from '../../utils/dynamicPaginator';

export function SydneyTemplate({ resume = {}, debug = false, pagePadding = 36 }) {
  const {
    personalDetails = {},
    themeColor = '#7c3aed',
    fontFamily = 'Outfit'
  } = resume;

  const { pages } = paginateResume(resume, { template: 'sydney', pagePadding });

  const renderMainBlock = (block) => {
    if (block.type === 'header') return null; // Header rendered as top banner on page 1

    if (block.type === 'heading') {
      return (
        <h2 key={block.id} className="text-xs uppercase font-extrabold tracking-wider mb-1" style={{ color: themeColor }}>
          {block.title}
        </h2>
      );
    }

    if (block.type === 'text') {
      return (
        <FormattedText key={block.id} text={block.text} className="text-slate-700 text-[12.5px] mb-2" />
      );
    }

    if (block.type === 'entry') {
      return (
        <div key={block.id} className="relative pl-3 border-l-2 mb-3" style={{ borderColor: `${themeColor}50` }}>
          <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13.5px]">
            <span>{block.title}</span>
            {block.dateStr && (
              <span className="text-[11px] font-medium text-slate-500">
                {block.dateStr}
              </span>
            )}
          </div>
          {block.subtitle && (
            <div className="text-[12px] font-medium text-slate-600 mb-0.5">
              {block.subtitle}
            </div>
          )}
          {block.text && (
            <FormattedText text={block.text} className="text-slate-700 text-[12px] mt-0.5" />
          )}
        </div>
      );
    }

    if (block.type === 'card') {
      return (
        <div key={block.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2">
          <div className="flex justify-between items-baseline font-bold text-slate-800 text-[13px]">
            <span>{block.title}</span>
            {block.link && (
              <a href={block.link} target="_blank" rel="noreferrer" className="text-[11px] hover:underline" style={{ color: themeColor }}>
                Visit Project ↗
              </a>
            )}
          </div>
          {block.subtitle && (
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{block.subtitle}</div>
          )}
          {block.text && (
            <FormattedText text={block.text} className="text-slate-600 text-[12px] mt-1" />
          )}
        </div>
      );
    }

    if (block.type === 'chips') {
      return (
        <div key={block.id} className="flex flex-wrap gap-1.5 mb-2">
          {(block.items || []).map((name, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
              {name}
            </span>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderSidebarBlock = (block) => {
    if (block.type === 'heading') {
      return (
        <h2 key={block.id} className="text-xs uppercase font-extrabold tracking-wider mb-2" style={{ color: themeColor }}>
          {block.title}
        </h2>
      );
    }

    if (block.type === 'skill-bar') {
      const s = block.skill || {};
      return (
        <div key={block.id} className="text-[12px] mb-2">
          <div className="flex justify-between font-medium text-slate-700">
            <span>{s.name}</span>
          </div>
          <SkillBar level={s.level} color={themeColor} />
        </div>
      );
    }

    if (block.type === 'edu-item') {
      const edu = block.education || {};
      return (
        <div key={block.id} className="text-[12px] mb-2.5">
          <div className="font-bold text-slate-900">{edu.degree}</div>
          <div className="text-slate-600">{edu.school}</div>
          <div className="text-[11px] text-slate-400 font-medium">{edu.startDate} — {edu.endDate || 'Present'}</div>
          {edu.description && <FormattedText text={edu.description} className="text-slate-500 text-[11px] mt-0.5" />}
        </div>
      );
    }

    if (block.type === 'lang-item') {
      const l = block.language || {};
      return (
        <div key={block.id} className="flex justify-between text-[12px] mb-1.5">
          <span className="font-medium text-slate-700">{l.name}</span>
          <span className="text-slate-500 text-[11px]">{l.level}</span>
        </div>
      );
    }

    if (block.type === 'cert-item') {
      const c = block.cert || {};
      return (
        <div key={block.id} className="border border-slate-100 p-2 rounded bg-slate-50/50 text-[12px] mb-2">
          <div className="font-semibold text-slate-800">{c.name}</div>
          <div className="text-slate-500 text-[11px]">{c.issuer}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="resume-pages-container flex flex-col gap-6 no-print:gap-6 print:gap-0" style={{ fontFamily }}>
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          data-page-number={page.pageNumber}
          data-layout-mode={page.layout}
          className="resume-page w-[794px] h-[1123px] bg-white text-slate-800 shadow-md relative overflow-hidden box-border flex flex-col font-sans"
          style={{
            width: '794px',
            height: '1123px',
            minHeight: '1123px',
            maxHeight: '1123px',
            boxSizing: 'border-box',
            padding: page.pageNumber === 1 ? '0' : `${page.pagePadding}px 36px`
          }}
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
                  top: page.pageNumber === 1 ? '145px' : `${page.pagePadding}px`,
                  bottom: `${page.pagePadding}px`,
                  left: '36px',
                  right: '36px'
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

          {/* Banner Header on Page 1 */}
          {page.pageNumber === 1 && (
            <header 
              className="p-6 text-white relative flex flex-row items-center justify-between gap-6 shrink-0"
              style={{ backgroundColor: themeColor }}
            >
              <div className="flex-1 text-left">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
                </h1>
                {personalDetails.jobTitle && (
                  <p className="text-base font-medium text-white/90 mt-0.5">
                    {personalDetails.jobTitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-start gap-2 mt-2.5 text-[11px] text-white/85">
                  {(personalDetails.address || personalDetails.postalCode) && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {personalDetails.address}{personalDetails.postalCode ? `, ${personalDetails.postalCode}` : ''}
                    </span>
                  )}
                  {personalDetails.city && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {personalDetails.city}{personalDetails.country ? `, ${personalDetails.country}` : ''}
                    </span>
                  )}
                  {personalDetails.email && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      <Mail className="w-3 h-3" />
                      {personalDetails.email}
                    </span>
                  )}
                  {personalDetails.phone && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      <Phone className="w-3 h-3" />
                      {personalDetails.phone}
                    </span>
                  )}
                  {personalDetails.linkedin && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      <Linkedin className="w-3 h-3" />
                      LinkedIn
                    </span>
                  )}
                  {personalDetails.github && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      <Github className="w-3 h-3" />
                      GitHub
                    </span>
                  )}
                  {personalDetails.website && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      <Globe className="w-3 h-3" />
                      Portfolio
                    </span>
                  )}
                  {personalDetails.nationality && (
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                      {personalDetails.nationality}
                    </span>
                  )}
                </div>
              </div>

              {personalDetails.showPhoto && personalDetails.photo && (
                <img
                  src={personalDetails.photo}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
                />
              )}
            </header>
          )}

          {/* Page Body Area */}
          <div className={page.pageNumber === 1 ? "p-6 flex-1 flex flex-col" : "w-full flex-1 flex flex-col"}>
            {page.layout === 'two-column' ? (
              <div className="flex flex-row gap-6 w-full flex-1">
                {/* Main column */}
                <div className="flex-1 min-w-0 break-words flex flex-col">
                  {page.main.map(renderMainBlock)}
                </div>

                {/* Sidebar column */}
                <div className="w-[34%] shrink-0 flex flex-col border-l border-slate-100 pl-5">
                  {page.sidebar.map(renderSidebarBlock)}
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col">
                {page.main.map(renderMainBlock)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
