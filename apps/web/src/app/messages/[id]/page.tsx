'use client';

import { useState } from 'react';

const messages = [
  { id: 1, sender: 'Alice Chen', content: 'Hi! I saw your project posting.', time: '10:00 AM', isMe: false },
  { id: 2, sender: 'Me', content: 'Hello! Thanks for reaching out.', time: '10:05 AM', isMe: true },
  { id: 3, sender: 'Alice Chen', content: 'I have experience with similar projects.', time: '10:10 AM', isMe: false },
  { id: 4, sender: 'Me', content: 'That sounds great! Can we schedule a call?', time: '10:15 AM', isMe: true },
];

export default function ConversationPage({ params }: { params: { id: string } }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // TODO: Send message via API
    console.log('Send message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-void flex flex-col">
      {/* Header */}
      <div className="bg-surface/50 backdrop-blur-xl border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan rounded-full flex items-center justify-center font-bold text-void">
            A
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Alice Chen</h2>
            <p className="text-sm text-green">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-xl ${
                  message.isMe
                    ? 'bg-cyan text-void'
                    : 'bg-surface border border-border text-text-primary'
                }`}
              >
                <p>{message.content}</p>
                <span className={`text-xs ${message.isMe ? 'text-void/70' : 'text-text-muted'}`}>
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-surface/50 backdrop-blur-xl border-t border-border p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
