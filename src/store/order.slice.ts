import { StateCreator } from 'zustand';
import { OrderData } from '../types/domain.type';

export interface OrderSlice {
  orderToReview: OrderData | null;
  setOrderToReview: (order: OrderData | null) => void;
}

export const createOrderSlice: StateCreator<OrderSlice> = (set) => ({
  orderToReview: null,
  setOrderToReview: (order) => set({ orderToReview: order }),
});