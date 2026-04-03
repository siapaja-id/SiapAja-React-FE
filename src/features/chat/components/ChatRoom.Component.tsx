import React from 'react';
import { motion } from 'framer-motion';
import { Send, ChevronRight, User, Phone, Video, Info } from 'lucide-react';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useChatRoom } from '@/src/features/chat/hooks/useChatRoom';

export const ChatRoom: React.FC = () => {
  const {
    messages,
    activeChat,
    input,
    setInput,
    scrollRef,
    handleSend,
    onClose,
  } = useChatRoom();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col max-w-2xl mx-auto border-x border-white/5"
    >
      <div className="p-4 border-b border-white/5 flex justify-between items-center glass">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => onClose(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant shrink-0">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            {activeChat ? (
              <>
                {activeChat.participants.length > 1 ? (
                  <div className="relative w-10 h-10 shrink-0">
                    <UserAvatar src={activeChat.participants[0].avatar} size="md" className="absolute top-0 left-0 z-10 border border-background" />
                    <UserAvatar src={activeChat.participants[1].avatar} size="md" className="absolute bottom-0 right-0 z-20 border border-background" />
                  </div>
                ) : (
                  <UserAvatar src={activeChat.participants[0].avatar} size="lg" isOnline={activeChat.participants[0].isOnline} />
                )}
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-on-surface tracking-tight truncate">
                    {activeChat.participants.map(p => p.name).join(', ')}
                  </h2>
                  <p className={`text-2sm font-bold uppercase tracking-widest truncate max-w-[200px] ${activeChat.participants.some(p => p.isOnline) ? 'text-emerald-500' : 'text-on-surface-variant'}`}>
                    {activeChat.participants.some(p => p.isOnline) ? 'Active' : 'Offline'} {activeChat.taskContext ? `• ${activeChat.taskContext.title}` : ''}
                  </p>
                </div>
              </>
            ) : (
              <>
                <UserAvatar src="https://picsum.photos/seed/req2/100/100" size="lg" isOnline={true} />
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-on-surface tracking-tight truncate">Sarah Logistics</h2>
                  <p className="text-2sm text-emerald-500 font-bold uppercase tracking-widest truncate">Active • Delivery Task</p>
                </div>
              </>
            )}
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

      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 hide-scrollbar"
      >
        <div className="text-center">
          <span className="text-2sm font-black uppercase tracking-widest text-on-surface-variant/40 py-1 px-3 bg-white/5 rounded-full">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              {!msg.isMe && <UserAvatar src={msg.sender.avatar} size="md" />}
              <div className="space-y-1">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-on-surface border border-white/10 rounded-tl-none'}`}>
                  {msg.content}
                </div>
                <div className={`text-2xs font-bold text-on-surface-variant/40 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
