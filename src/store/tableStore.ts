import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TableStore {
  tableNumber: string;
  setTableNumber: (table: string) => void;
  clearTable: () => void;
}

export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      tableNumber: '',
      setTableNumber: (table) => set({ tableNumber: table }),
      clearTable: () => set({ tableNumber: '' }),
    }),
    {
      name: 'parmato-table',
    }
  )
);
