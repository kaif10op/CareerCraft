import { NextResponse } from "next/server";
import { generateResume } from "@/lib/openrouter";
import { supabase } from "@/lib/supabase";
import { ResumeInput } from "@/types/resume";

export async function POST(request: Request) {
  try {
    const input: ResumeInput = await request.json();

    // Check for user session
    let userId: string | null = null;
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
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
      job_title: input.jobTitle,
      email: input.email,
      phone: input.phone,
      location: input.location,
      linkedin: input.linkedin,
      github: input.github,
      portfolio: input.portfolio || null,
      summary: input.summary,
      education: input.education,
      experience: input.experience,
      projects: input.projects || [],
      certifications: input.certifications || [],
      skills: input.skills,
      generated_resume: generatedResume,
    };

    if (userId) {
      resumeRecord.user_id = userId;
    }

    const { data: resume, error } = await supabase
      .from("resumes")
      .insert(resumeRecord)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Failed to save resume: ${error.message} \nDetails: ${error.details}\nHint: ${error.hint}` },
        { status: 500 }
      );
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
