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
  FeedItem,
  FeedItemRenderer,
  SAMPLE_DATA 
} from './components/FeedItems.Component';
import { GigMatcher } from './components/GigMatcher.Component';
import { CreateModal } from './components/CreateModal.Component';
import { ChatRoom } from './components/ChatRoom.Component';
import { ReviewOrder } from './pages/ReviewOrder.Page';
import { PaymentPage } from './pages/Payment.Page';
import { CreatePostPage } from './pages/CreatePost.Page';
import { PostDetailPage } from './pages/PostDetail.Page';
import { UserAvatar } from './components/SharedUI.Component';

export default function App() {
  const [activeTab, setActiveTab] = useState<'for-you' | 'around-you'>('for-you');
  const [activeNav, setActiveNav] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [showMatcher, setShowMatcher] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [orderToReview, setOrderToReview] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<FeedItem | null>(null);
  
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
              {SAMPLE_DATA.map((item) => (
                <FeedItemRenderer key={item.id} data={item} onClick={() => setSelectedPost(item)} />
              ))}
            </motion.div>
          </AnimatePresence>
        );
      case 'review-order':
        return (
          <ReviewOrder order={orderToReview} onBack={() => setActiveNav('home')} onProceed={() => setActiveNav('payment')} />
        );
      case 'payment':
        return (
          <PaymentPage order={orderToReview} onBack={() => setActiveNav('review-order')} onSuccess={() => { setActiveNav('home'); setOrderToReview(null); }} />
        );
      case 'create-post':
        return (
          <CreatePostPage onBack={() => setActiveNav('home')} onPost={(threads) => { setActiveNav('home'); }} />
        );
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
            <div className="flex flex-col items-center text-center mb-8">
              <UserAvatar src="https://picsum.photos/seed/user/200/200" size="xl" className="w-24 h-24 mb-4 ring-2" />
              <h2 className="text-xl font-bold text-on-surface">Your Name</h2>
              <p className="text-on-surface-variant text-sm">@your_handle</p>
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
              <UserAvatar src="https://picsum.photos/seed/user/100/100" size="md" className="border-0" />
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
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'explore', icon: Search, label: 'Explore' },
            { id: 'create', icon: Plus, label: 'Create', center: true },
            { id: 'messages', icon: MessageCircle, label: 'Messages', extra: () => setShowChatRoom(true) },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map((item) => item.center ? (
            <button key={item.id} onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground rounded-xl p-2.5 shadow-xl"><item.icon size={20} strokeWidth={3} /></button>
          ) : (
            <button key={item.id} onClick={() => { setActiveNav(item.id); item.extra?.(); }} className={`flex flex-col items-center gap-1 ${activeNav === item.id ? 'text-primary' : 'text-on-surface-variant'}`}>
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