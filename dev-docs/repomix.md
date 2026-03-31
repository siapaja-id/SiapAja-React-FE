# Directory Structure
```
src/
  features/
    feed/
      components/
        FeedItems.Component.tsx
        TaskMainContent.Component.tsx
      pages/
        CreatePost.Page.tsx
        PostDetail.Page.tsx
      types/
        feed.types.ts
  shared/
    constants/
      domain.constant.tsx
    types/
      domain.type.ts
      ui.types.ts
    ui/
      PostActions.Component.tsx
      SharedUI.Component.tsx
  store/
    app.slice.ts
    feed.slice.ts
    main.store.ts
  App.tsx
```

# Files

## File: src/features/feed/types/feed.types.ts
```typescript
import { FeedItem } from '@/src/shared/types/domain.type';

export interface FeedItemProps {
  data: FeedItem;
  onClick?: () => void;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  isQuote?: boolean;
}

export interface MediaCarouselProps {
  images: string[];
  className?: string;
  aspect?: string;
}

export interface ThreadBlock {
  id: string;
  content: string;
}
```

## File: src/store/main.store.ts
```typescript
import { create } from 'zustand';
import { AppSlice, createAppSlice } from './app.slice';
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

## File: src/shared/types/ui.types.ts
```typescript
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emerald' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export interface UserAvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isOnline?: boolean;
}

export interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

export interface TagBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'emerald' | 'default';
  className?: string;
}

export interface ExpandableTextProps {
  text: string;
  limit?: number;
  className?: string;
  buttonClassName?: string;
  suffix?: React.ReactNode;
}

export interface CheckoutHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

export interface CheckoutLayoutProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export interface DetailHeaderProps {
  onBack?: () => void;
  title: string;
  subtitle?: string;
  rightNode?: React.ReactNode;
  contentType?: string;
  viewCount?: number | string;
  currentlyViewing?: number | string;
}

export interface ReplyInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  buttonText?: string;
  avatarUrl?: string;
  onExpand?: () => void;
  onSubmit?: () => void;
}

export interface IconButtonProps {
  icon: React.ElementType;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  activeColor?: string;
  hoverBg?: string;
}

export interface PostActionsProps {
  id: string;
  votes: number;
  replies: number;
  reposts: number;
  shares: number;
  className?: string;
}
```

## File: src/shared/ui/PostActions.Component.tsx
```typescript
import React from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Repeat2, Send } from 'lucide-react';
import { IconButtonProps, PostActionsProps } from '@/src/shared/types/ui.types';
import { useStore } from '@/src/store/main.store';

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon, 
  count, 
  active, 
  onClick, 
  className = "",
  activeColor = "text-primary",
  hoverBg = "hover:bg-white/10"
}) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`flex items-center gap-1 p-1.5 -ml-1.5 rounded-full transition-all duration-200 active:scale-90 group ${hoverBg} ${className} ${active ? activeColor : 'text-on-surface-variant hover:text-on-surface'}`}
  >
    <Icon 
      size={18} 
      strokeWidth={active ? 2.5 : 2}
      className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'fill-current' : ''}`} 
    />
    {count !== undefined && count > 0 && (
      <span className="text-xs font-medium tracking-tight">
        {count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}
      </span>
    )}
  </button>
);

export const PostActions: React.FC<PostActionsProps> = ({
  id,
  votes,
  replies,
  reposts,
  shares,
  className = ""
}) => {
  const voteValue = useStore(state => state.userVotes[id] || 0);
  const isReposted = useStore(state => state.userReposts.includes(id));
  const toggleVote = useStore(state => state.toggleVote);
  const toggleRepost = useStore(state => state.toggleRepost);

  const currentVotes = votes + voteValue;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVote(id, 1);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVote(id, -1);
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-0.5 sm:gap-2">
        <IconButton
          icon={MessageCircle}
          count={replies}
          hoverBg="hover:bg-blue-500/10"
          activeColor="text-blue-500"
        />
        <IconButton
          icon={Repeat2}
          count={reposts + (isReposted ? 1 : 0)}
          active={isReposted}
          onClick={() => toggleRepost(id)}
          hoverBg="hover:bg-emerald-500/10"
          activeColor="text-emerald-500"
        />
        <IconButton
          icon={Send}
          count={shares}
          hoverBg="hover:bg-purple-500/10"
          activeColor="text-purple-500"
        />
      </div>

      {/* Vote Pill */}
      <div
        className="flex items-center bg-white/5 hover:bg-white/10 transition-colors rounded-full border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleUpvote}
          className={`p-1.5 pl-2 rounded-l-full flex items-center justify-center transition-all active:scale-90 ${voteValue === 1 ? 'text-orange-500' : 'text-on-surface-variant hover:text-orange-500 hover:bg-white/5'}`}
        >
          <ArrowBigUp size={18} className={voteValue === 1 ? 'fill-current' : ''} strokeWidth={voteValue === 1 ? 2.5 : 2} />
        </button>
        <span className={`px-1 text-xs font-bold min-w-[1.2rem] text-center tracking-tight ${voteValue === 1 ? 'text-orange-500' : voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant'}`}>
          {Math.abs(currentVotes) >= 1000 ? `${(currentVotes/1000).toFixed(1)}k` : currentVotes}
        </span>
        <button
          onClick={handleDownvote}
          className={`p-1.5 pr-2 rounded-r-full flex items-center justify-center transition-all active:scale-90 ${voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant hover:text-indigo-400 hover:bg-white/5'}`}
        >
          <ArrowBigDown size={18} className={voteValue === -1 ? 'fill-current' : ''} strokeWidth={voteValue === -1 ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
};
```

## File: src/shared/types/domain.type.ts
```typescript
import React from 'react';
import { TaskStatus } from '@/src/shared/constants/domain.constant';

export type TabState = 'for-you' | 'around-you';

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
  matchType?: 'instant' | 'bidding';
  locations?: string[];
}
```

## File: src/features/feed/pages/CreatePost.Page.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Film, BarChart2, Smile, Plus, Trash2, Globe, Sparkles } from 'lucide-react';
import { UserAvatar, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { SocialPostData } from '@/src/shared/types/domain.type';

const MAX_CHARS = 280;

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const creationContext = useStore(state => state.creationContext);
  const addReply = useStore(state => state.addReply);
  const addFeedItem = useStore(state => state.addFeedItem);
  const setCreationContext = useStore(state => state.setCreationContext);
  
  const [threads, setThreads] = useState<ThreadBlock[]>([{ id: '1', content: '' }]);
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const replyContext = creationContext;

  const onBack = () => {
    setCreationContext(null);
    navigate(-1);
  };

  const addThread = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setThreads([...threads, { id: newId, content: '' }]);
    setActiveThreadIndex(threads.length);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const removeThread = (index: number) => {
    if (threads.length > 1) {
      const newThreads = threads.filter((_, i) => i !== index);
      setThreads(newThreads);
      setActiveThreadIndex(Math.max(0, index - 1));
    }
  };

  const updateThread = (index: number, content: string) => {
    const newThreads = [...threads];
    newThreads[index].content = content;
    setThreads(newThreads);
  };

  const handlePost = () => {
    const content = threads.map(t => t.content).join('\n\n');
    if (!content.trim()) return;

    const newItem: SocialPostData = {
      id: Math.random().toString(),
      type: 'social',
      author: useStore.getState().currentUser,
      content,
      timestamp: 'Just now',
      replies: 0, reposts: 0, shares: 0, votes: 0
    };

    if (replyContext?.parentId) {
      addReply(replyContext.parentId, newItem);
    } else {
      addFeedItem(newItem);
    }
    
    onBack();
  };

  const calculateProgress = (text: string) => {
    return Math.min((text.length / MAX_CHARS) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 border-b border-white/5 glass sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-on-surface"
          >
            <X size={24} />
          </button>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest opacity-50">{replyContext ? 'Reply' : 'New Thread'}</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary font-bold text-sm px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
            Drafts
          </button>
          <button 
            onClick={handlePost}
            disabled={threads.every(t => t.content.trim() === '')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {replyContext ? 'Reply' : 'Post'} <Sparkles size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto hide-scrollbar p-4 md:p-8 pb-40"
      >
        <div className="max-w-2xl mx-auto">
          {replyContext && (
            <div className="flex gap-4 mb-2">
              <div className="flex flex-col items-center pt-1">
                <UserAvatar src={replyContext.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${replyContext.authorHandle}`} size="lg" className="shadow-sm" />
                <div className="w-[2px] flex-grow bg-white/10 my-2 rounded-full min-h-[40px]" />
              </div>
              <div className="flex-grow pb-6 pt-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-on-surface">@{replyContext.authorHandle}</span>
                  {replyContext.type === 'task' && replyContext.taskPrice && (
                    <span className="text-2sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      {replyContext.taskPrice}
                    </span>
                  )}
                </div>
                {replyContext.type === 'task' && replyContext.taskTitle ? (
                  <div className="bg-surface-container-low border border-white/10 rounded-xl p-3 mt-2 shadow-inner">
                    <h4 className="text-on-surface font-bold text-sm mb-1 leading-tight">{replyContext.taskTitle}</h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2">{replyContext.content}</p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant text-base leading-relaxed line-clamp-3">{replyContext.content}</p>
                )}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {threads.map((thread, index) => {
              const progress = calculateProgress(thread.content);
              const isOverLimit = thread.content.length > MAX_CHARS;
              
              return (
                <motion.div 
                  key={thread.id} 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="relative flex gap-4 group mb-2"
                >
                  {/* Left Rail */}
                  <div className="flex flex-col items-center pt-1">
                    <UserAvatar src="https://picsum.photos/seed/user/100/100" size="lg" className="shadow-sm" />
                    {index < threads.length - 1 && (
                      <div className="w-[2px] flex-grow bg-gradient-to-b from-white/20 to-white/5 my-2 rounded-full" />
                    )}
                  </div>

                  {/* Thread Content */}
                  <div className="flex-grow pb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-on-surface">You</span>
                      {threads.length > 1 && (
                        <button 
                          onClick={() => removeThread(index)}
                          className="p-1.5 text-on-surface-variant/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <AutoResizeTextarea
                      autoFocus={index === activeThreadIndex}
                      value={thread.content}
                      onChange={(e) => updateThread(index, e.target.value)}
                      onFocus={() => setActiveThreadIndex(index)}
                      placeholder={index === 0 ? "What's happening?" : "Add another thought..."}
                      className="w-full text-on-surface text-lg placeholder:text-on-surface-variant/40 leading-relaxed"
                      minHeight={60}
                    />

                    {/* Toolbar & Character Count */}
                    <AnimatePresence>
                      {activeThreadIndex === index && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between mt-3 pt-3 border-t border-white/5"
                        >
                          <div className="flex items-center gap-1 text-primary">
                            {[ImageIcon, Film, BarChart2, Smile].map((Icon, i) => (
                              <button key={i} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                                <Icon size={18} />
                              </button>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {thread.content.length > 0 && (
                              <div className="flex items-center gap-3">
                                <div className="relative w-6 h-6 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" fill="none" className="stroke-white/10" strokeWidth="2" />
                                    <circle 
                                      cx="12" cy="12" r="10" fill="none" 
                                      className={`transition-all duration-300 ${isOverLimit ? 'stroke-red-500' : progress > 80 ? 'stroke-yellow-500' : 'stroke-primary'}`}
                                      strokeWidth="2"
                                      strokeDasharray={`${progress * 0.628} 62.8`}
                                    />
                                  </svg>
                                  {isOverLimit && (
                                    <span className="absolute text-3xs font-bold text-red-500">
                                      {MAX_CHARS - thread.content.length}
                                    </span>
                                  )}
                                </div>
                                <div className="w-[1px] h-6 bg-white/10" />
                                <button 
                                  onClick={addThread}
                                  className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                >
                                  <Plus size={14} strokeWidth={3} />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Thread Trigger (Only show if last thread is not empty and not active) */}
          {threads[threads.length - 1].content.length > 0 && activeThreadIndex !== threads.length - 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 group cursor-pointer mt-2" 
              onClick={addThread}
            >
              <div className="flex flex-col items-center pt-1">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-on-surface-variant group-hover:bg-white/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                  <Plus size={20} />
                </div>
              </div>
              <div className="flex-grow pt-2.5">
                <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">Add to thread</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Footer Settings */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high/90 backdrop-blur-md rounded-full text-xs font-bold text-primary uppercase tracking-widest shadow-2xl border border-white/10 pointer-events-auto cursor-pointer hover:bg-surface-container-highest transition-colors"
        >
          <Globe size={14} />
          <span>Everyone can reply</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
```

## File: src/store/feed.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { FeedItem, TaskData } from '@/src/shared/types/domain.type';
import { SAMPLE_DATA, TASK_STATUS, TaskStatus } from '@/src/shared/constants/domain.constant';

export interface FeedFilters {
  statusFilter?: TaskStatus[];
  categoryFilter?: string[];
  typeFilter?: ('social' | 'task' | 'editorial')[];
  searchQuery?: string;
}

export interface FeedSlice {
  // State
  feedItems: FeedItem[];
  replies: Record<string, FeedItem[]>;
  filters: FeedFilters;
  isLoading: boolean;
  lastUpdated: number | null;

  // Basic CRUD operations
  addFeedItem: (item: FeedItem) => void;
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => void;
  removeFeedItem: (id: string) => void;
  
  // Reply operations
  addReply: (parentId: string, reply: FeedItem) => void;
  setReplies: (parentId: string, replies: FeedItem[]) => void;
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => void;
  removeReply: (parentId: string, replyId: string) => void;

  // Engagement operations (real-time updates)
  incrementVotes: (id: string, parentId?: string) => void;
  decrementVotes: (id: string, parentId?: string) => void;
  incrementReplies: (id: string, parentId?: string) => void;
  incrementReposts: (id: string, parentId?: string) => void;
  incrementShares: (id: string, parentId?: string) => void;

  // Task-specific operations
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  assignTask: (id: string, worker: TaskData['assignedWorker'], bidAmount: string) => void;
  getTasksByStatus: (status: TaskStatus) => TaskData[];

  // Filter operations
  setFilters: (filters: FeedFilters) => void;
  clearFilters: () => void;
  getFilteredItems: () => FeedItem[];

  // Utility operations
  getItemById: (id: string) => FeedItem | undefined;
  setLoading: (loading: boolean) => void;
  refreshFeed: () => void;
  resetFeed: () => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set, get) => ({
  // Initial state
  feedItems: SAMPLE_DATA,
  replies: {},
  filters: {},
  isLoading: false,
  lastUpdated: Date.now(),

  // Basic CRUD operations
  addFeedItem: (item) => set((state) => ({ 
    feedItems: [item, ...state.feedItems],
    lastUpdated: Date.now()
  })),
  
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, ...updates } as FeedItem : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),
  
  removeFeedItem: (id: string) => set((state) => ({
    feedItems: state.feedItems.filter(item => item.id !== id),
    lastUpdated: Date.now()
  })),

  // Reply operations
  addReply: (parentId: string, reply: FeedItem) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    return {
      replies: {
        ...state.replies,
        [parentId]: [reply, ...existingReplies]
      },
      lastUpdated: Date.now()
    };
  }),
  
  setReplies: (parentId: string, replies: FeedItem[]) => set((state) => ({
    replies: { ...state.replies, [parentId]: replies },
    lastUpdated: Date.now()
  })),
  
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    const newReplies = existingReplies.map(r =>
      r.id === replyId ? { ...r, ...updates } as FeedItem : r
    );
    return {
      replies: {
        ...state.replies,
        [parentId]: newReplies
      },
      lastUpdated: Date.now()
    };
  }),

  removeReply: (parentId: string, replyId: string) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    return {
      replies: {
        ...state.replies,
        [parentId]: existingReplies.filter(r => r.id !== replyId)
      },
      lastUpdated: Date.now()
    };
  }),

  // Engagement operations (real-time updates)
  incrementVotes: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  decrementVotes: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id && (item.votes || 0) > 0 
          ? { ...item, votes: item.votes - 1 } 
          : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && (item.votes || 0) > 0 
        ? { ...item, votes: item.votes - 1 } 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementReplies: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, replies: (item.replies || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, replies: (item.replies || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementReposts: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, reposts: (item.reposts || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, reposts: (item.reposts || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementShares: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, shares: (item.shares || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, shares: (item.shares || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  // Task-specific operations
  updateTaskStatus: (id: string, status: TaskStatus) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && item.type === 'task' 
        ? { ...item, status } as TaskData 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  assignTask: (id: string, worker: TaskData['assignedWorker'], bidAmount: string) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && item.type === 'task' 
        ? { 
            ...item, 
            status: TASK_STATUS.ASSIGNED,
            assignedWorker: worker,
            acceptedBidAmount: bidAmount
          } as TaskData 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  getTasksByStatus: (status: TaskStatus) => {
    const state = get();
    return state.feedItems.filter(
      (item): item is TaskData => item.type === 'task' && item.status === status
    );
  },

  // Filter operations
  setFilters: (filters: FeedFilters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    lastUpdated: Date.now()
  })),

  clearFilters: () => set(() => ({
    filters: {},
    lastUpdated: Date.now()
  })),

  getFilteredItems: () => {
    const state = get();
    const { feedItems, filters } = state;
    let filtered = [...feedItems];

    if (filters.statusFilter && filters.statusFilter.length > 0) {
      filtered = filtered.filter(item => 
        item.type !== 'task' || filters.statusFilter!.includes(item.status as TaskStatus)
      );
    }

    if (filters.categoryFilter && filters.categoryFilter.length > 0) {
      filtered = filtered.filter(item => 
        item.type !== 'task' || filters.categoryFilter!.includes(item.category)
      );
    }

    if (filters.typeFilter && filters.typeFilter.length > 0) {
      filtered = filtered.filter(item => 
        filters.typeFilter!.includes(item.type)
      );
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (item.type === 'social') return item.content.toLowerCase().includes(query);
        if (item.type === 'task') return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
        if (item.type === 'editorial') return item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query);
        return false;
      });
    }

    return filtered;
  },

  // Utility operations
  getItemById: (id: string) => {
    const state = get();
    return state.feedItems.find(item => item.id === id);
  },

  setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),

  refreshFeed: () => set(() => ({
    feedItems: SAMPLE_DATA,
    lastUpdated: Date.now()
  })),

  resetFeed: () => set(() => ({
    feedItems: SAMPLE_DATA,
    replies: {},
    filters: {},
    isLoading: false,
    lastUpdated: Date.now()
  })),
});
```

## File: src/shared/constants/domain.constant.tsx
```typescript
import React from 'react';
import { Palette, Code, Car, FileText, Truck, PenTool, Package, MapPin } from 'lucide-react';
import { Author, FeedItem, Gig, ChatMessage, TaskData } from '@/src/shared/types/domain.type';

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

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

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

## File: src/shared/ui/SharedUI.Component.tsx
```typescript
import React, { useEffect, useRef, useState, useLayoutEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Users, Maximize2, Link as LinkIcon, Lock, PhoneOff, Globe, UserPlus, UserCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'emerald' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}> = ({ children, variant = 'primary', size = 'md', fullWidth = false, className = "", ...props }) => {
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

interface FeedItemContextType {
  isMain: boolean;
  isParent: boolean;
  isQuote: boolean;
  hasLineBelow: boolean;
}

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

export const UserAvatar: React.FC<{ 
  src: string; 
  alt?: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string;
  isOnline?: boolean;
}> = ({ src, alt = "User avatar", size = 'md', className = "", isOnline }) => {
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

export const AutoResizeTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { minHeight?: number; maxHeight?: number }> = ({ minHeight = 44, maxHeight = 120, className = "", style, ...props }) => {
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

export const TagBadge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'emerald' | 'default'; className?: string }> = ({ children, variant = 'default', className = "" }) => {
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

export const ExpandableText: React.FC<{ 
  text: string; 
  limit?: number; 
  className?: string;
  buttonClassName?: string;
  suffix?: React.ReactNode;
}> = ({ text, limit = 160, className = "", buttonClassName = "", suffix }) => {
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

export const CheckoutHeader: React.FC<{
  title: string;
  subtitle: string;
  onBack?: () => void;
}> = ({ title, subtitle, onBack }) => {
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

export const CheckoutLayout: React.FC<{
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, onBack, children }) => (
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

export const DetailHeader: React.FC<{
  onBack?: () => void;
  title: string;
  subtitle?: string;
  rightNode?: React.ReactNode;
  contentType?: string;
  viewCount?: number | string;
  currentlyViewing?: number | string;
  className?: string;
}> = ({
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

export const ReplyInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  buttonText?: string;
  avatarUrl?: string;
  onExpand?: () => void;
  onSubmit?: () => void;
}> = ({ value, onChange, placeholder, buttonText = "Reply", avatarUrl = "https://picsum.photos/seed/user/100/100", onExpand, onSubmit }) => (
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

## File: src/features/feed/components/TaskMainContent.Component.tsx
```typescript
import React, { useState } from 'react';
import { BadgeCheck, MapPin, Clock, ShieldCheck, Star, Navigation, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { MediaCarousel } from '@/src/features/feed/components/FeedItems.Component';
import { UserAvatar, TagBadge, ExpandableText, FirstPostBadge, FirstTaskBadge } from '@/src/shared/ui/SharedUI.Component';
import { PostActions } from '@/src/shared/ui/PostActions.Component';
import { TaskData } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';

export const TaskMainContent: React.FC<{ task: TaskData }> = ({ task }) => {
  const navigate = useNavigate();
  const updateFeedItem = useStore(state => state.updateFeedItem);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const handleClaim = () => {
    updateFeedItem<TaskData>(task.id, { status: 'Claimed' });
  };

  const markdownBody = task.description.length < 100 ? `
### Task Overview
${task.description}

### Requirements
- Must have own transportation
- Previous experience preferred
- Available during business hours

### Location Details
**Pickup:** Downtown Hub
**Dropoff:** Midtown Square
*Distance: ~2.4 miles*

> Please ensure all items are handled with care. Fragile items are included in this request.
  ` : task.description;

  const taskStatus = task.taskStatus || 'open';
  const statuses = [
    { id: 'open', label: 'Open' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Reviewing' },
    { id: 'finished', label: 'Finished' }
  ];
  const currentIndex = statuses.findIndex(s => s.id === taskStatus);

  return (
    <div className="relative pb-4">
      {/* Depth background gradient */}
      <div className="absolute top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-transparent pointer-events-none" />

      <div className="px-5 pt-6 pb-2 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar src={task.author.avatar} alt={task.author.name} size="xl" className="ring-2 ring-white/10 shadow-2xl" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-on-surface tracking-tight">{task.author.name}</span>
                {task.author.verified && <BadgeCheck size={16} className="text-primary fill-primary" />}
              </div>
              <div className="text-on-surface-variant text-13 font-medium">@{task.author.handle}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-black text-on-surface tracking-tighter">{task.price}</div>
            {task.status && (
              <TagBadge variant="primary" className="mt-1 shadow-sm px-2 py-0.5 text-2sm">
                {task.status}
              </TagBadge>
            )}
          </div>
        </div>

        {task.isFirstPost && <div className="mb-4"><FirstPostBadge /></div>}

        {task.isFirstTask && <div className="mb-4"><FirstTaskBadge /></div>}

        {/* Info Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <div className="scale-[0.6]">{task.icon}</div>
          </div>
          <div className="text-2sm uppercase tracking-[0.15em] text-on-surface-variant font-black">{task.category}</div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="text-1sm text-on-surface-variant font-bold flex items-center gap-1"><Clock size={12} />{task.timestamp}</div>
        </div>

        <h2 className="text-26 font-black text-on-surface leading-[1.15] tracking-tight mb-6">{task.title}</h2>

        {/* Trust Card */}
        <div className="relative overflow-hidden rounded-[24px] p-5 mb-6 glass shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent -mr-10 -mt-10 pointer-events-none" />
          <div className="flex gap-4 relative z-10">
            <div className="flex-1">
              <span className="text-2sm uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Requester Rating</span>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star size={18} className="fill-yellow-500" />
                <span className="text-lg font-black text-on-surface tracking-tight">4.9</span>
                <span className="text-1sm text-on-surface-variant font-bold">(124)</span>
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1">
              <span className="text-2sm uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Payment</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-black tracking-wide">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        {task.taskStatus && (
          <div className="mb-6 bg-surface-container border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent -mr-10 -mt-10 pointer-events-none" />
            <div className="flex justify-between items-center relative mb-8 mt-2">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />
               <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-out" style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }} />
               {statuses.map((s, i) => (
                  <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
                     <div className={`w-3.5 h-3.5 rounded-full border-[2.5px] transition-colors duration-500 ${i <= currentIndex ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-surface-container border-white/20'}`} />
                     <span className={`text-2xs font-black uppercase tracking-widest absolute -bottom-5 whitespace-nowrap ${i <= currentIndex ? 'text-emerald-400' : 'text-on-surface-variant/40'}`}>{s.label}</span>
                  </div>
               ))}
            </div>
            {task.assignedWorker && (
               <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                     <UserAvatar src={task.assignedWorker.avatar} size="md" className="ring-2 ring-emerald-500/20" />
                     <div>
                        <div className="text-2xs uppercase tracking-[0.2em] font-black text-on-surface-variant/60">Assigned To</div>
                        <div className="text-sm font-bold text-on-surface">@{task.assignedWorker.handle}</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-2xs uppercase tracking-[0.2em] font-black text-on-surface-variant/60">Agreed Price</div>
                     <div className="text-lg font-black text-emerald-400 tracking-tight">{task.acceptedBidAmount || task.price}</div>
                  </div>
               </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="mb-8">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-on-surface prose-p:leading-relaxed prose-p:text-on-surface-variant/90 prose-li:text-on-surface-variant/90">
            {task.description.length > 500 && !isDescExpanded ? (
              <>
                <Markdown>{task.description.substring(0, 500) + '...'}</Markdown>
                <button 
                  onClick={() => setIsDescExpanded(true)}
                  className="mt-2 text-primary font-black uppercase tracking-[0.2em] text-2sm hover:underline"
                >
                  Show Full Description
                </button>
              </>
            ) : (
              <>
                <Markdown>{markdownBody}</Markdown>
                {task.description.length > 500 && (
                  <button 
                    onClick={() => setIsDescExpanded(false)}
                    className="mt-4 text-on-surface-variant font-black uppercase tracking-[0.2em] text-2sm hover:underline"
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Media Modules */}
        {(task.mapUrl || (task.images && task.images.length > 0) || task.video || task.voiceNote) && (
          <div className="flex flex-col gap-4 mb-8">
            {task.mapUrl && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 shadow-lg bg-surface-container-high flex flex-col group">
                <div className="relative h-40 w-full bg-black">
                  <img src={task.mapUrl} alt="Static Map Route" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-container-high" />
                  <div className="absolute top-4 right-4 bg-black/80 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-2xs font-black text-white tracking-widest uppercase">OSRM Routed</span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-4 relative z-10 -mt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center mt-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
                      <div className="w-0.5 h-8 bg-white/10 rounded-full my-1" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div>
                        <div className="text-2xs text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Pickup Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Downtown Hub (37.7749° N, 122.4194° W)</div>
                      </div>
                      <div>
                        <div className="text-2xs text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Dropoff Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Midtown Square (37.7833° N, 122.4167° W)</div>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="https://maps.google.com/?q=Midtown+Square" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3.5 px-4 rounded-xl font-black text-sm transition-colors border border-primary/20 mt-2"
                  >
                    <Navigation size={16} />
                    Navigate via Google Maps
                    <ExternalLink size={14} className="ml-auto opacity-50" />
                  </a>
                </div>
              </div>
            )}
            {task.images && task.images.length > 0 && (
              <MediaCarousel images={task.images} className="rounded-[24px] overflow-hidden border border-white/10 shadow-lg" />
            )}
            {task.video && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 bg-black shadow-lg">
                <video src={task.video} controls className="w-full h-auto max-h-80" />
              </div>
            )}
            {task.voiceNote && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-surface-container-high to-surface-container rounded-[24px] border border-white/5 shadow-lg">
                <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all">
                  <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-current border-b-[7px] border-b-transparent ml-1" />
                </button>
                <div className="flex-grow">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-primary w-1/3 rounded-full relative">
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md" />
                    </div>
                  </div>
                  <div className="flex justify-between text-2sm text-on-surface-variant font-bold tracking-wider">
                    <span>0:12</span><span>0:45</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {task.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {task.tags.map(tag => (
              <TagBadge key={tag} variant="default" className="px-2.5 py-1 text-2sm rounded-full">{tag}</TagBadge>
            ))}
          </div>
        )}

        <div className="text-center text-1sm text-on-surface-variant/60 font-bold tracking-widest uppercase mb-4">{task.meta}</div>

        <div className="pt-4 border-t border-white/5">
          <PostActions id={task.id} votes={task.votes} replies={task.replies} reposts={task.reposts} shares={task.shares} className="py-1" />
        </div>
      </div>
    </div>
  );
};
```

## File: src/features/feed/pages/PostDetail.Page.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown, ArrowLeft, Sparkles, MessageSquareDashed, Maximize2, Check, CheckCircle2, Camera, Star } from 'lucide-react';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide, AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { FeedItem, SocialPostData, TaskData, CreationContext } from '@/src/shared/types/domain.type';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { useStore } from '@/src/store/main.store';
import { CreatePostPage } from './CreatePost.Page';
import { TASK_STATUS, TaskStatus } from '@/src/shared/constants/domain.constant';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const feedItems = useStore(state => state.feedItems);
  const repliesMap = useStore(state => state.replies);
  const setReplies = useStore(state => state.setReplies);
  const addReply = useStore(state => state.addReply);
  const updateReply = useStore(state => state.updateReply);
  const updateFeedItem = useStore(state => state.updateFeedItem);
  const setCreationContext = useStore(state => state.setCreationContext);

  const initialPost = location.state?.post || feedItems.find(p => p.id === id);
  const threadContext = location.state?.thread || [];

  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreenReply, setIsFullscreenReply] = useState(false);

  const currentPost = postStack.length > 0 ? postStack[postStack.length - 1] : initialPost;
  const localReplies = currentPost ? (repliesMap[currentPost.id] || []) : [];

  const taskPriceString = currentPost?.type === 'task' ? (currentPost as TaskData).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [completionNotes, setCompletionNotes] = useState('');

  const isCreator = currentPost?.author.handle === currentUser.handle;

  const handleAcceptBid = (bid: SocialPostData) => {
    if (!currentPost) return;
    updateReply<SocialPostData>(currentPost.id, bid.id, { bidStatus: 'accepted' });
    if (updateFeedItem) {
      updateFeedItem<TaskData>(currentPost.id, {
        taskStatus: TASK_STATUS.ASSIGNED,
        assignedWorker: bid.author,
        acceptedBidAmount: bid.bidAmount
      });
    }
  };

  const handleStartTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.IN_PROGRESS });
  };

  const handleCompleteTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.COMPLETED });
    setShowCompleteModal(false);
  };

  const handleReviewTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.FINISHED });
    setShowReviewModal(false);
  };

  React.useEffect(() => {
    if (initialPost) setPostStack([initialPost]);
  }, [initialPost]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (currentPost && !repliesMap[currentPost.id]) {
      const generated = getReplies(currentPost, (i) => `Simulated insight #${i+1} for @${currentPost.author.handle}`);
      setReplies(currentPost.id, generated);
    }
  }, [currentPost?.id, initialPost, repliesMap, setReplies]);

  const handleBack = () => {
    if (postStack.length > 1) {
      setPostStack(prev => prev.slice(0, -1));
    } else {
      navigate(-1);
    }
  };

  const handleAction = (type: 'bid' | 'accept') => {
    if (type === 'bid') {
      setIsBidding(true);
    } else {
      // Direct Accept Flow
      if (!currentPost) return;
      const newBid: SocialPostData = {
        id: Math.random().toString(),
        type: 'social',
        author: currentUser,
        content: "I'll take it! I'm available to complete this right away.",
        timestamp: 'Just now',
        replies: 0, reposts: 0, shares: 0, votes: 0,
        isBid: true,
        bidAmount: taskPriceString,
        bidStatus: 'accepted'
      };
      addReply(currentPost.id, newBid);
      if (updateFeedItem) {
        updateFeedItem<TaskData>(currentPost.id, {
          taskStatus: TASK_STATUS.ASSIGNED,
          assignedWorker: currentUser,
          acceptedBidAmount: taskPriceString
        });
      }
      if (scrollRef.current) {
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      }
    }
  };

  const handleBidSubmit = () => {
    if (!currentPost) return;
    const newBid: SocialPostData = {
      id: Math.random().toString(),
      type: 'social',
      author: currentUser,
      content: replyText || "I can help with this task!",
      timestamp: 'Just now',
      replies: 0, reposts: 0, shares: 0, votes: 0,
      isBid: true,
      bidAmount: `$${bidAmount.toFixed(2)}`,
      bidStatus: 'pending'
    };
    addReply(currentPost.id, newBid);
    setIsBidding(false);
    setReplyText('');
    setBidAmount(defaultBid);
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  const handleFullscreenReply = (threads?: ThreadBlock[]) => {
    if (!currentPost) return;
    const context: CreationContext = {
      parentId: currentPost.id,
      type: currentPost.type as 'social' | 'task' | 'editorial',
      authorHandle: currentPost.author.handle,
      content: currentPost.type === 'social' ? (currentPost as SocialPostData).content : (currentPost as TaskData).description || '',
      avatarUrl: currentPost.author.avatar,
      taskTitle: currentPost.type === 'task' ? (currentPost as TaskData).title : undefined,
      taskPrice: currentPost.type === 'task' ? (currentPost as TaskData).price : undefined
    };
    setCreationContext(context);
    setIsFullscreenReply(true);
  };



  if (!currentPost) return <div className="p-8 text-center text-on-surface-variant">Post not found</div>;

  return (
    <PageSlide>
      <DetailHeader
        onBack={handleBack} 
        title={currentPost.type === 'task' ? "Task Details" : "Thread"} 
        subtitle={postStack.length > 1 ? `Replying to @${postStack[postStack.length - 2].author.handle}` : undefined} 
        className="bg-surface-container-high/95 border-b border-white/5"
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24 relative">
        {currentPost.type === 'task' && (
           <div 
             className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-surface-container-high pointer-events-none" 
           />
        )}
        
        <div className="pt-2 relative z-10">
          {postStack.slice(0, -1).map((parentPost, index) => (
            <FeedItemRenderer 
              key={parentPost.id} 
              data={parentPost} 
              isParent={true} 
              hasLineBelow={true} 
              onClick={() => setPostStack(prev => prev.slice(0, index + 1))} 
            />
          ))}
        </div>
        
        <div className="relative">
          {currentPost.type === 'task' ? (
            <TaskMainContent task={currentPost as any} />
          ) : (
            <FeedItemRenderer
              data={currentPost}
              isMain={true}
              hasLineBelow={localReplies.length > 0}
            />
          )}
        </div>

        <div className={`flex flex-col ${currentPost.type === 'social' && (currentPost as SocialPostData).threadCount ? '' : 'border-t border-white/5 mt-2'}`}>
          {localReplies.length > 0 && !(currentPost.type === 'social' && (currentPost as SocialPostData).threadCount) && (
            <div className="px-6 py-4 text-1sm uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-white/5">
              {currentPost.type === 'task' ? 'Discussion & Bids' : 'Replies'}
            </div>
          )}
          {localReplies.length > 0 ? (
            localReplies.map((reply, index) => (
              <FeedItemRenderer
                key={reply.id}
                data={reply}
                hasLineBelow={index < localReplies.length - 1}
                onClick={() => setPostStack(prev => [...prev, reply])}
                // The FeedItemRenderer handles its own internal "Accept" button for bids
                // which prevents overlapping with the triple-dot actions menu.
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-16 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="w-24 h-24 mb-6 rounded-full bg-surface-container border border-white/5 flex items-center justify-center relative shadow-lg">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
                {currentPost.type === 'task' ? (
                  <Sparkles size={36} className="text-emerald-400 relative z-10" />
                ) : (
                  <MessageSquareDashed size={36} className="text-primary relative z-10" />
                )}
              </div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight mb-3">
                {currentPost.type === 'task' ? 'No bids yet' : 'Quiet in here...'}
              </h3>
              <p className="text-base text-on-surface-variant max-w-[280px] leading-relaxed mb-6 font-medium">
                {currentPost.type === 'task' 
                  ? isCreator 
                    ? 'Your task is live! Check back soon for bids from interested workers.'
                    : 'This task is waiting for a hero. Submit your bid and secure this opportunity!' 
                  : 'Be the first to share your thoughts and start the conversation.'}
              </p>
              {!isCreator && currentPost.type === 'task' ? (
                <button 
                  onClick={() => handleAction('bid')}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  Place First Bid
                </button>
              ) : currentPost.type !== 'task' ? (
                <button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <MessageSquareDashed size={14} />
                  Write a Reply
                </button>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>

      {currentPost.type === 'task' ? (
        (() => {
          const tData = currentPost as TaskData;
          const tStatus = tData.taskStatus || TASK_STATUS.OPEN;
          const isAssignedToMe = tData.assignedWorker?.handle === currentUser.handle;

          let ActionUI = null;
          if (isCreator) {
            if (tStatus === TASK_STATUS.OPEN) ActionUI = <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Waiting for bids...</div>;
            else if (tStatus === TASK_STATUS.ASSIGNED) ActionUI = <div className="text-1sm font-black text-emerald-400 w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><CheckCircle2 size={14}/> Awaiting Worker to Start</div>;
            else if (tStatus === TASK_STATUS.IN_PROGRESS) ActionUI = <div className="text-1sm font-black text-emerald-400 w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><Sparkles size={14}/> Task in Progress</div>;
            else if (tStatus === TASK_STATUS.COMPLETED) ActionUI = <Button fullWidth onClick={() => setShowReviewModal(true)} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-400 text-black">Review & Release Payment</Button>;
            else if (tStatus === TASK_STATUS.FINISHED) ActionUI = <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
          } else {
            if (tStatus === TASK_STATUS.OPEN) {
              ActionUI = (
                <div className="flex gap-2 w-full">
                  {!isNegotiable ? (
                    <>
                      <Button variant="ghost" onClick={() => handleAction('bid')} className="flex-1">Bid</Button>
                      <Button onClick={() => handleAction('accept')} className="flex-1 shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Accept Instantly</Button>
                    </>
                  ) : (
                    <Button onClick={() => handleAction('bid')} fullWidth className="shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Submit Bid</Button>
                  )}
                </div>
              );
            }
            else if (tStatus === TASK_STATUS.ASSIGNED) {
              if (isAssignedToMe) ActionUI = <Button fullWidth onClick={handleStartTask} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Start Task</Button>;
              else ActionUI = <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Assigned to someone else</div>;
            }
            else if (tStatus === TASK_STATUS.IN_PROGRESS) {
              if (isAssignedToMe) ActionUI = <Button fullWidth onClick={() => setShowCompleteModal(true)} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Mark as Completed</Button>;
              else ActionUI = <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">In progress by another worker</div>;
            }
            else if (tStatus === TASK_STATUS.COMPLETED) {
              if (isAssignedToMe) ActionUI = <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em] bg-white/5 rounded-xl border border-white/10">Waiting for Review...</div>;
              else ActionUI = <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Completed</div>;
            }
            else if (tStatus === TASK_STATUS.FINISHED) {
              if (isAssignedToMe) ActionUI = <div className="text-1sm font-black text-emerald-400 w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><CheckCircle2 size={14}/> Payment Received</div>;
              else ActionUI = <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
            }
          }

          return (
            <div className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5">
              {(tStatus === TASK_STATUS.OPEN || tStatus === TASK_STATUS.ASSIGNED || tStatus === TASK_STATUS.IN_PROGRESS) && (
                <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
                  <AutoResizeTextarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Message or ask a question..."
                    className="w-full bg-transparent border-none py-3 px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
                    minHeight={44}
                    maxHeight={120}
                    rows={1}
                  />
                  {replyText.trim() ? (
                    <Button
                      onClick={() => {
                        if (!currentPost) return;
                        const newReply: FeedItem = {
                          id: Math.random().toString(),
                          type: 'social',
                          author: currentUser,
                          content: replyText,
                          timestamp: 'Just now',
                          replies: 0, reposts: 0, shares: 0, votes: 0
                        };
                        addReply(currentPost.id, newReply);
                        setReplyText('');
                        if (scrollRef.current) setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
                      }}
                      className="mb-1 mr-1 px-4 py-2 shrink-0"
                    >
                      Send
                    </Button>
                  ) : (
                    <button onClick={() => handleFullscreenReply()} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
                      <Maximize2 size={18} />
                    </button>
                  )}
                </div>
              )}
              <div className="w-full">
                {ActionUI}
              </div>
            </div>
          );
        })()
      ) : (
        <ReplyInput
          value={replyText}
          onChange={setReplyText}
          placeholder={`Reply to ${currentPost.author.handle}...`}
          onExpand={handleFullscreenReply}
          onSubmit={() => {
            if (!currentPost) return;
            const newReply: FeedItem = {
              id: Math.random().toString(),
              type: 'social',
              author: currentUser,
              content: replyText,
              timestamp: 'Just now',
              replies: 0, reposts: 0, shares: 0, votes: 0
            };
            addReply(currentPost.id, newReply);
            setReplyText('');
            if (scrollRef.current) {
              setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
            }
          }}
        />
      )}

      <AnimatePresence>
        {isBidding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
          >
            <div className="absolute inset-0" onClick={() => setIsBidding(false)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-on-surface tracking-tight">Submit Your Bid</h3>
                <button onClick={() => setIsBidding(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 mb-6">
                
                {/* Up Bid / Down Bid Stepper Mechanism */}
                <div className="flex items-center justify-between bg-surface-container border border-white/10 rounded-[28px] p-2 shadow-inner">
                  <button 
                    onClick={() => setBidAmount(prev => Math.max(1, prev - 5))}
                    className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-on-surface-variant transition-all active:scale-95"
                  >
                    <Minus size={28} />
                  </button>
                  
                  <div className="flex flex-col items-center flex-grow">
                    <span className="text-2sm uppercase tracking-[0.2em] text-on-surface-variant font-black mb-1">Your Bid</span>
                    <div className="flex items-center justify-center text-5xl font-black text-on-surface tracking-tighter">
                      <span className="text-2xl text-emerald-500 mr-1 -mt-2">$</span>
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="bg-transparent border-none text-center w-28 focus:outline-none focus:ring-0 p-0 m-0 hide-scrollbar"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setBidAmount(prev => prev + 5)}
                    className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-on-surface-variant transition-all active:scale-95"
                  >
                    <Plus size={28} />
                  </button>
                </div>

                {/* Quick Bid Adjustments */}
                <div className="flex justify-center gap-2">
                  <button onClick={() => setBidAmount(prev => Math.max(1, prev - 15))} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1"><TrendingDown size={14}/> Down Bid</button>
                  <button onClick={() => setBidAmount(defaultBid)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface text-xs font-bold transition-colors">Match Original</button>
                  <button onClick={() => setBidAmount(prev => prev + 15)} className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1">Up Bid <TrendingDown size={14} className="rotate-180"/></button>
                </div>

                <textarea 
                  placeholder="Why should they choose you? (Optional)"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 min-h-[100px] resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <button 
                onClick={handleBidSubmit}
                disabled={!bidAmount}
                className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <Send size={18} />
                Place Bid
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
          >
            <div className="absolute inset-0" onClick={() => setShowCompleteModal(false)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-on-surface tracking-tight">Complete Task</h3>
                <button onClick={() => setShowCompleteModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 mb-6">
                <textarea 
                  placeholder="Add completion notes or proof of work..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 min-h-[120px] resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button className="w-full border border-dashed border-white/20 rounded-2xl p-6 text-on-surface-variant hover:bg-white/5 hover:text-white transition-colors flex flex-col items-center justify-center gap-2">
                  <Camera size={24} className="opacity-50" />
                  <span className="text-xs font-bold">Upload Proof Image</span>
                </button>
              </div>
              <Button fullWidth onClick={handleCompleteTask} className="bg-emerald-500 text-black hover:bg-emerald-400">Submit Completion</Button>
            </motion.div>
          </motion.div>
        )}

        {showReviewModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
          >
            <div className="absolute inset-0" onClick={() => setShowReviewModal(false)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-on-surface tracking-tight">Review Work</h3>
                <button onClick={() => setShowReviewModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col items-center mb-6 gap-4">
                <div className="text-sm font-bold text-on-surface-variant">Rate the worker</div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform active:scale-90">
                      <Star size={32} className={star <= reviewRating ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'} />
                    </button>
                  ))}
                </div>
              </div>
              <Button fullWidth onClick={handleReviewTask} className="bg-emerald-500 text-black hover:bg-emerald-400">Release Payment</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreenReply && (
          <CreatePostPage />
        )}
      </AnimatePresence>
    </PageSlide>
  );
};
```

## File: src/store/app.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { TabState, Author, CreationContext } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS } from '@/src/shared/constants/domain.constant';

export type ThemeColor = 'red' | 'blue' | 'emerald' | 'violet' | 'amber';
export type TextSize = 'sm' | 'md' | 'lg';
export type ZoomLevel = 90 | 100 | 110 | 120;

export interface AppColumn {
  id: string;
  path: string;
  width: number;
  state?: any;
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
  columns: AppColumn[];
  openColumn: (path: string, sourceId?: string, state?: any) => void;
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
}

const STORAGE_KEY = 'siapaja-settings';

const VALID_THEME_COLORS: ThemeColor[] = ['red', 'blue', 'emerald', 'violet', 'amber'];
const VALID_TEXT_SIZES: TextSize[] = ['sm', 'md', 'lg'];
const VALID_ZOOM_LEVELS: ZoomLevel[] = [90, 100, 110, 120];

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
import { ColumnContext } from '@/src/App';

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
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useLocation, useNavigate, useRoutes, Routes, Route } from 'react-router-dom';
import {
  Home,
  Search,
  Plus,
  User,
  MessageCircle,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Compass,
  ShoppingCart,
  UserCircle,
  FileText,
  CreditCard,
  Pencil,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GigMatcher } from '@/src/features/gigs/components/GigMatcher.Component';
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

// Context to let components know which column they are in
export const ColumnContext = createContext<{ id: string; path: string; state?: any }>({ id: 'main-col', path: '/' });

const ProfileRoute = () => {
  const { state } = useContext(ColumnContext);
  const user = state?.user;
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
  { path: '/explore', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div> },
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
  if (path === '/explore') return { icon: Compass, label: 'Explore' };
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

const KanbanColumn = ({ col, index, total }: { col: any, index: number, total: number }) => {
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
  const title = col.state?.user?.name || meta.label;

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
    { id: '/explore', icon: Search, label: 'Explore' },
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
          <Route path="/explore" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div>} />
          <Route path="/messages" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>} />
        </Routes>
      </main>

      {['/', '/explore', '/messages', '/profile', '/orders'].includes(location.pathname) && (
        <nav className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass border-t border-white/5 flex justify-around items-center px-4 will-change-transform">
          {[
            { id: '/', icon: Home, label: 'Home' },
            { id: '/explore', icon: Search, label: 'Explore' },
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
  const showMatcher = useStore(state => state.showMatcher);
  const setShowMatcher = useStore(state => state.setShowMatcher);
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
    const timer = setTimeout(() => setShowMatcher(true), 3000);
    return () => clearTimeout(timer);
  }, [setShowMatcher]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsDesktop]);

  return (
    <div style={{ zoom: zoomLevel / 100, minHeight: '100dvh' }}>
      {isDesktop ? <DesktopKanbanLayout /> : <MobileLayout />}

      <AnimatePresence>
        {showMatcher && <GigMatcher />}
        {showCreateModal && <CreateModal />}
        {showChatRoom && <ChatRoom />}
      </AnimatePresence>
    </div>
  );
}
```
