import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import { ThreadBlock, SocialPostData } from '@/src/shared/types/feed.types';

const MAX_CHARS = 280;

export const useCreatePost = () => {
  const navigate = useNavigate();
  const creationContext = useStore(state => state.creationContext);
  const addReply = useStore(state => state.addReply);
  const addFeedItem = useStore(state => state.addFeedItem);
  const setCreationContext = useStore(state => state.setCreationContext);
  
  const [threads, setThreads] = useState<ThreadBlock[]>([{ id: '1', content: '' }]);
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const replyContext = creationContext;

  const onBack = useCallback(() => {
    setCreationContext(null);
    navigate(-1);
  }, [setCreationContext, navigate]);

  const addThread = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    setThreads(prev => [...prev, { id: newId, content: '' }]);
    setActiveThreadIndex(prev => prev + 1);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const removeThread = useCallback((index: number) => {
    setThreads(prev => {
      if (prev.length > 1) {
        const newThreads = prev.filter((_, i) => i !== index);
        setActiveThreadIndex(Math.max(0, index - 1));
        return newThreads;
      }
      return prev;
    });
  }, []);

  const updateThread = useCallback((index: number, content: string) => {
    setThreads(prev => {
      const newThreads = [...prev];
      newThreads[index].content = content;
      return newThreads;
    });
  }, []);

  const handlePost = useCallback(() => {
    const content = threads.map(t => t.content).join('\n\n');
    if (!content.trim()) return;

    const newItem: SocialPostData = {
      id: Math.random().toString(),
      type: 'social',
      author: useStore.getState().currentUser,
      content,
      timestamp: 'Just now',
      engagement: { replies: 0, reposts: 0, shares: 0, votes: 0 }
    };

    if (replyContext?.parentId) {
      addReply(replyContext.parentId, newItem);
    } else {
      addFeedItem(newItem);
    }
    
    onBack();
  }, [threads, replyContext, addReply, addFeedItem, onBack]);

  const calculateProgress = (text: string) => {
    return Math.min((text.length / MAX_CHARS) * 100, 100);
  };

  return {
    threads,
    activeThreadIndex,
    setActiveThreadIndex,
    scrollRef,
    replyContext,
    onBack,
    addThread,
    removeThread,
    updateThread,
    handlePost,
    calculateProgress,
    MAX_CHARS,
  };
};
