'use client';

import { X, User, Hash, Check, Loader2, AlertCircle, CreditCard, Banknote, QrCode } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useTableStore } from '@/store/tableStore';
import { formatPrice } from '@/data/menuData';
import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrderHistoryStore } from '@/store/orderHistoryStore';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStatus = 'form' | 'loading' | 'success';

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotal, clearCart, closeCart } = useCartStore();
  const { tableNumber: savedTable } = useTableStore();
  const { addOrderId } = useOrderHistoryStore();
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'kasir' | 'qris'>('kasir');
  const [errors, setErrors] = useState<{ name?: string; table?: string }>({});
  const [status, setStatus] = useState<CheckoutStatus>('form');
  const [orderId, setOrderId] = useState('');

  // Auto-fill table number from QR code scan
  useEffect(() => {
    if (savedTable && !tableNumber) {
      setTableNumber(savedTable);
    }
  }, [savedTable, isOpen]);

  const total = getTotal();

  const validateForm = (): boolean => {
    const newErrors: { name?: string; table?: string } = {};
    
    if (!customerName.trim()) {
      newErrors.name = 'Nama wajib diisi';
    } else if (customerName.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }
    
    if (!tableNumber.trim()) {
      newErrors.table = 'Nomor meja wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    
    try {
      // 1. Simpan ke tabel 'orders'
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerName.trim(),
            table_number: tableNumber.trim(),
            total_price: total,
            payment_method: paymentMethod,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Simpan item-itemnya ke tabel 'order_items'
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price,
        notes: item.notes || ''
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Set Order ID visual (singkat)
      setOrderId(`PRM-${orderData.id.slice(0, 8).toUpperCase()}`);
      
      // Save order ID to history
      addOrderId(orderData.id);
      
      setStatus('success');
      
      // Fire confetti!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrors({ name: `Gagal mengirim pesanan: ${err.message || 'Cek koneksi database'}` });
      setStatus('form');
    }
  };

  const handleClose = () => {
    if (status === 'success') {
      clearCart();
      closeCart();
    }
    setStatus('form');
    setCustomerName('');
    // Keep table number if it came from QR scan
    if (!savedTable) {
      setTableNumber('');
    }
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[60] animate-fade-in"
        onClick={status !== 'loading' ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
          {status === 'form' && (
            <>
              {/* Header */}
              <header className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <h2
                  id="checkout-title"
                  className="font-display text-2xl font-bold text-[var(--text-dark)]"
                >
                  Checkout
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[var(--bg-light)] rounded-full transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-6 h-6 text-[var(--text-muted)]" />
                </button>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Customer Name */}
                <div className="mb-4">
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-semibold text-[var(--text-dark)] mb-2"
                  >
                    Nama Pelanggan
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-light)]" />
                    <input
                      type="text"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className={`w-full pl-12 pr-4 py-3.5 bg-[var(--bg-light)] rounded-xl border-2 text-[var(--text-dark)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--primary-red)] transition-colors ${
                        errors.name
                          ? 'border-[var(--error)]'
                          : 'border-transparent'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-[var(--error)]">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Table Number */}
                <div className="mb-6">
                  <label
                    htmlFor="tableNumber"
                    className="block text-sm font-semibold text-[var(--text-dark)] mb-2"
                  >
                    Nomor Meja
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-light)]" />
                    <input
                      type="text"
                      id="tableNumber"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Contoh: A1, B5, 12"
                      className={`w-full pl-12 pr-4 py-3.5 bg-[var(--bg-light)] rounded-xl border-2 text-[var(--text-dark)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--primary-red)] transition-colors ${
                        errors.table
                          ? 'border-[var(--error)]'
                          : 'border-transparent'
                      }`}
                    />
                  </div>
                  {errors.table && (
                    <p className="mt-1.5 text-sm text-[var(--error)]">
                      {errors.table}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[var(--text-dark)] mb-3">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('kasir')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'kasir'
                          ? 'border-[var(--primary-red)] bg-red-50'
                          : 'border-gray-100 bg-[var(--bg-light)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Banknote className={`w-6 h-6 ${paymentMethod === 'kasir' ? 'text-[var(--primary-red)]' : 'text-[var(--text-muted)]'}`} />
                      <span className={`text-xs font-bold ${paymentMethod === 'kasir' ? 'text-[var(--primary-red)]' : 'text-[var(--text-muted)]'}`}>
                        Bayar di Kasir
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'qris'
                          ? 'border-[var(--primary-red)] bg-red-50'
                          : 'border-gray-100 bg-[var(--bg-light)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <QrCode className={`w-6 h-6 ${paymentMethod === 'qris' ? 'text-[var(--primary-red)]' : 'text-[var(--text-muted)]'}`} />
                      <span className={`text-xs font-bold ${paymentMethod === 'qris' ? 'text-[var(--primary-red)]' : 'text-[var(--text-muted)]'}`}>
                        QRIS (E-Wallet)
                      </span>
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-[var(--bg-warm)] rounded-2xl p-4 mb-6">
                  <h3 className="font-semibold text-[var(--text-dark)] mb-3">
                    Ringkasan Pesanan
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-[var(--text-body)]">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium text-[var(--text-dark)]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between">
                    <span className="font-semibold text-[var(--text-dark)]">
                      Total
                    </span>
                    <span className="font-bold text-lg text-[var(--primary-red)]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white rounded-2xl font-bold text-lg btn-transition shadow-lg shadow-red-500/25 hover:shadow-xl"
                >
                  Konfirmasi Pesanan
                </button>
              </form>
            </>
          )}

          {status === 'loading' && (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-red)] to-[var(--primary-orange)] rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-dark)] mb-2">
                Memproses Pesanan
              </h3>
              <p className="text-[var(--text-muted)] text-center">
                Mohon tunggu sebentar...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--success)] to-emerald-400 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--text-dark)] mb-2">
                Pesanan Berhasil!
              </h3>
              <p className="text-[var(--text-muted)] mb-6">
                Terima kasih, {customerName}! Pesanan Anda sedang diproses.
              </p>
              
              <div className="bg-[var(--bg-warm)] rounded-2xl p-4 w-full mb-6">
                <p className="text-sm text-[var(--text-muted)] mb-1">
                  Nomor Pesanan
                </p>
                <p className="font-mono text-xl font-bold text-[var(--primary-red)]">
                  {orderId}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-2">
                  Meja: <span className="font-semibold">{tableNumber}</span>
                  <span className="mx-2">•</span>
                  Metode: <span className="font-semibold">{paymentMethod === 'kasir' ? 'Bayar di Kasir' : 'QRIS'}</span>
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
                <p className="text-sm text-orange-800 leading-relaxed font-medium">
                  {paymentMethod === 'kasir' 
                    ? 'Silakan menuju kasir untuk melakukan pembayaran setelah makan atau tanyakan pelayan untuk bantuan.' 
                    : 'Pelayan akan segera membawakan kode QRIS resmi ke meja Anda untuk discan.'}
                </p>
              </div>
              
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Pesanan akan segera diantar ke meja Anda. Silakan tunggu di tempat.
              </p>

              <button
                onClick={handleClose}
                className="w-full py-4 bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white rounded-2xl font-bold text-lg btn-transition shadow-lg shadow-red-500/25"
              >
                Kembali ke Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
