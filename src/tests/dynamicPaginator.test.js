import { describe, it, expect } from 'vitest';
import {
  A4_PAGE_WIDTH_PX,
  A4_PAGE_HEIGHT_PX,
  DEFAULT_PAGE_PADDING_PX,
  calculateTextLines,
  estimateBlockHeight,
  paginateGenericBlocks,
  convertResumeToBlocks,
  paginateResume
} from '../utils/dynamicPaginator';

describe('Dynamic Paginator: Content-Agnostic Engine', () => {

  // --- UNIT TESTS: Text calculation and block height estimation ---
  describe('calculateTextLines & estimateBlockHeight', () => {
    it('accurately estimates line count based on character width', () => {
      expect(calculateTextLines('')).toBe(0);
      expect(calculateTextLines(null)).toBe(0);

      // Short single sentence (40 chars) at 75 chars/line => 1 line
      expect(calculateTextLines('A short sentence fits on a single line.', 75)).toBe(1);

      // 150 chars at 75 chars/line => 2 lines
      const longText = 'A'.repeat(150);
      expect(calculateTextLines(longText, 75)).toBe(2);

      // Multi-paragraph text
      const multi = 'First paragraph.\nSecond paragraph with more detail.\nThird paragraph.';
      expect(calculateTextLines(multi, 75)).toBe(3);
    });

    it('estimates block heights dynamically without hardcoded constants', () => {
      const headingBlock = { type: 'heading', title: 'Experience' };
      expect(estimateBlockHeight(headingBlock)).toBe(36);

      const shortText = { type: 'text', text: 'Brief overview.' };
      expect(estimateBlockHeight(shortText)).toBeGreaterThanOrEqual(24);

      const longText = { type: 'text', text: 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5' };
      expect(estimateBlockHeight(longText)).toBeGreaterThan(estimateBlockHeight(shortText));

      const entry = {
        type: 'entry',
        title: 'Lead Software Engineer',
        subtitle: 'Enterprise Systems Inc',
        text: '• Built event-driven distributed pipeline\n• Scaled database cluster\n• Led 6 engineers'
      };
      expect(estimateBlockHeight(entry, false)).toBeGreaterThanOrEqual(90);
    });
  });

  // --- TEST A: Short resume (minimal fields, 1 page, 0 phantom pages) ---
  describe('TEST A: Short Resume Space Utilization', () => {
    const shortResume = {
      personalDetails: {
        firstName: 'Jane',
        lastName: 'Doe',
        jobTitle: 'Junior Frontend Developer',
        email: 'jane.doe@example.com',
        phone: '+1 555-0199',
        city: 'Portland',
        country: 'USA'
      },
      summary: 'Motivated frontend developer specializing in modern React applications.',
      skills: [
        { id: '1', name: 'JavaScript' },
        { id: '2', name: 'React' },
        { id: '3', name: 'CSS / Tailwind' }
      ],
      employmentHistory: [
        {
          id: 'job-1',
          jobTitle: 'Web Developer Intern',
          employer: 'Tech Studio',
          startDate: '2023-01',
          endDate: '2023-08',
          description: 'Built responsive UI components and fixed cross-browser CSS bugs.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          school: 'State University',
          startDate: '2019',
          endDate: '2023'
        }
      ]
    };

    it('fits short resume on exactly 1 page with zero phantom pages', () => {
      const result = paginateResume(shortResume, { template: 'dublin', pagePadding: 45 });
      expect(result.totalPages).toBe(1);
      expect(result.pages.length).toBe(1);

      const page1 = result.pages[0];
      expect(page1.pageNumber).toBe(1);
      expect(page1.diagnostics).toBeDefined();
      expect(page1.diagnostics.occupiedHeight).toBeLessThan(page1.diagnostics.printableHeight);
      expect(page1.diagnostics.remainingHeight).toBeGreaterThan(0);
    });

    it('fits short resume on 1 page in single-column templates (Stockholm, Harvard, Berlin)', () => {
      ['stockholm', 'harvard', 'berlin'].forEach((template) => {
        const res = paginateResume(shortResume, { template, pagePadding: 45 });
        expect(res.totalPages).toBe(1);
        expect(res.pages[0].pageNumber).toBe(1);
      });
    });
  });

  // --- TEST B: Long resume (multi-page continuation, no content dropped) ---
  describe('TEST B: Long Resume Pagination & Integrity', () => {
    const generateLongResume = () => ({
      personalDetails: {
        firstName: 'Irshad',
        lastName: 'Mansuri',
        jobTitle: 'Senior Engineering Leader & Solutions Architect',
        email: 'irshad@example.com',
        phone: '+91 9999999999',
        city: 'Mumbai',
        country: 'India'
      },
      summary: 'Accomplished engineering leader with 16+ years architecting enterprise distributed platforms.',
      skills: Array.from({ length: 18 }).map((_, i) => ({ id: `s-${i}`, name: `Skill Competency ${i + 1}` })),
      employmentHistory: Array.from({ length: 8 }).map((_, i) => ({
        id: `job-${i}`,
        jobTitle: `Engineering Manager / Principal Architect Level ${i + 1}`,
        employer: `Enterprise Corporation ${i + 1}`,
        startDate: `201${Math.min(9, i)}-01`,
        endDate: i === 0 ? 'Present' : `202${Math.min(4, i)}-01`,
        city: 'Mumbai',
        description: `• Spearheaded digital transformation for business unit ${i + 1}.\n• Reduced system latency by 35% through cache optimization.\n• Mentored cross-functional team of 12 engineers and product managers.\n• Implemented automated CI/CD pipelines across microservices.`
      })),
      projects: Array.from({ length: 6 }).map((_, i) => ({
        id: `proj-${i}`,
        name: `Mission Critical Project ${i + 1}`,
        technologies: 'React, Node.js, Kubernetes, AWS',
        description: `High-availability cloud microservices platform handling 10M+ daily events for project ${i + 1}.`
      })),
      education: [
        { id: 'edu-1', degree: 'M.S. Software Systems', school: 'Premier Institute', startDate: '2008', endDate: '2010' },
        { id: 'edu-2', degree: 'B.E. Computer Engineering', school: 'Engineering College', startDate: '2004', endDate: '2008' }
      ],
      certifications: [
        { id: 'c-1', name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: '2023' },
        { id: 'c-2', name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2022' }
      ]
    });

    it('paginates extensive resume across multiple discrete pages without dropping content', () => {
      const longResume = generateLongResume();
      const result = paginateResume(longResume, { template: 'dublin', pagePadding: 45 });

      expect(result.totalPages).toBeGreaterThanOrEqual(2);
      expect(result.totalPages).toBeLessThanOrEqual(4);

      // Verify all jobs are present across pages
      const allJobTitlesInPages = result.pages.flatMap((p) =>
        p.main.filter((b) => b.type === 'entry' && b.data && b.data.jobTitle).map((b) => b.data.jobTitle)
      );
      longResume.employmentHistory.forEach((job) => {
        expect(allJobTitlesInPages).toContain(job.jobTitle);
      });

      // Verify all projects are present across pages
      const allProjectNamesInPages = result.pages.flatMap((p) =>
        p.main.filter((b) => b.type === 'card' && b.data && b.data.name).map((b) => b.data.name)
      );
      longResume.projects.forEach((proj) => {
        expect(allProjectNamesInPages).toContain(proj.name);
      });
    });

    it('transitions to full-width when sidebar blocks are exhausted on multi-page resume', () => {
      const longResume = generateLongResume();
      const result = paginateResume(longResume, { template: 'dublin', pagePadding: 45 });

      // First page should be two-column
      expect(result.pages[0].layout).toBe('two-column');

      // Subsequent page(s) after sidebar is exhausted should be full-width
      const fullWidthPages = result.pages.filter((p) => p.layout === 'full-width');
      expect(fullWidthPages.length).toBeGreaterThanOrEqual(1);

      // Full-width pages must have empty sidebar array
      fullWidthPages.forEach((p) => {
        expect(p.sidebar.length).toBe(0);
      });
    });
  });

  // --- TEST C: Uneven content distribution ---
  describe('TEST C: Uneven Content Distribution & Splitting', () => {
    it('handles a mix of 1-line bullet jobs and 10-bullet mega entries cleanly', () => {
      const unevenResume = {
        personalDetails: { firstName: 'Alice', lastName: 'Smith', jobTitle: 'Full Stack Engineer' },
        employmentHistory: [
          {
            id: 'j-short',
            jobTitle: 'Consultant',
            employer: 'Quick Consult',
            description: 'Short 1-line engagement.'
          },
          {
            id: 'j-mega',
            jobTitle: 'Staff Architect',
            employer: 'Scale Corp',
            description: Array.from({ length: 12 }).map((_, i) => `• In-depth bullet point item ${i + 1} detailing complex architectural change.`).join('\n')
          },
          {
            id: 'j-normal',
            jobTitle: 'Senior Developer',
            employer: 'Midsize Co',
            description: '• Bullet 1\n• Bullet 2\n• Bullet 3'
          }
        ]
      };

      const result = paginateResume(unevenResume, { template: 'stockholm', pagePadding: 40 });
      expect(result.totalPages).toBeGreaterThanOrEqual(1);

      // No NaN or negative dimensions in diagnostics
      result.pages.forEach((p) => {
        expect(p.diagnostics.occupiedHeight).toBeGreaterThan(0);
        expect(p.diagnostics.remainingHeight).toBeGreaterThanOrEqual(0);
        expect(p.diagnostics.utilizationPercentage).toBeGreaterThan(0);
        expect(p.diagnostics.utilizationPercentage).toBeLessThanOrEqual(100);
      });
    });
  });

  // --- TEST D: Variable text lengths & edge cases ---
  describe('TEST D: Variable Text Lengths & Defensive Resiliency', () => {
    it('safely wraps and measures excessively long titles, URLs, and continuous strings', () => {
      const edgeResume = {
        personalDetails: {
          firstName: 'VeryLongFirstNameExceedingStandardVisualBoundsWithoutBreaks',
          lastName: 'VeryLongLastNameExceedingStandardVisualBoundsWithoutBreaks',
          jobTitle: 'Principal Vice President of Global Enterprise Cloud Engineering, Modernization and Resiliency',
          website: 'https://extremely-long-custom-subdomain-url-portfolio-project-showcase.example.org/path/to/very/deep/project/portfolio'
        },
        employmentHistory: [
          {
            id: 'e-1',
            jobTitle: 'SuperLongJobTitleThatNormallyCausesHorizontalOverflowInUncheckedCssContainers',
            employer: 'InternationalConglomerateWithExceedinglyLongCorporateRegistrationName',
            description: 'https://example.com/very/long/continuous/unbroken/url/string/that/tests/word/break/behavior/in/pdf/engines'
          }
        ]
      };

      expect(() => {
        const result = paginateResume(edgeResume, { template: 'dublin', pagePadding: 45 });
        expect(result.totalPages).toBeGreaterThanOrEqual(1);
      }).not.toThrow();
    });
  });

  // --- TEST E: Dynamic & custom sections ---
  describe('TEST E: Arbitrary Custom Sections', () => {
    it('seamlessly paginates arbitrary user-defined custom sections', () => {
      const customResume = {
        personalDetails: { firstName: 'Sam', lastName: 'Taylor', jobTitle: 'Research Scientist' },
        customSections: [
          {
            id: 'sec-patents',
            title: 'Patents & Publications',
            items: [
              { id: 'p1', title: 'US Patent 9,123,456', subtitle: 'Distributed Consensus System', description: 'Granted in 2023.' },
              { id: 'p2', title: 'US Patent 8,987,654', subtitle: 'Fault-Tolerant Cache Invalidation', description: 'Granted in 2021.' }
            ]
          },
          {
            id: 'sec-speaking',
            title: 'Selected Keynote Engagements',
            content: 'Keynote Speaker at ReactConf 2023, QCon London 2022, and CloudNative Summit 2021.'
          }
        ]
      };

      const result = paginateResume(customResume, { template: 'dublin', pagePadding: 45 });
      expect(result.totalPages).toBeGreaterThanOrEqual(1);

      // Verify custom heading block was produced
      const allHeadings = result.pages.flatMap((p) => p.main.filter((b) => b.type === 'heading').map((b) => b.title));
      expect(allHeadings).toContain('Patents & Publications');
      expect(allHeadings).toContain('Selected Keynote Engagements');
    });
  });

  // --- TEST F: Template layout variations ---
  describe('TEST F: Support Across All Resume Templates', () => {
    const sample = {
      personalDetails: { firstName: 'Alex', lastName: 'Morgan', jobTitle: 'Lead Engineer' },
      summary: 'Proven engineering professional with enterprise delivery background.',
      skills: [{ id: '1', name: 'TypeScript' }, { id: '2', name: 'React' }],
      employmentHistory: [{ id: 'j1', jobTitle: 'Senior Engineer', employer: 'Apex Ltd', description: 'Led frontend systems.' }],
      education: [{ id: 'ed1', degree: 'B.S.', school: 'University', startDate: '2016', endDate: '2020' }]
    };

    const templates = ['dublin', 'graphite', 'stockholm', 'harvard', 'berlin', 'sydney'];

    templates.forEach((tmpl) => {
      it(`paginates correctly for template: "${tmpl}"`, () => {
        const result = paginateResume(sample, { template: tmpl, pagePadding: 45 });
        expect(result.totalPages).toBeGreaterThanOrEqual(1);
        expect(result.pages[0].pageNumber).toBe(1);
        expect(result.pages[0].pagePadding).toBe(45);
        expect(result.pages[0].main.length).toBeGreaterThan(0);
      });
    });
  });

  // --- TEST G: Layout telemetry & diagnostics ---
  describe('TEST G: Layout Diagnostics & Space Telemetry', () => {
    it('produces rigorous diagnostics for each generated page', () => {
      const sample = {
        personalDetails: { firstName: 'Taylor', lastName: 'Swift', jobTitle: 'Product Designer' },
        summary: 'Award-winning designer with focus on design systems and accessible UX.',
        skills: [{ id: '1', name: 'Figma' }, { id: '2', name: 'Design Systems' }],
        employmentHistory: [{ id: 'j1', jobTitle: 'Lead Product Designer', employer: 'Creative Agency', description: 'Established global design tokens.' }]
      };

      const result = paginateResume(sample, { template: 'dublin', pagePadding: 45 });
      const diag = result.pages[0].diagnostics;

      expect(diag).toBeDefined();
      expect(diag.pageNumber).toBe(1);
      expect(diag.totalPageHeight).toBe(A4_PAGE_HEIGHT_PX); // 1123
      expect(diag.printableHeight).toBe(A4_PAGE_HEIGHT_PX - 45 * 2); // 1033
      expect(diag.occupiedHeight).toBeGreaterThan(0);
      expect(diag.remainingHeight).toBe(diag.printableHeight - diag.occupiedHeight);
      expect(diag.utilizationPercentage).toBe(Math.round((diag.occupiedHeight / diag.printableHeight) * 100));
      expect(Array.isArray(diag.decisions)).toBe(true);
      expect(diag.decisions.length).toBeGreaterThan(0);
    });

    it('prevents orphan section headings at the bottom of a page', () => {
      // Simulate packing with a heading that would be orphaned without content
      const sidebarBlocks = [];
      const mainBlocks = [
        // A block that occupies most of the page (leaving only 30px)
        { id: 'fill-block', type: 'text', height: 980 },
        // A heading with keepWithNext: true
        { id: 'orphan-heading', type: 'heading', title: 'Orphan Heading Test', keepWithNext: true, height: 36 },
        // An accompanying content block
        { id: 'following-content', type: 'entry', height: 120 }
      ];

      const pages = paginateGenericBlocks({
        sidebarBlocks,
        mainBlocks,
        pagePadding: 45
      });

      // The heading must NOT be placed on Page 1 alone; it must be moved to Page 2 with its following content
      expect(pages.length).toBe(2);
      const page1BlockIds = pages[0].main.map((b) => b.id);
      const page2BlockIds = pages[1].main.map((b) => b.id);

      expect(page1BlockIds).not.toContain('orphan-heading');
      expect(page2BlockIds).toContain('orphan-heading');
      expect(page2BlockIds).toContain('following-content');

      // Verify decision log recorded the orphan protection
      const orphanDecision = pages[0].diagnostics.decisions.find((d) => d.action === 'moved_to_next_page' && d.reason === 'main_orphan_heading_protection');
      expect(orphanDecision).toBeDefined();
    });

    it('supports arbitrary custom sections seamlessly across paginated pages', () => {
      const resumeWithCustom = {
        personalDetails: { firstName: 'Alice', lastName: 'Engineer', jobTitle: 'Research Fellow' },
        summary: 'Specializing in distributed algorithms.',
        customSections: [
          {
            id: 'sec-patents',
            title: 'Granted Patents',
            items: [
              { id: 'pat-1', title: 'US10928374', subtitle: 'Distributed Consensus System', description: 'Fault-tolerant consensus algorithm for high-latency meshes.' },
              { id: 'pat-2', title: 'US10847291', subtitle: 'Optimistic Concurrency Control', description: 'Zero-overhead locking protocol for cache invalidation.' }
            ]
          },
          {
            id: 'sec-pubs',
            title: 'Selected Publications',
            content: '1. Doe, J. et al. (2024). Scalable Consensus in Edge Computing. ACM TOCS.\n2. Doe, J. (2023). Byzantine Fault Tolerance Revisited. IEEE TPDS.'
          }
        ]
      };

      const result = paginateResume(resumeWithCustom, { template: 'dublin', pagePadding: 45 });
      expect(result.totalPages).toBeGreaterThanOrEqual(1);

      // Verify custom heading and items are in main blocks
      const allMainBlocks = result.pages.flatMap((p) => p.main);
      const patentHeading = allMainBlocks.find((b) => b.title === 'Granted Patents');
      const patentItem = allMainBlocks.find((b) => b.title === 'US10928374');
      const pubsHeading = allMainBlocks.find((b) => b.title === 'Selected Publications');

      expect(patentHeading).toBeDefined();
      expect(patentItem).toBeDefined();
      expect(pubsHeading).toBeDefined();
    });
  });
});
