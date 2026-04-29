export interface Conversation {
  id: string;
  type: 'direct' | 'project' | 'group';
  projectId: string | null;
  name: string | null;
  avatarUrl: string | null;
  createdBy: string;
  lastMessageAt: Date | null;
  createdAt: Date;
}

export interface ConversationMember {
  conversationId: string;
  userId: string;
  isAdmin: boolean;
  unreadCount: number;
  lastReadAt: Date | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'video' | 'system' | 'contract_request' | 'payment_request';
  metadata: Record<string, unknown>;
  isEdited: boolean;
  replyToId: string | null;
  reactions: Record<string, string[]>;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string | null;
  body: string | null;
  data: Record<string, unknown>;
  readAt: Date | null;
  createdAt: Date;
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}
