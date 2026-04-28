'use client';

import { useState } from 'react';

export default function DashboardSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Settings</h1>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-text-primary">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="Tell us about yourself"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-text-primary">Notification Preferences</h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-text-primary capitalize">{key} Notifications</span>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-cyan' : 'bg-border'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Danger Zone</h2>
        <button className="px-6 py-2 bg-pink/20 text-pink rounded-lg hover:bg-pink/30 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
