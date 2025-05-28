import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// In-memory achievements for demo; replace with DB in production
const achievementsStore: Record<string, string[]> = {
  'user1': ['Quiz Master', 'Viva Pro'],
  'user2': ['First Quiz'],
};

const ALL_ACHIEVEMENTS = [
  'First Quiz',
  'Quiz Master',
  'Viva Pro',
  'Project Champ',
  'Streak Starter',
  'Daily Learner',
];

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userAchievements = achievementsStore[userId] || [];
  return NextResponse.json({ achievements: userAchievements, all: ALL_ACHIEVEMENTS });
}

// For demo: allow adding an achievement
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { achievement } = await req.json();
  if (!achievementsStore[userId]) achievementsStore[userId] = [];
  if (!achievementsStore[userId].includes(achievement)) {
    achievementsStore[userId].push(achievement);
  }
  return NextResponse.json({ success: true });
}
