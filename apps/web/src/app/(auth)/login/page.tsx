'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Lucia Auth login
    console.log('Login:', { email, password });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-star-gold">Welcome Back</h1>
          <p className="mt-2 text-text-secondary">Sign in to your FreelanceX account</p>
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

          <button
            type="submit"
            className="w-full py-3 bg-cyan text-void font-semibold rounded-lg hover:bg-cyan/90 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center space-y-2">
          <Link href="/forgot-password" className="text-sm text-cyan hover:underline">
            Forgot password?
          </Link>
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link href="/register" className="text-cyan hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-text-muted">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center py-2 border border-border rounded-lg hover:bg-void/50 transition-colors">
            <span className="text-sm text-text-secondary">Google</span>
          </button>
          <button className="flex items-center justify-center py-2 border border-border rounded-lg hover:bg-void/50 transition-colors">
            <span className="text-sm text-text-secondary">GitHub</span>
          </button>
          <button className="flex items-center justify-center py-2 border border-border rounded-lg hover:bg-void/50 transition-colors">
            <span className="text-sm text-text-secondary">LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
