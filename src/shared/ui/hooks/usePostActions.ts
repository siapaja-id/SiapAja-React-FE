import { useCallback } from 'react';
import { useStore } from '@/src/store/main.store';

export const usePostActions = (id: string, votes: number) => {
  const voteValue = useStore(state => state.userVotes[id] || 0);
  const isReposted = useStore(state => state.userReposts.includes(id));
  const toggleVote = useStore(state => state.toggleVote);
  const toggleRepost = useStore(state => state.toggleRepost);

  const currentVotes = votes + voteValue;

  const handleUpvote = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVote(id, 1);
  }, [id, toggleVote]);

  const handleDownvote = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVote(id, -1);
  }, [id, toggleVote]);

  return {
    voteValue,
    isReposted,
    currentVotes,
    handleUpvote,
    handleDownvote,
    toggleRepost,
  };
};
