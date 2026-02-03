// TypeScript interfaces untuk Parmato Digital Menu

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: Category;
  image?: string;
  available: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'kasir' | 'qris';
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: Date;
}

export type Category = string;

export interface CategoryInfo {
  id: string;
  label: string;
  emoji: string;
  sort_order?: number;
}
