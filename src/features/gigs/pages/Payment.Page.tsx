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
