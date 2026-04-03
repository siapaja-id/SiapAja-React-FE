import { useStore } from '@/src/store/main.store';

export const useFollowButton = (handle: string, showIfMe: boolean = false) => {
  const currentUser = useStore(state => state.currentUser);
  const followedHandles = useStore(state => state.followedHandles);
  const toggleFollow = useStore(state => state.toggleFollow);

  const shouldRender = !(currentUser.handle === handle && !showIfMe);
  const isFollowing = followedHandles.includes(handle);

  return { shouldRender, isFollowing, toggleFollow };
};
