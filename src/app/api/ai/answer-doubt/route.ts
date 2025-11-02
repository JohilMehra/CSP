import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // 1️⃣ Validate input
    if (!question) {
      return NextResponse.json(
        { error: "Question is required in the request body." },
        { status: 400 }
      );
    }

    // 2️⃣ Securely load API key (no NEXT_PUBLIC!)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error: Missing AI key." },
        { status: 500 }
      );
    }

    // 3️⃣ Initialize Gemini (compatible with SDK v0.24.1)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4️⃣ Construct a clean prompt
    const prompt = `
You are a patient and knowledgeable tutor.
Explain the following concept in detail with these sections:
1. 🔹 Key Points
2. 📘 Detailed Explanation (with example)
3. 🧭 Summary
---
Question: ${question}
`;

    // 5️⃣ Generate the explanation
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // 6️⃣ Remove unnecessary formatting or markdown
    text = text.replace(/^```[a-z]*\s*|```$/gi, "").trim();

    // 7️⃣ Return structured JSON response
    return NextResponse.json({ answer: text });

  } catch (error: any) {
    console.error("❌ AI Tutor Route Error:", error);
    return NextResponse.json(
      { error: error.message || "AI tutor failed to process the request." },
      { status: 500 }
    );
  }
}
