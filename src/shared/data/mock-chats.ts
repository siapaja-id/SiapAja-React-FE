import { ChatMessage, InboxThread } from '@/src/shared/types/chat.types';
import { MOCK_AUTHORS } from './mock-authors';

export const SAMPLE_CHATS: ChatMessage[] = [
  {
    id: '1',
    sender: { name: 'Sarah Logistics', handle: 'sarah', avatar: 'https://picsum.photos/seed/req2/100/100' },
    content: "I'm at the pickup location. The package is ready!",
    timestamp: '10:24 AM',
    isMe: false
  },
  {
    id: '2',
    sender: { name: 'Me', handle: 'me', avatar: 'https://picsum.photos/seed/me/100/100' },
    content: "Great, thanks Sarah.",
    timestamp: '10:25 AM',
    isMe: true
  }
];

export const SAMPLE_INBOX_THREADS: InboxThread[] = [
  {
    id: 'thread-1',
    participants: [MOCK_AUTHORS[1]],
    lastMessage: "I'm at the pickup location. The package is ready!",
    lastMessageTime: '10:24 AM',
    unreadCount: 2,
    isOnline: true,
    taskContext: { title: 'Delivery Task', category: 'Delivery' }
  },
  {
    id: 'thread-2',
    participants: [MOCK_AUTHORS[2], MOCK_AUTHORS[3]],
    lastMessage: "Diana: Yes, we can coordinate the ride tomorrow morning.",
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    taskContext: { title: 'Group Airport Transfer', category: 'Ride Hail' }
  },
  {
    id: 'thread-3',
    participants: [MOCK_AUTHORS[4]],
    lastMessage: "Thanks for the design files. They look great!",
    lastMessageTime: 'Tue',
    unreadCount: 0,
    isOnline: false,
    taskContext: { title: 'Mobile app UI redesign', category: 'Design' }
  },
  {
    id: 'thread-4',
    participants: [MOCK_AUTHORS[0]],
    lastMessage: "Hey, are you still available for the landing page project?",
    lastMessageTime: 'Mon',
    unreadCount: 1,
    isOnline: true,
  }
];
