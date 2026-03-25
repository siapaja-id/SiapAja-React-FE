import { StateCreator } from 'zustand';
import { ChatMessage } from '../types/domain.type';
import { SAMPLE_CHATS } from '../constants/domain.constant';

export interface ChatSlice {
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  chatMessages: SAMPLE_CHATS,
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
});