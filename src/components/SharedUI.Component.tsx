import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export const CheckoutHeader: React.FC<{ 
  title: string; 
  subtitle: string; 
  onBack: () => void; 
}> = ({ title, subtitle, onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button 
      onClick={onBack}
      className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
    >
      <ArrowLeft size={24} />
    </button>
    <div>
      <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">{title}</h2>
      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{subtitle}</p>
    </div>
  </div>
);

export const CheckoutLayout: React.FC<{
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, onBack, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="min-h-screen bg-surface p-6 pb-32"
  >
    <div className="max-w-xl mx-auto">
      <CheckoutHeader title={title} subtitle={subtitle} onBack={onBack} />
      {children}
    </div>
  </motion.div>
);

export const DetailHeader: React.FC<{ 
  onBack: () => void; 
  title: string; 
  subtitle?: string;
  rightNode?: React.ReactNode;
}> = ({ onBack, title, subtitle, rightNode }) => (
  <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 h-14 flex items-center px-4 gap-4 justify-between">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
        <ArrowLeft size={20} className="text-on-surface" />
      </button>
      <div className="flex flex-col">
        <h1 className="text-sm font-bold text-on-surface">{title}</h1>
        {subtitle && <span className="text-[10px] text-on-surface-variant font-medium">{subtitle}</span>}
      </div>
    </div>
    {rightNode}
  </header>
);

export const PageSlide: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    className="fixed inset-0 z-[60] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
  >
    {children}
  </motion.div>
);

export const ReplyInput: React.FC<{ 
  value: string; 
  onChange: (val: string) => void; 
  placeholder: string; 
  buttonText?: string;
  avatarUrl?: string;
}> = ({ value, onChange, placeholder, buttonText = "Reply", avatarUrl = "https://picsum.photos/seed/user/100/100" }) => (
  <div className="fixed bottom-0 w-full max-w-2xl bg-surface-container/90 backdrop-blur-xl border-t border-white/5 p-3 flex items-end gap-3 z-20">
    <img 
      src={avatarUrl} 
      alt="Your avatar" 
      className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 mb-1" 
      referrerPolicy="no-referrer" 
    />
    <div className="flex-grow relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none min-h-[44px] max-h-[120px]"
        rows={1}
        style={{ height: value ? 'auto' : '44px' }}
      />
    </div>
    <button 
      disabled={!value.trim()}
      className="bg-primary text-primary-foreground font-bold text-[14px] px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all mb-1"
    >
      {buttonText}
    </button>
  </div>
);