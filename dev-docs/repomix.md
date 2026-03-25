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
                PostActions.Component.tsx
              constants/
                domain.constant.tsx
              pages/
                PostDetail.Page.tsx
              store/
                feed.slice.ts
              types/
                domain.type.ts
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
}> = ({ data, onClick, avatarContent, headerMeta, children, isMain, isParent, hasLineBelow }) => {
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const rootClass = isThreadContext 
    ? `px-4 relative group ${onClick ? 'cursor-pointer hover:bg-white/[0.02] transition-colors' : ''} ${isParent ? 'opacity-60 hover:opacity-100' : ''} ${isMain ? 'pt-2' : 'pt-4'}`
    : `pt-2 px-4 card-depth group cursor-pointer`;

  return (
    <article className={rootClass} onClick={onClick}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex flex-col items-center">
          {avatarContent || (
            <UserAvatar src={data.author.avatar} alt={data.author.name} size={isParent ? 'sm' : isMain ? 'lg' : 'md'} />
          )}
          {hasLineBelow && (
            <div className={`w-[1.5px] grow mt-2 -mb-4 bg-white/10 rounded-full ${isParent ? 'min-h-[20px]' : 'min-h-[40px]'}`} />
          )}
        </div>
        <div className={`flex-grow ${isThreadContext && isMain ? 'pb-2' : 'pb-4'}`}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span onClick={(e) => { if(onClick) e.stopPropagation(); }} className={`font-semibold text-on-surface ${onClick?'hover:underline cursor-pointer':''} ${isParent ? 'text-[12px]' : isMain ? 'text-[15px]' : 'text-[13px]'}`}>
                {isThreadContext ? data.author.name : data.author.handle}
              </span>
              {data.author.verified && <BadgeCheck size={isParent ? 12 : 14} className="text-primary fill-primary" />}
              {isThreadContext && !isParent && <span className="text-on-surface-variant text-[12px]">@{data.author.handle}</span>}
              {headerMeta}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant text-[12px] opacity-60">{data.timestamp}</span>
              {!isParent && <IconButton icon={MoreHorizontal} />}
            </div>
          </div>
          <div className="mt-1">
            {children}
          </div>
          {!isParent && (
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

export const SocialPost: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow, canAcceptBid, onAcceptBid }) => {
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const spData = data as SocialPostData;
  return (
    <BaseFeedCard 
      data={spData} 
      onClick={onClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      avatarContent={
        <>
          <UserAvatar src={spData.author.avatar} alt={spData.author.name} size={isParent ? 'sm' : isMain ? 'lg' : 'md'} />
          {spData.replyAvatars && spData.replyAvatars.length > 0 && !isThreadContext && (
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
    </BaseFeedCard>
  );
};

export const TaskCard: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow }) => {
  const task = data as TaskData;
  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
  const { currentUser } = useStore();
  const isCreator = task.author.handle === currentUser.handle;
  return (
    <BaseFeedCard
      data={task}
      onClick={onClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      headerMeta={
        task.status && !isParent && (
          <TagBadge variant="primary" className="text-[9px] px-1 ml-1">
            {task.status}
          </TagBadge>
        )
      }
      avatarContent={
        <>
          <UserAvatar src={task.author.avatar} alt={task.author.name} size={isParent ? 'sm' : isMain ? 'lg' : 'md'} />
          {!isThreadContext && (
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
        <div className="bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5">
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
        </div>
      ) : (
        <div className="text-[13px] line-clamp-1 text-on-surface-variant mb-1">
          <span className="font-bold text-primary mr-1">Task:</span> {task.title}
        </div>
      )}
    </BaseFeedCard>
  );
};

export const EditorialCard: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow }) => {
  const ed = data as EditorialData;
  return (
    <BaseFeedCard
      data={ed}
      onClick={onClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      avatarContent={
        isParent || isMain ? null : (
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shadow-inner z-10">
            <span className="text-[9px] font-bold text-on-surface-variant">DS</span>
          </div>
        )
      }
    >
      {!isParent ? (
        <div className="bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5">
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
    </BaseFeedCard>
  );
};
```

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/components/PostActions.Component.tsx
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

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/constants/domain.constant.tsx
```typescript
import React from 'react';
import { Palette, Code, Car, FileText } from 'lucide-react';
import { Author, FeedItem, Gig, ChatMessage } from '../types/domain.type';

export const MOCK_AUTHORS: Author[] = [
  { name: 'Alice Smith', handle: 'alicesmith', avatar: 'https://picsum.photos/seed/alice/100/100', verified: false },
  { name: 'Bob Jones', handle: 'bobjones', avatar: 'https://picsum.photos/seed/bob/100/100', verified: true },
  { name: 'Charlie Day', handle: 'charlie_day', avatar: 'https://picsum.photos/seed/charlie/100/100', verified: false },
  { name: 'Diana Prince', handle: 'diana', avatar: 'https://picsum.photos/seed/diana/100/100', verified: true },
  { name: 'Evan Wright', handle: 'evanw', avatar: 'https://picsum.photos/seed/evan/100/100', verified: false },
];

export const SAMPLE_DATA: FeedItem[] = [
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
    id: '2',
    type: 'task',
    author: MOCK_AUTHORS[1],
    category: 'Repair Needed',
    title: 'Fix leaking kitchen faucet',
    description: 'My kitchen faucet has been dripping for a week. Need someone to fix it ASAP.',
    price: '$50-80',
    timestamp: '4h',
    status: 'Open',
    icon: <span>🔧</span>,
    details: 'Kitchen faucet repair',
    replies: 5,
    reposts: 1,
    shares: 0,
    votes: 8,
    images: ['https://picsum.photos/seed/faucet/600/400'],
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

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/pages/PostDetail.Page.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown } from 'lucide-react';
import { getReplies, FeedItemRenderer } from '../components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide, AutoResizeTextarea, Button } from '../components/SharedUI.Component';
import { TaskMainContent } from '../components/TaskMainContent.Component';
import { FeedItem, SocialPostData } from '../types/domain.type';
import { useStore } from '../store/main.store';

export const PostDetailPage: React.FC<{ post: FeedItem; onBack: () => void; }> = ({ post, onBack }) => {
  const { currentUser } = useStore();
  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([post]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const currentPost = postStack[postStack.length - 1];
  
  const initialReplies = useMemo(() => getReplies(currentPost, (i, depth) => 
    depth === 0 
      ? `Interesting point! I think the ${i % 2 === 0 ? 'minimalist' : 'maximalist'} approach really shines here.`
      : `Replying to @${currentPost.author.handle}: That's a great observation about the flow.`
  ), [currentPost.id]);

  // Extract baseline price from task to set a realistic default bid
  const taskPriceString = currentPost.type === 'task' ? (currentPost as any).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [localReplies, setLocalReplies] = useState<FeedItem[]>(initialReplies);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const isCreator = currentPost.author.handle === currentUser.handle;

  const handleAcceptBid = (bidId: string) => {
    setLocalReplies(prev => prev.map(reply => {
      if (reply.id === bidId && reply.type === 'social') {
        return { ...reply, bidStatus: 'accepted' };
      }
      return reply;
    }));
  };

  React.useEffect(() => {
    setPostStack([post]);
  }, [post]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setLocalReplies(initialReplies);
  }, [currentPost.id]);

  const handleBack = () => {
    if (postStack.length > 1) {
      setPostStack(prev => prev.slice(0, -1));
    } else {
      onBack();
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

        <div className="flex flex-col border-t border-white/5 mt-2">
          {localReplies.length > 0 && (
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
        <div className="fixed bottom-0 w-full max-w-2xl bg-surface-container/90 backdrop-blur-2xl border-t border-white/5 p-3 z-20 flex gap-3 pb-8 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
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

## File: /home/realme-book/Project/code/SiapAja-React-FE/src/store/feed.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { FeedItem } from '../types/domain.type';
import { SAMPLE_DATA } from '../constants/domain.constant';

export interface FeedSlice {
  feedItems: FeedItem[];
  selectedPost: FeedItem | null;
  setSelectedPost: (post: FeedItem | null) => void;
  addFeedItem: (item: FeedItem) => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set) => ({
  feedItems: SAMPLE_DATA,
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
  addFeedItem: (item) => set((state) => ({ feedItems: [item, ...state.feedItems] })),
});
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
