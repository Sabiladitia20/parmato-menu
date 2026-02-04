'use client';

import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useSearchStore } from '@/store/searchStore';
import { useState } from 'react';

export default function Header() {
  const { getItemCount, toggleCart } = useCartStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center max-w-2xl px-8">
            <div className="relative w-full group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-[var(--primary-red)]' : 'text-[var(--text-light)] group-focus-within:text-[var(--primary-red)]'}`} />
              <input
                type="text"
                placeholder="Cari Rendang, Ayam Pop, atau Es Jeruk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-light)] border border-[var(--border)] rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]/10 focus:border-[var(--primary-red)] transition-all text-sm font-medium placeholder:text-[var(--text-light)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--bg-warm)] rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-[var(--text-muted)]" />
                </button>
              )}
            </div>
            
            <nav className="flex items-center gap-8 ml-4 flex-shrink-0">
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
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Search Trigger */}
            <button
               onClick={() => setIsSearchExpanded(!isSearchExpanded)}
               className="md:hidden p-2 text-[var(--text-dark)] hover:text-[var(--primary-red)] transition-colors"
               aria-label="Cari menu"
            >
               <Search className="w-6 h-6" />
            </button>
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

        {/* Mobile Search Bar */}
        {isSearchExpanded && (
          <div className="md:hidden py-3 border-t border-[var(--border)] animate-fade-in px-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-light)]" />
              <input
                type="text"
                autoFocus
                placeholder="Cari menu favorit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-light)] border border-[var(--border)] rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]/10 text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
                >
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              )}
            </div>
          </div>
        )}

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
