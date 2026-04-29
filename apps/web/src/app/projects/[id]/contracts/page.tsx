'use client';

export default function ProjectContractsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Contract</h1>

        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">Project Contract</h2>
            <span className="px-3 py-1 bg-cyan/20 text-cyan rounded-full text-sm font-medium">
              Draft
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Project Title</label>
              <input
                type="text"
                value="E-commerce Website"
                readOnly
                className="w-full px-4 py-3 bg-void border border-border rounded-lg text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Freelancer</label>
              <input
                type="text"
                value="Alice Chen"
                readOnly
                className="w-full px-4 py-3 bg-void border border-border rounded-lg text-text-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Rate</label>
                <input
                  type="text"
                  value="$50/hr"
                  readOnly
                  className="w-full px-4 py-3 bg-void border border-border rounded-lg text-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                <input
                  type="text"
                  value="Hourly"
                  readOnly
                  className="w-full px-4 py-3 bg-void border border-border rounded-lg text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Terms & Conditions</label>
              <textarea
                rows={8}
                className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
                placeholder="Enter contract terms..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-void transition-colors">
              Save Draft
            </button>
            <button className="flex-1 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors">
              Send for Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
