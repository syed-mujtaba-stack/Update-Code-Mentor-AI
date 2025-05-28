import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// In-memory store for demo; replace with DB in production
const userProfileStore: Record<string, { bio: string; goals: string }> = {};

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(userProfileStore[userId] || {});
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { bio, goals } = await req.json();
  userProfileStore[userId] = { bio, goals };
  return NextResponse.json({ success: true });
}
