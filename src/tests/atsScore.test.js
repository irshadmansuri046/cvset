import { describe, it, expect } from 'vitest';
import { calculateAtsScore } from '../utils/atsScore';
import { DEFAULT_RESUME, BLANK_RESUME } from '../constants/sampleData';

describe('ATS Resume Score Engine', () => {
  it('returns score 0 and empty items when resume is null or undefined', () => {
    expect(calculateAtsScore(null)).toEqual({ score: 0, items: [] });
    expect(calculateAtsScore(undefined)).toEqual({ score: 0, items: [] });
  });

  it('evaluates BLANK_RESUME with a low "Needs Work" score', () => {
    const result = calculateAtsScore(BLANK_RESUME);
    expect(result.score).toBeLessThan(30);
    expect(result.level).toBe('Needs Work');
    expect(result.items.length).toBe(7);
    expect(result.items.every((i) => !i.passed)).toBe(true);
  });

  it('evaluates DEFAULT_RESUME with a high "Top 2% ATS Ready!" score', () => {
    const result = calculateAtsScore(DEFAULT_RESUME);
    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.level).toBe('Top 2% ATS Ready!');
    expect(result.color).toContain('emerald');
    expect(result.items.length).toBe(7);
  });

  describe('Personal Details scoring (20 pts)', () => {
    it('awards 10 pts for first & last name plus target job title', () => {
      const res = calculateAtsScore({
        personalDetails: { firstName: 'Sarah', lastName: 'Connor', jobTitle: 'DevOps Engineer' }
      });
      const nameItem = res.items.find((i) => i.label.includes('Full Name'));
      expect(nameItem?.passed).toBe(true);
      expect(nameItem?.points).toBe(10);
    });

    it('awards 10 pts for valid email, phone, and city location', () => {
      const res = calculateAtsScore({
        personalDetails: { email: 'sarah@example.com', phone: '+1 555-0100', city: 'Austin' }
      });
      const contactItem = res.items.find((i) => i.label.includes('Contact Details'));
      expect(contactItem?.passed).toBe(true);
      expect(contactItem?.points).toBe(10);
    });
  });

  describe('Professional Summary scoring (20 pts)', () => {
    it('awards 0 pts if summary is empty or very short (<30 chars)', () => {
      const res = calculateAtsScore({ summary: 'Too short' });
      const summaryItem = res.items.find((i) => i.label.includes('Summary'));
      expect(summaryItem?.passed).toBe(false);
      expect(summaryItem?.points).toBe(20);
    });

    it('awards 10 pts if summary is between 31 and 119 chars', () => {
      const text = 'A'.repeat(50);
      const res = calculateAtsScore({ summary: text });
      const summaryItem = res.items.find((i) => i.label.includes('Expand Professional Summary'));
      expect(summaryItem?.passed).toBe(false);
      expect(summaryItem?.points).toBe(10);
      expect(res.score).toBeGreaterThanOrEqual(10);
    });

    it('awards full 20 pts if summary is 120+ chars', () => {
      const text = 'A'.repeat(130);
      const res = calculateAtsScore({ summary: text });
      const summaryItem = res.items.find((i) => i.label.includes('Comprehensive Professional Summary'));
      expect(summaryItem?.passed).toBe(true);
      expect(summaryItem?.points).toBe(20);
    });
  });

  describe('Employment History scoring (25 pts)', () => {
    it('awards 25 pts for 2+ experiences with action bullet points or length > 80', () => {
      const res = calculateAtsScore({
        employmentHistory: [
          { id: '1', jobTitle: 'Engineer', description: '• Spearheaded microservices refactor with 40% latency drop' },
          { id: '2', jobTitle: 'Developer', description: '• Built automated CI/CD pipeline reducing deployment cycle by 3 hours' }
        ]
      });
      const expItem = res.items.find((i) => i.label.includes('Work History'));
      expect(expItem?.passed).toBe(true);
      expect(expItem?.points).toBe(25);
    });

    it('awards partial 15 pts if 2 experiences lack action bullets', () => {
      const res = calculateAtsScore({
        employmentHistory: [
          { id: '1', jobTitle: 'Engineer', description: 'Did coding' },
          { id: '2', jobTitle: 'Developer', description: 'Did testing' }
        ]
      });
      const expItem = res.items.find((i) => i.label.includes('Bullet Points'));
      expect(expItem?.passed).toBe(false);
    });

    it('awards partial 15 pts for single employment history', () => {
      const res = calculateAtsScore({
        employmentHistory: [{ id: '1', jobTitle: 'Solo', description: 'Work' }]
      });
      const expItem = res.items.find((i) => i.label.includes('2nd Work Experience'));
      expect(expItem?.passed).toBe(false);
    });
  });

  describe('Skills scoring (15 pts)', () => {
    it('awards 15 pts for 6 or more skills', () => {
      const skills = Array.from({ length: 6 }, (_, i) => ({ id: `${i}`, name: `Skill ${i}` }));
      const res = calculateAtsScore({ skills });
      const skillItem = res.items.find((i) => i.label.includes('Well-Rounded Skill Set'));
      expect(skillItem?.passed).toBe(true);
      expect(skillItem?.points).toBe(15);
    });

    it('awards 8 pts for 3 to 5 skills', () => {
      const skills = Array.from({ length: 4 }, (_, i) => ({ id: `${i}`, name: `Skill ${i}` }));
      const res = calculateAtsScore({ skills });
      const skillItem = res.items.find((i) => i.label.includes('Core Skills'));
      expect(skillItem?.passed).toBe(false);
      expect(res.score).toBe(8);
    });

    it('awards 0 pts for less than 3 skills', () => {
      const skills = [{ id: '1', name: 'React' }];
      const res = calculateAtsScore({ skills });
      expect(res.score).toBe(0);
    });
  });

  describe('Education scoring (10 pts)', () => {
    it('awards 10 pts for at least 1 education entry', () => {
      const res = calculateAtsScore({
        education: [{ id: '1', degree: 'B.S. in CS', school: 'MIT' }]
      });
      const eduItem = res.items.find((i) => i.label.includes('Educational Background'));
      expect(eduItem?.passed).toBe(true);
      expect(eduItem?.points).toBe(10);
    });
  });

  describe('Bonus Portfolio & Extras scoring (10 pts)', () => {
    it('awards full 10 pts bonus when both online links and extra sections exist', () => {
      const res = calculateAtsScore({
        personalDetails: { linkedin: 'https://linkedin.com/in/test' },
        projects: [{ id: '1', name: 'Project Alpha' }]
      });
      const bonusItem = res.items.find((i) => i.label.includes('Portfolio Links'));
      expect(bonusItem?.passed).toBe(true);
      expect(bonusItem?.points).toBe(10);
    });

    it('awards partial 5 pts when either links OR extras exist', () => {
      const res = calculateAtsScore({
        personalDetails: { github: 'https://github.com/test' }
      });
      const bonusItem = res.items.find((i) => i.label.includes('Add Projects, Certifications'));
      expect(bonusItem?.passed).toBe(false);
      expect(bonusItem?.points).toBe(5);
    });
  });

  describe('Score boundaries & levels', () => {
    it('categorizes 65-84 as "Strong Resume"', () => {
      // Create a resume that lands around 70
      const resume = {
        personalDetails: { firstName: 'Jane', lastName: 'Doe', jobTitle: 'Engineer', email: 'j@d.com', phone: '123', city: 'SF' }, // 20
        summary: 'A'.repeat(130), // 20
        skills: Array.from({ length: 6 }, (_, i) => ({ id: `${i}`, name: `Skill ${i}` })), // 15
        education: [{ id: '1', degree: 'BS', school: 'Uni' }] // 10
        // total 65
      };
      const result = calculateAtsScore(resume);
      expect(result.score).toBe(65);
      expect(result.level).toBe('Strong Resume');
      expect(result.color).toContain('blue');
    });

    it('caps maximum score at 100', () => {
      const maxedResume = {
        personalDetails: {
          firstName: 'A', lastName: 'B', jobTitle: 'C',
          email: 'a@b.com', phone: '123', city: 'City',
          linkedin: 'https://linkedin.com', github: 'https://github.com'
        },
        summary: 'A'.repeat(150),
        employmentHistory: [
          { id: '1', description: '• bullet 1 '.repeat(10) },
          { id: '2', description: '• bullet 2 '.repeat(10) }
        ],
        skills: Array.from({ length: 8 }, (_, i) => ({ id: `${i}`, name: `S${i}` })),
        education: [{ id: '1', degree: 'BS', school: 'Uni' }],
        projects: [{ id: '1', name: 'P' }],
        languages: [{ id: '1', name: 'English', level: 'Native' }]
      };
      const result = calculateAtsScore(maxedResume);
      expect(result.score).toBe(100);
      expect(result.level).toBe('Top 2% ATS Ready!');
    });
  });
});
