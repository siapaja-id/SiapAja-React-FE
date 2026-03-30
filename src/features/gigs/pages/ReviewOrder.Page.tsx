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