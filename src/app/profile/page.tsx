"use client";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface UserProfile {
  bio: string;
  goals: string;
  stats: {
    totalHoursCoded: number;
    problemsSolved: number;
    projectsCompleted: number;
    streakDays: number;
  };
  skills: {
    name: string;
    level: number;
    color: string;
  }[];
  recentActivity: {
    id: string;
    type: string;
    title: string;
    date: string;
  }[];
}

const DEFAULT_PROFILE: UserProfile = {
  bio: '',
  goals: '',
  stats: {
    totalHoursCoded: 0,
    problemsSolved: 0,
    projectsCompleted: 0,
    streakDays: 0
  },
  skills: [
    { name: 'JavaScript', level: 0, color: '#F7DF1E' },
    { name: 'React', level: 0, color: '#61DAFB' },
    { name: 'Python', level: 0, color: '#3776AB' },
  ],
  recentActivity: []
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/user-profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data || DEFAULT_PROFILE);
          setLoading(false);
        });
    }
  }, [isLoaded, user]);

  const handleSave = async () => {
    await fetch('/api/user-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    alert('Profile updated!');
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-10">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600">
              {user.firstName?.[0] || user.username?.[0] || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold mb-4 text-black drop-shadow-lg">{user.fullName || user.username}</h1>
              <textarea 
                className="w-full border-2 border-fuchsia-200 focus:border-fuchsia-400 rounded-lg p-3 bg-white/80 shadow focus:outline-none transition text-black mb-4" 
                value={profile.bio} 
                onChange={e => setProfile({...profile, bio: e.target.value})} 
                placeholder="Tell us about yourself..."
                rows={2} 
              />
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600">{profile.stats.totalHoursCoded}</div>
                  <div className="text-sm text-gray-600">Hours Coded</div>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600">{profile.stats.problemsSolved}</div>
                  <div className="text-sm text-gray-600">Problems Solved</div>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600">{profile.stats.projectsCompleted}</div>
                  <div className="text-sm text-gray-600">Projects Done</div>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600">{profile.stats.streakDays}🔥</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills Progress */}
          <div className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Skills Progress</h2>
            <div className="space-y-6">
              {profile.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Learning Goals</h2>
            <textarea
              className="w-full border-2 border-pink-200 focus:border-pink-400 rounded-lg p-3 bg-white/80 shadow focus:outline-none transition text-black"
              value={profile.goals}
              onChange={e => setProfile({...profile, goals: e.target.value})}
              placeholder="What do you want to achieve?"
              rows={4}
            />
          </div>

          {/* Recent Activity */}
          <div className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Recent Activity</h2>
            {profile.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {profile.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 bg-white/50 rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
                      {activity.type === 'project' ? '📱' : activity.type === 'challenge' ? '🎯' : '📚'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No recent activity</p>
            )}
          </div>

          {/* Save Button */}
          <div className="col-span-full flex justify-center">
            <button 
              className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-fuchsia-300 transition-all duration-200" 
              onClick={handleSave}
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
