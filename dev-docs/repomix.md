# Directory Structure
```
src/
  features/
    feed/
      components/
        FeedItems.Component.tsx
        TaskMainContent.Component.tsx
      pages/
        PostDetail.Page.tsx
  shared/
    constants/
      domain.constant.tsx
    types/
      domain.type.ts
    ui/
      PostActions.Component.tsx
      SharedUI.Component.tsx
  store/
    feed.slice.ts
```

# Files

## File: src/features/feed/pages/PostDetail.Page.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown, ArrowLeft } from 'lucide-react';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide, AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { FeedItem, SocialPostData } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, feedItems } = useStore();

  const initialPost = location.state?.post || feedItems.find(p => p.id === id);
  const threadContext = location.state?.thread || [];
  
  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>(initialPost ? [initialPost] : []);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const currentPost = postStack[postStack.length - 1];

  const initialReplies = useMemo(() => {
    if (!currentPost) return [];
    return getReplies(currentPost, (i, depth) => 
      depth === 0 
        ? `Interesting point! I think the ${i % 2 === 0 ? 'minimalist' : 'maximalist'} approach really shines here.`
        : `Replying to @${currentPost.author.handle}: That's a great observation about the flow.`
    );
  }, [currentPost?.id]);

  // Extract baseline price from task to set a realistic default bid
  const taskPriceString = currentPost?.type === 'task' ? (currentPost as any).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [localReplies, setLocalReplies] = useState<FeedItem[]>(initialReplies);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const isCreator = currentPost?.author.handle === currentUser.handle;

  const handleAcceptBid = (bidId: string) => {
    setLocalReplies(prev => prev.map(reply => {
      if (reply.id === bidId && reply.type === 'social') {
        return { ...reply, bidStatus: 'accepted' };
      }
      return reply;
    }));
  };

  React.useEffect(() => {
    if (initialPost) setPostStack([initialPost]);
  }, [initialPost]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setLocalReplies(initialReplies);
  }, [currentPost?.id, initialReplies]);

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
      setLocalReplies(prev => [newBid, ...prev]);
      if (scrollRef.current) {
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      }
    }
  };

  const handleBidSubmit = () => {
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
    setLocalReplies(prev => [newBid, ...prev]);
    setIsBidding(false);
    setReplyText('');
    setBidAmount(defaultBid);
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  if (!currentPost) return <div className="p-8 text-center text-on-surface-variant">Post not found</div>;

  return (
    <PageSlide>
      <DetailHeader 
        onBack={handleBack} 
        title={currentPost.type === 'task' ? "Task Details" : "Thread"} 
        subtitle={postStack.length > 1 ? `Replying to @${postStack[postStack.length - 2].author.handle}` : undefined} 
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24">
        <div className="pt-2">
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
            <FeedItemRenderer data={currentPost} isMain={true} hasLineBelow={localReplies.length > 0} />
          )}
        </div>

        <div className={`flex flex-col ${currentPost.type === 'social' && (currentPost as SocialPostData).threadCount ? '' : 'border-t border-white/5 mt-2'}`}>
          {localReplies.length > 0 && !(currentPost.type === 'social' && (currentPost as SocialPostData).threadCount) && (
            <div className="px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-white/5">
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
                canAcceptBid={isCreator && currentPost.type === 'task'}
                onAcceptBid={handleAcceptBid}
              />
            ))
          ) : (
            <div className="p-12 text-center"><p className="text-on-surface-variant text-sm opacity-50">No discussion yet. Be the first to reply!</p></div>
          )}
        </div>
      </div>

      {currentPost.type === 'task' ? (
        <div className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex gap-3 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex-grow relative">
            <AutoResizeTextarea
              id="task-reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:bg-white/10 transition-colors"
              minHeight={44}
              maxHeight={120}
              rows={1}
            />
          </div>
          {replyText.trim() ? (
            <Button 
              onClick={() => {
                const newReply: FeedItem = {
                  id: Math.random().toString(),
                  type: 'social',
                  author: currentUser,
                  content: replyText,
                  timestamp: 'Just now',
                  replies: 0, reposts: 0, shares: 0, votes: 0
                };
                setLocalReplies(prev => [...prev, newReply]);
                setReplyText('');
                if (scrollRef.current) {
                  setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
                }
              }}
              className="mb-1"
            >
              Send
            </Button>
          ) : (
            isCreator ? (
              <div className="flex gap-2 flex-shrink-0 mb-1">
                <Button variant="ghost" onClick={() => alert('Edit task functionality')} className="px-4">Edit</Button>
                <Button onClick={() => alert('Manage bids and task status')} className="px-5 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-400 text-zinc-950">Manage</Button>
              </div>
            ) : (
              <div className="flex gap-2 flex-shrink-0 mb-1">
                {!isNegotiable ? (
                  <>
                    <Button variant="ghost" onClick={() => handleAction('bid')} className="px-4">Bid</Button>
                    <Button onClick={() => handleAction('accept')} className="px-5 shadow-[0_0_20px_rgba(220,38,38,0.3)]">Accept</Button>
                  </>
                ) : (
                  <Button onClick={() => handleAction('bid')} className="px-5 shadow-[0_0_20px_rgba(220,38,38,0.3)]">Submit Bid</Button>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        <ReplyInput 
          value={replyText} 
          onChange={setReplyText} 
          placeholder={`Reply to ${currentPost.author.handle}...`} 
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
                    <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-1">Your Bid</span>
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
    </PageSlide>
  );
};
```

## File: src/shared/types/domain.type.ts
```typescript
import React from 'react';

export type TabState = 'for-you' | 'around-you';

export interface Author {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  karma?: number;
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
  bidStatus?: 'pending' | 'accepted' | 'rejected' | 'completed';
  quote?: FeedItem;
  threadCount?: number;
  threadIndex?: number;
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
}
```

## File: src/shared/ui/PostActions.Component.tsx
```typescript
import React from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Repeat2, Send } from 'lucide-react';

export const IconButton = ({ 
  icon: Icon, 
  count, 
  active, 
  onClick, 
  className = "",
  activeColor = "text-primary",
  hoverBg = "hover:bg-white/10"
}: { 
  icon: any, 
  count?: number, 
  active?: boolean, 
  onClick?: () => void, 
  className?: string,
  activeColor?: string,
  hoverBg?: string
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
      <span className="text-[12px] font-medium tracking-tight">
        {count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}
      </span>
    )}
  </button>
);

export const PostActions = ({ 
  votes, 
  replies, 
  reposts, 
  shares,
  className = "" 
}: { 
  votes: number, 
  replies: number, 
  reposts: number, 
  shares: number,
  className?: string
}) => {
  const [voteValue, setVoteValue] = React.useState<0 | 1 | -1>(0);
  const [isReposted, setIsReposted] = React.useState(false);
  
  const currentVotes = votes + voteValue;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVoteValue(prev => prev === 1 ? 0 : 1);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVoteValue(prev => prev === -1 ? 0 : -1);
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
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
        <span className={`px-1 text-[12px] font-bold min-w-[1.2rem] text-center tracking-tight ${voteValue === 1 ? 'text-orange-500' : voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant'}`}>
          {Math.abs(currentVotes) >= 1000 ? `${(currentVotes/1000).toFixed(1)}k` : currentVotes}
        </span>
        <button 
          onClick={handleDownvote}
          className={`p-1.5 pr-2 rounded-r-full flex items-center justify-center transition-all active:scale-90 ${voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant hover:text-indigo-400 hover:bg-white/5'}`}
        >
          <ArrowBigDown size={18} className={voteValue === -1 ? 'fill-current' : ''} strokeWidth={voteValue === -1 ? 2.5 : 2} />
        </button>
      </div>

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
        onClick={() => setIsReposted(!isReposted)}
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
    </div>
  );
};
```

## File: src/shared/ui/SharedUI.Component.tsx
```typescript
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Users } from 'lucide-react';

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

export const UserAvatar: React.FC<{ src: string; alt?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ src, alt = "User avatar", size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover ring-1 ring-white/10 z-10 bg-background flex-shrink-0 ${className}`} 
      referrerPolicy="no-referrer" 
    />
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
    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider border text-[10px] ${variants[variant]} ${className}`}>
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

  if (!isLong) return <p className={className}>{text}{suffix && <span className="ml-2 inline-flex align-middle">{suffix}</span>}</p>;

  return (
    <div className={className}>
      <span className="inline">
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        {suffix && <span className="ml-2 inline-flex align-middle">{suffix}</span>}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={`ml-1 text-primary font-bold hover:underline focus:outline-none transition-all ${buttonClassName}`}
      >
        {isExpanded ? "show less" : "read more"}
      </button>
    </div>
  );
};

export const CheckoutHeader: React.FC<{ 
  title: string; 
  subtitle: string; 
  onBack: () => void; 
}> = ({ title, subtitle, onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button 
      onClick={onBack}
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

export const CheckoutLayout: React.FC<{
  title: string;
  subtitle: string;
  onBack: () => void;
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
  onBack: () => void; 
  title: string; 
  subtitle?: string;
  rightNode?: React.ReactNode;
  contentType?: string;
  viewCount?: number | string;
  currentlyViewing?: number | string;
}> = ({ 
  onBack, 
  title, 
  subtitle, 
  rightNode,
  contentType,
  viewCount,
  currentlyViewing
}) => {
  const isExcluded = title.toLowerCase().includes('message') || title.toLowerCase().includes('chat');
  const showStats = !isExcluded;
  const type = contentType || (title.toLowerCase().includes('task') ? 'Task' : title.toLowerCase().includes('reply') ? 'Reply' : 'Post');
  const views = viewCount || `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}k`;
  const viewing = currentlyViewing || Math.floor(Math.random() * 40) + 12;

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors shrink-0">
          <ArrowLeft size={20} className="text-on-surface" />
        </button>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold text-on-surface truncate">{title}</h1>
            {showStats && (
              <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-on-surface-variant font-bold shrink-0">
                {type}
              </span>
            )}
          </div>
          {subtitle && <span className="text-[11px] text-on-surface-variant font-medium truncate mt-0.5">{subtitle}</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {showStats && (
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-3 py-1.5 rounded-full shadow-inner">
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
          <div className="sm:hidden flex items-center gap-2 text-[10px] font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-2 py-1 rounded-full shadow-inner">
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
    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    className="fixed inset-0 z-[60] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
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
}> = ({ value, onChange, placeholder, buttonText = "Reply", avatarUrl = "https://picsum.photos/seed/user/100/100" }) => (
  <div className="fixed bottom-0 w-full max-w-2xl glass p-3 flex items-end gap-3 z-20">
    <UserAvatar src={avatarUrl} size="md" className="mb-1" />
    <div className="flex-grow relative">
      <AutoResizeTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:bg-white/10"
        minHeight={44}
        maxHeight={120}
        rows={1}
      />
    </div>
    <Button 
      size="sm"
      disabled={!value.trim()}
      className="mb-1"
    >
      {buttonText}
    </Button>
  </div>
);
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
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton, PostActions } from '@/src/shared/ui/PostActions.Component';
import { UserAvatar, TagBadge, ExpandableText } from '@/src/shared/ui/SharedUI.Component';
import { FeedItem, SocialPostData, TaskData, EditorialData, Author } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS } from '@/src/shared/constants/domain.constant';
import { useStore } from '@/src/store/main.store';

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

export interface FeedItemProps {
  data: FeedItem;
  onClick?: () => void;
  onUserClick?: (user: Author) => void;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  canAcceptBid?: boolean;
  onAcceptBid?: (bidId: string) => void;
  isQuote?: boolean;
}

// --- Components ---

export const MediaCarousel: React.FC<{ images: string[], className?: string, aspect?: string }> = ({ images, className = "", aspect = "aspect-video" }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
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

const BaseFeedCard: React.FC<{
  data: FeedItem;
  onClick?: () => void;
  onUserClick?: (user: Author) => void;
  avatarContent?: React.ReactNode;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  isQuote?: boolean;
}> = ({ data, onClick, onUserClick, avatarContent, headerMeta, children, isMain, isParent, hasLineBelow, isQuote }) => {
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const rootClass = isQuote
    ? `p-3 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer w-full mt-2 mb-1`
    : isThreadContext 
      ? `px-4 relative group ${onClick ? 'cursor-pointer hover:bg-white/[0.02] transition-colors' : ''} ${isParent ? 'opacity-60 hover:opacity-100' : ''} ${isMain ? 'pt-2' : 'pt-4'}`
      : `pt-2 px-4 card-depth group cursor-pointer`;

  return (
    <article className={rootClass} onClick={onClick}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex flex-col items-center">
          {avatarContent || (
            <UserAvatar src={data.author.avatar} alt={data.author.name} size={isQuote ? 'sm' : isParent ? 'sm' : isMain ? 'lg' : 'md'} />
          )}
          {hasLineBelow && !isQuote && (
            <div className={`w-[1.5px] grow mt-2 -mb-4 bg-white/10 rounded-full ${isParent ? 'min-h-[20px]' : 'min-h-[40px]'}`} />
          )}
        </div>
        <div className={`flex-grow ${isThreadContext && isMain ? 'pb-2' : isQuote ? 'pb-0' : 'pb-4'}`}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span onClick={(e) => { e.stopPropagation(); onUserClick?.(data.author); }} className={`font-semibold text-on-surface hover:underline cursor-pointer ${isParent || isQuote ? 'text-[12px]' : isMain ? 'text-[15px]' : 'text-[13px]'}`}>
                {isThreadContext || isQuote ? data.author.name : data.author.handle}
              </span>
              {data.author.verified && <BadgeCheck size={isParent || isQuote ? 12 : 14} className="text-primary fill-primary" />}
              {(isThreadContext || isQuote) && !isParent && <span className="text-on-surface-variant text-[12px]">@{data.author.handle}</span>}
              {headerMeta}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant text-[12px] opacity-60">{data.timestamp}</span>
              {!isParent && !isQuote && <IconButton icon={MoreHorizontal} />}
            </div>
          </div>
          <div className="mt-1">
            {children}
          </div>
          {!isParent && !isQuote && (
            <div className="flex flex-col gap-1 mt-2">
              <PostActions votes={data.votes} replies={data.replies} reposts={data.reposts} shares={data.shares} />
              {isThreadContext && data.replies > 0 && !isMain && (
                <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-primary/80 hover:text-primary transition-colors">
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

export const FeedItemRenderer: React.FC<FeedItemProps> = (props) => {
  const { data } = props;
  if (data.type === 'social') return <SocialPost {...props} data={data as SocialPostData} />;
  if (data.type === 'task') return <TaskCard {...props} data={data as TaskData} />;
  if (data.type === 'editorial') return <EditorialCard {...props} data={data as EditorialData} />;
  return null;
};

export const SocialPost: React.FC<FeedItemProps> = ({ data, onClick, onUserClick, isMain, isParent, hasLineBelow, canAcceptBid, onAcceptBid, isQuote }) => {
  const navigate = useNavigate();
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const spData = data as SocialPostData;
  
  const ThreadBadge = spData.threadCount && spData.threadCount > 1 ? (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[9px] font-black tracking-widest shadow-sm translate-y-[-1px]">
      {spData.threadIndex}/{spData.threadCount}
    </span>
  ) : undefined;

  return (
    <BaseFeedCard 
      data={spData} 
      onClick={onClick}
      onUserClick={onUserClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      isQuote={isQuote}
      avatarContent={
        <>
          <UserAvatar src={spData.author.avatar} alt={spData.author.name} size={isParent || isQuote ? 'sm' : isMain ? 'lg' : 'md'} />
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
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="flex justify-between items-start mb-2 relative z-10">
           <span className="text-[10px] uppercase font-black text-emerald-500 tracking-[0.2em] flex items-center gap-1.5">
             <BadgeCheck size={12} className="text-emerald-500" />
             Proposed Bid
           </span>
           <span className="text-xl font-black text-emerald-400 tracking-tight">{spData.bidAmount}</span>
        </div>
        <div className="flex items-center justify-between relative z-10 mt-1">
          {spData.bidStatus === 'accepted' ? (
            <div className="text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black tracking-widest uppercase inline-block">Accepted</div>
          ) : (
            <div className="text-[10px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase inline-block">Pending</div>
          )}
          
          {canAcceptBid && spData.bidStatus !== 'accepted' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAcceptBid?.(spData.id); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              Accept Bid
            </button>
          )}
        </div>
      </div>
    )}
      {isParent ? (
        <p className="leading-relaxed text-on-surface/90 mb-2 whitespace-pre-wrap text-[13px] line-clamp-1">
          {spData.content}
          {ThreadBadge && <span className="ml-2">{ThreadBadge}</span>}
        </p>
      ) : (
        <ExpandableText 
          text={spData.content} 
          limit={isMain ? 280 : 160}
          className={`leading-relaxed text-on-surface/90 mb-2 whitespace-pre-wrap ${isMain ? 'text-[16px]' : 'text-[13px]'}`}
          buttonClassName="text-[12px] uppercase tracking-widest opacity-80"
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
                <div className="flex justify-between mt-1 text-[10px] text-on-surface-variant font-medium">
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
            navigate(`/post/${spData.quote.id}`);
          }
        }}>
          <FeedItemRenderer data={spData.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};

export const TaskCard: React.FC<FeedItemProps> = ({ data, onClick, onUserClick, isMain, isParent, hasLineBelow, isQuote }) => {
  const task = data as TaskData;
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const { currentUser } = useStore();
  const navigate = useNavigate();
  const isCreator = task.author.handle === currentUser.handle;
  return (
    <BaseFeedCard
      data={task}
      onClick={onClick}
      onUserClick={onUserClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      isQuote={isQuote}
      headerMeta={
        task.status && !isParent && (
          <TagBadge variant="primary" className="text-[9px] px-1 ml-1">
            {task.status}
          </TagBadge>
        )
      }
      avatarContent={
        <>
          <UserAvatar src={task.author.avatar} alt={task.author.name} size={isQuote ? 'sm' : isParent ? 'sm' : isMain ? 'lg' : 'md'} />
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
            <div className="text-[9px] uppercase tracking-[0.1em] text-on-surface-variant/80 font-bold">{task.category}</div>
            <div className="text-primary font-bold text-[12px] tracking-tight">{task.price}</div>
          </div>
          <h3 className="font-bold text-[13px] text-on-surface mb-0.5">{task.title}</h3>
          <ExpandableText
            text={task.description}
            limit={100}
            className="text-[12px] text-on-surface-variant leading-relaxed mb-1"
            buttonClassName="text-[10px] uppercase tracking-widest"
          />
          
          {(task.mapUrl || (task.images && task.images.length > 0) || task.video || task.voiceNote) && (
            <div className="mt-2 flex flex-col gap-1.5">
              {task.mapUrl && (
                <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/10 group">
                  <img src={task.mapUrl} alt="Static Map preview" className="w-full h-full object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-2.5">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[9px] font-black text-on-surface uppercase tracking-widest flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
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
              <div className="text-[11px] text-on-surface-variant/70 font-medium">
                {task.meta}
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className="bg-on-surface text-background font-bold text-[12px] px-3 py-1 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-sm"
              >
                {isCreator ? 'Manage' : (task.category === 'Repair Needed' ? 'Bid' : 'Claim')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[13px] line-clamp-1 text-on-surface-variant mb-1">
          <span className="font-bold text-primary mr-1">Task:</span> {task.title}
        </div>
      )}
      {task.quote && !isParent && (
        <div onClick={(e) => {
          if (isMain) {
            e.stopPropagation();
            navigate(`/post/${task.quote.id}`);
          }
        }}>
          <FeedItemRenderer data={task.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};

export const EditorialCard: React.FC<FeedItemProps> = ({ data, onClick, onUserClick, isMain, isParent, hasLineBelow, isQuote }) => {
  const ed = data as EditorialData;
  const navigate = useNavigate();
  return (
    <BaseFeedCard
      data={ed}
      onClick={onClick}
      onUserClick={onUserClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      isQuote={isQuote}
      avatarContent={
        isParent || isMain || isQuote ? null : (
          <div className="w-8 h-8 rounded-full glass flex items-center justify-center z-10">
            <span className="text-[9px] font-bold text-on-surface-variant">DS</span>
          </div>
        )
      }
    >
      {!isParent ? (
        <div className={isQuote ? "mt-0.5 mb-1" : "glass p-3 rounded-2xl mb-2 mt-0.5"}>
          <div className="text-[9px] uppercase tracking-[0.12em] text-primary font-black mb-1.5">{ed.tag}</div>
          <h2 className={`font-bold text-on-surface leading-tight mb-1.5 ${isMain ? 'text-[18px]' : 'text-[14px]'}`}>{ed.title}</h2>
          <p className="text-[12px] text-on-surface-variant line-clamp-2 leading-relaxed">
            {ed.excerpt}
          </p>
        </div>
      ) : (
        <div className="text-[13px] line-clamp-1 text-on-surface-variant mb-1">
          <span className="font-bold text-emerald-500 mr-1">Editorial:</span> {ed.title}
        </div>
      )}
      {ed.quote && !isParent && (
        <div onClick={(e) => {
          if (isMain) {
            e.stopPropagation();
            navigate(`/post/${ed.quote.id}`);
          }
        }}>
          <FeedItemRenderer data={ed.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};
```

## File: src/features/feed/components/TaskMainContent.Component.tsx
```typescript
import React, { useState } from 'react';
import { BadgeCheck, MapPin, Clock, ShieldCheck, Star, Navigation, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';
import { MediaCarousel } from '@/src/features/feed/components/FeedItems.Component';
import { UserAvatar, TagBadge, ExpandableText } from '@/src/shared/ui/SharedUI.Component';
import { PostActions } from '@/src/shared/ui/PostActions.Component';
import { TaskData } from '@/src/shared/types/domain.type';

export const TaskMainContent: React.FC<{ task: TaskData }> = ({ task }) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

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

  return (
    <div className="relative pb-4">
      {/* Depth background gradient */}
      <div className="absolute top-0 inset-x-0 h-64 bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="px-5 pt-6 pb-2 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar src={task.author.avatar} alt={task.author.name} size="xl" className="ring-2 ring-white/10 shadow-2xl" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[16px] text-on-surface tracking-tight">{task.author.name}</span>
                {task.author.verified && <BadgeCheck size={16} className="text-primary fill-primary" />}
              </div>
              <div className="text-on-surface-variant text-[13px] font-medium">@{task.author.handle}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-black text-on-surface tracking-tighter drop-shadow-md">{task.price}</div>
            {task.status && (
              <TagBadge variant="primary" className="mt-1 shadow-sm px-2 py-0.5 text-[10px]">
                {task.status}
              </TagBadge>
            )}
          </div>
        </div>

        {/* Info Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <div className="scale-[0.6]">{task.icon}</div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-black">{task.category}</div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="text-[11px] text-on-surface-variant font-bold flex items-center gap-1"><Clock size={12} />{task.timestamp}</div>
        </div>

        <h2 className="text-[26px] font-black text-on-surface leading-[1.15] tracking-tight mb-6 drop-shadow-sm">{task.title}</h2>

        {/* Trust Card */}
        <div className="relative overflow-hidden rounded-[24px] p-5 mb-6 glass shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex gap-4 relative z-10">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Requester Rating</span>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star size={18} className="fill-yellow-500" />
                <span className="text-lg font-black text-on-surface tracking-tight">4.9</span>
                <span className="text-[11px] text-on-surface-variant font-bold">(124)</span>
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Payment</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-black tracking-wide">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mb-8">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-on-surface prose-p:leading-relaxed prose-p:text-on-surface-variant/90 prose-li:text-on-surface-variant/90">
            {task.description.length > 500 && !isDescExpanded ? (
              <>
                <Markdown>{task.description.substring(0, 500) + '...'}</Markdown>
                <button 
                  onClick={() => setIsDescExpanded(true)}
                  className="mt-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
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
                    className="mt-4 text-on-surface-variant font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
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
                  <img src={task.mapUrl} alt="Static Map Route" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale-[0.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-container-high" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white tracking-widest uppercase">OSRM Routed</span>
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
                        <div className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Pickup Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Downtown Hub (37.7749° N, 122.4194° W)</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Dropoff Point</div>
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
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-bold tracking-wider">
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
              <TagBadge key={tag} variant="default" className="px-2.5 py-1 text-[10px] rounded-full">{tag}</TagBadge>
            ))}
          </div>
        )}

        <div className="text-center text-[11px] text-on-surface-variant/60 font-bold tracking-widest uppercase mb-4">{task.meta}</div>

        <div className="pt-4 border-t border-white/5">
          <PostActions votes={task.votes} replies={task.replies} reposts={task.reposts} shares={task.shares} className="py-1" />
        </div>
      </div>
    </div>
  );
};
```

## File: src/shared/constants/domain.constant.tsx
```typescript
import React from 'react';
import { Palette, Code, Car, FileText } from 'lucide-react';
import { Author, FeedItem, Gig, ChatMessage, TaskData } from '@/src/shared/types/domain.type';

export const MOCK_AUTHORS: Author[] = [
  { name: 'Alice Smith', handle: 'alicesmith', avatar: 'https://picsum.photos/seed/alice/100/100', verified: false },
  { name: 'Bob Jones', handle: 'bobjones', avatar: 'https://picsum.photos/seed/bob/100/100', verified: true },
  { name: 'Charlie Day', handle: 'charlie_day', avatar: 'https://picsum.photos/seed/charlie/100/100', verified: false },
  { name: 'Diana Prince', handle: 'diana', avatar: 'https://picsum.photos/seed/diana/100/100', verified: true },
  { name: 'Evan Wright', handle: 'evanw', avatar: 'https://picsum.photos/seed/evan/100/100', verified: false },
];

export const SAMPLE_DATA: FeedItem[] = [
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
      icon: <span>🔧</span>,
      replies: 5, reposts: 1, shares: 0, votes: 8
    } as TaskData
  },
  {
    id: '2',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Ride Hail',
    title: 'Luxury Airport Transfer (T3)',
    description: 'Looking for a premium sedan for an airport drop-off. Professional attire and clean vehicle required. Route includes highway tolls which are pre-paid.',
    price: '$45.00',
    timestamp: '15m',
    status: 'Open',
    icon: <Car size={20} />,
    details: 'Premium Airport Transfer',
    tags: ['Premium', 'VIP', 'Airport'],
    replies: 5,
    reposts: 1,
    shares: 0,
    votes: 8,
    mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&h=400&auto=format&fit=crop',
  },
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
    id: '5',
    type: 'task',
    author: MOCK_AUTHORS[0],
    category: 'Delivery',
    title: 'Deliver documents to downtown office',
    description: 'Need urgent delivery of important documents. Willing to pay for fast service.',
    price: '$25',
    timestamp: '1d',
    status: 'Open',
    icon: <span>📦</span>,
    replies: 2,
    reposts: 0,
    shares: 0,
    votes: 3,
    mapUrl: 'https://images.unsplash.com/photo-1554310603-d39d43033735?q=80&w=800&h=400&auto=format&fit=crop',
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

## File: src/store/feed.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { FeedItem } from '@/src/shared/types/domain.type';
import { SAMPLE_DATA } from '@/src/shared/constants/domain.constant';

export interface FeedSlice {
  feedItems: FeedItem[];
  addFeedItem: (item: FeedItem) => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set) => ({
  feedItems: SAMPLE_DATA,
  addFeedItem: (item) => set((state) => ({ feedItems: [item, ...state.feedItems] })),
});
```
