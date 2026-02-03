'use client';

import { X, Plus, Minus, Check, ShoppingCart } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types';
import { formatPrice } from '@/data/menuData';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import Image from 'next/image';

interface MenuDetailModalProps {
  item: MenuItemType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDetailModal({ item, isOpen, onClose }: MenuDetailModalProps) {
  const { addItem, updateQuantity, items } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!item || !isOpen) return null;

  const cartItem = items.find((i) => i.id === item.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    setIsAdding(true);
    // If already in cart, we can either add more or set to specific quantity
    // Let's make it add the selected quantity
    for (let i = 0; i < quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
        });
    }
    
    setTimeout(() => {
      setIsAdding(false);
      onClose();
      setQuantity(1);
    }, 600);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[70] backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in pointer-events-auto">
          {/* Image Header */}
          <div className="relative h-64 sm:h-80 w-full bg-gradient-to-br from-[var(--bg-warm)] to-[var(--bg-light)]">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">
                 {item.category === 'ayam' && '🍗'}
                 {item.category === 'daging' && '🥩'}
                 {item.category === 'ikan' && '🐟'}
                 {item.category === 'minuman' && '🥤'}
                 {item.category === 'nasi' && '🍚'}
                 {item.category === 'sambal' && '🌶️'}
                 {!['ayam', 'daging', 'ikan', 'minuman', 'nasi', 'sambal'].includes(item.category) && '🍽️'}
              </div>
            )}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-display text-3xl font-bold text-[var(--text-dark)] leading-tight">
                {item.name}
              </h2>
              <span className="text-2xl font-bold text-[var(--primary-red)]">
                {formatPrice(item.price)}
              </span>
            </div>

            <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
              {item.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 bg-[var(--bg-light)] p-2 rounded-2xl border border-[var(--border)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[var(--text-dark)] hover:text-[var(--primary-red)] shadow-sm transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-8 text-center font-bold text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[var(--text-dark)] hover:text-[var(--primary-red)] shadow-sm transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                disabled={!item.available || isAdding}
                className={`
                  flex-1 w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold text-lg
                  transition-all duration-500 shadow-lg
                  ${
                    isAdding
                      ? 'bg-[var(--success)] text-white scale-95'
                      : 'bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white hover:shadow-red-500/30'
                  }
                `}
              >
                {isAdding ? (
                  <>
                    <Check className="w-6 h-6 animate-scale-in" />
                    <span>Sukses Menambah!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span>Tambahkan ke Keranjang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
