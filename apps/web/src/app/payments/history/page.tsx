'use client';

const transactions = [
  { id: 1, type: 'incoming', description: 'Project payment - E-commerce Website', amount: 3500, date: '2024-01-15', status: 'completed' },
  { id: 2, type: 'outgoing', description: 'Platform fee', amount: -350, date: '2024-01-15', status: 'completed' },
  { id: 3, type: 'incoming', description: 'Milestone payment - Mobile App', amount: 2000, date: '2024-01-10', status: 'completed' },
  { id: 4, type: 'outgoing', description: 'Withdrawal to bank', amount: -5000, date: '2024-01-05', status: 'completed' },
];

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Payment History</h1>

        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-border text-sm font-medium text-text-secondary">
            <span>Date</span>
            <span className="col-span-2">Description</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-0 hover:bg-void/50 transition-colors"
            >
              <span className="text-text-secondary">{transaction.date}</span>
              <span className="col-span-2 text-text-primary">{transaction.description}</span>
              <span className={transaction.amount > 0 ? 'text-green' : 'text-text-primary'}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
              </span>
              <span className="capitalize text-text-secondary">{transaction.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
