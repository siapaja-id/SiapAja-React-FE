import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SelectionButtonProps } from '@/src/shared/types/creation.types';

export const SelectionButton: React.FC<SelectionButtonProps> = ({ icon, title, description, onClick, accent }) => {
  const accentStyles = {
    primary: {
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      text: 'text-primary',
      glow: 'group-hover:bg-primary/20'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      glow: 'group-hover:bg-emerald-500/20'
    }
  };

  const style = accentStyles[accent];

  return (
    <button 
      onClick={onClick}
      className="group relative p-6 rounded-3xl bg-on-surface/5 border border-outline-variant hover:bg-on-surface/10 transition-all text-left overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${style.bg} blur-3xl rounded-full -mr-16 -mt-16 ${style.glow} transition-all`} />
      <div className="relative z-10 flex items-start gap-6">
        <div className={`w-16 h-16 rounded-2xl ${style.bg} border ${style.border} flex items-center justify-center ${style.text} shadow-inner`}>
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
};
