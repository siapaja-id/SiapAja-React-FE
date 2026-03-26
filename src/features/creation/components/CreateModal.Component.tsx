import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Briefcase, Send, DollarSign, Clock, Tag, ChevronRight, Sparkles, Car, Package, Zap, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AIChatRequest } from '@/src/features/creation/components/AIChatRequest.Component';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { CreateType, SelectionButtonProps, SocialFormProps } from '@/src/features/creation/types/creation.types';
import { OrderData } from '@/src/shared/types/domain.type';

export const CreateModal: React.FC = () => {
  const navigate = useNavigate();
  const onClose = useStore(state => state.setShowCreateModal);
  const setOrderToReview = useStore(state => state.setOrderToReview);
  const initialAiQuery = useStore(state => state.initialAiQuery);
  const setInitialAiQuery = useStore(state => state.setInitialAiQuery);
  
  const [step, setStep] = useState<'select' | 'form'>(initialAiQuery ? 'form' : 'select');
  const [type, setType] = useState<CreateType>(initialAiQuery ? 'request' : null);

  const handleClose = () => {
    onClose(false);
    if (initialAiQuery) setInitialAiQuery(null);
  };

  const handleSelect = (selectedType: CreateType) => {
    setType(selectedType);
    setStep('form');
  };

  const handleBack = () => {
    setStep('select');
    setType(null);
    if (initialAiQuery) setInitialAiQuery(null);
  };

  const isFullPage = step === 'form' && type === 'request';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${isFullPage ? '' : 'p-6 max-w-2xl mx-auto border-x border-white/5'} bg-black/90 backdrop-blur-xl`}
    >
      <motion.div
        initial={isFullPage ? { y: '100%' } : { scale: 0.9, y: 20, opacity: 0 }}
        animate={isFullPage ? { y: 0 } : { scale: 1, y: 0, opacity: 1 }}
        exit={isFullPage ? { y: '100%' } : { scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`${isFullPage ? 'w-full h-full rounded-0' : 'w-full max-w-lg rounded-[40px] border border-white/10'} glass overflow-hidden shadow-2xl relative flex flex-col`}
      >
        {/* Header */}
        <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isFullPage ? 'pt-12' : ''}`}>
          <div className="flex items-center gap-3">
            {step === 'form' && (
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
            )}
            <h2 className="text-xl font-black text-on-surface tracking-tight uppercase">
              {step === 'select' ? 'Create New' : type === 'social' ? 'Share Update' : 'AI Assistant'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-8 overflow-y-auto hide-scrollbar flex-grow ${isFullPage ? 'max-w-2xl mx-auto w-full' : ''}`}>
          <AnimatePresence mode="wait">
            {step === 'select' ? (
              <motion.div
                key="select"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="grid grid-cols-1 gap-4"
              >
                <SelectionButton
                  icon={<MessageSquare size={28} />}
                  title="Share an Update"
                  description="Post portfolio work, news, or connect with the community."
                  onClick={() => {
                    handleClose();
                    navigate('/create-post');
                  }}
                  accent="primary"
                />
                <SelectionButton 
                  icon={<Sparkles size={28} />}
                  title="Request Service"
                  description="Chat with our AI to book a ride, delivery, or hire help."
                  onClick={() => handleSelect('request')}
                  accent="emerald"
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="h-full"
              >
                {type === 'social' ? (
                  <SocialForm onPost={handleClose} />
                ) : (
                  <AIChatRequest 
                    initialQuery={initialAiQuery || undefined}
                    onComplete={(data: OrderData) => {
                    setOrderToReview(data);
                    handleClose();
                    navigate('/review-order');
                  }} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SelectionButton: React.FC<SelectionButtonProps> = ({ icon, title, description, onClick, accent }) => (
  <button 
    onClick={onClick}
    className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${accent}/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${accent}/20 transition-all`} />
    <div className="relative z-10 flex items-start gap-6">
      <div className={`w-16 h-16 rounded-2xl bg-${accent}/10 border border-${accent}/20 flex items-center justify-center text-${accent} shadow-inner`}>
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-black text-on-surface mb-1 tracking-tight">{title}</h3>
        <p className="text-sm text-on-surface-variant opacity-70 leading-relaxed">{description}</p>
      </div>
      <div className="self-center text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors">
        <ChevronRight size={24} />
      </div>
    </div>
  </button>
);

const SocialForm: React.FC<SocialFormProps> = ({ onPost }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black">Content</label>
      <AutoResizeTextarea 
        autoFocus
        placeholder="What's on your mind? Share your latest work..."
        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/30 transition-colors"
        minHeight={160}
      />
    </div>
    
    <div className="flex items-center gap-4">
      <Button fullWidth className="flex-grow">
        <Send size={18} />
        Post Update
      </Button>
    </div>
  </div>
);


