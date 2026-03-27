import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { FeedComposer } from '@/src/features/feed/components/FeedComposer.Component';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { useStore } from '@/src/store/main.store';

export const HomePage: React.FC = () => {
  const activeTab = useStore(state => state.activeTab);
  const feedItems = useStore(state => state.feedItems);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
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

  return (
    <div 
      className="relative overflow-x-hidden hide-scrollbar" 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove} 
      onTouchEnd={handleTouchEnd}
      style={{ overscrollBehaviorY: 'contain' }}
    >
      <div className="absolute left-0 right-0 flex justify-center items-start z-40 pointer-events-none top-4">
        <motion.div animate={{ y: isRefreshing ? 0 : Math.max(0, pullDistance - 40), opacity: pullDistance > 10 ? 1 : 0 }} className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 shadow-xl flex items-center justify-center text-primary">
          <motion.div animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }} transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : undefined}>
            {isRefreshing ? <Loader2 size={20} /> : <RefreshCw size={20} />}
          </motion.div>
        </motion.div>
      </div>

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
              <FeedItemRenderer key={item.id} data={item} />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
