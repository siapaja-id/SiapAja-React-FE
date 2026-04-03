import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import { getReplies } from '@/src/shared/services/feed.service';
import { FeedItem, SocialPostData, TaskData, CreationContext, ThreadBlock } from '@/src/shared/types/feed.types';
import { TASK_STATUS } from '@/src/shared/data/mock-feeds';

export const usePostDetail = () => {
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
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  }, []);

  const handleAcceptBid = useCallback((bid: SocialPostData) => {
    if (!currentPost) return;
    if (bid.bid) {
      updateReply<SocialPostData>(currentPost.id, bid.id, { bid: { ...bid.bid, status: 'accepted' } });
    }
    if (updateFeedItem) {
      updateFeedItem<TaskData>(currentPost.id, {
        status: TASK_STATUS.ASSIGNED,
        assignedWorker: bid.author,
        acceptedBidAmount: bid.bid?.amount
      });
    }
  }, [currentPost, updateReply, updateFeedItem]);

  const handleStartTask = useCallback(() => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { status: TASK_STATUS.IN_PROGRESS });
  }, [currentPost, updateFeedItem]);

  const handleCompleteTask = useCallback(() => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { status: TASK_STATUS.COMPLETED });
    setShowCompleteModal(false);
  }, [currentPost, updateFeedItem]);

  const handleReviewTask = useCallback(() => {
    if (!currentPost || !updateFeedItem) return;
    updateFeedItem<TaskData>(currentPost.id, { status: TASK_STATUS.FINISHED });
    setShowReviewModal(false);
  }, [currentPost, updateFeedItem]);

  const handleBack = useCallback(() => {
    if (postStack.length > 1) {
      setPostStack(prev => prev.slice(0, -1));
    } else {
      navigate(-1);
    }
  }, [postStack.length, navigate]);

  const handleAction = useCallback((type: 'bid' | 'accept') => {
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
        engagement: { replies: 0, reposts: 0, shares: 0, votes: 0 },
        bid: { amount: taskPriceString, status: 'accepted' }
      };
      addReply(currentPost.id, newBid);
      if (updateFeedItem) {
        updateFeedItem<TaskData>(currentPost.id, {
          status: TASK_STATUS.ASSIGNED,
          assignedWorker: currentUser,
          acceptedBidAmount: taskPriceString
        });
      }
      scrollToBottom();
    }
  }, [currentPost, currentUser, taskPriceString, addReply, updateFeedItem, scrollToBottom]);

  const handleBidSubmit = useCallback(() => {
    if (!currentPost) return;
    const newBid: SocialPostData = {
      id: Math.random().toString(),
      type: 'social',
      author: currentUser,
      content: replyText || "I can help with this task!",
      timestamp: 'Just now',
      engagement: { replies: 0, reposts: 0, shares: 0, votes: 0 },
      bid: { amount: `$${bidAmount.toFixed(2)}`, status: 'pending' }
    };
    addReply(currentPost.id, newBid);
    setIsBidding(false);
    setReplyText('');
    setBidAmount(defaultBid);
    scrollToBottom();
  }, [currentPost, currentUser, replyText, bidAmount, defaultBid, addReply, scrollToBottom]);

  const handleFullscreenReply = useCallback((_threads?: ThreadBlock[]) => {
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
  }, [currentPost, setCreationContext]);

  const handleSendReply = useCallback(() => {
    if (!currentPost || !replyText.trim()) return;
    const newReply: FeedItem = {
      id: Math.random().toString(),
      type: 'social',
      author: currentUser,
      content: replyText,
      timestamp: 'Just now',
      engagement: { replies: 0, reposts: 0, shares: 0, votes: 0 }
    };
    addReply(currentPost.id, newReply);
    setReplyText('');
    scrollToBottom();
  }, [currentPost, currentUser, replyText, addReply, scrollToBottom]);

  useEffect(() => {
    if (initialPost) setPostStack([initialPost]);
  }, [initialPost]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (currentPost && !repliesMap[currentPost.id]) {
      const generated = getReplies(currentPost, (i) => `Simulated insight #${i+1} for @${currentPost.author.handle}`);
      setReplies(currentPost.id, generated);
    }
  }, [currentPost?.id, initialPost, repliesMap, setReplies]);

  useEffect(() => {
    setBidAmount(defaultBid);
  }, [defaultBid]);

  return {
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
    handleAcceptBid,
    handleStartTask,
    handleCompleteTask,
    handleReviewTask,
  };
};
