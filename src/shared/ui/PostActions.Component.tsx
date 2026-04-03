import React from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Repeat2, Send } from 'lucide-react';
import { IconButtonProps, PostActionsProps } from '@/src/shared/types/ui.types';
import { usePostActions } from '@/src/shared/ui/hooks/usePostActions';

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon, 
  count, 
  active, 
  onClick, 
  className = "",
  activeColor = "text-primary",
  hoverBg = "hover:bg-on-surface/10"
}) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`flex items-center gap-1 p-1.5 -ml-1.5 rounded-full transition-all duration-200 active:scale-90 group ${hoverBg} ${className} ${active ? activeColor : 'text-on-surface-variant hover:text-on-surface'}`}
  >
    <Icon 
      size={18} 
      strokeWidth={active ? 2.5 : 2}
      className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'fill-current' : ''}`} 
    />
    {count !== undefined && count > 0 && (
      <span className="text-xs font-medium tracking-tight">
        {count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}
      </span>
    )}
  </button>
);

export const PostActions: React.FC<PostActionsProps> = ({
  id,
  votes,
  replies,
  reposts,
  shares,
  className = ""
}) => {
  const {
    voteValue,
    isReposted,
    currentVotes,
    handleUpvote,
    handleDownvote,
    toggleRepost,
  } = usePostActions(id, votes);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-0.5 sm:gap-2">
        <IconButton
          icon={MessageCircle}
          count={replies}
          hoverBg="hover:bg-blue-500/10"
          activeColor="text-blue-500"
        />
        <IconButton
          icon={Repeat2}
          count={reposts + (isReposted ? 1 : 0)}
          active={isReposted}
          onClick={() => toggleRepost(id)}
          hoverBg="hover:bg-emerald-500/10"
          activeColor="text-emerald-500"
        />
        <IconButton
          icon={Send}
          count={shares}
          hoverBg="hover:bg-purple-500/10"
          activeColor="text-purple-500"
        />
      </div>

      <div
        className="flex items-center bg-on-surface/5 hover:bg-on-surface/10 transition-colors rounded-full border border-outline-variant"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleUpvote}
          className={`p-1.5 pl-2 rounded-l-full flex items-center justify-center transition-all active:scale-90 ${voteValue === 1 ? 'text-orange-500' : 'text-on-surface-variant hover:text-orange-500 hover:bg-on-surface/5'}`}
        >
          <ArrowBigUp size={18} className={voteValue === 1 ? 'fill-current' : ''} strokeWidth={voteValue === 1 ? 2.5 : 2} />
        </button>
        <span className={`px-1 text-xs font-bold min-w-[1.2rem] text-center tracking-tight ${voteValue === 1 ? 'text-orange-500' : voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant'}`}>
          {Math.abs(currentVotes) >= 1000 ? `${(currentVotes/1000).toFixed(1)}k` : currentVotes}
        </span>
        <button
          onClick={handleDownvote}
          className={`p-1.5 pr-2 rounded-r-full flex items-center justify-center transition-all active:scale-90 ${voteValue === -1 ? 'text-indigo-400' : 'text-on-surface-variant hover:text-indigo-400 hover:bg-on-surface/5'}`}
        >
          <ArrowBigDown size={18} className={voteValue === -1 ? 'fill-current' : ''} strokeWidth={voteValue === -1 ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
};
