import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedComposer } from '@/src/features/feed/components/FeedComposer.Component';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { useStore } from '@/src/store/main.store';

export const HomePage: React.FC = () => {
  const activeTab = useStore(state => state.activeTab);
  const feedItems = useStore(state => state.feedItems);

  return (
    <div className="relative pb-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <FeedComposer />
          {feedItems.map((item) => (
            <FeedItemRenderer key={item.id} data={item} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
