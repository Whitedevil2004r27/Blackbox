'use client';

const paymentMethods = [
  { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25' },
  { id: 2, type: 'bank', account: '****1234', bank: 'Chase' },
];

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Payments</h1>

        <div className="space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Balance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-green">$12,450.00</p>
                <p className="text-text-secondary mt-1">Available for withdrawal</p>
              </div>
              <button className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors">
                Withdraw
              </button>
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Methods</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.type === 'card' ? '💳' : '🏦'}</span>
                    <div>
                      <p className="text-text-primary">
                        {method.type === 'card' ? `${method.brand} ending in ${method.last4}` : `${method.bank} ${method.account}`}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {method.type === 'card' ? `Expires ${method.expiry}` : 'Checking account'}
                      </p>
                    </div>
                  </div>
                  <button className="text-sm text-text-secondary hover:text-cyan transition-colors">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 border border-dashed border-border rounded-lg text-text-secondary hover:border-cyan transition-colors">
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
