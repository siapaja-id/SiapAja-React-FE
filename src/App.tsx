import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Routes, Route, useLocation, useNavigate, MemoryRouter } from 'react-router-dom';
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
  PanelLeftOpen
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
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

// Context to let components know which column they are in
export const ColumnContext = createContext<{ id: string }>({ id: 'main-col' });

const ProfileRoute = () => {
  const location = useLocation();
  const user = location.state?.user;
  // In the Kanban layout, we don't need PageSlide for profiles, it just renders in the column
  return <div className="pb-20 h-full overflow-y-auto hide-scrollbar"><ProfilePage user={user} /></div>;
};

const KanbanColumn = ({ col, isFirst }: { col: any, isFirst: boolean }) => {
  const closeColumn = useStore(state => state.closeColumn);
  const setColumnWidth = useStore(state => state.setColumnWidth);
  const [isResizing, setIsResizing] = useState(false);
  const colRef = useRef<HTMLDivElement>(null);

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
    <ColumnContext.Provider value={{ id: col.id }}>
      <div 
        ref={colRef}
        className="kanban-column-wrapper" 
        style={{ width: col.width }}
      >
        <div className={`kanban-column-content ${isResizing ? 'pointer-events-none opacity-80 scale-[0.98]' : ''} transition-transform`}>
          
          {/* Window Header */}
          <div className="h-8 shrink-0 border-b border-white/5 bg-white/5 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing">
            <div className="flex gap-1.5">
              {!isFirst && (
                <button onClick={() => closeColumn(col.id)} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group">
                  <X size={8} className="opacity-0 group-hover:opacity-100 text-black" />
                </button>
              )}
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest truncate max-w-[120px]">
              {col.path === '/' ? 'Home Feed' : col.path}
            </div>
            <div className="w-10" /> {/* Spacer for balance */}
          </div>

          {/* Column Router */}
          <div className="flex-1 overflow-hidden relative">
            <MemoryRouter initialEntries={[{ pathname: col.path, state: col.state }]}>
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
            </MemoryRouter>
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
        className={`p-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-colors mb-8 ${expanded ? 'self-end mr-4' : ''}`}
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
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all group overflow-hidden whitespace-nowrap
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
                <span className="text-[12px] font-bold truncate w-24 text-left">{currentUser.name}</span>
                <span className="text-[10px] text-emerald-400 font-black">{currentUser.karma} karma</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const showMatcher = useStore(state => state.showMatcher);
  const setShowMatcher = useStore(state => state.setShowMatcher);
  const showCreateModal = useStore(state => state.showCreateModal);
  const showChatRoom = useStore(state => state.showChatRoom);
  const columns = useStore(state => state.columns);
  const openColumn = useStore(state => state.openColumn);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowMatcher(true), 3000);
    return () => clearTimeout(timer);
  }, [setShowMatcher]);

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

      {/* Kanban Horizontal Scroll Container */}
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
              <KanbanColumn col={col} isFirst={index === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Spawn new empty column button */}
        <button 
          onClick={() => openColumn('/')}
          className="kanban-add-btn group"
          title="Open new feed column"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <AnimatePresence>
        {showMatcher && <GigMatcher />}
        {showCreateModal && <CreateModal />}
        {showChatRoom && <ChatRoom />}
      </AnimatePresence>
    </div>
  );
}