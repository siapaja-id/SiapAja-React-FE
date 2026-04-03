import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/src/store/main.store';
import { ChatMessage } from '@/src/shared/types/chat.types';

export const useChatRoom = () => {
  const messages = useStore(state => state.chatMessages);
  const addChatMessage = useStore(state => state.addChatMessage);
  const onClose = useStore(state => state.setShowChatRoom);
  const activeChat = useStore(state => state.activeChat);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: { name: 'Me', handle: 'me', avatar: 'https://picsum.photos/seed/me/100/100' },
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    addChatMessage(newMessage);
    setInput('');
  }, [input, addChatMessage]);

  return {
    messages,
    activeChat,
    input,
    setInput,
    scrollRef,
    handleSend,
    onClose,
  };
};
