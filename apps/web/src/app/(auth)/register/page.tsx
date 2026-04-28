'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'freelancer' | 'client' | 'both'>('freelancer');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Implement Lucia Auth registration
    console.log('Register:', { email, username, password, role });
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-star-gold">Join FreelanceX</h1>
          <p className="mt-2 text-text-secondary">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {(['freelancer', 'client', 'both'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-lg border transition-colors ${
                    role === r
                      ? 'bg-cyan text-void border-cyan'
                      : 'bg-void text-text-secondary border-border hover:border-cyan'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan text-void font-semibold rounded-lg hover:bg-cyan/90 transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
