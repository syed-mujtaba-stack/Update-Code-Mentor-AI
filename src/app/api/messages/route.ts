import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// In-memory message store for demo
const messages: Array<{ from: string; to: string; text: string; date: string }> = [];

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const withUser = url.searchParams.get('with');
  const userMessages = messages.filter(m => (m.from === userId && m.to === withUser) || (m.from === withUser && m.to === userId));
  return NextResponse.json({ messages: userMessages });
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { to, text } = await req.json();
  messages.push({ from: userId, to, text, date: new Date().toISOString() });
  return NextResponse.json({ success: true });
}
