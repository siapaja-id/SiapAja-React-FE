import { FeedItem, TaskStatus } from '@/src/shared/types/feed.types';
import { MOCK_AUTHORS } from './mock-authors';

export const TASK_STATUS: Record<string, TaskStatus> = {
  OPEN: 'Open' as const,
  ASSIGNED: 'Assigned' as const,
  IN_PROGRESS: 'In Progress' as const,
  COMPLETED: 'Completed' as const,
  FINISHED: 'Finished' as const,
} as const;

export const CATEGORY_ICONS: Record<string, string> = {
  'Design': 'Palette',
  'Development': 'Code',
  'Ride Hail': 'Car',
  'Delivery': 'Truck',
  'Writing': 'PenTool',
  'Repair Needed': 'Wrench',
  'Package': 'Package',
  'Location': 'MapPin',
};

export const SAMPLE_DATA: FeedItem[] = [
  {
    id: 'first-post-1',
    type: 'social',
    author: MOCK_AUTHORS[0],
    content: '🚀 Excited to announce our new platform features! Check the docs at https://docs.siapaja.com.',
    timestamp: 'Just now',
    engagement: { replies: 0, reposts: 0, shares: 0, votes: 0 },
    media: { images: ['https://picsum.photos/seed/announcement/600/400'] },
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
    engagement: { replies: 0, reposts: 0, shares: 0, votes: 0 },
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
    engagement: { replies: 5, reposts: 1, shares: 0, votes: 8 },
  }
];
