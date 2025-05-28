import { NextRequest, NextResponse } from 'next/server';

// In-memory leaderboard for demo; replace with DB in production
let leaderboard = [
  { user: 'Alice', score: 95 },
  { user: 'Bob', score: 88 },
  { user: 'Charlie', score: 80 },
];

export async function GET() {
  // Sort by score descending
  leaderboard = leaderboard.sort((a, b) => b.score - a.score);
  return NextResponse.json({ leaderboard });
}

// For demo: allow posting a new score
export async function POST(req: NextRequest) {
  const { user, score } = await req.json();
  leaderboard.push({ user, score });
  return NextResponse.json({ success: true });
}
