// src/app/api/discussions/route.ts
import { NextResponse } from "next/server";

// Temporary in-memory data (resets on server restart)
let threads: any[] = [];

export async function GET() {
  console.log("📥 GET /api/discussions");
  return NextResponse.json(threads);
}

export async function POST(req: Request) {
  try {
    console.log("📤 POST /api/discussions triggered");

    const { title, content, topic, author } = await req.json();

    // Validate required fields
    if (!title || !content || !topic || !author) {
      console.error("❌ Missing fields:", { title, content, topic, author });
      return NextResponse.json(
        { error: "All fields (title, content, topic, author) are required." },
        { status: 400 }
      );
    }

    const newThread = {
      id: Date.now().toString(),
      title,
      content,
      topic,
      author,
      replies: 0,
      upvotes: 0,
      views: 0,
      pinned: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    // Add new thread to list
    threads.unshift(newThread);

    console.log("✅ Thread created successfully:", newThread);

    return NextResponse.json(newThread, { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error creating thread:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
