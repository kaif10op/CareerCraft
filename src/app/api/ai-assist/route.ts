import { NextResponse } from "next/server";
import { AIAssistRequest, getAIAssistResponse } from "@/lib/ai-assist";

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

    const result = await getAIAssistResponse(type, context);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI Assist error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get AI response" },
      { status: 500 }
    );
  }
}
