import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, Car, Package, Briefcase, FileText, ArrowLeft, Paperclip, Mic, X, Users, Zap, Plus } from 'lucide-react';
import Markdown from 'react-markdown';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { AIChatMessage, AIChatRequestProps, QuickActionCardProps } from '@/src/features/creation/types/creation.types';
import { OrderData } from '@/src/shared/types/domain.type';

export const AIChatRequest: React.FC<AIChatRequestProps & { initialQuery?: string }> = ({ onComplete, onClose, onBack, initialQuery }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [view, setView] = useState<'chat' | 'canvas'>('chat');
  const [draft, setDraft] = useState<Partial<OrderData>>({ matchType: 'instant', locations: [], amount: 'Rp 0', type: 'task' });
  const [hasUnreadDraft, setHasUnreadDraft] = useState(false);
  
  // Map Modal State
  const [showMap, setShowMap] = useState(false);
  const [mapCallback, setMapCallback] = useState<(loc: string) => void>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (role: 'user' | 'assistant', content: string, type?: 'selection' | 'summary' | 'map-widget', data?: OrderData) => {
    const newMessage: AIChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const updateDraft = (updates: Partial<OrderData>) => {
    setDraft(prev => ({ ...prev, ...updates }));
    if (view !== 'canvas') setHasUnreadDraft(true);
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
      updateDraft({ title: 'Ride Request', type: 'ride', matchType: 'instant' });
      addMessage('assistant', "I can help you book a ride. Please drop a pin on the map to set your pickup location.", 'map-widget');
    } else if (lowerText.includes('delivery') || lowerText.includes('send') || lowerText.includes('package')) {
      updateDraft({ title: 'Delivery Request', type: 'delivery', matchType: 'instant' });
      addMessage('assistant', "I'll arrange a delivery for you. Please select the pickup point.", 'map-widget');
    } else if (lowerText.includes('gig') || lowerText.includes('hire') || lowerText.includes('job') || lowerText.includes('project') || lowerText.includes('fix') || lowerText.includes('clean') || lowerText.includes('help') || lowerText.includes('need')) {
      updateDraft({ title: 'Professional Gig', type: 'task', matchType: 'bidding' });
      addMessage('assistant', "Let's get your gig posted to the feed. I've set it to 'Feed Bidding' so you can receive offers. Switch to the Canvas to review and add details.");
    } else if (messages.length > 0) {
      updateDraft({ summary: (draft.summary ? draft.summary + '\n' : '') + text });
      addMessage('assistant', "I've noted that down and updated your canvas. You can edit it manually at any time.");
    } else {
      updateDraft({ summary: text });
      addMessage('assistant', "I'm not sure which type of service this is. I've added it to your canvas draft. Feel free to adjust the match type and details there.");
    }
  };

  const handleOpenMap = (callback: (loc: string) => void) => {
    setMapCallback(() => callback);
    setShowMap(true);
  };

  const confirmMapLocation = () => {
    const mockAddresses = ['123 Main St, Downtown', '456 Elm St, Midtown', 'Airport Terminal 3', 'Central Station', 'Tech Hub Workspace'];
    const loc = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    mapCallback?.(loc);
    setShowMap(false);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Header & Toggle */}
      <div className="pt-10 pb-4 px-4 border-b border-white/5 flex items-center justify-between bg-surface/90 backdrop-blur-xl z-20 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        
        <div className="flex bg-white/5 p-1 rounded-full shadow-inner border border-white/5">
          <button 
            onClick={() => setView('chat')} 
            className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${view === 'chat' ? 'bg-primary text-white shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            <Bot size={16} /> Chat
          </button>
          <button 
            onClick={() => { setView('canvas'); setHasUnreadDraft(false); }} 
            className={`px-4 py-1.5 rounded-full text-sm font-bold relative flex items-center gap-2 transition-all ${view === 'canvas' ? 'bg-primary text-white shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            <FileText size={16} /> Canvas
            {hasUnreadDraft && view === 'chat' && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </button>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant">
          <X size={24} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 flex flex-col"
            >
              <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 p-4 pb-32 hide-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-12 px-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                      <Sparkles size={32} className="text-primary relative z-10" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-on-surface tracking-tight">AI Co-pilot</h2>
                      <p className="text-on-surface-variant max-w-xs mx-auto text-sm">
                        Chat to shape your request, or manually build it in the Canvas tab.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-primary/80 text-white' : 'bg-surface-container-high border border-white/10 text-primary'}`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className="space-y-3 min-w-0">
                        <div className={`p-4 text-[15px] leading-relaxed shadow-sm break-words ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-[24px] rounded-tr-[8px]' 
                            : 'bg-surface-container border border-white/5 text-on-surface rounded-[24px] rounded-tl-[8px]'
                        }`}>
                          {msg.content}
                        </div>
                        
                        {msg.type === 'map-widget' && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container border border-white/10 rounded-2xl p-4 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-emerald-500/5" />
                            <div className="relative z-10 flex flex-col items-center text-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                <MapPin size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-on-surface">Location Required</h4>
                                <p className="text-xs text-on-surface-variant">Please drop a pin on the map.</p>
                              </div>
                              <Button 
                                variant="emerald" size="sm" fullWidth
                                onClick={() => handleOpenMap((loc) => {
                                  addMessage('user', `📍 Selected Location: ${loc}`);
                                  updateDraft({ locations: [...(draft.locations || []), loc], amount: 'Rp 45.000' });
                                  setTimeout(() => {
                                    addMessage('assistant', "Perfect! I've updated the canvas with your location. You can review it or tell me what else to change.");
                                  }, 1500);
                                })}
                              >
                                Open Map
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
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
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                <div className="relative flex items-end gap-2 bg-surface-container border border-white/10 rounded-[28px] p-2 shadow-2xl">
                  <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full shrink-0">
                    <Paperclip size={20} />
                  </button>
                  <AutoResizeTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Message AI Assistant..."
                    className="w-full text-on-surface placeholder:text-on-surface-variant/40 py-3"
                    minHeight={48}
                  />
                  {input.trim() ? (
                    <button onClick={() => handleSend()} className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                      <Send size={18} className="ml-1" />
                    </button>
                  ) : (
                    <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full shrink-0">
                      <Mic size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="canvas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 overflow-y-auto hide-scrollbar p-6 sm:p-8 bg-surface"
            >
              <div className="max-w-xl mx-auto space-y-8 pb-10">
                {/* Document Title & Meta */}
                <div className="relative group">
                  <input 
                    value={draft.title || ''} 
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="Untitled Request"
                    className="w-full bg-transparent text-3xl sm:text-4xl font-black text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:bg-white/5 rounded-2xl px-3 py-2 -ml-3 transition-colors"
                  />
                  <div className="flex items-center gap-3 mt-4 px-1">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Execution:</span>
                    <div className="flex bg-surface-container-high border border-white/10 rounded-full p-0.5">
                      <button 
                        onClick={() => updateDraft({ matchType: 'instant' })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${draft.matchType === 'instant' ? 'bg-emerald-500 text-black shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        <Zap size={12} /> Instant
                      </button>
                      <button 
                        onClick={() => updateDraft({ matchType: 'bidding' })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${draft.matchType === 'bidding' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        <Users size={12} /> Bidding
                      </button>
                    </div>
                  </div>
                </div>

                {/* Locations Blocks */}
                <div className="space-y-2 relative">
                  <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-white/10" />
                  {draft.locations?.map((loc, i) => (
                    <div key={i} className="group relative flex items-start gap-4 p-3 -ml-3 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="relative mt-0.5 z-10 w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface text-primary flex items-center justify-center shrink-0 shadow-sm">
                        <MapPin size={14} />
                      </div>
                      <div className="flex-grow pt-1">
                        <div className="text-[9px] font-black uppercase tracking-widest text-primary/70 mb-0.5">{i === 0 ? 'Start' : i === (draft.locations?.length || 0) - 1 ? 'Destination' : 'Stop'}</div>
                        <div className="text-sm font-bold text-on-surface">{loc}</div>
                      </div>
                      <button onClick={() => updateDraft({ locations: draft.locations?.filter((_, idx) => idx !== i) })} className="opacity-0 group-hover:opacity-100 mt-1 p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-start gap-4 p-3 -ml-3">
                    <div className="relative mt-0.5 z-10 w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface text-on-surface-variant flex items-center justify-center shrink-0 shadow-sm border-dashed">
                      <Plus size={14} />
                    </div>
                    <button 
                      onClick={() => handleOpenMap((loc) => updateDraft({ locations: [...(draft.locations || []), loc] }))}
                      className="pt-1.5 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors text-left"
                    >
                      {draft.locations?.length ? 'Add another stop' : 'Add location pin'}
                    </button>
                  </div>
                </div>

                {/* Description Body */}
                <div className="relative group pt-4">
                  <div className="absolute -left-3 top-4 bottom-4 w-1 bg-primary/0 group-focus-within:bg-primary/50 rounded-full transition-colors" />
                  <AutoResizeTextarea
                    value={draft.summary || ''} onChange={(e) => updateDraft({ summary: e.target.value })}
                    placeholder="Describe the details, requirements, or scope of your request... (Markdown supported)"
                    className="w-full bg-transparent text-[15px] leading-relaxed text-on-surface/90 placeholder:text-on-surface-variant/30 focus:outline-none focus:bg-white/[0.02] rounded-2xl p-4 -ml-4 transition-colors font-medium"
                    minHeight={150}
                  />
                  <div className="absolute top-4 right-0 opacity-0 group-hover:opacity-100 pointer-events-none text-on-surface-variant/30 transition-opacity">
                    <FileText size={20} />
                  </div>
                </div>

                {/* Budget Block */}
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-surface-container border border-white/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <DollarSign size={28} />
                  </div>
                  <div className="flex-grow">
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Estimated Budget</div>
                    <input 
                      type="text" value={draft.amount || ''} onChange={(e) => updateDraft({ amount: e.target.value })}
                      placeholder="Rp 0"
                      className="w-full bg-transparent text-3xl font-black text-emerald-400 placeholder:text-emerald-400/30 focus:outline-none tracking-tight"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8">
                  <Button size="lg" fullWidth onClick={() => onComplete(draft as OrderData)} className="shadow-2xl">
                    Finalize & Review
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Widget Overlay */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-50 bg-black flex flex-col"
          >
            <div className="relative flex-grow bg-surface-container-highest">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="relative -mt-10 text-emerald-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  <MapPin size={48} strokeWidth={2} className="fill-emerald-500/20" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/40 rounded-[100%] blur-[2px]" />
                </motion.div>
              </div>
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <button onClick={() => setShowMap(false)} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white">
                  <X size={20} />
                </button>
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white/80">
                  Drag to adjust pin
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface shrink-0 border-t border-white/10 rounded-t-[32px] -mt-6 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl font-black text-on-surface mb-1">Set Location</h3>
              <p className="text-sm text-on-surface-variant mb-6">Confirm your selected pickup or dropoff point.</p>
              <Button variant="emerald" size="lg" fullWidth onClick={confirmMapLocation}>
                Confirm Location
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, subtitle, onClick, delay }) => (
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
