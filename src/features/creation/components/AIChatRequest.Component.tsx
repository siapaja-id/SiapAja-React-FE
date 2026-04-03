import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, ChevronRight, MapPin, DollarSign, FileText, X, Zap, Plus, ImageIcon, Camera, Mic, Paperclip, CheckCircle2, AlignLeft } from 'lucide-react';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { PropertyRow } from '@/src/features/creation/components/PropertyRow.Component';
import { AIChatRequestProps } from '@/src/shared/types/creation.types';
import { OrderData } from '@/src/shared/types/order.types';
import { useAIChat } from '@/src/features/creation/hooks/useAIChat';

export const AIChatRequest: React.FC<AIChatRequestProps & { initialQuery?: string }> = ({ onComplete, onClose, onBack, initialQuery }) => {
  const {
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
  } = useAIChat(initialQuery);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="pt-12 pb-3 px-4 flex items-center justify-between bg-header-bg z-20 shrink-0 border-b border-on-surface/5">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full text-on-header-secondary transition-colors">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          
          <div className="bg-black/20 p-1 rounded-full relative w-48 shadow-inner border border-white/10">
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-container-highest rounded-full shadow-sm border border-white/10 transition-all duration-300 ease-out"
              style={{ transform: view === 'chat' ? 'translateX(0)' : 'translateX(100%)' }}
            />
            <button 
              onClick={() => setView('chat')} 
              className={`flex-1 relative z-10 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-colors ${view === 'chat' ? 'text-on-header' : 'text-on-header-secondary hover:text-on-header'}`}
            >
              <Bot size={14} /> Chat
            </button>
            <button 
              onClick={() => { setView('canvas'); setHasUnreadDraft(false); }} 
              className={`flex-1 relative z-10 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-colors ${view === 'canvas' ? 'text-on-header' : 'text-on-header-secondary hover:text-on-header'}`}
            >
              <FileText size={14} /> Canvas
              {hasUnreadDraft && view === 'chat' && (
                <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              )}
            </button>
          </div>

          <button onClick={onClose} className="p-2 -mr-2 hover:bg-white/10 rounded-full text-on-header-secondary transition-colors">
            <X size={24} />
          </button>
        </div>

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
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 to-transparent animate-pulse" />
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
                        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant text-primary flex items-center justify-center flex-shrink-0 mt-auto shadow-sm">
                          <Bot size={14} />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className={`px-5 py-3.5 text-15 leading-relaxed shadow-sm break-words relative ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-[24px] rounded-br-[8px]' 
                            : 'bg-surface-container-low border border-outline-variant text-on-surface rounded-[24px] rounded-bl-[8px]'
                        }`}>
                          {msg.content}
                        </div>
                        
                        {msg.type === 'map-widget' && (
                          <div className="bg-surface-container border border-outline-variant rounded-[24px] p-2 overflow-hidden w-64 shadow-md">
                            <div className="h-24 bg-surface-container-highest relative rounded-2xl overflow-hidden mb-2">
                               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-50" />
                               <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <MapPin size={20} className="text-emerald-500" />
                                 </div>
                               </div>
                            </div>
                            <div className="px-2 pb-2">
                              <h4 className="font-bold text-sm text-on-surface">Location Required</h4>
                              <p className="text-xs text-on-surface-variant mb-3">Tap to drop a pin.</p>
                              <Button 
                                variant="emerald" size="sm" fullWidth
                                onClick={() => handleOpenMap((loc) => {
                                  updateDraft({ locations: [...(draft.locations || []), loc] });
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
                      <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant text-primary flex items-center justify-center mt-auto shadow-sm">
                        <Bot size={14} />
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant px-5 py-4 rounded-[24px] rounded-bl-[8px] flex gap-1.5 items-center">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }} className="w-1.5 h-1.5 bg-on-surface-variant/60 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }} className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pointer-events-none">
                <div className="relative flex items-end gap-2 bg-surface-container-high border border-outline-variant rounded-[28px] p-1.5 shadow-2xl pointer-events-auto">
                  <button onClick={insertMediaToCanvas} className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 rounded-full shrink-0 transition-colors">
                    <Plus size={22} />
                  </button>
                  <AutoResizeTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Message AI..."
                    className="w-full text-on-surface placeholder:text-on-surface-variant/40 py-3 text-15"
                    minHeight={44}
                    maxHeight={120}
                  />
                  {input.trim() ? (
                    <button onClick={() => handleSend()} className="w-9 h-9 mb-1 mr-1 bg-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-90">
                      <Send size={16} className="ml-0.5" />
                    </button>
                  ) : (
                    <button className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 rounded-full shrink-0 transition-colors">
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
                  <AutoResizeTextarea
                    value={draft.title || ''}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="Untitled Document"
                    className="w-full bg-transparent text-4xl font-black text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none mb-6 leading-tight"
                    minHeight={48}
                  />

                  <div className="flex flex-col border-y border-on-surface/5 py-2 mb-8 bg-on-surface/[0.01] rounded-2xl px-4">
                    <PropertyRow icon={<Zap size={16} />} label="Execution">
                      <div className="flex bg-surface-container-high border border-outline-variant rounded-lg p-0.5">
                        <button 
                          onClick={() => updateDraft({ matchType: 'swipe' })}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${draft.matchType === 'swipe' ? 'bg-emerald-500 text-black shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                          Swipe Match
                        </button>
                        <button 
                          onClick={() => updateDraft({ matchType: 'bidding' })}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${draft.matchType === 'bidding' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                          Feed Bidding
                        </button>
                      </div>
                    </PropertyRow>

                    <PropertyRow icon={<Bot size={16} />} label="Auto-Accept">
                      <button
                        onClick={() => updateDraft({ autoAccept: !draft.autoAccept })}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${draft.autoAccept ? 'bg-emerald-500' : 'bg-surface-container-highest border border-outline-variant'}`}
                      >
                        <motion.div
                          layout
                          className={`w-4 h-4 rounded-full bg-white shadow-sm ${draft.autoAccept ? 'ml-auto' : ''}`}
                        />
                      </button>
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
                          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high border border-outline-variant rounded-md text-xs font-medium text-on-surface group">
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

                  <div className="relative group">
                    <AutoResizeTextarea
                      value={draft.summary || ''} 
                      onChange={(e) => updateDraft({ summary: e.target.value })}
                      placeholder="Type '/' for commands, or just start writing your request details..."
                      className="w-full bg-transparent text-lg leading-relaxed text-on-surface/90 placeholder:text-on-surface-variant/30 focus:outline-none min-h-[300px]"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-surface border-t border-on-surface/5 p-4 pb-6">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                  <div className="flex items-center gap-4 px-2 text-on-surface-variant overflow-x-auto hide-scrollbar">
                    <button onClick={insertMediaToCanvas} className="p-2 hover:bg-on-surface/5 rounded-xl transition-colors flex items-center gap-2">
                      <ImageIcon size={18} /> <span className="text-xs font-bold">Image</span>
                    </button>
                    <button className="p-2 hover:bg-on-surface/5 rounded-xl transition-colors flex items-center gap-2">
                      <Camera size={18} /> <span className="text-xs font-bold">Camera</span>
                    </button>
                    <button className="p-2 hover:bg-on-surface/5 rounded-xl transition-colors flex items-center gap-2">
                      <Paperclip size={18} /> <span className="text-xs font-bold">File</span>
                    </button>
                    <div className="w-[1px] h-4 bg-on-surface/10 mx-2" />
                    <button className="p-2 hover:bg-on-surface/5 rounded-xl transition-colors">
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

      <AnimatePresence>
        {showMap && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 z-[90]"
              onClick={() => setShowMap(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 h-[80vh] bg-surface rounded-t-[32px] overflow-hidden z-[100] flex flex-col border-t border-on-surface/5 sheet-shadow"
            >
              <div className="pt-3 pb-2 flex flex-col items-center bg-surface shrink-0 z-10">
                <div className="w-12 h-1.5 bg-on-surface/20 rounded-full mb-4" />
                <div className="w-full px-6 flex justify-between items-center">
                  <h3 className="text-xl font-black text-on-surface">Set Location</h3>
                  <button onClick={() => setShowMap(false)} className="w-8 h-8 rounded-full bg-on-surface/5 flex items-center justify-center text-on-surface-variant hover:text-on-surface">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="relative flex-grow bg-surface-container-highest">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="relative -mt-10 text-emerald-500">
                    <MapPin size={48} strokeWidth={2} className="fill-emerald-500/20" />
                  </motion.div>
                </div>
              </div>

              <div className="p-6 bg-surface shrink-0 border-t border-on-surface/5 relative z-10 pb-8">
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
