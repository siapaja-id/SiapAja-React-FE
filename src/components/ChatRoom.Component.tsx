import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, Car, Package, Briefcase, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { UserAvatar } from './SharedUI.Component';
import { ChatMessage } from '../types/domain.type';
import { useStore } from '../store/main.store';

export const ChatRoom: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { chatMessages: messages, addChatMessage } = useStore();
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
    
    addChatMessage(newMessage);
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
              <UserAvatar src="https://picsum.photos/seed/req2/100/100" size="lg" />
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
              {!msg.isMe && <UserAvatar src={msg.senderAvatar} size="md" />}
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
