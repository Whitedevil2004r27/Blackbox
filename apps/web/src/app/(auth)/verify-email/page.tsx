'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // TODO: Implement email verification
      setTimeout(() => setStatus('success'), 2000);
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-void">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h1 className="text-2xl font-bold text-text-primary">Verifying your email...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-void" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green">Email Verified!</h1>
            <p className="text-text-secondary">Your email has been successfully verified.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-pink rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-void" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-pink">Verification Failed</h1>
            <p className="text-text-secondary">Invalid or expired verification token.</p>
            <Link
              href="/register"
              className="inline-block px-6 py-3 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
            >
              Back to Registration
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
