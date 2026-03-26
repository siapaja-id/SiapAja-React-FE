import { StateCreator } from 'zustand';
import { ChatMessage } from '@/src/shared/types/domain.type';
import { SAMPLE_CHATS } from '@/src/shared/constants/domain.constant';

export interface ChatSlice {
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  chatMessages: SAMPLE_CHATS,
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
});