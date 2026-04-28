'use client';

const stats = [
  { label: 'Total Users', value: '12,450', change: '+12%' },
  { label: 'Active Projects', value: '3,280', change: '+8%' },
  { label: 'Revenue', value: '$2.4M', change: '+24%' },
  { label: 'Disputes', value: '18', change: '-5%' },
];

const recentUsers = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', role: 'freelancer', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'client', status: 'active' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'freelancer', status: 'pending' },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-star-gold mb-8">Admin Overview</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl p-6">
            <p className="text-text-secondary text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-text-primary mt-2">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green' : 'text-pink'}`}>
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Recent Users</h2>
        </div>
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-border text-sm font-medium text-text-secondary">
          <span className="col-span-2">User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {recentUsers.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-0 hover:bg-void/50 transition-colors"
          >
            <div className="col-span-2">
              <p className="text-text-primary font-medium">{user.name}</p>
              <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
            <span className="capitalize text-text-secondary">{user.role}</span>
            <span className={`capitalize ${
              user.status === 'active' ? 'text-green' : 'text-gold'
            }`}>
              {user.status}
            </span>
            <div className="flex gap-2">
              <button className="text-sm text-cyan hover:underline">Verify</button>
              <button className="text-sm text-pink hover:underline">Ban</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
