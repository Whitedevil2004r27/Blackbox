'use client';

import Link from 'next/link';

const projects = [
  { id: 1, title: 'E-commerce Website', budget: '$5,000', type: 'fixed', skills: ['React', 'Node.js'], proposals: 12 },
  { id: 2, title: 'Mobile App Design', budget: '$3,500', type: 'fixed', skills: ['UI Design', 'Figma'], proposals: 8 },
  { id: 3, title: 'API Development', budget: '$75/hr', type: 'hourly', skills: ['Python', 'FastAPI'], proposals: 5 },
];

export default function ExploreProjectsPage() {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Browse Projects</h1>

        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 hover:border-cyan transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.skills.map((skill) => (
                      <span key={skill} className="text-xs bg-violet/20 text-violet px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-cyan font-semibold text-lg">{project.budget}</p>
                  <p className="text-sm text-text-secondary capitalize">{project.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-text-secondary">
                <span>{project.proposals} proposals</span>
                <span>•</span>
                <span>Posted 2 days ago</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
