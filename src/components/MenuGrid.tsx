import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MenuItem as MenuItemType, Category } from '@/types';
import MenuItem from './MenuItem';
import { Loader2 } from 'lucide-react';

interface MenuGridProps {
  category: Category;
  onSelectItem: (item: MenuItemType) => void;
}

export default function MenuGrid({ category, onSelectItem }: MenuGridProps) {
  const [categoryInfo, setCategoryInfo] = useState<{label: string, emoji: string} | null>(null);
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('label, emoji')
        .eq('id', category)
        .single();
      
      if (!error && data) {
        setCategoryInfo(data);
      }
    };
    fetchCategoryInfo();

    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('category_id', category)
          .order('name');

        if (supabaseError) throw supabaseError;
        
        // Map data to match MenuItem type
        const mappedItems: MenuItemType[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description || '',
          category: item.category_id,
          image: item.image,
          available: item.available,
        }));
        
        setItems(mappedItems);
      } catch (err: any) {
        console.error('Error fetching menu:', err);
        setError('Gagal memuat menu. Pastikan koneksi dan tabel menu_items sudah siap.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [category]);

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-dark)]">
            Menu{' '}
            <span className="text-[var(--primary-red)] text-capitalize">
              {categoryInfo ? `${categoryInfo.label} ${categoryInfo.emoji}` : category}
            </span>
          </h2>
          <p className="text-[var(--text-muted)] mt-1">
            {items.filter(i => i.available).length} menu tersedia
          </p>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-[var(--border)]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-[var(--error)] font-medium">{error}</p>
            <p className="text-xs text-gray-500 mt-2">Cek console browser untuk detail</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bg-light)] rounded-3xl border border-dashed border-[var(--border)]">
            <p className="text-[var(--text-muted)]">
              Belum ada menu di kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item, index) => (
              <MenuItem 
                key={item.id} 
                item={item} 
                index={index} 
                onSelect={onSelectItem}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
