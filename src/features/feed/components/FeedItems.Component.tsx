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

export interface FeedItemProps {
  data: FeedItem;
  onClick?: () => void;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  canAcceptBid?: boolean;
  onAcceptBid?: (bidId: string) => void;
  isQuote?: boolean;
  isFirst?: boolean;
  isAuthor?: boolean;
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
  isFirst?: boolean;
  isAuthor?: boolean;
}> = ({ data, onClick: onClickOverride, avatarContent, headerMeta, children, isMain, isParent, hasLineBelow, isQuote, isFirst, isAuthor }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClickOverride) {
      onClickOverride();
      return;
    }
    if (isQuote || isParent) return;
    navigate(data.type === 'task' ? `/task/${data.id}` : `/post/${data.id}`);
  };

  const handleUserClick = (user: Author) => {
    navigate('/profile', { state: { user } });
  };

  const isThreadContext = isMain !== undefined || isParent !== undefined || hasLineBelow !== undefined;
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
              <span onClick={(e) => { e.stopPropagation(); handleUserClick(data.author); }} className={`font-semibold text-on-surface hover:underline cursor-pointer ${isParent || isQuote ? 'text-[12px]' : isMain ? 'text-[15px]' : 'text-[13px]'}`}>
                {isThreadContext || isQuote ? data.author.name : data.author.handle}
              </span>
              {data.author.verified && <BadgeCheck size={isParent || isQuote ? 12 : 14} className="text-primary fill-primary" />}
              {(isThreadContext || isQuote) && !isParent && <span className="text-on-surface-variant text-[12px]">@{data.author.handle}</span>}

              {isAuthor && !isParent && !isQuote && (
                <span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/20 ml-1">
                  You
                </span>
              )}

              {headerMeta}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant text-[12px] opacity-60">{data.timestamp}</span>
              {!isParent && !isQuote && <IconButton icon={MoreHorizontal} />}
            </div>
          </div>
          
          {isFirst && !isQuote && !isParent && (
            <div className="absolute -top-2.5 right-0 z-10">
              <span className="bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                First
              </span>
            </div>
          )}

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

export const SocialPost: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow, canAcceptBid, onAcceptBid, isQuote, isFirst, isAuthor }) => {
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
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      isQuote={isQuote}
      isFirst={isFirst}
      isAuthor={isAuthor}
      avatarContent={
        <>
          <UserAvatar src={spData.author.avatar} alt={spData.author.name} size={isParent || isQuote ? 'sm' : isMain ? 'lg' : 'md'} isOnline={spData.author.isOnline} />
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

export const TaskCard: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow, isQuote, isFirst, isAuthor }) => {
  const navigate = useNavigate();
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
      isQuote={isQuote}
      isFirst={isFirst}
      isAuthor={isAuthor}
      headerMeta={
        task.status && !isParent && (
          <TagBadge variant="primary" className="text-[9px] px-1 ml-1">
            {task.status}
          </TagBadge>
        )
      }
      avatarContent={
        <>
          <UserAvatar src={task.author.avatar} alt={task.author.name} size={isQuote ? 'sm' : isParent ? 'sm' : isMain ? 'lg' : 'md'} isOnline={task.author.isOnline} />
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

export const EditorialCard: React.FC<FeedItemProps> = ({ data, onClick, isMain, isParent, hasLineBelow, isQuote, isFirst, isAuthor }) => {
  const navigate = useNavigate();
  const ed = data as EditorialData;
  return (
    <BaseFeedCard
      data={ed}
      onClick={onClick}
      isMain={isMain}
      isParent={isParent}
      hasLineBelow={hasLineBelow}
      isQuote={isQuote}
      isFirst={isFirst}
      isAuthor={isAuthor}
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