'use client';

import { useState } from 'react';

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const [visibility, setVisibility] = useState<'public' | 'invite_only' | 'connections'>('public');

  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Project Settings</h1>

        <div className="space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Project Title</label>
                <input
                  type="text"
                  defaultValue="E-commerce Website"
                  className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea
                  rows={4}
                  defaultValue="Full-stack e-commerce platform development"
                  className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Visibility</h2>
            <div className="space-y-3">
              {(['public', 'invite_only', 'connections'] as const).map((v) => (
                <label key={v} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === v}
                    onChange={() => setVisibility(v)}
                    className="w-4 h-4 text-cyan"
                  />
                  <span className="text-text-primary capitalize">{v.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Team Members</h2>
            <div className="space-y-3">
              {['Alice Chen', 'Bob Smith', 'Charlie Davis'].map((member) => (
                <div key={member} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-text-primary">{member}</span>
                  <select className="bg-void border border-border rounded-lg px-3 py-1 text-text-secondary">
                    <option>Lead</option>
                    <option>Collaborator</option>
                    <option>Reviewer</option>
                    <option>Observer</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-pink mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary">Archive Project</p>
                <p className="text-sm text-text-secondary">Hide this project from your active list</p>
              </div>
              <button className="px-4 py-2 border border-pink text-pink rounded-lg hover:bg-pink/10 transition-colors">
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
