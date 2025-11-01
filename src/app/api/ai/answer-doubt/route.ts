import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Explain this doubt like a tutor with points, example, and summary:\n${question}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```/g, "");

    return NextResponse.json({ answer: text });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI doubt solver failed" },
      { status: 500 }
    );
  }
}
