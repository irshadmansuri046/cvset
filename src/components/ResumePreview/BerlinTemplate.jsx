import React from 'react';
import { Terminal } from 'lucide-react';
import { FormattedText } from './FormattedText';
import { paginateResume } from '../../utils/dynamicPaginator';

export function BerlinTemplate({ resume = {}, debug = false, pagePadding = 40 }) {
  const {
    personalDetails = {},
    themeColor = '#dc2626',
    fontFamily = 'Inter'
  } = resume;

  const { pages } = paginateResume(resume, { template: 'berlin', pagePadding });

  return (
    <div className="resume-pages-container flex flex-col gap-6 no-print:gap-6 print:gap-0" style={{ fontFamily }}>
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          data-page-number={page.pageNumber}
          data-layout-mode={page.layout}
          className="resume-page w-[794px] h-[1123px] bg-white text-slate-800 shadow-md relative overflow-hidden box-border flex flex-col"
          style={{
            width: '794px',
            height: '1123px',
            minHeight: '1123px',
            maxHeight: '1123px',
            boxSizing: 'border-box',
            padding: `${page.pagePadding}px 40px`
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
                  left: '40px',
                  right: '40px'
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

          <div className="w-full flex flex-col gap-3.5 text-[12.5px] leading-relaxed">
            {page.main.map((block) => {
              if (block.type === 'header') {
                return (
                  <header key={block.id} className="border-b-2 border-slate-900 pb-3 flex flex-row justify-between items-end gap-4">
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

                    <div className="font-mono text-[11px] text-slate-600 space-y-0.5 text-right">
                      {personalDetails.email && <div>{personalDetails.email}</div>}
                      {personalDetails.phone && <div>{personalDetails.phone}</div>}
                      {(personalDetails.address || personalDetails.city) && (
                        <div>
                          {personalDetails.address ? `${personalDetails.address}, ` : ''}
                          {personalDetails.city}
                          {personalDetails.country ? `, ${personalDetails.country}` : ''}
                          {personalDetails.postalCode ? ` (${personalDetails.postalCode})` : ''}
                        </div>
                      )}
                      {personalDetails.nationality && <div>Nationality: {personalDetails.nationality}</div>}
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
                );
              }

              if (block.type === 'heading') {
                return (
                  <h2 key={block.id} className="text-xs font-mono font-bold uppercase tracking-wider mb-1 flex items-center gap-2" style={{ color: themeColor }}>
                    <span>{block.title}</span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </h2>
                );
              }

              if (block.type === 'text') {
                return (
                  <div key={block.id} className="bg-slate-50 p-3 rounded border border-slate-200 mb-1">
                    <FormattedText text={block.text} className="text-slate-800 text-[12px]" />
                  </div>
                );
              }

              if (block.type === 'entry') {
                return (
                  <div key={block.id} className="relative border-l-2 pl-3 mb-2" style={{ borderColor: themeColor }}>
                    <div className="flex justify-between items-baseline font-mono text-[13px]">
                      <span className="font-bold text-slate-900">{block.title}</span>
                      {block.dateStr && (
                        <span className="text-[11px] text-slate-500 font-normal">
                          {block.dateStr}
                        </span>
                      )}
                    </div>
                    {block.subtitle && (
                      <div className="text-[11.5px] font-medium text-slate-600 mb-0.5">
                        {block.subtitle}
                      </div>
                    )}
                    {block.text && (
                      <FormattedText text={block.text} className="text-slate-700 text-[12px] mt-0.5 font-sans" />
                    )}
                  </div>
                );
              }

              if (block.type === 'card') {
                return (
                  <div key={block.id} className="border border-slate-200 p-2.5 rounded font-mono text-[11.5px] mb-1.5">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{block.title}</span>
                      {block.link && (
                        <a href={block.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[10.5px]">
                          [link]
                        </a>
                      )}
                    </div>
                    {block.subtitle && (
                      <div className="text-[10.5px] text-slate-500 mt-0.5">{block.subtitle}</div>
                    )}
                    {block.text && (
                      <FormattedText text={block.text} className="text-slate-600 font-sans text-[11.5px] mt-0.5" />
                    )}
                  </div>
                );
              }

              if (block.type === 'chips') {
                return (
                  <div key={block.id} className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-1.5">
                    {(block.items || []).map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-medium text-slate-800">
                        {name}
                      </span>
                    ))}
                  </div>
                );
              }

              if (block.type === 'grid') {
                return (
                  <div key={block.id} className="grid grid-cols-2 gap-2 text-[11.5px] mb-1.5 font-mono">
                    {(block.items || []).map((c) => (
                      <div key={c.id} className="text-slate-700">
                        • <span className="font-semibold text-slate-900">{c.name}</span> {c.issuer && <span className="text-slate-500">({c.issuer})</span>}
                      </div>
                    ))}
                  </div>
                );
              }

              if (block.type === 'list') {
                return (
                  <div key={block.id} className="grid grid-cols-2 gap-2 text-[11.5px] mb-1.5 font-mono">
                    {(block.items || []).map((l) => (
                      <div key={l.id} className="text-slate-700">
                        • <span className="font-semibold text-slate-900">{l.name}</span>: <span className="text-slate-500">{l.level}</span>
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
