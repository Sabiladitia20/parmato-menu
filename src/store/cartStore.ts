import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number, notes?: string) => void;
  updateQuantity: (id: number, quantity: number, notes?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const qtyToAdd = item.quantity || 1;
        // Check if item with same ID AND same notes already exists
        const existingItemIndex = items.findIndex(
          (i) => i.id === item.id && i.notes === item.notes
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + qtyToAdd,
          };
          set({ items: updatedItems });
        } else {
          set({ 
            items: [...items, { 
              ...item, 
              quantity: qtyToAdd,
              notes: item.notes || '' // Ensure notes is at least empty string
            }] 
          });
        }
      },

      removeItem: (id, notes) => {
        set({ 
          items: get().items.filter((i) => !(i.id === id && i.notes === notes)) 
        });
      },
      
      updateQuantity: (id, quantity, notes) => {
        if (quantity <= 0) {
          get().removeItem(id, notes);
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id && i.notes === notes ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: 'parmato-cart', // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen
    }
  )
);
