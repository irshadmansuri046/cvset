import { describe, it, expect, beforeEach } from 'vitest';
import { adjustPageBreakPadding, A4_PAGE_HEIGHT_PX, DEFAULT_PAGE_BREAK_PADDING } from '../utils/pageBreaks';

describe('Page Break Padding Utility', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'resume-preview-document';
    document.body.appendChild(container);
  });

  it('exports correct standard A4 height and default padding constants', () => {
    expect(A4_PAGE_HEIGHT_PX).toBe(1123);
    expect(DEFAULT_PAGE_BREAK_PADDING).toBe(28);
  });

  it('leaves single page resumes untouched without adding artificial margins', () => {
    // Single page container (height < 1123)
    Object.defineProperty(container, 'scrollHeight', { value: 800, configurable: true });
    Object.defineProperty(container, 'offsetHeight', { value: 800, configurable: true });

    const item = document.createElement('li');
    item.textContent = 'Single page bullet point';
    container.appendChild(item);

    adjustPageBreakPadding(container, 28);
    expect(item.getAttribute('data-page-break-padded')).toBeNull();
    expect(item.style.marginTop).toBe('');
  });

  it('adjusts atomic elements crossing the page boundary danger zone', () => {
    // Multi-page container (height = 2000)
    Object.defineProperty(container, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(container, 'offsetHeight', { value: 2000, configurable: true });

    container.getBoundingClientRect = () => ({
      top: 0,
      bottom: 2000,
      left: 0,
      right: 794,
      width: 794,
      height: 2000
    });

    const safeItem = document.createElement('li');
    safeItem.textContent = 'Safe bullet';
    safeItem.getBoundingClientRect = () => ({
      top: 500,
      bottom: 530,
      left: 0,
      right: 500,
      width: 500,
      height: 30
    });
    Object.defineProperty(safeItem, 'offsetHeight', { value: 30, configurable: true });
    container.appendChild(safeItem);

    // Item starting at 1100 and ending at 1130 (crosses 1123 boundary and danger zone)
    const crossingItem = document.createElement('li');
    crossingItem.textContent = 'Crossing bullet';
    crossingItem.getBoundingClientRect = () => ({
      top: 1100,
      bottom: 1130,
      left: 0,
      right: 500,
      width: 500,
      height: 30
    });
    Object.defineProperty(crossingItem, 'offsetHeight', { value: 30, configurable: true });
    container.appendChild(crossingItem);

    adjustPageBreakPadding(container, 32);

    // Safe item should not be adjusted
    expect(safeItem.getAttribute('data-page-break-padded')).toBeNull();

    // Crossing item should be pushed to nextSafeTop (1123 + 32 = 1155)
    // Push needed: 1155 - 1100 = 55px
    expect(crossingItem.getAttribute('data-page-break-padded')).toBe('true');
    expect(crossingItem.style.marginTop).toBe('55px');
  });

  it('resets previously applied margins before recalculating', () => {
    Object.defineProperty(container, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(container, 'offsetHeight', { value: 2000, configurable: true });
    container.getBoundingClientRect = () => ({
      top: 0,
      bottom: 2000,
      left: 0,
      right: 794,
      width: 794,
      height: 2000
    });

    const item = document.createElement('li');
    item.setAttribute('data-page-break-padded', 'true');
    item.style.marginTop = '99px';
    item.getBoundingClientRect = () => ({
      top: 400,
      bottom: 430,
      left: 0,
      right: 500,
      width: 500,
      height: 30
    });
    Object.defineProperty(item, 'offsetHeight', { value: 30, configurable: true });
    container.appendChild(item);

    adjustPageBreakPadding(container, 28);

    // Since item is at 400px (far from 1123), previous 99px margin is cleanly cleared
    expect(item.getAttribute('data-page-break-padded')).toBeNull();
    expect(item.style.marginTop).toBe('');
  });
});
