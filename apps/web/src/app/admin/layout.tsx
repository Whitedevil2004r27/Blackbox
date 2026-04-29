import React from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/projects', label: 'Projects', icon: '🚀' },
  { href: '/admin/payments', label: 'Payments', icon: '💰' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-void flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface/50 backdrop-blur-xl border-r border-border p-6">
        <Link href="/" className="text-2xl font-bold text-star-gold block mb-8">
          FreelanceX
        </Link>
        <div className="mb-6">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-void/50 hover:text-text-primary transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
