'use client';

import { Sparkles, ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden pt-[72px]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-cream)] via-[var(--bg-light)] to-[var(--bg-warm)]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--primary-red)] opacity-10 rounded-full blur-2xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-[var(--accent-amber)] opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-[var(--primary-orange)] opacity-10 rounded-full blur-2xl" />
        
        {/* Food Emojis floating */}
        <div className="absolute top-[20%] left-[10%] text-4xl opacity-20 animate-bounce-light">🍛</div>
        <div className="absolute top-[30%] right-[15%] text-3xl opacity-20 animate-bounce-light" style={{ animationDelay: '0.5s' }}>🥩</div>
        <div className="absolute bottom-[30%] left-[20%] text-3xl opacity-20 animate-bounce-light" style={{ animationDelay: '1s' }}>🍗</div>
        <div className="absolute bottom-[20%] right-[10%] text-4xl opacity-20 animate-bounce-light" style={{ animationDelay: '0.3s' }}>🌶️</div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[var(--accent-amber)]" />
          <span className="text-sm font-medium text-[var(--text-body)]">
            Masakan Padang Autentik
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-dark)] mb-4 sm:mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Selamat Datang di{' '}
          <span className="bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] bg-clip-text text-transparent">
            Parmato
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[var(--text-body)] mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Nikmati cita rasa masakan Padang yang legendaris. Dari rendang yang kaya rempah hingga sambal yang pedas menggoda.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToMenu}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white rounded-full font-bold text-lg btn-transition shadow-lg shadow-red-500/25 hover:shadow-xl animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          Lihat Menu
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[var(--primary-red)]">20+</p>
            <p className="text-sm text-[var(--text-muted)]">Menu Pilihan</p>
          </div>
          <div className="w-px h-12 bg-[var(--border)] hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[var(--primary-red)]">100%</p>
            <p className="text-sm text-[var(--text-muted)]">Halal</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-[var(--text-light)]" />
      </div>
    </section>
  );
}
