import { create } from 'zustand';
import { AppSlice } from '@/src/shared/types/app.types';
import { createAppSlice } from './app.slice';
import { FeedSlice, createFeedSlice } from './feed.slice';
import { OrderSlice, createOrderSlice } from './order.slice';
import { ChatSlice, createChatSlice } from './chat.slice';
import { StoreState } from '@/src/shared/types/store.types';

export type { StoreState } from '@/src/shared/types/store.types';

export const useStore = create<StoreState>()((...a) => ({
  ...createAppSlice(...a),
  ...createFeedSlice(...a),
  ...createOrderSlice(...a),
  ...createChatSlice(...a),
}));