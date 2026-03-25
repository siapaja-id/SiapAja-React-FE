import React from 'react';
import { 
  MoreHorizontal,
  BadgeCheck,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { IconButton, PostActions } from './PostActions';

// --- Shared Mock Data Utilities ---
export const MOCK_AUTHORS = [
  { name: 'Alice Smith', handle: 'alicesmith', avatar: 'https://picsum.photos/seed/alice/100/100', verified: false },
  { name: 'Bob Jones', handle: 'bobjones', avatar: 'https://picsum.photos/seed/bob/100/100', verified: true },
  { name: 'Charlie Day', handle: 'charlie_day', avatar: 'https://picsum.photos/seed/charlie/100/100', verified: false },
  { name: 'Diana Prince', handle: 'diana', avatar: 'https://picsum.photos/seed/diana/100/100', verified: true },
  { name: 'Evan Wright', handle: 'evanw', avatar: 'https://picsum.photos/seed/evan/100/100', verified: false },
];

const threadCache: Record<string, FeedItem[]> = {};

export const getReplies = (parentPost: FeedItem, contentTemplate: (i: number, depth: number) => string, maxDepth: number = 3, currentDepth: number = 0): FeedItem[] => {
  if (currentDepth > maxDepth) return [];
  const cacheKey = `${parentPost.id}-${currentDepth}`;
  if (threadCache[cacheKey]) return threadCache[cacheKey];

  const hash = parentPost.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numReplies = (hash % 3) + 1;
  
  const replies = Array.from({ length: numReplies }).map((_, i) => {
    const author = MOCK_AUTHORS[(hash + i) % MOCK_AUTHORS.length];
    return {
      id: `${parentPost.id}-r${i}`,
      type: 'social',
      author,
      content: contentTemplate(i, currentDepth),
      timestamp: `${(i + 1) * 2}h`,
      votes: (hash + i) % 100,
      replies: currentDepth < 2 ? (hash % 3) + 1 : 0,
      reposts: (hash + i) % 10,
      shares: (hash + i) % 5,
    } as FeedItem;
  });

  threadCache[cacheKey] = replies;
  return replies;
};

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
      
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white/90 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

// --- Types ---

export type PostType = 'social' | 'task' | 'editorial';

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
  timestamp: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
  replyAvatars?: string[];
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

// --- Abstracted Feed Card ---

const BaseFeedCard: React.FC<{
  data: FeedItem;
  onClick?: () => void;
  avatarContent?: React.ReactNode;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
}> = ({ data, onClick, avatarContent, headerMeta, children }) => (
  <article className="pt-2 px-4 card-depth group cursor-pointer" onClick={onClick}>
    <div className="flex gap-3">
      <div className="flex-shrink-0 flex flex-col items-center">
        {avatarContent || (
          <img src={data.author.avatar} alt={data.author.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 z-10" referrerPolicy="no-referrer" />
        )}
      </div>
      <div className="flex-grow pb-2">
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center gap-1.5">
            <span onClick={(e) => e.stopPropagation()} className="font-semibold text-[13px] text-on-surface hover:underline cursor-pointer">
              {data.author.handle}
            </span>
            {data.author.verified && <BadgeCheck size={12} className="text-primary fill-primary" />}
            {headerMeta}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-[12px] opacity-60">{data.timestamp}</span>
            <IconButton icon={MoreHorizontal} />
          </div>
        </div>
        {children}
        <div className="flex flex-col gap-1">
          <PostActions votes={data.votes} replies={data.replies} reposts={data.reposts} shares={data.shares} />
        </div>
      </div>
    </div>
  </article>
);

// --- Component Implementations ---

export const SocialPost: React.FC<{ data: SocialPostData, onClick?: () => void }> = ({ data, onClick }) => (
  <BaseFeedCard 
    data={data} 
    onClick={onClick}
    avatarContent={
      <>
        <img src={data.author.avatar} alt={data.author.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 z-10" referrerPolicy="no-referrer" />
        {data.replyAvatars && data.replyAvatars.length > 0 && (
          <>
            <div className="w-[1.5px] grow mt-1.5 mb-1 bg-white/10 rounded-full" />
            <div className="relative w-5 h-5 flex items-center justify-center mt-0.5 mb-1.5">
              {data.replyAvatars.map((av, i) => {
                const positions = ['left-0 top-0 w-3 h-3', 'right-0 top-0.5 w-2 h-2', 'left-0.5 bottom-0 w-1.5 h-1.5'];
                return <img key={i} src={av} className={`absolute rounded-full border border-background object-cover ${positions[i] || 'hidden'}`} style={{ zIndex: 3 - i }} referrerPolicy="no-referrer" />;
              })}
            </div>
          </>
        )}
      </>
    }
  >
    <p className="text-[13px] leading-relaxed text-on-surface/90 mb-2 whitespace-pre-wrap">
      {data.content}
    </p>
    {data.images && data.images.length > 0 && (
      <MediaCarousel images={data.images} className="mb-2" />
    )}
  </BaseFeedCard>
);

export const TaskCard: React.FC<{ data: TaskData, onClick?: () => void }> = ({ data, onClick }) => (
  <BaseFeedCard
    data={data}
    onClick={onClick}
    headerMeta={
      data.status && (
        <span className="bg-primary/20 text-primary text-[9px] px-1 py-0.5 rounded font-bold uppercase tracking-wider border border-primary/20">
          {data.status}
        </span>
      )
    }
    avatarContent={
      <>
        <img src={data.author.avatar} alt={data.author.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 z-10" referrerPolicy="no-referrer" />
        <div className="w-[1.5px] grow mt-1.5 mb-1 bg-white/10 rounded-full" />
        <div className="mt-0.5 mb-1.5 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 text-primary shadow-inner">
          <div className="scale-[0.6]">{data.icon}</div>
        </div>
      </>
    }
  >
    <div className="bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5">
      <div className="flex items-center justify-between mb-0.5">
        <div className="text-[9px] uppercase tracking-[0.1em] text-on-surface-variant/80 font-bold">{data.category}</div>
        <div className="text-primary font-bold text-[12px] tracking-tight">{data.price}</div>
      </div>
      <h3 className="font-bold text-[13px] text-on-surface mb-0.5">{data.title}</h3>
      <p className="text-[12px] text-on-surface-variant leading-relaxed line-clamp-1">
        {data.description}
      </p>
      
      {(data.mapUrl || (data.images && data.images.length > 0) || data.video || data.voiceNote) && (
        <div className="mt-2 flex flex-col gap-1.5">
          {data.mapUrl && (
            <div className="relative w-full h-20 rounded-lg overflow-hidden border border-white/10">
              <img src={data.mapUrl} alt="Map preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-1.5">
                <span className="text-[9px] font-bold text-on-surface flex items-center gap-1">
                  <MapPin size={9} className="text-primary" /> Route Map
                </span>
              </div>
            </div>
          )}
          {data.images && data.images.length > 0 && (
            <MediaCarousel images={data.images} aspect="aspect-[21/9]" className="rounded-lg overflow-hidden border border-white/10" />
          )}
        </div>
      )}
    </div>

    <div className="flex items-center justify-between mb-2">
      <div className="text-[11px] text-on-surface-variant/70 font-medium">
        {data.meta}
      </div>
      <button 
        onClick={(e) => e.stopPropagation()}
        className="bg-on-surface text-background font-bold text-[12px] px-3 py-1 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-sm"
      >
        {data.category === 'Repair Needed' ? 'Bid' : 'Claim'}
      </button>
    </div>
  </BaseFeedCard>
);

export const EditorialCard: React.FC<{ data: EditorialData, onClick?: () => void }> = ({ data, onClick }) => (
  <BaseFeedCard
    data={data}
    onClick={onClick}
    avatarContent={
      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shadow-inner z-10">
        <span className="text-[9px] font-bold text-on-surface-variant">DS</span>
      </div>
    }
  >
    <div className="bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5">
      <div className="text-[9px] uppercase tracking-[0.12em] text-primary font-black mb-1.5">{data.tag}</div>
      <h2 className="font-bold text-[14px] text-on-surface leading-tight mb-1.5">{data.title}</h2>
      <p className="text-[12px] text-on-surface-variant line-clamp-2 leading-relaxed">
        {data.excerpt}
      </p>
    </div>
  </BaseFeedCard>
);