import { ResumeInput } from "@/types/resume";

interface AIProvider {
  name: string;
  url: string;
  getHeaders: () => Record<string, string>;
  model: string;
}

const providers: AIProvider[] = [
  {
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://ai-resume-builder.vercel.app",
      "X-Title": "AI Resume Builder",
    }),
    model: "meta-llama/llama-4-maverick:free",
  },
  {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    }),
    model: "llama-3.3-70b-versatile",
  },
];

function buildPrompt(input: ResumeInput): string {
  const educationText = input.education
    .map(
      (e) =>
        `- ${e.degree} in ${e.field} from ${e.institution} (${e.startYear} - ${e.endYear})`
    )
    .join("\n");

  const experienceText = input.experience
    .map(
      (e) =>
        `- ${e.position} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`
    )
    .join("\n");

  const projectsText = input.projects && input.projects.length > 0
    ? input.projects.map(
        (p) => `- ${p.name}${p.techStack ? ` (${p.techStack})` : ""}: ${p.description}${p.link ? ` [Link](${p.link})` : ""}`
      ).join("\n")
    : "None provided.";

  const certsText = input.certifications && input.certifications.length > 0
    ? input.certifications.map(
        (c) => `- ${c.name} by ${c.issuer} (${c.date})`
      ).join("\n")
    : "None provided.";

  const skillsText = input.skills.join(", ");

  return `You are a professional resume writer. Generate a polished, ATS-friendly professional resume in clean Markdown format for the following person. Make it impressive, well-structured, and ready to use. Use proper sections with headers. Do NOT include any explanations or notes — only output the resume content.

**Personal Information:**
- Name: ${input.fullName}
${input.jobTitle ? `- Professional Title: ${input.jobTitle}` : ""}
- Email: ${input.email}
- Phone: ${input.phone}
${input.location ? `- Location: ${input.location}` : ""}
- LinkedIn: ${input.linkedin}
${input.github ? `- GitHub: ${input.github}` : ""}
${input.portfolio ? `- Portfolio: ${input.portfolio}` : ""}

**Professional Summary:**
${input.summary}

**Work Experience:**
${experienceText}

**Education:**
${educationText}

**Projects:**
${projectsText}

**Certifications:**
${certsText}

**Skills:**
${skillsText}

Generate a complete, professional resume in Markdown format. Include proper formatting with headers (##), bullet points, and clean spacing. Make it ATS-optimized, modern, and impressive.`;
}

export async function generateResume(input: ResumeInput): Promise<string> {
  const prompt = buildPrompt(input);
  const errors: string[] = [];

  for (const provider of providers) {
    // Skip providers without API keys
    const hasKey =
      (provider.name === "OpenRouter" && process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "your_openrouter_api_key") ||
      (provider.name === "Groq" && process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_groq_api_key");

    if (!hasKey) {
      errors.push(`${provider.name}: No API key configured`);
      continue;
    }

    try {
      console.log(`Trying AI provider: ${provider.name}...`);

      const response = await fetch(provider.url, {
        method: "POST",
        headers: provider.getHeaders(),
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: "system",
              content:
                "You are a professional resume writer. Generate only the resume content in clean Markdown format. No explanations or meta-commentary.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`${provider.name}: HTTP ${response.status} - ${errorText}`);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        errors.push(`${provider.name}: Empty response`);
        continue;
      }

      console.log(`Successfully generated resume using ${provider.name}`);
      return content;
    } catch (error) {
      errors.push(
        `${provider.name}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      continue;
    }
  }

  throw new Error(
    `All AI providers failed:\n${errors.join("\n")}`
  );
}
