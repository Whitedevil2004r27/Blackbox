'use client';

const proposals = [
  { id: 1, freelancer: 'Alice Chen', rate: '$50/hr', days: 30, coverLetter: 'I have 5 years of experience...', status: 'pending' },
  { id: 2, freelancer: 'Bob Smith', rate: '$45/hr', days: 25, coverLetter: 'I specialize in e-commerce...', status: 'shortlisted' },
  { id: 3, freelancer: 'Carol Wu', rate: '$55/hr', days: 35, coverLetter: 'I built similar platforms...', status: 'pending' },
];

export default function ProjectProposalsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Project Proposals</h1>

        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{proposal.freelancer}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-text-secondary">
                    <span>Rate: {proposal.rate}</span>
                    <span>Duration: {proposal.days} days</span>
                  </div>
                  <p className="text-text-secondary mt-3">{proposal.coverLetter}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    proposal.status === 'shortlisted'
                      ? 'bg-cyan/20 text-cyan'
                      : 'bg-text-muted/20 text-text-muted'
                  }`}
                >
                  {proposal.status}
                </span>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-cyan text-void rounded-lg text-sm font-medium hover:bg-cyan/90 transition-colors">
                  Accept
                </button>
                <button className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-void transition-colors">
                  Shortlist
                </button>
                <button className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-void transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
