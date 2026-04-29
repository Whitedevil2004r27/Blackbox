'use client';

import { useEffect } from 'react';
import { useSceneStore } from '@freelancex/three-scenes';
import Link from 'next/link';

export default function Home() {
  const { setCurrentView } = useSceneStore();

  useEffect(() => {
    setCurrentView('explore');
  }, [setCurrentView]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-6xl md:text-7xl font-bold text-star-gold tracking-tight">
          FreelanceX
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
          Navigate the universe of freelance work in 3D. Connect with top talent, manage projects, and build your future.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/explore"
            className="px-8 py-4 bg-cyan text-void font-semibold rounded-xl hover:bg-cyan/90 transition-colors text-lg"
          >
            Explore Universe
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 border border-cyan text-cyan font-semibold rounded-xl hover:bg-cyan/10 transition-colors text-lg"
          >
            Enter Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-text-primary">Post Projects</h3>
            <p className="text-text-secondary mt-2">Find the perfect freelancer for your next big idea</p>
          </div>
          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <div className="text-4xl mb-3">💼</div>
            <h3 className="text-lg font-semibold text-text-primary">Find Work</h3>
            <p className="text-text-secondary mt-2">Discover projects that match your skills and passion</p>
          </div>
          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold text-text-primary">Collaborate</h3>
            <p className="text-text-secondary mt-2">Work together in immersive 3D workspaces</p>
          </div>
        </div>
      </div>
    </main>
  );
}

