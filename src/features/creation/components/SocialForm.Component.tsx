import React from 'react';
import { Send } from 'lucide-react';
import { Button, AutoResizeTextarea } from '@/src/shared/ui/SharedUI.Component';
import { SocialFormProps } from '@/src/features/creation/types/creation.types';

export const SocialForm: React.FC<SocialFormProps> = ({ onPost }) => (
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
      <Button fullWidth className="flex-grow" onClick={onPost}>
        <Send size={18} />
        Post Update
      </Button>
    </div>
  </div>
);
