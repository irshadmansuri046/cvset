/**
 * Utility to calculate and adjust page break padding for multi-page resumes.
 * Ensures no atomic items (bullet points, headings, skills, cards) are cut across A4 boundaries
 * and guarantees uniform top and bottom page break margins in live preview and exported PDF.
 */

export const A4_PAGE_HEIGHT_PX = 1123; // Standard 96 DPI A4 pixel height (297mm)
export const DEFAULT_PAGE_BREAK_PADDING = 28; // Default balanced padding in pixels

/**
 * Adjusts candidate elements inside the resume container so they do not intersect
 * the danger zone around page boundaries (boundary - padding .. boundary + padding).
 *
 * @param {HTMLElement} container - The resume preview container (#resume-preview-document)
 * @param {number} padding - Padding in pixels (e.g. 20, 28, 36, 44)
 * @param {number} pageHeight - A4 page height (default: 1123)
 */
export function adjustPageBreakPadding(container, padding = DEFAULT_PAGE_BREAK_PADDING, pageHeight = A4_PAGE_HEIGHT_PX) {
  if (!container || typeof window === 'undefined') return;

  // Discrete .resume-page containers are already dynamically paginated.
  // Never inject artificial margin-top values into discrete pages.
  if (container.querySelectorAll('.resume-page').length > 0) return;

  // 1. Reset any previously applied page break margins
  const previouslyPadded = container.querySelectorAll('[data-page-break-padded="true"]');
  previouslyPadded.forEach((el) => {
    el.style.marginTop = '';
    el.removeAttribute('data-page-break-padded');
  });

  const containerRect = container.getBoundingClientRect();
  const rawHeight = Math.max(
    container.scrollHeight || 0,
    container.offsetHeight || 0,
    container.clientHeight || 0,
    pageHeight
  );

  const totalPages = Math.max(1, Math.ceil((rawHeight - 15) / pageHeight));
  if (totalPages <= 1) return;

  // 2. Collect atomic candidate elements (leaf blocks only; never large containers)
  const candidateSelectors = [
    'li',
    '.break-inside-avoid',
    'aside section > div > div',
    '.space-y-2\\.5 > div',
    '.space-y-1\\.5 > div',
    '.space-y-1 > div',
    'section > h2',
    'section > h3'
  ];

  const candidateElements = Array.from(
    container.querySelectorAll(candidateSelectors.join(', '))
  ).filter((el) => {
    // Only target elements that are visible and reasonably sized (< 320px)
    const h = el.offsetHeight || 0;
    return h > 0 && h < 320 && !el.classList.contains('no-print');
  });

  // Sort elements in DOM vertical reading order
  candidateElements.sort((a, b) => {
    const topA = a.getBoundingClientRect().top;
    const topB = b.getBoundingClientRect().top;
    return topA - topB;
  });

  const handledElements = new Set();

  // 3. Evaluate each page boundary
  for (let page = 1; page < totalPages + 3; page++) {
    const boundary = page * pageHeight;
    const dangerZoneTop = boundary - padding;
    const nextSafeTop = boundary + padding;

    // Evaluate candidates with live rect measurements
    for (let i = 0; i < candidateElements.length; i++) {
      const el = candidateElements[i];

      if (handledElements.has(el)) continue;

      // If an ancestor was already shifted, skip this child to avoid double-padding gaps
      if (el.parentElement && el.parentElement.closest('[data-page-break-padded="true"]')) {
        continue;
      }

      const currentContainerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elTop = elRect.top - currentContainerRect.top;
      const elBottom = elTop + el.offsetHeight;

      // Skip elements completely past this page boundary
      if (elTop >= boundary) continue;

      // Skip elements that finish cleanly above the danger zone
      if (elBottom <= dangerZoneTop) continue;

      // Element encroaches into bottom padding zone or crosses the boundary.
      // If element is an orphan (e.g. the last <li> of a list, or a job header with no bullets below it),
      // keep related elements together.
      let targetElement = el;

      // Never push an internal element inside a card; push the entire card container
      const parentCard = el.closest('[data-card="true"], .rounded-lg.border, .bg-slate-50\\/70');
      if (parentCard && parentCard !== container && !parentCard.classList.contains('resume-page')) {
        targetElement = parentCard;
      } else {
        // Check if target is a bullet point that is the very first bullet under a job header
        if (el.tagName.toLowerCase() === 'li' && !el.previousElementSibling) {
          const jobHeader = el.closest('.relative')?.querySelector('.break-inside-avoid');
          if (jobHeader && !jobHeader.getAttribute('data-page-break-padded')) {
            const jhTop = jobHeader.getBoundingClientRect().top - currentContainerRect.top;
            if (jhTop > dangerZoneTop - 60) {
              // Push job header as well so it is not separated from its first bullet
              targetElement = jobHeader;
            }
          }
        }

        // Check if target is the last bullet point of a list (orphan bullet prevention)
        if (el.tagName.toLowerCase() === 'li' && !el.nextElementSibling && el.previousElementSibling) {
          const prevBullet = el.previousElementSibling;
          const prevTop = prevBullet.getBoundingClientRect().top - currentContainerRect.top;
          if (prevTop > dangerZoneTop - 50 && !prevBullet.getAttribute('data-page-break-padded')) {
            // Push previous bullet as well so at least 2 bullets stay together
            targetElement = prevBullet;
            handledElements.add(el);
          }
        }
      }

      const targetRect = targetElement.getBoundingClientRect();
      const targetTop = targetRect.top - currentContainerRect.top;
      const pushNeeded = Math.round(nextSafeTop - targetTop);

      if (pushNeeded > 0) {
        const computedMargin = parseFloat(window.getComputedStyle(targetElement).marginTop) || 0;
        targetElement.style.marginTop = `${computedMargin + pushNeeded}px`;
        targetElement.setAttribute('data-page-break-padded', 'true');
        handledElements.add(targetElement);
      }
    }
  }
}
