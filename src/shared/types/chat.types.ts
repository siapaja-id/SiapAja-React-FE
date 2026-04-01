import { Author } from './auth.types';

export interface InboxThread {
  id: string;
  participants: Author[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  taskContext?: { title: string; category: string; };
}

export interface ChatMessage {
  id: string;
  sender: Author;
  content: string;
  timestamp: string;
  isMe: boolean;
}
