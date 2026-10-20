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
      const parent = document.createElement('div');
      parent.style.transform = 'scale(0.85)';
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';
      parent.appendChild(targetDiv);
      document.body.appendChild(parent);

      mockCanvas.height = 1123; // exactly 1 page

      const success = await exportResumeToPdf('resume-preview-document', 'john_doe.pdf');

      expect(success).toBe(true);
      expect(mockHtml2canvas).toHaveBeenCalledWith(
        targetDiv,
        expect.objectContaining({
          scale: 2,
          windowWidth: 1200,
          backgroundColor: '#ffffff'
        })
      );
      expect(mockAddImage).toHaveBeenCalled();
      expect(mockAddPage).not.toHaveBeenCalled(); // 1 page only
      expect(mockSave).toHaveBeenCalledWith('john_doe.pdf');
      expect(mockConfetti).toHaveBeenCalled();

      // Original style should be restored on parent wrapper
      expect(parent.style.transform).toBe('scale(0.85)');
    });

    it('slices multi-page resumes and adds additional PDF pages', async () => {
      const targetDiv = document.createElement('div');
      targetDiv.id = 'resume-preview-document';
      document.body.appendChild(targetDiv);

      // Height equivalent to 2.5 pages
      // pageWidth = 210, pageHeight = 297.
      // imgHeight = (canvas.height * 210) / canvas.width
      // If canvas.width = 794, canvas.height = 2500 -> imgHeight = 661.2 mm -> ~2.2 pages
      mockCanvas.width = 794;
      mockCanvas.height = 2500;

      const success = await exportResumeToPdf('resume-preview-document', 'multi_page.pdf');

      expect(success).toBe(true);
      expect(mockAddPage).toHaveBeenCalled();
      expect(mockAddImage).toHaveBeenCalledTimes(3); // 1 initial + 2 additional pages
      expect(mockSave).toHaveBeenCalledWith('multi_page.pdf');
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
