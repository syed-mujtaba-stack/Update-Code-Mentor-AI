"use client";
import { useUser } from '@clerk/nextjs';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  // For demo, only allow a specific user (replace with real admin logic)
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === 'admin@example.com';

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;
  if (!isAdmin) return <div className="text-red-600 font-bold">Access denied. Admins only.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-100">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <p className="mb-4">Welcome, admin! Here you can manage users, quizzes, and review flagged content. (Feature coming soon)</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>View all users</li>
          <li>Review flagged questions/answers</li>
          <li>Manage daily challenges</li>
          <li>Site analytics</li>
        </ul>
      </div>
    </div>
  );
}
