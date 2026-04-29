'use client';

import { useState } from 'react';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Process withdrawal
    console.log('Withdraw:', { amount, method });
  };

  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-md mx-auto px-6">
        <h1 className="text-3xl font-bold text-star-gold mb-8">Withdraw Funds</h1>

        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 mb-6">
          <p className="text-text-secondary">Available Balance</p>
          <p className="text-4xl font-bold text-green mt-1">$12,450.00</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Withdrawal Method</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-void border border-border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="bank"
                  checked={method === 'bank'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-cyan"
                />
                <span className="text-text-primary">Bank Transfer (Chase ****1234)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-void border border-border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="stripe"
                  checked={method === 'stripe'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-cyan"
                />
                <span className="text-text-primary">Stripe Connect</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
