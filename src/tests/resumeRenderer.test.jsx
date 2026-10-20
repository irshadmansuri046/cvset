import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { ResumeRenderer } from '../components/ResumePreview/ResumeRenderer';
import { DEFAULT_RESUME } from '../constants/sampleData';
import * as pdfExport from '../utils/pdfExport';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('ResumeRenderer Component (cvset)', () => {
  let container;
  let root;

  beforeEach(() => {
    vi.restoreAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  const renderComponent = async (props = {}) => {
    await act(async () => {
      root.render(<ResumeRenderer {...props} />);
    });
  };

  it('renders without crashing with default props', async () => {
    await renderComponent();
    expect(container.querySelector('#resume-preview-document')).not.toBeNull();
  });

  it('displays default zoom of 85%', async () => {
    await renderComponent({ resume: DEFAULT_RESUME, interactive: true });
    expect(container.textContent).toContain('Live Resume Preview');
    expect(container.textContent).toContain('(85%)');
  });

  it('increases zoom when Zoom In button is clicked', async () => {
    await renderComponent({ resume: DEFAULT_RESUME, interactive: true });

    const zoomInBtn = container.querySelector('button[title="Zoom In"]');
    expect(zoomInBtn).not.toBeNull();

    await act(async () => {
      zoomInBtn.click();
    });

    // 85% (0.85) + 0.1 -> 0.95 -> 95%
    expect(container.textContent).toContain('(95%)');
  });

  it('decreases zoom when Zoom Out button is clicked', async () => {
    await renderComponent({ resume: DEFAULT_RESUME, interactive: true });

    const zoomOutBtn = container.querySelector('button[title="Zoom Out"]');
    expect(zoomOutBtn).not.toBeNull();

    await act(async () => {
      zoomOutBtn.click();
    });

    // 85% (0.85) - 0.1 -> 0.75 -> 75%
    expect(container.textContent).toContain('(75%)');
  });

  it('resets zoom when Fit button is clicked', async () => {
    await renderComponent({ resume: DEFAULT_RESUME, interactive: true });

    const zoomInBtn = container.querySelector('button[title="Zoom In"]');
    const resetBtn = container.querySelector('button[title*="Reset Zoom"]');

    // Click zoom in twice
    await act(async () => {
      zoomInBtn.click();
      zoomInBtn.click();
    });

    // Click fit/reset
    await act(async () => {
      resetBtn.click();
    });

    expect(container.textContent).toContain('(85%)');
  });

  it('invokes exportResumeToPdf when Download PDF button is clicked', async () => {
    const exportSpy = vi.spyOn(pdfExport, 'exportResumeToPdf').mockResolvedValue(true);

    await renderComponent({ resume: DEFAULT_RESUME, interactive: true });

    const downloadBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Download PDF')
    );
    expect(downloadBtn).toBeDefined();

    await act(async () => {
      downloadBtn.click();
    });

    expect(exportSpy).toHaveBeenCalledWith(
      'resume-preview-document',
      expect.stringContaining('.pdf')
    );
  });

  it('invokes printResume when Print button is clicked', async () => {
    const printSpy = vi.spyOn(pdfExport, 'printResume').mockImplementation(() => {});

    await renderComponent({ resume: DEFAULT_RESUME, interactive: true });

    const printBtn = container.querySelector('button[title*="Print"]');
    expect(printBtn).not.toBeNull();

    await act(async () => {
      printBtn.click();
    });

    expect(printSpy).toHaveBeenCalled();
  });

  it('switches underlying template component based on resume.template', async () => {
    // Berlin template contains monospace / CURRICULUM VITAE text
    await renderComponent({
      resume: { ...DEFAULT_RESUME, template: 'berlin' },
      interactive: false
    });
    expect(container.textContent).toContain('Curriculum Vitae');

    // Stockholm template contains uppercase SUMMARY
    await renderComponent({
      resume: { ...DEFAULT_RESUME, template: 'stockholm' },
      interactive: false
    });
    expect(container.textContent).toContain('Summary');
  });
});
