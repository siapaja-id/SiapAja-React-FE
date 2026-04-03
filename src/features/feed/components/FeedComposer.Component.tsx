import React from 'react';
import { Plus, X, Image as ImageIcon, Film, Mic, Paperclip, Maximize2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { useFeedComposer } from '@/src/features/feed/hooks/useFeedComposer';

export const FeedComposer: React.FC = () => {
  const {
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
  } = useFeedComposer();

  return (
    <>
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm max-w-2xl mx-auto" 
          />
        )}
      </AnimatePresence>

      <div className={isFullscreen ? "" : "mx-4 mt-4 mb-2"}>
        <motion.div
          layout
          className={`${
            isFullscreen
              ? 'fixed inset-0 z-[110] bg-surface flex flex-col max-w-2xl mx-auto border-x border-white/5 h-[100dvh]'
              : 'relative bg-surface-container border border-white/10 p-4 shadow-lg rounded-[28px]'
          } overflow-hidden`}
        >
          {isFullscreen && (
            <motion.div layout className="flex justify-between items-center p-4 border-b border-white/5 glass">
              <button onClick={() => setIsFullscreen(false)} className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest opacity-50">Create Task</h2>
              <button 
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
              >
                Continue
              </button>
            </motion.div>
          )}

          <div className={`flex gap-3 ${isFullscreen ? 'px-6 pt-6 pb-2 flex-grow flex-col overflow-hidden' : ''}`}>
            {!isFullscreen && (
              <div className="flex-shrink-0 pt-1">
                <UserAvatar src={currentUser.avatar} size="md" />
              </div>
            )}
            
            <div className={`flex flex-col relative ${isFullscreen ? 'flex-grow min-h-0' : ''}`}>
              {isFullscreen && (
                <div className="flex items-center gap-3 mb-4">
                  <UserAvatar src={currentUser.avatar} size="md" />
                  <span className="font-bold text-on-surface">{currentUser.name}</span>
                </div>
              )}
              <AutoResizeTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => !text.trim() && !isFullscreen && setIsFocused(false)}
                placeholder="What do you need help with? Describe your task in detail..."
                className={`w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none resize-none hide-scrollbar transition-all ${
                  isFullscreen ? 'text-2xl leading-relaxed font-medium' : 'text-15 pt-1.5'
                }`}
                minHeight={isFullscreen ? 400 : 40}
              />
              
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 mt-4"
                  >
                    {attachments.map((item, idx) => (
                      <div key={idx} className="relative group/item">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant">
                          {item.type === 'image' && <img src={item.url} className="w-full h-full object-cover" alt="Attachment" />}
                          {item.type === 'video' && <Film size={24} />}
                          {item.type === 'voice' && <Mic size={24} className="text-primary" />}
                          {item.type === 'file' && <Paperclip size={24} />}
                        </div>
                        <button 
                          onClick={() => removeAttachment(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addMockMedia('image')}
                      className="w-20 h-20 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1 text-2sm text-on-surface-variant hover:bg-white/5 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Add More</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {(isFocused || isFullscreen || text || attachments.length > 0) && (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center justify-between ${isFullscreen ? 'p-6 border-t border-white/5 bg-surface-container-high/30' : 'pt-3 mt-3 border-t border-white/5'}`}
              >
                <div className="flex items-center gap-0.5 text-primary">
                  <button onClick={() => addMockMedia('image')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Image"><ImageIcon size={18} /></button>
                  <button onClick={() => addMockMedia('video')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Video"><Film size={18} /></button>
                  <button onClick={() => addMockMedia('voice')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Voice"><Mic size={18} /></button>
                  <button onClick={() => addMockMedia('file')} className="p-2 hover:bg-primary/10 rounded-full transition-colors" title="Attach File"><Paperclip size={18} /></button>
                  {!isFullscreen && (
                    <button onClick={() => setIsFullscreen(true)} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-on-surface-variant" title="Fullscreen">
                      <Maximize2 size={18} />
                    </button>
                  )}
                </div>
                
                {!isFullscreen && (
                  <button 
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};
