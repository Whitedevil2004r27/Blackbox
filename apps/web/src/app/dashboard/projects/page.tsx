'use client';

import Link from 'next/link';

const projects = [
  { id: 1, title: 'E-commerce Website', status: 'in_progress', budget: '$5,000', deadline: '2024-03-15' },
  { id: 2, title: 'Mobile App Design', status: 'open', budget: '$3,500', deadline: '2024-03-20' },
  { id: 3, title: 'Brand Identity', status: 'completed', budget: '$2,000', deadline: '2024-02-28' },
];

export default function DashboardProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">My Projects</h1>
        <Link
          href="/projects/new"
          className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
        >
          New Project
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 hover:border-cyan transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{project.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                  <span>Budget: {project.budget}</span>
                  <span>Deadline: {project.deadline}</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'in_progress'
                    ? 'bg-cyan/20 text-cyan'
                    : project.status === 'open'
                    ? 'bg-green/20 text-green'
                    : 'bg-text-muted/20 text-text-muted'
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
