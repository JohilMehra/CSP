// src/app/api/ai/generate-quiz/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface QuizRequest {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number;
}

export async function POST(req: Request) {
  try {
    const { topic, difficulty, numQuestions }: QuizRequest = await req.json();

    // 1️⃣ Input Validation
    if (!topic || !difficulty || !numQuestions) {
      return NextResponse.json(
        { error: "Missing required fields: topic, difficulty, and numQuestions." },
        { status: 400 }
      );
    }

    // 2️⃣ Load API Key (must be on the server, not public)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error: Missing API key." },
        { status: 500 }
      );
    }

    // 3️⃣ Initialize Gemini client (SDK v0.24.1)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4️⃣ Prompt for quiz generation
    const prompt = `
    Generate a ${difficulty} quiz about "${topic}" with exactly ${numQuestions} multiple choice questions.
    Format the response strictly as JSON with this structure:
    {
      "title": "Quiz Title",
      "topic": "${topic}",
      "difficulty": "${difficulty}",
      "questions": [
        {
          "id": 1,
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Brief explanation of the answer"
        }
      ]
    }
    Return only valid JSON — no explanations, markdown, or comments.
    `;

    // 5️⃣ Generate response
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 6️⃣ Clean and parse response
    const cleanText = text.replace(/```json|```/g, "").trim();
    let quizData;
    try {
      quizData = JSON.parse(cleanText);
    } catch (err) {
      console.error("⚠️ Failed to parse JSON:", cleanText);
      throw new Error("AI returned invalid JSON format.");
    }

    // 7️⃣ Return quiz JSON
    return NextResponse.json({ quiz: quizData });

  } catch (error: any) {
    console.error("❌ Error generating quiz:", error.message);
    return NextResponse.json(
      { error: `Failed to generate quiz: ${error.message}` },
      { status: 500 }
    );
  }
}
