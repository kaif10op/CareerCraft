import { ResumeInput } from "@/types/resume";

export interface AIAssistContext {
    jobTitle?: string;
    role?: string;
    notes?: string;
    skills?: string;
    company?: string;
    position?: string;
    description?: string;
    background?: string;
    name?: string;
    techStack?: string;
    field?: string;
    [key: string]: string | undefined;
}

export interface AIAssistRequest {
    type: "summary" | "experience" | "skills" | "projects" | "certifications" | "job_titles";
    context: AIAssistContext;
}

interface AIProvider {
    name: string;
    url: string;
    getHeaders: () => Record<string, string>;
    model: string;
}

const providers: AIProvider[] = [
    {
        name: "Cerebras (Fastest)",
        url: "https://api.cerebras.ai/v1/chat/completions",
        getHeaders: () => ({
            Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
            "Content-Type": "application/json",
        }),
        model: "llama3.1-8b",
    },
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
        name: "OpenRouter",
        url: "https://openrouter.ai/api/v1/chat/completions",
        getHeaders: () => ({
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://carrier-craft.vercel.app",
            "X-Title": "Carrier Craft",
        }),
        model: "meta-llama/llama-3.3-70b-instruct:free",
    },
    {
        name: "Gemini API (Direct)",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
        getHeaders: () => ({
            "Content-Type": "application/json",
        }),
        model: "gemini-1.5-flash",
    },
];

export function buildSystemPrompt(type: string): string {
    switch (type) {
        case "summary":
            return "You are a professional resume writer. Generate a compelling, concise professional summary (3-4 sentences) based on the user's details. Output ONLY the summary text, no extra commentary or labels. Make it powerful, action-oriented, and ATS-friendly.";
        case "experience":
            return "You are a professional resume writer. Take the user's rough description of their work experience and rewrite it as 3-5 polished, ATS-optimized bullet points. Start each with a strong action verb. Include metrics where possible. Output ONLY the bullet points (one per line, starting with •), no extra commentary.";
        case "skills":
            return "You are a career advisor. Based on the user's job title and background, suggest 8-12 highly relevant technical and soft skills. Output ONLY a comma-separated list of skills, nothing else.";
        case "projects":
            return "You are a technical resume writer. Rewrite the user's project description to highlight technical challenges, solutions, and impact. Use strong action verbs. Output ONLY 2-3 polished bullet points starting with •.";
        case "certifications":
            return "You are a career counselor. Based on the user's field and title, suggest 5 highly recognized industry certifications they could add. Output ONLY a comma-separated list of certification names.";
        case "job_titles":
            return "You are a career consultant. Suggest 5 modern, professional job titles that fit the candidate's role and background. Output ONLY a comma-separated list of titles.";
        default:
            return "You are a helpful career advisor.";
    }
}

export function buildUserPrompt(type: string, context: AIAssistContext): string {
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

        case "projects":
            return `Polish this project description:
Project Name: ${context.name}
Tech Stack: ${context.techStack}
Rough description: ${context.description}`;

        case "certifications":
            return `Suggest 5 certifications for a candidate in this field:
Field/Industry: ${context.field || context.jobTitle || "Professional"}`;

        case "job_titles":
            return `Brainstorm 5 job titles for a candidate who identifies as: ${context.role}. 
They currently listed their target title as: ${context.jobTitle || "None yet"}`;

        default:
            return JSON.stringify(context);
    }
}

export async function getAIAssistResponse(type: AIAssistRequest["type"], context: AIAssistContext): Promise<string> {
    const systemPrompt = buildSystemPrompt(type);
    const userPrompt = buildUserPrompt(type, context);
    const errors: string[] = [];

    for (const provider of providers) {
        const hasKey =
            (provider.name.includes("OpenRouter") && !!process.env.OPENROUTER_API_KEY) ||
            (provider.name === "Groq" && !!process.env.GROQ_API_KEY) ||
            (provider.name.includes("Gemini") && !!process.env.GOOGLE_AI_KEY) ||
            (provider.name === "Cerebras" && !!process.env.CEREBRAS_API_KEY);

        if (!hasKey) {
            errors.push(`${provider.name}: No API key configured`);
            continue;
        }

        try {
            let requestBody;

            if (provider.name.includes("Gemini API")) {
                requestBody = JSON.stringify({
                    contents: [{
                        parts: [{
                            text: systemPrompt + "\n\n" + userPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                });
            } else {
                requestBody = JSON.stringify({
                    model: provider.model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
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

            return content.trim();
        } catch (error) {
            errors.push(`${provider.name}: ${error instanceof Error ? error.message : "Unknown error"}`);
            continue;
        }
    }

    throw new Error(`All AI providers failed:\n${errors.join("\n")}`);
}
