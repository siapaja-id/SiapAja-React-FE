import { StateCreator } from 'zustand';
import { ChatMessage } from '@/src/shared/types/chat.types';
import { SAMPLE_CHATS } from '@/src/shared/constants/domain.constant';
import { ChatSlice } from '@/src/shared/types/store.types';

export type { ChatSlice } from '@/src/shared/types/store.types';

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  chatMessages: SAMPLE_CHATS,
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
});