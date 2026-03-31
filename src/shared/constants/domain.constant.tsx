import React from 'react';
import { Palette, Code, Car, FileText, Truck, PenTool, Package, MapPin } from 'lucide-react';
import { Author, FeedItem, Gig, ChatMessage, TaskData, TaskStatus, ThemeColor, TextSize, ZoomLevel } from '@/src/shared/types/domain.type';

// ============================================================================
// TASK LIFECYCLE STATUS CONSTANTS
// Domain constants for various task lifecycle stages
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
  // ============================================================================
  // FIRST POST / TASK (Special markers for empty states)
  // ============================================================================
  {
    id: 'first-post-1',
    type: 'social',
    author: MOCK_AUTHORS[0],
    content: '🚀 Excited to announce our new platform features! Check the docs at https://docs.siapaja.com. We\'ve been working hard on making the experience better for everyone. What do you think @bobjones? #updates #newfeatures \n\nP.S. The new secret code is ||launch2025||.',
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
    description: 'Looking for an After Effects wizard to animate our SVG logo. Just a simple 3-second reveal. Need it by tomorrow! Call me at 555-019-8372 if you have questions.',
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

  // ============================================================================
  // SOCIAL POSTS
  // ============================================================================
  {
    id: 'social-empty-1',
    type: 'social',
    author: MOCK_AUTHORS[4],
    content: 'Taking a break from coding to enjoy this beautiful sunset. Sometimes you just need to step away from the screen! 🌅',
    timestamp: '2m',
    replies: 0,
    reposts: 0,
    shares: 0,
    votes: 5,
  },
  {
    id: 'thread-1',
    type: 'social',
    author: MOCK_AUTHORS[3],
    content: 'Designing for the future requires rethinking our foundational assumptions. A short thread on my recent learnings. 🧵',
    timestamp: '1h',
    replies: 2,
    reposts: 12,
    shares: 4,
    votes: 340,
    threadCount: 3,
    threadIndex: 1,
  },
  {
    id: '1',
    type: 'social',
    author: MOCK_AUTHORS[0],
    content: 'Just finished a great coffee session at the new cafe downtown. The atmosphere is amazing!',
    timestamp: '2h',
    replies: 12,
    reposts: 3,
    shares: 1,
    votes: 45,
    images: ['https://picsum.photos/seed/coffee/600/400'],
    replyAvatars: [MOCK_AUTHORS[1].avatar, MOCK_AUTHORS[2].avatar],
  },
  {
    id: '6',
    type: 'social',
    author: MOCK_AUTHORS[4],
    content: 'Just saw this task and it looks like a great opportunity for anyone in the area who knows plumbing!',
    timestamp: '1h',
    replies: 2,
    reposts: 5,
    shares: 1,
    votes: 34,
    quote: {
      id: '2',
      type: 'task',
      author: MOCK_AUTHORS[1],
      category: 'Repair Needed',
      title: 'Fix leaking kitchen faucet',
      description: 'My kitchen faucet has been dripping for a week. Need someone to fix it ASAP.',
      price: '$50-80',
      timestamp: '4h',
      icon: CATEGORY_ICONS['Repair Needed'],
      replies: 5, reposts: 1, shares: 0, votes: 8
    } as TaskData
  },
  {
    id: '4',
    type: 'social',
    author: MOCK_AUTHORS[3],
    content: 'Anyone know good mechanics in the area? My car needs brake repair.',
    timestamp: '8h',
    replies: 7,
    reposts: 0,
    shares: 2,
    votes: 12,
  },
  {
    id: 'social-7',
    type: 'social',
    author: MOCK_AUTHORS[2],
    content: 'Just wrapped up a major project! 🎉 Thanks to everyone who supported me along the way. Time to celebrate!',
    timestamp: '3h',
    replies: 24,
    reposts: 8,
    shares: 3,
    votes: 89,
    images: ['https://picsum.photos/seed/celebration/600/400'],
    replyAvatars: [MOCK_AUTHORS[0].avatar, MOCK_AUTHORS[1].avatar, MOCK_AUTHORS[3].avatar],
  },
  {
    id: 'social-8',
    type: 'social',
    author: MOCK_AUTHORS[1],
    content: 'Hot take: The best code is no code at all. Simplicity wins every time. 💡',
    timestamp: '5h',
    replies: 45,
    reposts: 23,
    shares: 12,
    votes: 234,
  },

  // ============================================================================
  // TASKS - OPEN STATUS
  // ============================================================================
  {
    id: '2',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Ride Hail',
    title: 'Luxury Airport Transfer (T3)',
    description: 'Looking for a premium sedan for an airport drop-off. Professional attire and clean vehicle required. Route includes highway tolls which are pre-paid.',
    price: '$45.00',
    timestamp: '15m',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Ride Hail'],
    details: 'Premium Airport Transfer',
    tags: ['Premium', 'VIP', 'Airport'],
    replies: 5,
    reposts: 1,
    shares: 0,
    votes: 8,
    mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&h=400&auto=format&fit=crop',
  },
  {
    id: '5',
    type: 'task',
    author: MOCK_AUTHORS[0],
    category: 'Delivery',
    title: 'Deliver documents to downtown office',
    description: 'Need urgent delivery of important documents. Willing to pay for fast service.',
    price: '$25',
    timestamp: '1d',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Package'],
    replies: 2,
    reposts: 0,
    shares: 0,
    votes: 3,
    mapUrl: 'https://images.unsplash.com/photo-1554310603-d39d43033735?q=80&w=800&h=400&auto=format&fit=crop',
  },
  {
    id: 'task-open-1',
    type: 'task',
    author: MOCK_AUTHORS[2],
    category: 'Development',
    title: 'Build a React landing page',
    description: 'Need a modern, responsive landing page for our SaaS product. Should include hero section, features, pricing, and contact form.',
    price: '$500-800',
    timestamp: '30m',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Development'],
    details: 'Frontend Development',
    tags: ['React', 'TypeScript', 'Tailwind'],
    replies: 8,
    reposts: 4,
    shares: 2,
    votes: 15,
  },
  {
    id: 'task-open-2',
    type: 'task',
    author: MOCK_AUTHORS[4],
    category: 'Writing',
    title: 'Blog post about AI trends',
    description: 'Looking for a tech writer to create a 1500-word blog post about emerging AI trends in 2025. SEO knowledge preferred.',
    price: '$200-300',
    timestamp: '2h',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Writing'],
    details: 'Content Writing',
    tags: ['SEO', 'AI', 'Tech'],
    replies: 12,
    reposts: 6,
    shares: 3,
    votes: 28,
  },

  // ============================================================================
  // TASKS - ASSIGNED STATUS
  // ============================================================================
  {
    id: 'task-assigned-1',
    type: 'task',
    author: MOCK_AUTHORS[1],
    category: 'Design',
    title: 'Mobile app UI redesign',
    description: 'Redesign our existing mobile app with a fresh, modern look. Must follow Material Design principles.',
    price: '$800-1200',
    timestamp: '4h',
    status: TASK_STATUS.ASSIGNED,
    icon: CATEGORY_ICONS['Design'],
    details: 'UI/UX Design',
    tags: ['Mobile', 'Figma', 'Material Design'],
    replies: 15,
    reposts: 3,
    shares: 1,
    votes: 42,
    assignedWorker: MOCK_AUTHORS[3],
    acceptedBidAmount: '$950',
  },
  {
    id: 'task-assigned-2',
    type: 'task',
    author: MOCK_AUTHORS[0],
    category: 'Ride Hail',
    title: 'City tour for tourists',
    description: 'Need a comfortable vehicle for a 4-hour city tour. 3 passengers with camera equipment.',
    price: '$120',
    timestamp: '6h',
    status: TASK_STATUS.ASSIGNED,
    icon: CATEGORY_ICONS['Ride Hail'],
    details: 'Tourism Service',
    tags: ['Tour', 'VIP', 'Photography'],
    replies: 6,
    reposts: 2,
    shares: 0,
    votes: 18,
    assignedWorker: MOCK_AUTHORS[4],
    acceptedBidAmount: '$120',
  },

  // ============================================================================
  // TASKS - IN PROGRESS STATUS
  // ============================================================================
  {
    id: 'task-progress-1',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Development',
    title: 'E-commerce integration',
    description: 'Integrate Stripe payment gateway into existing React application. Need proper error handling and receipt generation.',
    price: '$600-900',
    timestamp: '12h',
    status: TASK_STATUS.IN_PROGRESS,
    icon: CATEGORY_ICONS['Development'],
    details: 'Payment Integration',
    tags: ['Stripe', 'React', 'Node.js'],
    replies: 22,
    reposts: 5,
    shares: 2,
    votes: 56,
    assignedWorker: MOCK_AUTHORS[0],
    acceptedBidAmount: '$750',
  },
  {
    id: 'task-progress-2',
    type: 'task',
    author: MOCK_AUTHORS[2],
    category: 'Delivery',
    title: 'Furniture delivery assistance',
    description: 'Need help delivering a small sofa and two chairs. Van or truck required. Loading help appreciated.',
    price: '$80',
    timestamp: '1d',
    status: TASK_STATUS.IN_PROGRESS,
    icon: CATEGORY_ICONS['Delivery'],
    details: 'Furniture Delivery',
    tags: ['Heavy', 'Vehicle Required'],
    replies: 4,
    reposts: 1,
    shares: 0,
    votes: 9,
    assignedWorker: MOCK_AUTHORS[1],
    acceptedBidAmount: '$80',
  },

  // ============================================================================
  // TASKS - COMPLETED STATUS
  // ============================================================================
  {
    id: 'task-completed-1',
    type: 'task',
    author: MOCK_AUTHORS[4],
    category: 'Design',
    title: 'Social media graphics pack',
    description: 'Created 20 social media templates for Instagram and LinkedIn. Consistent branding across all designs.',
    price: '$350',
    timestamp: '2d',
    status: TASK_STATUS.COMPLETED,
    icon: CATEGORY_ICONS['Design'],
    details: 'Graphics Design',
    tags: ['Social Media', 'Templates', 'Branding'],
    replies: 18,
    reposts: 12,
    shares: 8,
    votes: 67,
    assignedWorker: MOCK_AUTHORS[2],
    acceptedBidAmount: '$350',
    images: ['https://picsum.photos/seed/graphics/600/400'],
  },
  {
    id: 'task-completed-2',
    type: 'task',
    author: MOCK_AUTHORS[1],
    category: 'Writing',
    title: 'Product documentation',
    description: 'Comprehensive API documentation for our developer platform. Includes code examples and integration guides.',
    price: '$450',
    timestamp: '3d',
    status: TASK_STATUS.COMPLETED,
    icon: CATEGORY_ICONS['Writing'],
    details: 'Technical Writing',
    tags: ['Documentation', 'API', 'Technical'],
    replies: 9,
    reposts: 7,
    shares: 5,
    votes: 45,
    assignedWorker: MOCK_AUTHORS[3],
    acceptedBidAmount: '$450',
  },

  // ============================================================================
  // TASKS - FINISHED STATUS
  // ============================================================================
  {
    id: 'task-finished-1',
    type: 'task',
    author: MOCK_AUTHORS[0],
    category: 'Development',
    title: 'Full website rebuild',
    description: 'Complete website overhaul with new design system, improved performance, and SEO optimization. Project delivered ahead of schedule!',
    price: '$2500',
    timestamp: '1w',
    status: TASK_STATUS.FINISHED,
    icon: CATEGORY_ICONS['Development'],
    details: 'Full Stack Development',
    tags: ['Website', 'Performance', 'SEO'],
    replies: 34,
    reposts: 28,
    shares: 15,
    votes: 156,
    assignedWorker: MOCK_AUTHORS[4],
    acceptedBidAmount: '$2500',
    images: ['https://picsum.photos/seed/website/600/400'],
  },
  {
    id: 'task-finished-2',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Ride Hail',
    title: 'Weekend wedding transport',
    description: 'Provided luxury transportation for wedding party. 5-hour service with multiple stops. Everything went smoothly!',
    price: '$400',
    timestamp: '1w',
    status: TASK_STATUS.FINISHED,
    icon: CATEGORY_ICONS['Ride Hail'],
    details: 'Event Transportation',
    tags: ['Wedding', 'Luxury', 'Event'],
    replies: 21,
    reposts: 15,
    shares: 6,
    votes: 98,
    assignedWorker: MOCK_AUTHORS[1],
    acceptedBidAmount: '$400',
  },

  // ============================================================================
  // EDITORIAL POSTS
  // ============================================================================
  {
    id: '3',
    type: 'editorial',
    author: MOCK_AUTHORS[2],
    tag: 'Tech',
    title: 'The Future of Remote Work in 2025',
    excerpt: 'As companies continue to adapt to hybrid work models, we explore how the landscape is evolving.',
    timestamp: '6h',
    replies: 28,
    reposts: 15,
    shares: 8,
    votes: 156,
  },
  {
    id: 'editorial-1',
    type: 'editorial',
    author: MOCK_AUTHORS[1],
    tag: 'Business',
    title: 'Building a Successful Freelance Career',
    excerpt: 'Key strategies for transitioning from traditional employment to a thriving freelance business.',
    timestamp: '1d',
    replies: 42,
    reposts: 31,
    shares: 19,
    votes: 203,
  },
  {
    id: 'editorial-2',
    type: 'editorial',
    author: MOCK_AUTHORS[4],
    tag: 'Design',
    title: 'Minimalism in Modern UI Design',
    excerpt: 'Why less is more when it comes to creating intuitive and beautiful user interfaces.',
    timestamp: '2d',
    replies: 36,
    reposts: 24,
    shares: 14,
    votes: 178,
  },
];

export const GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Minimalist Brand Identity',
    type: 'design',
    distance: 'Remote',
    time: '3 days',
    price: '$850.00',
    description: 'Create a clean, luxury brand identity for a new boutique hotel. Includes logo, typography, and color palette. Must have experience with high-end hospitality brands.',
    icon: <Palette size={28} />,
    meta: 'Featured',
    tags: ['Branding', 'UI/UX', 'Luxury'],
    clientName: 'Aura Hotels',
    clientRating: 4.9
  },
  {
    id: 'g2',
    title: 'React Component Library',
    type: 'dev',
    distance: 'Remote',
    time: '1 week',
    price: '$1,200.00',
    description: 'Build a set of 15 reusable, accessible React components using Tailwind CSS and Framer Motion. Strict adherence to provided Figma designs required.',
    icon: <Code size={28} />,
    meta: 'Urgent',
    tags: ['React', 'TypeScript', 'Tailwind'],
    clientName: 'TechFlow Inc',
    clientRating: 5.0
  },
  {
    id: 'g3',
    title: 'Luxury Airport Transfer',
    type: 'ride',
    distance: '1.2 miles away',
    time: '15 min trip',
    price: '$45.00',
    description: 'Premium sedan requested for airport drop-off. Professional attire preferred. Meet at Terminal 3 departures level.',
    icon: <Car size={28} />,
    meta: 'High Priority',
    tags: ['Premium', 'VIP', 'Airport'],
    clientName: 'Michael Chen',
    clientRating: 4.8
  },
  {
    id: 'g4',
    title: 'Copywriting: Tech Blog',
    type: 'writing',
    distance: 'Remote',
    time: '2 days',
    price: '$300.00',
    description: 'Write 3 SEO-optimized blog posts about the future of AI in the gig economy. 800 words each. Tone should be authoritative yet accessible.',
    icon: <FileText size={28} />,
    meta: 'Verified',
    tags: ['SEO', 'Content', 'AI'],
    clientName: 'FutureWorks',
    clientRating: 4.7
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
    content: "Great, thanks Sarah. Please let me know when you're on your way.",
    timestamp: '10:25 AM',
    isMe: true
  },
  {
    id: '3',
    senderId: 'sarah',
    senderName: 'Sarah Logistics',
    senderAvatar: 'https://picsum.photos/seed/req2/100/100',
    content: "Heading to Midtown Square now. Estimated arrival in 12 minutes.",
    timestamp: '10:26 AM',
    isMe: false
  }
];