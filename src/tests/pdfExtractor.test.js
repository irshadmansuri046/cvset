import { describe, it, expect } from 'vitest';
import { extractTextFromPdf, unspaceText, processPageItems } from '../utils/pdfExtractor';
import { parseResumeText } from '../utils/jobMatcher';
import fs from 'fs';
import path from 'path';

describe('PDF Extractor & Resume Parsing Engine', () => {
  it('unspaces letter-spaced uppercase words correctly', () => {
    expect(unspaceText('P R O F E S S I O N A L')).toBe('PROFESSIONAL');
    expect(unspaceText('I R S H A D   M A N S U R I')).toBe('IRSHAD MANSURI');
    expect(unspaceText('S U M M A R Y')).toBe('SUMMARY');
  });

  it('reconstructs lines and handles two-column layouts', () => {
    const mockItems = [
      { str: 'IRSHAD MANSURI', transform: [1, 0, 0, 1, 210, 800] },
      { str: 'Senior Manager', transform: [1, 0, 0, 1, 210, 780] },
      { str: 'PROFESSIONAL SUMMARY', transform: [1, 0, 0, 1, 20, 800] },
      { str: 'Technical engineering leader', transform: [1, 0, 0, 1, 20, 780] }
    ];

    const result = processPageItems(mockItems);
    expect(result).toBeDefined();
    expect(result).toContain('IRSHAD MANSURI');
    expect(result).toContain('PROFESSIONAL SUMMARY');
  });

  it('handles invalid or empty PDF inputs safely without throwing', async () => {
    expect(await extractTextFromPdf(null)).toBeNull();
    expect(await extractTextFromPdf(undefined)).toBeNull();
    expect(await extractTextFromPdf(new ArrayBuffer(0))).toBeNull();
  });

  it('extracts real resume text and parses structured sections from uploaded PDF file', async () => {
    const samplePdfPath = '/Users/irshadmansuri/.gemini/antigravity/brain/f5710deb-b516-4f7a-9b20-7652d3c94acb/.user_uploaded/media_1793445164499_8311db04.pdf';
    if (!fs.existsSync(samplePdfPath)) {
      return; // Skip if test environment does not have artifact file
    }

    const buffer = fs.readFileSync(samplePdfPath);
    const extractedText = await extractTextFromPdf(buffer);

    expect(extractedText).toBeDefined();
    expect(extractedText.length).toBeGreaterThan(1000);
    expect(extractedText).toContain('IRSHAD MANSURI');
    expect(extractedText).toContain('irshadmansuri046@gmail.com');
    expect(extractedText).toContain('PROFESSIONAL EXPERIENCE');

    const resume = parseResumeText(extractedText);
    expect(resume).toBeDefined();

    // Personal details
    expect(resume.personalDetails.firstName).toBe('Irshad');
    expect(resume.personalDetails.lastName).toBe('Mansuri');
    expect(resume.personalDetails.email).toBe('irshadmansuri046@gmail.com');
    expect(resume.personalDetails.jobTitle).toContain('Senior Manager Application Development');
    expect(resume.personalDetails.city).toContain('Navi Mumbai');
    expect(resume.personalDetails.country).toBe('India');

    // Summary
    expect(resume.summary.length).toBeGreaterThan(100);
    expect(resume.summary).toContain('15+ years');

    // Employment History
    expect(resume.employmentHistory.length).toBeGreaterThanOrEqual(5);
    const employers = resume.employmentHistory.map(e => e.employer);
    expect(employers.some(e => e.includes('Swansat'))).toBe(true);
    expect(employers.some(e => e.includes('Health Arx'))).toBe(true);
    expect(employers.some(e => e.includes('GOQii'))).toBe(true);

    // Projects
    expect(resume.projects.length).toBeGreaterThanOrEqual(4);
    const projectTitles = resume.projects.map(p => p.title);
    expect(projectTitles.some(t => t.includes('MyBMC 3D'))).toBe(true);
    expect(projectTitles.some(t => t.includes('KhetPe'))).toBe(true);
    expect(projectTitles.some(t => t.includes('GOQii'))).toBe(true);

    // Skills
    expect(resume.skills.length).toBeGreaterThan(5);
  });
});
