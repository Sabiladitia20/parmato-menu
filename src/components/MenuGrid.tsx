import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MenuItem as MenuItemType, Category } from '@/types';
import MenuItem from './MenuItem';
import { Loader2, SearchX } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';

interface MenuGridProps {
  category: Category;
  onSelectItem: (item: MenuItemType) => void;
}

export default function MenuGrid({ category, onSelectItem }: MenuGridProps) {
  const { searchQuery } = useSearchStore();
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
        let query = supabase.from('menu_items').select('*');

        if (searchQuery) {
          // Global search if query is present
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        } else {
          // Category filter if no search query
          query = query.eq('category_id', category);
        }

        const { data, error: supabaseError } = await query.order('name');

        if (supabaseError) throw supabaseError;
        
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
        setError('Gagal memuat menu. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [category, searchQuery]);

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-dark)]">
            {searchQuery ? (
              <>
                Hasil Pencarian: <span className="text-[var(--primary-red)]">"{searchQuery}"</span>
              </>
            ) : (
              <>
                Menu{' '}
                <span className="text-[var(--primary-red)] text-capitalize">
                  {categoryInfo ? `${categoryInfo.label} ${categoryInfo.emoji}` : category}
                </span>
              </>
            )}
          </h2>
          <p className="text-[var(--text-muted)] mt-1">
            {items.filter(i => i.available).length} menu ditemukan
          </p>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white rounded-3xl h-80 animate-shimmer border border-[var(--border)] relative overflow-hidden" 
              >
                <div className="h-48 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-100 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-50 rounded-md w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-[var(--error)] font-medium">{error}</p>
            <p className="text-xs text-gray-500 mt-2">Cek console browser untuk detail</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-light)] rounded-[2.5rem] border border-dashed border-[var(--border)]">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <SearchX className="w-10 h-10 text-[var(--text-light)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">
              Menu tidak ditemukan
            </h3>
            <p className="text-[var(--text-muted)] max-w-xs mx-auto">
              Coba gunakan kata kunci lain atau cek kategori yang berbeda.
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
