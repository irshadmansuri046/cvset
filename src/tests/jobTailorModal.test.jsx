import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { JobTailorModal } from '../components/JobTailorModal';
import { DEFAULT_RESUME } from '../constants/sampleData';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('JobTailorModal Component', () => {
  let container;
  let root;

  beforeEach(() => {
    vi.restoreAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  const renderModal = async (props = {}) => {
    await act(async () => {
      root.render(
        <JobTailorModal
          isOpen={true}
          onClose={vi.fn()}
          currentResume={DEFAULT_RESUME}
          onApplyTailoredResume={vi.fn()}
          {...props}
        />
      );
    });
  };

  it('renders nothing when isOpen is false', async () => {
    await act(async () => {
      root.render(<JobTailorModal isOpen={false} />);
    });
    expect(container.innerHTML).toBe('');
  });

  it('renders modal elements when isOpen is true', async () => {
    await renderModal();
    expect(container.textContent).toContain('Match Job Description & Tailor CV');
    expect(container.textContent).toContain('1. Paste Target Job Description (JD)');
    expect(container.textContent).toContain('2. Candidate CV to Match & Tailor');
  });

  it('fills textarea when a sample JD preset button is clicked', async () => {
    await renderModal();

    const buttons = Array.from(container.querySelectorAll('button'));
    const fullstackBtn = buttons.find(b => b.textContent.includes('Senior Full Stack'));
    expect(fullstackBtn).toBeDefined();

    await act(async () => {
      fullstackBtn.click();
    });

    const textarea = container.querySelector('textarea');
    expect(textarea.value).toContain('Senior Full Stack Engineer');
  });

  it('runs analysis and tailoring, advancing to step 2 with score boost', async () => {
    vi.useFakeTimers();
    await renderModal();

    // Fill JD
    const buttons = Array.from(container.querySelectorAll('button'));
    const presetBtn = buttons.find(b => b.textContent.includes('Senior Full Stack'));
    await act(async () => {
      presetBtn.click();
    });

    // Click submit button
    const submitBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent.includes('Run ATS Match & Tailor My CV')
    );
    expect(submitBtn).toBeDefined();

    await act(async () => {
      submitBtn.click();
    });

    // Advance setTimeout timer
    await act(async () => {
      vi.runAllTimers();
    });

    vi.useRealTimers();

    // Should now show Step 2 results
    expect(container.textContent).toContain('ATS Match');
    expect(container.textContent).toContain('Match Boost');
    expect(container.textContent).toContain('Matched Required Skills');
    expect(container.textContent).toContain('Skills Aligned to Match JD');
  });

  it('calls onApplyTailoredResume when clicking Apply to Live Editor', async () => {
    vi.useFakeTimers();
    const handleApply = vi.fn();
    const handleClose = vi.fn();

    await renderModal({ onApplyTailoredResume: handleApply, onClose: handleClose });

    const presetBtn = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Senior Full Stack'));
    await act(async () => {
      presetBtn.click();
    });

    const submitBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent.includes('Run ATS Match & Tailor My CV')
    );
    await act(async () => {
      submitBtn.click();
    });

    await act(async () => {
      vi.runAllTimers();
    });
    vi.useRealTimers();

    const applyBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent.includes('Apply to Live Editor') || b.textContent.includes('Open in Editor')
    );
    expect(applyBtn).toBeDefined();

    await act(async () => {
      applyBtn.click();
    });

    expect(handleApply).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });
});
