# Directory Structure
```
src/
  features/
    creation/
      components/
        AIChatRequest.Component.tsx
        CreateModal.Component.tsx
    feed/
      components/
        TaskMainContent.Component.tsx
      pages/
        PostDetail.Page.tsx
    gigs/
      components/
        GigMatcher.Component.tsx
        MatchSuccess.Component.tsx
        PaymentOption.Component.tsx
      pages/
        Payment.Page.tsx
        ReviewOrder.Page.tsx
      types/
        gigs.types.ts
  shared/
    types/
      domain.type.ts
    ui/
      PostActions.Component.tsx
      SharedUI.Component.tsx
  store/
    app.slice.ts
    main.store.ts
    order.slice.ts
  App.tsx
```

# Files

## File: src/features/gigs/components/PaymentOption.Component.tsx
```typescript
import React from 'react';
import { Check } from 'lucide-react';

export const PaymentOption: React.FC<{ 
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

## File: src/shared/ui/PostActions.Component.tsx
```typescript
import React from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Repeat2, Send } from 'lucide-react';
import { IconButtonProps, PostActionsProps } from '@/src/shared/types/ui.types';
import { useStore } from '@/src/store/main.store';

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon, 
  count, 
  active, 
  onClick, 
  className = "",
  activeColor = "text-primary",
  hoverBg = "hover:bg-white/10"
}) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`flex items-center gap-1 p-1.5 -ml-1.5 rounded-full transition-all duration-200 active:scale-90 group ${hoverBg} ${className} ${active ? activeColor : 'text-on-surface-variant hover:text-on-surface'}`}
  >
    <Icon 
      size={18} 
      strokeWidth={active ? 2.5 : 2}
      className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'fill-current' : ''}`} 
    />
    {count !== undefined && count > 0 && (
      <span className="text-[12px] font-medium tracking-tight">
        {count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}
      </span>
    )}
  </button>
);

export const PostActions: React.FC<PostActionsProps> = ({
  id,
  votes,
  replies,
  reposts,
  shares,
  className = ""
}) => {
  const voteValue = useStore(state => state.userVotes[id] || 0);
  const isReposted = useStore(state => state.userReposts.includes(id));
  const toggleVote = useStore(state => state.toggleVote);
  const toggleRepost = useStore(state => state.toggleRepost);

  const currentVotes = votes + voteValue;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVote(id, 1);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVote(id, -1);
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-0.5 sm:gap-2">
        <IconButton
          icon={MessageCircle}
          count={replies}
          hoverBg="hover:bg-blue-500/10"
          activeColor="text-blue-500"
        />
        <IconButton
          icon={Repeat2}
          count={reposts + (isReposted ? 1 : 0)}
          active={isReposted}
          onClick={() => toggleRepost(id)}
          hoverBg="hover:bg-emerald-500/10"
          activeColor="text-emerald-500"
        />
        <IconButton
          icon={Send}
          count={shares}
          hoverBg="hover:bg-purple-500/10"
          activeColor="text-purple-500"
        />
      </div>

      {/* Vote Pill */}
      <div
        className="flex items-center bg-white/5 hover:bg-white/10 transition-colors rounded-full border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleUpvote}
          className={`p-1.5 pl-2 rounded-l-full flex items-center justify-center transition-all active:scale-90 ${voteValue === 1 ? 'text-orange-500' : 'text-on-surface-variant hover:text-orange-500 hover:bg-white/5'}`}
        >
          <ArrowBigUp size={18} className={voteValue === 1 ? 'fill-current' : ''} strokeWidth={voteValue === 1 ? 2.5 : 2} />
        </button>
        <span className={`px-1 text-[12px] font-bold min-w-[1.2rem] text-center tracking-tight ${voteValue === 1 ? 'text-orange-500' : voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant'}`}>
          {Math.abs(currentVotes) >= 1000 ? `${(currentVotes/1000).toFixed(1)}k` : currentVotes}
        </span>
        <button
          onClick={handleDownvote}
          className={`p-1.5 pr-2 rounded-r-full flex items-center justify-center transition-all active:scale-90 ${voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant hover:text-indigo-400 hover:bg-white/5'}`}
        >
          <ArrowBigDown size={18} className={voteValue === -1 ? 'fill-current' : ''} strokeWidth={voteValue === -1 ? 2.5 : 2} />
        </button>
      </div>
    </div>
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
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{label}</span>
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
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold">
                  <Zap size={10} className="fill-primary" />
                  {gig.meta}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/50 font-black">
                {getTypeLabel(gig.type)}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-wider">
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
                <span key={tag} className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-1.5 sm:space-y-2 mt-auto shrink-0">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">Project Brief</div>
              <p className="text-[12px] sm:text-[14px] text-white/70 leading-relaxed font-medium">
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

## File: src/features/gigs/pages/Payment.Page.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, QrCode, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { CheckoutLayout } from '@/src/shared/ui/SharedUI.Component';
import { PaymentOption } from '@/src/features/gigs/components/PaymentOption.Component';
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

## File: src/features/feed/components/TaskMainContent.Component.tsx
```typescript
import React, { useState } from 'react';
import { BadgeCheck, MapPin, Clock, ShieldCheck, Star, Navigation, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { MediaCarousel } from '@/src/features/feed/components/FeedItems.Component';
import { UserAvatar, TagBadge, ExpandableText, FollowButton, FirstPostBadge, FirstTaskBadge } from '@/src/shared/ui/SharedUI.Component';
import { PostActions } from '@/src/shared/ui/PostActions.Component';
import { TaskData } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';

export const TaskMainContent: React.FC<{ task: TaskData }> = ({ task }) => {
  const navigate = useNavigate();
  const updateFeedItem = useStore(state => state.updateFeedItem);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const handleClaim = () => {
    updateFeedItem<TaskData>(task.id, { status: 'Claimed' });
  };

  const markdownBody = task.description.length < 100 ? `
### Task Overview
${task.description}

### Requirements
- Must have own transportation
- Previous experience preferred
- Available during business hours

### Location Details
**Pickup:** Downtown Hub
**Dropoff:** Midtown Square
*Distance: ~2.4 miles*

> Please ensure all items are handled with care. Fragile items are included in this request.
  ` : task.description;

  return (
    <div className="relative pb-4">
      {/* Depth background gradient */}
      <div className="absolute top-0 inset-x-0 h-64 bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="px-5 pt-6 pb-2 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar src={task.author.avatar} alt={task.author.name} size="xl" className="ring-2 ring-white/10 shadow-2xl" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[16px] text-on-surface tracking-tight">{task.author.name}</span>
                {task.author.verified && <BadgeCheck size={16} className="text-primary fill-primary" />}
              </div>
              <div className="text-on-surface-variant text-[13px] font-medium">@{task.author.handle}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FollowButton handle={task.author.handle} variant="pill" className="mb-6" />
            <div className="flex flex-col items-end">
              <div className="text-3xl font-black text-on-surface tracking-tighter drop-shadow-md">{task.price}</div>
              {task.status && (
                <TagBadge variant="primary" className="mt-1 shadow-sm px-2 py-0.5 text-[10px]">
                  {task.status}
                </TagBadge>
              )}
            </div>
          </div>
        </div>

        {task.isFirstPost && <div className="mb-4"><FirstPostBadge /></div>}

        {task.isFirstTask && <div className="mb-4"><FirstTaskBadge /></div>}

        {/* Info Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <div className="scale-[0.6]">{task.icon}</div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-black">{task.category}</div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="text-[11px] text-on-surface-variant font-bold flex items-center gap-1"><Clock size={12} />{task.timestamp}</div>
        </div>

        <h2 className="text-[26px] font-black text-on-surface leading-[1.15] tracking-tight mb-6 drop-shadow-sm">{task.title}</h2>

        {/* Trust Card */}
        <div className="relative overflow-hidden rounded-[24px] p-5 mb-6 glass shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex gap-4 relative z-10">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Requester Rating</span>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star size={18} className="fill-yellow-500" />
                <span className="text-lg font-black text-on-surface tracking-tight">4.9</span>
                <span className="text-[11px] text-on-surface-variant font-bold">(124)</span>
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Payment</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-black tracking-wide">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mb-8">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-on-surface prose-p:leading-relaxed prose-p:text-on-surface-variant/90 prose-li:text-on-surface-variant/90">
            {task.description.length > 500 && !isDescExpanded ? (
              <>
                <Markdown>{task.description.substring(0, 500) + '...'}</Markdown>
                <button 
                  onClick={() => setIsDescExpanded(true)}
                  className="mt-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
                >
                  Show Full Description
                </button>
              </>
            ) : (
              <>
                <Markdown>{markdownBody}</Markdown>
                {task.description.length > 500 && (
                  <button 
                    onClick={() => setIsDescExpanded(false)}
                    className="mt-4 text-on-surface-variant font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Media Modules */}
        {(task.mapUrl || (task.images && task.images.length > 0) || task.video || task.voiceNote) && (
          <div className="flex flex-col gap-4 mb-8">
            {task.mapUrl && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 shadow-lg bg-surface-container-high flex flex-col group">
                <div className="relative h-40 w-full bg-black">
                  <img src={task.mapUrl} alt="Static Map Route" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale-[0.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-container-high" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white tracking-widest uppercase">OSRM Routed</span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-4 relative z-10 -mt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center mt-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
                      <div className="w-0.5 h-8 bg-white/10 rounded-full my-1" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div>
                        <div className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Pickup Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Downtown Hub (37.7749° N, 122.4194° W)</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Dropoff Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Midtown Square (37.7833° N, 122.4167° W)</div>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="https://maps.google.com/?q=Midtown+Square" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3.5 px-4 rounded-xl font-black text-sm transition-colors border border-primary/20 mt-2"
                  >
                    <Navigation size={16} />
                    Navigate via Google Maps
                    <ExternalLink size={14} className="ml-auto opacity-50" />
                  </a>
                </div>
              </div>
            )}
            {task.images && task.images.length > 0 && (
              <MediaCarousel images={task.images} className="rounded-[24px] overflow-hidden border border-white/10 shadow-lg" />
            )}
            {task.video && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 bg-black shadow-lg">
                <video src={task.video} controls className="w-full h-auto max-h-80" />
              </div>
            )}
            {task.voiceNote && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-surface-container-high to-surface-container rounded-[24px] border border-white/5 shadow-lg">
                <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all">
                  <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-current border-b-[7px] border-b-transparent ml-1" />
                </button>
                <div className="flex-grow">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-primary w-1/3 rounded-full relative">
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-bold tracking-wider">
                    <span>0:12</span><span>0:45</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {task.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {task.tags.map(tag => (
              <TagBadge key={tag} variant="default" className="px-2.5 py-1 text-[10px] rounded-full">{tag}</TagBadge>
            ))}
          </div>
        )}

        <div className="text-center text-[11px] text-on-surface-variant/60 font-bold tracking-widest uppercase mb-4">{task.meta}</div>

        <div className="pt-4 border-t border-white/5">
          <PostActions id={task.id} votes={task.votes} replies={task.replies} reposts={task.reposts} shares={task.shares} className="py-1" />
        </div>
      </div>
    </div>
  );
};
```

## File: src/features/feed/pages/PostDetail.Page.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown, ArrowLeft, Sparkles, MessageSquareDashed, Maximize2 } from 'lucide-react';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide, AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { FeedItem, SocialPostData, TaskData, CreationContext } from '@/src/shared/types/domain.type';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { useStore } from '@/src/store/main.store';
import { CreatePostPage } from './CreatePost.Page';

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
  const setCreationContext = useStore(state => state.setCreationContext);

  const initialPost = location.state?.post || feedItems.find(p => p.id === id);
  const threadContext = location.state?.thread || [];

  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreenReply, setIsFullscreenReply] = useState(false);

  const { scrollY } = useScroll({ container: scrollRef });
  const headerOpacity = useTransform(scrollY, [20, 80], [0, 1]);
  const blurValue = useTransform(scrollY, [20, 80], [0, 12]);
  const headerBg = useMotionTemplate`rgba(0, 0, 0, ${headerOpacity})`;
  const headerBlur = useMotionTemplate`blur(${blurValue}px)`;
  
  // Parallax for the hero background
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const heroScale = useTransform(scrollY, [-100, 0], [1.2, 1]);

  const currentPost = postStack.length > 0 ? postStack[postStack.length - 1] : initialPost;
  const localReplies = currentPost ? (repliesMap[currentPost.id] || []) : [];

  const taskPriceString = currentPost?.type === 'task' ? (currentPost as TaskData).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const isCreator = currentPost?.author.handle === currentUser.handle;

  const handleAcceptBid = (bidId: string) => {
    if (!currentPost) return;
    updateReply<SocialPostData>(currentPost.id, bidId, { bidStatus: 'accepted' });
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
      // Direct Accept Flow
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
      if (scrollRef.current) {
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      }
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
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  const handleFullscreenReply = (threads?: ThreadBlock[]) => {
    if (!currentPost) return;
    const context: CreationContext = {
      parentId: currentPost.id,
      type: currentPost.type as 'social' | 'task' | 'editorial',
      authorHandle: currentPost.author.handle,
      content: currentPost.type === 'social' ? (currentPost as SocialPostData).content : (currentPost as TaskData).description || '',
      avatarUrl: currentPost.author.avatar,
      taskTitle: currentPost.type === 'task' ? (currentPost as TaskData).title : undefined,
      taskPrice: currentPost.type === 'task' ? (currentPost as TaskData).price : undefined
    };
    setCreationContext(context);
    setIsFullscreenReply(true);
  };



  if (!currentPost) return <div className="p-8 text-center text-on-surface-variant">Post not found</div>;

  return (
    <PageSlide>
      <DetailHeader 
        onBack={handleBack} 
        title={currentPost.type === 'task' ? "Task Details" : "Thread"} 
        subtitle={postStack.length > 1 ? `Replying to @${postStack[postStack.length - 2].author.handle}` : undefined} 
        className="!bg-transparent !border-transparent transition-colors"
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur, WebkitBackdropFilter: headerBlur }}
        titleOpacity={headerOpacity}
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24 -mt-16 pt-16 relative">
        {currentPost.type === 'task' && (
           <motion.div 
             className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-surface-container-high pointer-events-none origin-top" 
             style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
           >
              <div className="absolute inset-0 bg-background/50 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
           </motion.div>
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
            <TaskMainContent task={currentPost as any} />
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
            <div className="px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-white/5">
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-16 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="w-24 h-24 mb-6 rounded-full bg-surface-container border border-white/5 flex items-center justify-center relative shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
                {currentPost.type === 'task' ? (
                  <Sparkles size={36} className="text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                ) : (
                  <MessageSquareDashed size={36} className="text-primary relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                )}
              </div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight mb-3">
                {currentPost.type === 'task' ? 'No bids yet' : 'Quiet in here...'}
              </h3>
              <p className="text-[14px] text-on-surface-variant max-w-[280px] leading-relaxed mb-6 font-medium">
                {currentPost.type === 'task' 
                  ? isCreator 
                    ? 'Your task is live! Check back soon for bids from interested workers.'
                    : 'This task is waiting for a hero. Submit your bid and secure this opportunity!' 
                  : 'Be the first to share your thoughts and start the conversation.'}
              </p>
              {!isCreator && currentPost.type === 'task' ? (
                <button 
                  onClick={() => handleAction('bid')}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  Place First Bid
                </button>
              ) : currentPost.type !== 'task' ? (
                <button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <MessageSquareDashed size={14} />
                  Write a Reply
                </button>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>

      {currentPost.type === 'task' ? (
        <div className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex gap-3 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
            <AutoResizeTextarea
              id="task-reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-transparent border-none py-3 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
              minHeight={44}
              maxHeight={120}
              rows={1}
            />
            <button onClick={() => handleFullscreenReply()} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
              <Maximize2 size={18} />
            </button>
          </div>
          {replyText.trim() ? (
            <Button
              onClick={() => {
                if (!currentPost) return;
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
                if (scrollRef.current) {
                  setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
                }
              }}
              className="mb-1"
            >
              Send
            </Button>
          ) : (
            isCreator ? (
              <div className="flex gap-2 flex-shrink-0 mb-1">
                <Button variant="ghost" onClick={() => alert('Edit task functionality')} className="px-4">Edit</Button>
                <Button onClick={() => alert('Manage bids and task status')} className="px-5 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-400 text-zinc-950">Manage</Button>
              </div>
            ) : (
              <div className="flex gap-2 flex-shrink-0 mb-1">
                {!isNegotiable ? (
                  <>
                    <Button variant="ghost" onClick={() => handleAction('bid')} className="px-4">Bid</Button>
                    <Button onClick={() => handleAction('accept')} className="px-5 shadow-[0_0_20px_rgba(220,38,38,0.3)]">Accept</Button>
                  </>
                ) : (
                  <Button onClick={() => handleAction('bid')} className="px-5 shadow-[0_0_20px_rgba(220,38,38,0.3)]">Submit Bid</Button>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        <ReplyInput
          value={replyText}
          onChange={setReplyText}
          placeholder={`Reply to ${currentPost.author.handle}...`}
          onExpand={handleFullscreenReply}
          onSubmit={() => {
            if (!currentPost) return;
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
            if (scrollRef.current) {
              setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
            }
          }}
        />
      )}

      <AnimatePresence>
        {isBidding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
          >
            <div className="absolute inset-0" onClick={() => setIsBidding(false)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-on-surface tracking-tight">Submit Your Bid</h3>
                <button onClick={() => setIsBidding(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 mb-6">
                
                {/* Up Bid / Down Bid Stepper Mechanism */}
                <div className="flex items-center justify-between bg-surface-container border border-white/10 rounded-[28px] p-2 shadow-inner">
                  <button 
                    onClick={() => setBidAmount(prev => Math.max(1, prev - 5))}
                    className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-on-surface-variant transition-all active:scale-95"
                  >
                    <Minus size={28} />
                  </button>
                  
                  <div className="flex flex-col items-center flex-grow">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-1">Your Bid</span>
                    <div className="flex items-center justify-center text-5xl font-black text-on-surface tracking-tighter">
                      <span className="text-2xl text-emerald-500 mr-1 -mt-2">$</span>
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="bg-transparent border-none text-center w-28 focus:outline-none focus:ring-0 p-0 m-0 hide-scrollbar"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setBidAmount(prev => prev + 5)}
                    className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-on-surface-variant transition-all active:scale-95"
                  >
                    <Plus size={28} />
                  </button>
                </div>

                {/* Quick Bid Adjustments */}
                <div className="flex justify-center gap-2">
                  <button onClick={() => setBidAmount(prev => Math.max(1, prev - 15))} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1"><TrendingDown size={14}/> Down Bid</button>
                  <button onClick={() => setBidAmount(defaultBid)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface text-xs font-bold transition-colors">Match Original</button>
                  <button onClick={() => setBidAmount(prev => prev + 15)} className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1">Up Bid <TrendingDown size={14} className="rotate-180"/></button>
                </div>

                <textarea 
                  placeholder="Why should they choose you? (Optional)"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 min-h-[100px] resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <button 
                onClick={handleBidSubmit}
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

      <AnimatePresence>
        {isFullscreenReply && (
          <CreatePostPage />
        )}
      </AnimatePresence>
    </PageSlide>
  );
};
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
    pill: `flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
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
    <span className="bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] inline-flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
      First Post
    </span>
  </div>
);

export const FirstTaskBadge: React.FC = () => (
  <div className="mt-1 mb-1">
    <span className="bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] inline-flex items-center gap-1.5">
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
```

## File: src/features/creation/components/CreateModal.Component.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AIChatRequest } from '@/src/features/creation/components/AIChatRequest.Component';
import { SelectionButton } from '@/src/features/creation/components/SelectionButton.Component';
import { SocialForm } from '@/src/features/creation/components/SocialForm.Component';
import { useStore } from '@/src/store/main.store';
import { CreateType } from '@/src/features/creation/types/creation.types';
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
  userVotes: Record<string, 1 | -1 | 0>;
  userReposts: string[];
  setActiveTab: (tab: TabState) => void;
  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
  setCreationContext: (ctx: CreationContext | null) => void;
  setInitialAiQuery: (query: string | null) => void;
  toggleFollow: (handle: string) => void;
  toggleVote: (id: string, value: 1 | -1) => void;
  toggleRepost: (id: string) => void;
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
  ChevronRight,
  ChevronUp,
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

      <main className="flex-grow pb-20 relative overflow-x-hidden hide-scrollbar">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
