import React from 'react';
import { Palette, Code, Car, FileText, Truck, PenTool, Package, MapPin } from 'lucide-react';
import { Author, FeedItem, Gig, ChatMessage, InboxThread, TaskData, TaskStatus, ThemeColor, TextSize, ZoomLevel } from '@/src/shared/types/domain.type';

// ============================================================================
// TASK LIFECYCLE STATUS CONSTANTS
// ============================================================================

export const TASK_STATUS = {
  OPEN: 'Open' as const,
  ASSIGNED: 'Assigned' as const,
  IN_PROGRESS: 'In Progress' as const,
  COMPLETED: 'Completed' as const,
  FINISHED: 'Finished' as const,
} as const;

// ============================================================================
// APP SETTINGS CONSTANTS
// ============================================================================

export const STORAGE_KEY = 'siapaja-settings';

export const VALID_THEME_COLORS: ThemeColor[] = ['red', 'blue', 'emerald', 'violet', 'amber'];
export const VALID_TEXT_SIZES: TextSize[] = ['sm', 'md', 'lg'];
export const VALID_ZOOM_LEVELS: ZoomLevel[] = [90, 100, 110, 120];

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TASK_STATUS.OPEN]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [TASK_STATUS.ASSIGNED]: 'bg-blue-100 text-blue-700 border-blue-200',
  [TASK_STATUS.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TASK_STATUS.COMPLETED]: 'bg-purple-100 text-purple-700 border-purple-200',
  [TASK_STATUS.FINISHED]: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const TASK_STATUS_ORDER: TaskStatus[] = [
  TASK_STATUS.OPEN,
  TASK_STATUS.ASSIGNED,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.COMPLETED,
  TASK_STATUS.FINISHED,
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Design': <Palette size={20} />,
  'Development': <Code size={20} />,
  'Ride Hail': <Car size={20} />,
  'Delivery': <Truck size={20} />,
  'Writing': <PenTool size={20} />,
  'Repair Needed': <span>🔧</span>,
  'Package': <Package size={20} />,
  'Location': <MapPin size={20} />,
};

export const MOCK_AUTHORS: Author[] = [
  { name: 'Alice Smith', handle: 'alicesmith', avatar: 'https://picsum.photos/seed/alice/100/100', verified: false, isOnline: true },
  { name: 'Bob Jones', handle: 'bobjones', avatar: 'https://picsum.photos/seed/bob/100/100', verified: true, isOnline: true },
  { name: 'Charlie Day', handle: 'charlie_day', avatar: 'https://picsum.photos/seed/charlie/100/100', verified: false, isOnline: false },
  { name: 'Diana Prince', handle: 'diana', avatar: 'https://picsum.photos/seed/diana/100/100', verified: true, isOnline: true },
  { name: 'Evan Wright', handle: 'evanw', avatar: 'https://picsum.photos/seed/evan/100/100', verified: false, isOnline: false },
];

export const SAMPLE_DATA: FeedItem[] = [
  {
    id: 'first-post-1',
    type: 'social',
    author: MOCK_AUTHORS[0],
    content: '🚀 Excited to announce our new platform features! Check the docs at https://docs.siapaja.com.',
    timestamp: 'Just now',
    replies: 0,
    reposts: 0,
    shares: 0,
    votes: 0,
    images: ['https://picsum.photos/seed/announcement/600/400'],
    isFirstPost: true,
  },
  {
    id: 'task-empty-1',
    type: 'task',
    author: MOCK_AUTHORS[1],
    category: 'Design',
    title: 'Need a quick logo animation',
    description: 'Looking for an After Effects wizard to animate our SVG logo.',
    price: '$100-150',
    timestamp: 'Just now',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Design'],
    replies: 0,
    reposts: 0,
    shares: 0,
    votes: 0,
    isFirstTask: true,
  },
  {
    id: '2',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Ride Hail',
    title: 'Luxury Airport Transfer (T3)',
    description: 'Looking for a premium sedan for an airport drop-off.',
    price: '$45.00',
    timestamp: '15m',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Ride Hail'],
    replies: 5,
    reposts: 1,
    shares: 0,
    votes: 8,
  }
];

export const GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Minimalist Brand Identity',
    type: 'design',
    distance: 'Remote',
    time: '3 days',
    price: '$850.00',
    description: 'Create a clean, luxury brand identity for a new boutique hotel.',
    icon: <Palette size={28} />,
    tags: ['Branding', 'UI/UX'],
    clientName: 'Aura Hotels',
    clientRating: 4.9
  }
];

export const SAMPLE_CHATS: ChatMessage[] = [
  {
    id: '1',
    senderId: 'sarah',
    senderName: 'Sarah Logistics',
    senderAvatar: 'https://picsum.photos/seed/req2/100/100',
    content: "I'm at the pickup location. The package is ready!",
    timestamp: '10:24 AM',
    isMe: false
  },
  {
    id: '2',
    senderId: 'me',
    senderName: 'Me',
    senderAvatar: 'https://picsum.photos/seed/me/100/100',
    content: "Great, thanks Sarah.",
    timestamp: '10:25 AM',
    isMe: true
  }
];

export const SAMPLE_INBOX_THREADS: InboxThread[] = [
  {
    id: 'thread-1',
    participants: [MOCK_AUTHORS[1]], // Bob Jones
    lastMessage: "I'm at the pickup location. The package is ready!",
    lastMessageTime: '10:24 AM',
    unreadCount: 2,
    isOnline: true,
    taskContext: { title: 'Delivery Task', category: 'Delivery' }
  },
  {
    id: 'thread-2',
    participants: [MOCK_AUTHORS[2], MOCK_AUTHORS[3]], // Charlie, Diana
    lastMessage: "Diana: Yes, we can coordinate the ride tomorrow morning.",
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    taskContext: { title: 'Group Airport Transfer', category: 'Ride Hail' }
  },
  {
    id: 'thread-3',
    participants: [MOCK_AUTHORS[4]], // Evan Wright
    lastMessage: "Thanks for the design files. They look great!",
    lastMessageTime: 'Tue',
    unreadCount: 0,
    isOnline: false,
    taskContext: { title: 'Mobile app UI redesign', category: 'Design' }
  },
  {
    id: 'thread-4',
    participants: [MOCK_AUTHORS[0]], // Alice
    lastMessage: "Hey, are you still available for the landing page project?",
    lastMessageTime: 'Mon',
    unreadCount: 1,
    isOnline: true,
  }
];