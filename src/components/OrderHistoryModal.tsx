'use client';

import { X, Clock, Check, Loader2, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useOrderHistoryStore } from '@/store/orderHistoryStore';
import { getOrderById, Order } from '@/lib/supabase-service';
import { formatPrice } from '@/data/menuData';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
  const { orderIds } = useOrderHistoryStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
      // Set up polling for real-time updates
      const interval = setInterval(loadOrders, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, orderIds]);

  const loadOrders = async () => {
    setLoading(true);
    const loadedOrders: Order[] = [];
    
    for (const id of orderIds) {
      const order = await getOrderById(id);
      if (order) {
        loadedOrders.push(order);
      }
    }
    
    setOrders(loadedOrders);
    setLoading(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Menunggu Konfirmasi', color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock className="w-4 h-4" /> };
      case 'confirmed':
        return { label: 'Sedang Dimasak', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case 'preparing':
        return { label: 'Sedang Disiapkan', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case 'completed':
        return { label: 'Selesai', color: 'text-green-600', bg: 'bg-green-50', icon: <Check className="w-4 h-4" /> };
      case 'cancelled':
        return { label: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-50', icon: <X className="w-4 h-4" /> };
      default:
        return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', icon: <Clock className="w-4 h-4" /> };
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[60] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)]">
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6 text-white" />
              <h2 className="font-display text-2xl font-bold text-white">
                Pesanan Saya
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Tutup"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-[var(--primary-red)] animate-spin mb-4" />
                <p className="text-[var(--text-muted)]">Memuat pesanan...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Pesanan</h3>
                <p className="text-gray-500">
                  Pesanan yang Anda buat akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-[var(--bg-light)] rounded-2xl p-5 border-2 border-[var(--border)] hover:border-[var(--primary-red)] transition-all"
                    >
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-[var(--text-muted)] mb-1">
                            {new Date(order.created_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="font-semibold text-[var(--text-dark)]">
                            {order.customer_name} • Meja {order.table_number}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.bg}`}>
                          {statusInfo.icon}
                          <span className={`text-xs font-bold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-white rounded-xl p-3 mb-3 space-y-2">
                        {order.order_items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-[var(--text-body)]">
                              {item.quantity}x {item.menu_item?.name || 'Item'}
                            </span>
                            <span className="font-medium text-[var(--text-dark)]">
                              {formatPrice(item.price_at_order * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Payment */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold">
                            {order.payment_method === 'kasir' ? '💵 Bayar di Kasir' : '📱 QRIS'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--text-muted)]">Total</p>
                          <p className="text-xl font-bold text-[var(--primary-red)]">
                            {formatPrice(order.total_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-warm)]">
            <p className="text-sm text-[var(--text-muted)] text-center">
              Status pesanan akan diperbarui secara otomatis
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
