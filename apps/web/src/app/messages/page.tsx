'use client';

import { useEffect } from 'react';
import { useSceneStore } from '@freelancex/three-scenes';
import Link from 'next/link';

const conversations = [
  { id: '1', name: 'Project Alpha Team', lastMessage: 'Great progress on the dashboard!', time: '2m ago', unread: 3 },
  { id: '2', name: 'Sarah Chen', lastMessage: 'When can we schedule a call?', time: '1h ago', unread: 0 },
  { id: '3', name: 'Design Collective', lastMessage: 'Logo concepts are ready', time: '3h ago', unread: 1 },
  { id: '4', name: 'Mike Ross', lastMessage: 'Invoice sent for last milestone', time: '1d ago', unread: 0 },
];

export default function MessagesPage() {
  const { setCurrentView } = useSceneStore();

  useEffect(() => {
    setCurrentView('communications');
  }, [setCurrentView]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-star-gold mb-8">Messages</h1>

      <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-void/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-semibold">
              {conversation.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">{conversation.name}</h3>
                <span className="text-sm text-text-muted">{conversation.time}</span>
              </div>
              <p className="text-text-secondary text-sm mt-1">{conversation.lastMessage}</p>
            </div>
            {conversation.unread > 0 && (
              <span className="bg-cyan text-void text-xs font-bold px-2 py-1 rounded-full">
                {conversation.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

