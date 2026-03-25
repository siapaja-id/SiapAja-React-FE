import React from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Clock, MapPin, DollarSign } from 'lucide-react';
import Markdown from 'react-markdown';
import { CheckoutHeader } from '../components/SharedUI.Component';

interface ReviewOrderProps {
  order: {
    summary: string;
    amount: string;
    type: string;
  };
  onBack: () => void;
  onProceed: () => void;
}

export const ReviewOrder: React.FC<ReviewOrderProps> = ({ order, onBack, onProceed }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-surface p-6 pb-32"
    >
      <div className="max-w-xl mx-auto">
        <CheckoutHeader 
          title="Review Order" 
          subtitle="Step 1 of 2 • Verification" 
          onBack={onBack} 
        />

        {/* Order Card */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10 mb-6">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Verified Request</span>
                <p className="text-sm font-bold text-on-surface">AI-Generated Summary</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              Ready
            </div>
          </div>
          
          <div className="p-8">
            <div className="markdown-body prose prose-invert max-w-none prose-sm">
              <Markdown>{order.summary}</Markdown>
            </div>
          </div>

          <div className="p-6 bg-white/5 border-t border-white/5 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Instant Match</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Local Service</span>
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
          
          <button 
            onClick={onProceed}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Proceed to Payment
            <Check size={20} strokeWidth={3} />
          </button>
          
          <p className="text-center text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest">
            Secure transaction powered by @Logistics
          </p>
        </div>
      </div>
    </motion.div>
  );
};