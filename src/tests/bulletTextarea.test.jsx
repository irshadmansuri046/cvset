import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { BulletTextarea } from '../components/ResumeEditor/BulletTextarea';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('BulletTextarea Component', () => {
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
      root.render(
        <BulletTextarea
          id="test-exp"
          label="Job Description"
          value=""
          onChange={vi.fn()}
          placeholder="Enter your responsibilities..."
          tip="Custom shortcut tip"
          {...props}
        />
      );
    });
  };

  it('renders label, placeholder, character counter, and custom tip', async () => {
    await renderComponent({ value: 'Software Engineer responsibilities' });

    expect(container.textContent).toContain('Job Description');
    expect(container.textContent).toContain('Custom shortcut tip');
    expect(container.textContent).toContain('34 chars');
    expect(container.textContent).toContain('1 line');

    const textarea = container.querySelector('textarea');
    expect(textarea.placeholder).toBe('Enter your responsibilities...');
  });

  it('inserts initial bullet when Bullet List button is clicked on empty input', async () => {
    const handleChange = vi.fn();
    await renderComponent({ value: '', onChange: handleChange });

    const bulletBtn = container.querySelector('button[title="Add Bullet Points (•)"]');
    expect(bulletBtn).toBeDefined();

    await act(async () => {
      bulletBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith('• ');
  });

  it('adds bullets to plain lines when Bullet List button is clicked', async () => {
    const handleChange = vi.fn();
    const value = 'First achievement\nSecond achievement';
    await renderComponent({ value, onChange: handleChange });

    const textarea = container.querySelector('textarea');
    textarea.selectionStart = 0;
    textarea.selectionEnd = value.length;

    const bulletBtn = container.querySelector('button[title="Add Bullet Points (•)"]');

    await act(async () => {
      bulletBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith('• First achievement\n• Second achievement');
  });

  it('removes bullets when all lines already have bullets and Bullet List is clicked again (toggle)', async () => {
    const handleChange = vi.fn();
    const value = '• First achievement\n• Second achievement';
    await renderComponent({ value, onChange: handleChange });

    const textarea = container.querySelector('textarea');
    textarea.selectionStart = 0;
    textarea.selectionEnd = value.length;

    const bulletBtn = container.querySelector('button[title="Add Bullet Points (•)"]');

    await act(async () => {
      bulletBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith('First achievement\nSecond achievement');
  });

  it('inserts numbered list when Numbered button is clicked', async () => {
    const handleChange = vi.fn();
    await renderComponent({ value: '', onChange: handleChange });

    const numberedBtn = container.querySelector('button[title="Add Numbered List (1, 2, 3...)"]');

    await act(async () => {
      numberedBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith('1. ');
  });

  it('clears all bullets when Clear Bullets button is clicked', async () => {
    const handleChange = vi.fn();
    await renderComponent({ value: '• Line 1\n• Line 2', onChange: handleChange });

    const clearBtn = container.querySelector('button[title="Remove all bullets and numbers"]');
    expect(clearBtn).not.toBeNull();

    await act(async () => {
      clearBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith('Line 1\nLine 2');
  });

  describe('Keyboard handling (Enter key)', () => {
    it('automatically continues bullet point when pressing Enter on a non-empty bullet line', async () => {
      const handleChange = vi.fn();
      const initialText = '• Built responsive UI';
      await renderComponent({ value: initialText, onChange: handleChange });

      const textarea = container.querySelector('textarea');
      textarea.selectionStart = initialText.length;
      textarea.selectionEnd = initialText.length;

      await act(async () => {
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
        textarea.dispatchEvent(enterEvent);
      });

      expect(handleChange).toHaveBeenCalledWith('• Built responsive UI\n• ');
    });

    it('clears empty bullet marker when pressing Enter on an empty bullet line', async () => {
      const handleChange = vi.fn();
      const initialText = '• First item\n• ';
      await renderComponent({ value: initialText, onChange: handleChange });

      const textarea = container.querySelector('textarea');
      textarea.selectionStart = initialText.length;
      textarea.selectionEnd = initialText.length;

      await act(async () => {
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
        textarea.dispatchEvent(enterEvent);
      });

      expect(handleChange).toHaveBeenCalledWith('• First item\n');
    });

    it('automatically increments number when pressing Enter on a numbered line', async () => {
      const handleChange = vi.fn();
      const initialText = '1. Completed task 1';
      await renderComponent({ value: initialText, onChange: handleChange });

      const textarea = container.querySelector('textarea');
      textarea.selectionStart = initialText.length;
      textarea.selectionEnd = initialText.length;

      await act(async () => {
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
        textarea.dispatchEvent(enterEvent);
      });

      expect(handleChange).toHaveBeenCalledWith('1. Completed task 1\n2. ');
    });
  });
});
