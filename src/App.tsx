import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  Heart, 
  User, 
  Settings,
  Package,
  Wrench,
  ShoppingBasket,
  MessageCircle,
  Sparkles, 
  Check, 
  ArrowLeft,
  Loader2,
  RefreshCw,
  Car,
  Dog,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { 
  SocialPost, 
  TaskCard, 
  EditorialCard, 
  FeedItem 
} from './components/FeedItems.Component';
import { GigMatcher } from './components/GigMatcher.Component';
import { CreateModal } from './components/CreateModal.Component';
import { ChatRoom } from './components/ChatRoom.Component';
import { AIChatRequest } from './components/AIChatRequest.Component';
import { ReviewOrder } from './pages/ReviewOrder.Page';
import { PaymentPage } from './pages/Payment.Page';
import { CreatePostPage } from './pages/CreatePost.Page';
import { PostDetailPage } from './pages/PostDetail.Page';
import { TaskDetailPage } from './pages/TaskDetail.Page';
import Markdown from 'react-markdown';

const SAMPLE_DATA: FeedItem[] = [
  {
    id: '1',
    type: 'social',
    author: {
      name: 'John Doe',
      handle: 'johndoe',
      avatar: 'https://picsum.photos/seed/john/100/100',
      verified: true,
      karma: 15420
    },
    content: "The architecture in this city is absolutely breathtaking. Minimalism is not the lack of something, it's the perfect amount of something. 🏛️",
    images: [
      'https://picsum.photos/seed/arch1/800/800',
      'https://picsum.photos/seed/arch2/800/800',
      'https://picsum.photos/seed/arch3/800/800'
    ],
    timestamp: '4h',
    replies: 42,
    reposts: 12,
    shares: 5,
    votes: 1200,
    replyAvatars: ['https://picsum.photos/seed/r1/50/50', 'https://picsum.photos/seed/r2/50/50']
  },
  {
    id: '2',
    type: 'task',
    author: {
      name: 'Sarah Logistics',
      handle: 'sarah_logistics',
      avatar: 'https://picsum.photos/seed/req2/100/100',
      karma: 842
    },
    category: 'Local Courier Task',
    status: 'ACTIVE',
    title: 'Deliver Electronics Package',
    description: 'Pick up from Downtown Hub → Drop off at Midtown Square (2.4 miles)',
    price: '$18.50',
    timestamp: 'Now',
    icon: <Package size={18} />,
    meta: '3 people looking at this',
    replies: 12,
    reposts: 3,
    shares: 1,
    votes: 85,
    mapUrl: 'https://picsum.photos/seed/map1/800/400'
  },
  {
    id: '3',
    type: 'social',
    author: {
      name: 'Elena Vision',
      handle: 'elena_vision',
      avatar: 'https://picsum.photos/seed/elena/100/100',
      karma: 42100
    },
    content: "Captured this during my morning walk. Light and shadow playing their eternal game.",
    images: [
      'https://picsum.photos/seed/cactus/800/450', 
      'https://picsum.photos/seed/desert/800/450',
      'https://picsum.photos/seed/sky/800/450',
      'https://picsum.photos/seed/mountain/800/450',
      'https://picsum.photos/seed/river/800/450'
    ],
    timestamp: '6h',
    replies: 128,
    reposts: 45,
    shares: 22,
    votes: 3400,
    replyAvatars: ['https://picsum.photos/seed/r3/50/50']
  },
  {
    id: '4',
    type: 'task',
    author: {
      name: 'Mike Miller',
      handle: 'mike_miller',
      avatar: 'https://picsum.photos/seed/req1/100/100',
      karma: 125
    },
    category: 'Repair Needed',
    title: 'Kitchen Shelf Installation',
    description: 'Looking for someone with a drill and level to hang 3 floating shelves. Estimated 2 hours. Tools required.',
    price: '$45.00/hr',
    timestamp: '12m',
    icon: <Wrench size={18} />,
    tags: ['Tools: No', 'East Side'],
    meta: 'JD and 2 others bid',
    replies: 5,
    reposts: 0,
    shares: 2,
    votes: 24,
    images: [
      'https://picsum.photos/seed/shelf/800/600', 
      'https://picsum.photos/seed/tools/800/600',
      'https://picsum.photos/seed/kitchen/800/600'
    ]
  },
  {
    id: '5',
    type: 'task',
    author: {
      name: 'Grocery Express',
      handle: 'grocery_express',
      avatar: 'https://picsum.photos/seed/req3/100/100',
      karma: 3200
    },
    category: 'Grocery Run',
    title: 'Express Shop (12 items)',
    description: 'Whole Foods Market → Delivery at The Heights Apartments.',
    price: '$22.00 + Tip',
    timestamp: '45m',
    icon: <ShoppingBasket size={18} />,
    meta: 'Earn $28.50 estimated total',
    replies: 8,
    reposts: 1,
    shares: 4,
    votes: 42
  },
  {
    id: '6',
    type: 'editorial',
    author: {
      name: 'Design Studio',
      handle: 'design_studio',
      avatar: 'https://picsum.photos/seed/ds/100/100',
      karma: 89000
    },
    tag: "EDITOR'S CHOICE",
    title: 'Reclaiming the Grid: A New Perspective on Layouts',
    excerpt: 'Exploring how asymmetric grids are redefining digital publication standards in the late 2020s...',
    timestamp: '12h',
    replies: 18,
    reposts: 7,
    shares: 3,
    votes: 95
  },
  {
    id: '7',
    type: 'task',
    author: {
      name: 'Alex Rider',
      handle: 'alex_rider',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      karma: 560
    },
    category: 'Ride Hail',
    title: 'Ride to Airport (SFO)',
    description: 'Need a ride to SFO from Downtown. 2 passengers, 2 large bags. Flight is at 4 PM, need to leave by 1 PM.',
    price: '$45.00',
    timestamp: '2h',
    icon: <Car size={18} />,
    tags: ['Airport', 'Luggage'],
    meta: '2 drivers available nearby',
    replies: 3,
    reposts: 0,
    shares: 1,
    votes: 12,
    mapUrl: 'https://picsum.photos/seed/map2/800/400'
  },
  {
    id: '8',
    type: 'task',
    author: {
      name: 'Pet Lovers',
      handle: 'pet_lovers',
      avatar: 'https://picsum.photos/seed/pets/100/100',
      karma: 1200
    },
    category: 'Pet Sitting',
    title: 'Dog Walking for Max',
    description: 'Need someone to walk my golden retriever, Max, for 30 mins around the park. He is very friendly!',
    price: '$20.00',
    timestamp: '3h',
    icon: <Dog size={18} />,
    tags: ['Dog', 'Walking'],
    meta: '1 person interested',
    replies: 2,
    reposts: 0,
    shares: 0,
    votes: 18,
    video: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: '9',
    type: 'task',
    author: {
      name: 'Event Snaps',
      handle: 'event_snaps',
      avatar: 'https://picsum.photos/seed/camera/100/100',
      karma: 450
    },
    category: 'Photography',
    title: 'Birthday Party Photographer',
    description: 'Looking for a photographer for a 5th birthday party. 2 hours. Just need raw photos, no editing required.',
    price: '$100.00',
    timestamp: '5h',
    icon: <Camera size={18} />,
    tags: ['Event', 'Photography'],
    meta: '4 photographers bid',
    replies: 6,
    reposts: 1,
    shares: 2,
    votes: 30,
    voiceNote: 'https://www.w3schools.com/html/horse.mp3'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'for-you' | 'around-you'>('for-you');
  const [activeNav, setActiveNav] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [showMatcher, setShowMatcher] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [orderToReview, setOrderToReview] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<FeedItem | null>(null);
  
  // Pull to refresh state
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
      
      // Simulate network request
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
    // Global handler for AI requests from CreateModal
    (window as any).onAIRequestComplete = (data: any) => {
      setOrderToReview(data);
      setActiveNav('review-order');
    };

    // Global handler for opening Create Post page
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
              {SAMPLE_DATA.map((item) => {
                if (item.type === 'social') return <SocialPost key={item.id} data={item} onClick={() => setSelectedPost(item)} />;
                if (item.type === 'task') return <TaskCard key={item.id} data={item} onClick={() => setSelectedPost(item)} />;
                if (item.type === 'editorial') return <EditorialCard key={item.id} data={item} onClick={() => setSelectedPost(item)} />;
                return null;
              })}
            </motion.div>
          </AnimatePresence>
        );
      case 'review-order':
        return (
          <ReviewOrder 
            order={orderToReview} 
            onBack={() => setActiveNav('home')}
            onProceed={() => setActiveNav('payment')}
          />
        );
      case 'payment':
        return (
          <PaymentPage 
            order={orderToReview} 
            onBack={() => setActiveNav('review-order')}
            onSuccess={() => {
              setActiveNav('home');
              setOrderToReview(null);
            }}
          />
        );
      case 'create-post':
        return (
          <CreatePostPage 
            onBack={() => setActiveNav('home')}
            onPost={(threads) => {
              console.log('Posting threads:', threads);
              setActiveNav('home');
            }}
          />
        );
      case 'explore':
        return <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div>;
      case 'messages':
        return <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>;
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-xl mb-4">
                <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Your Name</h2>
              <p className="text-on-surface-variant text-sm mb-4">@your_handle</p>
              
              <div className="flex items-center gap-6 bg-surface-container-low border border-white/5 rounded-2xl px-8 py-4 shadow-inner">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-on-surface">128</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Posts</span>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-on-surface">1.2k</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Followers</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant border-b border-white/5 pb-2 mb-4">Recent Activity</h3>
              <div className="p-10 text-center text-on-surface-variant text-xs font-medium opacity-50 border border-white/5 rounded-xl border-dashed">
                No recent activity to show.
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMatcher(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <div className="min-h-screen bg-transparent text-on-surface flex flex-col max-w-2xl mx-auto border-x border-white/5 shadow-2xl">
      {/* Header */}
      {activeNav === 'home' && (
        <motion.header 
          variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
          }}
          animate={isVisible ? "visible" : "hidden"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/5"
        >
          <div className="flex justify-between items-center px-4 h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-primary font-black italic text-lg tracking-tighter">@</span>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('for-you')}
                className={`text-sm font-semibold transition-colors relative py-1 ${activeTab === 'for-you' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface/80'}`}
              >
                For you
                {activeTab === 'for-you' && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" 
                  />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('around-you')}
                className={`text-sm font-semibold transition-colors relative py-1 ${activeTab === 'around-you' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface/80'}`}
              >
                Around you
                {activeTab === 'around-you' && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" 
                  />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 shadow-inner">
                <Heart size={14} className="text-red-500 fill-red-500" />
                <span className="text-xs font-bold text-on-surface">4.2k</span>
              </div>
              <button 
                onClick={() => setActiveNav('profile')}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white/30 transition-colors shadow-sm"
              >
                <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Feed */}
      <main 
        className="flex-grow pb-20 relative overflow-x-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to refresh indicator */}
        <div className="absolute top-0 left-0 right-0 flex justify-center items-start z-40 pointer-events-none">
          <motion.div
            initial={false}
            animate={{ 
              y: isRefreshing ? 20 : Math.max(0, pullDistance - 20),
              opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
              scale: isRefreshing ? 1 : Math.min(pullDistance / 80, 1)
            }}
            transition={{ 
              type: isDragging ? "tween" : "spring",
              duration: isDragging ? 0 : undefined,
              stiffness: 300, 
              damping: 20 
            }}
            className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 shadow-xl flex items-center justify-center text-primary mt-4"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
              transition={{ 
                rotate: isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }
              }}
            >
              {isRefreshing ? <Loader2 size={20} /> : <RefreshCw size={20} />}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: isRefreshing ? 60 : pullDistance }}
          transition={{ 
            type: isDragging ? "tween" : "spring",
            duration: isDragging ? 0 : undefined,
            stiffness: 300, 
            damping: 20 
          }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      {activeNav !== 'review-order' && activeNav !== 'payment' && activeNav !== 'create-post' && (
        <motion.nav 
          variants={{ visible: { y: 0 }, hidden: { y: "100%" } }}
          animate={isVisible ? "visible" : "hidden"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass flex justify-around items-center px-4"
        >
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'explore', icon: Search, label: 'Explore' },
            { id: 'create', icon: Plus, label: 'Create', center: true },
            { id: 'messages', icon: MessageCircle, label: 'Messages', extra: () => setShowChatRoom(true) },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map((item) => item.center ? (
            <button key={item.id} onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground rounded-xl p-2.5 flex items-center justify-center hover:scale-110 transition-transform active:scale-90 shadow-xl shadow-black/40">
              <item.icon size={20} strokeWidth={3} />
            </button>
          ) : (
            <NavItem key={item.id} icon={item.icon} label={item.label} active={activeNav === item.id} onClick={() => { setActiveNav(item.id); item.extra?.(); }} />
          ))}
        </motion.nav>
      )}

      <AnimatePresence>
        {showMatcher && activeNav === 'home' && <GigMatcher onClose={() => setShowMatcher(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && <CreateModal onClose={() => setShowCreateModal(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showChatRoom && <ChatRoom onClose={() => setShowChatRoom(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          selectedPost.type === 'task' ? (
            <TaskDetailPage 
              task={selectedPost as any} 
              onBack={() => setSelectedPost(null)} 
            />
          ) : (
            <PostDetailPage 
              post={selectedPost} 
              onBack={() => setSelectedPost(null)} 
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-90 ${active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} fill={active ? "currentColor" : "none"} className={active ? "fill-primary/20" : ""} />
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

