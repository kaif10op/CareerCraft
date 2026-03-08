import { ResumeFormValues } from "./schema";

export function jsonToMarkdown(data: ResumeFormValues): string {
  const md: string[] = [];

  // 1. Header Information
  if (data.fullName) {
    md.push(`# ${data.fullName}`);
  }
  
  if (data.jobTitle) {
    md.push(`**${data.jobTitle}**`);
    md.push("");
  }

  // Contact Info
  const contactParts = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);
  if (data.linkedin) contactParts.push(`[LinkedIn](${data.linkedin})`);
  if (data.github) contactParts.push(`[GitHub](${data.github})`);
  if (data.portfolio) contactParts.push(`[Portfolio](${data.portfolio})`);
  
  if (contactParts.length > 0) {
    md.push(contactParts.join(" | "));
    md.push("");
  }

  // 2. Summary
  if (data.summary) {
    md.push("## Professional Summary");
    md.push(data.summary);
    md.push("");
  }

  // 3. Experience
  if (data.experience && data.experience.length > 0 && (data.experience[0].company || data.experience[0].position)) {
    md.push("## Experience");
    data.experience.forEach(exp => {
      if (!exp.company && !exp.position) return;
      
      md.push(`### ${exp.position || "Position"}`);
      
      const subHeader = [];
      if (exp.company) subHeader.push(`**${exp.company}**`);
      
      const dates = [];
      if (exp.startDate) dates.push(exp.startDate);
      if (exp.endDate) dates.push(exp.endDate);
      if (dates.length > 0) subHeader.push(dates.join(" - "));
      
      if (subHeader.length > 0) {
         md.push(subHeader.join(" | "));
      }
      
      if (exp.description) {
        md.push(exp.description);
      }
      md.push("");
    });
  }

  // 4. Education
  if (data.education && data.education.length > 0 && (data.education[0].institution || data.education[0].degree)) {
    md.push("## Education");
    data.education.forEach(edu => {
      if (!edu.institution && !edu.degree) return;
      
      const degreeStr = [edu.degree, edu.field].filter(Boolean).join(" in ");
      md.push(`### ${degreeStr || "Degree"}`);
      
      const subHeader = [];
      if (edu.institution) subHeader.push(`**${edu.institution}**`);
      
      const dates = [];
      if (edu.startYear) dates.push(edu.startYear);
      if (edu.endYear) dates.push(edu.endYear);
      if (dates.length > 0) subHeader.push(dates.join(" - "));
      
      if (subHeader.length > 0) {
         md.push(subHeader.join(" | "));
      }
      md.push("");
    });
  }

  // 5. Projects
  if (data.projects && data.projects.length > 0 && data.projects[0].name) {
    md.push("## Projects");
    data.projects.forEach(proj => {
      if (!proj.name) return;
      
      md.push(`### ${proj.name}`);
      
      if (proj.techStack) {
         md.push(`**Tech Stack:** ${proj.techStack}`);
      }
      
      if (proj.description) {
         md.push(proj.description);
      }
      md.push("");
    });
  }

  // 6. Certifications
  if (data.certifications && data.certifications.length > 0 && data.certifications[0].name) {
    md.push("## Certifications");
    data.certifications.forEach(cert => {
      if (!cert.name) return;
      
      md.push(`### ${cert.name}`);
      
      const subHeader = [];
      if (cert.issuer) subHeader.push(`**${cert.issuer}**`);
      if (cert.date) subHeader.push(cert.date);
      
      if (subHeader.length > 0) {
        md.push(subHeader.join(" | "));
      }
      md.push("");
    });
  }

  // 7. Skills
  if (data.skills && data.skills.length > 0 && data.skills[0]) {
    md.push("## Skills");
    // ResumePreview.tsx splits skills automatically, depending on their layout. 
    // They are usually comma separated.
    md.push(data.skills.join(", "));
    md.push("");
  }

  return md.join("\n").trim();
}
