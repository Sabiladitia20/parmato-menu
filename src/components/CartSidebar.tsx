'use client';

import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/menuData';
import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal, clearCart } =
    useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const total = getTotal();
  const isEmpty = items.length === 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl animate-slide-in-right flex flex-col safe-area-top safe-area-bottom"
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-red)] to-[var(--primary-orange)] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--text-dark)]">
                Keranjang
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {items.length} item
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-[var(--bg-light)] rounded-full transition-colors"
            aria-label="Tutup keranjang"
          >
            <X className="w-6 h-6 text-[var(--text-muted)]" />
          </button>
        </header>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 bg-[var(--bg-light)] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-[var(--text-light)]" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--text-dark)] mb-2">
                Keranjang Kosong
              </h3>
              <p className="text-[var(--text-muted)] text-sm max-w-[200px]">
                Yuk pilih menu favoritmu dan tambahkan ke keranjang!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-[var(--bg-light)] rounded-2xl animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Item Image/Emoji Placeholder */}
                  <div className="w-16 h-16 bg-[var(--bg-warm)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">
                      {item.category === 'ayam' && '🍗'}
                      {item.category === 'daging' && '🥩'}
                      {item.category === 'ikan' && '🐟'}
                      {item.category === 'minuman' && '🥤'}
                      {item.category === 'nasi' && '🍚'}
                      {item.category === 'sambal' && '🌶️'}
                    </span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--text-dark)] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[var(--primary-red)] font-bold">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[var(--bg-warm)] transition-colors border border-[var(--border)]"
                          aria-label={`Kurangi ${item.name}`}
                        >
                          <Minus className="w-4 h-4 text-[var(--text-body)]" />
                        </button>
                        <span className="w-8 text-center font-semibold text-[var(--text-dark)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[var(--bg-warm)] transition-colors border border-[var(--border)]"
                          aria-label={`Tambah ${item.name}`}
                        >
                          <Plus className="w-4 h-4 text-[var(--text-body)]" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[var(--text-light)] hover:text-[var(--error)] hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-[var(--text-muted)]">Subtotal</p>
                    <p className="font-bold text-[var(--text-dark)]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full py-3 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-red-50 rounded-xl font-medium transition-colors text-sm"
              >
                Kosongkan Keranjang
              </button>
            </div>
          )}
        </div>

        {/* Footer with Total & Checkout */}
        {!isEmpty && (
          <footer className="p-4 sm:p-6 border-t border-[var(--border)] bg-white">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--text-muted)]">Total Pesanan</span>
              <span className="text-2xl font-display font-bold text-[var(--primary-red)]">
                {formatPrice(total)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white rounded-2xl font-bold text-lg btn-transition shadow-lg shadow-red-500/25 hover:shadow-xl"
            >
              Checkout Sekarang
            </button>

            <p className="text-center text-xs text-[var(--text-light)] mt-3">
              Pesanan akan diproses setelah checkout
            </p>
          </footer>
        )}
      </aside>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
