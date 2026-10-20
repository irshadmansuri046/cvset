export const DEFAULT_RESUME = {
  id: "cv-default-1",
  title: "Full Stack Engineer Resume",
  updatedAt: new Date().toISOString(),
  template: "dublin",
  themeColor: "#1a91f0",
  fontFamily: "Inter",
  spacing: "normal", // compact, normal, spacious
  personalDetails: {
    jobTitle: "Senior Full Stack Engineer",
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    country: "United States",
    city: "San Francisco, CA",
    address: "500 Howard Street, Suite 400",
    postalCode: "94105",
    drivingLicense: "Class C",
    nationality: "American",
    placeOfBirth: "Seattle, WA",
    dateOfBirth: "1994-08-14",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    showPhoto: true,
    website: "https://alexmorgan.dev",
    linkedin: "https://linkedin.com/in/alexmorgan",
    github: "https://github.com/alexmorgan"
  },
  summary: "Results-driven Senior Full Stack Engineer with 7+ years of experience architecting high-scale web platforms and cloud-native microservices. Proven track record of reducing system latency by 42% and increasing engineering velocity. Passionate about clean code, developer experience, and building intuitive user-facing products.",
  employmentHistory: [
    {
      id: "emp-1",
      jobTitle: "Lead Full Stack Engineer",
      employer: "TechCorp Global",
      city: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "Present",
      current: true,
      description: "• Architected high-performance SaaS platform serving 2.5M+ active users using React, TypeScript, Node.js, and AWS.\n• Reduced database query response times by 45% through Redis caching and PostgreSQL query optimization.\n• Mentored 8 junior and mid-level engineers, running weekly architecture reviews and pair programming sessions.\n• Spearheaded migration from legacy monolithic backend to containerized Docker & Kubernetes microservices."
    },
    {
      id: "emp-2",
      jobTitle: "Full Stack Developer",
      employer: "InnovateLabs Inc.",
      city: "Seattle, WA",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: "• Built responsive, accessible customer portal featuring real-time data visualization and automated billing workflows.\n• Implemented end-to-end CI/CD pipelines with GitHub Actions, reducing deployment cycle times from 2 days to 15 minutes.\n• Collaborated closely with product managers and UX designers to iterate quickly on key conversion funnels."
    }
  ],
  education: [
    {
      id: "edu-1",
      school: "University of Washington",
      degree: "B.S. in Computer Science",
      city: "Seattle, WA",
      startDate: "2014-09",
      endDate: "2018-05",
      description: "Graduated with Magna Cum Laude honors (GPA: 3.85/4.0). Specialization in Distributed Systems & Human-Computer Interaction."
    }
  ],
  skills: [
    { id: "sk-1", name: "React.js / Next.js", level: 5 },
    { id: "sk-2", name: "TypeScript / JavaScript", level: 5 },
    { id: "sk-3", name: "Node.js / Express", level: 4 },
    { id: "sk-4", name: "PostgreSQL / Redis", level: 4 },
    { id: "sk-5", name: "Cloud & AWS / Docker", level: 4 },
    { id: "sk-6", name: "Tailwind CSS & UI Systems", level: 5 },
    { id: "sk-7", name: "REST APIs & GraphQL", level: 5 }
  ],
  projects: [
    {
      id: "proj-1",
      name: "CloudScale Monitoring Dashboard",
      technologies: "React, Go, Prometheus, Tailwind CSS",
      link: "https://github.com/alexmorgan/cloudscale",
      description: "Open-source infrastructure monitoring dashboard adopted by 1,200+ developer teams worldwide."
    },
    {
      id: "proj-2",
      name: "SmartForm AI Assistant",
      technologies: "Next.js, OpenAI API, PostgreSQL",
      link: "https://smartform-ai.example.com",
      description: "Web application that automatically parses documents and generates formatted forms in under 3 seconds."
    }
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native / Bilingual" },
    { id: "lang-2", name: "Spanish", level: "Professional Working" },
    { id: "lang-3", name: "German", level: "Elementary" }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023-04"
    },
    {
      id: "cert-2",
      name: "Meta Certified Front-End Developer",
      issuer: "Meta",
      date: "2022-11"
    }
  ],
  customSections: []
};

export const BLANK_RESUME = {
  id: "",
  title: "Untitled Resume",
  updatedAt: new Date().toISOString(),
  template: "dublin",
  themeColor: "#1a91f0",
  fontFamily: "Inter",
  spacing: "normal",
  personalDetails: {
    jobTitle: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    drivingLicense: "",
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "",
    photo: "",
    showPhoto: false,
    website: "",
    linkedin: "",
    github: ""
  },
  summary: "",
  employmentHistory: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  certifications: [],
  customSections: []
};

export const PREWRITTEN_SUGGESTIONS = {
  "Software Engineer": {
    summaries: [
      "Versatile Software Engineer with a solid background in full-stack web development, distributed architecture, and cloud deployment. Adept at transforming complex requirements into reliable, maintainable code.",
      "Results-oriented Senior Software Developer with 6+ years of expertise designing high-throughput web applications, microservices, and modern user interfaces with high focus on performance and ATS compliance.",
      "Detail-oriented Software Engineer proficient in React, Node.js, and modern relational databases. Enthusiastic problem-solver committed to agile best practices, automated testing, and CI/CD automation."
    ],
    bullets: [
      "Developed high-traffic web features resulting in a 28% increase in daily active user engagement.",
      "Refactored mission-critical API endpoints, slashing latency by 40% and saving $15k in monthly infrastructure bills.",
      "Designed and deployed comprehensive automated test suites achieving 92% code test coverage.",
      "Collaborated with product, design, and DevOps teams to deliver 14 major feature releases ahead of schedule.",
      "Architected real-time WebSocket communication layer supporting 50,000 concurrent active connections."
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Git", "Docker", "AWS", "CI/CD", "REST APIs", "GraphQL"]
  },
  "Product Manager": {
    summaries: [
      "Strategic and customer-focused Product Manager with 5+ years of driving product vision from conception through market launch. Skilled at roadmap execution, stakeholder management, and data-driven decision making.",
      "High-energy Product Leader with a track record of launching top-tier B2B and consumer SaaS applications that drove a 35% ARR growth year-over-year.",
      "Agile Product Manager experienced in user research, sprint prioritization, and A/B testing. Passionate about solving complex user problems with seamless UX."
    ],
    bullets: [
      "Spearheaded the end-to-end product roadmap for flagship enterprise product, generating $3.2M in net new ARR.",
      "Conducted 80+ qualitative user interviews to identify high-impact friction points, improving retention by 22%.",
      "Defined and tracked key performance metrics (KPIs/OKRs) across 4 cross-functional development squads.",
      "Executed continuous A/B test experiments on landing and onboarding funnels, increasing conversion by 18%."
    ],
    skills: ["Product Strategy", "Agile & Scrum", "User Research", "Roadmapping", "A/B Testing", "Data Analytics", "Wireframing", "Jira", "Mixpanel", "SQL"]
  },
  "Data Analyst / Scientist": {
    summaries: [
      "Analytical Data Analyst skilled at converting large, unstructured datasets into actionable business intelligence and automated visual dashboards that empower executive decision making.",
      "Data Scientist with hands-on experience in machine learning pipelines, statistical modeling, and predictive analytics using Python, R, and modern SQL data warehouses."
    ],
    bullets: [
      "Built automated Tableau and PowerBI executive dashboards, saving stakeholders 15+ hours of manual reporting per week.",
      "Designed predictive churn model with 87% accuracy, enabling proactive retention campaigns for 40,000+ customers.",
      "Cleaned, transformed, and aggregated 100M+ event records using SQL, dbt, and Snowflake data pipelines.",
      "Partnered with marketing and product leadership to conduct rigorous statistical analysis on promotional campaigns."
    ],
    skills: ["Python", "SQL", "Tableau", "PowerBI", "Snowflake", "dbt", "Machine Learning", "Pandas", "Statistical Analysis", "Excel"]
  },
  "Marketing Specialist": {
    summaries: [
      "Creative and analytical Growth Marketing Specialist with proven success designing multi-channel digital campaigns across SEO, SEM, content, and email marketing.",
      "Performance Marketing Lead with 6+ years managing multi-million dollar ad budgets with a consistent ROAS of 3.8x."
    ],
    bullets: [
      "Increased organic search traffic by 180% in 9 months through targeted keyword research and technical SEO optimization.",
      "Managed $500K annual performance budget across Google Ads and LinkedIn, reducing Customer Acquisition Cost (CAC) by 24%.",
      "Crafted automated email drip nurturing sequences that boosted lead-to-opportunity conversion rate by 19%."
    ],
    skills: ["SEO", "Google Analytics 4", "Content Strategy", "Email Marketing", "Paid Search (SEM)", "Social Media Marketing", "HubSpot", "Copywriting"]
  },
  "UI / UX Designer": {
    summaries: [
      "User Experience Designer passionate about crafting intuitive, visually appealing, and accessible digital products. Proven track record of turning user insights into high-fidelity design systems.",
      "Senior Product Designer with 6+ years designing complex SaaS enterprise interfaces, mobile apps, and interactive prototypes with Figma."
    ],
    bullets: [
      "Designed and maintained unified Figma design system containing 200+ reusable components adopted by 35 developers.",
      "Conducted usability testing sessions that led to a complete redesign of the checkout flow, reducing drop-off by 31%.",
      "Created interactive responsive prototypes and micro-animations to validate features with customers and stakeholders."
    ],
    skills: ["Figma", "User Research", "Wireframing", "Design Systems", "Prototyping", "Information Architecture", "HTML/CSS Basics", "Accessibility (WCAG)"]
  }
};
