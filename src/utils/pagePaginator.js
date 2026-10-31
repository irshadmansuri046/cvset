/**
 * Page Paginator for CVSet Resumes.
 * Connects high-level template calls with the Content-Agnostic Dynamic Paginator.
 */

import {
  A4_PAGE_WIDTH_PX,
  A4_PAGE_HEIGHT_PX,
  DEFAULT_PAGE_PADDING_PX,
  paginateResume,
  estimateBlockHeight,
  calculateTextLines
} from './dynamicPaginator.js';

export {
  A4_PAGE_WIDTH_PX,
  A4_PAGE_HEIGHT_PX,
  DEFAULT_PAGE_PADDING_PX
};

export function getJobHeight(job, isFullWidth = false) {
  return estimateBlockHeight({
    type: 'entry',
    subtitle: job.employer,
    text: job.description
  }, isFullWidth);
}

export function getProjectHeight(proj, isFullWidth = true) {
  if (proj.name && proj.name.toLowerCase().includes('other project')) {
    const items = (proj.description || '').split(/\||\n/).map((s) => s.trim()).filter(Boolean);
    return estimateBlockHeight({ type: 'chips', items }, isFullWidth);
  }
  return estimateBlockHeight({
    type: 'card',
    subtitle: proj.technologies,
    text: proj.description
  }, isFullWidth);
}

export function getSummaryHeight(summary) {
  return estimateBlockHeight({ type: 'text', text: summary }, false);
}

/**
 * Paginates Dublin resume data using the Content-Agnostic Dynamic Paginator.
 * Returns discrete pages with backward-compatible convenience fields.
 */
export function paginateDublinResume(resume = {}, options = {}) {
  const result = paginateResume(resume, {
    template: 'dublin',
    pagePadding: options.pagePadding || DEFAULT_PAGE_PADDING_PX
  });

  // Enrich each page with backward-compatible section arrays for existing tests & views
  return result.pages.map((page) => {
    const jobs = page.main
      .filter((b) => b.type === 'entry' && b.data && (b.data.employer || b.data.jobTitle))
      .map((b) => b.data);

    const projects = page.main
      .filter((b) => (b.type === 'card' || b.type === 'chips') && b.data)
      .map((b) => b.data);

    const certBlock = page.main.find((b) => b.type === 'grid');
    const certifications = certBlock ? certBlock.items : [];

    const summaryBlock = page.main.find((b) => b.id === 'summary');

    // Extract custom sections for this page
    const customSectionsOnPage = [];
    let currentCustom = null;
    page.main.forEach((b) => {
      if (b.type === 'heading' && b.id && b.id.startsWith('h-custom-')) {
        currentCustom = {
          id: b.id,
          title: b.title,
          items: [],
          content: ''
        };
        customSectionsOnPage.push(currentCustom);
      } else if (b.type === 'entry' && b.id && b.id.startsWith('custom-item-')) {
        if (!currentCustom) {
          currentCustom = { id: `custom-cont-${b.id}`, title: '', items: [], content: '' };
          customSectionsOnPage.push(currentCustom);
        }
        currentCustom.items.push(b.data || { title: b.title, subtitle: b.subtitle, description: b.text });
      } else if (b.type === 'text' && b.id && b.id.startsWith('custom-text-')) {
        if (!currentCustom) {
          currentCustom = { id: `custom-cont-${b.id}`, title: '', items: [], content: '' };
          customSectionsOnPage.push(currentCustom);
        }
        currentCustom.content = b.text;
      }
    });

    const sidebarSkills = (page.sidebar || [])
      .filter((b) => b.type === 'skill-item' && b.skill)
      .map((b) => b.skill);

    const sidebarLangs = (page.sidebar || [])
      .filter((b) => b.type === 'lang-item' && b.language)
      .map((b) => b.language);

    const sidebarEdu = (page.sidebar || [])
      .filter((b) => b.type === 'edu-item' && b.education)
      .map((b) => b.education);

    const sidebarCerts = (page.sidebar || [])
      .filter((b) => b.type === 'cert-item' && b.cert)
      .map((b) => b.cert);

    const hasPhoto = (page.sidebar || []).some((b) => b.type === 'photo');
    const hasDetails = (page.sidebar || []).some((b) => b.type === 'details');
    const hasLinks = (page.sidebar || []).some((b) => b.type === 'links');

    return {
      ...page,
      showHeader: page.main.some((b) => b.type === 'header'),
      showSummary: Boolean(summaryBlock),
      summary: summaryBlock ? summaryBlock.text : '',
      jobsHeading: jobs.length > 0 ? (page.pageNumber === 1 ? 'Employment History' : 'Employment History (Continued)') : null,
      jobs,
      projectsHeading: projects.length > 0 ? (page.main.some((b) => b.id === 'h-proj') ? 'Key Projects' : 'Key Projects (Continued)') : null,
      projects,
      certificationsHeading: certifications.length > 0 ? 'Certifications' : null,
      certifications,
      customSections: customSectionsOnPage,
      sidebar: {
        showPhoto: hasPhoto,
        showDetails: hasDetails,
        showLinks: hasLinks,
        skills: sidebarSkills,
        languages: sidebarLangs,
        education: sidebarEdu
      }
    };
  });
}

/**
 * Paginates Graphite resume data using the Content-Agnostic Dynamic Paginator.
 * Returns discrete pages styled for the executive Graphite layout (Charcoal band + warm-grey sidebar).
 */
export function paginateGraphiteResume(resume = {}, options = {}) {
  const result = paginateResume(resume, {
    template: 'graphite',
    pagePadding: options.pagePadding || DEFAULT_PAGE_PADDING_PX
  });

  return result.pages.map((page) => {
    const jobs = page.main
      .filter((b) => b.type === 'entry' && b.data && (b.data.employer || b.data.jobTitle))
      .map((b) => b.data);

    const projects = page.main
      .filter((b) => (b.type === 'card' || b.type === 'chips') && b.data)
      .map((b) => b.data);

    const certBlock = page.main.find((b) => b.type === 'grid');
    const certifications = certBlock ? certBlock.items : [];

    // In graphite, summary can be in sidebar on page 1, or in main if full-width continuation
    const summaryBlockInSidebar = (page.sidebar || []).find((b) => b.id === 'summary-text');
    const summaryBlockInMain = page.main.find((b) => b.id === 'summary');
    const summary = summaryBlockInSidebar ? summaryBlockInSidebar.text : (summaryBlockInMain ? summaryBlockInMain.text : '');

    const sidebarSkills = (page.sidebar || [])
      .filter((b) => b.type === 'skill-item' && b.skill)
      .map((b) => b.skill);

    const sidebarLangs = (page.sidebar || [])
      .filter((b) => b.type === 'lang-item' && b.language)
      .map((b) => b.language);

    const sidebarEdu = (page.sidebar || [])
      .filter((b) => b.type === 'edu-item' && b.education)
      .map((b) => b.education);

    const sidebarCerts = (page.sidebar || [])
      .filter((b) => b.type === 'cert-item' && b.cert)
      .map((b) => b.cert);

    const hasPhoto = (page.sidebar || []).some((b) => b.type === 'photo');

    // Extract custom sections for this page
    const customSectionsOnPage = [];
    let currentCustom = null;
    page.main.forEach((b) => {
      if (b.type === 'heading' && b.id && b.id.startsWith('h-custom-')) {
        currentCustom = {
          id: b.id,
          title: b.title,
          items: [],
          content: ''
        };
        customSectionsOnPage.push(currentCustom);
      } else if (b.type === 'entry' && b.id && b.id.startsWith('custom-item-')) {
        if (!currentCustom) {
          currentCustom = { id: `custom-cont-${b.id}`, title: '', items: [], content: '' };
          customSectionsOnPage.push(currentCustom);
        }
        currentCustom.items.push(b.data || { title: b.title, subtitle: b.subtitle, description: b.text });
      } else if (b.type === 'text' && b.id && b.id.startsWith('custom-text-')) {
        if (!currentCustom) {
          currentCustom = { id: `custom-cont-${b.id}`, title: '', items: [], content: '' };
          customSectionsOnPage.push(currentCustom);
        }
        currentCustom.content = b.text;
      }
    });

    return {
      ...page,
      showHeader: page.main.some((b) => b.type === 'header'),
      showSummary: Boolean(summary),
      summary,
      jobsHeading: jobs.length > 0 ? (page.pageNumber === 1 ? 'Professional Experience' : 'Professional Experience (Continued)') : null,
      jobs,
      projectsHeading: projects.length > 0 ? (page.main.some((b) => b.id === 'h-proj') ? 'Core Projects' : 'Core Projects (Continued)') : null,
      projects,
      certificationsHeading: certifications.length > 0 ? 'Certifications' : null,
      certifications,
      customSections: customSectionsOnPage,
      sidebar: {
        showPhoto: hasPhoto,
        showSummary: Boolean(summaryBlockInSidebar),
        summary: summaryBlockInSidebar ? summaryBlockInSidebar.text : '',
        skills: sidebarSkills,
        languages: sidebarLangs,
        education: sidebarEdu,
        certifications: sidebarCerts
      }
    };
  });
}
