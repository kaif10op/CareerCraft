import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateResume } from "@/lib/openrouter";
import { supabase } from "@/lib/supabase";
import { appCache } from "@/lib/cache";
import { ResumeInput } from "@/types/resume";

export async function POST(request: Request) {
  try {
    const input: ResumeInput = await request.json();

    // Check for user session
    let userId: string | null = null;
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ") && authHeader.length > 7) {
      const token = authHeader.substring(7);
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authData?.user) {
          console.error("Auth error during generation:", authError);
          const message = authError?.message || "Invalid or expired session. Please try signing out and back in.";
          return NextResponse.json(
            { error: `Authentication Error: ${message}` },
            { status: 401 }
          );
        }
        userId = authData.user.id;
      } catch (err) {
        console.error("Unexpected auth crash:", err);
        return NextResponse.json(
          { error: "Authentication service error. Please try again." },
          { status: 401 }
        );
      }
    }

    // Validate required fields
    if (!input.fullName || !input.email) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    // Generate resume using AI (with multi-provider fallback)
    const generatedResume = await generateResume(input);

    // Save to Supabase
    // Build database record
    const resumeRecord: any = {
      full_name: input.fullName,
      job_title: input.jobTitle || "",
      email: input.email,
      phone: input.phone || "",
      location: input.location || "",
      linkedin: input.linkedin || "",
      github: input.github || "",
      portfolio: input.portfolio || "",
      summary: input.summary || "",
      education: input.education || [],
      experience: input.experience || [],
      projects: input.projects || [],
      certifications: input.certifications || [],
      skills: input.skills || [],
      generated_resume: generatedResume,
      template_id: input.templateId || "modern",
      user_id: userId, // Explicitly set even if null
    };

    // Initialize a new Supabase client with the user's auth token for this request
    const dbClient = authHeader
      ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: authHeader,
            },
          },
        }
      )
      : supabase;

    const { data: resume, error } = await dbClient
      .from("resumes")
      .insert(resumeRecord)
      .select()
      .single();

    if (error) {
      console.error("Supabase error during insert:", error);
      return NextResponse.json(
        { error: `Database Error: ${error.message}. Please check if you are logged in correctly.` },
        { status: 500 }
      );
    }

    if (userId) {
      appCache.invalidate(`resumes_list_${userId}`);
    }

    return NextResponse.json({ id: resume.id, resume: generatedResume });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate resume",
      },
      { status: 500 }
    );
  }
}
