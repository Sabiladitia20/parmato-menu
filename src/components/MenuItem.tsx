'use client';

import { Plus, Check } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types';
import { formatPrice } from '@/data/menuData';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import Image from 'next/image';

interface MenuItemProps {
  item: MenuItemType;
  index: number;
}

export default function MenuItem({ item, index }: MenuItemProps) {
  const { addItem, items } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const cartItem = items.find((i) => i.id === item.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!item.available) return;
    
    setIsAdding(true);
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
    });
    
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div
      className={`
        group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl
        border border-[var(--border)] card-hover animate-fade-in
        ${!item.available ? 'opacity-60' : ''}
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-[var(--bg-warm)] to-[var(--bg-light)] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">
              {item.category === 'ayam' && '🍗'}
              {item.category === 'daging' && '🥩'}
              {item.category === 'ikan' && '🐟'}
              {item.category === 'minuman' && '🥤'}
              {item.category === 'nasi' && '🍚'}
              {item.category === 'sambal' && '🌶️'}
              {!['ayam', 'daging', 'ikan', 'minuman', 'nasi', 'sambal'].includes(item.category) && '🍽️'}
            </span>
          </div>
        )}
        
        {/* Availability Badge */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-[var(--error)] text-white px-4 py-2 rounded-full font-semibold text-sm">
              Habis
            </span>
          </div>
        )}
        
        {/* Quantity Badge */}
        {quantityInCart > 0 && (
          <div className="absolute top-3 right-3 bg-[var(--primary-red)] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg animate-scale-in">
            {quantityInCart}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Name & Description */}
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-dark)] mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2 min-h-[40px]">
          {item.description}
        </p>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-[var(--primary-red)]">
              {formatPrice(item.price)}
            </p>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!item.available || isAdding}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
              transition-all duration-300 btn-transition
              ${
                isAdding
                  ? 'bg-[var(--success)] text-white'
                  : item.available
                  ? 'bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white hover:shadow-lg hover:shadow-red-500/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            aria-label={`Tambah ${item.name} ke keranjang`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Ditambahkan</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
