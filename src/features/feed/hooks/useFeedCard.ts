import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import { Author } from '@/src/shared/types/auth.types';
import { FeedItem, SocialPostData } from '@/src/shared/types/feed.types';
import { ColumnContext } from '@/src/shared/contexts/column.context';

export const useFeedCard = (data: FeedItem, onClickOverride?: () => void, isQuote?: boolean, isParent?: boolean) => {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const isDesktop = useStore(state => state.isDesktop);
  const { id: columnId } = useContext(ColumnContext);

  const resolvedIsAuthor = currentUser.handle === data.author.handle;

  const handleCardClick = () => {
    if (onClickOverride) {
      onClickOverride();
      return;
    }
    if (isQuote || isParent) return;
    const path = data.type === 'task' ? `/task/${data.id}` : `/post/${data.id}`;
    if (isDesktop) openColumn(path, columnId);
    else navigate(path);
  };

  const handleUserClick = (user: Author) => {
    if (isDesktop) openColumn('/profile', columnId, { user });
    else navigate('/profile', { state: { user } });
  };

  return {
    resolvedIsAuthor,
    handleCardClick,
    handleUserClick,
  };
};

export const useSocialPost = (data: SocialPostData, routeId?: string) => {
  const updateReply = useStore(state => state.updateReply);
  const currentUser = useStore(state => state.currentUser);

  const isCreator = currentUser.handle === data.author.handle;
  const canAcceptBid = data.bid && data.bid.status !== 'accepted' && !isCreator;

  const handleAcceptBid = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (routeId && data.bid) {
      updateReply<SocialPostData>(routeId, data.id, { bid: { ...data.bid, status: 'accepted' } });
    }
  };

  return { isCreator, canAcceptBid, handleAcceptBid };
};
