import React from 'react';
import { FormattedText } from './FormattedText';
import { paginateOsloResume } from '../../utils/pagePaginator';

/**
 * Converts a language proficiency string or numeric level into a 1–5 dot count.
 */
function getLanguageDotCount(level = '') {
  if (typeof level === 'number') {
    return Math.min(5, Math.max(1, Math.round(level)));
  }
  const normalized = String(level).toLowerCase().trim();
  if (/native|fluent|bilingual|proficient|c2|mother/.test(normalized)) return 5;
  if (/advanced|upper|c1/.test(normalized)) return 4;
  if (/intermediate|conversational|working|b1|b2/.test(normalized)) return 3;
  if (/basic|elementary|a2/.test(normalized)) return 2;
  if (/beginner|a1/.test(normalized)) return 1;
  return 4;
}

/**
 * Reusable section heading with wide uppercase tracking and short solid accent bar.
 */
function OsloSectionHeading({ title, accentColor = '#222222' }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <h2
        className="uppercase font-bold"
        style={{
          fontSize: '10.5px',
          letterSpacing: '0.2em',
          color: '#1a1a1a',
          lineHeight: 1.2
        }}
      >
        {title}
      </h2>
      <div
        style={{
          width: '28px',
          height: '1.5px',
          backgroundColor: accentColor,
          marginTop: '5px'
        }}
      />
    </div>
  );
}

export function OsloTemplate({ resume = {}, debug = false, pagePadding = 45 }) {
  const {
    personalDetails = {},
    themeColor = '#1a1a1a',
    fontFamily
  } = resume;

  const accentColor = themeColor || '#1a1a1a';
  const activeFont = fontFamily && fontFamily !== 'Inter'
    ? fontFamily
    : "'Montserrat', 'Inter', sans-serif";

  const pages = paginateOsloResume(resume, { pagePadding });

  // Track whether SKILLS heading has already been rendered on an earlier page
  let skillsHeadingRendered = false;

  const addressLines = [
    personalDetails.address,
    [personalDetails.city, personalDetails.postalCode].filter(Boolean).join(', '),
    personalDetails.country
  ].filter(Boolean);

  const webLinks = [];
  if (personalDetails.linkedin) {
    webLinks.push({
      id: 'linkedin',
      label: 'LinkedIn',
      href: personalDetails.linkedin.startsWith('http') ? personalDetails.linkedin : `https://${personalDetails.linkedin}`
    });
  }
  if (personalDetails.github) {
    webLinks.push({
      id: 'github',
      label: 'GitHub',
      href: personalDetails.github.startsWith('http') ? personalDetails.github : `https://${personalDetails.github}`
    });
  }
  if (personalDetails.website) {
    webLinks.push({
      id: 'website',
      label: 'Portfolio',
      href: personalDetails.website.startsWith('http') ? personalDetails.website : `https://${personalDetails.website}`
    });
  }

  return (
    <div
      className="resume-pages-container flex flex-col gap-6 no-print:gap-6 print:gap-0"
      style={{ fontFamily: activeFont }}
    >
      {pages.map((page) => {
        const showSkillsHeading = page.sidebar.skills.length > 0 && !skillsHeadingRendered;
        if (page.sidebar.skills.length > 0) {
          skillsHeadingRendered = true;
        }

        const hasContactDetails = page.sidebar.showDetails && (
          addressLines.length > 0 || personalDetails.phone || personalDetails.email
        );

        return (
          <div
            key={page.pageNumber}
            data-page-number={page.pageNumber}
            data-layout-mode={page.layout}
            className="resume-page w-[794px] h-[1123px] bg-white text-[#222222] shadow-md relative overflow-hidden box-border flex flex-col"
            style={{
              width: '794px',
              height: '1123px',
              minHeight: '1123px',
              maxHeight: '1123px',
              boxSizing: 'border-box',
              backgroundColor: '#ffffff'
            }}
          >
            {/* Full-height left sidebar background strip (#f4f4f4) across all pages */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '246px',
                backgroundColor: '#f4f4f4',
                zIndex: 0
              }}
            />

            {/* Foreground content container */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                height: '100%'
              }}
            >
              {/* Page 1: Centered Boxed Header spanning across sidebar/main boundary */}
              {page.showHeader && (
                <header
                  style={{
                    paddingTop: '30px',
                    paddingBottom: '28px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      border: `1.5px solid ${accentColor}`,
                      padding: '18px 36px',
                      minWidth: '410px',
                      maxWidth: '480px',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <h1
                      className="uppercase font-bold"
                      style={{
                        fontSize: '21px',
                        letterSpacing: '0.22em',
                        color: '#1a1a1a',
                        lineHeight: 1.25
                      }}
                    >
                      {personalDetails.firstName || 'First'} {personalDetails.lastName || 'Last'}
                    </h1>
                    {personalDetails.jobTitle && (
                      <p
                        className="uppercase font-medium"
                        style={{
                          fontSize: '9.8px',
                          letterSpacing: '0.14em',
                          color: '#333333',
                          marginTop: '7px',
                          lineHeight: 1.35
                        }}
                      >
                        {personalDetails.jobTitle}
                      </p>
                    )}
                  </div>
                </header>
              )}

              {/* Two-Column Body */}
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  width: '794px',
                  maxWidth: '794px',
                  paddingTop: page.showHeader ? '0px' : '46px'
                }}
              >
                {/* Left Sidebar Column (246px) */}
                <aside
                  style={{
                    flex: '0 0 246px',
                    width: '246px',
                    maxWidth: '246px',
                    paddingLeft: '44px',
                    paddingRight: '22px',
                    paddingBottom: '42px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    overflowWrap: 'break-word'
                  }}
                >
                  {/* DETAILS */}
                  {hasContactDetails && (
                    <section>
                      <OsloSectionHeading title="Details" accentColor={accentColor} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {addressLines.length > 0 && (
                          <div>
                            <div
                              className="uppercase font-bold"
                              style={{ fontSize: '8px', letterSpacing: '0.08em', color: '#1a1a1a', marginBottom: '2px' }}
                            >
                              Address
                            </div>
                            <div style={{ fontSize: '9.2px', lineHeight: 1.45, color: '#333333' }}>
                              {addressLines.map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        {personalDetails.phone && (
                          <div>
                            <div
                              className="uppercase font-bold"
                              style={{ fontSize: '8px', letterSpacing: '0.08em', color: '#1a1a1a', marginBottom: '2px' }}
                            >
                              Phone
                            </div>
                            <a
                              href={`tel:${personalDetails.phone}`}
                              style={{ fontSize: '9.2px', lineHeight: 1.45, color: '#333333', textDecoration: 'none' }}
                            >
                              {personalDetails.phone}
                            </a>
                          </div>
                        )}
                        {personalDetails.email && (
                          <div>
                            <div
                              className="uppercase font-bold"
                              style={{ fontSize: '8px', letterSpacing: '0.08em', color: '#1a1a1a', marginBottom: '2px' }}
                            >
                              Email
                            </div>
                            <a
                              href={`mailto:${personalDetails.email}`}
                              style={{ fontSize: '9.2px', lineHeight: 1.45, color: '#333333', wordBreak: 'break-all', textDecoration: 'none' }}
                            >
                              {personalDetails.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* LINKS */}
                  {page.sidebar.showLinks && webLinks.length > 0 && (
                    <section>
                      <OsloSectionHeading title="Links" accentColor={accentColor} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {webLinks.map((lnk) => (
                          <a
                            key={lnk.id}
                            href={lnk.href}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: '9.5px',
                              color: '#222222',
                              textDecoration: 'underline',
                              textUnderlineOffset: '3px',
                              lineHeight: 1.4
                            }}
                          >
                            {lnk.label}
                          </a>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* SKILLS */}
                  {page.sidebar.skills.length > 0 && (
                    <section>
                      {showSkillsHeading && (
                        <OsloSectionHeading title="Skills" accentColor={accentColor} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        {page.sidebar.skills.map((skill) => (
                          <div
                            key={skill.id}
                            style={{
                              fontSize: '9.4px',
                              lineHeight: 1.4,
                              color: '#222222',
                              fontWeight: 400
                            }}
                          >
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* LANGUAGES */}
                  {page.sidebar.languages.length > 0 && (
                    <section>
                      <OsloSectionHeading title="Languages" accentColor={accentColor} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {page.sidebar.languages.map((lang) => {
                          const dots = getLanguageDotCount(lang.level);
                          return (
                            <div key={lang.id}>
                              <div
                                style={{
                                  fontSize: '9.4px',
                                  fontWeight: 400,
                                  color: '#222222',
                                  marginBottom: '5px'
                                }}
                              >
                                {lang.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {[1, 2, 3, 4, 5].map((idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      width: '5.5px',
                                      height: '5.5px',
                                      borderRadius: '9999px',
                                      backgroundColor: idx <= dots ? accentColor : '#d1d5db',
                                      display: 'inline-block'
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </aside>

                {/* Right Main Column (548px) */}
                <main
                  style={{
                    flex: '0 0 548px',
                    minWidth: 0,
                    width: '548px',
                    maxWidth: '548px',
                    overflow: 'hidden',
                    paddingLeft: '36px',
                    paddingRight: '46px',
                    paddingBottom: '42px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  {/* PROFILE */}
                  {page.showSummary && page.summary && (
                    <section>
                      <OsloSectionHeading title="Profile" accentColor={accentColor} />
                      <FormattedText
                        text={page.summary}
                        bulletColor="#4b5563"
                        bulletStyle="dot"
                        className="text-[9.8px] text-[#333333] leading-[1.6]"
                      />
                    </section>
                  )}

                  {/* EMPLOYMENT HISTORY */}
                  {page.jobs.length > 0 && (
                    <section>
                      {page.jobsHeading && (
                        <OsloSectionHeading title={page.jobsHeading} accentColor={accentColor} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {page.jobs.map((job) => {
                          const dateStr = [job.startDate, job.endDate || (job.startDate ? 'Present' : '')]
                            .filter(Boolean)
                            .join(' — ');
                          const titleEmployer = [job.jobTitle?.trim(), job.employer?.trim()].filter(Boolean).join(', ');

                          return (
                            <div key={job.id}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  gap: '12px'
                                }}
                              >
                                <h3
                                  style={{
                                    flex: 1,
                                    minWidth: 0,
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    lineHeight: 1.35
                                  }}
                                >
                                  {titleEmployer}
                                </h3>
                                {job.city && (
                                  <span
                                    style={{
                                      fontSize: '9.4px',
                                      color: '#4b5563',
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                      lineHeight: 1.4
                                    }}
                                  >
                                    {job.city}
                                  </span>
                                )}
                              </div>
                              {dateStr && (
                                <div
                                  style={{
                                    fontSize: '9.4px',
                                    color: '#4b5563',
                                    marginTop: '2px',
                                    marginBottom: '6px'
                                  }}
                                >
                                  {dateStr}
                                </div>
                              )}
                              {job.description && (
                                <FormattedText
                                  text={job.description}
                                  bulletColor="#4b5563"
                                  bulletStyle="dot"
                                  className="text-[9.8px] text-[#333333] leading-[1.55]"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* EDUCATION */}
                  {page.education && page.education.length > 0 && (
                    <section>
                      {page.educationHeading && (
                        <OsloSectionHeading title={page.educationHeading} accentColor={accentColor} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {page.education.map((edu) => {
                          const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(' — ');
                          const degreeSchool = [edu.degree, edu.school].filter(Boolean).join(', ');

                          return (
                            <div key={edu.id}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  gap: '12px'
                                }}
                              >
                                <h3
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    lineHeight: 1.35
                                  }}
                                >
                                  {degreeSchool}
                                </h3>
                                {edu.city && (
                                  <span
                                    style={{
                                      fontSize: '9.4px',
                                      color: '#4b5563',
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                      lineHeight: 1.4
                                    }}
                                  >
                                    {edu.city}
                                  </span>
                                )}
                              </div>
                              {dateStr && (
                                <div style={{ fontSize: '9.4px', color: '#4b5563', marginTop: '2px' }}>
                                  {dateStr}
                                </div>
                              )}
                              {edu.description && (
                                <FormattedText
                                  text={edu.description}
                                  bulletColor="#4b5563"
                                  className="text-[9.8px] text-[#333333] leading-[1.5] mt-1"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* PROJECTS */}
                  {page.projects && page.projects.length > 0 && (
                    <section>
                      {page.projectsHeading && (
                        <OsloSectionHeading title={page.projectsHeading} accentColor={accentColor} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {page.projects.map((proj) => (
                          <div key={proj.id}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '12px'
                              }}
                            >
                              <h3
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  color: '#1a1a1a',
                                  lineHeight: 1.35
                                }}
                              >
                                {proj.name}
                              </h3>
                              {(proj.city || personalDetails.city) && (
                                <span
                                  style={{
                                    fontSize: '9.4px',
                                    color: '#4b5563',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                  }}
                                >
                                  {proj.city || personalDetails.city}
                                </span>
                              )}
                            </div>
                            {proj.technologies && (
                              <div style={{ fontSize: '9.6px', color: '#333333', marginTop: '2px' }}>
                                {proj.technologies}
                              </div>
                            )}
                            {proj.link && (
                              <div style={{ fontSize: '9.4px', color: '#222222', marginTop: '2px', wordBreak: 'break-all' }}>
                                <span style={{ fontWeight: 700 }}>Link: </span>
                                <a
                                  href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: '#222222', textDecoration: 'none' }}
                                >
                                  {proj.link}
                                </a>
                              </div>
                            )}
                            {proj.description && (
                              <FormattedText
                                text={proj.description}
                                bulletColor="#4b5563"
                                bulletStyle="dot"
                                className="text-[9.8px] text-[#333333] leading-[1.55] mt-1.5"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* CERTIFICATIONS (if present and in main) */}
                  {page.certifications && page.certifications.length > 0 && (
                    <section>
                      <OsloSectionHeading title="Certifications" accentColor={accentColor} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {page.certifications.map((cert) => (
                          <div key={cert.id} style={{ fontSize: '9.8px', color: '#222222', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                            <span style={{ fontWeight: 700 }}>{cert.name}</span>
                            {(cert.issuer || cert.date) && (
                              <span style={{ color: '#4b5563', fontSize: '9.2px' }}>
                                {' '}— {[cert.issuer, cert.date].filter(Boolean).join(' • ')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* CUSTOM SECTIONS */}
                  {page.customSections && page.customSections.length > 0 && page.customSections.map((sec) => (
                    <section key={sec.id}>
                      {sec.title && (
                        <OsloSectionHeading title={sec.title} accentColor={accentColor} />
                      )}
                      {sec.content && (
                        <FormattedText
                          text={sec.content}
                          bulletColor="#4b5563"
                          className="text-[9.8px] text-[#333333] leading-[1.55]"
                        />
                      )}
                      {sec.items && sec.items.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {sec.items.map((item, idx) => (
                            <div key={item.id || idx}>
                              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#1a1a1a' }}>
                                {item.title}
                              </div>
                              {item.subtitle && (
                                <div style={{ fontSize: '9.4px', color: '#4b5563', marginTop: '1px' }}>
                                  {item.subtitle}
                                </div>
                              )}
                              {item.description && (
                                <FormattedText
                                  text={item.description}
                                  bulletColor="#4b5563"
                                  className="text-[9.8px] text-[#333333] leading-[1.55] mt-1"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}
                </main>
              </div>
            </div>

            {debug && (
              <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[9px] px-2 py-0.5 rounded font-mono z-50 pointer-events-none no-print">
                Page {page.pageNumber} | {page.layout} | Util: {page.diagnostics?.utilizationPercent}%
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
