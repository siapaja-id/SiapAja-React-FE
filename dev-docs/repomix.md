# Directory Structure
```
src/
  features/
    creation/
      components/
        AIChatRequest.Component.tsx
    feed/
      components/
        post-detail/
          BidSheet.Component.tsx
          TaskActionFooter.Component.tsx
      pages/
        PostDetail.Page.tsx
    gigs/
      components/
        GigMatcher.Component.tsx
        MatchSuccess.Component.tsx
      pages/
        ReviewOrder.Page.tsx
      types/
        gigs.types.ts
  shared/
    constants/
      domain.constant.tsx
    types/
      domain.type.ts
    ui/
      SharedUI.Component.tsx
  store/
    app.slice.ts
    feed.slice.ts
    order.slice.ts
  App.tsx
```

# Files

## File: src/features/feed/components/post-detail/BidSheet.Component.tsx
```typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown } from 'lucide-react';

interface BidSheetProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBid: number;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  bidAmount: number;
  onBidAmountChange: (amount: number) => void;
  onSubmit: () => void;
}

export const BidSheet: React.FC<BidSheetProps> = ({
  isOpen,
  onClose,
  defaultBid,
  replyText,
  onReplyTextChange,
  bidAmount,
  onBidAmountChange,
  onSubmit,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
      >
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-on-surface tracking-tight">Submit Your Bid</h3>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 mb-6">
            <div className="flex items-center justify-between bg-surface-container border border-white/10 rounded-[28px] p-2 shadow-inner">
              <button 
                onClick={() => onBidAmountChange(Math.max(1, bidAmount - 5))}
                className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-on-surface-variant transition-all active:scale-95"
              >
                <Minus size={28} />
              </button>
              <div className="flex flex-col items-center flex-grow">
                <span className="text-2sm uppercase tracking-[0.2em] text-on-surface-variant font-black mb-1">Your Bid</span>
                <div className="flex items-center justify-center text-5xl font-black text-on-surface tracking-tighter">
                  <span className="text-2xl text-emerald-500 mr-1 -mt-2">$</span>
                  <input 
                    type="number" 
                    value={bidAmount}
                    onChange={(e) => onBidAmountChange(Number(e.target.value))}
                    className="bg-transparent border-none text-center w-28 focus:outline-none focus:ring-0 p-0 m-0 hide-scrollbar"
                  />
                </div>
              </div>
              <button 
                onClick={() => onBidAmountChange(bidAmount + 5)}
                className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-on-surface-variant transition-all active:scale-95"
              >
                <Plus size={28} />
              </button>
            </div>

            <div className="flex justify-center gap-2">
              <button onClick={() => onBidAmountChange(Math.max(1, bidAmount - 15))} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1"><TrendingDown size={14}/> Down Bid</button>
              <button onClick={() => onBidAmountChange(defaultBid)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface text-xs font-bold transition-colors">Match Original</button>
              <button onClick={() => onBidAmountChange(bidAmount + 15)} className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1">Up Bid <TrendingDown size={14} className="rotate-180"/></button>
            </div>

            <textarea 
              placeholder="Why should they choose you? (Optional)"
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 min-h-[100px] resize-none focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <button 
            onClick={onSubmit}
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
);
```

## File: src/features/feed/components/post-detail/TaskActionFooter.Component.tsx
```typescript
import React from 'react';
import { Maximize2, CheckCircle2, Sparkles } from 'lucide-react';
import { AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TaskData } from '@/src/shared/types/domain.type';
import { TASK_STATUS } from '@/src/shared/constants/domain.constant';

interface TaskActionFooterProps {
  task: TaskData;
  isCreator: boolean;
  isAssignedToMe: boolean;
  isNegotiable: boolean;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSendMessage: () => void;
  onBid: () => void;
  onAccept: () => void;
  onStartTask: () => void;
  onShowComplete: () => void;
  onShowReview: () => void;
  onFullscreenReply: () => void;
}

const StatusIndicator: React.FC<{ icon: React.ElementType; children: React.ReactNode; variant?: 'default' | 'emerald' }> = ({ 
  icon: Icon, 
  children, 
  variant = 'default' 
}) => (
  <div className={`text-1sm font-black w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-xl border ${
    variant === 'emerald' 
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
      : 'text-on-surface-variant'
  }`}>
    <Icon size={14} />
    {children}
  </div>
);

export const TaskActionFooter: React.FC<TaskActionFooterProps> = ({
  task,
  isCreator,
  isAssignedToMe,
  isNegotiable,
  replyText,
  onReplyTextChange,
  onSendMessage,
  onBid,
  onAccept,
  onStartTask,
  onShowComplete,
  onShowReview,
  onFullscreenReply,
}) => {
  const tStatus = task.taskStatus || TASK_STATUS.OPEN;
  const showInput = tStatus === TASK_STATUS.OPEN || tStatus === TASK_STATUS.ASSIGNED || tStatus === TASK_STATUS.IN_PROGRESS;

  const ActionUI = (() => {
    if (isCreator) {
      switch (tStatus) {
        case TASK_STATUS.OPEN:
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Waiting for bids...</div>;
        case TASK_STATUS.ASSIGNED:
          return <StatusIndicator icon={CheckCircle2} variant="emerald">Awaiting Worker to Start</StatusIndicator>;
        case TASK_STATUS.IN_PROGRESS:
          return <StatusIndicator icon={Sparkles} variant="emerald">Task in Progress</StatusIndicator>;
        case TASK_STATUS.COMPLETED:
          return <Button fullWidth onClick={onShowReview} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-400 text-black">Review & Release Payment</Button>;
        case TASK_STATUS.FINISHED:
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
      }
    } else {
      switch (tStatus) {
        case TASK_STATUS.OPEN:
          if (!isNegotiable) {
            return (
              <div className="flex gap-2 w-full">
                <Button variant="ghost" onClick={onBid} className="flex-1">Bid</Button>
                <Button onClick={onAccept} className="flex-1 shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Accept Instantly</Button>
              </div>
            );
          }
          return <Button onClick={onBid} fullWidth className="shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Submit Bid</Button>;
        case TASK_STATUS.ASSIGNED:
          if (isAssignedToMe) return <Button fullWidth onClick={onStartTask} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Start Task</Button>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Assigned to someone else</div>;
        case TASK_STATUS.IN_PROGRESS:
          if (isAssignedToMe) return <Button fullWidth onClick={onShowComplete} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Mark as Completed</Button>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">In progress by another worker</div>;
        case TASK_STATUS.COMPLETED:
          if (isAssignedToMe) return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em] bg-white/5 rounded-xl border border-white/10">Waiting for Review...</div>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Completed</div>;
        case TASK_STATUS.FINISHED:
          if (isAssignedToMe) return <StatusIndicator icon={CheckCircle2} variant="emerald">Payment Received</StatusIndicator>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
      }
    }
    return null;
  })();

  return (
    <div className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5">
      {showInput && (
        <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
          <AutoResizeTextarea
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder="Message or ask a question..."
            className="w-full bg-transparent border-none py-3 px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
            minHeight={44}
            maxHeight={120}
            rows={1}
          />
          {replyText.trim() ? (
            <Button onClick={onSendMessage} className="mb-1 mr-1 px-4 py-2 shrink-0">Send</Button>
          ) : (
            <button onClick={onFullscreenReply} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
              <Maximize2 size={18} />
            </button>
          )}
        </div>
      )}
      <div className="w-full">{ActionUI}</div>
    </div>
  );
};
```

## File: src/features/gigs/types/gigs.types.ts
```typescript
import { Gig } from '@/src/shared/types/domain.type';

export interface MatchSuccessProps {
  gig: Gig;
  onContinue: () => void;
  onClose: () => void;
}

export interface GigCardProps {
  gig: Gig;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  index: number;
  swipeDirection: 'left' | 'right' | null;
}

export interface GigInfoBlockProps {
  icon: React.ReactNode;
  label: string;
  value: string;
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

## File: src/features/gigs/components/MatchSuccess.Component.tsx
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Globe, MessageCircle, Sparkles, Navigation, ExternalLink } from 'lucide-react';
import { Gig } from '@/src/shared/types/domain.type';
import { Button } from '@/src/shared/ui/SharedUI.Component';
import { MatchSuccessProps } from '@/src/features/gigs/types/gigs.types';

const Particles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: '100vh',
            x: `${Math.random() * 100}vw`,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0
          }}
          animate={{
            y: '-10vh',
            opacity: [0, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
          className="absolute w-1.5 h-1.5 bg-emerald-500/40 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

export const MatchSuccess: React.FC<MatchSuccessProps> = ({ gig, onContinue, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto hide-scrollbar max-w-2xl mx-auto border-x border-white/5"
    >
      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(16,185,129,0.15),_transparent_60%)] pointer-events-none" />
      
      <Particles />

      <div className="w-full max-w-md min-h-full flex flex-col py-8 relative z-10">
        <div className="flex-grow shrink-0" />
        
        <div className="text-center mb-8 sm:mb-12 shrink-0">
          <div className="relative flex items-center justify-center mb-8 sm:mb-10 w-32 h-32 mx-auto">
            {/* Radar Rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: [0, 0.3, 0] }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  delay: i * 0.8,
                  ease: "easeOut"
                }}
                className="absolute inset-0 rounded-full border border-emerald-500/50"
              />
            ))}
            
            {/* Main Circle */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 200 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-zinc-950 shadow-[0_0_80px_rgba(16,185,129,0.5)] z-10"
            >
              <Check size={48} className="sm:w-14 sm:h-14" strokeWidth={3.5} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", damping: 20 }}
          >
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-3 sm:mb-4 uppercase">
              It's a <span className="text-emerald-400">Match!</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg font-medium flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              You've secured this project.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 20 }}
          className="w-full bg-white/[0.03] rounded-[32px] p-6 sm:p-8 border border-white/10 mb-8 sm:mb-12 backdrop-blur-xl shrink-0 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle top shine */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
          
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-white/10 rounded-2xl text-white shadow-inner border border-white/5">
              {gig.icon}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">{gig.price}</div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">{gig.title}</h3>
          
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/50 font-bold uppercase tracking-widest bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500/70" /> {gig.time}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5"><Globe size={14} className="text-emerald-500/70" /> {gig.distance}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", damping: 20 }}
          className="space-y-4 mt-auto shrink-0 w-full"
        >
          <Button 
            variant="emerald" size="lg" fullWidth 
            className="text-zinc-950 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400 flex items-center justify-center gap-2"
            onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(gig.distance), '_blank')}
          >
            <Navigation size={18} />
            Navigate via Google Maps
            <ExternalLink size={14} className="opacity-50 ml-1" />
          </Button>
          <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 border border-white/10">
            <MessageCircle size={18} className="text-white/70" /> Message {gig.clientName}
          </button>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="ghost" size="sm"
              onClick={onContinue}
            >
              Keep Swiping
            </Button>
            <Button 
              variant="ghost" size="sm"
              onClick={onClose}
            >
              Dashboard
            </Button>
          </div>
        </motion.div>
        
        <div className="flex-grow shrink-0" />
      </div>
    </motion.div>
  );
};
```

## File: src/features/gigs/components/GigMatcher.Component.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { X, Check, MapPin, Clock, Zap, Car, Package, Palette, Code, FileText, Globe, ArrowRight, Star, ShieldCheck, Search } from 'lucide-react';
import { MatchSuccess } from '@/src/features/gigs/components/MatchSuccess.Component';
import { Gig } from '@/src/shared/types/domain.type';
import { GIGS } from '@/src/shared/constants/domain.constant';
import { useStore } from '@/src/store/main.store';
import { GigCardProps, GigInfoBlockProps } from '@/src/features/gigs/types/gigs.types';

const GigInfoBlock: React.FC<GigInfoBlockProps> = ({ icon, label, value }) => (
  <div className="bg-white/[0.03] p-3 sm:p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
    <div className="flex items-center gap-1.5 sm:gap-2 text-white/40 mb-1.5 sm:mb-2">
      {icon}
      <span className="text-2xs sm:text-2sm font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-xs sm:text-sm font-bold text-white tracking-wide">{value}</div>
  </div>
);

const GigCard: React.FC<GigCardProps> = ({ gig, onSwipe, isTop, index, swipeDirection }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // Stamps opacity
  const checkOpacity = useTransform(x, [20, 100], [0, 1]);
  const xOpacity = useTransform(x, [-20, -100], [0, 1]);

  // Background card animation based on top card's drag
  const nextCardScale = useTransform(x, [-200, 0, 200], [1, 0.92, 1]);
  const nextCardY = useTransform(x, [-200, 0, 200], [0, 24, 0]);
  const nextCardOpacity = useTransform(x, [-200, 0, 200], [1, 0.6, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe('left');
    }
  };

  const getTypeLabel = (type: Gig['type']) => {
    switch (type) {
      case 'ride': return 'Ride Request';
      case 'delivery': return 'Delivery';
      case 'design': return 'Creative Design';
      case 'dev': return 'Development';
      case 'writing': return 'Copywriting';
      default: return 'Gig Task';
    }
  };

  const isNext = index === 1;

  const cardVariants: any = {
    initial: { 
      scale: 0.8, 
      opacity: 0, 
      y: 40 
    },
    animate: { 
      scale: isTop ? 1 : 0.92, 
      opacity: isTop ? 1 : 0.6, 
      y: isTop ? 0 : 24,
      zIndex: isTop ? 10 : 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: (custom: 'left' | 'right') => ({
      x: custom === 'right' ? 400 : -400,
      y: 50,
      opacity: 0,
      rotate: custom === 'right' ? 15 : -15,
      transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
    })
  };

  return (
    <motion.div
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0,
        scale: isNext ? nextCardScale : undefined,
        y: isNext ? nextCardY : undefined,
        opacity: isNext ? nextCardOpacity : undefined,
        transformOrigin: 'bottom center'
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={swipeDirection}
      className={`absolute inset-0 bg-[#0A0A0A] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 flex flex-col ${isTop ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'}`}
    >
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      
      {/* Overlay Indicators */}
      {isTop && (
        <>
          <motion.div style={{ opacity: checkOpacity }} className="absolute top-10 left-8 z-20 pointer-events-none">
            <div className="border-4 border-emerald-500 text-emerald-500 px-6 py-2 rounded-2xl font-black text-4xl uppercase -rotate-12 tracking-widest bg-black/40 backdrop-blur-sm">
              ACCEPT
            </div>
          </motion.div>
          <motion.div style={{ opacity: xOpacity }} className="absolute top-10 right-8 z-20 pointer-events-none">
            <div className="border-4 border-red-500 text-red-500 px-6 py-2 rounded-2xl font-black text-4xl uppercase rotate-12 tracking-widest bg-black/40 backdrop-blur-sm">
              PASS
            </div>
          </motion.div>
        </>
      )}

      <div className="p-5 sm:p-8 flex-grow flex flex-col pointer-events-none relative z-10 min-h-0">
        <div className="flex-grow flex flex-col overflow-y-auto hide-scrollbar pb-4 min-h-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner backdrop-blur-md">
              {gig.icon}
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter">{gig.price}</div>
              {gig.meta && (
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-2sm uppercase tracking-widest font-bold">
                  <Zap size={10} className="fill-primary" />
                  {gig.meta}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <div className="text-2sm sm:text-1sm uppercase tracking-[0.2em] text-white/50 font-black">
                {getTypeLabel(gig.type)}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1 text-2sm sm:text-1sm text-white/50 font-bold uppercase tracking-wider">
                <ShieldCheck size={12} className="text-emerald-500" />
                {gig.clientName}
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-[1.1] mb-4 shrink-0">{gig.title}</h2>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 shrink-0">
              <GigInfoBlock 
                icon={gig.distance === 'Remote' ? <Globe size={12} /> : <MapPin size={12} />} 
                label="Location" 
                value={gig.distance} 
              />
              <GigInfoBlock icon={<Clock size={12} />} label="Timeline" value={gig.time} />
            </div>

            <div className="flex flex-wrap gap-2 mb-4 shrink-0">
              {gig.tags.map(tag => (
                <span key={tag} className="text-2xs sm:text-2sm font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-1.5 sm:space-y-2 mt-auto shrink-0">
              <div className="text-2xs sm:text-2sm uppercase tracking-[0.2em] text-white/40 font-black">Project Brief</div>
              <p className="text-xs sm:text-base text-white/70 leading-relaxed font-medium">
                {gig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-2 pt-2 border-t border-white/5 pointer-events-auto shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onSwipe('left'); }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all active:scale-90 shadow-xl"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onSwipe('right'); }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 flex items-center justify-center text-black hover:bg-emerald-400 transition-all active:scale-90 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <Check size={28} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};



export const GigMatcher: React.FC = () => {
  const onClose = useStore(state => state.setShowMatcher);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [matchedGig, setMatchedGig] = useState<Gig | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      setTimeout(() => {
        setMatchedGig(GIGS[currentIndex]);
      }, 300);
    } else {
      setTimeout(() => {
        if (currentIndex < GIGS.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSwipeDirection(null);
        } else {
          onClose(false);
        }
      }, 300);
    }
  };

  const handleContinue = () => {
    setMatchedGig(null);
    setSwipeDirection(null);
    if (currentIndex < GIGS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose(false);
    }
  };

  // Calculate which cards to show
  const visibleGigs = GIGS.map((gig, index) => {
    if (index < currentIndex) return null; // Already swiped
    if (index > currentIndex + 1) return null; // Too far down the stack
    return { gig, index };
  }).filter(Boolean) as { gig: Gig, index: number }[];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-xl max-w-2xl mx-auto border-x border-white/5"
      >
        <div className="relative w-full max-w-md h-[85dvh] max-h-[800px] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-2 mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap size={16} className="text-primary fill-primary" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-white">Gig Radar</span>
            </div>
            <button 
              onClick={() => onClose(false)} 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Card Stack Area */}
          <div className="relative w-full flex-grow">
            {visibleGigs.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {!matchedGig && visibleGigs.reverse().map(({ gig, index }) => {
                  const isTop = index === currentIndex;
                  return (
                    <GigCard 
                      key={gig.id}
                      gig={gig}
                      onSwipe={handleSwipe}
                      isTop={isTop}
                      index={index - currentIndex}
                      swipeDirection={isTop ? swipeDirection : null}
                    />
                  );
                })}
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Search size={32} className="text-white/20" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">No more gigs</h3>
                <p className="text-white/50">Check back later for new opportunities in your area.</p>
                <button 
                  onClick={() => onClose(false)}
                  className="mt-8 px-8 py-3 bg-white/10 rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-colors"
                >
                  Return Home
                </button>
              </div>
            )}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-6 shrink-0">
            {GIGS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex ? 'w-8 bg-white' : 
                  i < currentIndex ? 'w-2 bg-white/30' : 'w-2 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {matchedGig && (
          <MatchSuccess 
            gig={matchedGig} 
            onContinue={handleContinue} 
            onClose={() => onClose(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};
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
                <span className="text-2sm font-black uppercase tracking-widest text-primary">Verified Request</span>
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
              <span className="text-2sm font-bold uppercase tracking-wider">
                {order.matchType === 'instant' ? 'Instant Match' : 'Feed Bidding'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin size={14} className="text-primary/60" />
              <span className="text-2sm font-bold uppercase tracking-wider truncate">
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
          
          <p className="text-center text-2sm text-on-surface-variant/40 font-bold uppercase tracking-widest">
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
import { TaskStatus } from '@/src/shared/constants/domain.constant';

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
  taskStatus?: TaskStatus;
  assignedWorker?: Author;
  acceptedBidAmount?: string;
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

## File: src/store/feed.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { FeedItem, TaskData } from '@/src/shared/types/domain.type';
import { SAMPLE_DATA, TASK_STATUS, TaskStatus } from '@/src/shared/constants/domain.constant';

export interface FeedFilters {
  statusFilter?: TaskStatus[];
  categoryFilter?: string[];
  typeFilter?: ('social' | 'task' | 'editorial')[];
  searchQuery?: string;
}

export interface FeedSlice {
  // State
  feedItems: FeedItem[];
  replies: Record<string, FeedItem[]>;
  filters: FeedFilters;
  isLoading: boolean;
  lastUpdated: number | null;

  // Basic CRUD operations
  addFeedItem: (item: FeedItem) => void;
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => void;
  removeFeedItem: (id: string) => void;
  
  // Reply operations
  addReply: (parentId: string, reply: FeedItem) => void;
  setReplies: (parentId: string, replies: FeedItem[]) => void;
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => void;
  removeReply: (parentId: string, replyId: string) => void;

  // Engagement operations (real-time updates)
  incrementVotes: (id: string, parentId?: string) => void;
  decrementVotes: (id: string, parentId?: string) => void;
  incrementReplies: (id: string, parentId?: string) => void;
  incrementReposts: (id: string, parentId?: string) => void;
  incrementShares: (id: string, parentId?: string) => void;

  // Task-specific operations
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  assignTask: (id: string, worker: TaskData['assignedWorker'], bidAmount: string) => void;
  getTasksByStatus: (status: TaskStatus) => TaskData[];

  // Filter operations
  setFilters: (filters: FeedFilters) => void;
  clearFilters: () => void;
  getFilteredItems: () => FeedItem[];

  // Utility operations
  getItemById: (id: string) => FeedItem | undefined;
  setLoading: (loading: boolean) => void;
  refreshFeed: () => void;
  resetFeed: () => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set, get) => ({
  // Initial state
  feedItems: SAMPLE_DATA,
  replies: {},
  filters: {},
  isLoading: false,
  lastUpdated: Date.now(),

  // Basic CRUD operations
  addFeedItem: (item) => set((state) => ({ 
    feedItems: [item, ...state.feedItems],
    lastUpdated: Date.now()
  })),
  
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, ...updates } as FeedItem : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),
  
  removeFeedItem: (id: string) => set((state) => ({
    feedItems: state.feedItems.filter(item => item.id !== id),
    lastUpdated: Date.now()
  })),

  // Reply operations
  addReply: (parentId: string, reply: FeedItem) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    return {
      replies: {
        ...state.replies,
        [parentId]: [reply, ...existingReplies]
      },
      lastUpdated: Date.now()
    };
  }),
  
  setReplies: (parentId: string, replies: FeedItem[]) => set((state) => ({
    replies: { ...state.replies, [parentId]: replies },
    lastUpdated: Date.now()
  })),
  
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    const newReplies = existingReplies.map(r =>
      r.id === replyId ? { ...r, ...updates } as FeedItem : r
    );
    return {
      replies: {
        ...state.replies,
        [parentId]: newReplies
      },
      lastUpdated: Date.now()
    };
  }),

  removeReply: (parentId: string, replyId: string) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    return {
      replies: {
        ...state.replies,
        [parentId]: existingReplies.filter(r => r.id !== replyId)
      },
      lastUpdated: Date.now()
    };
  }),

  // Engagement operations (real-time updates)
  incrementVotes: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  decrementVotes: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id && (item.votes || 0) > 0 
          ? { ...item, votes: item.votes - 1 } 
          : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && (item.votes || 0) > 0 
        ? { ...item, votes: item.votes - 1 } 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementReplies: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, replies: (item.replies || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, replies: (item.replies || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementReposts: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, reposts: (item.reposts || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, reposts: (item.reposts || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementShares: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, shares: (item.shares || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, shares: (item.shares || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  // Task-specific operations
  updateTaskStatus: (id: string, status: TaskStatus) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && item.type === 'task' 
        ? { ...item, status } as TaskData 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  assignTask: (id: string, worker: TaskData['assignedWorker'], bidAmount: string) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && item.type === 'task' 
        ? { 
            ...item, 
            status: TASK_STATUS.ASSIGNED,
            assignedWorker: worker,
            acceptedBidAmount: bidAmount
          } as TaskData 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  getTasksByStatus: (status: TaskStatus) => {
    const state = get();
    return state.feedItems.filter(
      (item): item is TaskData => item.type === 'task' && item.status === status
    );
  },

  // Filter operations
  setFilters: (filters: FeedFilters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    lastUpdated: Date.now()
  })),

  clearFilters: () => set(() => ({
    filters: {},
    lastUpdated: Date.now()
  })),

  getFilteredItems: () => {
    const state = get();
    const { feedItems, filters } = state;
    let filtered = [...feedItems];

    if (filters.statusFilter && filters.statusFilter.length > 0) {
      filtered = filtered.filter(item => 
        item.type !== 'task' || filters.statusFilter!.includes(item.status as TaskStatus)
      );
    }

    if (filters.categoryFilter && filters.categoryFilter.length > 0) {
      filtered = filtered.filter(item => 
        item.type !== 'task' || filters.categoryFilter!.includes(item.category)
      );
    }

    if (filters.typeFilter && filters.typeFilter.length > 0) {
      filtered = filtered.filter(item => 
        filters.typeFilter!.includes(item.type)
      );
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (item.type === 'social') return item.content.toLowerCase().includes(query);
        if (item.type === 'task') return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
        if (item.type === 'editorial') return item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query);
        return false;
      });
    }

    return filtered;
  },

  // Utility operations
  getItemById: (id: string) => {
    const state = get();
    return state.feedItems.find(item => item.id === id);
  },

  setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),

  refreshFeed: () => set(() => ({
    feedItems: SAMPLE_DATA,
    lastUpdated: Date.now()
  })),

  resetFeed: () => set(() => ({
    feedItems: SAMPLE_DATA,
    replies: {},
    filters: {},
    isLoading: false,
    lastUpdated: Date.now()
  })),
});
```

## File: src/shared/constants/domain.constant.tsx
```typescript
import React from 'react';
import { Palette, Code, Car, FileText, Truck, PenTool, Package, MapPin } from 'lucide-react';
import { Author, FeedItem, Gig, ChatMessage, TaskData } from '@/src/shared/types/domain.type';

// ============================================================================
// TASK LIFECYCLE STATUS CONSTANTS
// Domain constants for various task lifecycle stages
// ============================================================================

export const TASK_STATUS = {
  OPEN: 'Open' as const,
  ASSIGNED: 'Assigned' as const,
  IN_PROGRESS: 'In Progress' as const,
  COMPLETED: 'Completed' as const,
  FINISHED: 'Finished' as const,
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TASK_STATUS.OPEN]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [TASK_STATUS.ASSIGNED]: 'bg-blue-100 text-blue-700 border-blue-200',
  [TASK_STATUS.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TASK_STATUS.COMPLETED]: 'bg-purple-100 text-purple-700 border-purple-200',
  [TASK_STATUS.FINISHED]: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const TASK_STATUS_ORDER: TaskStatus[] = [
  TASK_STATUS.OPEN,
  TASK_STATUS.ASSIGNED,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.COMPLETED,
  TASK_STATUS.FINISHED,
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Design': <Palette size={20} />,
  'Development': <Code size={20} />,
  'Ride Hail': <Car size={20} />,
  'Delivery': <Truck size={20} />,
  'Writing': <PenTool size={20} />,
  'Repair Needed': <span>🔧</span>,
  'Package': <Package size={20} />,
  'Location': <MapPin size={20} />,
};

export const MOCK_AUTHORS: Author[] = [
  { name: 'Alice Smith', handle: 'alicesmith', avatar: 'https://picsum.photos/seed/alice/100/100', verified: false, isOnline: true },
  { name: 'Bob Jones', handle: 'bobjones', avatar: 'https://picsum.photos/seed/bob/100/100', verified: true, isOnline: true },
  { name: 'Charlie Day', handle: 'charlie_day', avatar: 'https://picsum.photos/seed/charlie/100/100', verified: false, isOnline: false },
  { name: 'Diana Prince', handle: 'diana', avatar: 'https://picsum.photos/seed/diana/100/100', verified: true, isOnline: true },
  { name: 'Evan Wright', handle: 'evanw', avatar: 'https://picsum.photos/seed/evan/100/100', verified: false, isOnline: false },
];

export const SAMPLE_DATA: FeedItem[] = [
  // ============================================================================
  // FIRST POST / TASK (Special markers for empty states)
  // ============================================================================
  {
    id: 'first-post-1',
    type: 'social',
    author: MOCK_AUTHORS[0],
    content: '🚀 Excited to announce our new platform features! Check the docs at https://docs.siapaja.com. We\'ve been working hard on making the experience better for everyone. What do you think @bobjones? #updates #newfeatures \n\nP.S. The new secret code is ||launch2025||.',
    timestamp: 'Just now',
    replies: 0,
    reposts: 0,
    shares: 0,
    votes: 0,
    images: ['https://picsum.photos/seed/announcement/600/400'],
    isFirstPost: true,
  },
  {
    id: 'task-empty-1',
    type: 'task',
    author: MOCK_AUTHORS[1],
    category: 'Design',
    title: 'Need a quick logo animation',
    description: 'Looking for an After Effects wizard to animate our SVG logo. Just a simple 3-second reveal. Need it by tomorrow! Call me at 555-019-8372 if you have questions.',
    price: '$100-150',
    timestamp: 'Just now',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Design'],
    replies: 0,
    reposts: 0,
    shares: 0,
    votes: 0,
    isFirstTask: true,
  },

  // ============================================================================
  // SOCIAL POSTS
  // ============================================================================
  {
    id: 'social-empty-1',
    type: 'social',
    author: MOCK_AUTHORS[4],
    content: 'Taking a break from coding to enjoy this beautiful sunset. Sometimes you just need to step away from the screen! 🌅',
    timestamp: '2m',
    replies: 0,
    reposts: 0,
    shares: 0,
    votes: 5,
  },
  {
    id: 'thread-1',
    type: 'social',
    author: MOCK_AUTHORS[3],
    content: 'Designing for the future requires rethinking our foundational assumptions. A short thread on my recent learnings. 🧵',
    timestamp: '1h',
    replies: 2,
    reposts: 12,
    shares: 4,
    votes: 340,
    threadCount: 3,
    threadIndex: 1,
  },
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
    id: '6',
    type: 'social',
    author: MOCK_AUTHORS[4],
    content: 'Just saw this task and it looks like a great opportunity for anyone in the area who knows plumbing!',
    timestamp: '1h',
    replies: 2,
    reposts: 5,
    shares: 1,
    votes: 34,
    quote: {
      id: '2',
      type: 'task',
      author: MOCK_AUTHORS[1],
      category: 'Repair Needed',
      title: 'Fix leaking kitchen faucet',
      description: 'My kitchen faucet has been dripping for a week. Need someone to fix it ASAP.',
      price: '$50-80',
      timestamp: '4h',
      icon: CATEGORY_ICONS['Repair Needed'],
      replies: 5, reposts: 1, shares: 0, votes: 8
    } as TaskData
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
    id: 'social-7',
    type: 'social',
    author: MOCK_AUTHORS[2],
    content: 'Just wrapped up a major project! 🎉 Thanks to everyone who supported me along the way. Time to celebrate!',
    timestamp: '3h',
    replies: 24,
    reposts: 8,
    shares: 3,
    votes: 89,
    images: ['https://picsum.photos/seed/celebration/600/400'],
    replyAvatars: [MOCK_AUTHORS[0].avatar, MOCK_AUTHORS[1].avatar, MOCK_AUTHORS[3].avatar],
  },
  {
    id: 'social-8',
    type: 'social',
    author: MOCK_AUTHORS[1],
    content: 'Hot take: The best code is no code at all. Simplicity wins every time. 💡',
    timestamp: '5h',
    replies: 45,
    reposts: 23,
    shares: 12,
    votes: 234,
  },

  // ============================================================================
  // TASKS - OPEN STATUS
  // ============================================================================
  {
    id: '2',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Ride Hail',
    title: 'Luxury Airport Transfer (T3)',
    description: 'Looking for a premium sedan for an airport drop-off. Professional attire and clean vehicle required. Route includes highway tolls which are pre-paid.',
    price: '$45.00',
    timestamp: '15m',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Ride Hail'],
    details: 'Premium Airport Transfer',
    tags: ['Premium', 'VIP', 'Airport'],
    replies: 5,
    reposts: 1,
    shares: 0,
    votes: 8,
    mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&h=400&auto=format&fit=crop',
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
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Package'],
    replies: 2,
    reposts: 0,
    shares: 0,
    votes: 3,
    mapUrl: 'https://images.unsplash.com/photo-1554310603-d39d43033735?q=80&w=800&h=400&auto=format&fit=crop',
  },
  {
    id: 'task-open-1',
    type: 'task',
    author: MOCK_AUTHORS[2],
    category: 'Development',
    title: 'Build a React landing page',
    description: 'Need a modern, responsive landing page for our SaaS product. Should include hero section, features, pricing, and contact form.',
    price: '$500-800',
    timestamp: '30m',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Development'],
    details: 'Frontend Development',
    tags: ['React', 'TypeScript', 'Tailwind'],
    replies: 8,
    reposts: 4,
    shares: 2,
    votes: 15,
  },
  {
    id: 'task-open-2',
    type: 'task',
    author: MOCK_AUTHORS[4],
    category: 'Writing',
    title: 'Blog post about AI trends',
    description: 'Looking for a tech writer to create a 1500-word blog post about emerging AI trends in 2025. SEO knowledge preferred.',
    price: '$200-300',
    timestamp: '2h',
    status: TASK_STATUS.OPEN,
    icon: CATEGORY_ICONS['Writing'],
    details: 'Content Writing',
    tags: ['SEO', 'AI', 'Tech'],
    replies: 12,
    reposts: 6,
    shares: 3,
    votes: 28,
  },

  // ============================================================================
  // TASKS - ASSIGNED STATUS
  // ============================================================================
  {
    id: 'task-assigned-1',
    type: 'task',
    author: MOCK_AUTHORS[1],
    category: 'Design',
    title: 'Mobile app UI redesign',
    description: 'Redesign our existing mobile app with a fresh, modern look. Must follow Material Design principles.',
    price: '$800-1200',
    timestamp: '4h',
    status: TASK_STATUS.ASSIGNED,
    icon: CATEGORY_ICONS['Design'],
    details: 'UI/UX Design',
    tags: ['Mobile', 'Figma', 'Material Design'],
    replies: 15,
    reposts: 3,
    shares: 1,
    votes: 42,
    assignedWorker: MOCK_AUTHORS[3],
    acceptedBidAmount: '$950',
  },
  {
    id: 'task-assigned-2',
    type: 'task',
    author: MOCK_AUTHORS[0],
    category: 'Ride Hail',
    title: 'City tour for tourists',
    description: 'Need a comfortable vehicle for a 4-hour city tour. 3 passengers with camera equipment.',
    price: '$120',
    timestamp: '6h',
    status: TASK_STATUS.ASSIGNED,
    icon: CATEGORY_ICONS['Ride Hail'],
    details: 'Tourism Service',
    tags: ['Tour', 'VIP', 'Photography'],
    replies: 6,
    reposts: 2,
    shares: 0,
    votes: 18,
    assignedWorker: MOCK_AUTHORS[4],
    acceptedBidAmount: '$120',
  },

  // ============================================================================
  // TASKS - IN PROGRESS STATUS
  // ============================================================================
  {
    id: 'task-progress-1',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Development',
    title: 'E-commerce integration',
    description: 'Integrate Stripe payment gateway into existing React application. Need proper error handling and receipt generation.',
    price: '$600-900',
    timestamp: '12h',
    status: TASK_STATUS.IN_PROGRESS,
    icon: CATEGORY_ICONS['Development'],
    details: 'Payment Integration',
    tags: ['Stripe', 'React', 'Node.js'],
    replies: 22,
    reposts: 5,
    shares: 2,
    votes: 56,
    assignedWorker: MOCK_AUTHORS[0],
    acceptedBidAmount: '$750',
  },
  {
    id: 'task-progress-2',
    type: 'task',
    author: MOCK_AUTHORS[2],
    category: 'Delivery',
    title: 'Furniture delivery assistance',
    description: 'Need help delivering a small sofa and two chairs. Van or truck required. Loading help appreciated.',
    price: '$80',
    timestamp: '1d',
    status: TASK_STATUS.IN_PROGRESS,
    icon: CATEGORY_ICONS['Delivery'],
    details: 'Furniture Delivery',
    tags: ['Heavy', 'Vehicle Required'],
    replies: 4,
    reposts: 1,
    shares: 0,
    votes: 9,
    assignedWorker: MOCK_AUTHORS[1],
    acceptedBidAmount: '$80',
  },

  // ============================================================================
  // TASKS - COMPLETED STATUS
  // ============================================================================
  {
    id: 'task-completed-1',
    type: 'task',
    author: MOCK_AUTHORS[4],
    category: 'Design',
    title: 'Social media graphics pack',
    description: 'Created 20 social media templates for Instagram and LinkedIn. Consistent branding across all designs.',
    price: '$350',
    timestamp: '2d',
    status: TASK_STATUS.COMPLETED,
    icon: CATEGORY_ICONS['Design'],
    details: 'Graphics Design',
    tags: ['Social Media', 'Templates', 'Branding'],
    replies: 18,
    reposts: 12,
    shares: 8,
    votes: 67,
    assignedWorker: MOCK_AUTHORS[2],
    acceptedBidAmount: '$350',
    images: ['https://picsum.photos/seed/graphics/600/400'],
  },
  {
    id: 'task-completed-2',
    type: 'task',
    author: MOCK_AUTHORS[1],
    category: 'Writing',
    title: 'Product documentation',
    description: 'Comprehensive API documentation for our developer platform. Includes code examples and integration guides.',
    price: '$450',
    timestamp: '3d',
    status: TASK_STATUS.COMPLETED,
    icon: CATEGORY_ICONS['Writing'],
    details: 'Technical Writing',
    tags: ['Documentation', 'API', 'Technical'],
    replies: 9,
    reposts: 7,
    shares: 5,
    votes: 45,
    assignedWorker: MOCK_AUTHORS[3],
    acceptedBidAmount: '$450',
  },

  // ============================================================================
  // TASKS - FINISHED STATUS
  // ============================================================================
  {
    id: 'task-finished-1',
    type: 'task',
    author: MOCK_AUTHORS[0],
    category: 'Development',
    title: 'Full website rebuild',
    description: 'Complete website overhaul with new design system, improved performance, and SEO optimization. Project delivered ahead of schedule!',
    price: '$2500',
    timestamp: '1w',
    status: TASK_STATUS.FINISHED,
    icon: CATEGORY_ICONS['Development'],
    details: 'Full Stack Development',
    tags: ['Website', 'Performance', 'SEO'],
    replies: 34,
    reposts: 28,
    shares: 15,
    votes: 156,
    assignedWorker: MOCK_AUTHORS[4],
    acceptedBidAmount: '$2500',
    images: ['https://picsum.photos/seed/website/600/400'],
  },
  {
    id: 'task-finished-2',
    type: 'task',
    author: MOCK_AUTHORS[3],
    category: 'Ride Hail',
    title: 'Weekend wedding transport',
    description: 'Provided luxury transportation for wedding party. 5-hour service with multiple stops. Everything went smoothly!',
    price: '$400',
    timestamp: '1w',
    status: TASK_STATUS.FINISHED,
    icon: CATEGORY_ICONS['Ride Hail'],
    details: 'Event Transportation',
    tags: ['Wedding', 'Luxury', 'Event'],
    replies: 21,
    reposts: 15,
    shares: 6,
    votes: 98,
    assignedWorker: MOCK_AUTHORS[1],
    acceptedBidAmount: '$400',
  },

  // ============================================================================
  // EDITORIAL POSTS
  // ============================================================================
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
    id: 'editorial-1',
    type: 'editorial',
    author: MOCK_AUTHORS[1],
    tag: 'Business',
    title: 'Building a Successful Freelance Career',
    excerpt: 'Key strategies for transitioning from traditional employment to a thriving freelance business.',
    timestamp: '1d',
    replies: 42,
    reposts: 31,
    shares: 19,
    votes: 203,
  },
  {
    id: 'editorial-2',
    type: 'editorial',
    author: MOCK_AUTHORS[4],
    tag: 'Design',
    title: 'Minimalism in Modern UI Design',
    excerpt: 'Why less is more when it comes to creating intuitive and beautiful user interfaces.',
    timestamp: '2d',
    replies: 36,
    reposts: 24,
    shares: 14,
    votes: 178,
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

## File: src/shared/ui/SharedUI.Component.tsx
```typescript
import React, { useEffect, useRef, useState, useLayoutEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Users, Maximize2, Link as LinkIcon, Lock, PhoneOff, Globe, UserPlus, UserCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';

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

export const FollowButton: React.FC<{ 
  handle: string; 
  variant?: 'pill' | 'profile'; 
  className?: string;
  showIfMe?: boolean;
}> = ({ handle, variant = 'pill', className = "", showIfMe = false }) => {
  const currentUser = useStore(state => state.currentUser);
  const followedHandles = useStore(state => state.followedHandles);
  const toggleFollow = useStore(state => state.toggleFollow);

  if (currentUser.handle === handle && !showIfMe) return null;

  const isFollowing = followedHandles.includes(handle);

  const buttonStyles = {
    pill: `flex items-center gap-1 px-3 py-1 rounded-full text-2sm font-bold uppercase tracking-wider transition-all active:scale-95 ${
      isFollowing
        ? 'bg-white/10 text-on-surface-variant border border-white/10 hover:bg-white/15'
        : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30'
    }`,
    profile: `rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all active:scale-95 ${
      isFollowing
        ? 'bg-transparent border border-white/10 text-white hover:bg-white/5'
        : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02]'
    }`
  };

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleFollow(handle);
      }}
      className={`${buttonStyles[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isFollowing ? 'following' : 'follow'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5"
        >
          {isFollowing ? (
            <>
              <UserCheck size={variant === 'profile' ? 16 : 12} />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus size={variant === 'profile' ? 16 : 12} />
              <span>Follow</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export const FirstPostBadge: React.FC = () => (
  <div className="mt-1 mb-1">
    <span className="bg-emerald-500 text-black text-2xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] inline-flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
      First Post
    </span>
  </div>
);

export const FirstTaskBadge: React.FC = () => (
  <div className="mt-1 mb-1">
    <span className="bg-primary text-primary-foreground text-2xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] inline-flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
      First Task
    </span>
  </div>
);

interface FeedItemContextType {
  isMain: boolean;
  isParent: boolean;
  isQuote: boolean;
  hasLineBelow: boolean;
}

const FeedItemContext = createContext<FeedItemContextType>({
  isMain: false,
  isParent: false,
  isQuote: false,
  hasLineBelow: false
});

export const useFeedItemContext = () => useContext(FeedItemContext);

export const FeedItemProvider: React.FC<Partial<FeedItemContextType> & { children: React.ReactNode }> = ({ 
  children, 
  isMain = false, 
  isParent = false, 
  isQuote = false, 
  hasLineBelow = false 
}) => (
  <FeedItemContext.Provider value={{ isMain, isParent, isQuote, hasLineBelow }}>
    {children}
  </FeedItemContext.Provider>
);

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
    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider border text-2sm ${variants[variant]} ${className}`}>
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
                  <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-black truncate">{domain}</span>
                </div>
                <h4 className="text-15 font-black text-on-surface truncate leading-tight mb-1">{domain}</h4>
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
    <span key={`ph-${i}`} className="bg-red-500/10 text-red-500 text-2sm px-1.5 py-0.5 mx-0.5 rounded font-black uppercase tracking-widest border border-red-500/20 inline-flex items-center gap-1 align-baseline" title="Phone numbers are redacted for safety">
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
  className?: string;
}> = ({
  onBack,
  title,
  subtitle,
  rightNode,
  contentType,
  viewCount,
  currentlyViewing,
  className = ""
}) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  const isExcluded = title.toLowerCase().includes('message') || title.toLowerCase().includes('chat');
  const showStats = !isExcluded;
  const type = contentType || (title.toLowerCase().includes('task') ? 'Task' : title.toLowerCase().includes('reply') ? 'Reply' : 'Post');
  const views = viewCount || `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}k`;
  const viewing = currentlyViewing || Math.floor(Math.random() * 40) + 12;

  return (
    <header 
      className={`sticky top-0 z-20 bg-surface-container-high/95 border-b border-white/5 min-h-16 flex items-center px-4 justify-between gap-4 will-change-transform ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors shrink-0">
          <ArrowLeft size={20} className="text-on-surface" />
        </button>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-15 font-bold text-on-surface truncate">{title}</h1>
            {showStats && (
              <span className="text-2xs uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-on-surface-variant font-bold shrink-0">
                {type}
              </span>
            )}
          </div>
          {subtitle && <span className="text-1sm text-on-surface-variant font-medium truncate mt-0.5">{subtitle}</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {showStats && (
          <div className="hidden sm:flex items-center gap-3 text-1sm font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-3 py-1.5 rounded-full shadow-inner">
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
          <div className="sm:hidden flex items-center gap-2 text-2sm font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-2 py-1 rounded-full shadow-inner">
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
    </header>
  );
};

export const PageSlide: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="fixed inset-0 z-[60] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5 will-change-transform"
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
        className="w-full bg-transparent border-none py-2.5 px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
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

## File: src/features/creation/components/AIChatRequest.Component.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, ChevronRight, MapPin, DollarSign, FileText, X, Zap, Plus, ImageIcon, Camera, Mic, Paperclip, CheckCircle2, AlignLeft } from 'lucide-react';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { PropertyRow } from '@/src/features/creation/components/PropertyRow.Component';
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
      <div className="pt-12 pb-3 px-4 flex items-center justify-between bg-surface z-20 shrink-0 border-b border-white/5">
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
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 to-transparent animate-pulse" />
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
                        <div className={`px-5 py-3.5 text-15 leading-relaxed shadow-sm break-words relative ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-[24px] rounded-br-[8px]' 
                            : 'bg-surface-container-low border border-white/5 text-on-surface rounded-[24px] rounded-bl-[8px]'
                        }`}>
                          {msg.content}
                        </div>
                        
                        {msg.type === 'map-widget' && (
                          <div className="bg-surface-container border border-white/5 rounded-[24px] p-2 overflow-hidden w-64 shadow-md">
                            <div className="h-24 bg-surface-container-highest relative rounded-2xl overflow-hidden mb-2">
                               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-50" />
                               <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <MapPin size={20} className="text-emerald-500" />
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
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pointer-events-none">
                <div className="relative flex items-end gap-2 bg-surface-container-high border border-white/10 rounded-[28px] p-1.5 shadow-2xl pointer-events-auto">
                  <button onClick={insertMediaToCanvas} className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full shrink-0 transition-colors">
                    <Plus size={22} />
                  </button>
                  <AutoResizeTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Message AI..."
                    className="w-full text-on-surface placeholder:text-on-surface-variant/40 py-3 text-15"
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
                      className="w-full bg-transparent text-lg leading-relaxed text-on-surface/90 placeholder:text-on-surface-variant/30 focus:outline-none min-h-[300px]"
                    />
                  </div>
                </div>
              </div>

              {/* Canvas Bottom Toolbar & Action */}
              <div className="absolute bottom-0 left-0 right-0 bg-surface border-t border-white/5 p-4 pb-6">
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
              className="absolute inset-0 bg-black/80 z-[90]"
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
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="relative -mt-10 text-emerald-500">
                    <MapPin size={48} strokeWidth={2} className="fill-emerald-500/20" />
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
```

## File: src/features/feed/pages/PostDetail.Page.tsx
```typescript
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { EmptyRepliesState } from '@/src/features/feed/components/post-detail/EmptyRepliesState.Component';
import { BidSheet } from '@/src/features/feed/components/post-detail/BidSheet.Component';
import { CompletionSheet } from '@/src/features/feed/components/post-detail/CompletionSheet.Component';
import { ReviewSheet } from '@/src/features/feed/components/post-detail/ReviewSheet.Component';
import { TaskActionFooter } from '@/src/features/feed/components/post-detail/TaskActionFooter.Component';
import { FeedItem, SocialPostData, TaskData, CreationContext } from '@/src/shared/types/domain.type';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { useStore } from '@/src/store/main.store';
import { CreatePostPage } from './CreatePost.Page';
import { TASK_STATUS } from '@/src/shared/constants/domain.constant';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const feedItems = useStore(state => state.feedItems);
  const repliesMap = useStore(state => state.replies);
  const setReplies = useStore(state => state.setReplies);
  const addReply = useStore(state => state.addReply);
  const updateReply = useStore(state => state.updateReply);
  const updateFeedItem = useStore(state => state.updateFeedItem);
  const setCreationContext = useStore(state => state.setCreationContext);

  const initialPost = location.state?.post || feedItems.find(p => p.id === id);
  const threadContext = location.state?.thread || [];

  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreenReply, setIsFullscreenReply] = useState(false);

  const currentPost = postStack.length > 0 ? postStack[postStack.length - 1] : initialPost;
  const localReplies = currentPost ? (repliesMap[currentPost.id] || []) : [];

  const taskPriceString = currentPost?.type === 'task' ? (currentPost as TaskData).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [completionNotes, setCompletionNotes] = useState('');

  const isCreator = currentPost?.author.handle === currentUser.handle;
  const isAssignedToMe = currentPost?.type === 'task' 
    ? (currentPost as TaskData).assignedWorker?.handle === currentUser.handle 
    : false;

  const handleAcceptBid = (bid: SocialPostData) => {
    if (!currentPost) return;
    updateReply<SocialPostData>(currentPost.id, bid.id, { bidStatus: 'accepted' });
    if (updateFeedItem) {
      updateFeedItem<TaskData>(currentPost.id, {
        taskStatus: TASK_STATUS.ASSIGNED,
        assignedWorker: bid.author,
        acceptedBidAmount: bid.bidAmount
      });
    }
  };

  const handleStartTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.IN_PROGRESS });
  };

  const handleCompleteTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.COMPLETED });
    setShowCompleteModal(false);
  };

  const handleReviewTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.FINISHED });
    setShowReviewModal(false);
  };

  React.useEffect(() => {
    if (initialPost) setPostStack([initialPost]);
  }, [initialPost]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (currentPost && !repliesMap[currentPost.id]) {
      const generated = getReplies(currentPost, (i) => `Simulated insight #${i+1} for @${currentPost.author.handle}`);
      setReplies(currentPost.id, generated);
    }
  }, [currentPost?.id, initialPost, repliesMap, setReplies]);

  const handleBack = () => {
    if (postStack.length > 1) {
      setPostStack(prev => prev.slice(0, -1));
    } else {
      navigate(-1);
    }
  };

  const handleAction = (type: 'bid' | 'accept') => {
    if (type === 'bid') {
      setIsBidding(true);
    } else {
      if (!currentPost) return;
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
      addReply(currentPost.id, newBid);
      if (updateFeedItem) {
        updateFeedItem<TaskData>(currentPost.id, {
          taskStatus: TASK_STATUS.ASSIGNED,
          assignedWorker: currentUser,
          acceptedBidAmount: taskPriceString
        });
      }
      scrollToBottom();
    }
  };

  const handleBidSubmit = () => {
    if (!currentPost) return;
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
    addReply(currentPost.id, newBid);
    setIsBidding(false);
    setReplyText('');
    setBidAmount(defaultBid);
    scrollToBottom();
  };

  const handleFullscreenReply = (_threads?: ThreadBlock[]) => {
    if (!currentPost) return;
    const context: CreationContext = {
      parentId: currentPost.id,
      type: currentPost.type as 'social' | 'task' | 'editorial',
      authorHandle: currentPost.author.handle,
      content: currentPost.type === 'social' 
        ? (currentPost as SocialPostData).content 
        : (currentPost as TaskData).description || '',
      avatarUrl: currentPost.author.avatar,
      taskTitle: currentPost.type === 'task' ? (currentPost as TaskData).title : undefined,
      taskPrice: currentPost.type === 'task' ? (currentPost as TaskData).price : undefined
    };
    setCreationContext(context);
    setIsFullscreenReply(true);
  };

  const handleSendReply = () => {
    if (!currentPost || !replyText.trim()) return;
    const newReply: FeedItem = {
      id: Math.random().toString(),
      type: 'social',
      author: currentUser,
      content: replyText,
      timestamp: 'Just now',
      replies: 0, reposts: 0, shares: 0, votes: 0
    };
    addReply(currentPost.id, newReply);
    setReplyText('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  if (!currentPost) return <div className="p-8 text-center text-on-surface-variant">Post not found</div>;

  return (
    <PageSlide>
      <DetailHeader
        onBack={handleBack} 
        title={currentPost.type === 'task' ? "Task Details" : "Thread"} 
        subtitle={postStack.length > 1 ? `Replying to @${postStack[postStack.length - 2].author.handle}` : undefined} 
        className="bg-surface-container-high/95 border-b border-white/5"
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24 relative">
        {currentPost.type === 'task' && (
           <div 
             className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-surface-container-high pointer-events-none" 
           />
        )}
        
        <div className="pt-2 relative z-10">
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
            <TaskMainContent task={currentPost as TaskData} />
          ) : (
            <FeedItemRenderer
              data={currentPost}
              isMain={true}
              hasLineBelow={localReplies.length > 0}
            />
          )}
        </div>

        <div className={`flex flex-col ${currentPost.type === 'social' && (currentPost as SocialPostData).threadCount ? '' : 'border-t border-white/5 mt-2'}`}>
          {localReplies.length > 0 && !(currentPost.type === 'social' && (currentPost as SocialPostData).threadCount) && (
            <div className="px-6 py-4 text-1sm uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-white/5">
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
              />
            ))
          ) : (
            <EmptyRepliesState
              postType={currentPost.type}
              isCreator={!!isCreator}
              onBidClick={() => handleAction('bid')}
              onFocusReply={() => document.querySelector('textarea')?.focus()}
            />
          )}
        </div>
      </div>

      {currentPost.type === 'task' ? (
        <TaskActionFooter
          task={currentPost as TaskData}
          isCreator={!!isCreator}
          isAssignedToMe={isAssignedToMe}
          isNegotiable={isNegotiable}
          replyText={replyText}
          onReplyTextChange={setReplyText}
          onSendMessage={handleSendReply}
          onBid={() => handleAction('bid')}
          onAccept={() => handleAction('accept')}
          onStartTask={handleStartTask}
          onShowComplete={() => setShowCompleteModal(true)}
          onShowReview={() => setShowReviewModal(true)}
          onFullscreenReply={handleFullscreenReply}
        />
      ) : (
        <ReplyInput
          value={replyText}
          onChange={setReplyText}
          placeholder={`Reply to ${currentPost.author.handle}...`}
          onExpand={handleFullscreenReply}
          onSubmit={handleSendReply}
        />
      )}

      <BidSheet
        isOpen={isBidding}
        onClose={() => setIsBidding(false)}
        defaultBid={defaultBid}
        replyText={replyText}
        onReplyTextChange={setReplyText}
        bidAmount={bidAmount}
        onBidAmountChange={setBidAmount}
        onSubmit={handleBidSubmit}
      />

      <CompletionSheet
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        notes={completionNotes}
        onNotesChange={setCompletionNotes}
        onSubmit={handleCompleteTask}
      />

      <ReviewSheet
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        rating={reviewRating}
        onRatingChange={setReviewRating}
        onSubmit={handleReviewTask}
      />

      <AnimatePresence>
        {isFullscreenReply && (
          <CreatePostPage />
        )}
      </AnimatePresence>
    </PageSlide>
  );
};
```

## File: src/store/app.slice.ts
```typescript
import { StateCreator } from 'zustand';
import { TabState, Author, CreationContext } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS } from '@/src/shared/constants/domain.constant';

export type ThemeColor = 'red' | 'blue' | 'emerald' | 'violet' | 'amber';
export type TextSize = 'sm' | 'md' | 'lg';
export type ZoomLevel = 90 | 100 | 110 | 120;

export interface AppColumn {
  id: string;
  path: string;
  width: number;
  state?: any;
  activeTab?: TabState;
}

export interface AppSlice {
  isDesktop: boolean;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  currentUser: Author;
  creationContext: CreationContext | null;
  initialAiQuery: string | null;
  followedHandles: string[];
  userVotes: Record<string, 1 | -1 | 0>;
  userReposts: string[];
  themeColor: ThemeColor;
  textSize: TextSize;
  zoomLevel: ZoomLevel;
  columns: AppColumn[];
  openColumn: (path: string, sourceId?: string, state?: any) => void;
  closeColumn: (id: string) => void;
  setColumnWidth: (id: string, width: number) => void;
  setIsDesktop: (isDesktop: boolean) => void;
  setColumnActiveTab: (columnId: string, tab: TabState) => void;

  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
  setCreationContext: (ctx: CreationContext | null) => void;
  setInitialAiQuery: (query: string | null) => void;
  toggleFollow: (handle: string) => void;
  toggleVote: (id: string, value: 1 | -1) => void;
  toggleRepost: (id: string) => void;
  setThemeColor: (color: ThemeColor) => void;
  setTextSize: (size: TextSize) => void;
  setZoomLevel: (zoom: ZoomLevel) => void;
}

const STORAGE_KEY = 'siapaja-settings';

const VALID_THEME_COLORS: ThemeColor[] = ['red', 'blue', 'emerald', 'violet', 'amber'];
const VALID_TEXT_SIZES: TextSize[] = ['sm', 'md', 'lg'];
const VALID_ZOOM_LEVELS: ZoomLevel[] = [90, 100, 110, 120];

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { themeColor: 'red' as ThemeColor, textSize: 'md' as TextSize, zoomLevel: 100 as ZoomLevel };
    const parsed = JSON.parse(raw);
    return {
      themeColor: VALID_THEME_COLORS.includes(parsed.themeColor) ? parsed.themeColor : 'red' as ThemeColor,
      textSize: VALID_TEXT_SIZES.includes(parsed.textSize) ? parsed.textSize : 'md' as TextSize,
      zoomLevel: VALID_ZOOM_LEVELS.includes(parsed.zoomLevel) ? parsed.zoomLevel : 100 as ZoomLevel,
    };
  } catch {
    return { themeColor: 'red' as ThemeColor, textSize: 'md' as TextSize, zoomLevel: 100 as ZoomLevel };
  }
}

export const createAppSlice: StateCreator<AppSlice> = (set) => {
  const saved = loadSettings();
  return {
  isDesktop: window.innerWidth >= 768,
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  currentUser: MOCK_AUTHORS[0],
  columns: [{ id: 'main-col', path: '/', width: 420, activeTab: 'for-you' as TabState }],
  themeColor: saved.themeColor,
  textSize: saved.textSize,
  zoomLevel: saved.zoomLevel,
  setThemeColor: (themeColor) => set({ themeColor }),
  setTextSize: (textSize) => set({ textSize }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setIsDesktop: (isDesktop) => set({ isDesktop }),
  setColumnActiveTab: (columnId, tab) => set((state) => ({
    columns: state.columns.map(c => c.id === columnId ? { ...c, activeTab: tab } : c)
  })),
  setShowMatcher: (show) => set({ showMatcher: show }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowChatRoom: (show) => set({ showChatRoom: show }),
  setCurrentUser: (user) => set({ currentUser: user }),
  creationContext: null,
  setCreationContext: (ctx) => set({ creationContext: ctx }),
  initialAiQuery: null,
  setInitialAiQuery: (query) => set({ initialAiQuery: query }),
  followedHandles: [],
  userVotes: {},
  userReposts: [],
  toggleFollow: (handle) => set((state) => ({
    followedHandles: state.followedHandles.includes(handle)
      ? state.followedHandles.filter((h) => h !== handle)
      : [...state.followedHandles, handle]
  })),
  toggleVote: (id, value) => set((state) => {
    const current = state.userVotes[id] || 0;
    const next = current === value ? 0 : value;
    return { userVotes: { ...state.userVotes, [id]: next } };
  }),
  toggleRepost: (id) => set((state) => ({
    userReposts: state.userReposts.includes(id)
      ? state.userReposts.filter(rid => rid !== id)
      : [...state.userReposts, id]
  })),
  openColumn: (path, sourceId, routeState) => set((state) => {
    const newCol: AppColumn = {
      id: `col-${Math.random().toString(36).substring(2, 9)}`,
      path,
      width: 420, // Default width
      state: routeState,
      activeTab: path === '/' ? 'for-you' : undefined
    };

    if (sourceId) {
      const index = state.columns.findIndex(c => c.id === sourceId);
      if (index !== -1) {
        const newCols = [...state.columns];
        newCols.splice(index + 1, 0, newCol); // Insert right after source column
        return { columns: newCols };
      }
    }
    return { columns: [...state.columns, newCol] };
  }),
  closeColumn: (id) => set((state) => ({
    columns: state.columns.filter(c => c.id !== id)
  })),
  setColumnWidth: (id, width) => set((state) => ({
    columns: state.columns.map(c => c.id === id ? { ...c, width } : c)
  })),
  };
};
```

## File: src/App.tsx
```typescript
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useLocation, useNavigate, useRoutes, Routes, Route } from 'react-router-dom';
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
  PanelLeftOpen,
  Compass,
  ShoppingCart,
  UserCircle,
  FileText,
  CreditCard,
  Pencil,
  Settings
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
import { SettingsPage } from '@/src/features/settings/pages/Settings.Page';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

// Context to let components know which column they are in
export const ColumnContext = createContext<{ id: string; path: string; state?: any }>({ id: 'main-col', path: '/' });

const ProfileRoute = () => {
  const { state } = useContext(ColumnContext);
  const user = state?.user;
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
  { path: '/explore', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div> },
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
  if (path === '/explore') return { icon: Compass, label: 'Explore' };
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

const KanbanColumn = ({ col, index, total }: { col: any, index: number, total: number }) => {
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
  const title = col.state?.user?.name || meta.label;

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
          <Route path="/explore" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div>} />
          <Route path="/messages" element={<div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>} />
        </Routes>
      </main>

      {['/', '/explore', '/messages', '/profile', '/orders'].includes(location.pathname) && (
        <nav className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass border-t border-white/5 flex justify-around items-center px-4 will-change-transform">
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
  const showMatcher = useStore(state => state.showMatcher);
  const setShowMatcher = useStore(state => state.setShowMatcher);
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
    const timer = setTimeout(() => setShowMatcher(true), 3000);
    return () => clearTimeout(timer);
  }, [setShowMatcher]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsDesktop]);

  return (
    <div style={{ zoom: zoomLevel / 100, minHeight: '100dvh' }}>
      {isDesktop ? <DesktopKanbanLayout /> : <MobileLayout />}

      <AnimatePresence>
        {showMatcher && <GigMatcher />}
        {showCreateModal && <CreateModal />}
        {showChatRoom && <ChatRoom />}
      </AnimatePresence>
    </div>
  );
}
```
