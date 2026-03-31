import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate, useRoutes, Routes, Route } from 'react-router-dom';
import {
  Home,
  Search,
  Plus,
  User,
  MessageCircle,
  ChevronRight,
  ClipboardList,
  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingCart,
  UserCircle,
  FileText,
  Zap,
  CreditCard,
  Pencil,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarPage } from '@/src/features/gigs/pages/Radar.Page';
import { CreateModal } from '@/src/features/creation/components/CreateModal.Component';
import { ChatRoom } from '@/src/features/chat/components/ChatRoom.Component';
import { ProfilePage } from '@/src/features/profile/pages/Profile.Page';
import { ReviewOrder } from '@/src/features/gigs/pages/ReviewOrder.Page';
import { PaymentPage } from '@/src/features/gigs/pages/Payment.Page';
import { CreatePostPage } from '@/src/features/feed/pages/CreatePost.Page';
import { PostDetailPage } from '@/src/features/feed/pages/PostDetail.Page';
import { PageSlide } from '@/src/shared/ui/SharedUI.Component';
import { HomePage } from '@/src/features/feed/pages/Home.Page';
import { SettingsPage } from '@/src/features/settings/pages/Settings.Page';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { AppColumn, Author } from '@/src/shared/types/domain.type';

const ProfileRoute = () => {
  const { state } = useContext(ColumnContext);
  const user = state?.user as Author | undefined;
  // In the Kanban layout, we don't need PageSlide for profiles, it just renders in the column
  return <div className="pb-20 h-full overflow-y-auto hide-scrollbar"><ProfilePage user={user} /></div>;
};

// Route configuration shared across columns
const columnRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/review-order', element: <ReviewOrder /> },
  { path: '/payment', element: <PaymentPage /> },
  { path: '/create-post', element: <CreatePostPage /> },
  { path: '/profile', element: <ProfileRoute /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/post/:id', element: <PostDetailPage /> },
  { path: '/task/:id', element: <PostDetailPage /> },
  { path: '/orders', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Orders View</div> },
  { path: '/radar', element: <RadarPage /> },
  { path: '/messages', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div> },
];

// Custom hook to provide location-like API from column context
const useColumnLocation = () => {
  const { path, state } = useContext(ColumnContext);
  return {
    pathname: path,
    state,
    search: '',
    hash: '',
    key: 'default'
  };
};

// Component that renders routes for a column using useRoutes
const ColumnRoutes = ({ path }: { path: string }) => {
  const routes = useRoutes(columnRoutes, path);
  return routes;
};

const getColumnMeta = (path: string): { icon: React.ElementType; label: string } => {
  if (path === '/') return { icon: Home, label: 'Home' };
  if (path === '/radar') return { icon: Zap, label: 'Radar' };
  if (path === '/messages') return { icon: MessageCircle, label: 'Messages' };
  if (path === '/orders') return { icon: ShoppingCart, label: 'Orders' };
  if (path === '/profile') return { icon: UserCircle, label: 'Profile' };
  if (path === '/create-post') return { icon: Pencil, label: 'New Post' };
  if (path === '/review-order') return { icon: FileText, label: 'Review Order' };
  if (path === '/payment') return { icon: CreditCard, label: 'Payment' };
  if (path === '/settings') return { icon: Settings, label: 'Settings' };
  if (path.startsWith('/post/')) return { icon: FileText, label: 'Post' };
  if (path.startsWith('/task/')) return { icon: ClipboardList, label: 'Task' };
  // Check column state for profile/user context
  return { icon: Search, label: 'Column' };
};

const KanbanColumn = ({ col, index, total }: { col: AppColumn, index: number, total: number }) => {
  const closeColumn = useStore(state => state.closeColumn);
  const setColumnWidth = useStore(state => state.setColumnWidth);
  const columns = useStore(state => state.columns);
  const [isResizing, setIsResizing] = useState(false);
  const colRef = useRef<HTMLDivElement>(null);

  const meta = getColumnMeta(col.path);
  const Icon = meta.icon;
  const isFirst = index === 0;
  const canClose = !isFirst;

  // Get title from column state if available (e.g. profile user name)
  const title = (col.state?.user as Author | undefined)?.name || meta.label;

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
    <ColumnContext.Provider value={{ id: col.id, path: col.path, state: col.state }}>
      <div
        ref={colRef}
        className="kanban-column-wrapper"
        style={{ width: col.width }}
      >
        <div className={`kanban-column-content ${isResizing ? 'pointer-events-none opacity-80 scale-[0.98]' : ''} transition-transform`}>

          {/* Column Header Bar */}
          <div className="kanban-col-header">
            <div className="kanban-col-header-left">
              <div className="kanban-col-header-icon">
                <Icon size={14} />
              </div>
              <span className="kanban-col-header-title">{title}</span>
            </div>
            <div className="kanban-col-header-right">
              {total > 1 && (
                <span className="kanban-col-header-badge">{index + 1}/{total}</span>
              )}
              {canClose && (
                <button onClick={() => closeColumn(col.id)} className="kanban-col-close-btn">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Column Routes */}
          <div className="flex-1 overflow-y-auto hide-scrollbar relative">
            <ColumnRoutes path={col.path} />
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
    { id: '/radar', icon: Zap, label: 'Radar' },
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
        className={`p-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-colors mb-8 ${expanded ? 'self-end mr-4' : 'self-center'}`}
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
            className={`flex items-center ${expanded ? 'gap-4 justify-start' : 'gap-0 justify-center'} p-3 rounded-2xl transition-all group overflow-hidden whitespace-nowrap
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
                <span className="text-xs font-bold truncate w-24 text-left">{currentUser.name}</span>
                <span className="text-2sm text-emerald-400 font-black">{currentUser.karma} karma</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

const DesktopKanbanLayout = () => {
  const columns = useStore(state => state.columns);
  const openColumn = useStore(state => state.openColumn);
  const containerRef = useRef<HTMLDivElement>(null);

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
              <KanbanColumn col={col} index={index} total={columns.length} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => openColumn('/')}
          className="kanban-add-btn"
          title="Open new feed column"
        >
          <Plus size={24} className="kanban-add-btn-icon" />
        </button>
      </div>
    </div>
  );
};

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);

  return (
    <div className="min-h-[100dvh] bg-background text-on-surface flex flex-col max-w-2xl mx-auto shadow-2xl relative">
      <main className="flex-grow pb-20 relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review-order" element={<ReviewOrder />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/task/:id" element={<PostDetailPage />} />
          <Route path="/orders" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Orders View</div>} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/messages" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>} />
        </Routes>
      </main>

      {['/', '/radar', '/messages', '/profile', '/orders'].includes(location.pathname) && (
        <nav className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass border-t border-white/5 flex justify-around items-center px-4 will-change-transform">
          {[
            { id: '/', icon: Home, label: 'Home' },
            { id: '/radar', icon: Zap, label: 'Radar' },
            { id: 'create', icon: Plus, label: 'Create', center: true },
            { id: '/messages', icon: MessageCircle, label: 'Messages', extra: () => setShowChatRoom(true) },
            { id: '/orders', icon: ClipboardList, label: 'Orders' }
          ].map((item) => item.center ? (
            <button key={item.id} onClick={() => setShowCreateModal(true)} className="bg-primary text-primary-foreground rounded-xl p-2.5 shadow-xl"><item.icon size={20} strokeWidth={3} /></button>
          ) : (
            <button key={item.id} onClick={() => {
              navigate(item.id, { state: (item.id === '/profile' || item.id === '/orders') ? {} : undefined });
              if (item.extra) item.extra();
            }} className={`flex flex-col items-center gap-1 ${location.pathname === item.id && !location.state?.user ? 'text-primary' : 'text-on-surface-variant'}`}>
              <item.icon size={22} /><span className="text-2xs font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default function App() {
  const isDesktop = useStore(state => state.isDesktop);
  const setIsDesktop = useStore(state => state.setIsDesktop);
  const showCreateModal = useStore(state => state.showCreateModal);
  const showChatRoom = useStore(state => state.showChatRoom);
  
  const themeColor = useStore(state => state.themeColor);
  const textSize = useStore(state => state.textSize);
  const zoomLevel = useStore(state => state.zoomLevel);

  useEffect(() => {
    const root = document.documentElement;
    const colors = { red: '#DC2626', blue: '#3B82F6', emerald: '#10B981', violet: '#8B5CF6', amber: '#F59E0B' };
    const sizes = { sm: '12px', md: '14px', lg: '16px' };
    
    root.style.setProperty('--app-primary', colors[themeColor] || colors.red);
    root.style.setProperty('--app-text-base', sizes[textSize] || sizes.md);
  }, [themeColor, textSize]);

  useEffect(() => {
    const unsub = useStore.subscribe((state) => {
      localStorage.setItem('siapaja-settings', JSON.stringify({
        themeColor: state.themeColor,
        textSize: state.textSize,
        zoomLevel: state.zoomLevel,
      }));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsDesktop]);

  return (
    <div style={{ zoom: zoomLevel / 100, minHeight: '100dvh' }}>
      {isDesktop ? <DesktopKanbanLayout /> : <MobileLayout />}

      <AnimatePresence>
        {showCreateModal && <CreateModal />}
        {showChatRoom && <ChatRoom />}
      </AnimatePresence>
    </div>
  );
}