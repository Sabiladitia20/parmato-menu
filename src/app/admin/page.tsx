'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { 
  getCurrentUser, 
  signOut, 
  getOrders, 
  getMenuItems, 
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
  updateMenuItem,
  createMenuItem,
  deleteMenuItem,
  uploadMenuImage,
  subscribeToOrders,
  Order,
  OrderItem
} from '@/lib/supabase-service';
import { MenuItem, CategoryInfo } from '@/types';
import { formatPrice } from '@/data/menuData';

type Tab = 'dashboard' | 'orders' | 'menu' | 'categories';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; item: MenuItem | null; action: string }>({ show: false, item: null, action: '' });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadData();
      const subscription = subscribeToOrders(() => {
        loadOrders();
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [loading]);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }
    setLoading(false);
  };

  const loadData = async () => {
    await Promise.all([loadOrders(), loadMenuItems(), loadCategories()]);
  };

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const loadMenuItems = async () => {
    const data = await getMenuItems();
    setMenuItems(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const statusText = item.available ? 'HABIS' : 'TERSEDIA';
    setConfirmModal({ show: true, item, action: statusText });
  };

  const confirmToggleAvailability = async () => {
    if (confirmModal.item) {
      await updateMenuItem(confirmModal.item.id, { available: !confirmModal.item.available });
      loadMenuItems();
    }
    setConfirmModal({ show: false, item: null, action: '' });
  };

  const handleSaveMenuItem = async (item: Omit<MenuItem, 'id'> & { id?: number }) => {
    if (item.id) {
      await updateMenuItem(item.id, item);
    } else {
      await createMenuItem(item);
    }
    setShowMenuModal(false);
    setEditingItem(null);
    loadMenuItems();
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      await deleteMenuItem(id);
      loadMenuItems();
    }
  };

  const handleSaveCategory = async (cat: CategoryInfo) => {
    if (editingCategory) {
      await updateCategory(cat.id, cat);
    } else {
      await createCategory(cat);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
    loadCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua menu dalam kategori ini mungkin akan terpengaruh.')) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const todayRevenue = orders
    .filter(o => {
      const today = new Date().toDateString();
      return new Date(o.created_at).toDateString() === today && o.status === 'completed';
    })
    .reduce((sum, o) => sum + o.total_price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Clean White */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-gray-800 font-bold">Parmato</h1>
              <p className="text-gray-400 text-xs">Admin Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'orders', icon: '📋', label: 'Pesanan' },
              { id: 'menu', icon: '🍽️', label: 'Menu' },
              { id: 'categories', icon: '📂', label: 'Kategori' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-medium"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">⏳</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
                    Pending
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">Pesanan Pending</p>
                <p className="text-3xl font-bold text-gray-800">{pendingOrders.length}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">👨‍🍳</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                    Proses
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">Pesanan Diproses</p>
                <p className="text-3xl font-bold text-gray-800">{confirmedOrders.length}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">✅</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    Selesai
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">Selesai Hari Ini</p>
                <p className="text-3xl font-bold text-gray-800">
                  {completedOrders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">💰</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                    Revenue
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">Pendapatan Hari Ini</p>
                <p className="text-2xl font-bold text-gray-800">{formatPrice(todayRevenue)}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pesanan Terbaru</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-gray-800 font-medium">{order.customer_name}</p>
                      <p className="text-gray-500 text-sm">
                        Meja {order.table_number} • {order.order_items?.length || 0} item • 
                        <span className="ml-1 font-semibold text-gray-700">
                          {order.payment_method === 'kasir' ? '💵 Kasir' : '📱 QRIS'}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-500 font-semibold">{formatPrice(order.total_price)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'completed' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-gray-400 text-center py-8">Belum ada pesanan</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pesanan</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-800 font-semibold text-lg">{order.customer_name}</h3>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>Meja {order.table_number}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          order.payment_method === 'kasir' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {order.payment_method === 'kasir' ? '💵 Bayar di Kasir' : '📱 QRIS'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">{formatPrice(order.total_price)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    {order.order_items?.map((item: OrderItem, idx: number) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-700">{item.quantity}x {item.menu_item?.name || 'Unknown'}</span>
                        <span className="text-gray-500">{formatPrice(item.price_at_order * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-gray-500 text-sm mb-4">📝 Catatan: {order.notes}</p>
                  )}

                  {/* Status Actions */}
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                          className="flex-1 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium"
                        >
                          ✓ Konfirmasi
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          className="px-4 py-2 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-all"
                        >
                          ✗
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        className="flex-1 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium"
                      >
                        ✓ Selesai
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <span className="flex-1 py-2 text-center text-green-500 font-medium">✓ Pesanan Selesai</span>
                    )}
                    {order.status === 'cancelled' && (
                      <span className="flex-1 py-2 text-center text-red-500 font-medium">✗ Dibatalkan</span>
                    )}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <span className="text-6xl mb-4 block">📋</span>
                  <p className="text-gray-400">Belum ada pesanan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Menu</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowMenuModal(true);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 font-medium shadow-sm"
              >
                <span>+</span>
                <span>Tambah Menu</span>
              </button>
            </div>

            {/* Menu Grouped by Category */}
            {categories.map((cat) => {
              const categoryItems = menuItems.filter(item => item.category === cat.id);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={cat.id} className="mb-8">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
                    <span className="text-2xl">{cat.emoji}</span>
                    <h3 className="text-xl font-semibold text-gray-800">{cat.label}</h3>
                    <span className="text-gray-400 text-sm">({categoryItems.length} item)</span>
                  </div>
                  
                  {/* Category Menu Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item) => (
                      <div key={item.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${!item.available ? 'opacity-50' : ''}`}>
                        <div className="flex gap-4 mb-4">
                          {/* Image/Emoji Thumbnail */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl opacity-50">
                                {cat.emoji}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-gray-800 font-semibold line-clamp-1">{item.name}</h3>
                              <span className="text-orange-600 font-bold whitespace-nowrap text-sm">{formatPrice(item.price)}</span>
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-2 mt-1">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                              item.available
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-red-100 text-red-500 hover:bg-red-200'
                            }`}
                          >
                            {item.available ? '✓ Tersedia' : '✗ Habis'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowMenuModal(true);
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="px-4 py-2 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setShowCategoryModal(true);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 font-medium shadow-sm"
              >
                <span>+</span>
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div>
                      <h3 className="text-gray-800 font-semibold">{cat.label}</h3>
                      <p className="text-gray-400 text-xs text-uppercase">{cat.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setShowCategoryModal(true);
                      }}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Menu Modal */}
      {showMenuModal && (
        <MenuModal
          item={editingItem}
          categories={categories}
          onSave={handleSaveMenuItem}
          onClose={() => {
            setShowMenuModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal.show && confirmModal.item && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Konfirmasi Perubahan</h3>
            <p className="text-gray-600 text-center mb-6">
              Ubah status <span className="font-semibold text-gray-800">"{confirmModal.item.name}"</span> menjadi <span className={`font-bold ${confirmModal.action === 'HABIS' ? 'text-red-500' : 'text-green-600'}`}>{confirmModal.action}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, item: null, action: '' })}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Batal
              </button>
              <button
                onClick={confirmToggleAvailability}
                className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-medium shadow-lg shadow-orange-500/25"
              >
                Ya, Ubah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Menu Modal Component - Light Theme
function MenuModal({
  item,
  categories,
  onSave,
  onClose,
}: {
  item: MenuItem | null;
  categories: CategoryInfo[];
  onSave: (item: Omit<MenuItem, 'id'> & { id?: number }) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    price: item?.price || 0,
    description: item?.description || '',
    category: item?.category || categories[0]?.id || 'ayam',
    available: item?.available ?? true,
    image: item?.image || '',
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.image;
    if (imageFile) {
      const uploadedUrl = await uploadMenuImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    onSave({
      id: item?.id,
      ...formData,
      image: imageUrl,
    });
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {item ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Menu</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem['category'] })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Menu</label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); setImageFile(null); setFormData({...formData, image: ''}); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-all transform hover:scale-110"
                    title="Hapus gambar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-5 h-5 rounded bg-gray-50 border-gray-300 text-orange-500 focus:ring-orange-500/50"
            />
            <label htmlFor="available" className="text-gray-700">Tersedia</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-medium disabled:opacity-50"
            >
              {uploading ? 'Mengupload...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Category Modal Component
function CategoryModal({
  category,
  onSave,
  onClose,
}: {
  category: CategoryInfo | null;
  onSave: (cat: CategoryInfo) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    id: category?.id || '',
    label: category?.label || '',
    emoji: category?.emoji || '📁',
    sort_order: category?.sort_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {category ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Kategori (Slug)</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              required
              disabled={!!category}
              placeholder="contoh: ayam-goreng"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kategori</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
              placeholder="contoh: Ayam Goreng"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
              
              {/* Quick Emoji Picker */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 tracking-wider">Pilih Cepat</p>
                <div className="grid grid-cols-8 gap-2">
                  {[
                    '🍛', '🍗', '🥩', '🐟', '🍚', '🌶️', '🥤', '🧊', 
                    '🍤', '🍜', '🍲', '🍳', '🥗', '🥘', '🥣', '🍴',
                    '🧁', '🍦', '🍩', '🍪', '🍎', '🍋', '🍉', '🥥'
                  ].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`
                        w-8 h-8 flex items-center justify-center rounded-lg text-lg
                        hover:bg-orange-100 hover:scale-110 transition-all
                        ${formData.emoji === emoji ? 'bg-orange-200 scale-110' : 'bg-white shadow-sm'}
                      `}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampilan</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-medium"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
