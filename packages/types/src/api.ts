export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  q?: string;
  skills?: string[];
  rateMin?: number;
  rateMax?: number;
  availability?: string;
  category?: string;
  location?: string;
  rating?: number;
}

export interface SocketEvents {
  client: {
    join_conversation: { conversationId: string };
    leave_conversation: { conversationId: string };
    typing_start: { conversationId: string };
    typing_stop: { conversationId: string };
    send_message: { conversationId: string; content: string; type: string; metadata?: Record<string, unknown> };
    join_project_room: { projectId: string };
    task_move: { taskId: string; status: string; position: number };
    cursor_move: { projectId: string; x: number; y: number };
    presence_update: { status: string };
  };
  server: {
    new_message: { message: Message };
    user_typing: { userId: string; conversationId: string };
    user_stopped_typing: { userId: string; conversationId: string };
    task_updated: { task: unknown };
    member_joined: { user: unknown; projectId: string };
    member_left: { user: unknown; projectId: string };
    notification: { notification: Notification };
    online_status: { userId: string; isOnline: boolean };
    payment_status: { paymentId: string; status: string };
    cursor_position: { userId: string; x: number; y: number; projectId: string };
  };
}

import type { Message } from './message';
import type { Notification } from './message';
