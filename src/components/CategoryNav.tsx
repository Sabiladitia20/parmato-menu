'use client';

import { Category, CategoryInfo } from '@/types';

interface CategoryNavProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  categories: CategoryInfo[];
}

export default function CategoryNav({
  activeCategory,
  onCategoryChange,
  categories,
}: CategoryNavProps) {
  return (
    <nav className="sticky top-[72px] z-40 bg-[var(--bg-cream)] py-4 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold whitespace-nowrap
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white shadow-lg shadow-red-500/25 scale-105'
                      : 'bg-white text-[var(--text-body)] hover:bg-[var(--bg-warm)] hover:text-[var(--primary-red)] border border-[var(--border)]'
                  }
                `}
                aria-pressed={isActive}
              >
                <span className="text-lg">{category.emoji}</span>
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Hide scrollbar but keep functionality */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
