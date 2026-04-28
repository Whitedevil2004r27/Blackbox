'use client';

import { useState } from 'react';
import Link from 'next/link';

const results = [
  { id: 1, type: 'project', title: 'E-commerce Website', description: 'Full-stack development', budget: '$5,000' },
  { id: 2, type: 'freelancer', title: 'Alice Chen', description: 'React Developer', rate: '$50/hr' },
  { id: 3, type: 'project', title: 'Mobile App Design', description: 'UI/UX design', budget: '$3,500' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'projects' | 'freelancers'>('all');

  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Search</h1>

        <div className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, freelancers, skills..."
              className="flex-1 px-4 py-3 bg-surface/50 backdrop-blur-xl border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
            />
            <button className="px-6 py-3 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors">
              Search
            </button>
          </div>

          <div className="flex gap-2">
            {(['all', 'projects', 'freelancers'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-cyan text-void'
                    : 'bg-surface/50 text-text-secondary hover:text-text-primary'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={result.type === 'project' ? `/projects/${result.id}` : `/profile/${result.title.toLowerCase().replace(' ', '-')}`}
                className="block bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 hover:border-cyan transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.type === 'project' ? 'bg-violet/20 text-violet' : 'bg-cyan/20 text-cyan'
                      }`}>
                        {result.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">{result.title}</h3>
                    <p className="text-text-secondary">{result.description}</p>
                  </div>
                  <span className="text-cyan font-semibold">
                    {result.budget || result.rate}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
