import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'emerald' | 'outline' | 'ghost'; 
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}> = ({ children, variant = 'primary', size = 'md', fullWidth = false, className = "", ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02]",
    emerald: "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02]",
    outline: "bg-transparent border border-white/10 text-white hover:bg-white/5",
    ghost: "bg-white/5 text-white border border-white/10 hover:bg-white/10"
  };

  const sizes = {
    sm: "py-2 px-4 text-xs rounded-xl",
    md: "py-4 px-6 text-sm rounded-2xl",
    lg: "py-5 px-8 text-base sm:text-lg rounded-2xl"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const UserAvatar: React.FC<{ src: string; alt?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ src, alt = "User avatar", size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover ring-1 ring-white/10 z-10 bg-background flex-shrink-0 ${className}`} 
      referrerPolicy="no-referrer" 
    />
  );
};

export const AutoResizeTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { minHeight?: number; maxHeight?: number }> = ({ minHeight = 44, maxHeight = 120, className = "", style, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeight}px`;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [props.value, minHeight, maxHeight]);

  return (
    <textarea
      ref={textareaRef}
      className={`bg-transparent border-none focus:ring-0 focus:outline-none resize-none custom-scrollbar ${className}`}
      style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px`, ...style }}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = `${minHeight}px`;
        target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
        if (props.onInput) props.onInput(e);
      }}
      {...props}
    />
  );
};

export const TagBadge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'emerald' | 'default'; className?: string }> = ({ children, variant = 'default', className = "" }) => {
  const variants = {
    primary: 'bg-primary/20 text-primary border-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    default: 'bg-white/5 text-on-surface-variant border-white/10'
  };
  return (
    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider border text-[10px] ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

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
    <UserAvatar src={avatarUrl} size="md" className="mb-1" />
    <div className="flex-grow relative">
      <AutoResizeTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:bg-white/10"
        minHeight={44}
        maxHeight={120}
        rows={1}
      />
    </div>
    <Button 
      size="sm"
      disabled={!value.trim()}
      className="mb-1"
    >
      {buttonText}
    </Button>
  </div>
);