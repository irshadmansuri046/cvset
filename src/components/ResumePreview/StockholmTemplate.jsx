import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';
import { FormattedText } from './FormattedText';
import { paginateResume } from '../../utils/dynamicPaginator';

export function StockholmTemplate({ resume = {}, debug = false, pagePadding = 40 }) {
  const {
    personalDetails = {},
    themeColor = '#0f766e',
    fontFamily = 'Inter'
  } = resume;

  const { pages } = paginateResume(resume, { template: 'stockholm', pagePadding });

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

          <div className="w-full flex flex-col gap-4 text-[13px] leading-relaxed">
            {page.main.map((block) => {
              if (block.type === 'header') {
                return (
                  <header key={block.id} className="flex items-center justify-between border-b pb-5" style={{ borderColor: `${themeColor}30` }}>
                    <div className="flex-1">
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
                      </h1>
                      {personalDetails.jobTitle && (
                        <p className="text-base font-semibold mt-1" style={{ color: themeColor }}>
                          {personalDetails.jobTitle}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[12px] text-slate-600">
                        {(personalDetails.address || personalDetails.postalCode) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {personalDetails.address}{personalDetails.postalCode ? `, ${personalDetails.postalCode}` : ''}
                          </span>
                        )}
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
                        {personalDetails.nationality && (
                          <span className="text-slate-500">Nationality: {personalDetails.nationality}</span>
                        )}
                        {personalDetails.drivingLicense && (
                          <span className="text-slate-500">License: {personalDetails.drivingLicense}</span>
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
                );
              }

              if (block.type === 'heading') {
                return (
                  <h2 key={block.id} className="text-xs uppercase font-extrabold tracking-wider mb-1 flex items-center gap-2" style={{ color: themeColor }}>
                    <span>{block.title}</span>
                    <span className="flex-1 h-px bg-slate-200"></span>
                  </h2>
                );
              }

              if (block.type === 'text') {
                return (
                  <FormattedText key={block.id} text={block.text} className="text-slate-700 text-[13px]" />
                );
              }

              if (block.type === 'entry') {
                return (
                  <div key={block.id} className="relative mb-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-[13.5px]">
                        {block.title} {block.subtitle ? <span className="font-medium text-slate-600">at {block.subtitle}</span> : null}
                      </h3>
                      {block.dateStr && (
                        <span className="text-[11.5px] text-slate-500 font-medium">
                          {block.dateStr}
                        </span>
                      )}
                    </div>
                    {block.text && (
                      <FormattedText text={block.text} className="text-slate-700 text-[12px] mt-1" />
                    )}
                  </div>
                );
              }

              if (block.type === 'chips') {
                return (
                  <div key={block.id} className="flex flex-wrap gap-2 mb-2">
                    {(block.items || []).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[12px] font-medium border"
                        style={{
                          backgroundColor: `${themeColor}08`,
                          borderColor: `${themeColor}25`,
                          color: '#1e293b'
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                );
              }

              if (block.type === 'card') {
                return (
                  <div key={block.id} className="border border-slate-200 p-3 rounded-lg mb-2">
                    <div className="flex justify-between items-baseline font-bold text-slate-800 text-[13px]">
                      <span>{block.title}</span>
                      {block.link && (
                        <a href={block.link} target="_blank" rel="noreferrer" className="text-[11px] text-teal-600 hover:underline">
                          Link ↗
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

              if (block.type === 'grid') {
                return (
                  <div key={block.id} className="grid grid-cols-2 gap-3 mb-2">
                    {(block.items || []).map((c) => (
                      <div key={c.id} className="border border-slate-200 p-2.5 rounded bg-slate-50/50">
                        <div className="font-semibold text-slate-800 text-[12px]">{c.name}</div>
                        <div className="text-slate-500 text-[11px]">{c.issuer} {c.date ? `• ${c.date}` : ''}</div>
                      </div>
                    ))}
                  </div>
                );
              }

              if (block.type === 'list') {
                return (
                  <div key={block.id} className="grid grid-cols-2 gap-2 text-[12px] mb-2">
                    {(block.items || []).map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-700">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-slate-500">{item.level}</span>
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
