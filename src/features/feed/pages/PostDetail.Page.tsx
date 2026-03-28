import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { X, Send, Minus, Plus, TrendingDown, ArrowLeft, Sparkles, MessageSquareDashed, Maximize2, Check, CheckCircle2, Camera, Star } from 'lucide-react';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide, AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { FeedItem, SocialPostData, TaskData, CreationContext } from '@/src/shared/types/domain.type';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { useStore } from '@/src/store/main.store';
import { CreatePostPage } from './CreatePost.Page';
import { TASK_STATUS, TaskStatus } from '@/src/shared/constants/domain.constant';

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
  const updateFeedItem = useStore(state => state.updateFeedItem);
  const setCreationContext = useStore(state => state.setCreationContext);

  const initialPost = location.state?.post || feedItems.find(p => p.id === id);
  const threadContext = location.state?.thread || [];

  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreenReply, setIsFullscreenReply] = useState(false);

  const { scrollY } = useScroll({ container: scrollRef });
  const headerOpacity = useTransform(scrollY, [20, 80], [0, 1]);
  const headerBg = useMotionTemplate`rgba(0, 0, 0, ${headerOpacity})`;
  
  // Parallax for the hero background
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const heroScale = useTransform(scrollY, [-100, 0], [1.2, 1]);

  const currentPost = postStack.length > 0 ? postStack[postStack.length - 1] : initialPost;
  const localReplies = currentPost ? (repliesMap[currentPost.id] || []) : [];

  const taskPriceString = currentPost?.type === 'task' ? (currentPost as TaskData).price : '$50';
  const defaultBid = parseInt(taskPriceString.split('-')[0].replace(/[^0-9]/g, '')) || 50;
  const isNegotiable = taskPriceString.includes('-');

  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(defaultBid);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [completionNotes, setCompletionNotes] = useState('');

  const isCreator = currentPost?.author.handle === currentUser.handle;

  const handleAcceptBid = (bid: SocialPostData) => {
    if (!currentPost) return;
    updateReply<SocialPostData>(currentPost.id, bid.id, { bidStatus: 'accepted' });
    if (updateFeedItem) {
      updateFeedItem<TaskData>(currentPost.id, {
        taskStatus: TASK_STATUS.ASSIGNED,
        assignedWorker: bid.author,
        acceptedBidAmount: bid.bidAmount
      });
    }
  };

  const handleStartTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.IN_PROGRESS });
  };

  const handleCompleteTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.COMPLETED });
    setShowCompleteModal(false);
  };

  const handleReviewTask = () => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { taskStatus: TASK_STATUS.FINISHED });
    setShowReviewModal(false);
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
      if (updateFeedItem) {
        updateFeedItem<TaskData>(currentPost.id, {
          taskStatus: TASK_STATUS.ASSIGNED,
          assignedWorker: currentUser,
          acceptedBidAmount: taskPriceString
        });
      }
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
        className="!bg-transparent !border-transparent transition-colors backdrop-blur-md"
        style={{ backgroundColor: headerBg }}
        titleOpacity={headerOpacity}
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24 -mt-16 pt-16 relative">
        {currentPost.type === 'task' && (
           <motion.div 
             className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-surface-container-high pointer-events-none origin-top" 
             style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
           >
              <div className="absolute inset-0 bg-background/50 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
           </motion.div>
        )}
        
        <div className="pt-2 relative z-10">
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
                // The FeedItemRenderer handles its own internal "Accept" button for bids
                // which prevents overlapping with the triple-dot actions menu.
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
        (() => {
          const tData = currentPost as TaskData;
          const tStatus = tData.taskStatus || TASK_STATUS.OPEN;
          const isAssignedToMe = tData.assignedWorker?.handle === currentUser.handle;

          let ActionUI = null;
          if (isCreator) {
            if (tStatus === TASK_STATUS.OPEN) ActionUI = <div className="text-[11px] font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Waiting for bids...</div>;
            else if (tStatus === TASK_STATUS.ASSIGNED) ActionUI = <div className="text-[11px] font-black text-emerald-400 w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><CheckCircle2 size={14}/> Awaiting Worker to Start</div>;
            else if (tStatus === TASK_STATUS.IN_PROGRESS) ActionUI = <div className="text-[11px] font-black text-emerald-400 w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><Sparkles size={14}/> Task in Progress</div>;
            else if (tStatus === TASK_STATUS.COMPLETED) ActionUI = <Button fullWidth onClick={() => setShowReviewModal(true)} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-400 text-black">Review & Release Payment</Button>;
            else if (tStatus === TASK_STATUS.FINISHED) ActionUI = <div className="text-[11px] font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
          } else {
            if (tStatus === TASK_STATUS.OPEN) {
              ActionUI = (
                <div className="flex gap-2 w-full">
                  {!isNegotiable ? (
                    <>
                      <Button variant="ghost" onClick={() => handleAction('bid')} className="flex-1">Bid</Button>
                      <Button onClick={() => handleAction('accept')} className="flex-1 shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Accept Instantly</Button>
                    </>
                  ) : (
                    <Button onClick={() => handleAction('bid')} fullWidth className="shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Submit Bid</Button>
                  )}
                </div>
              );
            }
            else if (tStatus === TASK_STATUS.ASSIGNED) {
              if (isAssignedToMe) ActionUI = <Button fullWidth onClick={handleStartTask} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Start Task</Button>;
              else ActionUI = <div className="text-[11px] font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Assigned to someone else</div>;
            }
            else if (tStatus === TASK_STATUS.IN_PROGRESS) {
              if (isAssignedToMe) ActionUI = <Button fullWidth onClick={() => setShowCompleteModal(true)} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Mark as Completed</Button>;
              else ActionUI = <div className="text-[11px] font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">In progress by another worker</div>;
            }
            else if (tStatus === TASK_STATUS.COMPLETED) {
              if (isAssignedToMe) ActionUI = <div className="text-[11px] font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em] bg-white/5 rounded-xl border border-white/10">Waiting for Review...</div>;
              else ActionUI = <div className="text-[11px] font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Completed</div>;
            }
            else if (tStatus === TASK_STATUS.FINISHED) {
              if (isAssignedToMe) ActionUI = <div className="text-[11px] font-black text-emerald-400 w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><CheckCircle2 size={14}/> Payment Received</div>;
              else ActionUI = <div className="text-[11px] font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
            }
          }

          return (
            <div className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5">
              {(tStatus === TASK_STATUS.OPEN || tStatus === TASK_STATUS.ASSIGNED || tStatus === TASK_STATUS.IN_PROGRESS) && (
                <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
                  <AutoResizeTextarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Message or ask a question..."
                    className="w-full bg-transparent border-none py-3 px-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
                    minHeight={44}
                    maxHeight={120}
                    rows={1}
                  />
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
                        if (scrollRef.current) setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
                      }}
                      className="mb-1 mr-1 px-4 py-2 shrink-0"
                    >
                      Send
                    </Button>
                  ) : (
                    <button onClick={() => handleFullscreenReply()} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
                      <Maximize2 size={18} />
                    </button>
                  )}
                </div>
              )}
              <div className="w-full">
                {ActionUI}
              </div>
            </div>
          );
        })()
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
        {showCompleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
          >
            <div className="absolute inset-0" onClick={() => setShowCompleteModal(false)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-on-surface tracking-tight">Complete Task</h3>
                <button onClick={() => setShowCompleteModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 mb-6">
                <textarea 
                  placeholder="Add completion notes or proof of work..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 min-h-[120px] resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button className="w-full border border-dashed border-white/20 rounded-2xl p-6 text-on-surface-variant hover:bg-white/5 hover:text-white transition-colors flex flex-col items-center justify-center gap-2">
                  <Camera size={24} className="opacity-50" />
                  <span className="text-xs font-bold">Upload Proof Image</span>
                </button>
              </div>
              <Button fullWidth onClick={handleCompleteTask} className="bg-emerald-500 text-black hover:bg-emerald-400">Submit Completion</Button>
            </motion.div>
          </motion.div>
        )}

        {showReviewModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col justify-end border-x border-white/5"
          >
            <div className="absolute inset-0" onClick={() => setShowReviewModal(false)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-surface-container-high border-t border-white/10 rounded-t-[32px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-on-surface tracking-tight">Review Work</h3>
                <button onClick={() => setShowReviewModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col items-center mb-6 gap-4">
                <div className="text-sm font-bold text-on-surface-variant">Rate the worker</div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform active:scale-90">
                      <Star size={32} className={star <= reviewRating ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'} />
                    </button>
                  ))}
                </div>
              </div>
              <Button fullWidth onClick={handleReviewTask} className="bg-emerald-500 text-black hover:bg-emerald-400">Release Payment</Button>
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