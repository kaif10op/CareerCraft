import { NextResponse } from "next/server";

interface AIAssistRequest {
  type: "summary" | "experience" | "skills";
  context: Record<string, string>;
}

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
    model: "google/gemini-2.5-pro",
  },
  {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    }),
    model: "llama3-8b-8192",
  },
];

function buildSystemPrompt(type: string): string {
  switch (type) {
    case "summary":
      return "You are a professional resume writer. Generate a compelling, concise professional summary (3-4 sentences) based on the user's details. Output ONLY the summary text, no extra commentary or labels. Make it powerful, action-oriented, and ATS-friendly.";
    case "experience":
      return "You are a professional resume writer. Take the user's rough description of their work experience and rewrite it as 3-5 polished, ATS-optimized bullet points. Start each with a strong action verb. Include metrics where possible. Output ONLY the bullet points (one per line, starting with •), no extra commentary.";
    case "skills":
      return "You are a career advisor. Based on the user's job title and background, suggest 8-12 highly relevant technical and soft skills. Output ONLY a comma-separated list of skills, nothing else.";
    default:
      return "You are a helpful career advisor.";
  }
}

function buildUserPrompt(type: string, context: Record<string, string>): string {
  switch (type) {
    case "summary":
      return `Write a professional summary for this person:
Job Title: ${context.jobTitle || "Not specified"}
Role Type: ${context.role || "Professional"}
Current rough notes: ${context.notes || "No notes provided"}
Key skills: ${context.skills || "Not specified"}`;

    case "experience":
      return `Rewrite these rough experience notes into polished bullet points:
Company: ${context.company || "Not specified"}
Position: ${context.position || "Not specified"}
Rough description: ${context.description || "No description provided"}`;

    case "skills":
      return `Suggest relevant skills for this profile:
Job Title: ${context.jobTitle || "Not specified"}
Role Type: ${context.role || "Professional"}
Background: ${context.background || "Not specified"}`;

    default:
      return JSON.stringify(context);
  }
}

export async function POST(request: Request) {
  try {
    const body: AIAssistRequest = await request.json();
    const { type, context } = body;

    if (!type || !context) {
      return NextResponse.json(
        { error: "Type and context are required" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(type);
    const userPrompt = buildUserPrompt(type, context);
    const errors: string[] = [];

    for (const provider of providers) {
      const hasKey =
        (provider.name === "OpenRouter" && process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "your_openrouter_api_key") ||
        (provider.name === "Groq" && process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_groq_api_key");

      if (!hasKey) {
        errors.push(`${provider.name}: No API key configured`);
        continue;
      }

      try {
        const response = await fetch(provider.url, {
          method: "POST",
          headers: provider.getHeaders(),
          body: JSON.stringify({
            model: provider.model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 500,
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

        return NextResponse.json({ result: content.trim() });
      } catch (error) {
        errors.push(`${provider.name}: ${error instanceof Error ? error.message : "Unknown error"}`);
        continue;
      }
    }

    throw new Error(`All AI providers failed:\n${errors.join("\n")}`);
  } catch (error) {
    console.error("AI Assist error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get AI response" },
      { status: 500 }
    );
  }
}
