import { adjustPageBreakPadding, DEFAULT_PAGE_BREAK_PADDING } from './pageBreaks';

export async function exportResumeToPdf(elementId = 'resume-preview-document', fileName = 'resume.pdf') {
  // Try live preview document first, fallback to elementId or export target
  let element = document.getElementById('resume-preview-document') ||
                document.getElementById(elementId) ||
                document.getElementById('resume-export-target');

  if (!element) {
    console.warn('Target resume element not found for PDF export.');
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
    return false;
  }

  try {
    // 1. Ensure all custom fonts (Inter, Merriweather, Outfit, Roboto) are loaded
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // 2. Dynamic import to keep initial bundle light and fast
    const [html2canvasMod, jsPdfMod, confettiMod] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
      import('canvas-confetti')
    ]);

    const html2canvas = html2canvasMod.default || html2canvasMod;
    const jsPDF = jsPdfMod.jsPDF || jsPdfMod.default;
    const confetti = confettiMod.default || confettiMod;

    // 3. Temporarily unscale wrapper and outer container to avoid zoom clipping
    const wrapper = element.parentElement;
    const outer = wrapper ? wrapper.parentElement : null;
    const scrollContainer = outer ? outer.parentElement : null;

    const originalTransform = wrapper ? wrapper.style.transform : '';
    const originalPosition = wrapper ? wrapper.style.position : '';
    const originalOuterWidth = outer ? outer.style.width : '';
    const originalOuterHeight = outer ? outer.style.height : '';
    const originalScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
    const originalScrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
    const originalWindowScrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const originalWindowScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    if (wrapper) {
      wrapper.style.transform = 'none';
      wrapper.style.position = 'static';
    }
    if (outer) {
      outer.style.width = '794px';
      outer.style.height = 'auto';
    }
    // Reset scroll offsets before capture so headers and personal details at the top are not cut off
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    }
    if (typeof window !== 'undefined' && (originalWindowScrollX || originalWindowScrollY)) {
      window.scrollTo(0, 0);
    }

    // 4. Standard A4 geometry in mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Check if element contains discrete .resume-page containers
    const pageElements = Array.from(element.querySelectorAll('.resume-page'));

    if (pageElements.length > 0) {
      // --- DISCRETE PAGE CONTAINER EXPORT ---
      // Captures each discrete page element individually directly into its own exact A4 PDF page.
      // Eliminates canvas slicing, subpixel rounding error, and top padding loss.
      try {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        for (let i = 0; i < pageElements.length; i++) {
          const pageEl = pageElements[i];
          if (i > 0) {
            pdf.addPage();
          }

          const pageCanvas = await html2canvas(pageEl, {
            scale: 2, // High-resolution retina 300 DPI
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: '#ffffff',
            x: 0,
            y: 0,
            width: 794,
            height: 1123,
            windowWidth: 1200,
            scrollX: 0,
            scrollY: 0,
            imageTimeout: 10000,
            onclone: (clonedDoc) => {
              clonedDoc.querySelectorAll('.no-print').forEach((el) => el.remove());
              const clonedPages = clonedDoc.querySelectorAll('.resume-page');
              clonedPages.forEach((p) => {
                p.style.boxSizing = 'border-box';
                p.style.width = '794px';
                p.style.height = '1123px';
                p.style.minHeight = '1123px';
                p.style.maxHeight = '1123px';
                p.style.overflow = 'hidden';
              });
            }
          });

          const imgData = pageCanvas.toDataURL ? pageCanvas.toDataURL('image/png') : '';
          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        }

        pdf.save(fileName);

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        }

        return true;
      } finally {
        if (wrapper) {
          wrapper.style.transform = originalTransform;
          wrapper.style.position = originalPosition;
        }
        if (outer) {
          outer.style.width = originalOuterWidth;
          outer.style.height = originalOuterHeight;
        }
        if (scrollContainer) {
          scrollContainer.scrollTop = originalScrollTop;
          scrollContainer.scrollLeft = originalScrollLeft;
        }
        if (typeof window !== 'undefined' && (originalWindowScrollX || originalWindowScrollY)) {
          window.scrollTo(originalWindowScrollX, originalWindowScrollY);
        }
      }
    }

    // --- FALLBACK / LEGACY CONTINUOUS CANVAS SLICING EXPORT ---
    // Measure unconstrained content height to determine exact A4 page count
    const dataHeight = parseInt(element.getAttribute('data-paper-height') || '0', 10);
    const dataPages = parseInt(element.getAttribute('data-total-pages') || '0', 10);

    let contentHeight = Math.max(
      dataHeight,
      element.scrollHeight || 0,
      element.offsetHeight || 0,
      element.clientHeight || 0,
      1123
    );

    if (element.firstElementChild) {
      const child = element.firstElementChild;
      contentHeight = Math.max(
        contentHeight,
        child.scrollHeight || 0,
        child.offsetHeight || 0,
        child.clientHeight || 0
      );
      Array.from(child.children || []).forEach((grandchild) => {
        const bottom = (grandchild.offsetTop || 0) + (grandchild.offsetHeight || 0);
        contentHeight = Math.max(contentHeight, bottom, grandchild.scrollHeight || 0);
      });
    }

    Array.from(element.children || []).forEach((child) => {
      if (!child.classList.contains('no-print')) {
        const bottom = (child.offsetTop || 0) + (child.offsetHeight || 0);
        contentHeight = Math.max(contentHeight, bottom, child.scrollHeight || 0);
      }
    });

    const totalA4Pages = Math.max(1, dataPages, Math.ceil((contentHeight - 15) / 1123));
    const targetPixelHeight = totalA4Pages * 1123;

    let canvas;
    try {
      canvas = await html2canvas(element, {
        scale: 2, // High-resolution 300 DPI retina quality (1588px width for 794px A4)
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        x: 0,
        y: 0,
        width: 794,
        height: targetPixelHeight,
        windowWidth: 1200,
        windowHeight: Math.max(targetPixelHeight + 500, 3000),
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 10000,
        onclone: (clonedDoc) => {
          const clonedResume = clonedDoc.getElementById('resume-preview-document') ||
                               clonedDoc.getElementById(elementId) ||
                               clonedDoc.getElementById('resume-export-target');

          // Strip out on-screen page break marker overlays and UI buttons from export
          clonedDoc.querySelectorAll('.no-print').forEach((el) => el.remove());

          if (clonedResume) {
            // Isolate cloned resume directly inside body at (0, 0) to prevent any layout offset
            clonedDoc.body.innerHTML = '';
            clonedDoc.body.style.margin = '0';
            clonedDoc.body.style.padding = '0';
            clonedDoc.body.style.background = '#ffffff';
            clonedDoc.body.style.overflow = 'visible';
            clonedDoc.body.appendChild(clonedResume);

            // Synchronize page break padding adjustment in cloned document environment
            const dataPadding = parseInt(element.getAttribute('data-page-break-padding') || `${DEFAULT_PAGE_BREAK_PADDING}`, 10);
            adjustPageBreakPadding(clonedResume, dataPadding, 1123);

            // Apply strict exact A4 dimensions to cloned resume pinned at (0, 0)
            clonedResume.style.boxShadow = 'none';
            clonedResume.style.margin = '0';
            clonedResume.style.transform = 'none';
            clonedResume.style.position = 'relative';
            clonedResume.style.top = '0';
            clonedResume.style.left = '0';
            clonedResume.style.width = '794px';
            clonedResume.style.minWidth = '794px';
            clonedResume.style.maxWidth = '794px';
            clonedResume.style.height = `${targetPixelHeight}px`;
            clonedResume.style.minHeight = `${targetPixelHeight}px`;
            clonedResume.style.overflow = 'visible';

            if (clonedResume.firstElementChild) {
              clonedResume.firstElementChild.style.minHeight = `${targetPixelHeight}px`;
            }

            // Ensure images have anonymous cross-origin set
            clonedResume.querySelectorAll('img').forEach((img) => {
              img.crossOrigin = 'anonymous';
            });
          }
        }
      });
    } finally {
      if (wrapper) {
        wrapper.style.transform = originalTransform;
        wrapper.style.position = originalPosition;
      }
      if (outer) {
        outer.style.width = originalOuterWidth;
        outer.style.height = originalOuterHeight;
      }
      if (scrollContainer) {
        scrollContainer.scrollTop = originalScrollTop;
        scrollContainer.scrollLeft = originalScrollLeft;
      }
      if (typeof window !== 'undefined' && (originalWindowScrollX || originalWindowScrollY)) {
        window.scrollTo(originalWindowScrollX, originalWindowScrollY);
      }
    }

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas rendering produced zero dimensions');
    }

    // Calculate exact pixel height corresponding to one A4 page on the canvas
    const pageCanvasHeight = Math.round((canvas.width * pageHeight) / pageWidth);

    const rawPages = canvas.height / pageCanvasHeight;
    const wholePages = Math.floor(rawPages);
    const excessPixels = canvas.height - (wholePages * pageCanvasHeight);
    const calculatedPages = Math.max(1, excessPixels > 20 ? wholePages + 1 : wholePages);
    const totalPages = Math.max(totalA4Pages, calculatedPages);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Slice each A4 page into its own clean page canvas
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
      const pageCtx = pageCanvas.getContext('2d');

      if (pageCtx) {
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        const srcY = page * pageCanvasHeight;
        const srcHeight = Math.min(pageCanvasHeight, canvas.height - srcY);

        if (srcHeight > 0) {
          pageCtx.drawImage(
            canvas,
            0, srcY, canvas.width, srcHeight,
            0, 0, canvas.width, srcHeight
          );
        }
      }

      let pageImgData;
      try {
        pageImgData = pageCanvas.toDataURL ? pageCanvas.toDataURL('image/png') : canvas.toDataURL('image/png');
      } catch {
        pageImgData = canvas.toDataURL ? canvas.toDataURL('image/png') : '';
      }
      pdf.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    pdf.save(fileName);

    // Celebration confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    return true;
  } catch (error) {
    console.error('PDF generation error, fallback to browser print:', error);
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
    return false;
  }
}

export function printResume() {
  window.print();
}
