import React, { act } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { FormattedText } from '../components/ResumePreview/FormattedText';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('FormattedText Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  const renderComponent = async (props = {}) => {
    await act(async () => {
      root.render(<FormattedText {...props} />);
    });
  };

  it('returns null if text is empty or invalid', async () => {
    await renderComponent({ text: '' });
    expect(container.innerHTML).toBe('');

    await renderComponent({ text: null });
    expect(container.innerHTML).toBe('');

    await renderComponent({ text: undefined });
    expect(container.innerHTML).toBe('');
  });

  it('renders standard paragraph lines for non-bullet plain text', async () => {
    const text = 'First introductory sentence.\nSecond line of description.';
    await renderComponent({ text });

    expect(container.textContent).toContain('First introductory sentence.');
    expect(container.textContent).toContain('Second line of description.');
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBe(2);
  });

  it('groups lines starting with •, -, or * into an unnumbered list (ul)', async () => {
    const bulletText = [
      '• Led migration from monolith to microservices architecture.',
      '- Mentored 4 junior engineers on React best practices.',
      '* Reduced AWS CloudWatch bill by 32% via query optimization.'
    ].join('\n');

    await renderComponent({ text: bulletText });

    const ul = container.querySelector('ul');
    expect(ul).not.toBeNull();
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);

    expect(container.textContent).toContain('Led migration from monolith to microservices architecture.');
    expect(container.textContent).toContain('Mentored 4 junior engineers on React best practices.');
    expect(container.textContent).toContain('Reduced AWS CloudWatch bill by 32% via query optimization.');

    listItems.forEach(li => {
      expect(li.className).toContain('break-inside-avoid');
      expect(li.className).toContain('flex items-start');
    });
  });

  it('groups lines starting with numbers (e.g. 1., 2.) into an ordered list (ol)', async () => {
    const numberedText = [
      '1. Analyzed system bottlenecks and improved p99 latency.',
      '2. Built automated testing pipelines with 98% coverage.',
      '3. Delivered project 2 weeks ahead of target schedule.'
    ].join('\n');

    await renderComponent({ text: numberedText });

    const ol = container.querySelector('ol');
    expect(ol).not.toBeNull();
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);

    expect(container.textContent).toContain('1.');
    expect(container.textContent).toContain('2.');
    expect(container.textContent).toContain('3.');
    expect(container.textContent).toContain('Analyzed system bottlenecks and improved p99 latency.');
  });

  it('applies custom bullet color when bulletColor prop is provided', async () => {
    const bulletText = '• High-impact achievement';
    await renderComponent({ text: bulletText, bulletColor: '#2563eb' });

    const bulletSpan = container.querySelector('li span');
    expect(bulletSpan.style.color).toBe('rgb(37, 99, 235)');
  });

  it('handles mixed content: paragraphs, bullet points, and blank lines', async () => {
    const mixed = [
      'Experienced full-stack engineer with 6+ years in cloud-native apps.',
      '',
      '• Developed high-throughput microservices using Node.js & Go.',
      '• Implemented Redis caching layer reducing database read latency by 45%.',
      '',
      'Passionate about mentoring and developer experience.'
    ].join('\n');

    await renderComponent({ text: mixed });

    expect(container.textContent).toContain('Experienced full-stack engineer with 6+ years in cloud-native apps.');
    expect(container.textContent).toContain('Passionate about mentoring and developer experience.');
    
    const ul = container.querySelector('ul');
    expect(ul).not.toBeNull();
    expect(container.querySelectorAll('li').length).toBe(2);
    expect(container.textContent).toContain('Developed high-throughput microservices using Node.js & Go.');
  });
});
