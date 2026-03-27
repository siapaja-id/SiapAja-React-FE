import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, ChevronRight, Check, MapPin, DollarSign, Clock, FileText, X, Users, Zap, Plus, ImageIcon, Camera, Mic, Paperclip, CheckCircle2, AlignLeft, GripHorizontal } from 'lucide-react';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { AIChatMessage, AIChatRequestProps } from '@/src/features/creation/types/creation.types';
import { OrderData } from '@/src/shared/types/domain.type';

export const AIChatRequest: React.FC<AIChatRequestProps & { initialQuery?: string }> = ({ onComplete, onClose, onBack, initialQuery }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [view, setView] = useState<'chat' | 'canvas'>('chat');
  const [draft, setDraft] = useState<Partial<OrderData>>({ matchType: 'instant', locations: [], amount: '', type: 'task', title: '', summary: '' });
  const [hasUnreadDraft, setHasUnreadDraft] = useState(false);
  
  // Map Modal State
  const [showMap, setShowMap] = useState(false);
  const [mapCallback, setMapCallback] = useState<(loc: string) => void>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSend(initialQuery);
      // Auto-populate initial text into canvas as well
      updateDraft({ summary: initialQuery });
    }
  }, [initialQuery]);

  useEffect(() => {
    if (scrollRef.current && view === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, view]);

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

  const insertMediaToCanvas = () => {
    const mediaMarkdown = `\n\n![Attachment](https://picsum.photos/seed/${Math.random()}/800/400)\n\n`;
    updateDraft({ summary: (draft.summary || '') + mediaMarkdown });
    if (view === 'chat') {
      addMessage('assistant', "I've attached a placeholder image to your canvas document.");
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    addMessage('user', text);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      processAIResponse(text);
    }, 1500);
  };

  const processAIResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ride') || lowerText.includes('pick me up')) {
      updateDraft({ title: draft.title || 'Ride Request', type: 'ride', matchType: 'instant' });
      addMessage('assistant', "I can help you book a ride. Tap the map widget below to set your pickup location.", 'map-widget');
    } else if (lowerText.includes('delivery') || lowerText.includes('package')) {
      updateDraft({ title: draft.title || 'Delivery Request', type: 'delivery', matchType: 'instant' });
      addMessage('assistant', "I'll arrange a delivery. Please select the pickup point on the map.", 'map-widget');
    } else if (lowerText.includes('photo') || lowerText.includes('image') || lowerText.includes('picture')) {
      insertMediaToCanvas();
    } else if (lowerText.includes('budget') || lowerText.includes('cost') || lowerText.includes('$') || lowerText.includes('rp')) {
      const amountMatch = text.match(/(?:Rp|\$)\s?\d+(?:[.,]\d+)?(?:k|m)?/i);
      if (amountMatch) {
        updateDraft({ amount: amountMatch[0] });
        addMessage('assistant', `I've updated the budget to ${amountMatch[0]} in your canvas.`);
      } else {
        addMessage('assistant', "What's your estimated budget for this?");
      }
    } else {
      updateDraft({ summary: (draft.summary ? draft.summary + '\n' : '') + text });
      addMessage('assistant', "I've added those details to your Canvas. You can seamlessly edit the document there, or keep chatting with me!");
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
      {/* Native iOS-Style Header */}
      <div className="pt-12 pb-3 px-4 flex items-center justify-between bg-surface/80 backdrop-blur-2xl z-20 shrink-0 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-on-surface-variant transition-colors">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        
        {/* Segmented Control */}
        <div className="flex bg-surface-container-highest p-1 rounded-full relative w-48 shadow-inner border border-white/5">
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface rounded-full shadow-sm border border-white/10 transition-all duration-300 ease-out"
            style={{ transform: view === 'chat' ? 'translateX(0)' : 'translateX(100%)' }}
          />
          <button 
            onClick={() => setView('chat')} 
            className={`flex-1 relative z-10 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-colors ${view === 'chat' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <Bot size={14} /> Chat
          </button>
          <button 
            onClick={() => { setView('canvas'); setHasUnreadDraft(false); }} 
            className={`flex-1 relative z-10 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-colors ${view === 'canvas' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <FileText size={14} /> Canvas
            {hasUnreadDraft && view === 'chat' && (
              <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </button>
        </div>

        <button onClick={onClose} className="p-2 -mr-2 hover:bg-white/5 rounded-full text-on-surface-variant transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow relative overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          {view === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col"
            >
              <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 p-4 pb-32 hide-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-10 px-4">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center relative shadow-inner rotate-3">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
                      <Sparkles size={32} className="text-primary relative z-10 -rotate-3" />
                    </div>
                    <div className="space-y-2 max-w-[240px]">
                      <h2 className="text-2xl font-black text-on-surface tracking-tight">AI Co-pilot</h2>
                      <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                        Chat to shape your request, or swipe to the Canvas to write it like a doc.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/5 text-primary flex items-center justify-center flex-shrink-0 mt-auto shadow-sm">
                          <Bot size={14} />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm break-words relative ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-[24px] rounded-br-[8px]' 
                            : 'bg-surface-container-low border border-white/5 text-on-surface rounded-[24px] rounded-bl-[8px]'
                        }`}>
                          {msg.content}
                        </div>
                        
                        {msg.type === 'map-widget' && (
                          <div className="bg-surface-container border border-white/5 rounded-[24px] p-2 overflow-hidden w-64 shadow-md">
                            <div className="h-24 bg-surface-container-highest relative rounded-2xl overflow-hidden mb-2">
                               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-50 grayscale-[0.5]" />
                               <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                    <MapPin size={20} className="text-emerald-500 drop-shadow-md" />
                                 </div>
                               </div>
                            </div>
                            <div className="px-2 pb-2">
                              <h4 className="font-bold text-sm text-on-surface">Location Required</h4>
                              <p className="text-xs text-on-surface-variant mb-3">Tap to drop a pin.</p>
                              <Button 
                                variant="emerald" size="sm" fullWidth
                                onClick={() => handleOpenMap((loc) => {
                                  addMessage('user', `📍 Selected: ${loc}`);
                                  updateDraft({ locations: [...(draft.locations || []), loc] });
                                  setTimeout(() => addMessage('assistant', "Got it. I've updated the Canvas with this location."), 1000);
                                })}
                              >
                                Open Map
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2.5 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/5 text-primary flex items-center justify-center mt-auto shadow-sm">
                        <Bot size={14} />
                      </div>
                      <div className="bg-surface-container-low border border-white/5 px-5 py-4 rounded-[24px] rounded-bl-[8px] flex gap-1.5 items-center">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }} className="w-1.5 h-1.5 bg-on-surface-variant/60 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }} className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Native Input Area */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pb-6">
                <div className="relative flex items-end gap-2 bg-surface-container-high/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-1.5 shadow-2xl">
                  <button onClick={insertMediaToCanvas} className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full shrink-0 transition-colors">
                    <Plus size={22} />
                  </button>
                  <AutoResizeTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Message AI..."
                    className="w-full text-on-surface placeholder:text-on-surface-variant/40 py-3 text-[15px]"
                    minHeight={44}
                    maxHeight={120}
                  />
                  {input.trim() ? (
                    <button onClick={() => handleSend()} className="w-9 h-9 mb-1 mr-1 bg-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-90">
                      <Send size={16} className="ml-0.5" />
                    </button>
                  ) : (
                    <button className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full shrink-0 transition-colors">
                      <Mic size={22} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="canvas"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col bg-background"
            >
              <div ref={canvasScrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-32">
                <div className="max-w-2xl mx-auto px-6 py-8">
                  {/* Document Title */}
                  <AutoResizeTextarea
                    value={draft.title || ''}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="Untitled Document"
                    className="w-full bg-transparent text-4xl font-black text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none mb-6 leading-tight"
                    minHeight={48}
                  />

                  {/* Notion-style Properties */}
                  <div className="flex flex-col border-y border-white/5 py-2 mb-8 bg-white/[0.01] rounded-2xl px-4">
                    <PropertyRow icon={<Zap size={16} />} label="Execution">
                      <div className="flex bg-surface-container-high border border-white/5 rounded-lg p-0.5">
                        <button 
                          onClick={() => updateDraft({ matchType: 'instant' })}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${draft.matchType === 'instant' ? 'bg-emerald-500 text-black shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                          Instant Match
                        </button>
                        <button 
                          onClick={() => updateDraft({ matchType: 'bidding' })}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${draft.matchType === 'bidding' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                          Feed Bidding
                        </button>
                      </div>
                    </PropertyRow>

                    <PropertyRow icon={<DollarSign size={16} />} label="Budget">
                      <input 
                        type="text" 
                        value={draft.amount || ''} 
                        onChange={(e) => updateDraft({ amount: e.target.value })}
                        placeholder="Empty"
                        className="bg-transparent text-sm font-medium text-emerald-400 placeholder:text-on-surface-variant/30 focus:outline-none w-full py-1"
                      />
                    </PropertyRow>

                    <PropertyRow icon={<MapPin size={16} />} label="Locations">
                      <div className="flex flex-wrap gap-2 items-center">
                        {draft.locations?.map((loc, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high border border-white/10 rounded-md text-xs font-medium text-on-surface group">
                            <span className="truncate max-w-[120px]">{loc}</span>
                            <button onClick={() => updateDraft({ locations: draft.locations?.filter((_, idx) => idx !== i) })} className="text-on-surface-variant hover:text-red-400">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => handleOpenMap((loc) => updateDraft({ locations: [...(draft.locations || []), loc] }))}
                          className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 py-1"
                        >
                          <Plus size={14} /> Add Location
                        </button>
                      </div>
                    </PropertyRow>
                  </div>

                  {/* Document Body (Markdown Textarea) */}
                  <div className="relative group">
                    <AutoResizeTextarea
                      value={draft.summary || ''} 
                      onChange={(e) => updateDraft({ summary: e.target.value })}
                      placeholder="Type '/' for commands, or just start writing your request details..."
                      className="w-full bg-transparent text-[16px] leading-relaxed text-on-surface/90 placeholder:text-on-surface-variant/30 focus:outline-none min-h-[300px]"
                    />
                  </div>
                </div>
              </div>

              {/* Canvas Bottom Toolbar & Action */}
              <div className="absolute bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-white/5 p-4 pb-6">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                  {/* Media Formatting Toolbar */}
                  <div className="flex items-center gap-4 px-2 text-on-surface-variant overflow-x-auto hide-scrollbar">
                    <button onClick={insertMediaToCanvas} className="p-2 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2">
                      <ImageIcon size={18} /> <span className="text-xs font-bold">Image</span>
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2">
                      <Camera size={18} /> <span className="text-xs font-bold">Camera</span>
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2">
                      <Paperclip size={18} /> <span className="text-xs font-bold">File</span>
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-2" />
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                      <AlignLeft size={18} />
                    </button>
                  </div>
                  
                  <Button size="lg" fullWidth onClick={() => onComplete(draft as OrderData)} className="shadow-2xl">
                    <CheckCircle2 size={18} /> Finalize Document
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Bottom Sheet Map Widget */}
      <AnimatePresence>
        {showMap && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              onClick={() => setShowMap(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 h-[80vh] bg-surface rounded-t-[32px] overflow-hidden z-[100] flex flex-col border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Drag Handle & Header */}
              <div className="pt-3 pb-2 flex flex-col items-center bg-surface shrink-0 z-10">
                <div className="w-12 h-1.5 bg-white/20 rounded-full mb-4" />
                <div className="w-full px-6 flex justify-between items-center">
                  <h3 className="text-xl font-black text-on-surface">Set Location</h3>
                  <button onClick={() => setShowMap(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-white">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Map Area */}
              <div className="relative flex-grow bg-surface-container-highest">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="relative -mt-10 text-emerald-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <MapPin size={48} strokeWidth={2} className="fill-emerald-500/20" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/40 rounded-[100%] blur-[2px]" />
                  </motion.div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 bg-surface shrink-0 border-t border-white/5 relative z-10 pb-8">
                <Button variant="emerald" size="lg" fullWidth onClick={confirmMapLocation}>
                  Confirm Selection
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for Notion-style properties
const PropertyRow: React.FC<{ icon: React.ReactNode, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="flex sm:items-center items-start gap-4 py-3 border-b border-white/5 last:border-0 group">
    <div className="flex items-center gap-2 w-28 shrink-0 text-on-surface-variant sm:pt-0 pt-1">
      <div className="opacity-60">{icon}</div>
      <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex-grow flex flex-wrap gap-2 items-center min-h-[28px]">
      {children}
    </div>
  </div>
);