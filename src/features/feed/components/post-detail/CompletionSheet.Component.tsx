import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { Button } from '@/src/shared/ui/SharedUI.Component';
import { CompletionSheetProps } from '@/src/shared/types/feed.types';

export const CompletionSheet: React.FC<CompletionSheetProps> = ({
  isOpen,
  onClose,
  notes,
  onNotesChange,
  onSubmit,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
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
            <h3 className="text-xl font-black text-on-surface tracking-tight">Complete Task</h3>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4 mb-6">
            <textarea 
              placeholder="Add completion notes or proof of work..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 min-h-[120px] resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button className="w-full border border-dashed border-white/20 rounded-2xl p-6 text-on-surface-variant hover:bg-white/5 hover:text-white transition-colors flex flex-col items-center justify-center gap-2">
              <Camera size={24} className="opacity-50" />
              <span className="text-xs font-bold">Upload Proof Image</span>
            </button>
          </div>
          <Button fullWidth onClick={onSubmit} className="bg-emerald-500 text-black hover:bg-emerald-400">Submit Completion</Button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);