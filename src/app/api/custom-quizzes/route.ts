import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// In-memory store for demo; replace with DB in production
const quizzes: Record<string, any[]> = {};

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ quizzes: quizzes[userId] || [] });
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const quiz = await req.json();
  if (!quizzes[userId]) quizzes[userId] = [];
  quizzes[userId].push(quiz);
  return NextResponse.json({ success: true });
}
