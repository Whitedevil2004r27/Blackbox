'use client';

export default function PortfolioItemPage({ params }: { params: { username: string; id: string } }) {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
          <div className="h-96 bg-surface flex items-center justify-center">
            <span className="text-6xl">🎨</span>
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-text-primary">E-commerce Platform</h1>
            <p className="text-text-secondary mt-2">Web Development</p>
            <div className="mt-6 space-y-4">
              <p className="text-text-primary leading-relaxed">
                A full-featured e-commerce platform built with React, Node.js, and Stripe.
                Features include product catalog, shopping cart, checkout flow, and admin dashboard.
              </p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'Stripe', 'PostgreSQL'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-violet/20 text-violet rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <button className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors">
                  View Live
                </button>
                <button className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-void transition-colors">
                  View Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
