import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquareDashed } from 'lucide-react';
import { EmptyRepliesStateProps } from '@/src/shared/types/feed.types';

export const EmptyRepliesState: React.FC<EmptyRepliesStateProps> = ({
  postType,
  isCreator,
  onBidClick,
  onFocusReply,
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="px-6 py-16 flex flex-col items-center justify-center text-center relative overflow-hidden"
  >
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    <div className="w-24 h-24 mb-6 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center relative shadow-lg">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
      {postType === 'task' ? (
        <Sparkles size={36} className="text-emerald-400 relative z-10" />
      ) : (
        <MessageSquareDashed size={36} className="text-primary relative z-10" />
      )}
    </div>
    <h3 className="text-2xl font-black text-on-surface tracking-tight mb-3">
      {postType === 'task' ? 'No bids yet' : 'Quiet in here...'}
    </h3>
    <p className="text-base text-on-surface-variant max-w-[280px] leading-relaxed mb-6 font-medium">
      {postType === 'task' 
        ? isCreator 
          ? 'Your task is live! Check back soon for bids from interested workers.'
          : 'This task is waiting for a hero. Submit your bid and secure this opportunity!' 
        : 'Be the first to share your thoughts and start the conversation.'}
    </p>
    {!isCreator && postType === 'task' ? (
      <button 
        onClick={onBidClick}
        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
      >
        <Sparkles size={14} />
        Place First Bid
      </button>
    ) : postType !== 'task' ? (
      <button 
        onClick={onFocusReply}
        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
      >
        <MessageSquareDashed size={14} />
        Write a Reply
      </button>
    ) : null}
  </motion.div>
);