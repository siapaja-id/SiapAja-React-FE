import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Plus,
  User,
  MessageCircle,
  ChevronRight,
  ChevronUp,
  ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
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
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

const ProfileRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const isViewedUser = !!location.state?.user;

  const content = <ProfilePage user={user} onBack={isViewedUser ? () => navigate(-1) : undefined} />;
  return isViewedUser ? <PageSlide>{content}</PageSlide> : <div className="pb-20">{content}</div>;
};

export default function App() {
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);
  const showMatcher = useStore(state => state.showMatcher);
  const setShowMatcher = useStore(state => state.setShowMatcher);
  const showCreateModal = useStore(state => state.showCreateModal);
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const showChatRoom = useStore(state => state.showChatRoom);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);
  const currentUser = useStore(state => state.currentUser);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);

  const { scrollY } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setShowMatcher(true), 3000);
    return () => clearTimeout(timer);
  }, [setShowMatcher]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsVisible(latest <= previous || latest <= 150);
  });

  return (
    <div className="min-h-screen bg-transparent text-on-surface flex flex-col max-w-2xl mx-auto border-x border-white/5 shadow-2xl" style={{ overscrollBehaviorY: 'contain' }}>
      {location.pathname === '/' && (
        <motion.header
          animate={isVisible ? { y: 0 } : { y: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky top-0 z-50 glass border-b border-white/5"
        >
          <div className="flex justify-between items-center px-4 h-16">
            <button onClick={() => navigate('/profile', { state: {} })} className="hover:opacity-80 transition-opacity">
              <UserAvatar src={currentUser.avatar} size="md" isOnline={true} />
            </button>
            <div className="flex space-x-6">
              {['for-you', 'around-you'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-sm font-semibold relative py-1 capitalize ${activeTab === tab ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {tab.replace('-', ' ')}
                  {activeTab === tab && <motion.div layoutId="tab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              ))}
            </div>
            <button onClick={() => navigate('/profile', { state: {} })} className="flex items-center gap-1 bg-surface-container-high border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors shadow-sm">
              <span className="text-emerald-400 font-black text-[13px]">{currentUser.karma || '98'}</span>
              <ChevronUp size={14} className="text-emerald-400" strokeWidth={3} />
            </button>
          </div>
        </motion.header>
      )}

      <main className="flex-grow pb-20 relative overflow-x-hidden hide-scrollbar">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review-order" element={<ReviewOrder />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/task/:id" element={<PostDetailPage />} />
          <Route path="/orders" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Orders View</div>} />
          <Route path="/explore" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div>} />
          <Route path="/messages" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>} />
        </Routes>
      </main>

      {['/', '/explore', '/messages', '/profile', '/orders'].includes(location.pathname) && (
        <motion.nav animate={isVisible ? { y: 0 } : { y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass border-t border-white/5 flex justify-around items-center px-4">
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
              item.extra?.();
            }} className={`flex flex-col items-center gap-1 ${location.pathname === item.id && !location.state?.user ? 'text-primary' : 'text-on-surface-variant'}`}>
              <item.icon size={22} /><span className="text-[9px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </motion.nav>
      )}

      <AnimatePresence>
        {showMatcher && location.pathname === '/' && <GigMatcher />}
        {showCreateModal && <CreateModal />}
        {showChatRoom && <ChatRoom />}
      </AnimatePresence>
    </div>
  );
}