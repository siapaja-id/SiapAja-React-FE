import { StateCreator } from 'zustand';
import { OrderData } from '@/src/shared/types/order.types';
import { OrderSlice } from '@/src/shared/types/store.types';

export type { OrderSlice } from '@/src/shared/types/store.types';

export const createOrderSlice: StateCreator<OrderSlice> = (set) => ({
  orderToReview: null,
  setOrderToReview: (order) => set({ orderToReview: order }),
});