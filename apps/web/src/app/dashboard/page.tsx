'use client';

import { useEffect } from 'react';
import { useSceneStore } from '@freelancex/three-scenes';
import Link from 'next/link';

const stats = [
  { label: 'Active Projects', value: '12', change: '+3', color: 'text-cyan' },
  { label: 'Pending Proposals', value: '8', change: '+2', color: 'text-violet' },
  { label: 'Total Earnings', value: '$24,500', change: '+15%', color: 'text-green' },
  { label: 'Profile Views', value: '1,234', change: '+28%', color: 'text-gold' },
];

const recentActivity = [
  { id: 1, type: 'project', title: 'New project posted: E-commerce Website', time: '2 hours ago' },
  { id: 2, type: 'proposal', title: 'Proposal accepted: Mobile App Design', time: '5 hours ago' },
  { id: 3, type: 'payment', title: 'Payment received: $3,500', time: '1 day ago' },
  { id: 4, type: 'message', title: 'New message from Sarah Chen', time: '1 day ago' },
];

export default function DashboardPage() {
  const { setCurrentView } = useSceneStore();

  useEffect(() => {
    setCurrentView('dashboard');
  }, [setCurrentView]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <p className="text-text-secondary text-sm">{stat.label}</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-3xl font-bold text-text-primary">{stat.value}</span>
              <span className={`text-sm ${stat.color}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-text-primary">{activity.title}</p>
                <p className="text-sm text-text-secondary">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-6">
        <Link
          href="/projects/new"
          className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 hover:border-cyan transition-colors"
        >
          <h3 className="text-lg font-semibold text-text-primary">Post a Project</h3>
          <p className="text-text-secondary mt-1">Find talented freelancers</p>
        </Link>
        <Link
          href="/explore"
          className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 hover:border-cyan transition-colors"
        >
          <h3 className="text-lg font-semibold text-text-primary">Find Work</h3>
          <p className="text-text-secondary mt-1">Browse available projects</p>
        </Link>
        <Link
          href="/messages"
          className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 hover:border-cyan transition-colors"
        >
          <h3 className="text-lg font-semibold text-text-primary">Messages</h3>
          <p className="text-text-secondary mt-1">Check your conversations</p>
        </Link>
      </div>
    </div>
  );
}

