'use client';

import { useState } from 'react';

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'border-text-muted' },
  { id: 'todo', title: 'To Do', color: 'border-cyan' },
  { id: 'in_progress', title: 'In Progress', color: 'border-violet' },
  { id: 'review', title: 'Review', color: 'border-gold' },
  { id: 'done', title: 'Done', color: 'border-green' },
];

const initialTasks = [
  { id: 1, title: 'Design homepage', status: 'in_progress', assignee: 'Alice', priority: 'high' },
  { id: 2, title: 'Setup database', status: 'todo', assignee: 'Bob', priority: 'high' },
  { id: 3, title: 'API endpoints', status: 'backlog', assignee: 'Charlie', priority: 'medium' },
  { id: 4, title: 'User authentication', status: 'review', assignee: 'Alice', priority: 'urgent' },
  { id: 5, title: 'Project setup', status: 'done', assignee: 'Bob', priority: 'low' },
];

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = useState(initialTasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-pink text-void';
      case 'high': return 'bg-gold text-void';
      case 'medium': return 'bg-cyan text-void';
      default: return 'bg-text-muted text-void';
    }
  };

  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-star-gold">Project Workspace</h1>
          <button className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors">
            + New Task
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`flex-shrink-0 w-80 bg-surface/50 backdrop-blur-xl border-t-4 ${column.color} rounded-xl p-4`}
            >
              <h3 className="font-semibold text-text-primary mb-4 flex items-center justify-between">
                {column.title}
                <span className="text-sm text-text-muted">
                  {tasks.filter((t) => t.status === column.id).length}
                </span>
              </h3>

              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-void border border-border rounded-lg p-4 hover:border-cyan transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium text-text-primary">{task.title}</h4>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-sm text-text-secondary">{task.assignee}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
