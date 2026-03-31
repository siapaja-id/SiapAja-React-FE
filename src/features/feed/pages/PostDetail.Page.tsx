import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getReplies, FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { EmptyRepliesState } from '@/src/features/feed/components/post-detail/EmptyRepliesState.Component';
import { BidSheet } from '@/src/features/feed/components/post-detail/BidSheet.Component';
import { CompletionSheet } from '@/src/features/feed/components/post-detail/CompletionSheet.Component';
import { ReviewSheet } from '@/src/features/feed/components/post-detail/ReviewSheet.Component';
import { TaskActionFooter } from '@/src/features/feed/components/post-detail/TaskActionFooter.Component';
import { FeedItem, SocialPostData, TaskData, CreationContext } from '@/src/shared/types/domain.type';
import { ThreadBlock } from '@/src/features/feed/types/feed.types';
import { useStore } from '@/src/store/main.store';
import { CreatePostPage } from './CreatePost.Page';
import { TASK_STATUS } from '@/src/shared/constants/domain.constant';

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
  const isAssignedToMe = currentPost?.type === 'task' 
    ? (currentPost as TaskData).assignedWorker?.handle === currentUser.handle 
    : false;

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
      scrollToBottom();
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
    scrollToBottom();
  };

  const handleFullscreenReply = (_threads?: ThreadBlock[]) => {
    if (!currentPost) return;
    const context: CreationContext = {
      parentId: currentPost.id,
      type: currentPost.type as 'social' | 'task' | 'editorial',
      authorHandle: currentPost.author.handle,
      content: currentPost.type === 'social' 
        ? (currentPost as SocialPostData).content 
        : (currentPost as TaskData).description || '',
      avatarUrl: currentPost.author.avatar,
      taskTitle: currentPost.type === 'task' ? (currentPost as TaskData).title : undefined,
      taskPrice: currentPost.type === 'task' ? (currentPost as TaskData).price : undefined
    };
    setCreationContext(context);
    setIsFullscreenReply(true);
  };

  const handleSendReply = () => {
    if (!currentPost || !replyText.trim()) return;
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
    scrollToBottom();
  };

  const scrollToBottom = () => {
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
        className="bg-surface-container-high/95 border-b border-white/5"
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24 relative">
        {currentPost.type === 'task' && (
           <div 
             className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-surface-container-high pointer-events-none" 
           />
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
            <TaskMainContent task={currentPost as TaskData} />
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
            <div className="px-6 py-4 text-1sm uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-white/5">
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
            <EmptyRepliesState
              postType={currentPost.type}
              isCreator={!!isCreator}
              onBidClick={() => handleAction('bid')}
              onFocusReply={() => document.querySelector('textarea')?.focus()}
            />
          )}
        </div>
      </div>

      {currentPost.type === 'task' ? (
        <TaskActionFooter
          task={currentPost as TaskData}
          isCreator={!!isCreator}
          isAssignedToMe={isAssignedToMe}
          isNegotiable={isNegotiable}
          replyText={replyText}
          onReplyTextChange={setReplyText}
          onSendMessage={handleSendReply}
          onBid={() => handleAction('bid')}
          onAccept={() => handleAction('accept')}
          onStartTask={handleStartTask}
          onShowComplete={() => setShowCompleteModal(true)}
          onShowReview={() => setShowReviewModal(true)}
          onFullscreenReply={handleFullscreenReply}
        />
      ) : (
        <ReplyInput
          value={replyText}
          onChange={setReplyText}
          placeholder={`Reply to ${currentPost.author.handle}...`}
          onExpand={handleFullscreenReply}
          onSubmit={handleSendReply}
        />
      )}

      <BidSheet
        isOpen={isBidding}
        onClose={() => setIsBidding(false)}
        defaultBid={defaultBid}
        replyText={replyText}
        onReplyTextChange={setReplyText}
        bidAmount={bidAmount}
        onBidAmountChange={setBidAmount}
        onSubmit={handleBidSubmit}
      />

      <CompletionSheet
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        notes={completionNotes}
        onNotesChange={setCompletionNotes}
        onSubmit={handleCompleteTask}
      />

      <ReviewSheet
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        rating={reviewRating}
        onRatingChange={setReviewRating}
        onSubmit={handleReviewTask}
      />

      <AnimatePresence>
        {isFullscreenReply && (
          <CreatePostPage />
        )}
      </AnimatePresence>
    </PageSlide>
  );
};