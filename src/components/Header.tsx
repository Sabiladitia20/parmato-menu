'use client';

import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

export default function Header() {
  const { getItemCount, toggleCart } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-red)] to-[var(--primary-orange)] flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍛</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-dark)] tracking-tight">
                Parmato
              </h1>
              <p className="text-xs text-[var(--text-muted)] hidden sm:block">
                Masakan Padang Autentik
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#menu"
              className="text-[var(--text-body)] hover:text-[var(--primary-red)] font-medium transition-colors"
            >
              Menu
            </a>
            <a
              href="#tentang"
              className="text-[var(--text-body)] hover:text-[var(--primary-red)] font-medium transition-colors"
            >
              Tentang Kami
            </a>
          </nav>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-[var(--primary-red)] hover:bg-[var(--primary-red-dark)] text-white rounded-full font-semibold btn-transition shadow-lg shadow-red-500/25"
              aria-label="Buka keranjang belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Keranjang</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent-amber)] text-[var(--text-dark)] rounded-full text-xs font-bold flex items-center justify-center animate-pulse-light shadow-md">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[var(--text-dark)] hover:text-[var(--primary-red)] transition-colors"
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[var(--border)] animate-fade-in">
            <div className="flex flex-col gap-3">
              <a
                href="#menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-[var(--text-body)] hover:text-[var(--primary-red)] hover:bg-[var(--bg-warm)] rounded-lg font-medium transition-all"
              >
                Menu
              </a>
              <a
                href="#tentang"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-[var(--text-body)] hover:text-[var(--primary-red)] hover:bg-[var(--bg-warm)] rounded-lg font-medium transition-all"
              >
                Tentang Kami
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
