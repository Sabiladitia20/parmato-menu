import { MenuItem, CategoryInfo, Category } from '@/types';

export const categories: CategoryInfo[] = [
  { id: 'ayam', label: 'Ayam', emoji: '🍗' },
  { id: 'daging', label: 'Daging', emoji: '🥩' },
  { id: 'ikan', label: 'Ikan', emoji: '🐟' },
  { id: 'minuman', label: 'Minuman', emoji: '🥤' },
  { id: 'nasi', label: 'Nasi', emoji: '🍚' },
  { id: 'sambal', label: 'Sambal', emoji: '🌶️' },
];

export const menuData: Record<Category, MenuItem[]> = {
  ayam: [
    {
      id: 1,
      name: 'Ayam Goreng',
      price: 15000,
      description: 'Ayam goreng bumbu kuning khas Padang, renyah di luar lembut di dalam',
      category: 'ayam',
      available: true,
    },
    {
      id: 2,
      name: 'Ayam Bakar',
      price: 18000,
      description: 'Ayam bakar dengan bumbu rica-rica yang pedas dan harum',
      category: 'ayam',
      available: true,
    },
    {
      id: 3,
      name: 'Ayam Pop',
      price: 20000,
      description: 'Ayam goreng khas Padang yang lembut dengan kulit putih keemasan',
      category: 'ayam',
      available: true,
    },
    {
      id: 4,
      name: 'Ayam Rendang',
      price: 22000,
      description: 'Ayam dengan bumbu rendang yang kaya rempah dan gurih',
      category: 'ayam',
      available: true,
    },
    {
      id: 5,
      name: 'Ayam Gulai',
      price: 19000,
      description: 'Ayam dengan kuah gulai kuning yang kental dan beraroma',
      category: 'ayam',
      available: true,
    },
  ],
  daging: [
    {
      id: 10,
      name: 'Rendang Daging',
      price: 28000,
      description: 'Rendang daging sapi legendaris Padang, bumbu meresap sempurna',
      category: 'daging',
      available: true,
    },
    {
      id: 11,
      name: 'Dendeng Balado',
      price: 30000,
      description: 'Dendeng tipis dengan sambal balado pedas yang menggugah selera',
      category: 'daging',
      available: true,
    },
    {
      id: 12,
      name: 'Gulai Daging',
      price: 25000,
      description: 'Gulai daging sapi dengan kuah bumbu kuning yang kaya rasa',
      category: 'daging',
      available: true,
    },
    {
      id: 13,
      name: 'Kalio Daging',
      price: 26000,
      description: 'Kalio daging dengan kuah sedang, tidak terlalu kering',
      category: 'daging',
      available: true,
    },
    {
      id: 14,
      name: 'Daging Bakar',
      price: 27000,
      description: 'Daging sapi bakar bumbu padang dengan aroma smoky',
      category: 'daging',
      available: true,
    },
  ],
  ikan: [
    {
      id: 20,
      name: 'Ikan Goreng',
      price: 18000,
      description: 'Ikan segar goreng garing dengan bumbu kuning',
      category: 'ikan',
      available: true,
    },
    {
      id: 21,
      name: 'Ikan Bakar',
      price: 22000,
      description: 'Ikan bakar dengan sambal khas yang pedas dan segar',
      category: 'ikan',
      available: true,
    },
    {
      id: 22,
      name: 'Gulai Ikan',
      price: 24000,
      description: 'Gulai ikan dengan kuah kuning yang gurih dan harum',
      category: 'ikan',
      available: true,
    },
    {
      id: 23,
      name: 'Ikan Asam Padeh',
      price: 26000,
      description: 'Ikan dengan kuah asam pedas segar khas Minang',
      category: 'ikan',
      available: true,
    },
    {
      id: 24,
      name: 'Ikan Balado',
      price: 25000,
      description: 'Ikan goreng dengan sambal balado merah yang pedas',
      category: 'ikan',
      available: true,
    },
  ],
  minuman: [
    {
      id: 30,
      name: 'Es Teh Manis',
      price: 5000,
      description: 'Es teh manis segar dengan es batu',
      category: 'minuman',
      available: true,
    },
    {
      id: 31,
      name: 'Teh Tawar Hangat',
      price: 3000,
      description: 'Teh tawar hangat tanpa gula',
      category: 'minuman',
      available: true,
    },
    {
      id: 32,
      name: 'Es Jeruk',
      price: 8000,
      description: 'Es jeruk peras segar dengan vitamin C',
      category: 'minuman',
      available: true,
    },
    {
      id: 33,
      name: 'Kelapa Muda',
      price: 12000,
      description: 'Air kelapa muda segar langsung dari buahnya',
      category: 'minuman',
      available: true,
    },
    {
      id: 34,
      name: 'Es Campur',
      price: 15000,
      description: 'Es campur dengan berbagai topping segar',
      category: 'minuman',
      available: true,
    },
  ],
  nasi: [
    {
      id: 40,
      name: 'Nasi Putih',
      price: 5000,
      description: 'Nasi putih pulen hangat',
      category: 'nasi',
      available: true,
    },
    {
      id: 41,
      name: 'Nasi Uduk',
      price: 8000,
      description: 'Nasi gurih dengan santan dan bumbu rempah',
      category: 'nasi',
      available: true,
    },
  ],
  sambal: [
    {
      id: 50,
      name: 'Sambal Hijau',
      price: 5000,
      description: 'Sambal hijau khas Padang yang pedas segar',
      category: 'sambal',
      available: true,
    },
    {
      id: 51,
      name: 'Sambal Merah',
      price: 5000,
      description: 'Sambal merah pedas dengan bawang dan cabai',
      category: 'sambal',
      available: true,
    },
    {
      id: 52,
      name: 'Sambal Lado',
      price: 6000,
      description: 'Sambal lado dengan pete yang harum',
      category: 'sambal',
      available: true,
    },
  ],
};

// Helper function to get all menu items as flat array
export const getAllMenuItems = (): MenuItem[] => {
  return Object.values(menuData).flat();
};

// Helper function to format price to Indonesian Rupiah
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
