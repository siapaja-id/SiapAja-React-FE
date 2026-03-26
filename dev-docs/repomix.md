# Directory Structure
```
src/
  features/
    creation/
      components/
        CreateModal.Component.tsx
    feed/
      pages/
        CreatePost.Page.tsx
        PostDetail.Page.tsx
  shared/
    ui/
      SharedUI.Component.tsx
```

# Files

## File: src/features/creation/components/CreateModal.Component.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Briefcase, Send, DollarSign, Clock, Tag, ChevronRight, Sparkles, Car, Package, Zap, MapPin, Users } from 'lucide-react';

import { AIChatRequest } from '@/src/features/creation/components/AIChatRequest.Component';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';

type CreateType = 'social' | 'request' | null;

export const CreateModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [type, setType] = useState<CreateType>(null);

  const handleSelect = (selectedType: CreateType) => {
    setType(selectedType);
    setStep('form');
  };

  const handleBack = () => {
    setStep('select');
    setType(null);
  };

  const handleComplete = (data: any) => {
    console.log('Request completed:', data);
    onClose();
  };

  const isFullPage = step === 'form' && type === 'request';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${isFullPage ? '' : 'p-6'} bg-black/90 backdrop-blur-xl max-w-2xl mx-auto border-x border-white/5`}
    >
      <motion.div
        initial={isFullPage ? { y: '100%' } : { scale: 0.9, y: 20, opacity: 0 }}
        animate={isFullPage ? { y: 0 } : { scale: 1, y: 0, opacity: 1 }}
        exit={isFullPage ? { y: '100%' } : { scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`${isFullPage ? 'w-full h-full rounded-0' : 'w-full max-w-lg rounded-[40px] border border-white/10'} glass overflow-hidden shadow-2xl relative flex flex-col`}
      >
        {/* Header */}
        <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isFullPage ? 'pt-12' : ''}`}>
          <div className="flex items-center gap-3">
            {step === 'form' && (
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
            )}
            <h2 className="text-xl font-black text-on-surface tracking-tight uppercase">
              {step === 'select' ? 'Create New' : type === 'social' ? 'Share Update' : 'AI Assistant'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-8 overflow-y-auto hide-scrollbar flex-grow ${isFullPage ? 'max-w-2xl mx-auto w-full' : ''}`}>
          <AnimatePresence mode="wait">
            {step === 'select' ? (
              <motion.div
                key="select"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="grid grid-cols-1 gap-4"
              >
                <SelectionButton 
                  icon={<MessageSquare size={28} />}
                  title="Share an Update"
                  description="Post portfolio work, news, or connect with the community."
                  onClick={() => {
                    onClose();
                    if ((window as any).openCreatePost) {
                      (window as any).openCreatePost();
                    }
                  }}
                  accent="primary"
                />
                <SelectionButton 
                  icon={<Sparkles size={28} />}
                  title="Request Service"
                  description="Chat with our AI to book a ride, delivery, or hire help."
                  onClick={() => handleSelect('request')}
                  accent="emerald"
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="h-full"
              >
                {type === 'social' ? (
                  <SocialForm onPost={onClose} />
                ) : (
                  <AIChatRequest onComplete={(data) => {
                    onClose();
                    if ((window as any).onAIRequestComplete) {
                      (window as any).onAIRequestComplete(data);
                    }
                  }} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SelectionButton: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
  accent: 'primary' | 'emerald';
}> = ({ icon, title, description, onClick, accent }) => (
  <button 
    onClick={onClick}
    className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${accent}/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${accent}/20 transition-all`} />
    <div className="relative z-10 flex items-start gap-6">
      <div className={`w-16 h-16 rounded-2xl bg-${accent}/10 border border-${accent}/20 flex items-center justify-center text-${accent} shadow-inner`}>
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-black text-on-surface mb-1 tracking-tight">{title}</h3>
        <p className="text-sm text-on-surface-variant opacity-70 leading-relaxed">{description}</p>
      </div>
      <div className="self-center text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors">
        <ChevronRight size={24} />
      </div>
    </div>
  </button>
);

const SocialForm: React.FC<{ onPost: () => void }> = ({ onPost }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black">Content</label>
      <AutoResizeTextarea 
        autoFocus
        placeholder="What's on your mind? Share your latest work..."
        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/30 transition-colors"
        minHeight={160}
      />
    </div>
    
    <div className="flex items-center gap-4">
      <Button fullWidth className="flex-grow">
        <Send size={18} />
        Post Update
      </Button>
    </div>
  </div>
);
```

## File: src/features/feed/pages/CreatePost.Page.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Film, BarChart2, Smile, Plus, Trash2, Globe, Sparkles } from 'lucide-react';
import { UserAvatar, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';

interface ThreadBlock {
  id: string;
  content: string;
}

interface CreatePostPageProps {
  onBack: () => void;
  onPost: (threads: ThreadBlock[]) => void;
}

const MAX_CHARS = 280;

export const CreatePostPage: React.FC<CreatePostPageProps> = ({ onBack, onPost }) => {
  const [threads, setThreads] = useState<ThreadBlock[]>([{ id: '1', content: '' }]);
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addThread = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setThreads([...threads, { id: newId, content: '' }]);
    setActiveThreadIndex(threads.length);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const removeThread = (index: number) => {
    if (threads.length > 1) {
      const newThreads = threads.filter((_, i) => i !== index);
      setThreads(newThreads);
      setActiveThreadIndex(Math.max(0, index - 1));
    }
  };

  const updateThread = (index: number, content: string) => {
    const newThreads = [...threads];
    newThreads[index].content = content;
    setThreads(newThreads);
  };

  const handlePost = () => {
    const validThreads = threads.filter(t => t.content.trim() !== '');
    if (validThreads.length > 0) {
      onPost(validThreads);
    }
  };

  const calculateProgress = (text: string) => {
    return Math.min((text.length / MAX_CHARS) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 border-b border-white/5 glass sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-on-surface"
          >
            <X size={24} />
          </button>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest opacity-50">New Thread</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary font-bold text-sm px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
            Drafts
          </button>
          <button 
            onClick={handlePost}
            disabled={threads.every(t => t.content.trim() === '')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            Post <Sparkles size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto hide-scrollbar p-4 md:p-8 pb-40"
      >
        <div className="max-w-2xl mx-auto">
          <AnimatePresence initial={false}>
            {threads.map((thread, index) => {
              const progress = calculateProgress(thread.content);
              const isOverLimit = thread.content.length > MAX_CHARS;
              
              return (
                <motion.div 
                  key={thread.id} 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="relative flex gap-4 group mb-2"
                >
                  {/* Left Rail */}
                  <div className="flex flex-col items-center pt-1">
                    <UserAvatar src="https://picsum.photos/seed/user/100/100" size="lg" className="shadow-sm" />
                    {index < threads.length - 1 && (
                      <div className="w-[2px] flex-grow bg-gradient-to-b from-white/20 to-white/5 my-2 rounded-full" />
                    )}
                  </div>

                  {/* Thread Content */}
                  <div className="flex-grow pb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-on-surface">You</span>
                      {threads.length > 1 && (
                        <button 
                          onClick={() => removeThread(index)}
                          className="p-1.5 text-on-surface-variant/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <AutoResizeTextarea
                      autoFocus={index === activeThreadIndex}
                      value={thread.content}
                      onChange={(e) => updateThread(index, e.target.value)}
                      onFocus={() => setActiveThreadIndex(index)}
                      placeholder={index === 0 ? "What's happening?" : "Add another thought..."}
                      className="w-full text-on-surface text-lg placeholder:text-on-surface-variant/40 leading-relaxed"
                      minHeight={60}
                    />

                    {/* Toolbar & Character Count */}
                    <AnimatePresence>
                      {activeThreadIndex === index && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between mt-3 pt-3 border-t border-white/5"
                        >
                          <div className="flex items-center gap-1 text-primary">
                            {[ImageIcon, Film, BarChart2, Smile].map((Icon, i) => (
                              <button key={i} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                                <Icon size={18} />
                              </button>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {thread.content.length > 0 && (
                              <div className="flex items-center gap-3">
                                <div className="relative w-6 h-6 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" fill="none" className="stroke-white/10" strokeWidth="2" />
                                    <circle 
                                      cx="12" cy="12" r="10" fill="none" 
                                      className={`transition-all duration-300 ${isOverLimit ? 'stroke-red-500' : progress > 80 ? 'stroke-yellow-500' : 'stroke-primary'}`}
                                      strokeWidth="2"
                                      strokeDasharray={`${progress * 0.628} 62.8`}
                                    />
                                  </svg>
                                  {isOverLimit && (
                                    <span className="absolute text-[8px] font-bold text-red-500">
                                      {MAX_CHARS - thread.content.length}
                                    </span>
                                  )}
                                </div>
                                <div className="w-[1px] h-6 bg-white/10" />
                                <button 
                                  onClick={addThread}
                                  className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                >
                                  <Plus size={14} strokeWidth={3} />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Thread Trigger (Only show if last thread is not empty and not active) */}
          {threads[threads.length - 1].content.length > 0 && activeThreadIndex !== threads.length - 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 group cursor-pointer mt-2" 
              onClick={addThread}
            >
              <div className="flex flex-col items-center pt-1">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-on-surface-variant group-hover:bg-white/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                  <Plus size={20} />
                </div>
              </div>
              <div className="flex-grow pt-2.5">
                <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">Add to thread</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Footer Settings */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high/90 backdrop-blur-md rounded-full text-xs font-bold text-primary uppercase tracking-widest shadow-2xl border border-white/10 pointer-events-auto cursor-pointer hover:bg-surface-container-highest transition-colors"
        >
          <Globe size={14} />
          <span>Everyone can reply</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
```

## File: src/shared/ui/SharedUI.Component.tsx
```typescript
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Users } from 'lucide-react';

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
      className={`bg-transparent border-none focus:ring-0 focus:outline-none resize-none hide-scrollbar ${className}`}
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

export const ExpandableText: React.FC<{ 
  text: string; 
  limit?: number; 
  className?: string;
  buttonClassName?: string;
  suffix?: React.ReactNode;
}> = ({ text, limit = 160, className = "", buttonClassName = "", suffix }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > limit;

  if (!isLong) return <p className={className}>{text}{suffix && <span className="ml-2 inline-flex align-middle">{suffix}</span>}</p>;

  return (
    <div className={className}>
      <span className="inline">
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        {suffix && <span className="ml-2 inline-flex align-middle">{suffix}</span>}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={`ml-1 text-primary font-bold hover:underline focus:outline-none transition-all ${buttonClassName}`}
      >
        {isExpanded ? "show less" : "read more"}
      </button>
    </div>
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
  <PageSlide>
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 pb-2 shrink-0">
        <CheckoutHeader title={title} subtitle={subtitle} onBack={onBack} />
      </div>
      <div className="flex-grow overflow-y-auto px-6 pb-32 hide-scrollbar">
        {children}
      </div>
    </div>
  </PageSlide>
);

export const DetailHeader: React.FC<{ 
  onBack: () => void; 
  title: string; 
  subtitle?: string;
  rightNode?: React.ReactNode;
  contentType?: string;
  viewCount?: number | string;
  currentlyViewing?: number | string;
}> = ({ 
  onBack, 
  title, 
  subtitle, 
  rightNode,
  contentType,
  viewCount,
  currentlyViewing
}) => {
  const isExcluded = title.toLowerCase().includes('message') || title.toLowerCase().includes('chat');
  const showStats = !isExcluded;
  const type = contentType || (title.toLowerCase().includes('task') ? 'Task' : title.toLowerCase().includes('reply') ? 'Reply' : 'Post');
  const views = viewCount || `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}k`;
  const viewing = currentlyViewing || Math.floor(Math.random() * 40) + 12;

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors shrink-0">
          <ArrowLeft size={20} className="text-on-surface" />
        </button>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold text-on-surface truncate">{title}</h1>
            {showStats && (
              <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-on-surface-variant font-bold shrink-0">
                {type}
              </span>
            )}
          </div>
          {subtitle && <span className="text-[11px] text-on-surface-variant font-medium truncate mt-0.5">{subtitle}</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {showStats && (
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-3 py-1.5 rounded-full shadow-inner">
            <div className="flex items-center gap-1.5" title="Total Views">
              <Eye size={14} className="opacity-70" />
              <span>{views}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1.5 text-emerald-400" title="Currently viewing">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span>{viewing}</span>
            </div>
          </div>
        )}
        
        {/* Mobile alternative view (more compact, drops text) */}
        {showStats && (
          <div className="sm:hidden flex items-center gap-2 text-[10px] font-bold text-on-surface-variant bg-surface-container-low border border-white/5 px-2 py-1 rounded-full shadow-inner">
             <div className="flex items-center gap-1 text-emerald-400" title="Currently viewing">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
              <span>{viewing}</span>
            </div>
          </div>
        )}
        {rightNode}
      </div>
    </header>
  );
};

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
  <div className="fixed bottom-0 w-full max-w-2xl glass p-3 flex items-end gap-3 z-20">
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
```

## File: src/features/feed/pages/PostDetail.Page.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown, ArrowLeft, Sparkles, MessageSquareDashed } from 'lucide-react';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide, AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { FeedItem, SocialPostData } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, feedItems } = useStore();

  const initialPost = location.state?.post || feedItems.find(p => p.id === id);
  const threadContext = location.state?.thread || [];
  
  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>(initialPost ? [initialPost] : []);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const currentPost = postStack[postStack.length - 1];

  const initialReplies = useMemo(() => {
    if (!currentPost) return [];
    return getReplies(currentPost, (i, depth) => 
      depth === 0 
        ? `Interesting point! I think the ${i % 2 === 0 ? 'minimalist' : 'maximalist'} approach really shines here.`
        : `Replying to @${currentPost.author.handle}: That's a great observation about the flow.`
    );
  }, [currentPost?.id]);

  // Extract baseline price from task to set a realistic default bid
  const taskPriceString = currentPost?.type === 'task' ? (currentPost as any).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [localReplies, setLocalReplies] = useState<FeedItem[]>(initialReplies);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const isCreator = currentPost?.author.handle === currentUser.handle;

  const handleAcceptBid = (bidId: string) => {
    setLocalReplies(prev => prev.map(reply => {
      if (reply.id === bidId && reply.type === 'social') {
        return { ...reply, bidStatus: 'accepted' };
      }
      return reply;
    }));
  };

  React.useEffect(() => {
    if (initialPost) setPostStack([initialPost]);
  }, [initialPost]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setLocalReplies(initialReplies);
  }, [currentPost?.id, initialReplies]);

  const handleBack = () => {
    if (postStack.length > 1) {
      setPostStack(prev => prev.slice(0, -1));
    } else {
      navigate(-1);
    }
  };

  const handleAction = (type: 'bid' | 'accept') => {
    if (type === 'bid') {
      setIsBidding(true);
    } else {
      // Direct Accept Flow
      const newBid: SocialPostData = {
        id: Math.random().toString(),
        type: 'social',
        author: currentUser,
        content: "I'll take it! I'm available to complete this right away.",
        timestamp: 'Just now',
        replies: 0, reposts: 0, shares: 0, votes: 0,
        isBid: true,
        bidAmount: taskPriceString,
        bidStatus: 'accepted'
      };
      setLocalReplies(prev => [newBid, ...prev]);
      if (scrollRef.current) {
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      }
    }
  };

  const handleBidSubmit = () => {
    const newBid: SocialPostData = {
      id: Math.random().toString(),
      type: 'social',
      author: currentUser,
      content: replyText || "I can help with this task!",
      timestamp: 'Just now',
      replies: 0, reposts: 0, shares: 0, votes: 0,
      isBid: true,
      bidAmount: `$${bidAmount.toFixed(2)}`,
      bidStatus: 'pending'
    };
    setLocalReplies(prev => [newBid, ...prev]);
    setIsBidding(false);
    setReplyText('');
    setBidAmount(defaultBid);
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  if (!currentPost) return <div className="p-8 text-center text-on-surface-variant">Post not found</div>;

  return (
    <PageSlide>
      <DetailHeader 
        onBack={handleBack} 
        title={currentPost.type === 'task' ? "Task Details" : "Thread"} 
        subtitle={postStack.length > 1 ? `Replying to @${postStack[postStack.length - 2].author.handle}` : undefined} 
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24">
        <div className="pt-2">
          {postStack.slice(0, -1).map((parentPost, index) => (
            <FeedItemRenderer 
              key={parentPost.id} 
              data={parentPost} 
              isParent={true} 
              hasLineBelow={true} 
              onClick={() => setPostStack(prev => prev.slice(0, index + 1))} 
            />
          ))}
        </div>
        
        <div className="relative">
          {currentPost.type === 'task' ? (
            <TaskMainContent task={currentPost as any} />
          ) : (
            <FeedItemRenderer data={currentPost} isMain={true} hasLineBelow={localReplies.length > 0} />
          )}
        </div>

        <div className={`flex flex-col ${currentPost.type === 'social' && (currentPost as SocialPostData).threadCount ? '' : 'border-t border-white/5 mt-2'}`}>
          {localReplies.length > 0 && !(currentPost.type === 'social' && (currentPost as SocialPostData).threadCount) && (
            <div className="px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-white/5">
              {currentPost.type === 'task' ? 'Discussion & Bids' : 'Replies'}
            </div>
          )}
          {localReplies.length > 0 ? (
            localReplies.map((reply, index) => (
              <FeedItemRenderer 
                key={reply.id} 
                data={reply} 
                hasLineBelow={index < localReplies.length - 1} 
                onClick={() => setPostStack(prev => [...prev, reply])} 
                canAcceptBid={isCreator && currentPost.type === 'task'}
                onAcceptBid={handleAcceptBid}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-16 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="w-24 h-24 mb-6 rounded-full bg-surface-container border border-white/5 flex items-center justify-center relative shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
                {currentPost.type === 'task' ? (
                  <Sparkles size={36} className="text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                ) : (
                  <MessageSquareDashed size={36} className="text-primary relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                )}
              </div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight mb-3">
                {currentPost.type === 'task' ? 'No bids yet' : 'Quiet in here...'}
              </h3>
              <p className="text-[14px] text-on-surface-variant max-w-[280px] leading-relaxed mb-6 font-medium">
                {currentPost.type === 'task' 
                  ? isCreator 
                    ? 'Your task is live! Check back soon for bids from interested workers.'
                    : 'This task is waiting for a hero. Submit your bid and secure this opportunity!' 
                  : 'Be the first to share your thoughts and start the conversation.'}
              </p>
              {!isCreator && currentPost.type === 'task' ? (
                <button 
                  onClick={() => handleAction('bid')}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  Place First Bid
                </button>
              ) : currentPost.type !== 'task' ? (
                <button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <MessageSquareDashed size={14} />
                  Write a Reply
                </button>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>

      {currentPost.type === 'task' ? (
        <div className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex gap-3 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex-grow relative">
            <AutoResizeTextarea
              id="task-reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:bg-white/10 transition-colors"
              minHeight={44}
              maxHeight={120}
              rows={1}
            />
          </div>
          {replyText.trim() ? (
            <Button 
              onClick={() => {
                const newReply: FeedItem = {
                  id: Math.random().toString(),
                  type: 'social',
                  author: currentUser,
                  content: replyText,
                  timestamp: 'Just now',
                  replies: 0, reposts: 0, shares: 0, votes: 0
                };
                setLocalReplies(prev => [...prev, newReply]);
                setReplyText('');
                if (scrollRef.current) {
                  setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
                }
              }}
              className="mb-1"
            >
              Send
            </Button>
          ) : (
            isCreator ? (
              <div className="flex gap-2 flex-shrink-0 mb-1">
                <Button variant="ghost" onClick={() => alert('Edit task functionality')} className="px-4">Edit</Button>
                <Button onClick={() => alert('Manage bids and task status')} className="px-5 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-400 text-zinc-950">Manage</Button>
              </div>
            ) : (
              <div className="flex gap-2 flex-shrink-0 mb-1">
                {!isNegotiable ? (
                  <>
                    <Button variant="ghost" onClick={() => handleAction('bid')} className="px-4">Bid</Button>
                    <Button onClick={() => handleAction('accept')} className="px-5 shadow-[0_0_20px_rgba(220,38,38,0.3)]">Accept</Button>
                  </>
                ) : (
                  <Button onClick={() => handleAction('bid')} className="px-5 shadow-[0_0_20px_rgba(220,38,38,0.3)]">Submit Bid</Button>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        <ReplyInput 
          value={replyText} 
          onChange={setReplyText} 
          placeholder={`Reply to ${currentPost.author.handle}...`} 
        />
      )}

      <AnimatePresence>
        {isBidding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
          >
            <div className="absolute inset-0" onClick={() => setIsBidding(false)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-on-surface tracking-tight">Submit Your Bid</h3>
                <button onClick={() => setIsBidding(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 mb-6">
                
                {/* Up Bid / Down Bid Stepper Mechanism */}
                <div className="flex items-center justify-between bg-surface-container border border-white/10 rounded-[28px] p-2 shadow-inner">
                  <button 
                    onClick={() => setBidAmount(prev => Math.max(1, prev - 5))}
                    className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-on-surface-variant transition-all active:scale-95"
                  >
                    <Minus size={28} />
                  </button>
                  
                  <div className="flex flex-col items-center flex-grow">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-1">Your Bid</span>
                    <div className="flex items-center justify-center text-5xl font-black text-on-surface tracking-tighter">
                      <span className="text-2xl text-emerald-500 mr-1 -mt-2">$</span>
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="bg-transparent border-none text-center w-28 focus:outline-none focus:ring-0 p-0 m-0 hide-scrollbar"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setBidAmount(prev => prev + 5)}
                    className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-on-surface-variant transition-all active:scale-95"
                  >
                    <Plus size={28} />
                  </button>
                </div>

                {/* Quick Bid Adjustments */}
                <div className="flex justify-center gap-2">
                  <button onClick={() => setBidAmount(prev => Math.max(1, prev - 15))} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1"><TrendingDown size={14}/> Down Bid</button>
                  <button onClick={() => setBidAmount(defaultBid)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface text-xs font-bold transition-colors">Match Original</button>
                  <button onClick={() => setBidAmount(prev => prev + 15)} className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1">Up Bid <TrendingDown size={14} className="rotate-180"/></button>
                </div>

                <textarea 
                  placeholder="Why should they choose you? (Optional)"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 min-h-[100px] resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <button 
                onClick={handleBidSubmit}
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
    </PageSlide>
  );
};
```
