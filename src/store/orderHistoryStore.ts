import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderHistoryStore {
  orderIds: string[];
  addOrderId: (orderId: string) => void;
  clearHistory: () => void;
}

export const useOrderHistoryStore = create<OrderHistoryStore>()(
  persist(
    (set) => ({
      orderIds: [],
      addOrderId: (orderId) =>
        set((state) => ({
          orderIds: [orderId, ...state.orderIds].slice(0, 10), // Keep last 10 orders
        })),
      clearHistory: () => set({ orderIds: [] }),
    }),
    {
      name: 'parmato-order-history',
    }
  )
);
