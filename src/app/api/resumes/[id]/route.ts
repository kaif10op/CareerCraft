import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Protection logic
    if (data.user_id) {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);

      if (!user || user.id !== data.user_id) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
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
