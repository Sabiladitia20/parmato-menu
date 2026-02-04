import { supabase } from './supabase';
import { MenuItem, CategoryInfo, CartItem } from '@/types';

// ============================================
// CATEGORY SERVICES
// ============================================

export async function getCategories(): Promise<CategoryInfo[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data.map(cat => ({
    id: cat.id,
    label: cat.label,
    emoji: cat.emoji,
    sort_order: cat.sort_order,
  }));
}

export async function createCategory(cat: Omit<CategoryInfo, 'id'> & { id: string }): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .insert(cat);

  if (error) {
    console.error('Error creating category:', error);
    return false;
  }

  return true;
}

export async function updateCategory(id: string, cat: Partial<CategoryInfo>): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .update(cat)
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    return false;
  }

  return true;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }

  return true;
}

// ============================================
// MENU ITEM SERVICES
// ============================================

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description || '',
    category: item.category_id,
    image: item.image,
    available: item.available,
  }));
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('available', true)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description || '',
    category: item.category_id,
    image: item.image,
    available: item.available,
  }));
}

export async function createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      name: item.name,
      price: item.price,
      description: item.description,
      category_id: item.category,
      image: item.image,
      available: item.available,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating menu item:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    description: data.description || '',
    category: data.category_id,
    image: data.image,
    available: data.available,
  };
}

export async function updateMenuItem(id: number, item: Partial<MenuItem>): Promise<boolean> {
  const updateData: Record<string, unknown> = {};
  if (item.name !== undefined) updateData.name = item.name;
  if (item.price !== undefined) updateData.price = item.price;
  if (item.description !== undefined) updateData.description = item.description;
  if (item.category !== undefined) updateData.category_id = item.category;
  if (item.image !== undefined) updateData.image = item.image;
  if (item.available !== undefined) updateData.available = item.available;
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('menu_items')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating menu item:', error);
    return false;
  }

  return true;
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }

  return true;
}

export async function uploadMenuImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('menu-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// ============================================
// ORDER SERVICES
// ============================================

export interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price_at_order: number;
  notes?: string;
  menu_item?: {
    name: string;
    category_id: string;
  };
}

export interface Order {
  id: string;
  customer_name: string;
  table_number: string;
  total_price: number;
  payment_method: 'kasir' | 'qris';
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        menu_item_id,
        quantity,
        price_at_order,
        notes,
        menu_items (
          name,
          category_id
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  // Transform data to flatten menu_items inside order_items
  return data.map((order) => ({
    ...order,
    order_items: order.order_items?.map((item: { id: number; menu_item_id: number; quantity: number; price_at_order: number; notes?: string; menu_items: { name: string; category_id: string } }) => ({
      id: item.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_order: item.price_at_order,
      notes: item.notes,
      menu_item: item.menu_items,
    })),
  }));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        menu_item_id,
        quantity,
        price_at_order,
        notes,
        menu_items (
          name,
          category_id
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching order by ID:', error);
    return null;
  }

  return {
    ...data,
    order_items: data.order_items?.map((item: { id: number; menu_item_id: number; quantity: number; price_at_order: number; notes?: string; menu_items: { name: string; category_id: string } }) => ({
      id: item.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_order: item.price_at_order,
      notes: item.notes,
      menu_item: item.menu_items,
    })),
  };
}

export async function getOrdersByStatus(status: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        menu_item_id,
        quantity,
        price_at_order,
        notes,
        menu_items (
          name,
          category_id
        )
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders by status:', error);
    return [];
  }

  return data.map((order) => ({
    ...order,
    order_items: order.order_items?.map((item: { id: number; menu_item_id: number; quantity: number; price_at_order: number; notes?: string; menu_items: { name: string; category_id: string } }) => ({
      id: item.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_order: item.price_at_order,
      notes: item.notes,
      menu_item: item.menu_items,
    })),
  }));
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting order:', error);
    return false;
  }

  return true;
}

// ============================================
// AUTH SERVICES (untuk Admin)
// ============================================

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    return false;
  }
  return true;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: unknown) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export function subscribeToOrders(callback: (order: Order) => void) {
  return supabase
    .channel('orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        callback(payload.new as Order);
      }
    )
    .subscribe();
}
