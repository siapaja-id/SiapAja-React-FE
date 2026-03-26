import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Plus, 
  User, 
  MessageCircle,
  Sparkles, 
  Loader2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Briefcase,
  ChevronRight,
  ChevronUp,
  X,
  Image as ImageIcon,
  Film,
  Mic,
  Paperclip,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  FeedItemRenderer,
} from '@/src/features/feed/components/FeedItems.Component';
import { FeedItem, Author } from '@/src/shared/types/domain.type';
import { GigMatcher } from '@/src/features/gigs/components/GigMatcher.Component';
import { CreateModal } from '@/src/features/creation/components/CreateModal.Component';
import { ChatRoom } from '@/src/features/chat/components/ChatRoom.Component';
import { ProfilePage } from '@/src/features/profile/pages/Profile.Page';
import { ReviewOrder } from '@/src/features/gigs/pages/ReviewOrder.Page';
import { PaymentPage } from '@/src/features/gigs/pages/Payment.Page';
import { CreatePostPage } from '@/src/features/feed/pages/CreatePost.Page';
import { PostDetailPage } from '@/src/features/feed/pages/PostDetail.Page';
import { UserAvatar, PageSlide, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

const FeedComposer = () => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'video' | 'voice' | 'file'; url: string }[]>([]);
  
  const setInitialAiQuery = useStore(state => state.setInitialAiQuery);
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const currentUser = useStore(state => state.currentUser);

  const handleSubmit = () => {
    if (!text.trim() && attachments.length === 0) return;
    
    // Combine text and a description of attachments for the AI
    const contextSuffix = attachments.length > 0 
      ? `\n\n[Attached: ${attachments.map(a => a.type).join(', ')}]`
      : '';
      
    setInitialAiQuery(text + contextSuffix);
    setShowCreateModal(true);
    setText('');
    setAttachments([]);
    setIsFocused(false);
    setIsFullscreen(false);
  };

  const addMockMedia = (type: 'image' | 'video' | 'voice' | 'file') => {
    const urls = {
      image: 'https://picsum.photos/seed/post/400/300',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      voice: '0:15',
      file: 'document.pdf'
    };
    setAttachments([...attachments, { type, url: urls[type] }]);
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!text.trim() && !isFullscreen) {
      setIsFocused(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm max-w-2xl mx-auto" 
          />
        )}
      </AnimatePresence>

      <div className={isFullscreen ? "" : "mx-4 mt-4 mb-2"}>
        <motion.div
          layout
          className={`${
            isFullscreen
              ? 'fixed inset-0 z-[110] bg-surface flex flex-col max-w-2xl mx-auto border-x border-white/5 h-[100dvh]'
              : 'relative bg-surface-container border border-white/10 p-4 shadow-lg rounded-[28px]'
          } overflow-hidden`}
        >
          {isFullscreen && (
            <motion.div layout className="flex justify-between items-center p-4 border-b border-white/5 glass">
              <button onClick={() => setIsFullscreen(false)} className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest opacity-50">Create Task</h2>
              <button 
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
              >
                Continue
              </button>
            </motion.div>
          )}

          <div className={`flex gap-3 ${isFullscreen ? 'px-6 pt-6 pb-2 flex-grow flex-col overflow-hidden' : ''}`}>
            {!isFullscreen && (
              <div className="flex-shrink-0 pt-1">
                <UserAvatar src={currentUser.avatar} size="md" />
              </div>
            )}
            
            <div className={`flex flex-col relative ${isFullscreen ? 'flex-grow min-h-0' : ''}`}>
              {isFullscreen && (
                <div className="flex items-center gap-3 mb-4">
                  <UserAvatar src={currentUser.avatar} size="md" />
                  <span className="font-bold text-on-surface">{currentUser.name}</span>
                </div>
              )}
              <AutoResizeTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                placeholder="What do you need help with? Describe your task in detail..."
                className={`w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none resize-none hide-scrollbar transition-all ${
                  isFullscreen ? 'text-2xl leading-relaxed font-medium' : 'text-[15px] pt-1.5'
                }`}
                minHeight={isFullscreen ? 'calc(100vh - 280px)' : 40}
              />
              
              {/* Media Preview Area */}
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 mt-4"
                  >
                    {attachments.map((item, idx) => (
                      <div key={idx} className="relative group/item">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant">
                          {item.type === 'image' && <img src={item.url} className="w-full h-full object-cover" />}
                          {item.type === 'video' && <Film size={24} />}
                          {item.type === 'voice' && <Mic size={24} className="text-primary" />}
                          {item.type === 'file' && <Paperclip size={24} />}
                        </div>
                        <button 
                          onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addMockMedia('image')}
                      className="w-20 h-20 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1 text-[10px] text-on-surface-variant hover:bg-white/5 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Add More</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {(isFocused || isFullscreen || text || attachments.length > 0) && (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center justify-between ${isFullscreen ? 'p-6 border-t border-white/5 bg-surface-container-high/30' : 'pt-3 mt-3 border-t border-white/5'}`}
              >
                <div className="flex items-center gap-0.5 text-primary">
                  <button onClick={() => addMockMedia('image')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Image">
                    <ImageIcon size={18} />
                  </button>
                  <button onClick={() => addMockMedia('video')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Video">
                    <Film size={18} />
                  </button>
                  <button onClick={() => addMockMedia('voice')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Voice">
                    <Mic size={18} />
                  </button>
                  <button onClick={() => addMockMedia('file')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Attach File">
                    <Paperclip size={18} />
                  </button>
                  {!isFullscreen && (
                    <button onClick={() => setIsFullscreen(true)} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-on-surface-variant" title="Fullscreen">
                      <Maximize2 size={18} />
                    </button>
                  )}
                </div>
                
                {!isFullscreen && (
                  <button 
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

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
  const feedItems = useStore(state => state.feedItems);
  const currentUser = useStore(state => state.currentUser);
  
  const navigate = useNavigate();
  const location = useLocation();

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
            <button onClick={() => navigate('/profile', { state: {} })} className="flex items-center gap-1 bg-surface-container-high border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors shadow-sm">
              <span className="text-emerald-400 font-black text-[13px]">{currentUser.karma || '98'}</span>
              <ChevronUp size={14} className="text-emerald-400" strokeWidth={3} />
            </button>
          </div>
        </motion.header>
      )}

      <main className="flex-grow pb-20 relative overflow-x-hidden hide-scrollbar" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="absolute left-0 right-0 flex justify-center items-start z-40 pointer-events-none top-[4.5rem]">
          <motion.div animate={{ y: isRefreshing ? 0 : Math.max(0, pullDistance - 40), opacity: pullDistance > 10 ? 1 : 0 }} className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 shadow-xl flex items-center justify-center text-primary">
            <motion.div animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }} transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : undefined}>
              {isRefreshing ? <Loader2 size={20} /> : <RefreshCw size={20} />}
            </motion.div>
          </motion.div>
        </div>
        
        <Routes>
          <Route path="/" element={
            <motion.div animate={{ y: isRefreshing ? 60 : pullDistance }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FeedComposer />
                  {feedItems.map((item) => (
                    <FeedItemRenderer
                      key={item.id}
                      data={item}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          } />
          <Route path="/review-order" element={<ReviewOrder />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/task/:id" element={<PostDetailPage />} />
          <Route path="/explore" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div>} />
          <Route path="/messages" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>} />
        </Routes>
      </main>

      {['/', '/explore', '/messages', '/profile'].includes(location.pathname) && (
        <motion.nav animate={isVisible ? { y: 0 } : { y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass border-t border-white/5 flex justify-around items-center px-4">
          {[
            { id: '/', icon: Home, label: 'Home' },
            { id: '/explore', icon: Search, label: 'Explore' },
            { id: 'create', icon: Plus, label: 'Create', center: true },
            { id: '/messages', icon: MessageCircle, label: 'Messages', extra: () => setShowChatRoom(true) },
            { id: '/profile', icon: User, label: 'Profile' }
          ].map((item) => item.center ? (
            <button key={item.id} onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground rounded-xl p-2.5 shadow-xl"><item.icon size={20} strokeWidth={3} /></button>
          ) : (
            <button key={item.id} onClick={() => { 
              navigate(item.id, { state: item.id === '/profile' ? {} : undefined }); 
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