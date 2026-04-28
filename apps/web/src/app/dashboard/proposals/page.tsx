'use client';

const proposals = [
  { id: 1, project: 'E-commerce Website', client: 'Tech Corp', rate: '$50/hr', status: 'pending' },
  { id: 2, project: 'Mobile App Design', client: 'Startup Inc', rate: '$4,500', status: 'accepted' },
  { id: 3, project: 'Brand Identity', client: 'Design Studio', rate: '$2,000', status: 'rejected' },
];

export default function DashboardProposalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">My Proposals</h1>

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{proposal.project}</h3>
                <p className="text-text-secondary mt-1">Client: {proposal.client}</p>
                <p className="text-cyan mt-1">{proposal.rate}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proposal.status === 'accepted'
                    ? 'bg-green/20 text-green'
                    : proposal.status === 'pending'
                    ? 'bg-cyan/20 text-cyan'
                    : 'bg-pink/20 text-pink'
                }`}
              >
                {proposal.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
