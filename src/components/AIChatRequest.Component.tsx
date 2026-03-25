import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, Car, Package, Briefcase, FileText, ArrowLeft, Paperclip, Mic } from 'lucide-react';
import Markdown from 'react-markdown';
import { Button, AutoResizeTextarea } from './SharedUI.Component';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'selection' | 'summary' | 'welcome';
  data?: any;
}

export const AIChatRequest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (role: 'user' | 'assistant', content: string, type?: 'selection' | 'summary', data?: any) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    addMessage('user', text);
    setInput('');
    setIsTyping(true);

    // Simulate AI logic
    setTimeout(() => {
      setIsTyping(false);
      processAIResponse(text);
    }, 1500);
  };

  const processAIResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ride') || lowerText.includes('go to') || lowerText.includes('pick me up')) {
      addMessage('assistant', "I can help you book a ride. Where are you heading to, and where should the driver pick you up?");
    } else if (lowerText.includes('delivery') || lowerText.includes('send') || lowerText.includes('package')) {
      addMessage('assistant', "I'll arrange a delivery for you. What are we sending, and what's the destination address?");
    } else if (lowerText.includes('gig') || lowerText.includes('hire') || lowerText.includes('job') || lowerText.includes('project')) {
      addMessage('assistant', "Let's get your gig posted. What's the title of the project and your estimated budget?");
    } else if (messages.length > 0) {
      const isRide = lowerText.includes('ride') || messages.some(m => m.content.toLowerCase().includes('ride'));
      const markdownSummary = isRide 
        ? `### 🚗 Ride Request Details\n---\n**Pickup:** 123 Main St, Downtown\n**Drop-off:** 456 Elm St, Midtown\n**Vehicle:** Standard Sedan\n**Passengers:** 2\n\n**Estimated Price:** **Rp 25.000**\n**Estimated Arrival:** 5-7 minutes`
        : `### 📦 Delivery Request Details\n---\n**Item:** Large Box (Electronics)\n**From:** 789 Oak Ave, Westside\n**To:** 321 Pine St, Eastside\n**Weight:** ~5kg\n\n**Estimated Price:** **Rp 35.000**\n**Delivery Window:** 30-45 minutes`;

      addMessage('assistant', "I've gathered all the details. Please review your order summary below before we proceed:", 'summary', {
        title: isRide ? "Ride Request" : "Delivery Request",
        amount: isRide ? "Rp 25.000" : "Rp 35.000",
        summary: markdownSummary,
        type: isRide ? 'ride' : 'delivery'
      });
    } else {
      addMessage('assistant', "I'm not quite sure I caught that. Would you like a ride, a delivery, or to post a professional gig?");
    }
  };

  const handleReview = (data: any) => {
    onComplete(data);
  };

  return (
    <div className="flex flex-col h-[75vh] relative">
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-6 pb-32 px-2 custom-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-12"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <Sparkles size={32} className="text-primary relative z-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-on-surface tracking-tight">How can I help?</h2>
                <p className="text-on-surface-variant max-w-xs mx-auto">
                  Describe what you need, or choose a quick action below to get started.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
                <QuickActionCard 
                  icon={<Car size={20} />} 
                  title="Book a Ride" 
                  subtitle="Get to your destination"
                  onClick={() => handleSend("I'd like to book a ride")} 
                  delay={0.1}
                />
                <QuickActionCard 
                  icon={<Package size={20} />} 
                  title="Send a Package" 
                  subtitle="Same-day local delivery"
                  onClick={() => handleSend("I need a delivery")} 
                  delay={0.2}
                />
                <QuickActionCard 
                  icon={<Briefcase size={20} />} 
                  title="Hire a Pro" 
                  subtitle="Post a gig or task"
                  onClick={() => handleSend("I want to post a gig")} 
                  delay={0.3}
                />
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              layout
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-primary/80 text-white' : 'bg-surface-container-high border border-white/10 text-primary'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="space-y-3">
                  <div className={`p-4 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-[24px] rounded-tr-[8px]' 
                      : 'bg-surface-container border border-white/5 text-on-surface rounded-[24px] rounded-tl-[8px]'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.type === 'summary' && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-surface-container-high border border-white/10 rounded-[24px] overflow-hidden shadow-xl"
                    >
                      <div className="p-5 border-b border-dashed border-white/10 bg-emerald-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <Check size={16} strokeWidth={3} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Ready to Review</span>
                        </div>
                        <FileText size={16} className="text-emerald-500/50" />
                      </div>
                      
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="text-xl font-black text-on-surface tracking-tight">{msg.data.title}</div>
                          <div className="text-sm text-on-surface-variant mt-1">Your request details have been processed.</div>
                        </div>
                        
                        <Button 
                          variant="emerald"
                          onClick={() => handleReview(msg.data)}
                          fullWidth
                        >
                          Review & Checkout
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 text-primary flex items-center justify-center mt-1">
                  <Bot size={14} />
                </div>
                <div className="bg-surface-container border border-white/5 p-4 rounded-[24px] rounded-tl-[8px] flex gap-1.5 items-center h-[52px]">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }} className="w-1.5 h-1.5 bg-primary/80 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 pt-10 pb-2 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <div className="relative flex items-end gap-2 bg-surface-container-high border border-white/10 rounded-[28px] p-2 shadow-2xl">
          <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex-shrink-0">
            <Paperclip size={20} />
          </button>
          
          <AutoResizeTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message AI Assistant..."
            className="w-full text-on-surface placeholder:text-on-surface-variant/40 py-3"
            minHeight={48}
          />
          
          {input.trim() ? (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => handleSend()}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={18} className="ml-1" />
            </motion.button>
          ) : (
            <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex-shrink-0">
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; delay: number }> = ({ icon, title, subtitle, onClick, delay }) => (
  <motion.button 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    onClick={onClick}
    className="flex items-center gap-4 p-4 bg-surface-container border border-white/5 rounded-2xl hover:bg-surface-container-high hover:border-white/10 transition-all text-left group"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-grow">
      <h4 className="text-sm font-bold text-on-surface">{title}</h4>
      <p className="text-xs text-on-surface-variant">{subtitle}</p>
    </div>
    <ChevronRight size={18} className="text-on-surface-variant/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </motion.button>
);
