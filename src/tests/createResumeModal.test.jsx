import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { CreateResumeModal } from '../components/CreateResumeModal';
import { DEFAULT_RESUME } from '../constants/sampleData';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('CreateResumeModal Component (2 Creation Options)', () => {
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
        <CreateResumeModal
          isOpen={true}
          onClose={vi.fn()}
          initialMode="choice"
          onCreateBlank={vi.fn()}
          onApplyTailoredResume={vi.fn()}
          currentResume={DEFAULT_RESUME}
          {...props}
        />
      );
    });
  };

  it('renders null when isOpen is false', async () => {
    await act(async () => {
      root.render(<CreateResumeModal isOpen={false} />);
    });
    expect(container.innerHTML).toBe('');
  });

  it('renders the 2 distinct creation options in choice mode', async () => {
    await renderModal({ initialMode: 'choice' });

    expect(container.textContent).toContain('How would you like to create your resume?');
    // Option 1
    expect(container.textContent).toContain('Option 1: Blank Resume (Manual)');
    expect(container.textContent).toContain('Choose from 5 modern ATS templates');

    // Option 2
    expect(container.textContent).toContain('Option 2: AI Tailor (Upload CV + Job Description)');
    expect(container.textContent).toContain('Upload PDF, JSON, TXT, or paste resume text');
  });

  it('navigates to Option 1 (Blank Resume) and submits with custom title and template', async () => {
    const handleCreateBlank = vi.fn();
    const handleClose = vi.fn();

    await renderModal({ onCreateBlank: handleCreateBlank, onClose: handleClose });

    // Click "Create Blank Resume" button on Option 1 card
    const buttons = Array.from(container.querySelectorAll('button'));
    const blankBtn = buttons.find(b => b.textContent.includes('Create Blank Resume'));
    expect(blankBtn).toBeDefined();

    await act(async () => {
      blankBtn.click();
    });

    // Should now be on Blank Resume Builder screen
    expect(container.textContent).toContain('Option 1: Blank Resume (Manual Entry)');
    expect(container.textContent).toContain('Choose Starting Template');

    // Change title
    const input = container.querySelector('input[type="text"]');
    await act(async () => {
      input.value = 'Product Manager Resume';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Click start editing button
    const submitBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent.includes('Start Editing Blank Resume')
    );
    expect(submitBtn).toBeDefined();

    await act(async () => {
      submitBtn.click();
    });

    expect(handleCreateBlank).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('navigates to Option 2 (AI Tailor) and runs AI tailoring on uploaded CV & Job Description', async () => {
    vi.useFakeTimers();
    const handleApplyTailored = vi.fn();
    const handleClose = vi.fn();

    await renderModal({ 
      initialMode: 'choice',
      onApplyTailoredResume: handleApplyTailored, 
      onClose: handleClose 
    });

    // Click Option 2 button
    const buttons = Array.from(container.querySelectorAll('button'));
    const aiBtn = buttons.find(b => b.textContent.includes('Upload CV & Paste Job Description'));
    expect(aiBtn).toBeDefined();

    await act(async () => {
      aiBtn.click();
    });

    // Should be on AI input screen
    expect(container.textContent).toContain('1. Paste Target Job Description (JD)');
    expect(container.textContent).toContain('2. Upload Your Existing Resume (CV)');

    // Click preset JD
    const presetBtn = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Senior Full Stack'));
    expect(presetBtn).toBeDefined();
    await act(async () => {
      presetBtn.click();
    });

    // Click generate button
    const generateBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent.includes('Generate Job-Matched Resume with AI')
    );
    expect(generateBtn).toBeDefined();

    await act(async () => {
      generateBtn.click();
    });

    // Run timer
    await act(async () => {
      vi.runAllTimers();
    });
    vi.useRealTimers();

    // Results screen
    expect(container.textContent).toContain('ATS Match');
    expect(container.textContent).toContain('Match Boost');
    expect(container.textContent).toContain('Matched Skills');

    // Click open in editor
    const openInEditorBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent.includes('Open in Live Editor') || b.textContent.includes('Open in Editor')
    );
    expect(openInEditorBtn).toBeDefined();

    await act(async () => {
      openInEditorBtn.click();
    });

    expect(handleApplyTailored).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });
});
