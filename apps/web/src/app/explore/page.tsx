'use client';

import { useEffect } from 'react';
import { useSceneStore } from '@freelancex/three-scenes';
import Link from 'next/link';

const categories = [
  { id: '1', name: 'Development', color: '#00f5ff', projectCount: 42 },
  { id: '2', name: 'Design', color: '#ff2fa0', projectCount: 28 },
  { id: '3', name: 'Marketing', color: '#7b2fff', projectCount: 15 },
  { id: '4', name: 'Writing', color: '#00ff88', projectCount: 20 },
  { id: '5', name: 'Video', color: '#ffcc00', projectCount: 12 },
];

export default function ExplorePage() {
  const { setCurrentView } = useSceneStore();

  useEffect(() => {
    setCurrentView('explore');
  }, [setCurrentView]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-star-gold mb-4">Explore the Universe</h1>
        <p className="text-text-secondary text-lg">Discover freelancers and projects across the galaxy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link
          href="/explore/freelancers"
          className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-8 hover:border-cyan transition-colors text-center"
        >
          <div className="text-5xl mb-4">👨‍🚀</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Freelancers</h2>
          <p className="text-text-secondary">Browse top talent across all categories</p>
        </Link>
        <Link
          href="/explore/projects"
          className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-8 hover:border-cyan transition-colors text-center"
        >
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Projects</h2>
          <p className="text-text-secondary">Find your next exciting opportunity</p>
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-6">Popular Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 text-center hover:border-cyan transition-colors cursor-pointer"
          >
            <div
              className="w-4 h-4 rounded-full mx-auto mb-3"
              style={{ backgroundColor: category.color }}
            />
            <h3 className="font-semibold text-text-primary">{category.name}</h3>
            <p className="text-text-secondary text-sm mt-1">{category.projectCount} projects</p>
          </div>
        ))}
      </div>
    </div>
  );
}

