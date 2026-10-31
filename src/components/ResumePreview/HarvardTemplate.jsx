import React from 'react';
import { FormattedText } from './FormattedText';
import { paginateResume } from '../../utils/dynamicPaginator';

export function HarvardTemplate({ resume = {}, debug = false, pagePadding = 48 }) {
  const {
    personalDetails = {},
    themeColor = '#1e293b',
    fontFamily = "'Merriweather', Georgia, serif"
  } = resume;

  const { pages } = paginateResume(resume, { template: 'harvard', pagePadding });

  return (
    <div className="resume-pages-container flex flex-col gap-6 no-print:gap-6 print:gap-0" style={{ fontFamily: resume.fontFamily || fontFamily }}>
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          data-page-number={page.pageNumber}
          data-layout-mode={page.layout}
          className="resume-page w-[794px] h-[1123px] bg-white text-slate-900 shadow-md relative overflow-hidden box-border flex flex-col font-serif"
          style={{
            width: '794px',
            height: '1123px',
            minHeight: '1123px',
            maxHeight: '1123px',
            boxSizing: 'border-box',
            padding: `${page.pagePadding}px 48px`
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
                  top: `${page.pagePadding}px`,
                  bottom: `${page.pagePadding}px`,
                  left: '48px',
                  right: '48px'
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

          <div className="w-full flex flex-col gap-4 text-[12.5px] leading-relaxed">
            {page.main.map((block) => {
              if (block.type === 'header') {
                return (
                  <header key={block.id} className="text-center pb-3 border-b-2" style={{ borderColor: themeColor }}>
                    <h1 className="text-3xl font-bold tracking-normal uppercase text-slate-950 font-serif">
                      {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
                    </h1>
                    {personalDetails.jobTitle && (
                      <p className="text-sm italic font-medium text-slate-700 mt-1">
                        {personalDetails.jobTitle}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[11.5px] text-slate-600 font-sans">
                      {(personalDetails.address || personalDetails.postalCode) && (
                        <span>{personalDetails.address}{personalDetails.postalCode ? `, ${personalDetails.postalCode}` : ''} •</span>
                      )}
                      {personalDetails.city && <span>{personalDetails.city}{personalDetails.country ? `, ${personalDetails.country}` : ''}</span>}
                      {personalDetails.phone && <span>• {personalDetails.phone}</span>}
                      {personalDetails.email && <span>• {personalDetails.email}</span>}
                      {personalDetails.linkedin && <span>• {personalDetails.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                      {personalDetails.github && <span>• {personalDetails.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                      {personalDetails.website && <span>• {personalDetails.website.replace(/^https?:\/\//, '')}</span>}
                      {personalDetails.nationality && <span>• {personalDetails.nationality}</span>}
                    </div>
                  </header>
                );
              }

              if (block.type === 'heading') {
                return (
                  <h2 
                    key={block.id}
                    className="text-xs font-bold uppercase tracking-widest pb-1 mb-1 border-b font-sans"
                    style={{ color: themeColor, borderColor: '#cbd5e1' }}
                  >
                    {block.title}
                  </h2>
                );
              }

              if (block.type === 'text') {
                return (
                  <FormattedText key={block.id} text={block.text} className="text-slate-800 text-[12px] mb-2" />
                );
              }

              if (block.type === 'entry') {
                return (
                  <div key={block.id} className="relative mb-2.5">
                    <div className="flex justify-between items-baseline font-bold text-slate-950">
                      <span>{block.title} {block.subtitle ? <span className="font-normal italic text-slate-700">— {block.subtitle}</span> : null}</span>
                      {block.dateStr && (
                        <span className="text-[11px] font-normal text-slate-600 font-sans">
                          {block.dateStr}
                        </span>
                      )}
                    </div>
                    {block.text && (
                      <div className="text-slate-800 text-[12px] pl-3 border-l border-slate-300 mt-1">
                        <FormattedText text={block.text} />
                      </div>
                    )}
                  </div>
                );
              }

              if (block.type === 'card') {
                return (
                  <div key={block.id} className="mb-2">
                    <div className="flex justify-between items-baseline font-bold text-slate-950 text-[12.5px]">
                      <span>{block.title}</span>
                      {block.link && (
                        <a href={block.link} target="_blank" rel="noreferrer" className="text-[11px] font-normal text-slate-600 font-sans underline">
                          Link
                        </a>
                      )}
                    </div>
                    {block.subtitle && (
                      <div className="text-[11px] text-slate-600 font-sans italic mt-0.5">{block.subtitle}</div>
                    )}
                    {block.text && (
                      <FormattedText text={block.text} className="text-slate-800 text-[12px] mt-0.5" />
                    )}
                  </div>
                );
              }

              if (block.type === 'chips') {
                return (
                  <div key={block.id} className="text-[12px] text-slate-800 mb-2">
                    {(block.items || []).join(' • ')}
                  </div>
                );
              }

              if (block.type === 'grid') {
                return (
                  <div key={block.id} className="space-y-1 text-[12px] mb-2">
                    {(block.items || []).map((c) => (
                      <div key={c.id}>
                        <span className="font-bold text-slate-950">{c.name}</span>
                        {c.issuer && <span className="text-slate-600"> — {c.issuer}</span>}
                        {c.date && <span className="text-slate-500 font-sans text-[11px]"> ({c.date})</span>}
                      </div>
                    ))}
                  </div>
                );
              }

              if (block.type === 'list') {
                return (
                  <div key={block.id} className="space-y-1 text-[12px] mb-2">
                    {(block.items || []).map((item) => (
                      <div key={item.id}>
                        <span className="font-bold text-slate-950">{item.name}</span>
                        {item.level && <span className="text-slate-600"> ({item.level})</span>}
                      </div>
                    ))}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
