import { ResumeInput } from "@/types/resume";

interface AIProvider {
  name: string;
  url: string;
  getHeaders: () => Record<string, string>;
  model: string;
}

const providers: AIProvider[] = [
  {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    }),
    model: "llama-3.1-8b-instant",
  },
  {
    name: "Cerebras",
    url: "https://api.cerebras.ai/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
      "Content-Type": "application/json",
    }),
    model: "llama3.1-8b",
  },
  {
    name: "Gemini API (Direct)",
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
    getHeaders: () => ({
      "Content-Type": "application/json",
    }),
    model: "gemini-2.0-flash",
  },
  {
    name: "OpenRouter (Preferred)",
    url: "https://openrouter.ai/api/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://carrier-craft.vercel.app",
      "X-Title": "Carrier Craft",
    }),
    model: process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
  },
  {
    name: "xAI (Grok)",
    url: "https://api.x.ai/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    }),
    model: "grok-2-1212",
  },
];

function buildPrompt(input: ResumeInput): string {
  const role = (input as any).role || "professional";

  const educationText = input.education && input.education.length > 0 && input.education[0].institution
    ? input.education
      .map((e) => `- ${e.degree} in ${e.field} from ${e.institution} (${e.startYear} - ${e.endYear})`)
      .join("\n")
    : "";

  const experienceText = input.experience && input.experience.length > 0 && input.experience[0].company
    ? input.experience
      .map((e) => `- ${e.position} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`)
      .join("\n")
    : "";

  const projectsText = input.projects && input.projects.length > 0 && input.projects[0].name
    ? input.projects.map(
      (p) => `- ${p.name}${p.techStack ? ` (${p.techStack})` : ""}: ${p.description}${p.link ? ` [Link](${p.link})` : ""}`
    ).join("\n")
    : "";

  const certsText = input.certifications && input.certifications.length > 0 && input.certifications[0].name
    ? input.certifications.map(
      (c) => `- ${c.name} by ${c.issuer} (${c.date})`
    ).join("\n")
    : "";

  const skillsText = input.skills && input.skills.length > 0 && input.skills[0] ? input.skills.join(", ") : "";

  // Role-specific instructions
  let roleInstructions = "";
  switch (role) {
    case "student":
      roleInstructions = `This person is a STUDENT. Emphasize education, academic projects, coursework, and skills over work experience. If no work experience is provided, focus heavily on projects, academic achievements, and extracurricular activities. Use language appropriate for early-career candidates.`;
      break;
    case "fresher":
      roleInstructions = `This person is a FRESHER / NEW GRADUATE. Emphasize education, projects, internships, and transferable skills. If work experience is limited, highlight projects and technical skills prominently. Use enthusiastic, growth-oriented language.`;
      break;
    case "freelancer":
      roleInstructions = `This person is a FREELANCER. Present their experience as client projects and independent work. Emphasize versatility, self-management, and diverse skill sets. Frame work history as engagements/contracts rather than traditional employment.`;
      break;
    case "career_changer":
      roleInstructions = `This person is a CAREER CHANGER. Emphasize transferable skills, relevant projects, and coursework/certifications in their new field. Downplay irrelevant past experience while highlighting adaptability and passion for the new career direction.`;
      break;
    default:
      roleInstructions = `This person is an experienced PROFESSIONAL. Create a traditional, polished resume emphasizing career progression, impact metrics, and leadership.`;
  }

  // Template-aware instructions
  const templateId = input.templateId || "modern";
  let templateInstructions = "";

  if (templateId.includes("sidebar") || ["tech", "academic", "hybrid", "sleek"].includes(templateId)) {
    templateInstructions = `\n**LAYOUT OPTIMIZATION (SIDEBAR):** This template uses a sidebar. Keep the summary concise (max 3-4 lines) and focus on the most impactful skills and achievements to ensure the content fits perfectly in the narrower columns. Use short, punchy bullet points.`;
  } else if (templateId === "executive" || templateId === "elegant" || templateId === "professional") {
    templateInstructions = `\n**LAYOUT OPTIMIZATION (EXECUTIVE):** This is a high-level executive template. Use sophisticated vocabulary, emphasize leadership, strategy, and bottom-line impact. The summary can be more detailed and visionary.`;
  } else if (templateId === "creative" || templateId === "functional") {
    templateInstructions = `\n**LAYOUT OPTIMIZATION (MODERN/CREATIVE):** This template uses a multi-column or modern card layout. Ensure section balance. For projects, highlight tech stacks clearly.`;
  } else if (templateId === "classic" || templateId === "simple") {
    templateInstructions = `\n**LAYOUT OPTIMIZATION (CLASSIC):** This is a traditional linear layout. Focus on chronological clarity and standard professional formatting.`;
  }

  return `You are an expert Resume Writer and ATS Optimizer. Generate a polished, professional resume in pure Markdown format for the following candidate. 
DO NOT include any conversational text, introductory thoughts, or explanations. Just output the raw Markdown.

**CRITCAL FORMATTING RULES:**
1. Use exactly \`## \` for the main section headers (e.g., \`## Professional Summary\`, \`## Work Experience\`, \`## Education\`). Do not add any extra symbols like underscores.
2. The very top of the resume MUST start with the candidate's name format like this:
# [Full Name]
[Job Title (if any)]
[Contact line with Email, Phone, LinkedIn, Location separated by bullets]

3. Do NOT use multi-level nesting (\`###\`, \`####\`) for sections. Keep structural hierarchy simple.
4. For Work Experience and Projects, output the company/title/dates as bold plain text and use standard bullet points \`- \` for the descriptions.
5. Emphasize action verbs, quantify achievements with metrics where possible, and remove fluff.
6. ONLY create headers/sections for the data explicitly provided below. If a section of data is missing or empty, DO NOT CREATE ITS HEADER at all.

${roleInstructions}
${templateInstructions}

**CANDIDATE DATA:**
- Name: ${input.fullName}
${input.jobTitle ? `- Professional Title: ${input.jobTitle}` : ""}
- Email: ${input.email}
${input.phone ? `- Phone: ${input.phone}` : ""}
${input.location ? `- Location: ${input.location}` : ""}
${input.linkedin ? `- LinkedIn: ${input.linkedin}` : ""}
${input.github ? `- GitHub: ${input.github}` : ""}
${input.portfolio ? `- Portfolio: ${input.portfolio}` : ""}

**Professional Summary Details:**
${input.summary}

${experienceText ? `**Work Experience:**\n${experienceText}\n` : ""}
${educationText ? `**Education:**\n${educationText}\n` : ""}
${projectsText ? `**Projects:**\n${projectsText}\n` : ""}
${certsText ? `**Certifications:**\n${certsText}\n` : ""}
${skillsText ? `**Skills:**\n${skillsText}\n` : ""}

Remember, output strictly Markdown and apply ATS-optimization to the candidate's raw text. Avoid excessive bolding within bullet points.`;
}

export async function generateResume(input: ResumeInput): Promise<string> {
  const prompt = buildPrompt(input);
  const errors: string[] = [];

  for (const provider of providers) {
    // Skip providers without API keys
    const hasKey =
      (provider.name.includes("OpenRouter") && !!process.env.OPENROUTER_API_KEY) ||
      (provider.name === "Groq" && !!process.env.GROQ_API_KEY) ||
      (provider.name.includes("Gemini") && !!process.env.GOOGLE_AI_KEY) ||
      (provider.name === "Cerebras" && !!process.env.CEREBRAS_API_KEY) ||
      (provider.name.includes("xAI") && !!process.env.XAI_API_KEY);

    if (!hasKey) {
      errors.push(`${provider.name}: No API key configured`);
      continue;
    }

    try {
      console.log(`Trying AI provider: ${provider.name}...`);

      let requestBody;

      // Formatting the payload based on provider
      if (provider.name.includes("Gemini API")) {
        requestBody = JSON.stringify({
          contents: [{
            parts: [{
              text: "You are a professional resume writer. Generate only the resume content in clean Markdown format. No explanations or meta-commentary.\n\n" + prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          }
        });
      } else {
        requestBody = JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: "system",
              content: "You are a professional resume writer. Generate only the resume content in clean Markdown format. No explanations or meta-commentary.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });
      }

      const response = await fetch(provider.url, {
        method: "POST",
        headers: provider.getHeaders(),
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`${provider.name}: HTTP ${response.status} - ${errorText}`);
        continue;
      }

      const data = await response.json();

      // Parsing the response based on provider
      let content;
      if (provider.name.includes("Gemini API")) {
        content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } else {
        content = data.choices?.[0]?.message?.content;
      }

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
