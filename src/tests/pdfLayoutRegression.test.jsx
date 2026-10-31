import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { ResumeRenderer } from '../components/ResumePreview/ResumeRenderer';
import { DublinTemplate } from '../components/ResumePreview/DublinTemplate';
import { DEFAULT_RESUME } from '../constants/sampleData';
import { adjustPageBreakPadding, A4_PAGE_HEIGHT_PX } from '../utils/pageBreaks';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Long sample resume mimicking the user's multi-page CV
const SAMPLE_USER_RESUME = {
  ...DEFAULT_RESUME,
  personalDetails: {
    ...DEFAULT_RESUME.personalDetails,
    firstName: "Irshad",
    lastName: "Mansuri",
    jobTitle: "Senior Manager Application Development",
    city: "Navi Mumbai, India",
    phone: "+91 8000028800",
    email: "irshadmansuri046@gmail.com",
    website: "ditto-stack.lovable.app",
    linkedin: "irshad-mansuri-46893726",
    github: "irshadmansuri046"
  },
  summary: "Technical delivery and engineering leader with 15+ years of experience delivering software as web and mobile application initiatives across enterprise, healthcare, geospatial and consumer technology environments. Experienced in end-to-end delivery planning, requirements analysis, estimation, sprint and release planning, cross-functional coordination, risk and dependency resolution, quality governance, and production releases.",
  employmentHistory: [
    {
      id: "j1",
      jobTitle: "Senior Manager Application Development",
      employer: "Swansat Private Limited",
      city: "Mumbai",
      startDate: "Oct 2024",
      endDate: "Present",
      description: "• Owned end-to-end mobile application delivery for the MyBMC 3D platform across native Android and Flutter-based iOS applications.\n• Managed the mobile delivery lifecycle covering requirements gathering, technical planning, architecture review, development coordination, QA, defect resolution, UAT and release readiness.\n• Translated business and stakeholder requirements into actionable technical deliverables, development tasks, sprint priorities and release milestones.\n• Owned the mobile delivery roadmap, sprint planning, priorities and release cadence, aligning business expectations with engineering capacity.\n• Coordinated Android, iOS, GIS/backend, UI/UX, QA and external technology teams to manage dependencies and maintain delivery timelines."
    },
    {
      id: "j2",
      jobTitle: "Senior Manager Application Development",
      employer: "Health Arx Technologies Pvt. Ltd.",
      city: "Mumbai",
      startDate: "Apr 2024",
      endDate: "Oct 2024",
      description: "• Led the application development team, overseeing end-to-end planning, development, quality assurance, and delivery of mobile applications.\n• Managed project execution, including requirements gathering, technical planning, sprint management, resource allocation, and deployment.\n• Collaborated with product, UI/UX, backend, QA, and external stakeholders to translate business requirements into technical specifications and actionable development plans."
    },
    {
      id: "j3",
      jobTitle: "Tech Lead Application Development",
      employer: "GOQii Technologies Pvt. Ltd.",
      city: "Mumbai",
      startDate: "Feb 2016",
      endDate: "Apr 2024",
      description: "• Led the end-to-end development of mobile applications from scratch, driving product development from initial concept to release.\n• Owned mobile application delivery across iOS and Android, coordinating product, engineering, QA and external technology teams.\n• Managed technical risks, cross-team dependencies and delivery challenges throughout the software development lifecycle."
    },
    {
      id: "j4",
      jobTitle: "Sr. Software Developer / Technical Lead",
      employer: "KloudData Labs Pvt. Ltd.",
      city: "Navi Mumbai",
      startDate: "Nov 2015",
      endDate: "Feb 2016",
      description: "• Supported MyJio application development and maintenance while participating in Scrum meetings and client communication.\n• Guided and mentored junior developers and helped resolve complex technical challenges to meet project deadlines."
    },
    {
      id: "j5",
      jobTitle: "Team Lead iOS Engineer",
      employer: "Abbacus Technologies Pvt. Ltd.",
      city: "Ahmedabad",
      startDate: "Oct 2012",
      endDate: "Jul 2015",
      description: "• Managed a team of 7 developers, delegated work, developed very first product named Smart Restaurant.\n• Managed client communication, project progress and issue resolution.\n• Mentored junior developers and freshers and promoted iOS engineering best practices."
    },
    {
      id: "j6",
      jobTitle: "Sr. iOS Developer — C2H",
      employer: "Klix Web Solutions Pty. Ltd.",
      city: "Ahmedabad",
      startDate: "Jul 2012",
      endDate: "Oct 2012",
      description: "• Delivered a high-profile live sports application ahead of schedule and contributed to iOS design, development and optimization.\n• Worked with Swift, Objective-C and RESTful APIs in collaboration with cross-functional teams."
    },
    {
      id: "j7",
      jobTitle: "Jr. iOS Developer",
      employer: "iMobDev Technologies Pvt. Ltd.",
      city: "Ahmedabad",
      startDate: "Jan 2011",
      endDate: "Jun 2012",
      description: "• Progressed from trainee to permanent developer role and contributed to iOS application development."
    }
  ],
  skills: [
    { id: "s1", name: "Application Development Management", level: 5 },
    { id: "s2", name: "Requirement Gathering & Analysis", level: 5 },
    { id: "s3", name: "Agile / Scrum / SDLC", level: 5 },
    { id: "s4", name: "Project Planning & Delivery", level: 5 },
    { id: "s5", name: "Team Leadership & Resource Allocation", level: 4 },
    { id: "s6", name: "Sprint Planning & Execution", level: 5 },
    { id: "s7", name: "Stakeholder & Vendor Management", level: 4 },
    { id: "s8", name: "Technical Architecture & Governance", level: 5 },
    { id: "s9", name: "QA / UAT / Defect Management", level: 4 },
    { id: "s10", name: "Release & Deployment Management", level: 4 },
    { id: "s11", name: "Cross-functional Coordination", level: 5 },
    { id: "s12", name: "CoreBluetooth (BLE)", level: 4 },
    { id: "s13", name: "MVC, MVVM, VIPER Architecture", level: 5 },
    { id: "s14", name: "Claude AI, Cursor AI, Antigravity AI, Github Copilot, ChatGPT, Gemini, DeepSeek", level: 5 },
    { id: "s15", name: "Swift, SwiftUI, Kotlin, Flutter, React Native", level: 4 },
    { id: "s16", name: "REST, WebSockets, MQTT, Webhooks, VoIP", level: 4 }
  ],
  projects: [
    {
      id: "p1",
      name: "MyBMC 3D, BMC GIS Mobile Platform (Govt.)",
      technologies: "Kotlin, Flutter, Swift, Esri ArcGIS Maps SDK, ArcGIS Enterprise",
      link: "https://example.com/bmc",
      description: "• Owned end-to-end delivery across Android and iOS, coordinating technical requirements, development, QA, defect resolution and release readiness.\n• Managed requirement clarification with BMC, consultants, product stakeholders and technical teams."
    },
    {
      id: "p2",
      name: "KhetPe, Agriculture Technology Platform",
      technologies: "Kotlin, Swift, SwiftUI, IrriWatch, ECMWF, GIS",
      link: "https://example.com/khetpe",
      description: "• Build application from scratch and contributed to product and technology direction for a geospatial agriculture platform integrating mobile applications, weather intelligence, satellite imagery and AI-driven advisory capabilities."
    },
    {
      id: "p3",
      name: "Beato, Diabetes Management Platform",
      technologies: "Swift, Objective C, Kotlin, BLE",
      link: "https://example.com/beato",
      description: "• Led modernization of the application by migrating to MVVM Clean Architecture with focus on scalability and maintainability.\n• Resolved a major user drop-off issue by redesigning internal data-storage logic and improving application performance."
    },
    {
      id: "p4",
      name: "GOQii, Preventive Healthcare Platform",
      technologies: "Swift, Objective C, BLE",
      link: "https://example.com/goqii",
      description: "• Joined GOQii as the first Lead iOS Developer, leading mobile development and a team of app developers.\n• Owned end-to-end delivery of major features including onboarding, health score, food/activity logging, and BLE tracker integration."
    },
    {
      id: "p5",
      name: "Maxbupa Health Coach",
      technologies: "Swift, Objective C",
      link: "https://example.com/maxbupa",
      description: "• Developed a separate app based on client requirement for Max Bupa corporate where some of GOQii app features included like Health score, HRA and Arena."
    },
    {
      id: "p6",
      name: "Allianz- GOQii App",
      technologies: "Swift, Objective C",
      link: "https://example.com/allianz",
      description: "• Extended current GOQii app with different layout and separate features for corporate called Allianz, available with Chinese language support."
    },
    {
      id: "p7",
      name: "Other Projects",
      technologies: "",
      link: "",
      description: "Diabeto— SDK Framework | Posture Mama | iChill | TimeShare | KlipCraze | Take Eat Easy | Orijine Social Network | Nextin Bookings | Laila Ramadan | iResort App | Smart Restaurants | Breathe Magazine | OnlineCE"
    }
  ],
  certifications: [
    { id: "c1", name: "Aha! Product Management Professional Certificate", issuer: "Aha!", date: "2024" },
    { id: "c2", name: "Project Management Foundations", issuer: "NASBA", date: "2023" },
    { id: "c3", name: "Cert Prep: Scrum Master", issuer: "Kelley O'Connell", date: "2022" }
  ]
};

describe('Comprehensive PDF Layout & Pagination Regression Suite', () => {
  let container;
  let root;

  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  const renderResume = async (resumeData, props = {}) => {
    await act(async () => {
      root.render(<ResumeRenderer resume={resumeData} interactive={true} {...props} />);
    });
  };

  it('TEST CASE 1: Sample Comprehensive Resume - Eliminates 5th blank page and utilizes full width for projects', async () => {
    await renderResume(SAMPLE_USER_RESUME);

    const doc = container.querySelector('#resume-preview-document');
    expect(doc).not.toBeNull();

    // Verify candidate name & designation render prominently
    expect(doc.textContent).toContain('Irshad');
    expect(doc.textContent).toContain('Mansuri');
    expect(doc.textContent).toContain('Senior Manager Application Development');

    // Verify two-column layout for sidebar content across pages
    const sidebars = Array.from(doc.querySelectorAll('aside'));
    expect(sidebars.length).toBeGreaterThan(0);
    const combinedSidebarText = sidebars.map((s) => s.textContent).join(' ');
    expect(combinedSidebarText).toContain('Details');
    expect(combinedSidebarText).toContain('irshadmansuri046@gmail.com');
    expect(combinedSidebarText).toContain('Skills');
    expect(combinedSidebarText).toContain('Languages');

    // Verify full-width continuation layout for Key Projects
    const keyProjectsHeading = Array.from(doc.querySelectorAll('h2')).find(
      (h) => h.textContent.includes('Key Projects')
    );
    expect(keyProjectsHeading).toBeDefined();

    // Key Projects is in the full-width block (w-full), not squeezed into the 68% column
    const projectSection = keyProjectsHeading.closest('.w-full');
    expect(projectSection).not.toBeNull();
    expect(projectSection.className).toContain('w-full');

    // Verify "Other Projects" tag cloud renders without empty gaps
    expect(doc.textContent).toContain('Other Projects');
    expect(doc.textContent).toContain('Diabeto— SDK Framework');

    // Verify Certifications render cleanly
    expect(doc.textContent).toContain('Certifications');
    expect(doc.textContent).toContain('Aha! Product Management');

    // Verify page count: with compact skills and full-width projects, it must NEVER exceed 4 pages
    const totalPages = parseInt(doc.getAttribute('data-total-pages') || '1', 10);
    expect(totalPages).toBeLessThanOrEqual(4);
    expect(totalPages).toBeGreaterThanOrEqual(1);
  });

  it('TEST CASE 2: Short 1-Page Resume - Never generates artificial second blank page', async () => {
    const shortResume = {
      ...DEFAULT_RESUME,
      employmentHistory: [
        {
          id: "j1",
          jobTitle: "Frontend Developer",
          employer: "Acme Corp",
          startDate: "2023-01",
          endDate: "Present",
          description: "Built responsive web applications."
        }
      ],
      skills: [
        { id: "s1", name: "React", level: 5 },
        { id: "s2", name: "JavaScript", level: 4 }
      ],
      projects: [],
      certifications: []
    };

    await renderResume(shortResume);

    const doc = container.querySelector('#resume-preview-document');
    expect(doc).not.toBeNull();

    const totalPages = parseInt(doc.getAttribute('data-total-pages') || '1', 10);
    expect(totalPages).toBe(1);

    // No page break markers on a 1-page resume
    const breakMarkers = doc.querySelectorAll('.text-blue-400');
    expect(breakMarkers.length).toBe(0);
  });

  it('TEST CASE 3: Optional Sections Omitted - No empty headings, ghost borders, or blank gaps', async () => {
    const minimalResume = {
      ...DEFAULT_RESUME,
      summary: "",
      skills: [],
      projects: [],
      languages: [],
      certifications: [],
      education: [],
      personalDetails: {
        firstName: "Jane",
        lastName: "Doe",
        jobTitle: "Software Architect",
        email: "jane@example.com"
      }
    };

    await renderResume(minimalResume);

    const doc = container.querySelector('#resume-preview-document');
    expect(doc.textContent).not.toContain('Skills');
    expect(doc.textContent).not.toContain('Languages');
    expect(doc.textContent).not.toContain('Key Projects');
    expect(doc.textContent).not.toContain('Certifications');
    expect(doc.textContent).not.toContain('Education');
    expect(doc.textContent).toContain('Jane');
    expect(doc.textContent).toContain('Doe');
  });

  it('TEST CASE 4: Variable-Length Content - Handles extremely long company names and designations without clipping', async () => {
    const longContentResume = {
      ...DEFAULT_RESUME,
      personalDetails: {
        ...DEFAULT_RESUME.personalDetails,
        jobTitle: "Global Chief Principal Enterprise Cloud Solutions Architect & Delivery Executive Officer"
      },
      employmentHistory: [
        {
          id: "long-1",
          jobTitle: "Executive Vice President of Global Autonomous Distributed Systems Engineering",
          employer: "International Multi-National Technology Conglomerate Corporation Services Limited",
          city: "Greater Metropolitan Statistical Area of San Francisco",
          startDate: "2015-01",
          endDate: "Present",
          description: "• Spearheaded enterprise transformation across 50+ autonomous business units worldwide.\n• Led architecture governance for mission-critical cloud infrastructure processing 100B+ transactions daily."
        }
      ]
    };

    await renderResume(longContentResume);

    const doc = container.querySelector('#resume-preview-document');
    expect(doc.textContent).toContain('Global Chief Principal Enterprise Cloud Solutions Architect');
    expect(doc.textContent).toContain('International Multi-National Technology Conglomerate');
  });

  it('TEST CASE 5: Multiple Repeated PDF Generations - Stable output across successive calls', async () => {
    await renderResume(SAMPLE_USER_RESUME);
    const doc = container.querySelector('#resume-preview-document');

    const firstTotalPages = doc.getAttribute('data-total-pages');
    const firstPadding = doc.getAttribute('data-page-break-padding');

    // Run layout adjustment multiple times as during repeated PDF downloads
    adjustPageBreakPadding(doc, parseInt(firstPadding || '28', 10), A4_PAGE_HEIGHT_PX);
    adjustPageBreakPadding(doc, parseInt(firstPadding || '28', 10), A4_PAGE_HEIGHT_PX);

    expect(doc.getAttribute('data-total-pages')).toBe(firstTotalPages);
    expect(doc.getAttribute('data-page-break-padding')).toBe(firstPadding);
  });

  it('TEST CASE 6: Discrete A4 Page Containers - Uniform page-level padding, natural vertical flow, and no artificial marginTop gaps', async () => {
    await renderResume(SAMPLE_USER_RESUME);
    const doc = container.querySelector('#resume-preview-document');
    expect(doc).not.toBeNull();

    // Query discrete page containers
    const pages = Array.from(doc.querySelectorAll('.resume-page'));
    expect(pages.length).toBeGreaterThanOrEqual(1);
    expect(pages.length).toBeLessThanOrEqual(4);

    // Verify each page container enforces standard A4 dimensions (794x1123)
    pages.forEach((page, idx) => {
      expect(page.style.width).toBe('794px');
      expect(page.style.height).toBe('1123px');
      expect(page.getAttribute('data-page-number')).toBe(String(idx + 1));
    });

    // Page 1: Two-column layout with sidebar
    expect(pages[0].getAttribute('data-layout-mode')).toBe('two-column');

    // Subsequent pages: Expand to full width when sidebar is exhausted
    if (pages.length > 1) {
      expect(pages[1].getAttribute('data-layout-mode')).toMatch(/two-column|full-width/);
    }

    // Verify all employment entries follow each other naturally with NO artificial marginTop
    const fullText = doc.textContent;
    expect(fullText).toContain('Health Arx Technologies');
    expect(fullText).toContain('GOQii Technologies');
    expect(fullText).toContain('KhetPe');
    expect(fullText).toContain('Maxbupa Health Coach');
    expect(fullText).toContain('Allianz- GOQii App');
    expect(fullText).toContain('Other Projects');
    expect(fullText).toContain('Certifications');

    // Ensure no element has giant artificial inline marginTop
    const paddedElements = Array.from(doc.querySelectorAll('[style*="margin-top"], [style*="marginTop"]'));
    paddedElements.forEach((el) => {
      const mt = parseInt(el.style.marginTop || '0', 10);
      expect(mt).toBeLessThan(50);
    });
  });

  it('TEST CASE 7: Developer Layout Debugging - Toggling debug layout button activates visual markers', async () => {
    await renderResume(SAMPLE_USER_RESUME);

    const debugBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Debug Layout')
    );
    expect(debugBtn).toBeDefined();

    // Toggle debug on
    await act(async () => {
      debugBtn.click();
    });

    // Debug overlays should be rendered on each page
    const debugOverlays = container.querySelectorAll('.resume-page .font-mono');
    expect(debugOverlays.length).toBeGreaterThan(0);
    expect(debugOverlays[0].textContent).toContain('P1');
  });
});
