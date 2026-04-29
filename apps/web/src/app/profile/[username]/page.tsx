'use client';

import Link from 'next/link';

const skills = ['React', 'TypeScript', 'Node.js', 'UI Design', 'Three.js'];
const portfolio = [
  { id: 1, title: 'E-commerce Platform', category: 'Web Development' },
  { id: 2, title: 'Mobile Banking App', category: 'Mobile Design' },
  { id: 3, title: 'Brand Identity', category: 'Branding' },
];

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-cyan rounded-full flex items-center justify-center text-3xl font-bold text-void">
              AC
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-primary">Alice Chen</h1>
              <p className="text-cyan mt-1">@{params.username}</p>
              <p className="text-text-secondary mt-2">Full-stack developer specializing in React and Three.js</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-text-secondary">
                <span>⭐ 4.9 (127 reviews)</span>
                <span>📍 San Francisco, CA</span>
                <span>💰 $50-75/hr</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors">
                Contact
              </button>
              <button className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-void transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="px-4 py-2 bg-violet/20 text-violet rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Portfolio</h2>
          <div className="grid grid-cols-3 gap-4">
            {portfolio.map((item) => (
              <Link
                key={item.id}
                href={`/profile/${params.username}/portfolio/${item.id}`}
                className="bg-void border border-border rounded-xl p-4 hover:border-cyan transition-colors"
              >
                <div className="h-32 bg-surface rounded-lg mb-3" />
                <h3 className="font-medium text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
