# Directory Structure
```
src/
  features/
    chat/
      components/
        ChatRoom.Component.tsx
    creation/
      components/
        AIChatRequest.Component.tsx
        CreateModal.Component.tsx
      types/
        creation.types.ts
    feed/
      pages/
        CreatePost.Page.tsx
    gigs/
      pages/
        Payment.Page.tsx
        ReviewOrder.Page.tsx
  shared/
    types/
      domain.type.ts
    ui/
      SharedUI.Component.tsx
  store/
    app.slice.ts
    main.store.ts
    order.slice.ts
  App.tsx
  index.css
```

# Files

## File: src/store/main.store.ts
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

## File: src/index.css
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  
  --color-background: #000000;
  --color-surface: #050505;
  --color-surface-container: #0D0D0D;
  --color-surface-container-low: #121212;
  --color-surface-container-lowest: #161616;
  --color-surface-container-high: #1F1F1F;
  --color-surface-container-highest: #2D2D2D;
  
  --color-on-surface: #FFFFFF;
  --color-on-surface-variant: #A1A1AA;
  --color-outline-variant: #27272A;
  
  --color-primary: #DC2626;
  --color-primary-foreground: #FFFFFF;

  --shadow-glow: 0 0 20px rgba(255, 255, 255, 0.03);
  --shadow-inner-glow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

@layer base {
  body {
    @apply bg-background text-on-surface font-sans antialiased selection:bg-white/10;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-image: radial-gradient(circle at 50% -20%, #0A0A0A 0%, #000000 100%);
    background-attachment: fixed;
    overscroll-behavior-y: none;
  }
}

.glass {
  @apply bg-surface-container/60 backdrop-blur-xl border border-white/5 shadow-inner-glow;
}

.card-depth {
  @apply transition-all duration-300 hover:bg-surface-container-low/40 hover:shadow-glow hover:-translate-y-0.5 border-b border-white/5;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

## File: src/features/creation/types/creation.types.ts
```typescript
import { OrderData } from '@/src/shared/types/domain.type';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'selection' | 'summary' | 'welcome' | 'map-widget';
  data?: OrderData;
}

export interface AIChatRequestProps {
  onComplete: (data: OrderData) => void;
  onClose?: () => void;
  onBack?: () => void;
}

export type CreateType = 'social' | 'request' | null;

export interface SelectionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  accent: 'primary' | 'emerald';
}

export interface SocialFormProps {
  onPost: () => void;
}

export interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  delay: number;
}
```

## File: src/store/order.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { OrderData } from '@/src/shared/types/domain.type';

export interface OrderSlice {
  orderToReview: OrderData | null;
  setOrderToReview: (order: OrderData | null) => void;
}

export const createOrderSlice: StateCreator<OrderSlice> = (set) => ({
  orderToReview: null,
  setOrderToReview: (order) => set({ orderToReview: order }),
});
```

## File: src/features/chat/components/ChatRoom.Component.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, Car, Package, Briefcase, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { ChatMessage } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';

export const ChatRoom: React.FC = () => {
  const messages = useStore(state => state.chatMessages);
  const addChatMessage = useStore(state => state.addChatMessage);
  const onClose = useStore(state => state.setShowChatRoom);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      senderName: 'Me',
      senderAvatar: 'https://picsum.photos/seed/me/100/100',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    addChatMessage(newMessage);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center glass">
        <div className="flex items-center gap-3">
          <button onClick={() => onClose(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserAvatar src="https://picsum.photos/seed/req2/100/100" size="lg" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <h2 className="text-sm font-black text-on-surface tracking-tight">Sarah Logistics</h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active • Delivery Task</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 hide-scrollbar"
      >
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 py-1 px-3 bg-white/5 rounded-full">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              {!msg.isMe && <UserAvatar src={msg.senderAvatar} size="md" />}
              <div className="space-y-1">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-on-surface border border-white/10 rounded-tl-none'}`}>
                  {msg.content}
                </div>
                <div className={`text-[9px] font-bold text-on-surface-variant/40 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 glass">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:scale-90 transition-all active:scale-90 shadow-lg shadow-primary/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
```

## File: src/features/gigs/pages/Payment.Page.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, QrCode, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { CheckoutLayout } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

export const PaymentPage: React.FC = () => {
  const order = useStore(state => state.orderToReview);
  const setOrderToReview = useStore(state => state.setOrderToReview);
  const navigate = useNavigate();

  const onBack = () => navigate(-1);
  const onSuccess = () => {
    navigate('/');
    setOrderToReview(null);
  };
  const [status, setStatus] = useState<'selecting' | 'processing' | 'success'>('selecting');

  const handlePayment = () => {
    if (!order) return;
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 3000);
  };

  React.useEffect(() => {
    if (!order) navigate('/');
  }, [order, navigate]);

  if (!order) return null;

  return (
    <CheckoutLayout title="Payment" subtitle="Step 2 of 2 • Checkout" onBack={onBack}>

        <AnimatePresence mode="wait">
          {status === 'selecting' && (
            <motion.div 
              key="selecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Amount Card */}
              <div className="glass rounded-[32px] p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-2 block">Amount to Pay</span>
                <h3 className="text-4xl font-black text-on-surface tracking-tighter mb-4">{order.amount}</h3>
                <div className="flex items-center justify-center gap-2 text-emerald-500 bg-emerald-500/10 py-2 px-4 rounded-full w-fit mx-auto border border-emerald-500/20">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secure Payment</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                <PaymentOption 
                  icon={<QrCode size={24} />}
                  title="QRIS Scan"
                  description="Scan with any mobile banking or e-wallet app."
                  onClick={handlePayment}
                  active
                />
                <PaymentOption 
                  icon={<Smartphone size={24} />}
                  title="Gopay / OVO"
                  description="Direct payment via your e-wallet app."
                  onClick={handlePayment}
                />
                <PaymentOption 
                  icon={<CreditCard size={24} />}
                  title="Credit Card"
                  description="Visa, Mastercard, or JCB."
                  onClick={handlePayment}
                />
              </div>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-primary/20 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-24 h-24 border-4 border-primary border-t-transparent rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="text-primary animate-pulse" size={32} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Processing Payment</h3>
                <p className="text-sm text-on-surface-variant">Please wait while we verify your transaction...</p>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40"
              >
                <CheckCircle2 size={48} strokeWidth={3} />
              </motion.div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-on-surface uppercase tracking-tight">Payment Success!</h3>
                <p className="text-sm text-on-surface-variant">Your order has been confirmed and is being processed.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </CheckoutLayout>
  );
};

const PaymentOption: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
  active?: boolean;
}> = ({ icon, title, description, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-2xl border flex items-center gap-4 text-left transition-all active:scale-[0.98] ${
      active
        ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5' 
        : 'bg-white/5 border-white/10 hover:bg-white/10'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-primary text-white' : 'bg-white/5 text-on-surface-variant'}`}>
      {icon}
    </div>
    <div className="flex-grow">
      <h4 className="font-bold text-on-surface text-sm">{title}</h4>
      <p className="text-[10px] text-on-surface-variant/60 font-medium">{description}</p>
    </div>
    {active && (
      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary">
        <Check size={14} strokeWidth={3} />
      </div>
    )}
  </button>
);
```

## File: src/features/gigs/pages/ReviewOrder.Page.tsx
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, Clock, MapPin, DollarSign, Zap, Users } from 'lucide-react';
import Markdown from 'react-markdown';
import { CheckoutLayout, Button, TagBadge } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

export const ReviewOrder: React.FC = () => {
  const order = useStore(state => state.orderToReview);
  const navigate = useNavigate();
  const onBack = () => navigate('/');
  const onProceed = () => navigate('/payment');

  React.useEffect(() => {
    if (!order) navigate('/');
  }, [order, navigate]);

  if (!order) return null;

  return (
    <CheckoutLayout title="Review Request" subtitle="Step 1 of 2 • Verification" onBack={onBack}>
        {/* Order Card */}
        <div className="glass rounded-[32px] overflow-hidden mb-6">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                {order.matchType === 'instant' ? <Zap size={20} /> : <Users size={20} />}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Verified Request</span>
                <p className="text-sm font-bold text-on-surface">{order.title || 'AI-Generated Summary'}</p>
              </div>
            </div>
            <TagBadge variant="emerald">
              Ready
            </TagBadge>
          </div>
          
          <div className="p-8">
            <div className="markdown-body prose prose-invert max-w-none prose-sm">
              <Markdown>{order.summary || 'No description provided.'}</Markdown>
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Clock size={14} className="text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {order.matchType === 'instant' ? 'Instant Match' : 'Feed Bidding'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin size={14} className="text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                {order.locations?.[0] || 'Local Service'}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-6 bg-primary/10 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                <DollarSign size={16} />
              </div>
              <span className="text-sm font-bold text-on-surface uppercase tracking-widest">Total Amount</span>
            </div>
            <span className="text-2xl font-black text-on-surface">{order.amount}</span>
          </div>
          
          <Button 
            onClick={onProceed}
            size="lg" fullWidth
          >
            Proceed to Payment
          </Button>
          
          <p className="text-center text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest">
            Secure transaction powered by @Logistics
          </p>
        </div>
    </CheckoutLayout>
  );
};
```

## File: src/shared/types/domain.type.ts
```typescript
import React from 'react';

export type TabState = 'for-you' | 'around-you';

export interface Author {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  karma?: number;
  isOnline?: boolean;
}

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface CreationContext {
  parentId: string;
  type: 'social' | 'task' | 'editorial';
  authorHandle: string;
  content: string;
  avatarUrl: string;
  taskTitle?: string;
  taskPrice?: string;
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
  bidStatus?: BidStatus;
  quote?: FeedItem;
  threadCount?: number;
  threadIndex?: number;
  isFirstPost?: boolean;
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
  isFirstPost?: boolean;
  isFirstTask?: boolean;
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
  isFirstPost?: boolean;
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
  matchType?: 'instant' | 'bidding';
  locations?: string[];
}
```

## File: src/features/creation/components/AIChatRequest.Component.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, FileText, X, Users, Zap, Plus, ImageIcon, Camera, Mic, Paperclip, CheckCircle2, AlignLeft, GripHorizontal } from 'lucide-react';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { AIChatMessage, AIChatRequestProps } from '@/src/features/creation/types/creation.types';
import { OrderData } from '@/src/shared/types/domain.type';

export const AIChatRequest: React.FC<AIChatRequestProps & { initialQuery?: string }> = ({ onComplete, onClose, onBack, initialQuery }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [view, setView] = useState<'chat' | 'canvas'>('chat');
  const [draft, setDraft] = useState<Partial<OrderData>>({ matchType: 'instant', locations: [], amount: '', type: 'task', title: '', summary: '' });
  const [hasUnreadDraft, setHasUnreadDraft] = useState(false);
  
  // Map Modal State
  const [showMap, setShowMap] = useState(false);
  const [mapCallback, setMapCallback] = useState<(loc: string) => void>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSend(initialQuery);
      // Auto-populate initial text into canvas as well
      updateDraft({ summary: initialQuery });
    }
  }, [initialQuery]);

  useEffect(() => {
    if (scrollRef.current && view === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, view]);

  const addMessage = (role: 'user' | 'assistant', content: string, type?: 'selection' | 'summary' | 'map-widget', data?: OrderData) => {
    const newMessage: AIChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const updateDraft = (updates: Partial<OrderData>) => {
    setDraft(prev => ({ ...prev, ...updates }));
    if (view !== 'canvas') setHasUnreadDraft(true);
  };

  const insertMediaToCanvas = () => {
    const mediaMarkdown = `\n\n![Attachment](https://picsum.photos/seed/${Math.random()}/800/400)\n\n`;
    updateDraft({ summary: (draft.summary || '') + mediaMarkdown });
    if (view === 'chat') {
      addMessage('assistant', "I've attached a placeholder image to your canvas document.");
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    addMessage('user', text);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      processAIResponse(text);
    }, 1500);
  };

  const processAIResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ride') || lowerText.includes('pick me up')) {
      updateDraft({ title: draft.title || 'Ride Request', type: 'ride', matchType: 'instant' });
      addMessage('assistant', "I can help you book a ride. Tap the map widget below to set your pickup location.", 'map-widget');
    } else if (lowerText.includes('delivery') || lowerText.includes('package')) {
      updateDraft({ title: draft.title || 'Delivery Request', type: 'delivery', matchType: 'instant' });
      addMessage('assistant', "I'll arrange a delivery. Please select the pickup point on the map.", 'map-widget');
    } else if (lowerText.includes('photo') || lowerText.includes('image') || lowerText.includes('picture')) {
      insertMediaToCanvas();
    } else if (lowerText.includes('budget') || lowerText.includes('cost') || lowerText.includes('$') || lowerText.includes('rp')) {
      const amountMatch = text.match(/(?:Rp|\$)\s?\d+(?:[.,]\d+)?(?:k|m)?/i);
      if (amountMatch) {
        updateDraft({ amount: amountMatch[0] });
        addMessage('assistant', `I've updated the budget to ${amountMatch[0]} in your canvas.`);
      } else {
        addMessage('assistant', "What's your estimated budget for this?");
      }
    } else {
      updateDraft({ summary: (draft.summary ? draft.summary + '\n' : '') + text });
      addMessage('assistant', "I've added those details to your Canvas. You can seamlessly edit the document there, or keep chatting with me!");
    }
  };

  const handleOpenMap = (callback: (loc: string) => void) => {
    setMapCallback(() => callback);
    setShowMap(true);
  };

  const confirmMapLocation = () => {
    const mockAddresses = ['123 Main St, Downtown', '456 Elm St, Midtown', 'Airport Terminal 3', 'Central Station', 'Tech Hub Workspace'];
    const loc = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    mapCallback?.(loc);
    setShowMap(false);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Native iOS-Style Header */}
      <div className="pt-12 pb-3 px-4 flex items-center justify-between bg-surface/80 backdrop-blur-2xl z-20 shrink-0 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-on-surface-variant transition-colors">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        
        {/* Segmented Control */}
        <div className="flex bg-surface-container-highest p-1 rounded-full relative w-48 shadow-inner border border-white/5">
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface rounded-full shadow-sm border border-white/10 transition-all duration-300 ease-out"
            style={{ transform: view === 'chat' ? 'translateX(0)' : 'translateX(100%)' }}
          />
          <button 
            onClick={() => setView('chat')} 
            className={`flex-1 relative z-10 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-colors ${view === 'chat' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <Bot size={14} /> Chat
          </button>
          <button 
            onClick={() => { setView('canvas'); setHasUnreadDraft(false); }} 
            className={`flex-1 relative z-10 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-colors ${view === 'canvas' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <FileText size={14} /> Canvas
            {hasUnreadDraft && view === 'chat' && (
              <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </button>
        </div>

        <button onClick={onClose} className="p-2 -mr-2 hover:bg-white/5 rounded-full text-on-surface-variant transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow relative overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          {view === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col"
            >
              <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 p-4 pb-32 hide-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-10 px-4">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center relative shadow-inner rotate-3">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
                      <Sparkles size={32} className="text-primary relative z-10 -rotate-3" />
                    </div>
                    <div className="space-y-2 max-w-[240px]">
                      <h2 className="text-2xl font-black text-on-surface tracking-tight">AI Co-pilot</h2>
                      <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                        Chat to shape your request, or swipe to the Canvas to write it like a doc.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/5 text-primary flex items-center justify-center flex-shrink-0 mt-auto shadow-sm">
                          <Bot size={14} />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm break-words relative ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-[24px] rounded-br-[8px]' 
                            : 'bg-surface-container-low border border-white/5 text-on-surface rounded-[24px] rounded-bl-[8px]'
                        }`}>
                          {msg.content}
                        </div>
                        
                        {msg.type === 'map-widget' && (
                          <div className="bg-surface-container border border-white/5 rounded-[24px] p-2 overflow-hidden w-64 shadow-md">
                            <div className="h-24 bg-surface-container-highest relative rounded-2xl overflow-hidden mb-2">
                               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-50 grayscale-[0.5]" />
                               <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                    <MapPin size={20} className="text-emerald-500 drop-shadow-md" />
                                 </div>
                               </div>
                            </div>
                            <div className="px-2 pb-2">
                              <h4 className="font-bold text-sm text-on-surface">Location Required</h4>
                              <p className="text-xs text-on-surface-variant mb-3">Tap to drop a pin.</p>
                              <Button 
                                variant="emerald" size="sm" fullWidth
                                onClick={() => handleOpenMap((loc) => {
                                  addMessage('user', `📍 Selected: ${loc}`);
                                  updateDraft({ locations: [...(draft.locations || []), loc] });
                                  setTimeout(() => addMessage('assistant', "Got it. I've updated the Canvas with this location."), 1000);
                                })}
                              >
                                Open Map
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2.5 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/5 text-primary flex items-center justify-center mt-auto shadow-sm">
                        <Bot size={14} />
                      </div>
                      <div className="bg-surface-container-low border border-white/5 px-5 py-4 rounded-[24px] rounded-bl-[8px] flex gap-1.5 items-center">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }} className="w-1.5 h-1.5 bg-on-surface-variant/60 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }} className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Native Input Area */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pb-6">
                <div className="relative flex items-end gap-2 bg-surface-container-high/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-1.5 shadow-2xl">
                  <button onClick={insertMediaToCanvas} className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full shrink-0 transition-colors">
                    <Plus size={22} />
                  </button>
                  <AutoResizeTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Message AI..."
                    className="w-full text-on-surface placeholder:text-on-surface-variant/40 py-3 text-[15px]"
                    minHeight={44}
                    maxHeight={120}
                  />
                  {input.trim() ? (
                    <button onClick={() => handleSend()} className="w-9 h-9 mb-1 mr-1 bg-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-90">
                      <Send size={16} className="ml-0.5" />
                    </button>
                  ) : (
                    <button className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full shrink-0 transition-colors">
                      <Mic size={22} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="canvas"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col bg-background"
            >
              <div ref={canvasScrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-32">
                <div className="max-w-2xl mx-auto px-6 py-8">
                  {/* Document Title */}
                  <AutoResizeTextarea
                    value={draft.title || ''}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="Untitled Document"
                    className="w-full bg-transparent text-4xl font-black text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none mb-6 leading-tight"
                    minHeight={48}
                  />

                  {/* Notion-style Properties */}
                  <div className="flex flex-col border-y border-white/5 py-2 mb-8 bg-white/[0.01] rounded-2xl px-4">
                    <PropertyRow icon={<Zap size={16} />} label="Execution">
                      <div className="flex bg-surface-container-high border border-white/5 rounded-lg p-0.5">
                        <button 
                          onClick={() => updateDraft({ matchType: 'instant' })}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${draft.matchType === 'instant' ? 'bg-emerald-500 text-black shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                          Instant Match
                        </button>
                        <button 
                          onClick={() => updateDraft({ matchType: 'bidding' })}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${draft.matchType === 'bidding' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                          Feed Bidding
                        </button>
                      </div>
                    </PropertyRow>

                    <PropertyRow icon={<DollarSign size={16} />} label="Budget">
                      <input 
                        type="text" 
                        value={draft.amount || ''} 
                        onChange={(e) => updateDraft({ amount: e.target.value })}
                        placeholder="Empty"
                        className="bg-transparent text-sm font-medium text-emerald-400 placeholder:text-on-surface-variant/30 focus:outline-none w-full py-1"
                      />
                    </PropertyRow>

                    <PropertyRow icon={<MapPin size={16} />} label="Locations">
                      <div className="flex flex-wrap gap-2 items-center">
                        {draft.locations?.map((loc, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high border border-white/10 rounded-md text-xs font-medium text-on-surface group">
                            <span className="truncate max-w-[120px]">{loc}</span>
                            <button onClick={() => updateDraft({ locations: draft.locations?.filter((_, idx) => idx !== i) })} className="text-on-surface-variant hover:text-red-400">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => handleOpenMap((loc) => updateDraft({ locations: [...(draft.locations || []), loc] }))}
                          className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 py-1"
                        >
                          <Plus size={14} /> Add Location
                        </button>
                      </div>
                    </PropertyRow>
                  </div>

                  {/* Document Body (Markdown Textarea) */}
                  <div className="relative group">
                    <AutoResizeTextarea
                      value={draft.summary || ''} 
                      onChange={(e) => updateDraft({ summary: e.target.value })}
                      placeholder="Type '/' for commands, or just start writing your request details..."
                      className="w-full bg-transparent text-[16px] leading-relaxed text-on-surface/90 placeholder:text-on-surface-variant/30 focus:outline-none min-h-[300px]"
                    />
                  </div>
                </div>
              </div>

              {/* Canvas Bottom Toolbar & Action */}
              <div className="absolute bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-white/5 p-4 pb-6">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                  {/* Media Formatting Toolbar */}
                  <div className="flex items-center gap-4 px-2 text-on-surface-variant overflow-x-auto hide-scrollbar">
                    <button onClick={insertMediaToCanvas} className="p-2 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2">
                      <ImageIcon size={18} /> <span className="text-xs font-bold">Image</span>
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2">
                      <Camera size={18} /> <span className="text-xs font-bold">Camera</span>
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2">
                      <Paperclip size={18} /> <span className="text-xs font-bold">File</span>
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-2" />
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                      <AlignLeft size={18} />
                    </button>
                  </div>
                  
                  <Button size="lg" fullWidth onClick={() => onComplete(draft as OrderData)} className="shadow-2xl">
                    <CheckCircle2 size={18} /> Finalize Document
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Bottom Sheet Map Widget */}
      <AnimatePresence>
        {showMap && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              onClick={() => setShowMap(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 h-[80vh] bg-surface rounded-t-[32px] overflow-hidden z-[100] flex flex-col border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Drag Handle & Header */}
              <div className="pt-3 pb-2 flex flex-col items-center bg-surface shrink-0 z-10">
                <div className="w-12 h-1.5 bg-white/20 rounded-full mb-4" />
                <div className="w-full px-6 flex justify-between items-center">
                  <h3 className="text-xl font-black text-on-surface">Set Location</h3>
                  <button onClick={() => setShowMap(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-white">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Map Area */}
              <div className="relative flex-grow bg-surface-container-highest">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="relative -mt-10 text-emerald-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <MapPin size={48} strokeWidth={2} className="fill-emerald-500/20" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/40 rounded-[100%] blur-[2px]" />
                  </motion.div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 bg-surface shrink-0 border-t border-white/5 relative z-10 pb-8">
                <Button variant="emerald" size="lg" fullWidth onClick={confirmMapLocation}>
                  Confirm Selection
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for Notion-style properties
const PropertyRow: React.FC<{ icon: React.ReactNode, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="flex sm:items-center items-start gap-4 py-3 border-b border-white/5 last:border-0 group">
    <div className="flex items-center gap-2 w-28 shrink-0 text-on-surface-variant sm:pt-0 pt-1">
      <div className="opacity-60">{icon}</div>
      <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex-grow flex flex-wrap gap-2 items-center min-h-[28px]">
      {children}
    </div>
  </div>
);
```

## File: src/features/feed/pages/CreatePost.Page.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Film, BarChart2, Smile, Plus, Trash2, Globe, Sparkles } from 'lucide-react';
import { UserAvatar, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { SocialPostData } from '@/src/shared/types/domain.type';

const MAX_CHARS = 280;

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const creationContext = useStore(state => state.creationContext);
  const addReply = useStore(state => state.addReply);
  const addFeedItem = useStore(state => state.addFeedItem);
  const setCreationContext = useStore(state => state.setCreationContext);
  
  const [threads, setThreads] = useState<ThreadBlock[]>([{ id: '1', content: '' }]);
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const replyContext = creationContext;

  const onBack = () => {
    setCreationContext(null);
    navigate(-1);
  };

  const addThread = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setThreads([...threads, { id: newId, content: '' }]);
    setActiveThreadIndex(threads.length);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const removeThread = (index: number) => {
    if (threads.length > 1) {
      const newThreads = threads.filter((_, i) => i !== index);
      setThreads(newThreads);
      setActiveThreadIndex(Math.max(0, index - 1));
    }
  };

  const updateThread = (index: number, content: string) => {
    const newThreads = [...threads];
    newThreads[index].content = content;
    setThreads(newThreads);
  };

  const handlePost = () => {
    const content = threads.map(t => t.content).join('\n\n');
    if (!content.trim()) return;

    const newItem: SocialPostData = {
      id: Math.random().toString(),
      type: 'social',
      author: useStore.getState().currentUser,
      content,
      timestamp: 'Just now',
      replies: 0, reposts: 0, shares: 0, votes: 0
    };

    if (replyContext?.parentId) {
      addReply(replyContext.parentId, newItem);
    } else {
      addFeedItem(newItem);
    }
    
    onBack();
  };

  const calculateProgress = (text: string) => {
    return Math.min((text.length / MAX_CHARS) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 border-b border-white/5 glass sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-on-surface"
          >
            <X size={24} />
          </button>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest opacity-50">{replyContext ? 'Reply' : 'New Thread'}</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary font-bold text-sm px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
            Drafts
          </button>
          <button 
            onClick={handlePost}
            disabled={threads.every(t => t.content.trim() === '')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {replyContext ? 'Reply' : 'Post'} <Sparkles size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto hide-scrollbar p-4 md:p-8 pb-40"
      >
        <div className="max-w-2xl mx-auto">
          {replyContext && (
            <div className="flex gap-4 mb-2">
              <div className="flex flex-col items-center pt-1">
                <UserAvatar src={replyContext.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${replyContext.authorHandle}`} size="lg" className="shadow-sm" />
                <div className="w-[2px] flex-grow bg-white/10 my-2 rounded-full min-h-[40px]" />
              </div>
              <div className="flex-grow pb-6 pt-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-on-surface">@{replyContext.authorHandle}</span>
                  {replyContext.type === 'task' && replyContext.taskPrice && (
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      {replyContext.taskPrice}
                    </span>
                  )}
                </div>
                {replyContext.type === 'task' && replyContext.taskTitle ? (
                  <div className="bg-surface-container-low border border-white/10 rounded-xl p-3 mt-2 shadow-inner">
                    <h4 className="text-on-surface font-bold text-sm mb-1 leading-tight">{replyContext.taskTitle}</h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2">{replyContext.content}</p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant text-base leading-relaxed line-clamp-3">{replyContext.content}</p>
                )}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {threads.map((thread, index) => {
              const progress = calculateProgress(thread.content);
              const isOverLimit = thread.content.length > MAX_CHARS;
              
              return (
                <motion.div 
                  key={thread.id} 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="relative flex gap-4 group mb-2"
                >
                  {/* Left Rail */}
                  <div className="flex flex-col items-center pt-1">
                    <UserAvatar src="https://picsum.photos/seed/user/100/100" size="lg" className="shadow-sm" />
                    {index < threads.length - 1 && (
                      <div className="w-[2px] flex-grow bg-gradient-to-b from-white/20 to-white/5 my-2 rounded-full" />
                    )}
                  </div>

                  {/* Thread Content */}
                  <div className="flex-grow pb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-on-surface">You</span>
                      {threads.length > 1 && (
                        <button 
                          onClick={() => removeThread(index)}
                          className="p-1.5 text-on-surface-variant/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <AutoResizeTextarea
                      autoFocus={index === activeThreadIndex}
                      value={thread.content}
                      onChange={(e) => updateThread(index, e.target.value)}
                      onFocus={() => setActiveThreadIndex(index)}
                      placeholder={index === 0 ? "What's happening?" : "Add another thought..."}
                      className="w-full text-on-surface text-lg placeholder:text-on-surface-variant/40 leading-relaxed"
                      minHeight={60}
                    />

                    {/* Toolbar & Character Count */}
                    <AnimatePresence>
                      {activeThreadIndex === index && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between mt-3 pt-3 border-t border-white/5"
                        >
                          <div className="flex items-center gap-1 text-primary">
                            {[ImageIcon, Film, BarChart2, Smile].map((Icon, i) => (
                              <button key={i} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                                <Icon size={18} />
                              </button>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {thread.content.length > 0 && (
                              <div className="flex items-center gap-3">
                                <div className="relative w-6 h-6 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" fill="none" className="stroke-white/10" strokeWidth="2" />
                                    <circle 
                                      cx="12" cy="12" r="10" fill="none" 
                                      className={`transition-all duration-300 ${isOverLimit ? 'stroke-red-500' : progress > 80 ? 'stroke-yellow-500' : 'stroke-primary'}`}
                                      strokeWidth="2"
                                      strokeDasharray={`${progress * 0.628} 62.8`}
                                    />
                                  </svg>
                                  {isOverLimit && (
                                    <span className="absolute text-[8px] font-bold text-red-500">
                                      {MAX_CHARS - thread.content.length}
                                    </span>
                                  )}
                                </div>
                                <div className="w-[1px] h-6 bg-white/10" />
                                <button 
                                  onClick={addThread}
                                  className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                >
                                  <Plus size={14} strokeWidth={3} />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Thread Trigger (Only show if last thread is not empty and not active) */}
          {threads[threads.length - 1].content.length > 0 && activeThreadIndex !== threads.length - 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 group cursor-pointer mt-2" 
              onClick={addThread}
            >
              <div className="flex flex-col items-center pt-1">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-on-surface-variant group-hover:bg-white/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                  <Plus size={20} />
                </div>
              </div>
              <div className="flex-grow pt-2.5">
                <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">Add to thread</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Footer Settings */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high/90 backdrop-blur-md rounded-full text-xs font-bold text-primary uppercase tracking-widest shadow-2xl border border-white/10 pointer-events-auto cursor-pointer hover:bg-surface-container-highest transition-colors"
        >
          <Globe size={14} />
          <span>Everyone can reply</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
```

## File: src/shared/ui/SharedUI.Component.tsx
```typescript
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Users, Maximize2, Link as LinkIcon, Lock, PhoneOff, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export const UserAvatar: React.FC<{ 
  src: string; 
  alt?: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string;
  isOnline?: boolean;
}> = ({ src, alt = "User avatar", size = 'md', className = "", isOnline }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div className="relative flex-shrink-0">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover ring-1 ring-white/10 z-10 bg-background flex-shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
      {isOnline && (
        <div 
          className={`absolute bottom-0 right-0 bg-emerald-500 rounded-full border-[1.5px] border-background z-20 shadow-[0_0_8px_rgba(16,185,129,0.4)] flex items-center justify-center`}
          style={{ 
            transform: 'translate(10%, 10%)',
            width: size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '14px',
            height: size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '14px',
          }}
        >
           <div className="w-full h-full bg-white/40 rounded-full animate-pulse" />
        </div>
      )}
    </div>
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
      className={`bg-transparent border-none focus:ring-0 focus:outline-none resize-none hide-scrollbar ${className}`}
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
  suffix?: React.ReactNode;
}> = ({ text, limit = 160, className = "", buttonClassName = "", suffix }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > limit;

  const displayText = (!isLong || isExpanded) ? text : `${text.substring(0, limit)}...`;

  return (
    <div className={className}>
      <span className="inline">
        <RichText text={displayText} />
        {suffix && <span className="ml-2 inline-flex align-middle">{suffix}</span>}
      </span>
      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`ml-1 text-primary font-bold hover:underline focus:outline-none transition-all ${buttonClassName}`}
        >
          {isExpanded ? "show less" : "read more"}
        </button>
      )}
    </div>
  );
};

export const SpoilerText: React.FC<{ text: string }> = ({ text }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span 
      onClick={(e) => { 
        if (!revealed) {
          e.preventDefault(); 
          e.stopPropagation(); 
          setRevealed(true); 
        }
      }}
      className={`transition-all duration-700 ${revealed ? 'text-on-surface' : 'blur-[5px] hover:blur-[3px] bg-white/5 cursor-pointer select-none rounded px-1.5 py-0.5'}`}
      title={revealed ? undefined : "Click to reveal spoiler"}
    >
      {text}
    </span>
  );
};

export const LinkPreviewNode: React.FC<{ url: string }> = ({ url }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [align, setAlign] = useState<'center' | 'left' | 'right'>('center');
  const triggerRef = useRef<HTMLSpanElement>(null);

  let domain = 'link';
  try {
    domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch(e) {}

  useLayoutEffect(() => {
    if (isHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;

      // Vertical Flip: If less than 320px (card height) above and more space below
      if (spaceAbove < 320 && spaceBelow > spaceAbove) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }

      // Horizontal Shift: Prevent bleeding off edges
      if (spaceLeft < 140) setAlign('left');
      else if (spaceRight < 140) setAlign('right');
      else setAlign('center');
    }
  }, [isHovered]);

  const containerClasses = {
    top: "bottom-full mb-3",
    bottom: "top-full mt-3"
  };

  const alignClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-0",
    right: "right-0"
  };

  return (
    <span 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RichLinkAnchor url={url} />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${containerClasses[position]} ${alignClasses[align]} w-72 z-[100] pointer-events-none`}
          >
            <div className="bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="h-28 bg-surface-container-highest relative overflow-hidden border-b border-white/5">
                <img src={`https://picsum.photos/seed/${domain}/400/200`} alt="Preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high/90 to-transparent" />
              </div>
              <div className="p-4 relative z-10 bg-surface-container-high shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Globe size={10} className="text-on-surface-variant" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black truncate">{domain}</span>
                </div>
                <h4 className="text-[15px] font-black text-on-surface truncate leading-tight mb-1">{domain}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed font-medium">
                  Explore more content and information on this external website. Click the link to open in a new tab.
                </p>
              </div>
            </div>
            {/* Arrow Pointer */}
            <div 
              className={`absolute w-3 h-3 bg-surface-container-high border-white/10 rotate-45 shadow-sm
                ${position === 'top' ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-t border-l'}
                ${align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'left' ? 'left-6' : 'right-6'}
              `} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

const RichLinkAnchor: React.FC<{ url: string }> = ({ url }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noreferrer" 
    className="text-primary hover:underline relative group inline-flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-md mx-0.5 align-baseline transition-colors hover:bg-primary/20" 
    onClick={e => {
      // Prevent clicking from triggering post detail navigation if this link is inside a card
      e.stopPropagation();
    }}
  >
    <LinkIcon size={12} className="opacity-70 flex-shrink-0" />
    <span className="truncate max-w-[200px]">{url.replace(/^https?:\/\//, '')}</span>
  </a>
);

export const RichText: React.FC<{ text: string }> = ({ text }) => {
  let nodes: React.ReactNode[] = [text];

  const applyRegex = (regex: RegExp, renderer: (match: string, i: number) => React.ReactNode) => {
    nodes = nodes.flatMap((node, idx) => {
      if (typeof node !== 'string') return [node];
      const parts = node.split(regex);
      return parts.map((part, i) => {
        if (i % 2 === 1) { // Matched regex elements
          return renderer(part, idx * 1000 + i);
        }
        return part;
      });
    });
  };

  applyRegex(/(\|\|.*?\|\|)/g, (match, i) => <SpoilerText key={`sp-${i}`} text={match.slice(2, -2)} />);
  
  applyRegex(/(https?:\/\/[^\s]+)/g, (match, i) => <LinkPreviewNode key={`ln-${i}`} url={match} />);

  applyRegex(/(@[a-zA-Z0-9_]+)/g, (match, i) => (
    <span key={`mn-${i}`} className="text-primary/90 font-black cursor-pointer hover:underline hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); }}>
      {match}
    </span>
  ));

  applyRegex(/(#[a-zA-Z0-9_]+)/g, (match, i) => (
    <span key={`ht-${i}`} className="text-emerald-400/90 font-bold cursor-pointer hover:underline hover:text-emerald-400 transition-colors" onClick={(e) => { e.stopPropagation(); }}>
      {match}
    </span>
  ));

  applyRegex(/((?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g, (match, i) => (
    <span key={`ph-${i}`} className="bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 mx-0.5 rounded font-black uppercase tracking-widest border border-red-500/20 inline-flex items-center gap-1 align-baseline" title="Phone numbers are redacted for safety">
      <PhoneOff size={10} />
      Redacted
    </span>
  ));

  return <>{nodes}</>;
};

export const CheckoutHeader: React.FC<{
  title: string;
  subtitle: string;
  onBack?: () => void;
}> = ({ title, subtitle, onBack }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  
  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={handleBack}
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
};

export const CheckoutLayout: React.FC<{
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, onBack, children }) => (
  <PageSlide>
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 pb-2 shrink-0">
        <CheckoutHeader title={title} subtitle={subtitle} onBack={onBack} />
      </div>
      <div className="flex-grow overflow-y-auto px-6 pb-32 hide-scrollbar">
        {children}
      </div>
    </div>
  </PageSlide>
);

export const DetailHeader: React.FC<{
  onBack?: () => void;
  title: string;
  subtitle?: string;
  rightNode?: React.ReactNode;
  contentType?: string;
  viewCount?: number | string;
  currentlyViewing?: number | string;
  style?: any;
  className?: string;
  titleOpacity?: any;
}> = ({
  onBack,
  title,
  subtitle,
  rightNode,
  contentType,
  viewCount,
  currentlyViewing,
  style,
  className = "",
  titleOpacity
}) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  const isExcluded = title.toLowerCase().includes('message') || title.toLowerCase().includes('chat');
  const showStats = !isExcluded;
  const type = contentType || (title.toLowerCase().includes('task') ? 'Task' : title.toLowerCase().includes('reply') ? 'Reply' : 'Post');
  const views = viewCount || `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}k`;
  const viewing = currentlyViewing || Math.floor(Math.random() * 40) + 12;

  return (
    <motion.header 
      className={`sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 min-h-16 flex items-center px-4 justify-between gap-4 ${className}`}
      style={style}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors shrink-0">
          <ArrowLeft size={20} className="text-on-surface" />
        </button>
        <motion.div className="flex flex-col min-w-0" style={{ opacity: titleOpacity }}>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold text-on-surface truncate">{title}</h1>
            {showStats && (
              <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-on-surface-variant font-bold shrink-0">
                {type}
              </span>
            )}
          </div>
          {subtitle && <span className="text-[11px] text-on-surface-variant font-medium truncate mt-0.5">{subtitle}</span>}
        </motion.div>
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
            <div className="flex items-center gap-1" title="Total Views">
              <Eye size={12} className="opacity-70" />
              <span>{views}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1 text-emerald-400" title="Currently viewing">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
              <span>{viewing}</span>
            </div>
          </div>
        )}
        {rightNode}
      </div>
    </motion.header>
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
  onExpand?: () => void;
  onSubmit?: () => void;
}> = ({ value, onChange, placeholder, buttonText = "Reply", avatarUrl = "https://picsum.photos/seed/user/100/100", onExpand, onSubmit }) => (
  <div className="fixed bottom-0 w-full max-w-2xl glass p-3 flex items-end gap-3 z-20">
    <UserAvatar src={avatarUrl} size="md" className="mb-1 hidden sm:block" />
    <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
      <AutoResizeTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none py-2.5 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
        minHeight={44}
        maxHeight={120}
        rows={1}
      />
      {onExpand && (
        <button onClick={onExpand} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
          <Maximize2 size={18} />
        </button>
      )}
    </div>
    <Button 
      size="sm"
      disabled={!value.trim()}
      className="mb-1 shrink-0"
      onClick={onSubmit}
    >
      {buttonText}
    </Button>
  </div>
);
```

## File: src/features/creation/components/CreateModal.Component.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Briefcase, Send, DollarSign, Clock, Tag, ChevronRight, Sparkles, Car, Package, Zap, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AIChatRequest } from '@/src/features/creation/components/AIChatRequest.Component';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { CreateType, SelectionButtonProps, SocialFormProps } from '@/src/features/creation/types/creation.types';
import { OrderData } from '@/src/shared/types/domain.type';

export const CreateModal: React.FC = () => {
  const navigate = useNavigate();
  const onClose = useStore(state => state.setShowCreateModal);
  const setOrderToReview = useStore(state => state.setOrderToReview);
  const initialAiQuery = useStore(state => state.initialAiQuery);
  const setInitialAiQuery = useStore(state => state.setInitialAiQuery);
  
  const [step, setStep] = useState<'select' | 'form'>(initialAiQuery ? 'form' : 'select');
  const [type, setType] = useState<CreateType>(initialAiQuery ? 'request' : null);

  const handleClose = () => {
    onClose(false);
    if (initialAiQuery) setInitialAiQuery(null);
  };

  const handleSelect = (selectedType: CreateType) => {
    setType(selectedType);
    setStep('form');
  };

  const handleBack = () => {
    setStep('select');
    setType(null);
    if (initialAiQuery) setInitialAiQuery(null);
  };

  const isFullPage = step === 'form' && type === 'request';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${isFullPage ? '' : 'p-6 max-w-2xl mx-auto border-x border-white/5'} bg-black/90 backdrop-blur-xl`}
    >
      <motion.div
        initial={isFullPage ? { y: '100%' } : { scale: 0.9, y: 20, opacity: 0 }}
        animate={isFullPage ? { y: 0 } : { scale: 1, y: 0, opacity: 1 }}
        exit={isFullPage ? { y: '100%' } : { scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`${isFullPage ? 'w-full h-full rounded-0' : 'w-full max-w-lg rounded-[40px] border border-white/10'} glass overflow-hidden shadow-2xl relative flex flex-col`}
      >
        {/* Header (Hidden for AI Request to allow custom full-screen header) */}
        {type !== 'request' && (
          <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isFullPage ? 'pt-12' : ''}`}>
            <div className="flex items-center gap-3">
              {step === 'form' && (
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
              )}
              <h2 className="text-xl font-black text-on-surface tracking-tight uppercase">
                {step === 'select' ? 'Create New' : 'Share Update'}
              </h2>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`${type === 'request' ? 'p-0' : 'p-8'} overflow-y-auto hide-scrollbar flex-grow ${isFullPage ? 'max-w-2xl mx-auto w-full' : ''}`}>
          <AnimatePresence mode="wait">
            {step === 'select' ? (
              <motion.div
                key="select"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="grid grid-cols-1 gap-4"
              >
                <SelectionButton
                  icon={<MessageSquare size={28} />}
                  title="Share an Update"
                  description="Post portfolio work, news, or connect with the community."
                  onClick={() => {
                    handleClose();
                    navigate('/create-post');
                  }}
                  accent="primary"
                />
                <SelectionButton 
                  icon={<Sparkles size={28} />}
                  title="Request Service"
                  description="Chat with our AI to book a ride, delivery, or hire help."
                  onClick={() => handleSelect('request')}
                  accent="emerald"
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="h-full"
              >
                {type === 'social' ? (
                  <SocialForm onPost={handleClose} />
                ) : (
                  <AIChatRequest 
                    initialQuery={initialAiQuery || undefined}
                    onClose={handleClose}
                    onBack={handleBack}
                    onComplete={(data: OrderData) => {
                      setOrderToReview(data);
                      handleClose();
                      navigate('/review-order');
                    }} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SelectionButton: React.FC<SelectionButtonProps> = ({ icon, title, description, onClick, accent }) => (
  <button 
    onClick={onClick}
    className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${accent}/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${accent}/20 transition-all`} />
    <div className="relative z-10 flex items-start gap-6">
      <div className={`w-16 h-16 rounded-2xl bg-${accent}/10 border border-${accent}/20 flex items-center justify-center text-${accent} shadow-inner`}>
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-black text-on-surface mb-1 tracking-tight">{title}</h3>
        <p className="text-sm text-on-surface-variant opacity-70 leading-relaxed">{description}</p>
      </div>
      <div className="self-center text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors">
        <ChevronRight size={24} />
      </div>
    </div>
  </button>
);

const SocialForm: React.FC<SocialFormProps> = ({ onPost }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black">Content</label>
      <AutoResizeTextarea 
        autoFocus
        placeholder="What's on your mind? Share your latest work..."
        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/30 transition-colors"
        minHeight={160}
      />
    </div>
    
    <div className="flex items-center gap-4">
      <Button fullWidth className="flex-grow">
        <Send size={18} />
        Post Update
      </Button>
    </div>
  </div>
);
```

## File: src/store/app.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { TabState, Author, CreationContext } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS } from '@/src/shared/constants/domain.constant';

export interface AppSlice {
  activeTab: TabState;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  currentUser: Author;
  creationContext: CreationContext | null;
  initialAiQuery: string | null;
  followedHandles: string[];
  setActiveTab: (tab: TabState) => void;
  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
  setCreationContext: (ctx: CreationContext | null) => void;
  setInitialAiQuery: (query: string | null) => void;
  toggleFollow: (handle: string) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  activeTab: 'for-you',
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  currentUser: MOCK_AUTHORS[0],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowMatcher: (show) => set({ showMatcher: show }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowChatRoom: (show) => set({ showChatRoom: show }),
  setCurrentUser: (user) => set({ currentUser: user }),
  creationContext: null,
  setCreationContext: (ctx) => set({ creationContext: ctx }),
  initialAiQuery: null,
  setInitialAiQuery: (query) => set({ initialAiQuery: query }),
  followedHandles: [],
  toggleFollow: (handle) => set((state) => ({
    followedHandles: state.followedHandles.includes(handle)
      ? state.followedHandles.filter((h) => h !== handle)
      : [...state.followedHandles, handle]
  })),
});
```

## File: src/App.tsx
```typescript
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
```
