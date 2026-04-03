import { useState, useCallback } from 'react';
import { useStore } from '@/src/store/main.store';

export const useFeedComposer = () => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'video' | 'voice' | 'file'; url: string }[]>([]);
  
  const setInitialAiQuery = useStore(state => state.setInitialAiQuery);
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const currentUser = useStore(state => state.currentUser);

  const handleSubmit = useCallback(() => {
    if (!text.trim() && attachments.length === 0) return;
    const contextSuffix = attachments.length > 0 
      ? `\n\n[Attached: ${attachments.map(a => a.type).join(', ')}]`
      : '';
    setInitialAiQuery(text + contextSuffix);
    setShowCreateModal(true);
    setText('');
    setAttachments([]);
    setIsFocused(false);
    setIsFullscreen(false);
  }, [text, attachments, setInitialAiQuery, setShowCreateModal]);

  const addMockMedia = useCallback((type: 'image' | 'video' | 'voice' | 'file') => {
    const urls: Record<string, string> = {
      image: 'https://picsum.photos/seed/post/400/300',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      voice: '0:15',
      file: 'document.pdf'
    };
    setAttachments(prev => [...prev, { type, url: urls[type] }]);
    setIsFocused(true);
  }, []);

  const removeAttachment = useCallback((idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  }, []);

  return {
    text,
    setText,
    isFocused,
    setIsFocused,
    isFullscreen,
    setIsFullscreen,
    attachments,
    currentUser,
    handleSubmit,
    addMockMedia,
    removeAttachment,
  };
};
