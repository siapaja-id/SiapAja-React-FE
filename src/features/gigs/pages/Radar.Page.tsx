import React from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, Variants } from 'framer-motion';
import { X, Check, MapPin, Clock, Zap, ShieldCheck, Search, ChevronUp, Bot, ListOrdered } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatchSuccess } from '@/src/features/gigs/components/MatchSuccess.Component';
import { BidSheet } from '@/src/features/feed/components/post-detail/BidSheet.Component';
import { Gig, GigCardProps, GigInfoBlockProps } from '@/src/shared/types/gigs.types';
import { GIGS } from '@/src/shared/data/mock-gigs';
import { useRadar } from '@/src/features/gigs/hooks/useRadar';
import { Palette } from 'lucide-react';

const GigInfoBlock: React.FC<GigInfoBlockProps> = ({ icon, label, value }) => (
  <div className="bg-on-surface/[0.03] p-3 sm:p-4 rounded-2xl border border-outline-variant backdrop-blur-sm">
    <div className="flex items-center gap-1.5 sm:gap-2 text-on-surface/40 mb-1.5 sm:mb-2">
      {icon}
      <span className="text-2xs sm:text-2sm font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-xs sm:text-sm font-bold text-white tracking-wide">{value}</div>
  </div>
);

const GigCard: React.FC<GigCardProps> = ({ gig, onSwipe, isTop, index, swipeDirection }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  const checkOpacity = useTransform(x, [20, 100], [0, 1]);
  const xOpacity = useTransform(x, [-20, -100], [0, 1]);
  const upOpacity = useTransform(y, [-20, -100], [0, 1]);

  const nextCardScale = useTransform(x, [-200, 0, 200], [1, 0.92, 1]);
  const nextCardY = useTransform(x, [-200, 0, 200], [0, 24, 0]);
  const nextCardOpacity = useTransform(x, [-200, 0, 200], [1, 0.6, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
      onSwipe('up');
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe('left');
    }
  };

  const isNext = index === 1;

  const cardVariants: Variants = {
    initial: { scale: 0.8, opacity: 0, y: 40 },
    animate: { 
      scale: isTop ? 1 : 0.92, 
      opacity: isTop ? 1 : 0.6, 
      y: isTop ? 0 : 24,
      zIndex: isTop ? 10 : 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: (custom: 'left' | 'right' | 'up') => {
      if (custom === 'up') return { y: -500, opacity: 0, transition: { duration: 0.3 } };
      return {
        x: custom === 'right' ? 400 : -400,
        y: 50,
        opacity: 0,
        rotate: custom === 'right' ? 15 : -15,
        transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
      };
    }
  };

  const displayIcon = gig.icon || <Palette size={28} />;

  return (
    <motion.div
      style={{ 
        x: isTop ? x : 0, 
        y: isTop ? y : (isNext ? nextCardY : 0),
        rotate: isTop ? rotate : 0,
        scale: isNext ? nextCardScale : undefined,
        opacity: isNext ? nextCardOpacity : undefined,
        transformOrigin: 'bottom center'
      }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={swipeDirection}
      className={`absolute inset-0 bg-surface-container-high rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant flex flex-col ${isTop ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      
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
          <motion.div style={{ opacity: upOpacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="border-4 border-primary text-primary px-8 py-4 rounded-3xl font-black text-5xl uppercase tracking-widest bg-black/60 backdrop-blur-md shadow-[0_0_50px_rgba(var(--primary),0.5)] flex flex-col items-center">
              <ChevronUp size={48} strokeWidth={4} className="mb-2" />
              BID
            </div>
          </motion.div>
        </>
      )}

      <div className="p-5 sm:p-8 flex-grow flex flex-col pointer-events-none relative z-10 min-h-0">
        <div className="flex-grow flex flex-col overflow-y-auto hide-scrollbar pb-4 min-h-0">
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-on-surface/5 border border-outline-variant flex items-center justify-center text-white shadow-inner backdrop-blur-md">
              {displayIcon}
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

          <div className="flex-grow flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <div className="text-2sm sm:text-1sm uppercase tracking-[0.2em] text-on-surface-variant font-black">
                {gig.type} Request
              </div>
              <div className="w-1 h-1 rounded-full bg-on-surface/20" />
              <div className="flex items-center gap-1 text-2sm sm:text-1sm text-on-surface-variant font-bold uppercase tracking-wider">
                <ShieldCheck size={12} className="text-emerald-500" />
                {gig.clientName}
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-[1.1] mb-4 shrink-0">{gig.title}</h2>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 shrink-0">
              <GigInfoBlock icon={<MapPin size={12} />} label="Location" value={gig.distance} />
              <GigInfoBlock icon={<Clock size={12} />} label="Timeline" value={gig.time} />
            </div>

            <div className="space-y-1.5 sm:space-y-2 mt-auto shrink-0">
              <div className="text-2xs sm:text-2sm uppercase tracking-[0.2em] text-on-surface/40 font-black">Project Brief</div>
              <p className="text-xs sm:text-base text-on-surface/70 leading-relaxed font-medium line-clamp-4">
                {gig.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-end gap-4 sm:gap-6 mt-2 pt-2 border-t border-on-surface/5 pointer-events-auto shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onSwipe('left'); }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-on-surface/5 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-red-500/20 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onSwipe('up'); }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 border border-primary/50 flex flex-col items-center justify-center text-primary hover:bg-primary hover:text-on-surface transition-all active:scale-90 shadow-xl mb-4"
          >
            <ChevronUp size={20} strokeWidth={3} className="-mb-1" />
            <span className="text-[9px] font-black uppercase tracking-widest mt-1">Bid</span>
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

export const RadarPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentIndex,
    swipeDirection,
    activeGig,
    queuedGigs,
    isAutoPilot,
    setIsAutoPilot,
    matchedGig,
    biddingGig,
    bidAmount,
    setBidAmount,
    replyText,
    setReplyText,
    visibleGigs,
    handleSwipe,
    advanceNext,
    handleBidSubmit,
    handleContinue,
    gigsLength,
  } = useRadar();

  return (
    <div className="flex flex-col h-[100dvh] md:h-full bg-background relative overflow-hidden max-w-2xl mx-auto">
      <AnimatePresence>
        {activeGig && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-3 flex items-center gap-3 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ListOrdered size={16} />
            </div>
            <div className="flex-grow">
              <div className="text-xs font-black uppercase tracking-widest text-emerald-400">Estafet Mode Active</div>
              <div className="text-sm font-medium text-on-surface/80">Currently on: <span className="text-white font-bold">{activeGig.title}</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-on-surface-variant uppercase">Up Next</div>
              <div className="text-lg font-black text-white">{queuedGigs.length}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full flex-grow flex flex-col p-4 sm:p-6 pb-24">
        <div className="flex justify-between items-center px-2 mb-6 shrink-0 relative z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap size={16} className="text-primary fill-primary" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-white">Radar</span>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant shadow-inner">
            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${isAutoPilot ? 'text-primary' : 'text-on-surface-variant'}`}>
              Auto-Pilot
            </span>
            <button
              onClick={() => setIsAutoPilot(!isAutoPilot)}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${isAutoPilot ? 'bg-primary' : 'bg-background border border-outline-variant'}`}
            >
              <motion.div layout className={`w-4 h-4 rounded-full bg-white shadow-sm ${isAutoPilot ? 'ml-auto' : ''}`} />
            </button>
          </div>
        </div>

        <div className="relative w-full flex-grow">
          {isAutoPilot ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
               <div className="relative flex items-center justify-center w-48 h-48 mb-8">
                 {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border-2 border-primary/40"
                    />
                 ))}
                 <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(var(--primary),0.5)] z-10">
                   <Bot size={28} />
                 </div>
               </div>
               <h3 className="text-2xl font-black text-white mb-2">Auto-Pilot Active</h3>
               <p className="text-on-surface-variant text-center max-w-xs font-medium">Sit back. We are instantly catching gigs that match your preferences.</p>
            </motion.div>
          ) : visibleGigs.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {!matchedGig && !biddingGig && visibleGigs.reverse().map(({ gig, index }) => {
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
              <div className="w-20 h-20 rounded-full bg-on-surface/5 flex items-center justify-center mb-6">
                <Search size={32} className="text-on-surface/20" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Queue Empty</h3>
              <p className="text-on-surface-variant">You've swiped through all available gigs.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-8 px-8 py-3 bg-on-surface/10 rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-on-surface/20 transition-colors"
              >
                Return Home
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {matchedGig && (
          <MatchSuccess 
            gig={matchedGig} 
            isQueued={!!activeGig && activeGig.id !== matchedGig.id}
            onContinue={handleContinue} 
            onClose={() => navigate('/')} 
          />
        )}
      </AnimatePresence>

      <BidSheet
        isOpen={!!biddingGig}
        onClose={() => advanceNext()}
        defaultBid={biddingGig ? parseInt(biddingGig.price.replace(/[^0-9]/g, '')) || 50 : 50}
        replyText={replyText}
        onReplyTextChange={setReplyText}
        bidAmount={bidAmount}
        onBidAmountChange={setBidAmount}
        onSubmit={handleBidSubmit}
      />
    </div>
  );
};
