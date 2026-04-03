import { useState, useEffect, useRef, useCallback } from 'react';
import { AIChatMessage } from '@/src/shared/types/creation.types';
import { OrderData } from '@/src/shared/types/order.types';

export const useAIChat = (initialQuery?: string) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [view, setView] = useState<'chat' | 'canvas'>('chat');
  const [draft, setDraft] = useState<Partial<OrderData>>({ matchType: 'swipe', autoAccept: true, locations: [], amount: '', type: 'task', title: '', summary: '' });
  const [hasUnreadDraft, setHasUnreadDraft] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCallback, setMapCallback] = useState<(loc: string) => void>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string, type?: 'selection' | 'summary' | 'map-widget', data?: OrderData) => {
    const newMessage: AIChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const updateDraft = useCallback((updates: Partial<OrderData>) => {
    setDraft(prev => ({ ...prev, ...updates }));
    setHasUnreadDraft(true);
  }, []);

  const insertMediaToCanvas = useCallback(() => {
    const mediaMarkdown = `\n\n![Attachment](https://picsum.photos/seed/${Math.random()}/800/400)\n\n`;
    setDraft(prev => ({ ...prev, summary: (prev.summary || '') + mediaMarkdown }));
    if (view === 'chat') {
      addMessage('assistant', "I've attached a placeholder image to your canvas document.");
    }
  }, [view, addMessage]);

  const processAIResponse = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ride') || lowerText.includes('pick me up')) {
      setDraft(prev => ({ ...prev, title: prev.title || 'Ride Request', type: 'ride', matchType: 'swipe' }));
      addMessage('assistant', "I can help you book a ride. Tap the map widget below to set your pickup location.", 'map-widget');
    } else if (lowerText.includes('delivery') || lowerText.includes('package')) {
      setDraft(prev => ({ ...prev, title: prev.title || 'Delivery Request', type: 'delivery', matchType: 'swipe' }));
      addMessage('assistant', "I'll arrange a delivery. Please select the pickup point on the map.", 'map-widget');
    } else if (lowerText.includes('photo') || lowerText.includes('image') || lowerText.includes('picture')) {
      const mediaMarkdown = `\n\n![Attachment](https://picsum.photos/seed/${Math.random()}/800/400)\n\n`;
      setDraft(prev => ({ ...prev, summary: (prev.summary || '') + mediaMarkdown }));
    } else if (lowerText.includes('budget') || lowerText.includes('cost') || lowerText.includes('$') || lowerText.includes('rp')) {
      const amountMatch = text.match(/(?:Rp|\$)\s?\d+(?:[.,]\d+)?(?:k|m)?/i);
      if (amountMatch) {
        setDraft(prev => ({ ...prev, amount: amountMatch[0] }));
        addMessage('assistant', `I've updated the budget to ${amountMatch[0]} in your canvas.`);
      } else {
        addMessage('assistant', "What's your estimated budget for this?");
      }
    } else {
      setDraft(prev => ({ ...prev, summary: (prev.summary ? prev.summary + '\n' : '') + text }));
      addMessage('assistant', "I've added those details to your Canvas. You can seamlessly edit the document there, or keep chatting with me!");
    }
    setIsTyping(false);
  }, [addMessage]);

  const handleSend = useCallback(async (text?: string) => {
    const sendText = text || input;
    if (!sendText.trim()) return;
    
    addMessage('user', sendText);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      processAIResponse(sendText);
    }, 1500);
  }, [input, addMessage, processAIResponse]);

  const handleOpenMap = useCallback((callback: (loc: string) => void) => {
    setMapCallback(() => callback);
    setShowMap(true);
  }, []);

  const confirmMapLocation = useCallback(() => {
    const mockAddresses = ['123 Main St, Downtown', '456 Elm St, Midtown', 'Airport Terminal 3', 'Central Station', 'Tech Hub Workspace'];
    const loc = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    mapCallback?.(loc);
    setShowMap(false);
  }, [mapCallback]);

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSend(initialQuery);
      setDraft(prev => ({ ...prev, summary: initialQuery }));
    }
  }, [initialQuery, handleSend]);

  useEffect(() => {
    if (scrollRef.current && view === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, view]);

  return {
    messages,
    input,
    setInput,
    isTyping,
    view,
    setView,
    draft,
    hasUnreadDraft,
    setHasUnreadDraft,
    showMap,
    setShowMap,
    scrollRef,
    canvasScrollRef,
    updateDraft,
    insertMediaToCanvas,
    handleSend,
    handleOpenMap,
    confirmMapLocation,
  };
};
