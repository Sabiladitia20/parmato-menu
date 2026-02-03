'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header, Hero, CategoryNav, MenuGrid, CartSidebar, MenuDetailModal } from '@/components';
import OrderHistoryModal from '@/components/OrderHistoryModal';
import { getCategories } from '@/lib/supabase-service';
import { Category, CategoryInfo, MenuItem as MenuItemType } from '@/types';
import { useTableStore } from '@/store/tableStore';
import { useOrderHistoryStore } from '@/store/orderHistoryStore';
import { Receipt } from 'lucide-react';

// Separate component to handle URL params (needs Suspense)
function TableHandler() {
  const searchParams = useSearchParams();
  const { setTableNumber } = useTableStore();

  useEffect(() => {
    const tableFromUrl = searchParams.get('table');
    if (tableFromUrl) {
      setTableNumber(tableFromUrl);
    }
  }, [searchParams, setTableNumber]);

  return null;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('');
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const { orderIds } = useOrderHistoryStore();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].id);
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <TableHandler />
      </Suspense>
      <Header />
      <CartSidebar />
      <OrderHistoryModal isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
      <MenuDetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
      
      {/* Floating Order History Button */}
      {orderIds.length > 0 && (
        <button
          onClick={() => setShowOrderHistory(true)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all font-semibold animate-bounce-light"
          aria-label="Lihat Pesanan Saya"
        >
          <Receipt className="w-5 h-5" />
          <span className="hidden sm:inline">Pesanan Saya</span>
          <span className="bg-white text-[var(--primary-red)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {orderIds.length}
          </span>
        </button>
      )}
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />

        {/* Menu Section */}
        <section id="menu" className="scroll-mt-[72px]">
          <CategoryNav
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={categories}
          />
          {activeCategory && (
            <MenuGrid 
              category={activeCategory} 
              onSelectItem={setSelectedItem} 
            />
          )}
        </section>

        {/* About Section */}
        <section
          id="tentang"
          className="py-16 sm:py-24 bg-gradient-to-b from-[var(--bg-cream)] to-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="text-center md:text-left">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-4">
                  Tentang{' '}
                  <span className="text-[var(--primary-red)]">Parmato</span>
                </h2>
                <p className="text-[var(--text-body)] mb-6 leading-relaxed">
                  Parmato hadir untuk membawa cita rasa autentik masakan Padang ke
                  meja makan Anda. Dengan resep turun-temurun dan bahan berkualitas
                  tinggi, kami berkomitmen menyajikan hidangan yang tidak hanya
                  lezat, tetapi juga mengingatkan Anda pada kehangatan kampung
                  halaman.
                </p>
                <p className="text-[var(--text-body)] mb-8 leading-relaxed">
                  Setiap hidangan kami dibuat dengan cinta dan perhatian penuh,
                  mulai dari rendang yang dimasak berjam-jam hingga sambal hijau
                  yang segar setiap hari.
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[var(--bg-light)] rounded-xl">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        Berpengalaman
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Sejak 2010
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[var(--bg-light)] rounded-xl">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        100% Halal
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Terjamin
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[var(--bg-light)] rounded-xl">
                    <span className="text-2xl">🍃</span>
                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        Bahan Segar
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Setiap hari
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[var(--bg-light)] rounded-xl">
                    <span className="text-2xl">👨‍🍳</span>
                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        Chef Berpengalaman
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Koki asli Minang
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image/Visual */}
              <div className="relative flex items-center justify-center">
                <div className="w-full max-w-md aspect-square bg-gradient-to-br from-[var(--bg-warm)] to-[var(--bg-light)] rounded-3xl flex items-center justify-center relative overflow-hidden shadow-xl">
                  {/* Main Image Placeholder */}
                  <span className="text-[120px] sm:text-[160px]">🍛</span>

                  {/* Floating Elements */}
                  <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce-light">
                    <span className="text-3xl">🥩</span>
                  </div>
                  <div
                    className="absolute bottom-8 right-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce-light"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <span className="text-3xl">🍗</span>
                  </div>
                  <div
                    className="absolute top-1/2 right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce-light"
                    style={{ animationDelay: '0.6s' }}
                  >
                    <span className="text-2xl">🌶️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--text-dark)] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-red)] to-[var(--primary-orange)] flex items-center justify-center">
                    <span className="text-xl">🍛</span>
                  </div>
                  <span className="font-display text-xl font-bold">Parmato</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Masakan Padang Autentik
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4">Kontak</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>📍 Jl. Contoh No. 123, Kota</p>
                  <p>📞 +62 812 3456 7890</p>
                  <p>✉️ info@parmato.com</p>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h4 className="font-semibold mb-4">Jam Operasional</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Senin - Jumat: 10:00 - 22:00</p>
                  <p>Sabtu - Minggu: 09:00 - 23:00</p>
                </div>
              </div>

              {/* Social */}
              <div>
                <h4 className="font-semibold mb-4">Ikuti Kami</h4>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Instagram"
                  >
                    📷
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Facebook"
                  >
                    👍
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="WhatsApp"
                  >
                    💬
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-500">
              <p>© 2024 Parmato. Semua hak cipta dilindungi.</p>
              <a 
                href="/admin/login" 
                className="inline-block mt-2 text-gray-600 hover:text-amber-400 transition-colors"
              >
                🔐 Admin
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
