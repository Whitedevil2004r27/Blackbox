'use client';

import Link from 'next/link';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-star-gold">Project Details</h1>
          <span className="px-3 py-1 bg-cyan/20 text-cyan rounded-full text-sm font-medium">
            In Progress
          </span>
        </div>

        <div className="space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">E-commerce Website</h2>
            <p className="text-text-secondary leading-relaxed">
              We need a full-stack developer to build a modern e-commerce platform with React, Node.js, and Stripe integration.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="px-3 py-1 bg-violet/20 text-violet rounded-lg text-sm">React</span>
              <span className="px-3 py-1 bg-violet/20 text-violet rounded-lg text-sm">Node.js</span>
              <span className="px-3 py-1 bg-violet/20 text-violet rounded-lg text-sm">Stripe</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
              <p className="text-text-secondary text-sm">Budget</p>
              <p className="text-2xl font-bold text-green mt-1">$5,000</p>
            </div>
            <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
              <p className="text-text-secondary text-sm">Duration</p>
              <p className="text-2xl font-bold text-cyan mt-1">30 days</p>
            </div>
            <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
              <p className="text-text-secondary text-sm">Proposals</p>
              <p className="text-2xl font-bold text-violet mt-1">12</p>
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Actions</h3>
            <div className="flex gap-4">
              <Link
                href={`/projects/${params.id}/workspace`}
                className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
              >
                Workspace
              </Link>
              <Link
                href={`/projects/${params.id}/proposals`}
                className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-void transition-colors"
              >
                View Proposals
              </Link>
              <Link
                href={`/projects/${params.id}/contracts`}
                className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-void transition-colors"
              >
                Contract
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
