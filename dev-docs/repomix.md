# Directory Structure
```
src/
  features/
    chat/
      components/
        ChatRoom.Component.tsx
    kanban/
      components/
        FloatingSidebar.tsx
      routes.tsx
      utils.ts
  shared/
    constants/
      domain.constant.tsx
    types/
      domain.type.ts
    ui/
      SharedUI.Component.tsx
  store/
    app.slice.ts
    chat.slice.ts
    main.store.ts
  App.tsx
  index.css
```

# Files

## File: src/features/kanban/components/FloatingSidebar.tsx
```typescript
import React, { useState } from 'react';
import {
  Home,
  Plus,
  User,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

export const FloatingSidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);

  const navItems = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/radar', icon: Zap, label: 'Radar' },
    { id: 'create', icon: Plus, label: 'Create', action: () => setShowCreateModal(true), isPrimary: true },
    { id: '/messages', icon: MessageCircle, label: 'Messages', action: () => setShowChatRoom(true) },
    { id: '/orders', icon: ClipboardList, label: 'Orders' },
    { id: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: expanded ? 240 : 80 }}
      className="fixed left-0 top-0 bottom-0 z-50 glass border-r border-white/5 flex flex-col py-6 items-center shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <button 
        onClick={() => setExpanded(!expanded)} 
        className={`p-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-colors mb-8 ${expanded ? 'self-end mr-4' : 'self-center'}`}
      >
        {expanded ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
      </button>

      <div className="flex flex-col gap-4 w-full px-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) item.action();
              else openColumn(item.id);
            }}
            className={`flex items-center ${expanded ? 'gap-4 justify-start' : 'gap-0 justify-center'} p-3 rounded-2xl transition-all group overflow-hidden whitespace-nowrap
              ${item.isPrimary ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
          >
            <div className="shrink-0 flex items-center justify-center">
              <item.icon size={24} strokeWidth={item.isPrimary ? 3 : 2} />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold tracking-wide"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col w-full px-4 gap-4">
        <button 
          onClick={() => openColumn('/profile')} 
          className={`flex items-center gap-3 p-2 rounded-2xl border border-white/10 bg-surface-container-low hover:bg-white/5 transition-colors overflow-hidden ${expanded ? 'justify-start' : 'justify-center'}`}
        >
          <div className="shrink-0">
            <UserAvatar src={currentUser.avatar} size="sm" isOnline={true} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-start"
              >
                <span className="text-xs font-bold truncate w-24 text-left">{currentUser.name}</span>
                <span className="text-2sm text-emerald-400 font-black">{currentUser.karma} karma</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};
```

## File: src/features/kanban/routes.tsx
```typescript
import React, { useContext } from 'react';
import { useRoutes } from 'react-router-dom';
import { RadarPage } from '@/src/features/gigs/pages/Radar.Page';
import { ProfilePage } from '@/src/features/profile/pages/Profile.Page';
import { ReviewOrder } from '@/src/features/gigs/pages/ReviewOrder.Page';
import { PaymentPage } from '@/src/features/gigs/pages/Payment.Page';
import { CreatePostPage } from '@/src/features/feed/pages/CreatePost.Page';
import { PostDetailPage } from '@/src/features/feed/pages/PostDetail.Page';
import { HomePage } from '@/src/features/feed/pages/Home.Page';
import { SettingsPage } from '@/src/features/settings/pages/Settings.Page';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { Author } from '@/src/shared/types/domain.type';

export const ProfileRoute: React.FC = () => {
  const { state } = useContext(ColumnContext);
  const user = state?.user as Author | undefined;
  return <div className="pb-20 h-full overflow-y-auto hide-scrollbar"><ProfilePage user={user} /></div>;
};

export const columnRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/review-order', element: <ReviewOrder /> },
  { path: '/payment', element: <PaymentPage /> },
  { path: '/create-post', element: <CreatePostPage /> },
  { path: '/profile', element: <ProfileRoute /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/post/:id', element: <PostDetailPage /> },
  { path: '/task/:id', element: <PostDetailPage /> },
  { path: '/orders', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Orders View</div> },
  { path: '/radar', element: <RadarPage /> },
  { path: '/messages', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div> },
];

export const ColumnRoutes: React.FC<{ path: string }> = ({ path }) => {
  const routes = useRoutes(columnRoutes, path);
  return routes;
};
```

## File: src/features/kanban/utils.ts
```typescript
import React from 'react';
import {
  Home,
  Search,
  MessageCircle,
  ClipboardList,
  UserCircle,
  FileText,
  Zap,
  CreditCard,
  Pencil,
  Settings,
  ShoppingCart,
} from 'lucide-react';

export const getColumnMeta = (path: string): { icon: React.ElementType; label: string } => {
  if (path === '/') return { icon: Home, label: 'Home' };
  if (path === '/radar') return { icon: Zap, label: 'Radar' };
  if (path === '/messages') return { icon: MessageCircle, label: 'Messages' };
  if (path === '/orders') return { icon: ShoppingCart, label: 'Orders' };
  if (path === '/profile') return { icon: UserCircle, label: 'Profile' };
  if (path === '/create-post') return { icon: Pencil, label: 'New Post' };
  if (path === '/review-order') return { icon: FileText, label: 'Review Order' };
  if (path === '/payment') return { icon: CreditCard, label: 'Payment' };
  if (path === '/settings') return { icon: Settings, label: 'Settings' };
  if (path.startsWith('/post/')) return { icon: FileText, label: 'Post' };
  if (path.startsWith('/task/')) return { icon: ClipboardList, label: 'Task' };
  return { icon: Search, label: 'Column' };
};
```

## File: src/store/chat.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { ChatMessage } from '@/src/shared/types/domain.type';
import { SAMPLE_CHATS } from '@/src/shared/constants/domain.constant';

export interface ChatSlice {
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  chatMessages: SAMPLE_CHATS,
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
});
```

## File: src/store/main.store.ts
```typescript
import { create } from 'zustand';
import { AppSlice } from '@/src/shared/types/domain.type';
import { createAppSlice } from './app.slice';
import { FeedSlice, createFeedSlice } from './feed.slice';
import { OrderSlice, createOrderSlice } from './order.slice';
import { ChatSlice, createChatSlice } from './chat.slice';

export type StoreState = AppSlice & FeedSlice & OrderSlice & ChatSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAppSlice(...a),
  ...createFeedSlice(...a),
  ...createOrderSlice(...a),
  ...createChatSlice(...a),
}));
```

## File: src/features/chat/components/ChatRoom.Component.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, Car, Package, Briefcase, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { ChatMessage } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';

export const ChatRoom: React.FC = () => {
  const messages = useStore(state => state.chatMessages);
  const addChatMessage = useStore(state => state.addChatMessage);
  const onClose = useStore(state => state.setShowChatRoom);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      senderName: 'Me',
      senderAvatar: 'https://picsum.photos/seed/me/100/100',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    addChatMessage(newMessage);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center glass">
        <div className="flex items-center gap-3">
          <button onClick={() => onClose(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserAvatar src="https://picsum.photos/seed/req2/100/100" size="lg" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <h2 className="text-sm font-black text-on-surface tracking-tight">Sarah Logistics</h2>
              <p className="text-2sm text-emerald-500 font-bold uppercase tracking-widest">Active • Delivery Task</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 hide-scrollbar"
      >
        <div className="text-center">
          <span className="text-2sm font-black uppercase tracking-widest text-on-surface-variant/40 py-1 px-3 bg-white/5 rounded-full">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              {!msg.isMe && <UserAvatar src={msg.senderAvatar} size="md" />}
              <div className="space-y-1">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-on-surface border border-white/10 rounded-tl-none'}`}>
                  {msg.content}
                </div>
                <div className={`text-2xs font-bold text-on-surface-variant/40 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 glass">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:scale-90 transition-all active:scale-90 shadow-lg shadow-primary/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
```

## File: src/shared/types/domain.type.ts
```typescript
import React from 'react';
import { TASK_STATUS } from '@/src/shared/constants/domain.constant';

export type TabState = 'for-you' | 'around-you';

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export type ThemeColor = 'red' | 'blue' | 'emerald' | 'violet' | 'amber';
export type TextSize = 'sm' | 'md' | 'lg';
export type ZoomLevel = 90 | 100 | 110 | 120;

export interface AppColumn {
  id: string;
  path: string;
  width: number;
  state?: Record<string, unknown>;
  activeTab?: TabState;
}

export interface AppSlice {
  isDesktop: boolean;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  currentUser: Author;
  creationContext: CreationContext | null;
  initialAiQuery: string | null;
  followedHandles: string[];
  userVotes: Record<string, 1 | -1 | 0>;
  userReposts: string[];
  themeColor: ThemeColor;
  textSize: TextSize;
  zoomLevel: ZoomLevel;
  activeGig: Gig | null;
  queuedGigs: Gig[];
  isAutoPilot: boolean;

  columns: AppColumn[];
  openColumn: (path: string, sourceId?: string, state?: Record<string, unknown>) => void;
  closeColumn: (id: string) => void;
  setColumnWidth: (id: string, width: number) => void;
  setIsDesktop: (isDesktop: boolean) => void;
  setColumnActiveTab: (columnId: string, tab: TabState) => void;

  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
  setCreationContext: (ctx: CreationContext | null) => void;
  setInitialAiQuery: (query: string | null) => void;
  toggleFollow: (handle: string) => void;
  toggleVote: (id: string, value: 1 | -1) => void;
  toggleRepost: (id: string) => void;
  setThemeColor: (color: ThemeColor) => void;
  setTextSize: (size: TextSize) => void;
  setZoomLevel: (zoom: ZoomLevel) => void;

  setActiveGig: (gig: Gig | null) => void;
  addQueuedGig: (gig: Gig) => void;
  setIsAutoPilot: (isAuto: boolean) => void;
}

export interface Author {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  karma?: number;
  isOnline?: boolean;
}

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface CreationContext {
  parentId: string;
  type: 'social' | 'task' | 'editorial';
  authorHandle: string;
  content: string;
  avatarUrl: string;
  taskTitle?: string;
  taskPrice?: string;
}

export interface SocialPostData {
  id: string;
  type: 'social';
  author: Author;
  content: string;
  images?: string[];
  video?: string;
  voiceNote?: string;
  timestamp: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
  replyAvatars?: string[];
  isBid?: boolean;
  bidAmount?: string;
  bidStatus?: BidStatus;
  quote?: FeedItem;
  threadCount?: number;
  threadIndex?: number;
  isFirstPost?: boolean;
}

export interface TaskData {
  id: string;
  type: 'task';
  author: Author;
  category: string;
  title: string;
  description: string;
  price: string;
  timestamp: string;
  status?: string;
  icon: React.ReactNode;
  details?: string;
  tags?: string[];
  meta?: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
  mapUrl?: string;
  images?: string[];
  video?: string;
  voiceNote?: string;
  quote?: FeedItem;
  isFirstPost?: boolean;
  isFirstTask?: boolean;
  taskStatus?: TaskStatus;
  assignedWorker?: Author;
  acceptedBidAmount?: string;
}

export interface EditorialData {
  id: string;
  type: 'editorial';
  author: Author;
  tag: string;
  title: string;
  excerpt: string;
  timestamp: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
  quote?: FeedItem;
  isFirstPost?: boolean;
}

export type FeedItem = SocialPostData | TaskData | EditorialData;

export interface Gig {
  id: string;
  title: string;
  type: 'ride' | 'delivery' | 'design' | 'dev' | 'writing';
  distance: string;
  time: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  meta?: string;
  tags: string[];
  clientName: string;
  clientRating: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

export interface OrderData {
  title: string;
  summary: string;
  amount: string;
  type: string;
  matchType?: 'swipe' | 'bidding';
  autoAccept?: boolean;
  locations?: string[];
}
```

## File: src/shared/constants/domain.constant.tsx
```typescript
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
```

## File: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import "tailwindcss";
@plugin "@tailwindcss/typography";

:root {
  --app-primary: #DC2626;
  --app-text-base: 16px;
}

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  
  --color-background: #000000;
  --color-surface: #050505;
  --color-surface-container: #0D0D0D;
  --color-surface-container-low: #121212;
  --color-surface-container-lowest: #161616;
  --color-surface-container-high: #1F1F1F;
  --color-surface-container-highest: #2D2D2D;
  
  --color-on-surface: #FFFFFF;
  --color-on-surface-variant: #A1A1AA;
  --color-outline-variant: #27272A;
  
  --color-primary: var(--app-primary);
  --color-primary-foreground: #FFFFFF;

  --shadow-glow: 0 0 20px rgba(255, 255, 255, 0.03);
  --shadow-inner-glow: inset 0 1px 1px rgba(255, 255, 255, 0.05);

  --text-3xs: calc(var(--app-text-base) * 0.571);
  --text-2xs: calc(var(--app-text-base) * 0.643);
  --text-xs: calc(var(--app-text-base) * 0.75);
  --text-2sm: calc(var(--app-text-base) * 0.714);
  --text-1sm: calc(var(--app-text-base) * 0.786);
  --text-sm: calc(var(--app-text-base) * 0.875);
  --text-base: var(--app-text-base);
  --text-13: calc(var(--app-text-base) * 0.929);
  --text-15: calc(var(--app-text-base) * 1.071);
  --text-lg: calc(var(--app-text-base) * 1.125);
  --text-xl: calc(var(--app-text-base) * 1.25);
  --text-2xl: calc(var(--app-text-base) * 1.5);
  --text-3xl: calc(var(--app-text-base) * 1.875);
  --text-26: calc(var(--app-text-base) * 1.857);
}

@layer base {
  body {
    @apply bg-background text-on-surface font-sans antialiased selection:bg-white/10;
    font-size: var(--app-text-base);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-image: radial-gradient(circle at 50% -20%, #0A0A0A 0%, #000000 100%);
    background-attachment: fixed;
  }
}

.glass {
  @apply bg-surface-container-high/95 border border-white/5;
}

.card-depth {
  @apply transition-colors duration-200 hover:bg-surface-container-low/40 border-b border-white/5;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

## File: src/shared/ui/SharedUI.Component.tsx
```typescript
import React, { useEffect, useRef, useState, useLayoutEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Users, Maximize2, Link as LinkIcon, Lock, PhoneOff, Globe, UserPlus, UserCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import {
  ButtonProps,
  UserAvatarProps,
  AutoResizeTextareaProps,
  TagBadgeProps,
  ExpandableTextProps,
  CheckoutHeaderProps,
  CheckoutLayoutProps,
  DetailHeaderProps,
  ReplyInputProps,
  FeedItemContextType,
} from '@/src/shared/types/ui.types';

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth = false, className = "", ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02]",
    emerald: "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02]",
    outline: "bg-transparent border border-white/10 text-white hover:bg-white/5",
    ghost: "bg-white/5 text-white border border-white/10 hover:bg-white/10"
  };

  const sizes = {
    sm: "py-2 px-4 text-xs rounded-xl",
    md: "py-4 px-6 text-sm rounded-2xl",
    lg: "py-5 px-8 text-base sm:text-lg rounded-2xl"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const FollowButton: React.FC<{ 
  handle: string; 
  variant?: 'pill' | 'profile'; 
  className?: string;
  showIfMe?: boolean;
}> = ({ handle, variant = 'pill', className = "", showIfMe = false }) => {
  const currentUser = useStore(state => state.currentUser);
  const followedHandles = useStore(state => state.followedHandles);
  const toggleFollow = useStore(state => state.toggleFollow);

  if (currentUser.handle === handle && !showIfMe) return null;

  const isFollowing = followedHandles.includes(handle);

  const buttonStyles = {
    pill: `flex items-center gap-1 px-3 py-1 rounded-full text-2sm font-bold uppercase tracking-wider transition-all active:scale-95 ${
      isFollowing
        ? 'bg-white/10 text-on-surface-variant border border-white/10 hover:bg-white/15'
        : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30'
    }`,
    profile: `rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all active:scale-95 ${
      isFollowing
        ? 'bg-transparent border border-white/10 text-white hover:bg-white/5'
        : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02]'
    }`
  };

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleFollow(handle);
      }}
      className={`${buttonStyles[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isFollowing ? 'following' : 'follow'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5"
        >
          {isFollowing ? (
            <>
              <UserCheck size={variant === 'profile' ? 16 : 12} />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus size={variant === 'profile' ? 16 : 12} />
              <span>Follow</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export const FirstPostBadge: React.FC = () => (
  <div className="mt-1 mb-1">
    <span className="bg-emerald-500 text-black text-2xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] inline-flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
      First Post
    </span>
  </div>
);

export const FirstTaskBadge: React.FC = () => (
  <div className="mt-1 mb-1">
    <span className="bg-primary text-primary-foreground text-2xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] inline-flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
      First Task
    </span>
  </div>
);

const FeedItemContext = createContext<FeedItemContextType>({
  isMain: false,
  isParent: false,
  isQuote: false,
  hasLineBelow: false
});

export const useFeedItemContext = () => useContext(FeedItemContext);

export const FeedItemProvider: React.FC<Partial<FeedItemContextType> & { children: React.ReactNode }> = ({ 
  children, 
  isMain = false, 
  isParent = false, 
  isQuote = false, 
  hasLineBelow = false 
}) => (
  <FeedItemContext.Provider value={{ isMain, isParent, isQuote, hasLineBelow }}>
    {children}
  </FeedItemContext.Provider>
);

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt = "User avatar", size = 'md', className = "", isOnline }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div className="relative flex-shrink-0">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover ring-1 ring-white/10 z-10 bg-background flex-shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
      {isOnline && (
        <div 
          className={`absolute bottom-0 right-0 bg-emerald-500 rounded-full border-[1.5px] border-background z-20 shadow-[0_0_8px_rgba(16,185,129,0.4)] flex items-center justify-center`}
          style={{ 
            transform: 'translate(10%, 10%)',
            width: size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '14px',
            height: size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '14px',
          }}
        >
           <div className="w-full h-full bg-white/40 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({ minHeight = 44, maxHeight = 120, className = "", style, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeight}px`;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [props.value, minHeight, maxHeight]);

  return (
    <textarea
      ref={textareaRef}
      className={`bg-transparent border-none focus:ring-0 focus:outline-none resize-none hide-scrollbar ${className}`}
      style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px`, ...style }}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = `${minHeight}px`;
        target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
        if (props.onInput) props.onInput(e);
      }}
      {...props}
    />
  );
};

export const TagBadge: React.FC<TagBadgeProps> = ({ children, variant = 'default', className = "" }) => {
  const variants = {
    primary: 'bg-primary/20 text-primary border-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    default: 'bg-white/5 text-on-surface-variant border-white/10'
  };
  return (
    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider border text-2sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const ExpandableText: React.FC<ExpandableTextProps> = ({ text, limit = 160, className = "", buttonClassName = "", suffix }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > limit;

  const displayText = (!isLong || isExpanded) ? text : `${text.substring(0, limit)}...`;

  return (
    <div className={className}>
      <span className="inline">
        <RichText text={displayText} />
        {suffix && <span className="ml-2 inline-flex align-middle">{suffix}</span>}
      </span>
      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`ml-1 text-primary font-bold hover:underline focus:outline-none transition-all ${buttonClassName}`}
        >
          {isExpanded ? "show less" : "read more"}
        </button>
      )}
    </div>
  );
};

export const SpoilerText: React.FC<{ text: string }> = ({ text }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span 
      onClick={(e) => { 
        if (!revealed) {
          e.preventDefault(); 
          e.stopPropagation(); 
          setRevealed(true); 
        }
      }}
      className={`transition-all duration-700 ${revealed ? 'text-on-surface' : 'blur-[5px] hover:blur-[3px] bg-white/5 cursor-pointer select-none rounded px-1.5 py-0.5'}`}
      title={revealed ? undefined : "Click to reveal spoiler"}
    >
      {text}
    </span>
  );
};

export const LinkPreviewNode: React.FC<{ url: string }> = ({ url }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [align, setAlign] = useState<'center' | 'left' | 'right'>('center');
  const triggerRef = useRef<HTMLSpanElement>(null);

  let domain = 'link';
  try {
    domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch(e) {}

  useLayoutEffect(() => {
    if (isHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;

      // Vertical Flip: If less than 320px (card height) above and more space below
      if (spaceAbove < 320 && spaceBelow > spaceAbove) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }

      // Horizontal Shift: Prevent bleeding off edges
      if (spaceLeft < 140) setAlign('left');
      else if (spaceRight < 140) setAlign('right');
      else setAlign('center');
    }
  }, [isHovered]);

  const containerClasses = {
    top: "bottom-full mb-3",
    bottom: "top-full mt-3"
  };

  const alignClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-0",
    right: "right-0"
  };

  return (
    <span 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RichLinkAnchor url={url} />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${containerClasses[position]} ${alignClasses[align]} w-72 z-[100] pointer-events-none`}
          >
            <div className="bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="h-28 bg-surface-container-highest relative overflow-hidden border-b border-white/5">
                <img src={`https://picsum.photos/seed/${domain}/400/200`} alt="Preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high/90 to-transparent" />
              </div>
              <div className="p-4 relative z-10 bg-surface-container-high shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Globe size={10} className="text-on-surface-variant" />
                  </div>
                  <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-black truncate">{domain}</span>
                </div>
                <h4 className="text-15 font-black text-on-surface truncate leading-tight mb-1">{domain}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed font-medium">
                  Explore more content and information on this external website. Click the link to open in a new tab.
                </p>
              </div>
            </div>
            {/* Arrow Pointer */}
            <div 
              className={`absolute w-3 h-3 bg-surface-container-high border-white/10 rotate-45 shadow-sm
                ${position === 'top' ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-t border-l'}
                ${align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'left' ? 'left-6' : 'right-6'}
              `} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

const RichLinkAnchor: React.FC<{ url: string }> = ({ url }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noreferrer" 
    className="text-primary hover:underline relative group inline-flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-md mx-0.5 align-baseline transition-colors hover:bg-primary/20" 
    onClick={e => {
      // Prevent clicking from triggering post detail navigation if this link is inside a card
      e.stopPropagation();
    }}
  >
    <LinkIcon size={12} className="opacity-70 flex-shrink-0" />
    <span className="truncate max-w-[200px]">{url.replace(/^https?:\/\//, '')}</span>
  </a>
);

export const RichText: React.FC<{ text: string }> = ({ text }) => {
  let nodes: React.ReactNode[] = [text];

  const applyRegex = (regex: RegExp, renderer: (match: string, i: number) => React.ReactNode) => {
    nodes = nodes.flatMap((node, idx) => {
      if (typeof node !== 'string') return [node];
      const parts = node.split(regex);
      return parts.map((part, i) => {
        if (i % 2 === 1) { // Matched regex elements
          return renderer(part, idx * 1000 + i);
        }
        return part;
      });
    });
  };

  applyRegex(/(\|\|.*?\|\|)/g, (match, i) => <SpoilerText key={`sp-${i}`} text={match.slice(2, -2)} />);
  
  applyRegex(/(https?:\/\/[^\s]+)/g, (match, i) => <LinkPreviewNode key={`ln-${i}`} url={match} />);

  applyRegex(/(@[a-zA-Z0-9_]+)/g, (match, i) => (
    <span key={`mn-${i}`} className="text-primary/90 font-black cursor-pointer hover:underline hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); }}>
      {match}
    </span>
  ));

  applyRegex(/(#[a-zA-Z0-9_]+)/g, (match, i) => (
    <span key={`ht-${i}`} className="text-emerald-400/90 font-bold cursor-pointer hover:underline hover:text-emerald-400 transition-colors" onClick={(e) => { e.stopPropagation(); }}>
      {match}
    </span>
  ));

  applyRegex(/((?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g, (match, i) => (
    <span key={`ph-${i}`} className="bg-red-500/10 text-red-500 text-2sm px-1.5 py-0.5 mx-0.5 rounded font-black uppercase tracking-widest border border-red-500/20 inline-flex items-center gap-1 align-baseline" title="Phone numbers are redacted for safety">
      <PhoneOff size={10} />
      Redacted
    </span>
  ));

  return <>{nodes}</>;
};

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ title, subtitle, onBack }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  
  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={handleBack}
        className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
      >
        <ArrowLeft size={24} />
      </button>
      <div>
        <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">{title}</h2>
        <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
};

export const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ title, subtitle, onBack, children }) => (
  <PageSlide>
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 pb-2 shrink-0">
        <CheckoutHeader title={title} subtitle={subtitle} onBack={onBack} />
      </div>
      <div className="flex-grow overflow-y-auto px-6 pb-32 hide-scrollbar">
        {children}
      </div>
    </div>
  </PageSlide>
);

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  onBack,
  title,
  subtitle,
  rightNode,
  contentType,
  viewCount,
  currentlyViewing,
  className = ""
}) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  const isExcluded = title.toLowerCase().includes('message') || title.toLowerCase().includes('chat');
  const showStats = !isExcluded;
  const type = contentType || (title.toLowerCase().includes('task') ? 'Task' : title.toLowerCase().includes('reply') ? 'Reply' : 'Post');
  const views = viewCount || `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}k`;
  const viewing = currentlyViewing || Math.floor(Math.random() * 40) + 12;

  return (
    <header 
      className={`sticky top-0 z-20 bg-surface-container-high/95 border-b border-white/5 min-h-16 flex items-center px-4 justify-between gap-4 will-change-transform ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors shrink-0">
          <ArrowLeft size={20} className="text-on-surface" />
        </button>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-15 font-bold text-on-surface truncate">{title}</h1>
            {showStats && (
              <span className="text-2xs uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-on-surface-variant font-bold shrink-0">
                {type}
              </span>
            )}
          </div>
          {subtitle && <span className="text-1sm text-on-surface-variant font-medium truncate mt-0.5">{subtitle}</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {showStats && (
          <div className="hidden sm:flex items-center gap-3 text-1sm font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-3 py-1.5 rounded-full shadow-inner">
            <div className="flex items-center gap-1.5" title="Total Views">
              <Eye size={14} className="opacity-70" />
              <span>{views}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1.5 text-emerald-400" title="Currently viewing">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span>{viewing}</span>
            </div>
          </div>
        )}
        
        {/* Mobile alternative view (more compact, drops text) */}
        {showStats && (
          <div className="sm:hidden flex items-center gap-2 text-2sm font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-2 py-1 rounded-full shadow-inner">
            <div className="flex items-center gap-1" title="Total Views">
              <Eye size={12} className="opacity-70" />
              <span>{views}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1 text-emerald-400" title="Currently viewing">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
              <span>{viewing}</span>
            </div>
          </div>
        )}
        {rightNode}
      </div>
    </header>
  );
};

export const PageSlide: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="fixed inset-0 z-[60] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5 will-change-transform"
  >
    {children}
  </motion.div>
);

export const ReplyInput: React.FC<ReplyInputProps> = ({ value, onChange, placeholder, buttonText = "Reply", avatarUrl = "https://picsum.photos/seed/user/100/100", onExpand, onSubmit }) => (
  <div className="fixed bottom-0 w-full max-w-2xl glass p-3 flex items-end gap-3 z-20">
    <UserAvatar src={avatarUrl} size="md" className="mb-1 hidden sm:block" />
    <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
      <AutoResizeTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none py-2.5 px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
        minHeight={44}
        maxHeight={120}
        rows={1}
      />
      {onExpand && (
        <button onClick={onExpand} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
          <Maximize2 size={18} />
        </button>
      )}
    </div>
    <Button 
      size="sm"
      disabled={!value.trim()}
      className="mb-1 shrink-0"
      onClick={onSubmit}
    >
      {buttonText}
    </Button>
  </div>
);
```

## File: src/store/app.slice.ts
```typescript
import { StateCreator } from 'zustand';
import {
  TabState, Author, CreationContext, Gig,
  ThemeColor, TextSize, ZoomLevel, AppColumn, AppSlice,
} from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS, GIGS, STORAGE_KEY, VALID_THEME_COLORS, VALID_TEXT_SIZES, VALID_ZOOM_LEVELS } from '@/src/shared/constants/domain.constant';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { themeColor: 'red' as ThemeColor, textSize: 'md' as TextSize, zoomLevel: 100 as ZoomLevel };
    const parsed = JSON.parse(raw);
    return {
      themeColor: VALID_THEME_COLORS.includes(parsed.themeColor) ? parsed.themeColor : 'red' as ThemeColor,
      textSize: VALID_TEXT_SIZES.includes(parsed.textSize) ? parsed.textSize : 'md' as TextSize,
      zoomLevel: VALID_ZOOM_LEVELS.includes(parsed.zoomLevel) ? parsed.zoomLevel : 100 as ZoomLevel,
    };
  } catch {
    return { themeColor: 'red' as ThemeColor, textSize: 'md' as TextSize, zoomLevel: 100 as ZoomLevel };
  }
}

export const createAppSlice: StateCreator<AppSlice> = (set) => {
  const saved = loadSettings();
  return {
  isDesktop: window.innerWidth >= 768,
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  currentUser: MOCK_AUTHORS[0],
  columns: [{ id: 'main-col', path: '/', width: 420, activeTab: 'for-you' as TabState }],
  activeGig: null,
  queuedGigs: [],
  isAutoPilot: false,
  themeColor: saved.themeColor,
  textSize: saved.textSize,
  zoomLevel: saved.zoomLevel,
  setThemeColor: (themeColor) => set({ themeColor }),
  setTextSize: (textSize) => set({ textSize }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setIsDesktop: (isDesktop) => set({ isDesktop }),
  setColumnActiveTab: (columnId, tab) => set((state) => ({
    columns: state.columns.map(c => c.id === columnId ? { ...c, activeTab: tab } : c)
  })),
  setShowMatcher: (show) => set({ showMatcher: show }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowChatRoom: (show) => set({ showChatRoom: show }),
  setCurrentUser: (user) => set({ currentUser: user }),
  creationContext: null,
  setCreationContext: (ctx) => set({ creationContext: ctx }),
  initialAiQuery: null,
  setInitialAiQuery: (query) => set({ initialAiQuery: query }),
  followedHandles: [],
  userVotes: {},
  userReposts: [],
  toggleFollow: (handle) => set((state) => ({
    followedHandles: state.followedHandles.includes(handle)
      ? state.followedHandles.filter((h) => h !== handle)
      : [...state.followedHandles, handle]
  })),
  toggleVote: (id, value) => set((state) => {
    const current = state.userVotes[id] || 0;
    const next = current === value ? 0 : value;
    return { userVotes: { ...state.userVotes, [id]: next } };
  }),
  toggleRepost: (id) => set((state) => ({
    userReposts: state.userReposts.includes(id)
      ? state.userReposts.filter(rid => rid !== id)
      : [...state.userReposts, id]
  })),
  setActiveGig: (gig) => set({ activeGig: gig }),
  addQueuedGig: (gig) => set((state) => ({ 
    queuedGigs: [...state.queuedGigs, gig] 
  })),
  setIsAutoPilot: (isAuto) => set({ isAutoPilot: isAuto }),
  
  openColumn: (path, sourceId, routeState) => set((state) => {
    const newCol: AppColumn = {
      id: `col-${Math.random().toString(36).substring(2, 9)}`,
      path,
      width: 420, // Default width
      state: routeState,
      activeTab: path === '/' ? 'for-you' : undefined
    };

    if (sourceId) {
      const index = state.columns.findIndex(c => c.id === sourceId);
      if (index !== -1) {
        const newCols = [...state.columns];
        newCols.splice(index + 1, 0, newCol); // Insert right after source column
        return { columns: newCols };
      }
    }
    return { columns: [...state.columns, newCol] };
  }),
  closeColumn: (id) => set((state) => ({
    columns: state.columns.filter(c => c.id !== id)
  })),
  setColumnWidth: (id, width) => set((state) => ({
    columns: state.columns.map(c => c.id === id ? { ...c, width } : c)
  })),
  };
};
```

## File: src/App.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import {
  Home,
  Plus,
  MessageCircle,
  ClipboardList,
  Zap,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { CreateModal } from '@/src/features/creation/components/CreateModal.Component';
import { ChatRoom } from '@/src/features/chat/components/ChatRoom.Component';
import { PageSlide } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { DesktopKanbanLayout, columnRoutes, ProfileRoute } from '@/src/features/kanban';

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);

  return (
    <div className="min-h-[100dvh] bg-background text-on-surface flex flex-col max-w-2xl mx-auto shadow-2xl relative">
      <main className="flex-grow pb-20 relative">
        <Routes>
          {columnRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>

      {['/', '/radar', '/messages', '/profile', '/orders'].includes(location.pathname) && (
        <nav className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass border-t border-white/5 flex justify-around items-center px-4 will-change-transform">
          {[
            { id: '/', icon: Home, label: 'Home' },
            { id: '/radar', icon: Zap, label: 'Radar' },
            { id: 'create', icon: Plus, label: 'Create', center: true },
            { id: '/messages', icon: MessageCircle, label: 'Messages', extra: () => setShowChatRoom(true) },
            { id: '/orders', icon: ClipboardList, label: 'Orders' }
          ].map((item) => item.center ? (
            <button key={item.id} onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground rounded-xl p-2.5 shadow-xl"><item.icon size={20} strokeWidth={3} /></button>
          ) : (
            <button key={item.id} onClick={() => {
              navigate(item.id, { state: (item.id === '/profile' || item.id === '/orders') ? {} : undefined });
              if (item.extra) item.extra();
            }} className={`flex flex-col items-center gap-1 ${location.pathname === item.id && !location.state?.user ? 'text-primary' : 'text-on-surface-variant'}`}>
              <item.icon size={22} /><span className="text-2xs font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default function App() {
  const isDesktop = useStore(state => state.isDesktop);
  const setIsDesktop = useStore(state => state.setIsDesktop);
  const showCreateModal = useStore(state => state.showCreateModal);
  const showChatRoom = useStore(state => state.showChatRoom);
  
  const themeColor = useStore(state => state.themeColor);
  const textSize = useStore(state => state.textSize);
  const zoomLevel = useStore(state => state.zoomLevel);

  useEffect(() => {
    const root = document.documentElement;
    const colors = { red: '#DC2626', blue: '#3B82F6', emerald: '#10B981', violet: '#8B5CF6', amber: '#F59E0B' };
    const sizes = { sm: '12px', md: '14px', lg: '16px' };
    
    root.style.setProperty('--app-primary', colors[themeColor] || colors.red);
    root.style.setProperty('--app-text-base', sizes[textSize] || sizes.md);
  }, [themeColor, textSize]);

  useEffect(() => {
    const unsub = useStore.subscribe((state) => {
      localStorage.setItem('siapaja-settings', JSON.stringify({
        themeColor: state.themeColor,
        textSize: state.textSize,
        zoomLevel: state.zoomLevel,
      }));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsDesktop]);

  return (
    <div style={{ zoom: zoomLevel / 100, minHeight: '100dvh' }}>
      {isDesktop ? <DesktopKanbanLayout /> : <MobileLayout />}

      <AnimatePresence>
        {showCreateModal && <CreateModal />}
        {showChatRoom && <ChatRoom />}
      </AnimatePresence>
    </div>
  );
}
```
