'use client';

import Link from 'next/link';

const freelancers = [
  { id: 1, name: 'Alice Chen', skills: ['React', 'TypeScript'], rate: '$50/hr', rating: 4.9 },
  { id: 2, name: 'Bob Smith', skills: ['UI Design', 'Figma'], rate: '$65/hr', rating: 4.7 },
  { id: 3, name: 'Charlie Davis', skills: ['Node.js', 'Python'], rate: '$45/hr', rating: 4.8 },
];

export default function ExploreFreelancersPage() {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Browse Freelancers</h1>

        <div className="grid grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <Link
              key={freelancer.id}
              href={`/profile/${freelancer.name.toLowerCase().replace(' ', '-')}`}
              className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 hover:border-cyan transition-colors"
            >
              <div className="w-16 h-16 bg-cyan rounded-full flex items-center justify-center text-2xl font-bold text-void mb-4">
                {freelancer.name.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold text-text-primary">{freelancer.name}</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {freelancer.skills.map((skill) => (
                  <span key={skill} className="text-xs bg-violet/20 text-violet px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-cyan font-semibold">{freelancer.rate}</span>
                <span className="text-gold">⭐ {freelancer.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
