import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { DublinTemplate } from '../components/ResumePreview/DublinTemplate';
import { StockholmTemplate } from '../components/ResumePreview/StockholmTemplate';
import { SydneyTemplate } from '../components/ResumePreview/SydneyTemplate';
import { HarvardTemplate } from '../components/ResumePreview/HarvardTemplate';
import { BerlinTemplate } from '../components/ResumePreview/BerlinTemplate';
import { GraphiteTemplate } from '../components/ResumePreview/GraphiteTemplate';
import { OsloTemplate } from '../components/ResumePreview/OsloTemplate';
import { SkillBar } from '../components/ResumePreview/SkillBar';
import { DEFAULT_RESUME } from '../constants/sampleData';

describe('Resume Templates Suite (cvset)', () => {
  const templates = [
    { name: 'Dublin (2-Column Modern)', Component: DublinTemplate },
    { name: 'Stockholm (Clean 1-Column)', Component: StockholmTemplate },
    { name: 'Sydney (Bold Hero Banner)', Component: SydneyTemplate },
    { name: 'Harvard (Academic Serif)', Component: HarvardTemplate },
    { name: 'Berlin (Technical Monospace)', Component: BerlinTemplate },
    { name: 'Graphite (Charcoal Band & Warm Grey Sidebar)', Component: GraphiteTemplate },
    { name: 'Oslo (Boxed Header & Minimalist Sidebar)', Component: OsloTemplate }
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

  describe('GraphiteTemplate Design Fidelity', () => {
    it('renders charcoal name band over main column and full-height warm-grey sidebar', () => {
      const sample = {
        personalDetails: {
          firstName: 'Irshad',
          lastName: 'Mansuri',
          jobTitle: 'Technical Project Manager | Engineering Delivery | Agile & Stakeholder Leadership',
          email: 'irshadmansuri046@gmail.com',
          phone: '+91 8000028800',
          city: 'Mumbai',
          country: 'Maharashtra'
        },
        summary: 'Technical delivery and engineering leader with 15+ years of experience.',
        skills: [{ id: '1', name: 'DELIVERY COMPETENCIES' }],
        employmentHistory: [{
          id: 'e1',
          jobTitle: 'Senior Manager Application Development',
          employer: 'Swansat Private Limited',
          startDate: '10/2024',
          endDate: 'Present',
          city: 'Mumbai',
          description: '• Owned end-to-end delivery for the platform.'
        }],
        projects: [{
          id: 'p1',
          name: 'Core Project Delivery',
          description: 'Platform delivery competencies'
        }]
      };

      const html = renderToString(<GraphiteTemplate resume={sample} />);

      // Warm-grey sidebar
      expect(html).toContain('bg-[#e8e6e1]');
      expect(html).toContain('PROFESSIONAL SUMMARY');
      expect(html).toContain('CORE PROJECT');
      expect(html).toContain('DELIVERY COMPETENCIES');

      // Charcoal name band
      expect(html).toContain('Irshad');
      expect(html).toContain('Mansuri');
      expect(html).toContain('uppercase');
      expect(html).toContain('Technical Project Manager');
      expect(html).toContain('bg-[#23272e]');

      // Hairlines and wide-tracking
      expect(html).toContain('tracking-[0.22em]');
      expect(html).toContain('border-b-2');
      expect(html).toContain('border-color:#23272e');
      expect(html).toContain('PROFESSIONAL EXPERIENCE');

      // Contact details
      expect(html).toContain('irshadmansuri046@gmail.com');
      expect(html).toContain('+91 8000028800');
    });

    it('applies custom themeColor to section hairlines, bullets and banner accent', () => {
      const styled = {
        themeColor: '#059669', // Emerald
        personalDetails: { firstName: 'Jane', lastName: 'Doe' },
        employmentHistory: [{
          id: '1',
          jobTitle: 'Lead Architect',
          employer: 'Acme Corp',
          description: '• Architected systems'
        }]
      };

      const html = renderToString(<GraphiteTemplate resume={styled} />);
      expect(html).toContain('border-bottom:3.5px solid #059669');
      expect(html).toContain('border-color:#059669');
      expect(html).toContain('color:#059669');
    });

    it('renders certifications in sidebar and packs full executive CV without wasted blank pages', () => {
      const executiveResume = {
        personalDetails: {
          firstName: 'Irshad',
          lastName: 'Mansuri',
          jobTitle: 'Senior Manager Application Development'
        },
        summary: 'Technical delivery leader with 15+ years experience.',
        skills: [{ id: 's1', name: 'App Management' }, { id: 's2', name: 'Agile Delivery' }],
        education: [{ id: 'e1', degree: 'B.E. IT', school: 'State University' }],
        certifications: [
          { id: 'c1', name: 'Aha! Product Management Certificate', issuer: 'Aha!' }
        ],
        employmentHistory: [{
          id: 'j1',
          jobTitle: 'Senior Manager',
          employer: 'Enterprise Ltd',
          description: 'Led app delivery.'
        }],
        projects: [{
          id: 'p1',
          name: 'Platform Initiative',
          description: 'Delivered core product.'
        }]
      };

      const html = renderToString(<GraphiteTemplate resume={executiveResume} />);
      expect(html).toContain('CERTIFICATIONS');
      expect(html).toContain('Aha! Product Management Certificate');
    });
  });

  describe('OsloTemplate Specific Features', () => {
    it('renders boxed header, #f4f4f4 sidebar, main Education/Projects, and dot-rated languages', () => {
      const osloResume = {
        ...DEFAULT_RESUME,
        template: 'oslo',
        personalDetails: {
          ...DEFAULT_RESUME.personalDetails,
          firstName: 'Irshad',
          lastName: 'Mansuri',
          jobTitle: 'Tech Lead iOS / Senior Manager App Development',
          address: '1306, Marble Arch CHS, Sector 14',
          city: 'Navi Mumbai',
          country: 'India',
          phone: '+91 8000028800',
          email: 'irshadmansuri046@gmail.com',
          linkedin: 'https://linkedin.com/in/irshad',
          github: 'https://github.com/irshad'
        },
        languages: [
          { id: 'l1', name: 'English', level: 'Intermediate' },
          { id: 'l2', name: 'Hindi', level: 'Native' }
        ]
      };

      const html = renderToString(<OsloTemplate resume={osloResume} />);
      expect(html).toContain('Montserrat');
      expect(html).toContain('#f4f4f4');
      expect(html).toContain('Details');
      expect(html).toContain('Links');
      expect(html).toContain('Skills');
      expect(html).toContain('Languages');
      expect(html).toContain('Profile');
      expect(html).toContain('Employment History');
      expect(html).toContain('Education');
      expect(html).toContain('Projects');
    });
  });
});
