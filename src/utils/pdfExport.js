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

    // 3. Temporarily unscale wrapper if scaled with CSS transform zoom
    const wrapper = element.parentElement;
    const originalTransform = wrapper ? wrapper.style.transform : '';
    const originalPosition = wrapper ? wrapper.style.position : '';

    if (wrapper) {
      wrapper.style.transform = 'none';
      wrapper.style.position = 'static';
    }

    let canvas;
    try {
      canvas = await html2canvas(element, {
        scale: 2, // High-resolution 300 DPI retina quality (1588px width for 794px A4)
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 1200, // ensure full desktop A4 styling is evaluated
        imageTimeout: 5000,
        onclone: (clonedDoc) => {
          const clonedResume = clonedDoc.getElementById('resume-preview-document') ||
                               clonedDoc.getElementById(elementId);
          if (clonedResume) {
            if (clonedResume.parentElement) {
              clonedResume.parentElement.style.transform = 'none';
              clonedResume.parentElement.style.position = 'static';
              clonedResume.parentElement.style.width = '794px';
            }
            clonedResume.style.boxShadow = 'none';
            clonedResume.style.margin = '0';
            clonedResume.style.transform = 'none';
            // Strip out on-screen page break marker overlays from the printed PDF
            clonedResume.querySelectorAll('.no-print').forEach((el) => el.remove());
          }
        }
      });
    } finally {
      if (wrapper) {
        wrapper.style.transform = originalTransform;
        wrapper.style.position = originalPosition;
      }
    }

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas rendering produced zero dimensions');
    }

    // 4. Standard A4 geometry in mm
    const pageWidth = 210;
    const pageHeight = 297;
    // Calculate exact pixel height corresponding to one A4 page on the canvas
    const pageCanvasHeight = Math.round((canvas.width * pageHeight) / pageWidth);
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // 5. Slice each A4 page into its own clean page canvas
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
      const pageCtx = pageCanvas.getContext('2d');

      if (pageCtx) {
        // Crisp white background for each page
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

      // High-quality lossless PNG to preserve sharp text and vibrant colors
      const pageImgData = pageCanvas.toDataURL ? pageCanvas.toDataURL('image/png') : canvas.toDataURL('image/png');
      pdf.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    pdf.save(fileName);

    // 6. Celebration confetti
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
