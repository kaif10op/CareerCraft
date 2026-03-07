// A utility to analyze a generated resume text and return an ATS Score with feedback.

export interface AtsFeedback {
  type: "success" | "warning" | "error";
  message: string;
}

export interface AtsResult {
  score: number;
  feedback: AtsFeedback[];
}

const ACTION_VERBS = [
  "achieved", "improved", "trained", "resolved", "managed",
  "created", "developed", "led", "increased", "decreased",
  "negotiated", "launched", "spearheaded", "designed", "implemented",
  "optimized", "generated", "streamlined", "orchestrated", "reduced"
];

const IMPORTANT_SECTIONS = [
  "experience", "education", "skills"
];

export function calculateAtsScore(resumeText: string): AtsResult {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      score: 0,
      feedback: [{ type: "error", message: "Resume is completely empty." }]
    };
  }

  const textLower = resumeText.toLowerCase();
  let score = 0;
  const feedback: AtsFeedback[] = [];

  // 1. Length Check (Max 20 points)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 150) {
    score += 5;
    feedback.push({ type: "error", message: "Resume is too short. Try to add more details to reach at least 300 words." });
  } else if (wordCount >= 150 && wordCount < 300) {
    score += 12;
    feedback.push({ type: "warning", message: "Resume length is okay, but ATS prefers a bit more detail (aim for 300+ words)." });
  } else if (wordCount > 1000) {
    score += 15;
    feedback.push({ type: "warning", message: "Resume might be too long. ATS systems and humans prefer concise, impactful summaries." });
  } else {
    score += 20;
    feedback.push({ type: "success", message: "Excellent length. Perfect balance of detail and brevity." });
  }

  // 2. Section Presence (Max 30 points)
  let missingSections = 0;
  IMPORTANT_SECTIONS.forEach(sec => {
    if (!textLower.includes(sec)) {
      missingSections++;
    }
  });

  if (missingSections === 0) {
    score += 30;
    feedback.push({ type: "success", message: "All crucial sections (Experience, Education, Skills) are present." });
  } else if (missingSections === 1) {
    score += 20;
    feedback.push({ type: "warning", message: "You are missing a standard section (e.g., Experience, Skills, or Education)." });
  } else {
    score += 5;
    feedback.push({ type: "error", message: "Multiple standard sections are missing. This will severely hurt ATS parsing." });
  }

  // 3. Action Verbs / Keyword Density (Max 30 points)
  let verbsFound = 0;
  ACTION_VERBS.forEach(verb => {
    if (textLower.includes(verb)) {
      verbsFound++;
    }
  });

  if (verbsFound >= 8) {
    score += 30;
    feedback.push({ type: "success", message: "Great use of strong action verbs to describe your achievements." });
  } else if (verbsFound >= 4) {
    score += 20;
    feedback.push({ type: "warning", message: "Consider using more action verbs (e.g., 'spearheaded', 'optimized', 'developed')." });
  } else {
    score += 10;
    feedback.push({ type: "error", message: "Very few action verbs detected. Recruiters and ATS look for impact-driven language." });
  }

  // 4. Formatting / Bullet Points (Max 20 points)
  // Assuming standard markdown/bullet usage uses hyphens, asterisks, or literal bullets.
  const bulletCount = (resumeText.match(/[-*•]/g) || []).length;
  if (bulletCount >= 10) {
    score += 20;
    feedback.push({ type: "success", message: "Good use of bullet points. Makes the resume highly readable for ATS." });
  } else if (bulletCount >= 4) {
    score += 10;
    feedback.push({ type: "warning", message: "Try to use more bullet points in your Experience descriptions instead of large paragraphs." });
  } else {
    score += 0;
    feedback.push({ type: "error", message: "Lacking bullet points. Large walls of text are hard for ATS and humans to parse." });
  }

  return { score, feedback };
}
