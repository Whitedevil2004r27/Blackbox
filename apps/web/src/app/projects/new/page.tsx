'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [type, setType] = useState<'fixed' | 'hourly' | 'milestone'>('fixed');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Create project via API
    console.log('Create project:', { title, description, budget, type });
    router.push('/dashboard/projects');
  };

  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Post a New Project</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-8">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="e.g., E-commerce Website Development"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="Describe your project in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Project Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(['fixed', 'hourly', 'milestone'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-3 px-4 rounded-lg border transition-colors ${
                    type === t
                      ? 'bg-cyan text-void border-cyan'
                      : 'bg-void text-text-secondary border-border hover:border-cyan'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Budget</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="e.g., 5000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Required Skills</label>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Python', 'Design', 'Writing'].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="px-3 py-1 border border-border rounded-lg text-text-secondary hover:border-cyan hover:bg-cyan/10 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-border rounded-lg text-text-secondary hover:bg-void transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
