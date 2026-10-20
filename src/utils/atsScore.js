export function calculateAtsScore(resume) {
  if (!resume) return { score: 0, items: [] };

  const items = [];
  let score = 0;

  // 1. Personal Details (20 pts)
  const p = resume.personalDetails || {};
  const hasBasicName = p.firstName?.trim() && p.lastName?.trim();
  const hasJobTitle = p.jobTitle?.trim();
  const hasContact = p.email?.trim() && p.phone?.trim();
  const hasLocation = p.city?.trim();

  if (hasBasicName && hasJobTitle) {
    score += 10;
    items.push({ label: "Full Name & Target Job Title", passed: true, points: 10 });
  } else {
    items.push({ label: "Add your Full Name & Target Job Title", passed: false, points: 10, tip: "Recruiters and ATS scanners identify you immediately by your target job role." });
  }

  if (hasContact && hasLocation) {
    score += 10;
    items.push({ label: "Contact Details & City Location", passed: true, points: 10 });
  } else {
    items.push({ label: "Complete Email, Phone & Location", passed: false, points: 10, tip: "ATS requires valid contact info and geographical location for sorting candidates." });
  }

  // 2. Professional Summary (20 pts)
  const summaryLength = resume.summary?.trim().length || 0;
  if (summaryLength >= 120) {
    score += 20;
    items.push({ label: "Comprehensive Professional Summary", passed: true, points: 20 });
  } else if (summaryLength > 30) {
    score += 10;
    items.push({ label: "Expand Professional Summary (aim for 2-4 sentences)", passed: false, points: 10, tip: "A strong 3-4 sentence elevator pitch highlights key wins and career trajectory." });
  } else {
    items.push({ label: "Write a Professional Summary", passed: false, points: 20, tip: "Use our pre-written AI suggestions to craft a compelling summary in 1-click." });
  }

  // 3. Work Experience (25 pts)
  const experiences = resume.employmentHistory || [];
  if (experiences.length >= 2) {
    const hasBullets = experiences.some(e => e.description && e.description.includes('•') || e.description?.length > 80);
    if (hasBullets) {
      score += 25;
      items.push({ label: "Detailed Work History with Action Bullets", passed: true, points: 25 });
    } else {
      score += 15;
      items.push({ label: "Add Action-Oriented Bullet Points to Experience", passed: false, points: 10, tip: "Quantify your achievements with numbers, percentages, or concrete project outcomes." });
    }
  } else if (experiences.length === 1) {
    score += 15;
    items.push({ label: "Add a 2nd Work Experience or Internship", passed: false, points: 10, tip: "Adding multiple roles shows career progression and breadth of responsibilities." });
  } else {
    items.push({ label: "Add Employment History", passed: false, points: 25, tip: "List your past or current roles to pass ATS experience threshold filters." });
  }

  // 4. Skills (15 pts)
  const skillsCount = resume.skills?.length || 0;
  if (skillsCount >= 6) {
    score += 15;
    items.push({ label: "Well-Rounded Skill Set (6+ skills)", passed: true, points: 15 });
  } else if (skillsCount >= 3) {
    score += 8;
    items.push({ label: "Add at least 6 Core Skills", passed: false, points: 7, tip: "Recruiter search algorithms match exact skill keywords to candidate resumes." });
  } else {
    items.push({ label: "List Key Technical & Soft Skills", passed: false, points: 15, tip: "Add prominent domain skills from our quick suggestions." });
  }

  // 5. Education (10 pts)
  const educationCount = resume.education?.length || 0;
  if (educationCount >= 1) {
    score += 10;
    items.push({ label: "Educational Background", passed: true, points: 10 });
  } else {
    items.push({ label: "Add Education or Degree", passed: false, points: 10, tip: "Mention your university degree, high school, or certified training." });
  }

  // 6. Bonus Points: Links, Languages, Certifications (10 pts)
  const hasLinks = p.linkedin?.trim() || p.github?.trim() || p.website?.trim();
  const hasExtras = (resume.projects?.length > 0) || (resume.languages?.length > 0) || (resume.certifications?.length > 0);
  
  if (hasLinks && hasExtras) {
    score += 10;
    items.push({ label: "Portfolio Links & Extra Sections (Projects/Languages)", passed: true, points: 10 });
  } else if (hasLinks || hasExtras) {
    score += 5;
    items.push({ label: "Add Projects, Certifications, or Languages", passed: false, points: 5, tip: "Adding certifications or project links distinguishes you from 90% of applicants." });
  } else {
    items.push({ label: "Add Online Profiles (LinkedIn / GitHub) & Projects", passed: false, points: 10, tip: "Provide links to your LinkedIn or personal portfolio to build credibility." });
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let level = "Needs Work";
  let color = "text-amber-500 bg-amber-50 border-amber-200";
  if (finalScore >= 85) {
    level = "Top 2% ATS Ready!";
    color = "text-emerald-600 bg-emerald-50 border-emerald-200";
  } else if (finalScore >= 65) {
    level = "Strong Resume";
    color = "text-blue-600 bg-blue-50 border-blue-200";
  }

  return {
    score: finalScore,
    level,
    color,
    items
  };
}
