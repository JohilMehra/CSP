// created new file
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { topic, difficulty, numQuestions } = await req.json();

    if (!topic || !difficulty || !numQuestions) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const prompt = `Generate a ${difficulty} difficulty quiz about "${topic}" with exactly ${numQuestions} multiple choice questions. 
    Format the response as JSON with the following structure:
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
          "explanation": "Brief explanation"
        }
      ]
    }
    Only return valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to extract JSON
    let cleanText = text.trim();
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    cleanText = cleanText.replace(/^\s*\{/, '{').replace(/\}\s*$/, '}');
    
    // Parse the JSON response
    const quizData = JSON.parse(cleanText);
    
    return NextResponse.json({ quiz: quizData });

  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

