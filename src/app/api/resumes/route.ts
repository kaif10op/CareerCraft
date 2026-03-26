import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.length <= 7) {
    return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  let user;

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      console.error("Auth error in resumes list:", authError);
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
    }
    user = authData.user;
  } catch (err) {
    console.error("Unexpected auth crash in resumes list:", err);
    return NextResponse.json({ error: "Authentication service error." }, { status: 401 });
  }

  try {
    // Create a client with the user's token to respect RLS
    const dbClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Fetch resumes - RLS will handle security, but we add eq for safety
    const { data, error } = await dbClient
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch resumes" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
