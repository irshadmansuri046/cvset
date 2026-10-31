import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportResumeToPdf, printResume } from '../utils/pdfExport';

// Mock dependencies
const mockAddImage = vi.fn();
const mockAddPage = vi.fn();
const mockSave = vi.fn();

class MockJsPDF {
  constructor() {
    this.addImage = mockAddImage;
    this.addPage = mockAddPage;
    this.save = mockSave;
  }
}

vi.mock('jspdf', () => {
  return {
    default: MockJsPDF,
    jsPDF: MockJsPDF
  };
});

const mockCanvas = {
  width: 794,
  height: 1123,
  toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,mockImageData')
};

const mockHtml2canvas = vi.fn().mockResolvedValue(mockCanvas);

vi.mock('html2canvas', () => {
  return {
    default: (...args) => mockHtml2canvas(...args)
  };
});

const mockConfetti = vi.fn();
vi.mock('canvas-confetti', () => {
  return {
    default: (...args) => mockConfetti(...args)
  };
});

describe('PDF Export & Print Utility (cvset)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('printResume', () => {
    it('triggers window.print()', () => {
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
      printResume();
      expect(printSpy).toHaveBeenCalled();
      printSpy.mockRestore();
    });
  });

  describe('exportResumeToPdf', () => {
    it('falls back to window.print() if target element is not in DOM', async () => {
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await exportResumeToPdf('non-existent-target');
      expect(printSpy).toHaveBeenCalled();
      expect(result).toBe(false);

      printSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('exports single-page PDF and triggers confetti celebration when element is present', async () => {
      const grandparent = document.createElement('div');
      grandparent.style.width = '674px';
      grandparent.style.height = '954px';

      const parent = document.createElement('div');
      parent.style.transform = 'scale(0.85)';
      parent.style.position = 'absolute';

      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';

      parent.appendChild(targetDiv);
      grandparent.appendChild(parent);
      document.body.appendChild(grandparent);

      mockCanvas.height = 1123; // exactly 1 page

      const success = await exportResumeToPdf('resume-preview-document', 'john_doe.pdf');

      expect(success).toBe(true);
      expect(mockHtml2canvas).toHaveBeenCalledWith(
        targetDiv,
        expect.objectContaining({
          scale: 2,
          windowWidth: 1200,
          backgroundColor: '#ffffff',
          width: 794,
          scrollX: 0,
          scrollY: 0
        })
      );
      expect(mockAddImage).toHaveBeenCalled();
      expect(mockAddPage).not.toHaveBeenCalled(); // 1 page only
      expect(mockSave).toHaveBeenCalledWith('john_doe.pdf');
      expect(mockConfetti).toHaveBeenCalled();

      // Original styles should be restored on parent and grandparent wrappers
      expect(parent.style.transform).toBe('scale(0.85)');
      expect(parent.style.position).toBe('absolute');
      expect(grandparent.style.width).toBe('674px');
      expect(grandparent.style.height).toBe('954px');
    });

    it('handles onclone properly by stripping .no-print, pinning at (0, 0) and ensuring personal details header is visible', async () => {
      const parent = document.createElement('div');
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';
      parent.appendChild(targetDiv);
      document.body.appendChild(parent);

      await exportResumeToPdf('resume-preview-document', 'test.pdf');

      // Extract the onclone callback passed to html2canvas
      const html2canvasOptions = mockHtml2canvas.mock.calls[0][1];
      expect(html2canvasOptions).toBeDefined();
      expect(typeof html2canvasOptions.onclone).toBe('function');

      // Create a mock cloned document
      const clonedDoc = document.implementation.createHTMLDocument('clone');
      const clonedWrapper = clonedDoc.createElement('div');
      const clonedResume = clonedDoc.createElement('div');
      clonedResume.id = 'resume-preview-document';

      const header = clonedDoc.createElement('header');
      header.textContent = 'Alex Morgan - Senior Full Stack Engineer';
      clonedResume.appendChild(header);

      const noPrintEl = clonedDoc.createElement('div');
      noPrintEl.className = 'no-print';
      noPrintEl.textContent = 'Page break marker';

      clonedResume.appendChild(noPrintEl);
      clonedWrapper.appendChild(clonedResume);
      clonedDoc.body.appendChild(clonedWrapper);

      // Invoke onclone
      html2canvasOptions.onclone(clonedDoc);

      // Verify .no-print elements are stripped
      expect(clonedDoc.querySelector('.no-print')).toBeNull();

      // Verify cloned resume has width 794px and relative positioning at top 0, left 0
      expect(clonedResume.style.width).toBe('794px');
      expect(clonedResume.style.position).toBe('relative');
      expect(clonedResume.style.top).toBe('0px');
      expect(clonedResume.style.left).toBe('0px');
      expect(clonedDoc.body.contains(clonedResume)).toBe(true);

      // Verify personal details header preserves its native template formatting without forced display override
      expect(header.style.display).not.toBe('flex');
    });

    it('zeros out scrollContainer.scrollTop before export and restores original scroll', async () => {
      const scrollContainer = document.createElement('div');
      scrollContainer.scrollTop = 420;
      scrollContainer.scrollLeft = 50;

      const outer = document.createElement('div');
      const wrapper = document.createElement('div');
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';

      wrapper.appendChild(targetDiv);
      outer.appendChild(wrapper);
      scrollContainer.appendChild(outer);
      document.body.appendChild(scrollContainer);

      let capturedScrollTop = -1;
      mockHtml2canvas.mockImplementationOnce(() => {
        capturedScrollTop = scrollContainer.scrollTop;
        return Promise.resolve(mockCanvas);
      });

      await exportResumeToPdf('resume-preview-document', 'scroll_test.pdf');

      expect(capturedScrollTop).toBe(0); // zeroed so personal details at top are preserved
      expect(scrollContainer.scrollTop).toBe(420); // restored after export
    });

    it('slices multi-page resumes and adds additional PDF pages', async () => {
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';
      document.body.appendChild(targetDiv);

      // Height equivalent to ~2.2 pages
      mockCanvas.width = 794;
      mockCanvas.height = 2500;

      const success = await exportResumeToPdf('resume-preview-document', 'multi_page.pdf');

      expect(success).toBe(true);
      expect(mockAddPage).toHaveBeenCalled();
      expect(mockAddImage).toHaveBeenCalledTimes(3); // 1 initial + 2 additional pages
      expect(mockSave).toHaveBeenCalledWith('multi_page.pdf');
    });

    it('measures data-paper-height and data-total-pages to correctly expand canvas for multi-page export', async () => {
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';
      targetDiv.setAttribute('data-paper-height', '1850');
      targetDiv.setAttribute('data-total-pages', '2');
      document.body.appendChild(targetDiv);

      mockCanvas.width = 794;
      mockCanvas.height = 2246; // 2 pages at 1x or 4492 at 2x

      let capturedOptions;
      mockHtml2canvas.mockImplementationOnce((elem, opts) => {
        capturedOptions = opts;
        return Promise.resolve(mockCanvas);
      });

      const success = await exportResumeToPdf('resume-preview-document', 'alex_two_page.pdf');

      expect(success).toBe(true);
      expect(capturedOptions).toBeDefined();
      expect(capturedOptions.height).toBe(2246); // 2 full A4 pages (2 * 1123)
      expect(capturedOptions.windowHeight).toBeGreaterThanOrEqual(2746);
      expect(mockAddPage).toHaveBeenCalledTimes(1); // 1 addPage call = 2 total pages
      expect(mockAddImage).toHaveBeenCalledTimes(2);
      expect(mockSave).toHaveBeenCalledWith('alex_two_page.pdf');
    });

    it('prevents single-page resumes from creating phantom blank second page due to minor subpixel jitter', async () => {
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';
      targetDiv.setAttribute('data-paper-height', '1130'); // minor 7px overflow
      targetDiv.setAttribute('data-total-pages', '1');
      document.body.appendChild(targetDiv);

      mockCanvas.width = 794;
      mockCanvas.height = 1123;

      let capturedOptions;
      mockHtml2canvas.mockImplementationOnce((elem, opts) => {
        capturedOptions = opts;
        return Promise.resolve(mockCanvas);
      });

      const success = await exportResumeToPdf('resume-preview-document', 'single_page.pdf');

      expect(success).toBe(true);
      expect(capturedOptions.height).toBe(1123); // strictly 1 page
      expect(mockAddPage).not.toHaveBeenCalled(); // No second page added
      expect(mockAddImage).toHaveBeenCalledTimes(1);
    });

    it('handles zero dimension canvas by falling back to print', async () => {
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-export-target';
      document.body.appendChild(targetDiv);

      mockHtml2canvas.mockResolvedValueOnce({ width: 0, height: 0 });

      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await exportResumeToPdf('resume-export-target');
      expect(result).toBe(false);
      expect(printSpy).toHaveBeenCalled();

      printSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
