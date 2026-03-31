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