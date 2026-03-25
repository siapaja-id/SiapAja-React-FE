# Directory Structure
```
/
  home/
    realme-book/
      Project/
        code/
          SiapAja-React-FE/
            src/
              components/
                FeedItems.Component.tsx
                SharedUI.Component.tsx
              store/
                main.store.ts
              types/
                domain.type.ts
              App.tsx
```

# Files

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/components/FeedItems.Component.tsx
```typescript
import React from 'react';
import { 
  MoreHorizontal,
  BadgeCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { IconButton, PostActions } from './PostActions.Component';
import { UserAvatar, TagBadge, ExpandableText } from './SharedUI.Component';
import { FeedItem, SocialPostData, TaskData, EditorialData } from '../types/domain.type';
import { MOCK_AUTHORS } from '../constants/domain.constant';
import { useStore } from '../store/main.store';

const threadCache: Record<string, FeedItem[]> = {};

export const getReplies = (parentPost: FeedItem, contentTemplate: (i: number, depth: number) => string, maxDepth: number = 3, currentDepth: number = 0): FeedItem[] => {
  if (currentDepth > maxDepth) return [];
  const cacheKey = `${parentPost.id}-${currentDepth}`;
  if (threadCache[cacheKey]) return threadCache[cacheKey];

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
  avatarContent?: React.ReactNode;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  isQuote?: boolean;
}> = ({ data, onClick, avatarContent, headerMeta, children, isMain, isParent, hasLineBelow, isQuote }) => {
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const rootClass = isQuote
    ? `p-3 border border-white/10 rounded-xl bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-colors cursor-pointer w-full mt-2 mb-1`
    : isThreadContext 
      ? `px-4 relative group ${onClick ? 'cursor-pointer hover:bg-white/[0.02] transition-colors' : ''} ${isParent ? 'opacity-60 hover:opacity-100' : ''} ${isMain ? 'pt-2' : 'pt-4'}`
      : `pt-2 px-4 card-depth group cursor-pointer`;

  return (
    <article className={rootClass} onClick={onClick}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex flex-col items-center">
          {avatarContent || (
            <UserAvatar src={data.author.avatar} alt={data.author.name} size={isParent || isQuote ? 'sm' : isMain ? 'lg' : 'md'} />
          )}
          {hasLineBelow && !isQuote && (
            <div className={`w-[1.5px] grow mt-2 -mb-4 bg-white/10 rounded-full ${isParent ? 'min-h-[20px]' : 'min-h-[40px]'}`} />
          )}
        </div>
        <div className={`flex-grow ${isThreadContext && isMain ? 'pb-2' : isQuote ? 'pb-0' : 'pb-4'}`}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span onClick={(e) => { if(onClick) e.stopPropagation(); }} className={`font-semibold text-on-surface ${onClick?'hover:underline cursor-pointer':''} ${isParent || isQuote ? 'text-[12px]' : isMain ? 'text-[15px]' : 'text-[13px]'}`}>
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

export const SocialPost: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow, canAcceptBid, onAcceptBid, isQuote }) => {
  const { setSelectedPost } = useStore();
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const spData = data as SocialPostData;
  return (
    <BaseFeedCard 
      data={spData} 
      onClick={onClick}
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
        </p>
      ) : (
        <ExpandableText 
          text={spData.content} 
          limit={isMain ? 280 : 160}
          className={`leading-relaxed text-on-surface/90 mb-2 whitespace-pre-wrap ${isMain ? 'text-[16px]' : 'text-[13px]'}`}
          buttonClassName="text-[12px] uppercase tracking-widest opacity-80"
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
            setSelectedPost(spData.quote as FeedItem); 
          }
        }}>
          <FeedItemRenderer data={spData.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};

export const TaskCard: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow, isQuote }) => {
  const task = data as TaskData;
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const { currentUser, setSelectedPost } = useStore();
  const isCreator = task.author.handle === currentUser.handle;
  return (
    <BaseFeedCard
      data={task}
      onClick={onClick}
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
          <UserAvatar src={task.author.avatar} alt={task.author.name} size={isParent || isQuote ? 'sm' : isMain ? 'lg' : 'md'} />
          {!isThreadContext && !isQuote && (
            <>
              <div className="w-[1.5px] grow mt-1.5 mb-1 bg-white/10 rounded-full" />
              <div className="mt-0.5 mb-1.5 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 text-primary shadow-inner">
                <div className="scale-[0.6]">{task.icon}</div>
              </div>
            </>
          )}
        </>
      }
    >
      {!isParent ? (
        <div className={isQuote ? "mt-0.5 mb-1" : "bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5"}>
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
                <div className="relative w-full h-20 rounded-lg overflow-hidden border border-white/10">
                  <img src={task.mapUrl} alt="Map preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-bold text-on-surface flex items-center gap-1">
                      <MapPin size={9} className="text-primary" /> Route Map
                    </span>
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
            setSelectedPost(task.quote as FeedItem); 
          }
        }}>
          <FeedItemRenderer data={task.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};

export const EditorialCard: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow, isQuote }) => {
  const ed = data as EditorialData;
  const { setSelectedPost } = useStore();
  return (
    <BaseFeedCard
      data={ed}
      onClick={onClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      isQuote={isQuote}
      avatarContent={
        isParent || isMain ? null : (
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shadow-inner z-10">
            <span className="text-[9px] font-bold text-on-surface-variant">DS</span>
          </div>
        )
      }
    >
      {!isParent ? (
        <div className={isQuote ? "mt-0.5 mb-1" : "bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5"}>
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
            setSelectedPost(ed.quote as FeedItem); 
          }
        }}>
          <FeedItemRenderer data={ed.quote} isQuote={true} />
        </div>
      )}
    </BaseFeedCard>
  );
};
```

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/components/SharedUI.Component.tsx
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
      className={`bg-transparent border-none focus:ring-0 focus:outline-none resize-none custom-scrollbar ${className}`}
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
}> = ({ text, limit = 160, className = "", buttonClassName = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > limit;

  if (!isLong) return <p className={className}>{text}</p>;

  return (
    <div className={className}>
      <p className="inline">
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </p>
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
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="min-h-screen bg-surface p-6 pb-32"
  >
    <div className="max-w-xl mx-auto">
      <CheckoutHeader title={title} subtitle={subtitle} onBack={onBack} />
      {children}
    </div>
  </motion.div>
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
  <div className="fixed bottom-0 w-full max-w-2xl bg-surface-container/90 backdrop-blur-xl border-t border-white/5 p-3 flex items-end gap-3 z-20">
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

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/store/main.store.ts
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

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/types/domain.type.ts
```typescript
import React from 'react';

export type NavState = 'home' | 'explore' | 'messages' | 'profile' | 'review-order' | 'payment' | 'create-post';
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

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/App.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  User, 
  MessageCircle,
  Sparkles, 
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  FeedItemRenderer,
} from './components/FeedItems.Component';
import { FeedItem, NavState } from './types/domain.type';
import { GigMatcher } from './components/GigMatcher.Component';
import { CreateModal } from './components/CreateModal.Component';
import { ChatRoom } from './components/ChatRoom.Component';
import { ReviewOrder } from './pages/ReviewOrder.Page';
import { PaymentPage } from './pages/Payment.Page';
import { CreatePostPage } from './pages/CreatePost.Page';
import { PostDetailPage } from './pages/PostDetail.Page';
import { UserAvatar } from './components/SharedUI.Component';
import { useStore } from './store/main.store';

export default function App() {
  const {
    activeNav, setActiveNav,
    activeTab, setActiveTab,
    showMatcher, setShowMatcher,
    showCreateModal, setShowCreateModal,
    showChatRoom, setShowChatRoom,
    feedItems, selectedPost, setSelectedPost,
    orderToReview, setOrderToReview,
    currentUser
  } = useStore();
  
  const [isVisible, setIsVisible] = useState(true);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = React.useRef(0);

  const { scrollY } = useScroll();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current > 0 && !isRefreshing) {
      const y = e.touches[0].clientY;
      const distance = y - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.4, 120));
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (pullDistance > 80 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(60);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 2000);
    } else if (!isRefreshing) {
      setPullDistance(0);
    }
    startY.current = 0;
  };

  useEffect(() => {
    (window as any).onAIRequestComplete = (data: any) => {
      setOrderToReview(data);
      setActiveNav('review-order');
    };
    (window as any).openCreatePost = () => {
      setActiveNav('create-post');
    };
  }, []);

  const renderContent = () => {
    switch (activeNav) {
      case 'home':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {feedItems.map((item) => (
                <FeedItemRenderer key={item.id} data={item} onClick={() => setSelectedPost(item)} />
              ))}
            </motion.div>
          </AnimatePresence>
        );
      case 'review-order':
        return orderToReview ? (
          <ReviewOrder order={orderToReview} onBack={() => setActiveNav('home')} onProceed={() => setActiveNav('payment')} />
        ) : null;
      case 'payment':
        return orderToReview ? (
          <PaymentPage order={orderToReview} onBack={() => setActiveNav('review-order')} onSuccess={() => { setActiveNav('home'); setOrderToReview(null); }} />
        ) : null;
      case 'create-post':
        return (
          <CreatePostPage onBack={() => setActiveNav('home')} onPost={(threads) => { setActiveNav('home'); }} />
        );
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
            <div className="flex flex-col items-center text-center mb-8">
              <UserAvatar src={currentUser.avatar} size="xl" className="w-24 h-24 mb-4 ring-2" />
              <h2 className="text-xl font-bold text-on-surface">{currentUser.name}</h2>
              <p className="text-on-surface-variant text-sm">@{currentUser.handle}</p>
            </div>
          </motion.div>
        );
      default:
        return <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">{activeNav} View</div>;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowMatcher(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsVisible(latest <= previous || latest <= 150);
  });

  return (
    <div className="min-h-screen bg-transparent text-on-surface flex flex-col max-w-2xl mx-auto border-x border-white/5 shadow-2xl">
      {activeNav === 'home' && (
        <motion.header 
          animate={isVisible ? { y: 0 } : { y: "-100%" }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/5"
        >
          <div className="flex justify-between items-center px-4 h-14">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-primary font-black italic text-lg tracking-tighter">@</span>
            </div>
            <div className="flex space-x-6">
              {['for-you', 'around-you'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-sm font-semibold relative py-1 capitalize ${activeTab === tab ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {tab.replace('-', ' ')}
                  {activeTab === tab && <motion.div layoutId="tab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              ))}
            </div>
            <button onClick={() => setActiveNav('profile')} className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <UserAvatar src={currentUser.avatar} size="md" className="border-0" />
            </button>
          </div>
        </motion.header>
      )}

      <main className="flex-grow pb-20 relative overflow-x-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="absolute top-0 left-0 right-0 flex justify-center items-start z-40 pointer-events-none mt-4">
          <motion.div animate={{ y: isRefreshing ? 0 : Math.max(0, pullDistance - 40), opacity: pullDistance > 10 ? 1 : 0 }} className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 shadow-xl flex items-center justify-center text-primary">
            <motion.div animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }} transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : undefined}>
              {isRefreshing ? <Loader2 size={20} /> : <RefreshCw size={20} />}
            </motion.div>
          </motion.div>
        </div>
        <motion.div animate={{ y: isRefreshing ? 60 : pullDistance }}>{renderContent()}</motion.div>
      </main>

      {['home', 'explore', 'messages', 'profile'].includes(activeNav) && (
        <motion.nav animate={isVisible ? { y: 0 } : { y: "100%" }} className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass flex justify-around items-center px-4">
          {[
            { id: 'home' as NavState, icon: Home, label: 'Home' },
            { id: 'explore' as NavState, icon: Search, label: 'Explore' },
            { id: 'create', icon: Plus, label: 'Create', center: true },
            { id: 'messages' as NavState, icon: MessageCircle, label: 'Messages', extra: () => setShowChatRoom(true) },
            { id: 'profile' as NavState, icon: User, label: 'Profile' }
          ].map((item) => item.center ? (
            <button key={item.id} onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground rounded-xl p-2.5 shadow-xl"><item.icon size={20} strokeWidth={3} /></button>
          ) : (
            <button key={item.id} onClick={() => { setActiveNav(item.id as NavState); item.extra?.(); }} className={`flex flex-col items-center gap-1 ${activeNav === item.id ? 'text-primary' : 'text-on-surface-variant'}`}>
              <item.icon size={22} /><span className="text-[9px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </motion.nav>
      )}

      <AnimatePresence>
        {showMatcher && activeNav === 'home' && <GigMatcher onClose={() => setShowMatcher(false)} />}
        {showCreateModal && <CreateModal onClose={() => setShowCreateModal(false)} />}
        {showChatRoom && <ChatRoom onClose={() => setShowChatRoom(false)} />}
        {selectedPost && <PostDetailPage post={selectedPost} onBack={() => setSelectedPost(null)} />}
      </AnimatePresence>
    </div>
  );
}
```
