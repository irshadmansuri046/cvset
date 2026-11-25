/**
 * Content-Agnostic Dynamic PDF Pagination Engine for CVSet.
 * 
 * Works with arbitrary resume content, variable text lengths, custom sections,
 * and multiple template layouts (single-column and two-column with sidebar).
 * 
 * Core Principles:
 * - Content-independent: Driven purely by block geometry and typographic metrics.
 * - Dynamic measurement: Measures actual height requirements per column width.
 * - Optimal bin-packing: Maximizes page utilization without artificial stretching.
 * - Heading orphan prevention: Keeps section headings with their following content.
 * - Multi-column expansion: Expands to full width when sidebar content is exhausted.
 * - Uniform page-level padding: Standard A4 (210mm x 297mm) with uniform margins.
 * - Diagnostic telemetry: Records per-page utilization, decisions, and warnings.
 */

export const A4_PAGE_WIDTH_PX = 794;   // 210mm at 96 DPI
export const A4_PAGE_HEIGHT_PX = 1123; // 297mm at 96 DPI
export const DEFAULT_PAGE_PADDING_PX = 45; // ~12mm

/**
 * Calculates visual text lines based on column character width.
 */
export function calculateTextLines(text, charsPerLine = 75) {
  if (!text) return 0;
  const paragraphs = String(text).split('\n').filter(Boolean);
  let totalLines = 0;
  paragraphs.forEach((p) => {
    const clean = p.replace(/^[•\-\*\s]+/, '').trim();
    if (clean.length > 0) {
      totalLines += Math.max(1, Math.ceil(clean.length / charsPerLine));
    }
  });
  return totalLines;
}

/**
 * Estimates rendered height of a generic content block based on layout and typography.
 */
export function estimateBlockHeight(block, isFullWidth = false, customCharsPerLine = null) {
  if (block.height && typeof block.height === 'number') {
    return block.height;
  }

  // Column character limits
  const charsPerLine = customCharsPerLine || (
    isFullWidth 
      ? 110 
      : (block.column === 'sidebar' ? 36 : 78)
  );

  switch (block.type) {
    case 'header':
      return block.hasPhoto ? 120 : 85;

    case 'heading':
      return 36; // Section title + hairline margin

    case 'text': {
      const lines = calculateTextLines(block.text, charsPerLine);
      return Math.max(24, lines * 15 + 8);
    }

    case 'entry': {
      let h = 34; // Title, employer/school, dates
      if (block.subtitle) h += 16;
      if (block.text) {
        const lines = calculateTextLines(block.text, charsPerLine);
        h += lines * 15 + 4;
      }
      return h + 14; // margin-bottom
    }

    case 'card': {
      let h = 28; // Card header
      if (block.subtitle) h += 14;
      if (block.text) {
        const colChars = isFullWidth ? 58 : charsPerLine;
        const lines = calculateTextLines(block.text, colChars);
        h += lines * 15 + 4;
      }
      const fullH = Math.max(40, h + 12);
      // In 2-column project grid on full-width continuation pages, two cards share each row!
      return isFullWidth ? Math.round(fullH * 0.55) : fullH;
    }

    case 'chips': {
      const items = block.items || [];
      const cols = isFullWidth ? 6 : 4;
      const rows = Math.max(1, Math.ceil(items.length / cols));
      return rows * 24 + 14;
    }

    case 'list': {
      const items = block.items || [];
      return Math.max(20, items.length * 20 + 8);
    }

    case 'grid': {
      const items = block.items || [];
      if (block.compactList) {
        return Math.max(24, items.length * 26 + 8);
      }
      const cols = isFullWidth ? 3 : 2;
      const rows = Math.max(1, Math.ceil(items.length / cols));
      return rows * 68 + 10;
    }

    case 'skill-bar':
      return block.height || 34;

    case 'edu-item':
      return block.height || 50;

    case 'lang-item':
      return block.height || 20;

    case 'cert-item':
      return block.height || 38;

    case 'skill-item':
      return block.height || 20;

    default:
      return 40;
  }
}

/**
 * Core Content-Agnostic Bin-Packing Pagination Engine.
 * 
 * Takes arbitrary sidebar and main blocks, packs them into discrete A4 pages,
 * prevents orphaned headings, and records detailed layout diagnostics.
 */
export function paginateGenericBlocks({
  sidebarBlocks = [],
  mainBlocks = [],
  pagePadding = DEFAULT_PAGE_PADDING_PX,
  options = {}
}) {
  const usableHeight = A4_PAGE_HEIGHT_PX - (pagePadding * 2);
  const pages = [];

  let remSidebar = [...sidebarBlocks];
  let remMain = [...mainBlocks];
  let pageNum = 1;

  // Single-page shortcut for ultra-short resumes
  if (sidebarBlocks.length <= 4 && mainBlocks.length <= 5) {
    const totalEst = mainBlocks.reduce((acc, b) => acc + estimateBlockHeight(b, sidebarBlocks.length === 0), 0);
    if (totalEst <= usableHeight) {
      const isFullWidth = sidebarBlocks.length === 0;
      return [{
        pageNumber: 1,
        layout: isFullWidth ? 'full-width' : 'two-column',
        pagePadding,
        sidebar: sidebarBlocks,
        main: mainBlocks,
        diagnostics: {
          pageNumber: 1,
          totalPageHeight: A4_PAGE_HEIGHT_PX,
          printableHeight: usableHeight,
          occupiedHeight: totalEst,
          remainingHeight: usableHeight - totalEst,
          utilizationPercentage: Math.round((totalEst / usableHeight) * 100),
          blocksCount: sidebarBlocks.length + mainBlocks.length,
          layoutMode: isFullWidth ? 'full-width' : 'two-column',
          decisions: [{ action: 'single_page_fit', count: sidebarBlocks.length + mainBlocks.length }],
          warnings: []
        }
      }];
    }
  }

  while (remSidebar.length > 0 || remMain.length > 0) {
    const hasSidebar = remSidebar.length > 0;
    const layout = (hasSidebar || options.template === 'oslo') ? 'two-column' : 'full-width';
    const isFullWidth = !hasSidebar && options.template !== 'oslo';

    const pageSidebar = [];
    const pageMain = [];
    let sideSpace = usableHeight;
    let mainSpace = usableHeight;
    const decisions = [];
    const warnings = [];

    // Special handling for templates with full-width banner/boxed header on Page 1 (e.g. Sydney, Oslo)
    if (pageNum === 1 && (options.template === 'sydney' || options.template === 'oslo')) {
      const headerIdx = remMain.findIndex((b) => b.type === 'header');
      if (headerIdx !== -1) {
        const headerBlock = remMain.splice(headerIdx, 1)[0];
        const bannerH = options.template === 'oslo' ? 140 : 136;
        pageMain.push({ ...headerBlock, height: bannerH });
        sideSpace -= bannerH;
        mainSpace -= bannerH;
        decisions.push({ blockId: headerBlock.id, action: 'placed_banner_header', height: bannerH });
      }
    }

    // --- 1. PACK SIDEBAR (if multi-column) ---
    if (hasSidebar) {
      while (remSidebar.length > 0) {
        const blk = remSidebar[0];
        const h = estimateBlockHeight(blk, false);

        // Orphan heading protection for sidebar
        if (blk.keepWithNext && remSidebar.length > 1) {
          const nextH = estimateBlockHeight(remSidebar[1], false);
          const reqSideTogether = h + Math.min(nextH, 65);
          if (sideSpace - reqSideTogether < 0 && pageSidebar.length > 0) {
            decisions.push({
              blockId: blk.id,
              action: 'moved_to_next_page',
              reason: 'sidebar_orphan_heading_protection'
            });
            break;
          }
        }

        if (sideSpace - h >= 0 || pageSidebar.length === 0) {
          pageSidebar.push({ ...blk, height: h });
          sideSpace -= h;
          decisions.push({ blockId: blk.id, action: 'placed_sidebar', height: h });
          remSidebar.shift();
        } else {
          decisions.push({
            blockId: blk.id,
            action: 'moved_to_next_page',
            reason: 'sidebar_overflow',
            required: h,
            available: sideSpace
          });
          break;
        }
      }
    }

    // --- 2. PACK MAIN COLUMN ---
    const mainCharsOverride = options.template === 'oslo' ? 84 : null;
    while (remMain.length > 0) {
      const blk = remMain[0];
      const h = estimateBlockHeight(blk, isFullWidth, mainCharsOverride);

      // Orphan heading protection for main column:
      // If a heading cannot be accompanied by at least 80px of its following content,
      // move heading to the next page!
      if (blk.keepWithNext && remMain.length > 1) {
        const nextH = estimateBlockHeight(remMain[1], isFullWidth, mainCharsOverride);
        const requiredTogether = h + Math.min(nextH, 80);
        if (mainSpace - requiredTogether < 0 && pageMain.length > 0) {
          decisions.push({
            blockId: blk.id,
            action: 'moved_to_next_page',
            reason: 'main_orphan_heading_protection',
            required: requiredTogether,
            available: mainSpace
          });
          break;
        }
      }

      if (mainSpace - h >= 0) {
        pageMain.push({ ...blk, height: h });
        mainSpace -= h;
        decisions.push({ blockId: blk.id, action: 'placed_main', height: h });
        remMain.shift();
      } else {
        // Strict Fragmentation Rule:
        // Keep a content card/entry together whenever its complete rendered height fits on a fresh page (h <= usableHeight).
        // Only perform controlled splitting for truly oversized blocks (h > usableHeight) that exceed a full page.
        const isOversized = h > usableHeight;

        if (isOversized && blk.canSplit && blk.bullets && blk.bullets.length >= 3 && mainSpace >= 140) {
          const charsPerLine = isFullWidth ? 110 : 78;
          let currentH = 34; // header
          const part1Bullets = [];
          const part2Bullets = [...blk.bullets];

          while (part2Bullets.length > 0) {
            const b = part2Bullets[0];
            const bLines = Math.max(1, Math.ceil(b.length / charsPerLine));
            const bH = bLines * 15 + 4;
            if (mainSpace - (currentH + bH) >= 15 && part1Bullets.length < blk.bullets.length - 1) {
              part1Bullets.push(part2Bullets.shift());
              currentH += bH;
            } else {
              break;
            }
          }

          if (part1Bullets.length >= 2) {
            pageMain.push({
              ...blk,
              id: blk.id + '-part1',
              text: part1Bullets.join('\n'),
              bullets: part1Bullets,
              height: currentH
            });
            mainSpace -= currentH;
            decisions.push({
              blockId: blk.id,
              action: 'split_oversized_entry',
              part1Count: part1Bullets.length,
              part2Count: part2Bullets.length
            });

            // Continuation block on next page retains parent context with "(Continued)"
            remMain[0] = {
              ...blk,
              id: blk.id + '-part2',
              isContinuation: true,
              title: blk.title ? `${blk.title} (Continued)` : blk.title,
              subtitle: blk.subtitle,
              text: part2Bullets.join('\n'),
              bullets: part2Bullets
            };
            break;
          }
        }

        // If the last placed item on this page was an orphaned heading whose content couldn't fit,
        // pull the heading off this page and prepend it back to remMain so they travel together!
        if (pageMain.length > 0 && pageMain[pageMain.length - 1].keepWithNext) {
          const orphanedHeading = pageMain.pop();
          mainSpace += orphanedHeading.height;
          remMain.unshift(orphanedHeading);
          decisions.push({
            blockId: orphanedHeading.id,
            action: 'pulled_back_orphan_heading'
          });
        }

        decisions.push({
          blockId: blk.id,
          action: 'moved_to_next_page',
          reason: 'insufficient_space_for_full_block',
          required: h,
          available: mainSpace
        });
        break;
      }
    }

    const occupiedMain = usableHeight - mainSpace;
    const utilPct = Math.round((occupiedMain / usableHeight) * 100);

    // Diagnostics telemetry
    if (mainSpace > 350 && remMain.length > 0) {
      warnings.push(`High remaining space (${mainSpace}px): Next block required ${estimateBlockHeight(remMain[0], isFullWidth)}px`);
    }

    pages.push({
      pageNumber: pageNum,
      layout,
      pagePadding,
      sidebar: pageSidebar,
      main: pageMain,
      diagnostics: {
        pageNumber: pageNum,
        totalPageHeight: A4_PAGE_HEIGHT_PX,
        printableHeight: usableHeight,
        occupiedHeight: occupiedMain,
        remainingHeight: mainSpace,
        utilizationPercentage: utilPct,
        blocksCount: pageMain.length + pageSidebar.length,
        layoutMode: layout,
        placedBlocks: pageMain.map((b) => ({ id: b.id, type: b.type, title: b.title || '', height: b.height })),
        decisions,
        warnings
      }
    });

    pageNum++;
    if (pageNum > 12) break; // Infinite loop safety guard
  }

  return pages;
}

/**
 * Universal Resume Adapter: Converts ANY resume data into generic ContentBlock streams.
 * Supports standard sections and arbitrary custom sections.
 */
export function convertResumeToBlocks(resume = {}, templateType = 'dublin') {
  const {
    personalDetails = {},
    summary = '',
    employmentHistory = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    customSections = []
  } = resume;

  const sidebarBlocks = [];
  const mainBlocks = [];

  const isTwoColumn = ['dublin', 'graphite', 'sydney', 'oslo'].includes(templateType);

  // --- HEADER BLOCK ---
  const headerBlock = {
    id: 'header',
    type: 'header',
    column: 'main',
    hasPhoto: Boolean(personalDetails.showPhoto && personalDetails.photo),
    personalDetails,
    keepWithNext: true
  };

  // --- SIDEBAR BLOCKS (if two-column template) ---
  if (isTwoColumn) {
    if (templateType === 'dublin') {
      if (personalDetails.showPhoto && personalDetails.photo) {
        sidebarBlocks.push({
          id: 'photo',
          type: 'photo',
          column: 'sidebar',
          photo: personalDetails.photo,
          height: 110
        });
      }

      sidebarBlocks.push({
        id: 'details',
        type: 'details',
        column: 'sidebar',
        personalDetails,
        height: 120
      });

      if (personalDetails.website || personalDetails.linkedin || personalDetails.github) {
        sidebarBlocks.push({
          id: 'links',
          type: 'links',
          column: 'sidebar',
          personalDetails,
          height: 75
        });
      }

      if (skills.length > 0) {
        sidebarBlocks.push({
          id: 'h-skills',
          type: 'heading',
          title: 'Skills',
          column: 'sidebar',
          keepWithNext: true
        });
        skills.forEach((s) => {
          sidebarBlocks.push({
            id: `skill-${s.id}`,
            type: 'skill-item',
            column: 'sidebar',
            skill: s,
            height: s.name && s.name.includes(',') ? 55 : 22
          });
        });
      }

      if (languages.length > 0) {
        sidebarBlocks.push({
          id: 'h-lang',
          type: 'heading',
          title: 'Languages',
          column: 'sidebar',
          keepWithNext: true
        });
        languages.forEach((l) => {
          sidebarBlocks.push({
            id: `lang-${l.id}`,
            type: 'lang-item',
            column: 'sidebar',
            language: l,
            height: 20
          });
        });
      }

      if (education.length > 0) {
        sidebarBlocks.push({
          id: 'h-edu',
          type: 'heading',
          title: 'Education',
          column: 'sidebar',
          keepWithNext: true
        });
        education.forEach((edu) => {
          sidebarBlocks.push({
            id: `edu-${edu.id}`,
            type: 'edu-item',
            column: 'sidebar',
            education: edu,
            height: 60
          });
        });
      }
    } else if (templateType === 'oslo') {
      // Neutral light-grey sidebar: Details, Links, Skills, Languages
      sidebarBlocks.push({
        id: 'details',
        type: 'details',
        column: 'sidebar',
        personalDetails,
        height: 155
      });

      if (personalDetails.website || personalDetails.linkedin || personalDetails.github) {
        sidebarBlocks.push({
          id: 'links',
          type: 'links',
          column: 'sidebar',
          personalDetails,
          height: 85
        });
      }

      if (skills.length > 0) {
        sidebarBlocks.push({
          id: 'h-skills',
          type: 'heading',
          title: 'Skills',
          column: 'sidebar',
          keepWithNext: true
        });
        skills.forEach((s) => {
          const textLen = (s.name || '').length;
          const linesCount = Math.max(1, Math.ceil(textLen / 24));
          sidebarBlocks.push({
            id: `skill-${s.id}`,
            type: 'skill-item',
            column: 'sidebar',
            skill: s,
            height: linesCount * 15 + 7
          });
        });
      }

      if (languages.length > 0) {
        sidebarBlocks.push({
          id: 'h-lang',
          type: 'heading',
          title: 'Languages',
          column: 'sidebar',
          keepWithNext: true
        });
        languages.forEach((l) => {
          sidebarBlocks.push({
            id: `lang-${l.id}`,
            type: 'lang-item',
            column: 'sidebar',
            language: l,
            height: 36
          });
        });
      }
    } else if (templateType === 'graphite') {
      // Warm grey sidebar
      if (personalDetails.showPhoto && personalDetails.photo) {
        sidebarBlocks.push({
          id: 'photo',
          type: 'photo',
          column: 'sidebar',
          photo: personalDetails.photo,
          height: 110
        });
      }

      if (summary) {
        sidebarBlocks.push({
          id: 'h-summary',
          type: 'heading',
          title: 'Professional Summary',
          column: 'sidebar',
          keepWithNext: true
        });
        sidebarBlocks.push({
          id: 'summary-text',
          type: 'text',
          column: 'sidebar',
          text: summary
        });
      }

      if (skills.length > 0) {
        sidebarBlocks.push({
          id: 'h-skills',
          type: 'heading',
          title: 'Core Competencies',
          column: 'sidebar',
          keepWithNext: true
        });
        skills.forEach((s) => {
          sidebarBlocks.push({
            id: `skill-${s.id}`,
            type: 'skill-item',
            column: 'sidebar',
            skill: s,
            height: 22
          });
        });
      }

      if (languages.length > 0) {
        sidebarBlocks.push({
          id: 'h-lang',
          type: 'heading',
          title: 'Languages',
          column: 'sidebar',
          keepWithNext: true
        });
        languages.forEach((l) => {
          sidebarBlocks.push({
            id: `lang-${l.id}`,
            type: 'lang-item',
            column: 'sidebar',
            language: l,
            height: 20
          });
        });
      }

      if (education.length > 0) {
        sidebarBlocks.push({
          id: 'h-edu',
          type: 'heading',
          title: 'Education',
          column: 'sidebar',
          keepWithNext: true
        });
        education.forEach((edu) => {
          sidebarBlocks.push({
            id: `edu-${edu.id}`,
            type: 'edu-item',
            column: 'sidebar',
            education: edu,
            height: 55
          });
        });
      }

      if (certifications.length > 0) {
        sidebarBlocks.push({
          id: 'h-cert',
          type: 'heading',
          title: 'Certifications',
          column: 'sidebar',
          keepWithNext: true
        });
        certifications.forEach((c) => {
          sidebarBlocks.push({
            id: `cert-${c.id}`,
            type: 'cert-item',
            column: 'sidebar',
            cert: c,
            height: 38
          });
        });
      }
    } else if (templateType === 'sydney') {
      if (skills.length > 0) {
        sidebarBlocks.push({
          id: 'h-skills',
          type: 'heading',
          title: 'Key Skills',
          column: 'sidebar',
          keepWithNext: true
        });
        skills.forEach((s) => {
          sidebarBlocks.push({
            id: `skill-${s.id}`,
            type: 'skill-bar',
            column: 'sidebar',
            skill: s,
            height: 36
          });
        });
      }

      if (education.length > 0) {
        sidebarBlocks.push({
          id: 'h-edu',
          type: 'heading',
          title: 'Education',
          column: 'sidebar',
          keepWithNext: true
        });
        education.forEach((edu) => {
          sidebarBlocks.push({
            id: `edu-${edu.id}`,
            type: 'edu-item',
            column: 'sidebar',
            education: edu,
            height: 58
          });
        });
      }

      if (languages.length > 0) {
        sidebarBlocks.push({
          id: 'h-lang',
          type: 'heading',
          title: 'Languages',
          column: 'sidebar',
          keepWithNext: true
        });
        languages.forEach((l) => {
          sidebarBlocks.push({
            id: `lang-${l.id}`,
            type: 'lang-item',
            column: 'sidebar',
            language: l,
            height: 24
          });
        });
      }

      if (certifications.length > 0) {
        sidebarBlocks.push({
          id: 'h-cert',
          type: 'heading',
          title: 'Certifications',
          column: 'sidebar',
          keepWithNext: true
        });
        certifications.forEach((c) => {
          sidebarBlocks.push({
            id: `cert-${c.id}`,
            type: 'cert-item',
            column: 'sidebar',
            cert: c,
            height: 42
          });
        });
      }
    }
  }

  // --- MAIN COLUMN BLOCKS ---
  mainBlocks.push(headerBlock);

  // Profile Summary (if not placed in sidebar)
  if (summary && templateType !== 'graphite') {
    const summaryTitle = templateType === 'sydney' 
      ? 'About Me' 
      : (templateType === 'stockholm' ? 'Summary' : 'Profile');
    mainBlocks.push({
      id: 'h-summary',
      type: 'heading',
      title: summaryTitle,
      column: 'main',
      keepWithNext: true
    });
    mainBlocks.push({
      id: 'summary',
      type: 'text',
      column: 'main',
      text: summary
    });
  }

  // Employment History
  if (employmentHistory.length > 0) {
    const expTitle = templateType === 'sydney' ? 'Professional Experience' : 'Employment History';
    mainBlocks.push({
      id: 'h-exp',
      type: 'heading',
      title: expTitle,
      column: 'main',
      keepWithNext: true
    });
    employmentHistory.forEach((job) => {
      mainBlocks.push({
        id: `job-${job.id}`,
        type: 'entry',
        column: 'main',
        title: job.jobTitle,
        subtitle: `${job.employer} ${job.city ? `• ${job.city}` : ''}`,
        dateStr: `${job.startDate} — ${job.endDate || 'Present'}`,
        text: job.description,
        bullets: (job.description || '').split('\n').filter(Boolean),
        canSplit: true,
        data: job
      });
    });
  }

  // Education (if single-column or Oslo template where Education lives in main column)
  if ((!isTwoColumn || templateType === 'oslo') && education.length > 0) {
    mainBlocks.push({
      id: 'h-edu',
      type: 'heading',
      title: 'Education',
      column: 'main',
      keepWithNext: true
    });
    education.forEach((edu) => {
      mainBlocks.push({
        id: `edu-${edu.id}`,
        type: 'entry',
        column: 'main',
        title: edu.degree,
        subtitle: edu.school,
        dateStr: `${edu.startDate} — ${edu.endDate || 'Present'}`,
        text: edu.description,
        data: edu
      });
    });
  }

  // Skills (if single-column)
  if (!isTwoColumn && skills.length > 0) {
    mainBlocks.push({
      id: 'h-skills',
      type: 'heading',
      title: 'Skills & Proficiencies',
      column: 'main',
      keepWithNext: true
    });
    mainBlocks.push({
      id: 'skills-group',
      type: 'chips',
      column: 'main',
      items: skills.map((s) => s.name)
    });
  }

  // Projects
  if (projects.length > 0) {
    const projTitle = templateType === 'sydney' ? 'Featured Projects' : 'Key Projects';
    mainBlocks.push({
      id: 'h-proj',
      type: 'heading',
      title: projTitle,
      column: 'main',
      keepWithNext: true
    });
    projects.forEach((proj) => {
      const isOther = proj.name && proj.name.toLowerCase().includes('other project');
      if (isOther) {
        mainBlocks.push({
          id: `proj-${proj.id}`,
          type: 'chips',
          column: 'main',
          title: proj.name,
          items: (proj.description || '').split(/\||\n/).map((s) => s.trim()).filter(Boolean),
          data: proj
        });
      } else {
        mainBlocks.push({
          id: `proj-${proj.id}`,
          type: 'card',
          column: 'main',
          title: proj.name,
          subtitle: proj.technologies,
          link: proj.link,
          text: proj.description,
          bullets: (proj.description || '').split('\n').filter(Boolean),
          canSplit: false,
          data: proj
        });
      }
    });
  }

  // Certifications (if not in sidebar)
  if (certifications.length > 0 && templateType !== 'graphite' && templateType !== 'sydney') {
    mainBlocks.push({
      id: 'h-cert',
      type: 'heading',
      title: 'Certifications',
      column: 'main',
      keepWithNext: true
    });
    mainBlocks.push({
      id: 'cert-grid',
      type: 'grid',
      column: 'main',
      compactList: templateType === 'oslo',
      items: certifications
    });
  }

  // Languages (if single-column)
  if (!isTwoColumn && languages.length > 0) {
    mainBlocks.push({
      id: 'h-lang',
      type: 'heading',
      title: 'Languages',
      column: 'main',
      keepWithNext: true
    });
    mainBlocks.push({
      id: 'lang-list',
      type: 'list',
      column: 'main',
      items: languages
    });
  }

  // Arbitrary Custom Sections
  if (customSections && Array.isArray(customSections)) {
    customSections.forEach((sec, idx) => {
      if (sec.title) {
        mainBlocks.push({
          id: `h-custom-${sec.id || idx}`,
          type: 'heading',
          title: sec.title,
          column: 'main',
          keepWithNext: true
        });
      }
      if (sec.items && Array.isArray(sec.items)) {
        sec.items.forEach((item, itemIdx) => {
          mainBlocks.push({
            id: `custom-item-${item.id || itemIdx}`,
            type: 'entry',
            column: 'main',
            title: item.title,
            subtitle: item.subtitle,
            text: item.description,
            data: item
          });
        });
      } else if (sec.content) {
        mainBlocks.push({
          id: `custom-text-${sec.id || idx}`,
          type: 'text',
          column: 'main',
          text: sec.content
        });
      }
    });
  }

  return { sidebarBlocks, mainBlocks };
}

/**
 * Universal Template Paginator: Combines generic block conversion and bin-packing.
 */
export function paginateResume(resume = {}, options = {}) {
  const templateType = options.template || resume.template || 'dublin';
  const pagePadding = options.pagePadding || DEFAULT_PAGE_PADDING_PX;

  const { sidebarBlocks, mainBlocks } = convertResumeToBlocks(resume, templateType);

  const pages = paginateGenericBlocks({
    sidebarBlocks,
    mainBlocks,
    pagePadding,
    options
  });

  return {
    pages,
    totalPages: pages.length,
    diagnostics: pages.map((p) => p.diagnostics)
  };
}
