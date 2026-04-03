import { useState } from 'react';
import { useStore } from '@/src/store/main.store';
import { SAMPLE_INBOX_THREADS } from '@/src/shared/data/mock-chats';
import { CATEGORY_ICONS } from '@/src/shared/constants/category-icons';

type FilterType = 'All' | 'Unread' | 'Tasks';

export const useInbox = () => {
  const setActiveChat = useStore(state => state.setActiveChat);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);
  const [filter, setFilter] = useState<FilterType>('All');

  const handleOpenChat = (thread: any) => {
    setActiveChat(thread);
    setShowChatRoom(true);
  };

  const filters: FilterType[] = ['All', 'Unread', 'Tasks'];

  return {
    threads: SAMPLE_INBOX_THREADS,
    filter,
    setFilter,
    filters,
    handleOpenChat,
    CATEGORY_ICONS,
  };
};
