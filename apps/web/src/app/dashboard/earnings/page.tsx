'use client';

const earnings = [
  { month: 'Jan', amount: 4200 },
  { month: 'Feb', amount: 3800 },
  { month: 'Mar', amount: 5100 },
  { month: 'Apr', amount: 4700 },
  { month: 'May', amount: 6200 },
  { month: 'Jun', amount: 5800 },
];

export default function DashboardEarningsPage() {
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Earnings</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <p className="text-text-secondary">Total Earnings</p>
          <p className="text-3xl font-bold text-green mt-2">${totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <p className="text-text-secondary">This Month</p>
          <p className="text-3xl font-bold text-cyan mt-2">${earnings[earnings.length - 1].amount.toLocaleString()}</p>
        </div>
        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <p className="text-text-secondary">Pending</p>
          <p className="text-3xl font-bold text-gold mt-2">$1,200</p>
        </div>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Earnings History</h2>
        <div className="h-64 flex items-end gap-4">
          {earnings.map((earning) => (
            <div key={earning.month} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-cyan/50 rounded-t-lg transition-all hover:bg-cyan"
                style={{ height: `${(earning.amount / 7000) * 100}%` }}
              />
              <span className="text-sm text-text-secondary">{earning.month}</span>
              <span className="text-xs text-text-muted">${earning.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
