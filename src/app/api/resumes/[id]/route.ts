import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("Authorization");

    // Use a fresh client with the user's token if available
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

    const { data, error } = await dbClient
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (data.user_id) {
      if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.length <= 7) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      const token = authHeader.substring(7);
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authData?.user || authData.user.id !== data.user_id) {
          console.error("Auth error in individual resume fetch:", authError);
          return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }
      } catch (err) {
        console.error("Unexpected auth crash in individual resume fetch:", err);
        return NextResponse.json({ error: "Authentication service error." }, { status: 403 });
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
