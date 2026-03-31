# Directory Structure
```
src/
  features/
    feed/
      components/
        FeedItems.Component.tsx
      pages/
        Home.Page.tsx
    profile/
      pages/
        Profile.Page.tsx
  shared/
    contexts/
      column.context.tsx
    types/
      domain.type.ts
  store/
    app.slice.ts
    main.store.ts
  App.tsx
  index.css
```

# Files

## File: src/shared/contexts/column.context.tsx
```typescript
import { createContext } from 'react';

export const ColumnContext = createContext<{ id: string; path: string; state?: Record<string, unknown> }>({ id: 'main-col', path: '/' });
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

## File: src/features/feed/pages/Home.Page.tsx
```typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedComposer } from '@/src/features/feed/components/FeedComposer.Component';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { useStore } from '@/src/store/main.store';
import { TabState } from '@/src/shared/types/domain.type';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { ChevronUp } from 'lucide-react';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const columns = useStore(state => state.columns);
  const setColumnActiveTab = useStore(state => state.setColumnActiveTab);
  const feedItems = useStore(state => state.feedItems);
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const isDesktop = useStore(state => state.isDesktop);
  const { id: columnId } = React.useContext(ColumnContext);
  const navigate = useNavigate();
  const column = columns.find(c => c.id === columnId);
  const activeTab = column?.activeTab ?? 'for-you';

  return (
    <div className="relative pb-10">
      {/* Restored Header for the Home Column */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 will-change-transform mb-4">
        <div className="flex justify-between items-center px-4 h-16">
          <button onClick={() => isDesktop ? openColumn('/profile', columnId) : navigate('/profile')} className="hover:opacity-80 transition-opacity">
            <UserAvatar src={currentUser.avatar} size="md" isOnline={true} />
          </button>
          <div className="flex space-x-6">
            {['for-you', 'around-you'].map(tab => (
              <button key={tab} onClick={() => setColumnActiveTab(columnId, tab as TabState)} className={`text-sm font-semibold relative py-1 capitalize ${activeTab === tab ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {tab.replace('-', ' ')}
                {activeTab === tab && <motion.div layoutId={`tab-${columnId}`} className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
          <button onClick={() => isDesktop ? openColumn('/profile', columnId) : navigate('/profile')} className="flex items-center gap-1 bg-surface-container-high border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors shadow-sm">
            <span className="text-emerald-400 font-black text-13">{currentUser.karma || '98'}</span>
            <ChevronUp size={14} className="text-emerald-400" strokeWidth={3} />
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <FeedComposer />
          {feedItems.map((item) => (
            <FeedItemRenderer key={item.id} data={item} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
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

/* Horizontal Kanban Layout */
.kanban-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
  background: transparent;
  padding-left: 80px;
  padding-right: 80px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.kanban-column-wrapper {
  height: 100%;
  flex-shrink: 0;
  position: relative;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  padding: 1.5rem 0.75rem;
  transition: width 0.15s ease-out;
}

.kanban-column-wrapper:hover .kanban-resizer {
  opacity: 1;
}

.kanban-column-content {
  width: 100%;
  height: 100%;
  border-radius: 36px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(31, 31, 31, 0.8);
  backdrop-filter: blur(40px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* Column Header Bar */
.kanban-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  min-height: 36px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  gap: 8px;
  user-select: none;
}

.kanban-col-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.kanban-col-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.kanban-col-header-title {
  font-size: var(--text-1sm);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kanban-col-header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.kanban-col-header-badge {
  font-size: var(--text-2xs);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.08em;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 6px;
  border-radius: 6px;
  line-height: 1;
}

.kanban-col-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}

.kanban-col-close-btn:hover {
  background: rgba(220, 38, 38, 0.15);
  color: #f87171;
}

.kanban-col-close-btn:active {
  background: rgba(220, 38, 38, 0.3);
  transform: scale(0.9);
}

.kanban-resizer {
  position: absolute;
  right: 0;
  top: 25%;
  bottom: 25%;
  width: 4px;
  cursor: col-resize;
  z-index: 50;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kanban-resizer::after {
  content: '';
  width: 4px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  transition: background-color 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.kanban-resizer:active::after {
  background: #DC2626;
}

.kanban-add-btn {
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  background: rgba(31, 31, 31, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 16px;
  flex-shrink: 0;
  transition: all 0.2s;
}

.kanban-add-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.kanban-add-btn:active {
  transform: scale(0.95);
}

.kanban-add-btn:hover .kanban-add-btn-icon {
  transform: rotate(90deg);
}

.kanban-add-btn-icon {
  transition: transform 0.3s;
}
```

## File: src/features/profile/pages/Profile.Page.tsx
```typescript
import React, { useState, useRef, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, MapPin, Link as LinkIcon, Calendar, Edit3, Share2, MessageCircle, Star, Settings } from 'lucide-react';
import { UserAvatar, Button, FollowButton } from '@/src/shared/ui/SharedUI.Component';
import { Author } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ColumnContext } from '@/src/shared/contexts/column.context';

export const ProfilePage: React.FC<{
  user?: Author;
  onBack?: () => void;
}> = ({ user: userProp, onBack: onBackProp }) => {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const feedItems = useStore(state => state.feedItems);
  const isDesktop = useStore(state => state.isDesktop);
  const openColumn = useStore(state => state.openColumn);
  const user = userProp || currentUser;
  const isMe = currentUser.handle === user.handle;
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'tasks' | 'media'>('posts');

  const onBack = onBackProp || (() => navigate(-1));

  const goToSettings = () => {
    if (isDesktop) openColumn('/settings');
    else navigate('/settings');
  };

  const userItems = feedItems.filter(item => item.author.handle === user.handle);
  const displayItems = userItems.length > 0 ? userItems : feedItems.slice(0, 3).map(i => ({...i, author: user}));

  // Handle scrolling contexts (App main window vs internal container when nested)
  const { scrollY: windowScrollY } = useScroll();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY: containerScrollY } = useScroll({ container: onBackProp ? scrollRef : undefined });
  const scrollY = onBackProp ? containerScrollY : windowScrollY;

  const heroY = useTransform(scrollY, [0, 300], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 250], [1, 0.3]);
  const heroScale = useTransform(scrollY, [-100, 0], [1.5, 1]);
  
  const headerOpacity = useTransform(scrollY, [80, 140], [0, 1]);
  const blurValue = useTransform(scrollY, [80, 140], [0, 12]);
  const headerBg = useMotionTemplate`rgba(0, 0, 0, ${headerOpacity})`;
  const headerBlur = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <div 
      ref={onBackProp ? scrollRef : undefined}
      className={`min-h-screen bg-background relative ${onBackProp ? 'overflow-y-auto hide-scrollbar h-[100dvh]' : 'pb-24'}`}
    >
      {onBackProp && (
        <motion.div 
          className="sticky top-0 left-0 right-0 z-50 flex items-center h-16 px-4 gap-3 border-b border-transparent"
          style={{ backgroundColor: headerBg, backdropFilter: headerBlur, WebkitBackdropFilter: headerBlur, borderBottomColor: useMotionTemplate`rgba(255,255,255, ${useTransform(scrollY, [140, 160], [0, 0.05])})` }}
        >
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>
          <motion.div style={{ opacity: headerOpacity }} className="flex flex-col">
            <span className="text-15 font-bold text-on-surface tracking-tight leading-tight">{user.name}</span>
            <span className="text-1sm text-on-surface-variant font-medium leading-tight">{displayItems.length} posts</span>
          </motion.div>
        </motion.div>
      )}
      
      {/* Cover Photo */}
      <motion.div 
        className={`w-full relative origin-top ${onBackProp ? '-mt-16 h-56 sm:h-64' : 'h-48 sm:h-56'}`}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-surface-container-high to-emerald-500/20" />
        <img src={`https://picsum.photos/seed/${user.handle}/800/400`} alt="Cover" className="w-full h-full object-cover mix-blend-overlay opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        {isMe && (
          <button
            onClick={goToSettings}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <Settings size={20} />
          </button>
        )}
      </motion.div>

      <div className="px-4 relative z-10 -mt-20 sm:-mt-24 mb-4">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <UserAvatar 
              src={user.avatar} 
              size="xl" 
              isOnline={true}
              className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background ring-0" 
            />
          </div>
          
          <div className="flex items-center gap-2 pb-2">
            {isMe ? (
              <>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full"><Share2 size={20} /></Button>
                <Button variant="outline" size="sm" className="rounded-full px-4"><Edit3 size={20} className="mr-1" /> Edit Profile</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full"><MessageCircle size={20} /></Button>
                <FollowButton handle={user.handle} variant="profile" />
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-black text-on-surface flex items-center gap-2">
            {user.name}
            {user.verified && <BadgeCheck size={20} className="text-primary fill-primary/20" />}
          </h1>
          <p className="text-on-surface-variant font-medium text-sm">@{user.handle}</p>
        </div>

        <p className="text-sm text-on-surface/90 mb-4 leading-relaxed whitespace-pre-wrap">
          {isMe 
            ? "Building tools for the future. Digital nomad, tech enthusiast, and freelance problem solver. 🚀" 
            : "Exploring the decentralised web. Always open for new tasks and exciting projects! 💡"}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant mb-5 font-medium">
          <span className="flex items-center gap-1"><MapPin size={14} /> Jakarta, ID</span>
          <span className="flex items-center gap-1"><LinkIcon size={14} /> <a href="#" className="text-primary hover:underline">siapaja.com</a></span>
          <span className="flex items-center gap-1"><Calendar size={14} /> Joined March 2024</span>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex flex-col">
            <span className="font-black text-lg text-on-surface">8.4k</span>
            <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-bold">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-emerald-400 flex items-center gap-1">{user.karma || '98'} <Star size={14} className="fill-emerald-400" /></span>
            <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-bold">Karma</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-on-surface">42</span>
            <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-bold">Tasks Done</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex w-full border-b border-white/10 mb-4 overflow-x-auto hide-scrollbar">
          {['posts', 'replies', 'tasks', 'media'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as typeof activeTab)} 
              className={`flex-1 min-w-[72px] pb-3 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-0 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {displayItems.map((item, idx) => (
              <div key={item.id}>
                <FeedItemRenderer data={item} />
                {idx < displayItems.length - 1 && <div className="h-px bg-white/5 mx-4 my-2" />}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
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

## File: src/features/feed/components/FeedItems.Component.tsx
```typescript
import React from 'react';
import {
  MoreHorizontal,
  BadgeCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Navigation,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton, PostActions } from '@/src/shared/ui/PostActions.Component';
import { UserAvatar, TagBadge, ExpandableText, RichText, FollowButton, FirstPostBadge, FirstTaskBadge, useFeedItemContext, FeedItemProvider } from '@/src/shared/ui/SharedUI.Component';
import { FeedItem, SocialPostData, TaskData, EditorialData, Author, BidStatus } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS } from '@/src/shared/constants/domain.constant';
import { useStore } from '@/src/store/main.store';
import { FeedItemProps, MediaCarouselProps } from '@/src/features/feed/types/feed.types';
import { ColumnContext } from '@/src/shared/contexts/column.context';

const threadCache: Record<string, FeedItem[]> = {};

export const getReplies = (parentPost: FeedItem, contentTemplate: (i: number, depth: number) => string, maxDepth: number = 3, currentDepth: number = 0): FeedItem[] => {
  if (currentDepth > maxDepth) return [];
  const cacheKey = `${parentPost.id}-${currentDepth}`;
  if (threadCache[cacheKey]) return threadCache[cacheKey];

  if (parentPost.id === 'thread-1' && currentDepth === 0) {
    const hardcodedThreadReplies: FeedItem[] = [
      {
        id: 'thread-1-r1',
        type: 'social',
        author: parentPost.author,
        content: "First, we need to address the bloat in modern web apps. Too much JS is shipped by default. We're prioritizing developer experience over user experience.",
        timestamp: parentPost.timestamp,
        replies: 1, reposts: 5, shares: 2, votes: 40,
        threadCount: 3, threadIndex: 2
      } as FeedItem,
      {
        id: 'thread-1-r2',
        type: 'social',
        author: parentPost.author,
        content: "Finally, start embracing native platform features. The browser can do so much more now without massive overhead. Stay lean! 🧵",
        timestamp: parentPost.timestamp,
        replies: 0, reposts: 2, shares: 1, votes: 85,
        threadCount: 3, threadIndex: 3
      } as FeedItem
    ];
    threadCache[cacheKey] = hardcodedThreadReplies;
    return hardcodedThreadReplies;
  }

  // If the post metadata explicitly says 0 replies, return an empty array
  if (currentDepth === 0 && parentPost.replies === 0) return [];

  const hash = parentPost.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Force 3 top-level replies to showcase different media types
  const numReplies = currentDepth === 0 ? 3 : (hash % 3) + 1;
  
  const replies = Array.from({ length: numReplies }).map((_, i) => {
    const author = MOCK_AUTHORS[(hash + i) % MOCK_AUTHORS.length];
    
    // Automatically generate a mock bid for tasks
    const isBid = parentPost.type === 'task' && currentDepth === 0 && i === 0;

    return {
      id: `${parentPost.id}-r${i}`,
      type: 'social',
      author,
      content: isBid ? "I'm available right now! I have 5 years of experience with this exact issue and can fix it in under an hour." : contentTemplate(i, currentDepth),
      timestamp: `${(i + 1) * 2}h`,
      votes: (hash + i) % 100,
      replies: currentDepth < 2 ? (hash % 3) + 1 : 0,
      reposts: (hash + i) % 10,
      shares: (hash + i) % 5,
      isBid,
      bidAmount: isBid ? "$65.00" : undefined,
      bidStatus: isBid ? 'pending' : undefined,
      images: currentDepth === 0 && i === 0 ? [`https://picsum.photos/seed/${parentPost.id}r${i}/600/400`] : undefined,
      voiceNote: currentDepth === 0 && i === 1 ? '0:32' : undefined,
      video: currentDepth === 0 && i === 2 ? 'https://www.w3schools.com/html/mov_bbb.mp4' : undefined,
    } as FeedItem;
  });

  threadCache[cacheKey] = replies;
  return replies;
};



// --- Components ---

export const MediaCarousel: React.FC<MediaCarouselProps> = ({ images, className = "", aspect = "aspect-video" }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (scrollRef.current) {
        const { scrollLeft, offsetWidth } = scrollRef.current;
        const index = Math.round(scrollLeft / offsetWidth);
        if (index !== activeIndex) setActiveIndex(index);
      }
    }, 50);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative group w-full ${className}`}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-xl border border-white/5 shadow-lg gap-2 px-0 scroll-smooth"
      >
        {images.map((img, idx) => (
          <div key={idx} className={`flex-shrink-0 ${images.length > 1 ? 'w-[92%] sm:w-[96%]' : 'w-full'} snap-center ${aspect} relative overflow-hidden`}>
            <img 
              src={img} 
              alt={`Content ${idx + 1}`} 
              className="w-full h-full object-cover rounded-xl" 
              referrerPolicy="no-referrer" 
            />
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
          {images.map((_, idx) => (
            <button 
              key={idx} 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    left: idx * scrollRef.current.offsetWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-1 h-1 rounded-full transition-all duration-300 pointer-events-auto ${
                idx === activeIndex ? 'bg-white w-2' : 'bg-white/40'
              }`} 
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <>
          {activeIndex > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) scrollRef.current.scrollTo({ left: (activeIndex - 1) * scrollRef.current.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) scrollRef.current.scrollTo({ left: (activeIndex + 1) * scrollRef.current.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

// --- Abstracted Feed Card ---

export const BaseFeedCard: React.FC<{
  data: FeedItem;
  onClick?: () => void;
  avatarContent?: React.ReactNode;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
}> = ({ data, onClick: onClickOverride, avatarContent, headerMeta, children }) => {
  const { isMain, isParent, isQuote, hasLineBelow } = useFeedItemContext();
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const resolvedIsAuthor = currentUser.handle === data.author.handle;
  const openColumn = useStore(state => state.openColumn);
  const isDesktop = useStore(state => state.isDesktop);
  const { id: columnId } = React.useContext(ColumnContext);

  const handleCardClick = () => {
    if (onClickOverride) {
      onClickOverride();
      return;
    }
    if (isQuote || isParent) return;
    const path = data.type === 'task' ? `/task/${data.id}` : `/post/${data.id}`;
    if (isDesktop) openColumn(path, columnId);
    else navigate(path);
  };

  const handleUserClick = (user: Author) => {
    if (isDesktop) openColumn('/profile', columnId, { user });
    else navigate('/profile', { state: { user } });
  };

  const isThreadContext = isMain || isParent || hasLineBelow;
  const isClickable = !isQuote && !isParent;
  const rootClass = isQuote
    ? `p-3 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer w-full mt-2 mb-1`
    : isThreadContext
      ? `px-4 relative group ${isClickable || onClickOverride ? 'cursor-pointer hover:bg-white/[0.02] transition-colors' : ''} ${isParent ? 'opacity-60 hover:opacity-100' : ''} ${isMain ? 'pt-2' : 'pt-4'}`
      : `pt-2 px-4 card-depth group cursor-pointer`;

  return (
    <article className={rootClass} onClick={isClickable || onClickOverride ? handleCardClick : undefined}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex flex-col items-center">
          {avatarContent || (
            <UserAvatar
              src={data.author.avatar}
              alt={data.author.name}
              size={isQuote ? 'sm' : isParent ? 'sm' : isMain ? 'lg' : 'md'}
              isOnline={data.author.isOnline}
            />
          )}
          {hasLineBelow && !isQuote && (
            <div className={`w-[1.5px] grow mt-2 -mb-4 bg-white/10 rounded-full ${isParent ? 'min-h-[20px]' : 'min-h-[40px]'}`} />
          )}
        </div>
        <div className={`flex-grow ${isThreadContext && isMain ? 'pb-2' : isQuote ? 'pb-0' : 'pb-4'} relative`}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span onClick={(e) => { e.stopPropagation(); handleUserClick(data.author); }} className={`font-semibold text-on-surface hover:underline cursor-pointer ${isParent || isQuote ? 'text-xs' : isMain ? 'text-15' : 'text-13'}`}>
                {isThreadContext || isQuote ? data.author.name : data.author.handle}
              </span>
              {data.author.verified && <BadgeCheck size={isParent || isQuote ? 12 : 14} className="text-primary fill-primary" />}
              {(isThreadContext || isQuote) && !isParent && <span className="text-on-surface-variant text-xs">@{data.author.handle}</span>}

              {resolvedIsAuthor && !isParent && !isQuote && (
                <span className="bg-primary/20 text-primary text-3xs font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/20 ml-1">
                  You
                </span>
              )}

              {headerMeta}
            </div>
            <div className="flex items-center gap-2">
              {isMain && !resolvedIsAuthor && !isParent && !isQuote && (
                <FollowButton handle={data.author.handle} variant="pill" />
              )}
              <span className="text-on-surface-variant text-xs opacity-60">{data.timestamp}</span>
              {!isParent && !isQuote && <IconButton icon={MoreHorizontal} />}
            </div>
          </div>

          {data.isFirstPost && !isQuote && !isParent && <FirstPostBadge />}

          {'isFirstTask' in data && data.isFirstTask && !isQuote && !isParent && <FirstTaskBadge />}

          <div className="mt-1">
            {children}
          </div>
          {!isParent && !isQuote && (
            <div className="flex flex-col gap-1 mt-2">
              <PostActions id={data.id} votes={data.votes} replies={data.replies} reposts={data.reposts} shares={data.shares} />
              {isThreadContext && data.replies > 0 && !isMain && (
                <div className="flex items-center gap-1 mt-1 text-1sm font-bold text-primary/80 hover:text-primary transition-colors">
                  <MessageCircle size={12} />
                  <span>{data.replies} {data.replies === 1 ? 'reply' : 'replies'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

// --- Component Implementations ---

export const FeedItemRenderer: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, isQuote, hasLineBelow }) => {
  const content = (() => {
    if (data.type === 'social') return <SocialPost data={data as SocialPostData} onClick={onClick} />;
    if (data.type === 'task') return <TaskCard data={data as TaskData} onClick={onClick} />;
    if (data.type === 'editorial') return <EditorialCard data={data as EditorialData} onClick={onClick} />;
    return null;
  })();

  if (!content) return null;

  return (
    <FeedItemProvider isMain={isMain} isParent={isParent} isQuote={isQuote} hasLineBelow={hasLineBelow}>
      {content}
    </FeedItemProvider>
  );
};

export const SocialPost: React.FC<{ data: SocialPostData, onClick?: () => void }> = ({ data, onClick }) => {
  const { isMain, isParent, isQuote, hasLineBelow } = useFeedItemContext();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const updateReply = useStore(state => state.updateReply);
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const isDesktop = useStore(state => state.isDesktop);
  const { id: columnId } = React.useContext(ColumnContext);
  const isThreadContext = isMain || isParent || hasLineBelow;
  const spData = data;

  // Check if current user is author of the parent post and this is a pending bid
  const isCreator = currentUser.handle === data.author.handle;
  const canAcceptBid = spData.isBid && spData.bidStatus !== 'accepted' && !isCreator;

  const handleAcceptBid = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (routeId) {
      updateReply<SocialPostData>(routeId, spData.id, { bidStatus: 'accepted' });
    }
  };

  const ThreadBadge = spData.threadCount && spData.threadCount > 1 ? (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-2xs font-black tracking-widest shadow-sm translate-y-[-1px]">
      {spData.threadIndex}/{spData.threadCount}
    </span>
  ) : undefined;

  return (
    <BaseFeedCard
      data={spData}
      onClick={onClick}
      avatarContent={
        <>
          <UserAvatar src={spData.author.avatar} size={isParent || isQuote ? 'sm' : isMain ? 'lg' : 'md'} isOnline={spData.author.isOnline} />
          {spData.replyAvatars && spData.replyAvatars.length > 0 && !isThreadContext && !isQuote && (
            <>
              <div className="w-[1.5px] grow mt-1.5 mb-1 bg-white/10 rounded-full" />
              <div className="relative w-5 h-5 flex items-center justify-center mt-0.5 mb-1.5">
                {spData.replyAvatars.map((av, i) => {
                  const positions = ['left-0 top-0 w-3 h-3', 'right-0 top-0.5 w-2 h-2', 'left-0.5 bottom-0 w-1.5 h-1.5'];
                  return <img key={i} src={av} className={`absolute rounded-full border border-background object-cover ${positions[i] || 'hidden'}`} style={{ zIndex: 3 - i }} referrerPolicy="no-referrer" />;
                })}
              </div>
            </>
          )}
        </>
      }
    >
    {spData.isBid && (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-3 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2 relative z-10">
           <span className="text-2sm uppercase font-black text-emerald-500 tracking-[0.2em] flex items-center gap-1.5">
             <BadgeCheck size={12} className="text-emerald-500" />
             Proposed Bid
           </span>
           <span className="text-xl font-black text-emerald-400 tracking-tight">{spData.bidAmount}</span>
        </div>
        <div className="flex items-center justify-between relative z-10 mt-1">
          {spData.bidStatus === 'accepted' ? (
            <div className="text-2sm bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black tracking-widest uppercase inline-block">Accepted</div>
          ) : (
            <div className="text-2sm bg-white/10 text-white/50 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase inline-block">Pending</div>
          )}
          
          {canAcceptBid && spData.bidStatus !== 'accepted' && (
            <button
              onClick={handleAcceptBid}
              className="bg-emerald-500 hover:bg-emerald-400 text-black text-2sm font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              Accept Bid
            </button>
          )}
        </div>
      </div>
    )}
      {isParent ? (
        <p className="leading-relaxed text-on-surface/90 mb-2 whitespace-pre-wrap text-13 line-clamp-1">
          <RichText text={spData.content} />
          {ThreadBadge && <span className="ml-2">{ThreadBadge}</span>}
        </p>
      ) : (
        <ExpandableText 
          text={spData.content} 
          limit={isMain ? 280 : 160}
          className={`leading-relaxed text-on-surface/90 mb-2 whitespace-pre-wrap ${isMain ? 'text-lg' : 'text-13'}`}
          buttonClassName="text-xs uppercase tracking-widest opacity-80"
          suffix={ThreadBadge}
        />
      )}
      {!isParent && (
        <div className="flex flex-col gap-2 mb-2">
          {spData.images && spData.images.length > 0 && (
            <MediaCarousel images={spData.images} aspect={isMain ? "aspect-[3/4]" : "aspect-[16/9]"} />
          )}
          {spData.video && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <video src={spData.video} controls className="w-full h-auto max-h-80" onClick={(e) => e.stopPropagation()} />
            </div>
          )}
          {spData.voiceNote && (
            <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-2xl border border-white/5 w-full" onClick={(e) => e.stopPropagation()}>
              <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-transform">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
              </button>
              <div className="flex-grow">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3 rounded-full" />
                </div>
                <div className="flex justify-between mt-1 text-2sm text-on-surface-variant font-medium">
                  <span>0:12</span><span>{spData.voiceNote}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {spData.quote && !isParent && (
        <div onClick={(e) => {
          if (isMain) {
            e.stopPropagation();
            if (isDesktop) openColumn(`/post/${spData.quote.id}`, columnId);
            else navigate(`/post/${spData.quote.id}`);
          }
        }}>
          <FeedItemRenderer data={spData.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};

export const TaskCard: React.FC<{ data: TaskData, onClick?: () => void }> = ({ data, onClick }) => {
  const { isMain, isParent, isQuote, hasLineBelow } = useFeedItemContext();
  const navigate = useNavigate();
  const task = data;
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const isDesktop = useStore(state => state.isDesktop);
  const { id: columnId } = React.useContext(ColumnContext);
  const isCreator = task.author.handle === currentUser.handle;
  const isThreadContext = isMain || isParent || hasLineBelow;
  return (
    <BaseFeedCard
      data={task}
      onClick={onClick}
      headerMeta={
        task.status && !isParent && (
          <TagBadge variant="primary" className="text-2xs px-1 ml-1">
            {task.status}
          </TagBadge>
        )
      }
      avatarContent={
        <>
          <UserAvatar src={task.author.avatar} size={isQuote ? 'sm' : isParent ? 'sm' : isMain ? 'lg' : 'md'} isOnline={task.author.isOnline} />
          {!isThreadContext && !isQuote && (
            <>
              <div className="w-[1.5px] grow mt-1.5 mb-1 bg-white/10 rounded-full" />
              <div className="mt-0.5 mb-1.5 w-5 h-5 rounded-full glass flex items-center justify-center text-primary">
                <div className="scale-[0.6]">{task.icon}</div>
              </div>
            </>
          )}
        </>
      }
    >
      {!isParent ? (
        <div className={`${isQuote ? "mt-0.5 mb-1" : "glass p-3 rounded-2xl mb-2 mt-0.5"} pointer-events-auto`}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-2xs uppercase tracking-[0.1em] text-on-surface-variant/80 font-bold">{task.category}</div>
            <div className="text-primary font-bold text-xs tracking-tight">{task.price}</div>
          </div>
          <h3 className="font-bold text-13 text-on-surface mb-0.5">{task.title}</h3>
          <ExpandableText
            text={task.description}
            limit={100}
            className="text-xs text-on-surface-variant leading-relaxed mb-1"
            buttonClassName="text-2sm uppercase tracking-widest"
          />
          
          {(task.mapUrl || (task.images && task.images.length > 0) || task.video || task.voiceNote) && (
            <div className="mt-2 flex flex-col gap-1.5">
              {task.mapUrl && (
                <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/10 group">
                  <img src={task.mapUrl} alt="Static Map preview" className="w-full h-full object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-2.5">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-2xs font-black text-on-surface uppercase tracking-widest flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <MapPin size={10} className="text-primary" /> Static Route
                      </span>
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center backdrop-blur-md border border-primary/20">
                        <Navigation size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {task.images && task.images.length > 0 && (
                <MediaCarousel images={task.images} aspect="aspect-[21/9]" className="rounded-lg overflow-hidden border border-white/10" />
              )}
            </div>
          )}

          {!isQuote && (
            <div className="flex items-center justify-between mt-2">
              <div className="text-1sm text-on-surface-variant/70 font-medium">
                {task.meta}
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className="bg-on-surface text-background font-bold text-xs px-3 py-1 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-sm"
              >
                {isCreator ? 'Manage' : (task.category === 'Repair Needed' ? 'Bid' : 'Claim')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-13 line-clamp-1 text-on-surface-variant mb-1">
          <span className="font-bold text-primary mr-1">Task:</span> {task.title}
        </div>
      )}
      {task.quote && !isParent && (
        <div onClick={(e) => {
          if (isMain) {
            e.stopPropagation();
            if (isDesktop) openColumn(`/post/${task.quote.id}`, columnId);
            else navigate(`/post/${task.quote.id}`);
          }
        }}>
          <FeedItemRenderer data={task.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};

export const EditorialCard: React.FC<{ data: EditorialData, onClick?: () => void }> = ({ data, onClick }) => {
  const { isMain, isParent, isQuote } = useFeedItemContext();
  const navigate = useNavigate();
  const ed = data;
  const openColumn = useStore(state => state.openColumn);
  const isDesktop = useStore(state => state.isDesktop);
  const { id: columnId } = React.useContext(ColumnContext);
  return (
    <BaseFeedCard
      data={ed}
      onClick={onClick}
      avatarContent={
        isParent || isMain || isQuote ? null : (
          <div className="w-8 h-8 rounded-full glass flex items-center justify-center z-10">
            <span className="text-2xs font-bold text-on-surface-variant">DS</span>
          </div>
        )
      }
    >
      {!isParent ? (
        <div className={isQuote ? "mt-0.5 mb-1" : "glass p-3 rounded-2xl mb-2 mt-0.5"}>
          <div className="text-2xs uppercase tracking-[0.12em] text-primary font-black mb-1.5">{ed.tag}</div>
          <h2 className={`font-bold text-on-surface leading-tight mb-1.5 ${isMain ? 'text-xl' : 'text-base'}`}>{ed.title}</h2>
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {ed.excerpt}
          </p>
        </div>
      ) : (
        <div className="text-13 line-clamp-1 text-on-surface-variant mb-1">
          <span className="font-bold text-emerald-500 mr-1">Editorial:</span> {ed.title}
        </div>
      )}
      {ed.quote && !isParent && (
        <div onClick={(e) => {
          if (isMain) {
            e.stopPropagation();
            if (isDesktop) openColumn(`/post/${ed.quote.id}`, columnId);
            else navigate(`/post/${ed.quote.id}`);
          }
        }}>
          <FeedItemRenderer data={ed.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};
```

## File: src/App.tsx
```typescript
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate, useRoutes, Routes, Route } from 'react-router-dom';
import {
  Home,
  Search,
  Plus,
  User,
  MessageCircle,
  ChevronRight,
  ClipboardList,
  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingCart,
  UserCircle,
  FileText,
  Zap,
  CreditCard,
  Pencil,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarPage } from '@/src/features/gigs/pages/Radar.Page';
import { CreateModal } from '@/src/features/creation/components/CreateModal.Component';
import { ChatRoom } from '@/src/features/chat/components/ChatRoom.Component';
import { ProfilePage } from '@/src/features/profile/pages/Profile.Page';
import { ReviewOrder } from '@/src/features/gigs/pages/ReviewOrder.Page';
import { PaymentPage } from '@/src/features/gigs/pages/Payment.Page';
import { CreatePostPage } from '@/src/features/feed/pages/CreatePost.Page';
import { PostDetailPage } from '@/src/features/feed/pages/PostDetail.Page';
import { PageSlide } from '@/src/shared/ui/SharedUI.Component';
import { HomePage } from '@/src/features/feed/pages/Home.Page';
import { SettingsPage } from '@/src/features/settings/pages/Settings.Page';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { AppColumn, Author } from '@/src/shared/types/domain.type';

const ProfileRoute = () => {
  const { state } = useContext(ColumnContext);
  const user = state?.user as Author | undefined;
  // In the Kanban layout, we don't need PageSlide for profiles, it just renders in the column
  return <div className="pb-20 h-full overflow-y-auto hide-scrollbar"><ProfilePage user={user} /></div>;
};

// Route configuration shared across columns
const columnRoutes = [
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

// Custom hook to provide location-like API from column context
const useColumnLocation = () => {
  const { path, state } = useContext(ColumnContext);
  return {
    pathname: path,
    state,
    search: '',
    hash: '',
    key: 'default'
  };
};

// Component that renders routes for a column using useRoutes
const ColumnRoutes = ({ path }: { path: string }) => {
  const routes = useRoutes(columnRoutes, path);
  return routes;
};

const getColumnMeta = (path: string): { icon: React.ElementType; label: string } => {
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
  // Check column state for profile/user context
  return { icon: Search, label: 'Column' };
};

const KanbanColumn = ({ col, index, total }: { col: AppColumn, index: number, total: number }) => {
  const closeColumn = useStore(state => state.closeColumn);
  const setColumnWidth = useStore(state => state.setColumnWidth);
  const columns = useStore(state => state.columns);
  const [isResizing, setIsResizing] = useState(false);
  const colRef = useRef<HTMLDivElement>(null);

  const meta = getColumnMeta(col.path);
  const Icon = meta.icon;
  const isFirst = index === 0;
  const canClose = !isFirst;

  // Get title from column state if available (e.g. profile user name)
  const title = (col.state?.user as Author | undefined)?.name || meta.label;

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !colRef.current) return;
      const newWidth = e.clientX - colRef.current.getBoundingClientRect().left;
      if (newWidth > 320 && newWidth < 800) {
        setColumnWidth(col.id, newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, col.id, setColumnWidth]);

  return (
    <ColumnContext.Provider value={{ id: col.id, path: col.path, state: col.state }}>
      <div
        ref={colRef}
        className="kanban-column-wrapper"
        style={{ width: col.width }}
      >
        <div className={`kanban-column-content ${isResizing ? 'pointer-events-none opacity-80 scale-[0.98]' : ''} transition-transform`}>

          {/* Column Header Bar */}
          <div className="kanban-col-header">
            <div className="kanban-col-header-left">
              <div className="kanban-col-header-icon">
                <Icon size={14} />
              </div>
              <span className="kanban-col-header-title">{title}</span>
            </div>
            <div className="kanban-col-header-right">
              {total > 1 && (
                <span className="kanban-col-header-badge">{index + 1}/{total}</span>
              )}
              {canClose && (
                <button onClick={() => closeColumn(col.id)} className="kanban-col-close-btn">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Column Routes */}
          <div className="flex-1 overflow-y-auto hide-scrollbar relative">
            <ColumnRoutes path={col.path} />
          </div>
        </div>

        {/* Resizer Handle */}
        <div className="kanban-resizer" onMouseDown={startResize} />
      </div>
    </ColumnContext.Provider>
  );
};

const FloatingSidebar = () => {
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

const DesktopKanbanLayout = () => {
  const columns = useStore(state => state.columns);
  const openColumn = useStore(state => state.openColumn);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newly spawned column
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [columns.length]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-surface relative">
      <FloatingSidebar />
      <div
        ref={containerRef}
        className="kanban-container hide-scrollbar"
      >
        <AnimatePresence initial={false}>
          {columns.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-full"
            >
              <KanbanColumn col={col} index={index} total={columns.length} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => openColumn('/')}
          className="kanban-add-btn"
          title="Open new feed column"
        >
          <Plus size={24} className="kanban-add-btn-icon" />
        </button>
      </div>
    </div>
  );
};

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);

  return (
    <div className="min-h-[100dvh] bg-background text-on-surface flex flex-col max-w-2xl mx-auto shadow-2xl relative">
      <main className="flex-grow pb-20 relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review-order" element={<ReviewOrder />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/task/:id" element={<PostDetailPage />} />
          <Route path="/orders" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Orders View</div>} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/messages" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>} />
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
