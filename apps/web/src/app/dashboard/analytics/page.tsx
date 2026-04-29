'use client';

const analytics = {
  profileViews: [120, 150, 180, 200, 250, 300, 280],
  proposalRate: 65,
  hireRate: 42,
  responseTime: '2.5 hours',
  topSkills: ['React', 'TypeScript', 'Node.js', 'UI Design'],
};

export default function DashboardAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <p className="text-text-secondary">Proposal View Rate</p>
          <p className="text-3xl font-bold text-cyan mt-2">{analytics.proposalRate}%</p>
        </div>
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <p className="text-text-secondary">Hire Rate</p>
          <p className="text-3xl font-bold text-green mt-2">{analytics.hireRate}%</p>
        </div>
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <p className="text-text-secondary">Response Time</p>
          <p className="text-3xl font-bold text-gold mt-2">{analytics.responseTime}</p>
        </div>
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <p className="text-text-secondary">Profile Views (7d)</p>
          <p className="text-3xl font-bold text-violet mt-2">
            {analytics.profileViews.reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Profile Views (Last 7 Days)</h2>
        <div className="h-64 flex items-end gap-4">
          {analytics.profileViews.map((views, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-violet/50 rounded-t-lg transition-all hover:bg-violet"
                style={{ height: `${(views / 350) * 100}%` }}
              />
              <span className="text-sm text-text-secondary">Day {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Top Skills Searched</h2>
        <div className="flex flex-wrap gap-3">
          {analytics.topSkills.map((skill) => (
            <span key={skill} className="px-4 py-2 bg-cyan/20 text-cyan rounded-lg">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
