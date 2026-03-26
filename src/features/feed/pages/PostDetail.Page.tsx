import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown, ArrowLeft, Sparkles, MessageSquareDashed, Maximize2 } from 'lucide-react';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide, AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { FeedItem, SocialPostData, TaskData, CreationContext } from '@/src/shared/types/domain.type';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { useStore } from '@/src/store/main.store';
import { CreatePostPage } from './CreatePost.Page';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const feedItems = useStore(state => state.feedItems);
  const repliesMap = useStore(state => state.replies);
  const setReplies = useStore(state => state.setReplies);
  const addReply = useStore(state => state.addReply);
  const updateReply = useStore(state => state.updateReply);
  const setCreationContext = useStore(state => state.setCreationContext);

  const initialPost = location.state?.post || feedItems.find(p => p.id === id);
  const threadContext = location.state?.thread || [];

  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreenReply, setIsFullscreenReply] = useState(false);

  const currentPost = postStack.length > 0 ? postStack[postStack.length - 1] : initialPost;
  const localReplies = currentPost ? (repliesMap[currentPost.id] || []) : [];

  const taskPriceString = currentPost?.type === 'task' ? (currentPost as TaskData).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const isCreator = currentPost?.author.handle === currentUser.handle;

  const handleAcceptBid = (bidId: string) => {
    if (!currentPost) return;
    updateReply<SocialPostData>(currentPost.id, bidId, { bidStatus: 'accepted' });
  };

  React.useEffect(() => {
    if (initialPost) setPostStack([initialPost]);
  }, [initialPost]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (currentPost && !repliesMap[currentPost.id]) {
      const generated = getReplies(currentPost, (i) => `Simulated insight #${i+1} for @${currentPost.author.handle}`);
      setReplies(currentPost.id, generated);
    }
  }, [currentPost?.id, initialPost, repliesMap, setReplies]);

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
      if (!currentPost) return;
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
      addReply(currentPost.id, newBid);
      if (scrollRef.current) {
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
      }
    }
  };

  const handleBidSubmit = () => {
    if (!currentPost) return;
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
    addReply(currentPost.id, newBid);
    setIsBidding(false);
    setReplyText('');
    setBidAmount(defaultBid);
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  const handleFullscreenReply = (threads?: ThreadBlock[]) => {
    if (!currentPost) return;
    const context: CreationContext = {
      parentId: currentPost.id,
      type: currentPost.type as 'social' | 'task' | 'editorial',
      authorHandle: currentPost.author.handle,
      content: currentPost.type === 'social' ? (currentPost as SocialPostData).content : (currentPost as TaskData).description || '',
      avatarUrl: currentPost.author.avatar,
      taskTitle: currentPost.type === 'task' ? (currentPost as TaskData).title : undefined,
      taskPrice: currentPost.type === 'task' ? (currentPost as TaskData).price : undefined
    };
    setCreationContext(context);
    setIsFullscreenReply(true);
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
            <FeedItemRenderer
              data={currentPost}
              isMain={true}
              hasLineBelow={localReplies.length > 0}
            />
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
          <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
            <AutoResizeTextarea
              id="task-reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-transparent border-none py-3 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
              minHeight={44}
              maxHeight={120}
              rows={1}
            />
            <button onClick={() => handleFullscreenReply()} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
              <Maximize2 size={18} />
            </button>
          </div>
          {replyText.trim() ? (
            <Button
              onClick={() => {
                if (!currentPost) return;
                const newReply: FeedItem = {
                  id: Math.random().toString(),
                  type: 'social',
                  author: currentUser,
                  content: replyText,
                  timestamp: 'Just now',
                  replies: 0, reposts: 0, shares: 0, votes: 0
                };
                addReply(currentPost.id, newReply);
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
          onExpand={handleFullscreenReply}
          onSubmit={() => {
            if (!currentPost) return;
            const newReply: FeedItem = {
              id: Math.random().toString(),
              type: 'social',
              author: currentUser,
              content: replyText,
              timestamp: 'Just now',
              replies: 0, reposts: 0, shares: 0, votes: 0
            };
            addReply(currentPost.id, newReply);
            setReplyText('');
            if (scrollRef.current) {
              setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
            }
          }}
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

      <AnimatePresence>
        {isFullscreenReply && (
          <CreatePostPage />
        )}
      </AnimatePresence>
    </PageSlide>
  );
};