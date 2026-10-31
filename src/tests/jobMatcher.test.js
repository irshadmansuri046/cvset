import { describe, it, expect } from 'vitest';
import { 
  parseJobDescription, 
  parseResumeText, 
  analyzeJobMatch, 
  tailorResumeToJob,
  SAMPLE_JOB_DESCRIPTIONS,
  SKILLS_DICTIONARY 
} from '../utils/jobMatcher';
import { DEFAULT_RESUME } from '../constants/sampleData';

describe('Job Matcher & Tailoring Engine', () => {
  it('has a rich skills dictionary', () => {
    expect(SKILLS_DICTIONARY.length).toBeGreaterThan(40);
    expect(SKILLS_DICTIONARY.some(s => s.name === 'React')).toBe(true);
    expect(SKILLS_DICTIONARY.some(s => s.name === 'Kubernetes')).toBe(true);
    expect(SKILLS_DICTIONARY.some(s => s.name === 'PostgreSQL')).toBe(true);
  });

  it('parses structured details from raw Job Description', () => {
    const sampleJd = SAMPLE_JOB_DESCRIPTIONS[0];
    const parsed = parseJobDescription(sampleJd.description);

    expect(parsed.roleTitle).toContain('Senior Full Stack Engineer');
    expect(parsed.skillsNames).toContain('React');
    expect(parsed.skillsNames).toContain('TypeScript');
    expect(parsed.skillsNames).toContain('Node.js');
    expect(parsed.skillsNames).toContain('PostgreSQL');
    expect(parsed.skillsNames).toContain('Docker');
    expect(parsed.skillsNames).toContain('AWS');
    expect(parsed.responsibilities.length).toBeGreaterThan(0);
  });

  it('handles empty or invalid JD text gracefully', () => {
    const parsed = parseJobDescription('');
    expect(parsed.roleTitle).toBe('Target Role');
    expect(parsed.skills.length).toBe(0);

    const parsedNull = parseJobDescription(null);
    expect(parsedNull.roleTitle).toBe('Target Role');
  });

  it('parses raw resume text into structured cvset resume object', () => {
    const rawCv = `
Jane Doe
Senior Frontend Developer
jane.doe@example.com | +1 (555) 987-6543 | https://linkedin.com/in/janedoe

Professional Summary:
Passionate Frontend Developer with 6 years experience building React and TypeScript applications.

Skills:
React, TypeScript, Next.js, Redux, Tailwind CSS, GraphQL, Vite

Experience:
Senior Developer at Acme Corp
• Built design system in React and Tailwind CSS.
• Scaled web performance.
    `;

    const parsedResume = parseResumeText(rawCv);
    expect(parsedResume).toBeDefined();
    expect(parsedResume.personalDetails.firstName).toBe('Jane');
    expect(parsedResume.personalDetails.lastName).toBe('Doe');
    expect(parsedResume.personalDetails.email).toBe('jane.doe@example.com');
    expect(parsedResume.personalDetails.jobTitle).toBe('Senior Frontend Developer');
    expect(parsedResume.skills.length).toBeGreaterThanOrEqual(3);
    expect(parsedResume.skills.some(s => s.name === 'React')).toBe(true);
  });

  it('analyzes keyword matches and gap analysis between resume and JD', () => {
    const sampleJd = SAMPLE_JOB_DESCRIPTIONS[0];
    const parsedJd = parseJobDescription(sampleJd.description);
    const analysis = analyzeJobMatch(DEFAULT_RESUME, parsedJd);

    expect(analysis.matchPercentage).toBeGreaterThan(40);
    expect(analysis.matchedSkills.length).toBeGreaterThan(0);
    expect(analysis.matchedSkills.some(s => s.name === 'React')).toBe(true);
    expect(analysis.recommendations.length).toBeGreaterThan(0);
  });

  it('tailors resume to job description, boosting ATS match score and aligning skills', () => {
    const sampleJd = SAMPLE_JOB_DESCRIPTIONS[0];
    const result = tailorResumeToJob(DEFAULT_RESUME, sampleJd.description);

    expect(result.tailoredResume).toBeDefined();
    expect(result.tailoredResume.personalDetails.jobTitle).toBe(result.newTitle);
    expect(result.tailoredResume.summary).toContain(result.newTitle);
    expect(result.afterScore).toBeGreaterThanOrEqual(result.beforeScore);
    expect(result.afterScore).toBeGreaterThanOrEqual(85);
    expect(result.tailoredResume.skills.length).toBeGreaterThanOrEqual(DEFAULT_RESUME.skills.length);
  });

  it('tailors for a DevOps role and injects cloud skills', () => {
    const devopsJd = SAMPLE_JOB_DESCRIPTIONS[2];
    const result = tailorResumeToJob(DEFAULT_RESUME, devopsJd.description);

    expect(result.newTitle).toContain('DevOps');
    expect(result.tailoredResume.personalDetails.jobTitle).toContain('DevOps');
    expect(result.afterScore).toBeGreaterThanOrEqual(85);
  });
});
