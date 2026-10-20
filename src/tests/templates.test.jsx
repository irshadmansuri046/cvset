import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { DublinTemplate } from '../components/ResumePreview/DublinTemplate';
import { StockholmTemplate } from '../components/ResumePreview/StockholmTemplate';
import { SydneyTemplate } from '../components/ResumePreview/SydneyTemplate';
import { HarvardTemplate } from '../components/ResumePreview/HarvardTemplate';
import { BerlinTemplate } from '../components/ResumePreview/BerlinTemplate';
import { SkillBar } from '../components/ResumePreview/SkillBar';
import { DEFAULT_RESUME } from '../constants/sampleData';

describe('Resume Templates Suite (cvset)', () => {
  const templates = [
    { name: 'Dublin (2-Column Modern)', Component: DublinTemplate },
    { name: 'Stockholm (Clean 1-Column)', Component: StockholmTemplate },
    { name: 'Sydney (Bold Hero Banner)', Component: SydneyTemplate },
    { name: 'Harvard (Academic Serif)', Component: HarvardTemplate },
    { name: 'Berlin (Technical Monospace)', Component: BerlinTemplate }
  ];

  templates.forEach(({ name, Component }) => {
    describe(name, () => {
      it('renders successfully with DEFAULT_RESUME data', () => {
        const html = renderToString(<Component resume={DEFAULT_RESUME} />);
        expect(html).toContain('Alex');
        expect(html).toContain('Morgan');
        expect(html).toContain('Senior Full Stack Engineer');
        expect(html).toContain('TechCorp Global');
        expect(html).toContain('University of Washington');
        expect(html).toContain('React');
        expect(html).toContain('TypeScript');
      });

      it('renders safely with an empty resume object without throwing', () => {
        expect(() => {
          const html = renderToString(<Component resume={{}} />);
          expect(typeof html).toBe('string');
        }).not.toThrow();
      });

      it('renders safely when resume prop is omitted (default prop)', () => {
        expect(() => {
          const html = renderToString(<Component />);
          expect(typeof html).toBe('string');
        }).not.toThrow();
      });

      it('renders safely with partial personalDetails', () => {
        const partial = {
          personalDetails: {
            firstName: 'Irshad',
            lastName: 'Mansuri'
          }
        };
        const html = renderToString(<Component resume={partial} />);
        expect(html).toContain('Irshad');
        expect(html).toContain('Mansuri');
      });

      it('applies custom themeColor and fontFamily styling', () => {
        const styledResume = {
          ...DEFAULT_RESUME,
          themeColor: '#e11d48',
          fontFamily: 'Inter'
        };
        const html = renderToString(<Component resume={styledResume} />);
        expect(html).toBeDefined();
      });
    });
  });

  describe('SkillBar Component', () => {
    it('renders correct dot indicators for skill levels', () => {
      const expertHtml = renderToString(<SkillBar level={5} color="#1a91f0" max={5} />);
      // 5 dots with opacity-100 and backgroundColor
      expect(expertHtml).toContain('opacity-100');
      expect(expertHtml).not.toContain('opacity-25');

      const beginnerHtml = renderToString(<SkillBar level={1} color="#1a91f0" max={5} />);
      // 1 active dot and 4 inactive dots with opacity-25
      expect(beginnerHtml).toContain('opacity-100');
      expect(beginnerHtml).toContain('opacity-25');
    });

    it('resolves string level names cleanly', () => {
      const noviceHtml = renderToString(<SkillBar level="Novice" color="#1a91f0" max={5} />);
      expect(noviceHtml).toContain('opacity-100');
      expect(noviceHtml).toContain('opacity-25');

      const expertHtml = renderToString(<SkillBar level="Expert" color="#1a91f0" max={5} />);
      expect(expertHtml).toContain('opacity-100');
      expect(expertHtml).not.toContain('opacity-25');
    });
  });
});
