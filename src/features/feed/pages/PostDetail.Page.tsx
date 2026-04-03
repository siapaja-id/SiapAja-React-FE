import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ReplyInput, DetailHeader, PageSlide } from '@/src/shared/ui/SharedUI.Component';
import { TaskMainContent } from '@/src/features/feed/components/TaskMainContent.Component';
import { EmptyRepliesState } from '@/src/features/feed/components/post-detail/EmptyRepliesState.Component';
import { BidSheet } from '@/src/features/feed/components/post-detail/BidSheet.Component';
import { CompletionSheet } from '@/src/features/feed/components/post-detail/CompletionSheet.Component';
import { ReviewSheet } from '@/src/features/feed/components/post-detail/ReviewSheet.Component';
import { TaskActionFooter } from '@/src/features/feed/components/post-detail/TaskActionFooter.Component';
import { SocialPostData, TaskData } from '@/src/shared/types/feed.types';
import { usePostDetail } from '@/src/features/feed/hooks/usePostDetail';
import { CreatePostPage } from './CreatePost.Page';

export const PostDetailPage: React.FC = () => {
  const {
    currentPost,
    localReplies,
    replyText,
    setReplyText,
    postStack,
    scrollRef,
    isFullscreenReply,
    isBidding,
    setIsBidding,
    bidAmount,
    setBidAmount,
    defaultBid,
    isNegotiable,
    isCreator,
    isAssignedToMe,
    showCompleteModal,
    setShowCompleteModal,
    showReviewModal,
    setShowReviewModal,
    reviewRating,
    setReviewRating,
    completionNotes,
    setCompletionNotes,
    handleBack,
    handleSendReply,
    handleAction,
    handleBidSubmit,
    handleFullscreenReply,
    handleStartTask,
    handleCompleteTask,
    handleReviewTask,
  } = usePostDetail();

  if (!currentPost) return <div className="p-8 text-center text-on-surface-variant">Post not found</div>;

  return (
    <PageSlide>
      <DetailHeader
        onBack={handleBack} 
        title={currentPost.type === 'task' ? "Task Details" : "Thread"} 
        subtitle={postStack.length > 1 ? `Replying to @${postStack[postStack.length - 2].author.handle}` : undefined} 
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
              onClick={() => {}} 
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

        <div className={`flex flex-col ${currentPost.type === 'social' && (currentPost as SocialPostData).thread ? '' : 'border-t border-on-surface/5 mt-2'}`}>
          {localReplies.length > 0 && !(currentPost.type === 'social' && (currentPost as SocialPostData).thread) && (
            <div className="px-6 py-4 text-1sm uppercase tracking-[0.2em] text-on-surface-variant font-black border-b border-on-surface/5">
              {currentPost.type === 'task' ? 'Discussion & Bids' : 'Replies'}
            </div>
          )}
          {localReplies.length > 0 ? (
            localReplies.map((reply, index) => (
              <FeedItemRenderer
                key={reply.id}
                data={reply}
                hasLineBelow={index < localReplies.length - 1}
                onClick={() => {}}
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
