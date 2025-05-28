import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// In-memory store for demo; replace with DB in production
const userProgressStore: Record<string, any[]> = {};

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!userProgressStore[userId]) userProgressStore[userId] = [];
  userProgressStore[userId].push({ ...body, date: new Date().toISOString() });
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ progress: userProgressStore[userId] || [] });
}

export const dynamic = 'force-dynamic';
