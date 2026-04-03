import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Button } from '@/src/shared/ui/SharedUI.Component';
import { ReviewSheetProps } from '@/src/shared/types/feed.types';

export const ReviewSheet: React.FC<ReviewSheetProps> = ({
  isOpen,
  onClose,
  rating,
  onRatingChange,
  onSubmit,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-outline-variant"
      >
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-surface-container-high border-t border-on-surface/5 rounded-t-[32px] p-6 pb-12 sheet-shadow"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-on-surface tracking-tight">Review Work</h3>
            <button onClick={onClose} className="p-2 bg-on-surface/5 rounded-full hover:bg-on-surface/10 text-on-surface-variant">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center mb-6 gap-4">
            <div className="text-sm font-bold text-on-surface-variant">Rate the worker</div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => onRatingChange(star)} className="focus:outline-none transition-transform active:scale-90">
                  <Star size={32} className={star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-on-surface/20'} />
                </button>
              ))}
            </div>
          </div>
          <Button fullWidth onClick={onSubmit} className="bg-emerald-500 text-black hover:bg-emerald-400">Release Payment</Button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);