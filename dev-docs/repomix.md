# Directory Structure
```
src/
  components/
    AIChatRequest.tsx
    ChatRoom.tsx
    CreateModal.tsx
    FeedItems.tsx
    GigMatcher.tsx
    MatchSuccess.tsx
    PostActions.tsx
    SharedUI.tsx
  pages/
    CreatePostPage.tsx
    PaymentPage.tsx
    PostDetailPage.tsx
    ReviewOrder.tsx
    TaskDetailPage.tsx
  App.tsx
  index.css
  main.tsx
.env.example
.gitignore
index.html
package.json
README.md
relay.config.json
tsconfig.json
vite.config.ts
```

# Files

## File: src/pages/CreatePostPage.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Film, BarChart2, Smile, Plus, Trash2, Globe, Sparkles } from 'lucide-react';

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
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background/80 backdrop-blur-2xl sticky top-0 z-20">
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
        className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 pb-40"
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
                    <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-white/10 flex-shrink-0 shadow-sm">
                      <img 
                        src="https://picsum.photos/seed/user/100/100" 
                        alt="User" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
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
                    
                    <textarea
                      autoFocus={index === activeThreadIndex}
                      value={thread.content}
                      onChange={(e) => updateThread(index, e.target.value)}
                      onFocus={() => setActiveThreadIndex(index)}
                      placeholder={index === 0 ? "What's happening?" : "Add another thought..."}
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface text-lg resize-none placeholder:text-on-surface-variant/40 min-h-[60px] leading-relaxed"
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                      }}
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
                            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                              <ImageIcon size={18} />
                            </button>
                            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                              <Film size={18} />
                            </button>
                            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                              <BarChart2 size={18} />
                            </button>
                            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                              <Smile size={18} />
                            </button>
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

## File: src/pages/PaymentPage.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, QrCode, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { CheckoutHeader } from '../components/SharedUI';

interface PaymentPageProps {
  order: {
    amount: string;
    type: string;
  };
  onBack: () => void;
  onSuccess: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ order, onBack, onSuccess }) => {
  const [status, setStatus] = useState<'selecting' | 'processing' | 'success'>('selecting');

  const handlePayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-surface p-6 pb-32"
    >
      <div className="max-w-xl mx-auto">
        <CheckoutHeader 
          title="Payment" 
          subtitle="Step 2 of 2 • Checkout" 
          onBack={onBack} 
        />

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
              <div className="glass rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden">
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
      </div>
    </motion.div>
  );
};

const PaymentOption: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
  active?: boolean;
}> = ({ icon, title, description, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-2xl border flex items-center gap-4 text-left transition-all active:scale-[0.98] ${
      active 
        ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5' 
        : 'bg-white/5 border-white/10 hover:bg-white/10'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-white/5 text-on-surface-variant'}`}>
      {icon}
    </div>
    <div className="flex-grow">
      <h4 className="font-bold text-on-surface text-sm">{title}</h4>
      <p className="text-[10px] text-on-surface-variant/60 font-medium">{description}</p>
    </div>
    {active && (
      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary">
        <Check size={14} strokeWidth={3} />
      </div>
    )}
  </button>
);
```

## File: src/pages/PostDetailPage.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { FeedItem, SocialPostData, EditorialData, MediaCarousel, getReplies } from '../components/FeedItems';
import { IconButton, PostActions } from '../components/PostActions';
import { ReplyInput } from '../components/SharedUI';

const ThreadPost = ({
  post,
  isMain,
  isParent,
  hasLineBelow,
  onClick,
}: {
  post: FeedItem;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  onClick?: () => void;
}) => {
  const isSocial = post.type === 'social';
  const isEditorial = post.type === 'editorial';

  return (
    <article 
      className={`px-4 relative ${onClick ? 'cursor-pointer hover:bg-white/[0.02] transition-colors' : ''} ${isParent ? 'opacity-60 hover:opacity-100' : ''} ${isMain ? 'pt-2' : 'pt-4'}`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex flex-col items-center">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className={`${isParent ? 'w-6 h-6' : 'w-10 h-10'} rounded-full object-cover ring-1 ring-white/10 z-10 bg-background transition-all`} 
            referrerPolicy="no-referrer" 
          />
          {hasLineBelow && (
            <div className={`w-0.5 grow mt-2 -mb-4 bg-white/5 rounded-full ${isParent ? 'min-h-[20px]' : 'min-h-[40px]'}`} />
          )}
        </div>
        <div className="flex-grow pb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`${isParent ? 'text-[12px]' : 'text-[14px]'} font-bold text-on-surface`}>{post.author.name}</span>
              {post.author.verified && <BadgeCheck size={isParent ? 12 : 14} className="text-primary fill-primary" />}
              {!isParent && <span className="text-on-surface-variant text-[12px]">@{post.author.handle}</span>}
              <span className="text-on-surface-variant text-[12px]">· {post.timestamp}</span>
            </div>
            {!isParent && <IconButton icon={MoreHorizontal} />}
          </div>

          {isSocial && (
            <div className="mb-2">
              <p className={`leading-relaxed text-on-surface whitespace-pre-wrap ${isMain ? 'text-[16px]' : isParent ? 'text-[13px] line-clamp-1' : 'text-[14px]'}`}>
                {(post as SocialPostData).content}
              </p>
              {!isParent && (post as SocialPostData).images && (post as SocialPostData).images!.length > 0 && (
                <div className="-mx-4 sm:mx-0">
                  <MediaCarousel images={(post as SocialPostData).images!} aspect={isMain ? "aspect-[3/4]" : "aspect-[4/5]"} className="mt-3" />
                </div>
              )}
            </div>
          )}

          {isEditorial && !isParent && (
            <div className="mb-3">
              <div className="text-[9px] uppercase tracking-[0.2em] text-primary font-black mb-3">
                {(post as EditorialData).tag}
              </div>
              <h2 className="font-black text-xl text-on-surface leading-tight mb-3">
                {(post as EditorialData).title}
              </h2>
              <p className="text-[14px] leading-relaxed text-on-surface/80 mb-4 font-serif">
                {(post as EditorialData).excerpt}
                {isMain && (
                  <>
                    <br/><br/>
                    The evolution of digital layouts has been a fascinating journey. From the rigid table-based designs of the early web to the fluid, responsive grids we use today.
                  </>
                )}
              </p>
            </div>
          )}

          {!isParent && (
            <div className="mt-2">
              <PostActions 
                votes={post.votes} 
                replies={post.replies} 
                reposts={post.reposts} 
                shares={post.shares} 
                className="py-1"
              />
              {post.replies > 0 && !isMain && (
                <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-primary/80 hover:text-primary transition-colors">
                  <MessageCircle size={12} />
                  <span>{post.replies} {post.replies === 1 ? 'reply' : 'replies'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export const PostDetailPage: React.FC<{ post: FeedItem; onBack: () => void; }> = ({ post, onBack }) => {
  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([post]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const currentPost = postStack[postStack.length - 1];
  
  const replies = useMemo(() => getReplies(currentPost, (i, depth) => 
    depth === 0 
      ? `Interesting point! I think the ${i % 2 === 0 ? 'minimalist' : 'maximalist'} approach really shines here.`
      : `Replying to @${currentPost.author.handle}: That's a great observation about the flow.`
  ), [currentPost.id]);

  React.useEffect(() => {
    setPostStack([post]);
  }, [post]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentPost.id]);

  const handleBack = () => {
    if (postStack.length > 1) {
      setPostStack(prev => prev.slice(0, -1));
    } else {
      onBack();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[60] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 h-14 flex items-center px-4 gap-4">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-on-surface" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-on-surface">Thread</h1>
          {postStack.length > 1 && (
            <span className="text-[10px] text-on-surface-variant font-medium">
              Replying to @{postStack[postStack.length - 2].author.handle}
            </span>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24">
        <div className="pt-2">
          {postStack.slice(0, -1).map((parentPost, index) => (
            <ThreadPost key={parentPost.id} post={parentPost} isParent={true} hasLineBelow={true} onClick={() => setPostStack(prev => prev.slice(0, index + 1))} />
          ))}
        </div>
        <ThreadPost post={currentPost} isMain={true} hasLineBelow={replies.length > 0} />
        <div className="flex flex-col border-t border-white/5 mt-2">
          {replies.length > 0 ? (
            replies.map((reply, index) => (
              <ThreadPost key={reply.id} post={reply} hasLineBelow={index < replies.length - 1} onClick={() => setPostStack(prev => [...prev, reply])} />
            ))
          ) : (
            <div className="p-12 text-center"><p className="text-on-surface-variant text-sm opacity-50">No replies yet.</p></div>
          )}
        </div>
      </div>

      <ReplyInput 
        value={replyText} 
        onChange={setReplyText} 
        placeholder={`Reply to ${currentPost.author.handle}...`} 
      />
    </motion.div>
  );
};
```

## File: src/pages/ReviewOrder.tsx
```typescript
import React from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Clock, MapPin, DollarSign } from 'lucide-react';
import Markdown from 'react-markdown';
import { CheckoutHeader } from '../components/SharedUI';

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
```

## File: src/pages/TaskDetailPage.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MoreHorizontal, BadgeCheck, MapPin, Clock, ShieldCheck, Star } from 'lucide-react';
import { TaskData, MediaCarousel, getReplies } from '../components/FeedItems';
import { IconButton, PostActions } from '../components/PostActions';
import Markdown from 'react-markdown';
import { ReplyInput } from '../components/SharedUI';

export const TaskDetailPage: React.FC<{ task: TaskData; onBack: () => void; }> = ({ task, onBack }) => {
  const [replyText, setReplyText] = useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const replies = useMemo(() => getReplies(task, () => 
    `I can help with this! I have experience with similar tasks in the area. Let me know if you need more details.`
  ), [task.id]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [task.id]);

  const markdownBody = task.description.length < 100 ? `
### Task Overview
${task.description}

### Requirements
- Must have own transportation
- Previous experience preferred
- Available during business hours

### Location Details
**Pickup:** Downtown Hub
**Dropoff:** Midtown Square
*Distance: ~2.4 miles*

> Please ensure all items are handled with care. Fragile items are included in this request.
  ` : task.description;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[60] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 h-14 flex items-center px-4 gap-4 justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-on-surface" />
          </button>
          <h1 className="text-sm font-bold text-on-surface">Task Details</h1>
        </div>
        <IconButton icon={MoreHorizontal} />
      </header>

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={task.author.avatar} alt={task.author.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" referrerPolicy="no-referrer" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[16px] text-on-surface">{task.author.name}</span>
                  {task.author.verified && <BadgeCheck size={16} className="text-primary fill-primary" />}
                </div>
                <div className="text-on-surface-variant text-[13px]">@{task.author.handle}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-black text-primary tracking-tight">{task.price}</div>
              {task.status && (
                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-primary/20 mt-1">
                  {task.status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 text-primary shadow-inner">
              <div className="scale-75">{task.icon}</div>
            </div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/80 font-black">{task.category}</div>
            <div className="w-1 h-1 rounded-full bg-white/20 mx-1" />
            <div className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1"><Clock size={12} />{task.timestamp}</div>
          </div>

          <h2 className="text-2xl font-black text-on-surface leading-tight mb-4">{task.title}</h2>

          <div className="flex gap-4 p-4 bg-surface-container-low/50 rounded-2xl border border-white/5 mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">Requester Rating</span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} className="fill-yellow-500" />
                <span className="text-[13px] font-bold text-on-surface">4.9</span>
                <span className="text-[11px] text-on-surface-variant">(124)</span>
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">Payment</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={14} />
                <span className="text-[13px] font-bold">Verified</span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert prose-sm max-w-none mb-6 prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-on-surface">
            <Markdown>{markdownBody}</Markdown>
          </div>

          {(task.mapUrl || (task.images && task.images.length > 0) || task.video || task.voiceNote) && (
            <div className="flex flex-col gap-3 mb-6">
              {task.mapUrl && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 group">
                  <img src={task.mapUrl} alt="Location map" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 text-on-surface">
                      <MapPin size={16} className="text-primary" />
                      <span className="text-sm font-bold">View full route</span>
                    </div>
                  </div>
                </div>
              )}
              {task.images && task.images.length > 0 && (
                <div className="-mx-6 sm:mx-0">
                  <MediaCarousel images={task.images} className="rounded-2xl overflow-hidden border border-white/10" />
                </div>
              )}
              {task.video && (
                <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video src={task.video} controls className="w-full h-auto max-h-80" />
                </div>
              )}
              {task.voiceNote && (
                <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-2xl border border-white/5">
                  <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-transform">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
                  </button>
                  <div className="flex-grow">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3 rounded-full" />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-on-surface-variant font-medium">
                      <span>0:12</span><span>0:45</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {task.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {task.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-on-surface-variant font-medium">{tag}</span>
              ))}
            </div>
          )}

          <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 mb-4">
            {task.category === 'Repair Needed' ? 'Submit Bid' : task.category === 'Grocery Run' ? 'Claim Task' : 'Accept Task'}
          </button>
          <div className="text-center text-[12px] text-on-surface-variant/70 font-medium mb-2">{task.meta}</div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <PostActions votes={task.votes} replies={task.replies} reposts={task.reposts} shares={task.shares} className="py-1" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-white/5">Discussion & Bids</div>
          {replies.length > 0 ? (
            replies.map((reply, index) => (
              <div key={reply.id} className={`p-6 ${index < replies.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="flex gap-3">
                  <img src={reply.author.avatar} alt={reply.author.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10" referrerPolicy="no-referrer" />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-bold text-on-surface">{reply.author.name}</span>
                        {reply.author.verified && <BadgeCheck size={14} className="text-primary fill-primary" />}
                        <span className="text-on-surface-variant text-[12px]">@{reply.author.handle}</span>
                        <span className="text-on-surface-variant text-[12px]">· {reply.timestamp}</span>
                      </div>
                      <IconButton icon={MoreHorizontal} />
                    </div>
                    <p className="text-[14px] leading-relaxed text-on-surface mb-3">{(reply as any).content}</p>
                    <PostActions votes={reply.votes} replies={reply.replies} reposts={reply.reposts} shares={reply.shares} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center"><p className="text-on-surface-variant text-sm opacity-50">No discussion yet. Be the first to ask a question!</p></div>
          )}
        </div>
      </div>

      <ReplyInput 
        value={replyText} 
        onChange={setReplyText} 
        placeholder="Ask a question or discuss details..." 
        buttonText="Send"
      />
    </motion.div>
  );
};
```

## File: src/components/AIChatRequest.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, Car, Package, Briefcase, FileText, ArrowLeft, Paperclip, Mic } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'selection' | 'summary' | 'welcome';
  data?: any;
}

export const AIChatRequest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (role: 'user' | 'assistant', content: string, type?: 'selection' | 'summary', data?: any) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    addMessage('user', text);
    setInput('');
    setIsTyping(true);

    // Simulate AI logic
    setTimeout(() => {
      setIsTyping(false);
      processAIResponse(text);
    }, 1500);
  };

  const processAIResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ride') || lowerText.includes('go to') || lowerText.includes('pick me up')) {
      addMessage('assistant', "I can help you book a ride. Where are you heading to, and where should the driver pick you up?");
    } else if (lowerText.includes('delivery') || lowerText.includes('send') || lowerText.includes('package')) {
      addMessage('assistant', "I'll arrange a delivery for you. What are we sending, and what's the destination address?");
    } else if (lowerText.includes('gig') || lowerText.includes('hire') || lowerText.includes('job') || lowerText.includes('project')) {
      addMessage('assistant', "Let's get your gig posted. What's the title of the project and your estimated budget?");
    } else if (messages.length > 0) {
      const isRide = lowerText.includes('ride') || messages.some(m => m.content.toLowerCase().includes('ride'));
      const markdownSummary = isRide 
        ? `### 🚗 Ride Request Details\n---\n**Pickup:** 123 Main St, Downtown\n**Drop-off:** 456 Elm St, Midtown\n**Vehicle:** Standard Sedan\n**Passengers:** 2\n\n**Estimated Price:** **Rp 25.000**\n**Estimated Arrival:** 5-7 minutes`
        : `### 📦 Delivery Request Details\n---\n**Item:** Large Box (Electronics)\n**From:** 789 Oak Ave, Westside\n**To:** 321 Pine St, Eastside\n**Weight:** ~5kg\n\n**Estimated Price:** **Rp 35.000**\n**Delivery Window:** 30-45 minutes`;

      addMessage('assistant', "I've gathered all the details. Please review your order summary below before we proceed:", 'summary', {
        title: isRide ? "Ride Request" : "Delivery Request",
        amount: isRide ? "Rp 25.000" : "Rp 35.000",
        summary: markdownSummary,
        type: isRide ? 'ride' : 'delivery'
      });
    } else {
      addMessage('assistant', "I'm not quite sure I caught that. Would you like a ride, a delivery, or to post a professional gig?");
    }
  };

  const handleReview = (data: any) => {
    onComplete(data);
  };

  return (
    <div className="flex flex-col h-[75vh] relative">
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-6 pb-32 px-2 custom-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-12"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <Sparkles size={32} className="text-primary relative z-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-on-surface tracking-tight">How can I help?</h2>
                <p className="text-on-surface-variant max-w-xs mx-auto">
                  Describe what you need, or choose a quick action below to get started.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
                <QuickActionCard 
                  icon={<Car size={20} />} 
                  title="Book a Ride" 
                  subtitle="Get to your destination"
                  onClick={() => handleSend("I'd like to book a ride")} 
                  delay={0.1}
                />
                <QuickActionCard 
                  icon={<Package size={20} />} 
                  title="Send a Package" 
                  subtitle="Same-day local delivery"
                  onClick={() => handleSend("I need a delivery")} 
                  delay={0.2}
                />
                <QuickActionCard 
                  icon={<Briefcase size={20} />} 
                  title="Hire a Pro" 
                  subtitle="Post a gig or task"
                  onClick={() => handleSend("I want to post a gig")} 
                  delay={0.3}
                />
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              layout
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-primary/80 text-white' : 'bg-surface-container-high border border-white/10 text-primary'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="space-y-3">
                  <div className={`p-4 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-[24px] rounded-tr-[8px]' 
                      : 'bg-surface-container border border-white/5 text-on-surface rounded-[24px] rounded-tl-[8px]'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.type === 'summary' && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-surface-container-high border border-white/10 rounded-[24px] overflow-hidden shadow-xl"
                    >
                      <div className="p-5 border-b border-dashed border-white/10 bg-emerald-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <Check size={16} strokeWidth={3} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Ready to Review</span>
                        </div>
                        <FileText size={16} className="text-emerald-500/50" />
                      </div>
                      
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="text-xl font-black text-on-surface tracking-tight">{msg.data.title}</div>
                          <div className="text-sm text-on-surface-variant mt-1">Your request details have been processed.</div>
                        </div>
                        
                        <button 
                          onClick={() => handleReview(msg.data)}
                          className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Review & Checkout
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 text-primary flex items-center justify-center mt-1">
                  <Bot size={14} />
                </div>
                <div className="bg-surface-container border border-white/5 p-4 rounded-[24px] rounded-tl-[8px] flex gap-1.5 items-center h-[52px]">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }} className="w-1.5 h-1.5 bg-primary/80 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 pt-10 pb-2 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <div className="relative flex items-end gap-2 bg-surface-container-high border border-white/10 rounded-[28px] p-2 shadow-2xl">
          <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex-shrink-0">
            <Paperclip size={20} />
          </button>
          
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message AI Assistant..."
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/40 resize-none py-3 max-h-[120px]"
            style={{ height: '48px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '48px';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          
          {input.trim() ? (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => handleSend()}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={18} className="ml-1" />
            </motion.button>
          ) : (
            <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex-shrink-0">
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; delay: number }> = ({ icon, title, subtitle, onClick, delay }) => (
  <motion.button 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    onClick={onClick}
    className="flex items-center gap-4 p-4 bg-surface-container border border-white/5 rounded-2xl hover:bg-surface-container-high hover:border-white/10 transition-all text-left group"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-grow">
      <h4 className="text-sm font-bold text-on-surface">{title}</h4>
      <p className="text-xs text-on-surface-variant">{subtitle}</p>
    </div>
    <ChevronRight size={18} className="text-on-surface-variant/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </motion.button>
);
```

## File: src/components/ChatRoom.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, Car, Package, Briefcase, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

const SAMPLE_CHATS = [
  {
    id: '1',
    senderId: 'sarah',
    senderName: 'Sarah Logistics',
    senderAvatar: 'https://picsum.photos/seed/req2/100/100',
    content: "I'm at the pickup location. The package is ready!",
    timestamp: '10:24 AM',
    isMe: false
  },
  {
    id: '2',
    senderId: 'me',
    senderName: 'Me',
    senderAvatar: 'https://picsum.photos/seed/me/100/100',
    content: "Great, thanks Sarah. Please let me know when you're on your way.",
    timestamp: '10:25 AM',
    isMe: true
  },
  {
    id: '3',
    senderId: 'sarah',
    senderName: 'Sarah Logistics',
    senderAvatar: 'https://picsum.photos/seed/req2/100/100',
    content: "Heading to Midtown Square now. Estimated arrival in 12 minutes.",
    timestamp: '10:26 AM',
    isMe: false
  }
];

export const ChatRoom: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_CHATS);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      senderName: 'Me',
      senderAvatar: 'https://picsum.photos/seed/me/100/100',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center glass">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://picsum.photos/seed/req2/100/100" className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <h2 className="text-sm font-black text-on-surface tracking-tight">Sarah Logistics</h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active • Delivery Task</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 py-1 px-3 bg-white/5 rounded-full">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              {!msg.isMe && <img src={msg.senderAvatar} className="w-8 h-8 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />}
              <div className="space-y-1">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-on-surface border border-white/10 rounded-tl-none'}`}>
                  {msg.content}
                </div>
                <div className={`text-[9px] font-bold text-on-surface-variant/40 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 glass">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:scale-90 transition-all active:scale-90 shadow-lg shadow-primary/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
```

## File: src/components/CreateModal.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Briefcase, Send, DollarSign, Clock, Tag, ChevronRight, Sparkles, Car, Package, Zap, MapPin, Users } from 'lucide-react';

import { AIChatRequest } from './AIChatRequest';

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
      className={`fixed inset-0 z-[100] flex items-center justify-center ${isFullPage ? '' : 'p-6'} bg-black/90 backdrop-blur-xl`}
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
        <div className={`p-8 overflow-y-auto custom-scrollbar flex-grow ${isFullPage ? 'max-w-2xl mx-auto w-full' : ''}`}>
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
      <textarea 
        autoFocus
        placeholder="What's on your mind? Share your latest work..."
        className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none transition-colors resize-none"
      />
    </div>
    
    <div className="flex items-center gap-4">
      <button className="flex-grow py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95">
        <Send size={18} />
        Post Update
      </button>
    </div>
  </div>
);
```

## File: src/components/FeedItems.tsx
```typescript
import React from 'react';
import { 
  MoreHorizontal,
  BadgeCheck,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { IconButton, PostActions } from './PostActions';

// --- Shared Mock Data Utilities ---
export const MOCK_AUTHORS = [
  { name: 'Alice Smith', handle: 'alicesmith', avatar: 'https://picsum.photos/seed/alice/100/100', verified: false },
  { name: 'Bob Jones', handle: 'bobjones', avatar: 'https://picsum.photos/seed/bob/100/100', verified: true },
  { name: 'Charlie Day', handle: 'charlie_day', avatar: 'https://picsum.photos/seed/charlie/100/100', verified: false },
  { name: 'Diana Prince', handle: 'diana', avatar: 'https://picsum.photos/seed/diana/100/100', verified: true },
  { name: 'Evan Wright', handle: 'evanw', avatar: 'https://picsum.photos/seed/evan/100/100', verified: false },
];

const threadCache: Record<string, FeedItem[]> = {};

export const getReplies = (parentPost: FeedItem, contentTemplate: (i: number, depth: number) => string, maxDepth: number = 3, currentDepth: number = 0): FeedItem[] => {
  if (currentDepth > maxDepth) return [];
  const cacheKey = `${parentPost.id}-${currentDepth}`;
  if (threadCache[cacheKey]) return threadCache[cacheKey];

  const hash = parentPost.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numReplies = (hash % 3) + 1;
  
  const replies = Array.from({ length: numReplies }).map((_, i) => {
    const author = MOCK_AUTHORS[(hash + i) % MOCK_AUTHORS.length];
    return {
      id: `${parentPost.id}-r${i}`,
      type: 'social',
      author,
      content: contentTemplate(i, currentDepth),
      timestamp: `${(i + 1) * 2}h`,
      votes: (hash + i) % 100,
      replies: currentDepth < 2 ? (hash % 3) + 1 : 0,
      reposts: (hash + i) % 10,
      shares: (hash + i) % 5,
    } as FeedItem;
  });

  threadCache[cacheKey] = replies;
  return replies;
};

// --- Components ---

export const MediaCarousel: React.FC<{ images: string[], className?: string, aspect?: string }> = ({ images, className = "", aspect = "aspect-video" }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative group w-full ${className}`}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-xl border border-white/5 shadow-lg gap-2 px-0 scroll-smooth"
      >
        {images.map((img, idx) => (
          <div key={idx} className={`flex-shrink-0 ${images.length > 1 ? 'w-[92%] sm:w-[96%]' : 'w-full'} snap-center ${aspect} relative overflow-hidden`}>
            <img 
              src={img} 
              alt={`Content ${idx + 1}`} 
              className="w-full h-full object-cover rounded-xl" 
              referrerPolicy="no-referrer" 
            />
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
          {images.map((_, idx) => (
            <button 
              key={idx} 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    left: idx * scrollRef.current.offsetWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-1 h-1 rounded-full transition-all duration-300 pointer-events-auto ${
                idx === activeIndex ? 'bg-white w-2' : 'bg-white/40'
              }`} 
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <>
          {activeIndex > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) scrollRef.current.scrollTo({ left: (activeIndex - 1) * scrollRef.current.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) scrollRef.current.scrollTo({ left: (activeIndex + 1) * scrollRef.current.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </>
      )}
      
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white/90 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

// --- Types ---

export type PostType = 'social' | 'task' | 'editorial';

export interface Author {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  karma?: number;
}

export interface SocialPostData {
  id: string;
  type: 'social';
  author: Author;
  content: string;
  images?: string[];
  timestamp: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
  replyAvatars?: string[];
}

export interface TaskData {
  id: string;
  type: 'task';
  author: Author;
  category: string;
  title: string;
  description: string;
  price: string;
  timestamp: string;
  status?: string;
  icon: React.ReactNode;
  details?: string;
  tags?: string[];
  meta?: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
  mapUrl?: string;
  images?: string[];
  video?: string;
  voiceNote?: string;
}

export interface EditorialData {
  id: string;
  type: 'editorial';
  author: Author;
  tag: string;
  title: string;
  excerpt: string;
  timestamp: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
}

export type FeedItem = SocialPostData | TaskData | EditorialData;

// --- Abstracted Feed Card ---

const BaseFeedCard: React.FC<{
  data: FeedItem;
  onClick?: () => void;
  avatarContent?: React.ReactNode;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
}> = ({ data, onClick, avatarContent, headerMeta, children }) => (
  <article className="pt-2 px-4 card-depth group cursor-pointer" onClick={onClick}>
    <div className="flex gap-3">
      <div className="flex-shrink-0 flex flex-col items-center">
        {avatarContent || (
          <img src={data.author.avatar} alt={data.author.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 z-10" referrerPolicy="no-referrer" />
        )}
      </div>
      <div className="flex-grow pb-2">
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center gap-1.5">
            <span onClick={(e) => e.stopPropagation()} className="font-semibold text-[13px] text-on-surface hover:underline cursor-pointer">
              {data.author.handle}
            </span>
            {data.author.verified && <BadgeCheck size={12} className="text-primary fill-primary" />}
            {headerMeta}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-[12px] opacity-60">{data.timestamp}</span>
            <IconButton icon={MoreHorizontal} />
          </div>
        </div>
        {children}
        <div className="flex flex-col gap-1">
          <PostActions votes={data.votes} replies={data.replies} reposts={data.reposts} shares={data.shares} />
        </div>
      </div>
    </div>
  </article>
);

// --- Component Implementations ---

export const SocialPost: React.FC<{ data: SocialPostData, onClick?: () => void }> = ({ data, onClick }) => (
  <BaseFeedCard 
    data={data} 
    onClick={onClick}
    avatarContent={
      <>
        <img src={data.author.avatar} alt={data.author.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 z-10" referrerPolicy="no-referrer" />
        {data.replyAvatars && data.replyAvatars.length > 0 && (
          <>
            <div className="w-[1.5px] grow mt-1.5 mb-1 bg-white/10 rounded-full" />
            <div className="relative w-5 h-5 flex items-center justify-center mt-0.5 mb-1.5">
              {data.replyAvatars.map((av, i) => {
                const positions = ['left-0 top-0 w-3 h-3', 'right-0 top-0.5 w-2 h-2', 'left-0.5 bottom-0 w-1.5 h-1.5'];
                return <img key={i} src={av} className={`absolute rounded-full border border-background object-cover ${positions[i] || 'hidden'}`} style={{ zIndex: 3 - i }} referrerPolicy="no-referrer" />;
              })}
            </div>
          </>
        )}
      </>
    }
  >
    <p className="text-[13px] leading-relaxed text-on-surface/90 mb-2 whitespace-pre-wrap">
      {data.content}
    </p>
    {data.images && data.images.length > 0 && (
      <MediaCarousel images={data.images} className="mb-2" />
    )}
  </BaseFeedCard>
);

export const TaskCard: React.FC<{ data: TaskData, onClick?: () => void }> = ({ data, onClick }) => (
  <BaseFeedCard
    data={data}
    onClick={onClick}
    headerMeta={
      data.status && (
        <span className="bg-primary/20 text-primary text-[9px] px-1 py-0.5 rounded font-bold uppercase tracking-wider border border-primary/20">
          {data.status}
        </span>
      )
    }
    avatarContent={
      <>
        <img src={data.author.avatar} alt={data.author.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 z-10" referrerPolicy="no-referrer" />
        <div className="w-[1.5px] grow mt-1.5 mb-1 bg-white/10 rounded-full" />
        <div className="mt-0.5 mb-1.5 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 text-primary shadow-inner">
          <div className="scale-[0.6]">{data.icon}</div>
        </div>
      </>
    }
  >
    <div className="bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5">
      <div className="flex items-center justify-between mb-0.5">
        <div className="text-[9px] uppercase tracking-[0.1em] text-on-surface-variant/80 font-bold">{data.category}</div>
        <div className="text-primary font-bold text-[12px] tracking-tight">{data.price}</div>
      </div>
      <h3 className="font-bold text-[13px] text-on-surface mb-0.5">{data.title}</h3>
      <p className="text-[12px] text-on-surface-variant leading-relaxed line-clamp-1">
        {data.description}
      </p>
      
      {(data.mapUrl || (data.images && data.images.length > 0) || data.video || data.voiceNote) && (
        <div className="mt-2 flex flex-col gap-1.5">
          {data.mapUrl && (
            <div className="relative w-full h-20 rounded-lg overflow-hidden border border-white/10">
              <img src={data.mapUrl} alt="Map preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-1.5">
                <span className="text-[9px] font-bold text-on-surface flex items-center gap-1">
                  <MapPin size={9} className="text-primary" /> Route Map
                </span>
              </div>
            </div>
          )}
          {data.images && data.images.length > 0 && (
            <MediaCarousel images={data.images} aspect="aspect-[21/9]" className="rounded-lg overflow-hidden border border-white/10" />
          )}
        </div>
      )}
    </div>

    <div className="flex items-center justify-between mb-2">
      <div className="text-[11px] text-on-surface-variant/70 font-medium">
        {data.meta}
      </div>
      <button 
        onClick={(e) => e.stopPropagation()}
        className="bg-on-surface text-background font-bold text-[12px] px-3 py-1 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-sm"
      >
        {data.category === 'Repair Needed' ? 'Bid' : 'Claim'}
      </button>
    </div>
  </BaseFeedCard>
);

export const EditorialCard: React.FC<{ data: EditorialData, onClick?: () => void }> = ({ data, onClick }) => (
  <BaseFeedCard
    data={data}
    onClick={onClick}
    avatarContent={
      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shadow-inner z-10">
        <span className="text-[9px] font-bold text-on-surface-variant">DS</span>
      </div>
    }
  >
    <div className="bg-surface-container-low/50 p-2.5 rounded-lg border border-white/5 mb-2 shadow-inner mt-0.5">
      <div className="text-[9px] uppercase tracking-[0.12em] text-primary font-black mb-1.5">{data.tag}</div>
      <h2 className="font-bold text-[14px] text-on-surface leading-tight mb-1.5">{data.title}</h2>
      <p className="text-[12px] text-on-surface-variant line-clamp-2 leading-relaxed">
        {data.excerpt}
      </p>
    </div>
  </BaseFeedCard>
);
```

## File: src/components/GigMatcher.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'motion/react';
import { X, Check, MapPin, Clock, Zap, Car, Package, Palette, Code, FileText, Globe, ArrowRight, Star, ShieldCheck, Search } from 'lucide-react';

export interface Gig {
  id: string;
  title: string;
  type: 'ride' | 'delivery' | 'design' | 'dev' | 'writing';
  distance: string;
  time: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  meta?: string;
  tags: string[];
  clientName: string;
  clientRating: number;
}

import { MatchSuccess } from './MatchSuccess';

const GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Minimalist Brand Identity',
    type: 'design',
    distance: 'Remote',
    time: '3 days',
    price: '$850.00',
    description: 'Create a clean, luxury brand identity for a new boutique hotel. Includes logo, typography, and color palette. Must have experience with high-end hospitality brands.',
    icon: <Palette size={28} />,
    meta: 'Featured',
    tags: ['Branding', 'UI/UX', 'Luxury'],
    clientName: 'Aura Hotels',
    clientRating: 4.9
  },
  {
    id: 'g2',
    title: 'React Component Library',
    type: 'dev',
    distance: 'Remote',
    time: '1 week',
    price: '$1,200.00',
    description: 'Build a set of 15 reusable, accessible React components using Tailwind CSS and Framer Motion. Strict adherence to provided Figma designs required.',
    icon: <Code size={28} />,
    meta: 'Urgent',
    tags: ['React', 'TypeScript', 'Tailwind'],
    clientName: 'TechFlow Inc',
    clientRating: 5.0
  },
  {
    id: 'g3',
    title: 'Luxury Airport Transfer',
    type: 'ride',
    distance: '1.2 miles away',
    time: '15 min trip',
    price: '$45.00',
    description: 'Premium sedan requested for airport drop-off. Professional attire preferred. Meet at Terminal 3 departures level.',
    icon: <Car size={28} />,
    meta: 'High Priority',
    tags: ['Premium', 'VIP', 'Airport'],
    clientName: 'Michael Chen',
    clientRating: 4.8
  },
  {
    id: 'g4',
    title: 'Copywriting: Tech Blog',
    type: 'writing',
    distance: 'Remote',
    time: '2 days',
    price: '$300.00',
    description: 'Write 3 SEO-optimized blog posts about the future of AI in the gig economy. 800 words each. Tone should be authoritative yet accessible.',
    icon: <FileText size={28} />,
    meta: 'Verified',
    tags: ['SEO', 'Content', 'AI'],
    clientName: 'FutureWorks',
    clientRating: 4.7
  }
];

const GigCard: React.FC<{ 
  gig: Gig; 
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  index: number;
  swipeDirection: 'left' | 'right' | null;
}> = ({ gig, onSwipe, isTop, index, swipeDirection }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // Stamps opacity
  const checkOpacity = useTransform(x, [20, 100], [0, 1]);
  const xOpacity = useTransform(x, [-20, -100], [0, 1]);

  // Background card animation based on top card's drag
  const nextCardScale = useTransform(x, [-200, 0, 200], [1, 0.92, 1]);
  const nextCardY = useTransform(x, [-200, 0, 200], [0, 24, 0]);
  const nextCardOpacity = useTransform(x, [-200, 0, 200], [1, 0.6, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe('left');
    }
  };

  const getTypeLabel = (type: Gig['type']) => {
    switch (type) {
      case 'ride': return 'Ride Request';
      case 'delivery': return 'Delivery';
      case 'design': return 'Creative Design';
      case 'dev': return 'Development';
      case 'writing': return 'Copywriting';
      default: return 'Gig Task';
    }
  };

  const isNext = index === 1;

  const cardVariants: any = {
    initial: { 
      scale: 0.8, 
      opacity: 0, 
      y: 40 
    },
    animate: { 
      scale: isTop ? 1 : 0.92, 
      opacity: isTop ? 1 : 0.6, 
      y: isTop ? 0 : 24,
      zIndex: isTop ? 10 : 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: (custom: 'left' | 'right') => ({
      x: custom === 'right' ? 400 : -400,
      y: 50,
      opacity: 0,
      rotate: custom === 'right' ? 15 : -15,
      transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
    })
  };

  return (
    <motion.div
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0,
        scale: isNext ? nextCardScale : undefined,
        y: isNext ? nextCardY : undefined,
        opacity: isNext ? nextCardOpacity : undefined,
        transformOrigin: 'bottom center'
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={swipeDirection}
      className={`absolute inset-0 bg-[#0A0A0A] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 flex flex-col ${isTop ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'}`}
    >
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      
      {/* Overlay Indicators */}
      {isTop && (
        <>
          <motion.div style={{ opacity: checkOpacity }} className="absolute top-10 left-8 z-20 pointer-events-none">
            <div className="border-4 border-emerald-500 text-emerald-500 px-6 py-2 rounded-2xl font-black text-4xl uppercase -rotate-12 tracking-widest bg-black/40 backdrop-blur-sm">
              ACCEPT
            </div>
          </motion.div>
          <motion.div style={{ opacity: xOpacity }} className="absolute top-10 right-8 z-20 pointer-events-none">
            <div className="border-4 border-red-500 text-red-500 px-6 py-2 rounded-2xl font-black text-4xl uppercase rotate-12 tracking-widest bg-black/40 backdrop-blur-sm">
              PASS
            </div>
          </motion.div>
        </>
      )}

      <div className="p-5 sm:p-8 flex-grow flex flex-col pointer-events-none relative z-10 min-h-0">
        <div className="flex-grow flex flex-col overflow-y-auto hide-scrollbar pb-4 min-h-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner backdrop-blur-md">
              {gig.icon}
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter">{gig.price}</div>
              {gig.meta && (
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold">
                  <Zap size={10} className="fill-primary" />
                  {gig.meta}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/50 font-black">
                {getTypeLabel(gig.type)}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-wider">
                <ShieldCheck size={12} className="text-emerald-500" />
                {gig.clientName}
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-[1.1] mb-4 shrink-0">{gig.title}</h2>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 shrink-0">
              <div className="bg-white/[0.03] p-3 sm:p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/40 mb-1.5 sm:mb-2">
                  {gig.distance === 'Remote' ? <Globe size={12} /> : <MapPin size={12} />}
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Location</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white tracking-wide">{gig.distance}</div>
              </div>
              <div className="bg-white/[0.03] p-3 sm:p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/40 mb-1.5 sm:mb-2">
                  <Clock size={12} />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Timeline</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white tracking-wide">{gig.time}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 shrink-0">
              {gig.tags.map(tag => (
                <span key={tag} className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-1.5 sm:space-y-2 mt-auto shrink-0">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">Project Brief</div>
              <p className="text-[12px] sm:text-[14px] text-white/70 leading-relaxed font-medium">
                {gig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-2 pt-2 border-t border-white/5 pointer-events-auto shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onSwipe('left'); }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all active:scale-90 shadow-xl"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onSwipe('right'); }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 flex items-center justify-center text-black hover:bg-emerald-400 transition-all active:scale-90 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <Check size={28} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};



export const GigMatcher: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [matchedGig, setMatchedGig] = useState<Gig | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      setTimeout(() => {
        setMatchedGig(GIGS[currentIndex]);
      }, 300);
    } else {
      setTimeout(() => {
        if (currentIndex < GIGS.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSwipeDirection(null);
        } else {
          onClose();
        }
      }, 300);
    }
  };

  const handleContinue = () => {
    setMatchedGig(null);
    setSwipeDirection(null);
    if (currentIndex < GIGS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  // Calculate which cards to show
  const visibleGigs = GIGS.map((gig, index) => {
    if (index < currentIndex) return null; // Already swiped
    if (index > currentIndex + 1) return null; // Too far down the stack
    return { gig, index };
  }).filter(Boolean) as { gig: Gig, index: number }[];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-xl"
      >
        <div className="relative w-full max-w-md h-[85dvh] max-h-[800px] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-2 mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap size={16} className="text-primary fill-primary" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-white">Gig Radar</span>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Card Stack Area */}
          <div className="relative w-full flex-grow">
            {visibleGigs.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {!matchedGig && visibleGigs.reverse().map(({ gig, index }) => {
                  const isTop = index === currentIndex;
                  return (
                    <GigCard 
                      key={gig.id}
                      gig={gig}
                      onSwipe={handleSwipe}
                      isTop={isTop}
                      index={index - currentIndex}
                      swipeDirection={isTop ? swipeDirection : null}
                    />
                  );
                })}
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Search size={32} className="text-white/20" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">No more gigs</h3>
                <p className="text-white/50">Check back later for new opportunities in your area.</p>
                <button 
                  onClick={onClose}
                  className="mt-8 px-8 py-3 bg-white/10 rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-colors"
                >
                  Return Home
                </button>
              </div>
            )}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-6 shrink-0">
            {GIGS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex ? 'w-8 bg-white' : 
                  i < currentIndex ? 'w-2 bg-white/30' : 'w-2 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {matchedGig && (
          <MatchSuccess 
            gig={matchedGig} 
            onContinue={handleContinue} 
            onClose={onClose} 
          />
        )}
      </AnimatePresence>
    </>
  );
};
```

## File: src/components/MatchSuccess.tsx
```typescript
import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock, Globe, MessageCircle, Sparkles } from 'lucide-react';
import { Gig } from './GigMatcher';

interface MatchSuccessProps {
  gig: Gig;
  onContinue: () => void;
  onClose: () => void;
}

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: '100vh',
            x: `${Math.random() * 100}vw`,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0
          }}
          animate={{
            y: '-10vh',
            opacity: [0, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
          className="absolute w-1.5 h-1.5 bg-emerald-500/40 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

export const MatchSuccess: React.FC<MatchSuccessProps> = ({ gig, onContinue, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto hide-scrollbar"
    >
      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(16,185,129,0.15),_transparent_60%)] pointer-events-none" />
      
      <Particles />

      <div className="w-full max-w-md min-h-full flex flex-col py-8 relative z-10">
        <div className="flex-grow shrink-0" />
        
        <div className="text-center mb-8 sm:mb-12 shrink-0">
          <div className="relative flex items-center justify-center mb-8 sm:mb-10 w-32 h-32 mx-auto">
            {/* Radar Rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: [0, 0.3, 0] }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  delay: i * 0.8,
                  ease: "easeOut"
                }}
                className="absolute inset-0 rounded-full border border-emerald-500/50"
              />
            ))}
            
            {/* Main Circle */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 200 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-zinc-950 shadow-[0_0_80px_rgba(16,185,129,0.5)] z-10"
            >
              <Check size={48} className="sm:w-14 sm:h-14" strokeWidth={3.5} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", damping: 20 }}
          >
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-3 sm:mb-4 uppercase">
              It's a <span className="text-emerald-400">Match!</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg font-medium flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              You've secured this project.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 20 }}
          className="w-full bg-white/[0.03] rounded-[32px] p-6 sm:p-8 border border-white/10 mb-8 sm:mb-12 backdrop-blur-xl shrink-0 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle top shine */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
          
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-white/10 rounded-2xl text-white shadow-inner border border-white/5">
              {gig.icon}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">{gig.price}</div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">{gig.title}</h3>
          
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/50 font-bold uppercase tracking-widest bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500/70" /> {gig.time}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5"><Globe size={14} className="text-emerald-500/70" /> {gig.distance}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", damping: 20 }}
          className="space-y-4 mt-auto shrink-0 w-full"
        >
          <button className="w-full py-5 bg-emerald-500 text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-sm sm:text-base shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            Message {gig.clientName} <MessageCircle size={20} className="fill-zinc-950/20" />
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onContinue}
              className="py-4 bg-white/5 text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Keep Swiping
            </button>
            <button 
              onClick={onClose}
              className="py-4 bg-white/5 text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
        
        <div className="flex-grow shrink-0" />
      </div>
    </motion.div>
  );
};
```

## File: src/components/PostActions.tsx
```typescript
import React from 'react';
import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react';

export const IconButton = ({ 
  icon: Icon, 
  count, 
  active, 
  onClick, 
  className = "",
  activeColor = "text-primary",
  hoverBg = "hover:bg-white/10"
}: { 
  icon: any, 
  count?: number, 
  active?: boolean, 
  onClick?: () => void, 
  className?: string,
  activeColor?: string,
  hoverBg?: string
}) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`flex items-center gap-1 p-1.5 -ml-1.5 rounded-full transition-all duration-200 active:scale-90 group ${hoverBg} ${className} ${active ? activeColor : 'text-on-surface-variant hover:text-on-surface'}`}
  >
    <Icon 
      size={16} 
      strokeWidth={active ? 2.5 : 2}
      className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'fill-current' : ''}`} 
    />
    {count !== undefined && count > 0 && (
      <span className="text-[12px] font-medium tracking-tight">
        {count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}
      </span>
    )}
  </button>
);

export const PostActions = ({ 
  votes, 
  replies, 
  reposts, 
  shares,
  className = "" 
}: { 
  votes: number, 
  replies: number, 
  reposts: number, 
  shares: number,
  className?: string
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isReposted, setIsReposted] = React.useState(false);
  
  return (
    <div className={`flex items-center gap-0.5 sm:gap-2 ${className}`}>
      <IconButton 
        icon={Heart} 
        count={votes + (isLiked ? 1 : 0)} 
        active={isLiked}
        onClick={() => setIsLiked(!isLiked)}
        hoverBg="hover:bg-red-500/10" 
        activeColor="text-red-500" 
      />
      <IconButton 
        icon={MessageCircle} 
        count={replies} 
        hoverBg="hover:bg-blue-500/10" 
        activeColor="text-blue-500" 
      />
      <IconButton 
        icon={Repeat2} 
        count={reposts + (isReposted ? 1 : 0)} 
        active={isReposted} 
        onClick={() => setIsReposted(!isReposted)}
        hoverBg="hover:bg-emerald-500/10" 
        activeColor="text-emerald-500" 
      />
      <IconButton 
        icon={Send} 
        count={shares} 
        hoverBg="hover:bg-purple-500/10" 
        activeColor="text-purple-500" 
      />
    </div>
  );
};
```

## File: src/components/SharedUI.tsx
```typescript
import React from 'react';
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
```

## File: src/App.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  Heart, 
  User, 
  Settings,
  Package,
  Wrench,
  ShoppingBasket,
  MessageCircle,
  Sparkles, 
  Check, 
  ArrowLeft,
  Loader2,
  RefreshCw,
  Car,
  Dog,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { 
  SocialPost, 
  TaskCard, 
  EditorialCard, 
  FeedItem 
} from './components/FeedItems';
import { GigMatcher } from './components/GigMatcher';
import { CreateModal } from './components/CreateModal';
import { ChatRoom } from './components/ChatRoom';
import { AIChatRequest } from './components/AIChatRequest';
import { ReviewOrder } from './pages/ReviewOrder';
import { PaymentPage } from './pages/PaymentPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import Markdown from 'react-markdown';

const SAMPLE_DATA: FeedItem[] = [
  {
    id: '1',
    type: 'social',
    author: {
      name: 'John Doe',
      handle: 'johndoe',
      avatar: 'https://picsum.photos/seed/john/100/100',
      verified: true,
      karma: 15420
    },
    content: "The architecture in this city is absolutely breathtaking. Minimalism is not the lack of something, it's the perfect amount of something. 🏛️",
    images: [
      'https://picsum.photos/seed/arch1/800/800',
      'https://picsum.photos/seed/arch2/800/800',
      'https://picsum.photos/seed/arch3/800/800'
    ],
    timestamp: '4h',
    replies: 42,
    reposts: 12,
    shares: 5,
    votes: 1200,
    replyAvatars: ['https://picsum.photos/seed/r1/50/50', 'https://picsum.photos/seed/r2/50/50']
  },
  {
    id: '2',
    type: 'task',
    author: {
      name: 'Sarah Logistics',
      handle: 'sarah_logistics',
      avatar: 'https://picsum.photos/seed/req2/100/100',
      karma: 842
    },
    category: 'Local Courier Task',
    status: 'ACTIVE',
    title: 'Deliver Electronics Package',
    description: 'Pick up from Downtown Hub → Drop off at Midtown Square (2.4 miles)',
    price: '$18.50',
    timestamp: 'Now',
    icon: <Package size={18} />,
    meta: '3 people looking at this',
    replies: 12,
    reposts: 3,
    shares: 1,
    votes: 85,
    mapUrl: 'https://picsum.photos/seed/map1/800/400'
  },
  {
    id: '3',
    type: 'social',
    author: {
      name: 'Elena Vision',
      handle: 'elena_vision',
      avatar: 'https://picsum.photos/seed/elena/100/100',
      karma: 42100
    },
    content: "Captured this during my morning walk. Light and shadow playing their eternal game.",
    images: [
      'https://picsum.photos/seed/cactus/800/450', 
      'https://picsum.photos/seed/desert/800/450',
      'https://picsum.photos/seed/sky/800/450',
      'https://picsum.photos/seed/mountain/800/450',
      'https://picsum.photos/seed/river/800/450'
    ],
    timestamp: '6h',
    replies: 128,
    reposts: 45,
    shares: 22,
    votes: 3400,
    replyAvatars: ['https://picsum.photos/seed/r3/50/50']
  },
  {
    id: '4',
    type: 'task',
    author: {
      name: 'Mike Miller',
      handle: 'mike_miller',
      avatar: 'https://picsum.photos/seed/req1/100/100',
      karma: 125
    },
    category: 'Repair Needed',
    title: 'Kitchen Shelf Installation',
    description: 'Looking for someone with a drill and level to hang 3 floating shelves. Estimated 2 hours. Tools required.',
    price: '$45.00/hr',
    timestamp: '12m',
    icon: <Wrench size={18} />,
    tags: ['Tools: No', 'East Side'],
    meta: 'JD and 2 others bid',
    replies: 5,
    reposts: 0,
    shares: 2,
    votes: 24,
    images: [
      'https://picsum.photos/seed/shelf/800/600', 
      'https://picsum.photos/seed/tools/800/600',
      'https://picsum.photos/seed/kitchen/800/600'
    ]
  },
  {
    id: '5',
    type: 'task',
    author: {
      name: 'Grocery Express',
      handle: 'grocery_express',
      avatar: 'https://picsum.photos/seed/req3/100/100',
      karma: 3200
    },
    category: 'Grocery Run',
    title: 'Express Shop (12 items)',
    description: 'Whole Foods Market → Delivery at The Heights Apartments.',
    price: '$22.00 + Tip',
    timestamp: '45m',
    icon: <ShoppingBasket size={18} />,
    meta: 'Earn $28.50 estimated total',
    replies: 8,
    reposts: 1,
    shares: 4,
    votes: 42
  },
  {
    id: '6',
    type: 'editorial',
    author: {
      name: 'Design Studio',
      handle: 'design_studio',
      avatar: 'https://picsum.photos/seed/ds/100/100',
      karma: 89000
    },
    tag: "EDITOR'S CHOICE",
    title: 'Reclaiming the Grid: A New Perspective on Layouts',
    excerpt: 'Exploring how asymmetric grids are redefining digital publication standards in the late 2020s...',
    timestamp: '12h',
    replies: 18,
    reposts: 7,
    shares: 3,
    votes: 95
  },
  {
    id: '7',
    type: 'task',
    author: {
      name: 'Alex Rider',
      handle: 'alex_rider',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      karma: 560
    },
    category: 'Ride Hail',
    title: 'Ride to Airport (SFO)',
    description: 'Need a ride to SFO from Downtown. 2 passengers, 2 large bags. Flight is at 4 PM, need to leave by 1 PM.',
    price: '$45.00',
    timestamp: '2h',
    icon: <Car size={18} />,
    tags: ['Airport', 'Luggage'],
    meta: '2 drivers available nearby',
    replies: 3,
    reposts: 0,
    shares: 1,
    votes: 12,
    mapUrl: 'https://picsum.photos/seed/map2/800/400'
  },
  {
    id: '8',
    type: 'task',
    author: {
      name: 'Pet Lovers',
      handle: 'pet_lovers',
      avatar: 'https://picsum.photos/seed/pets/100/100',
      karma: 1200
    },
    category: 'Pet Sitting',
    title: 'Dog Walking for Max',
    description: 'Need someone to walk my golden retriever, Max, for 30 mins around the park. He is very friendly!',
    price: '$20.00',
    timestamp: '3h',
    icon: <Dog size={18} />,
    tags: ['Dog', 'Walking'],
    meta: '1 person interested',
    replies: 2,
    reposts: 0,
    shares: 0,
    votes: 18,
    video: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: '9',
    type: 'task',
    author: {
      name: 'Event Snaps',
      handle: 'event_snaps',
      avatar: 'https://picsum.photos/seed/camera/100/100',
      karma: 450
    },
    category: 'Photography',
    title: 'Birthday Party Photographer',
    description: 'Looking for a photographer for a 5th birthday party. 2 hours. Just need raw photos, no editing required.',
    price: '$100.00',
    timestamp: '5h',
    icon: <Camera size={18} />,
    tags: ['Event', 'Photography'],
    meta: '4 photographers bid',
    replies: 6,
    reposts: 1,
    shares: 2,
    votes: 30,
    voiceNote: 'https://www.w3schools.com/html/horse.mp3'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'for-you' | 'around-you'>('for-you');
  const [activeNav, setActiveNav] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [showMatcher, setShowMatcher] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [orderToReview, setOrderToReview] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<FeedItem | null>(null);
  
  // Pull to refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = React.useRef(0);

  const { scrollY } = useScroll();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current > 0 && !isRefreshing) {
      const y = e.touches[0].clientY;
      const distance = y - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.4, 120));
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (pullDistance > 80 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(60);
      
      // Simulate network request
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 2000);
    } else if (!isRefreshing) {
      setPullDistance(0);
    }
    startY.current = 0;
  };

  useEffect(() => {
    // Global handler for AI requests from CreateModal
    (window as any).onAIRequestComplete = (data: any) => {
      setOrderToReview(data);
      setActiveNav('review-order');
    };

    // Global handler for opening Create Post page
    (window as any).openCreatePost = () => {
      setActiveNav('create-post');
    };
  }, []);

  const renderContent = () => {
    switch (activeNav) {
      case 'home':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {SAMPLE_DATA.map((item) => {
                if (item.type === 'social') return <SocialPost key={item.id} data={item} onClick={() => setSelectedPost(item)} />;
                if (item.type === 'task') return <TaskCard key={item.id} data={item} onClick={() => setSelectedPost(item)} />;
                if (item.type === 'editorial') return <EditorialCard key={item.id} data={item} onClick={() => setSelectedPost(item)} />;
                return null;
              })}
            </motion.div>
          </AnimatePresence>
        );
      case 'review-order':
        return (
          <ReviewOrder 
            order={orderToReview} 
            onBack={() => setActiveNav('home')}
            onProceed={() => setActiveNav('payment')}
          />
        );
      case 'payment':
        return (
          <PaymentPage 
            order={orderToReview} 
            onBack={() => setActiveNav('review-order')}
            onSuccess={() => {
              setActiveNav('home');
              setOrderToReview(null);
            }}
          />
        );
      case 'create-post':
        return (
          <CreatePostPage 
            onBack={() => setActiveNav('home')}
            onPost={(threads) => {
              console.log('Posting threads:', threads);
              setActiveNav('home');
            }}
          />
        );
      case 'explore':
        return <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Explore View</div>;
      case 'messages':
        return <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Messages View</div>;
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-xl mb-4">
                <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Your Name</h2>
              <p className="text-on-surface-variant text-sm mb-4">@your_handle</p>
              
              <div className="flex items-center gap-6 bg-surface-container-low border border-white/5 rounded-2xl px-8 py-4 shadow-inner">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-on-surface">128</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Posts</span>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-on-surface">1.2k</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Followers</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant border-b border-white/5 pb-2 mb-4">Recent Activity</h3>
              <div className="p-10 text-center text-on-surface-variant text-xs font-medium opacity-50 border border-white/5 rounded-xl border-dashed">
                No recent activity to show.
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMatcher(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <div className="min-h-screen bg-transparent text-on-surface flex flex-col max-w-2xl mx-auto border-x border-white/5 shadow-2xl">
      {/* Header */}
      {activeNav === 'home' && (
        <motion.header 
          variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
          }}
          animate={isVisible ? "visible" : "hidden"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/5"
        >
          <div className="flex justify-between items-center px-4 h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-primary font-black italic text-lg tracking-tighter">@</span>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('for-you')}
                className={`text-sm font-semibold transition-colors relative py-1 ${activeTab === 'for-you' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface/80'}`}
              >
                For you
                {activeTab === 'for-you' && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" 
                  />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('around-you')}
                className={`text-sm font-semibold transition-colors relative py-1 ${activeTab === 'around-you' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface/80'}`}
              >
                Around you
                {activeTab === 'around-you' && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" 
                  />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 shadow-inner">
                <Heart size={14} className="text-red-500 fill-red-500" />
                <span className="text-xs font-bold text-on-surface">4.2k</span>
              </div>
              <button 
                onClick={() => setActiveNav('profile')}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white/30 transition-colors shadow-sm"
              >
                <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Feed */}
      <main 
        className="flex-grow pb-20 relative overflow-x-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to refresh indicator */}
        <div className="absolute top-0 left-0 right-0 flex justify-center items-start z-40 pointer-events-none">
          <motion.div
            initial={false}
            animate={{ 
              y: isRefreshing ? 20 : Math.max(0, pullDistance - 20),
              opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
              scale: isRefreshing ? 1 : Math.min(pullDistance / 80, 1)
            }}
            transition={{ 
              type: isDragging ? "tween" : "spring",
              duration: isDragging ? 0 : undefined,
              stiffness: 300, 
              damping: 20 
            }}
            className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 shadow-xl flex items-center justify-center text-primary mt-4"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
              transition={{ 
                rotate: isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }
              }}
            >
              {isRefreshing ? <Loader2 size={20} /> : <RefreshCw size={20} />}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: isRefreshing ? 60 : pullDistance }}
          transition={{ 
            type: isDragging ? "tween" : "spring",
            duration: isDragging ? 0 : undefined,
            stiffness: 300, 
            damping: 20 
          }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      {activeNav !== 'review-order' && activeNav !== 'payment' && activeNav !== 'create-post' && (
        <motion.nav 
          variants={{
            visible: { y: 0 },
            hidden: { y: "100%" },
          }}
          animate={isVisible ? "visible" : "hidden"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed bottom-0 w-full max-w-2xl z-50 h-16 glass flex justify-around items-center px-4"
        >
          <NavItem 
            icon={Home} 
            label="Home" 
            active={activeNav === 'home'} 
            onClick={() => setActiveNav('home')} 
          />
          <NavItem 
            icon={Search} 
            label="Explore" 
            active={activeNav === 'explore'} 
            onClick={() => setActiveNav('explore')} 
          />
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground rounded-xl p-2.5 flex items-center justify-center hover:scale-110 transition-transform active:scale-90 shadow-xl shadow-black/40"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
          <NavItem 
            icon={MessageCircle} 
            label="Messages" 
            active={activeNav === 'messages'} 
            onClick={() => {
              setActiveNav('messages');
              setShowChatRoom(true);
            }} 
          />
          <NavItem 
            icon={User} 
            label="Profile" 
            active={activeNav === 'profile'} 
            onClick={() => setActiveNav('profile')} 
          />
        </motion.nav>
      )}

      <AnimatePresence>
        {showMatcher && activeNav === 'home' && <GigMatcher onClose={() => setShowMatcher(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && <CreateModal onClose={() => setShowCreateModal(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showChatRoom && <ChatRoom onClose={() => setShowChatRoom(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          selectedPost.type === 'task' ? (
            <TaskDetailPage 
              task={selectedPost as any} 
              onBack={() => setSelectedPost(null)} 
            />
          ) : (
            <PostDetailPage 
              post={selectedPost} 
              onBack={() => setSelectedPost(null)} 
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-90 ${active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} fill={active ? "currentColor" : "none"} className={active ? "fill-primary/20" : ""} />
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
```

## File: src/index.css
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  
  --color-background: #000000;
  --color-surface: #050505;
  --color-surface-container: #0D0D0D;
  --color-surface-container-low: #121212;
  --color-surface-container-lowest: #161616;
  --color-surface-container-high: #1F1F1F;
  --color-surface-container-highest: #2D2D2D;
  
  --color-on-surface: #FFFFFF;
  --color-on-surface-variant: #A1A1AA;
  --color-outline-variant: #27272A;
  
  --color-primary: #DC2626;
  --color-primary-foreground: #FFFFFF;

  --shadow-glow: 0 0 20px rgba(255, 255, 255, 0.03);
  --shadow-inner-glow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

@layer base {
  body {
    @apply bg-background text-on-surface font-sans antialiased selection:bg-white/10;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-image: radial-gradient(circle at 50% -20%, #0A0A0A 0%, #000000 100%);
    background-attachment: fixed;
    overscroll-behavior-y: none;
  }
}

.glass {
  @apply bg-surface-container/60 backdrop-blur-xl border border-white/5 shadow-inner-glow;
}

.card-depth {
  @apply transition-all duration-300 hover:bg-surface-container-low/40 hover:shadow-glow hover:-translate-y-0.5 border-b border-white/5;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

## File: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## File: .env.example
```
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
```

## File: .gitignore
```
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

# relay state
/.relay/
```

## File: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Google AI Studio App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/typography": "^0.5.19",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-markdown": "^10.1.0",
    "vite": "^6.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

## File: README.md
```markdown
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ce92c9c4-979d-487e-9c15-201644760344

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
```

## File: relay.config.json
```json
{
  "$schema": "https://relay.noca.pro/schema.json",
  "projectId": "react-example",
  "core": {
    "logLevel": "info",
    "enableNotifications": false,
    "watchConfig": false
  },
  "watcher": {
    "clipboardPollInterval": 2000,
    "preferredStrategy": "auto",
    "enableBulkProcessing": false,
    "bulkSize": 5,
    "bulkTimeout": 30000
  },
  "patch": {
    "approvalMode": "manual",
    "approvalOnErrorCount": 0,
    "linter": "",
    "preCommand": "",
    "postCommand": "",
    "minFileChanges": 0
  },
  "git": {
    "autoGitBranch": false,
    "gitBranchPrefix": "relay/",
    "gitBranchTemplate": "gitCommitMsg"
  }
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

## File: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
```
