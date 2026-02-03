  -- ============================================
  -- PARMATO DIGITAL MENU - SUPABASE SETUP
  -- ============================================
  -- Jalankan SQL ini di Supabase Dashboard -> SQL Editor
  -- ============================================

  -- 1. TABEL CATEGORIES
  -- ============================================
  CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 2. TABEL MENU ITEMS
  -- ============================================
  CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    category_id VARCHAR(50) REFERENCES categories(id),
    image TEXT,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 3. TABEL ORDERS
  -- ============================================
  CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    table_number VARCHAR(50) NOT NULL,
    total_price INTEGER NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'kasir',
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 4. TABEL ORDER ITEMS (untuk menyimpan item pesanan)
  -- ============================================
  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    price_at_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 5. INDEX UNTUK PERFORMA
  -- ============================================
  CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
  CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

  -- 6. ROW LEVEL SECURITY (RLS)
  -- ============================================
  -- Enable RLS
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

  -- Policy: Semua orang bisa READ categories & menu_items (untuk customer)
  CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

  CREATE POLICY "Menu items are viewable by everyone" ON menu_items
    FOR SELECT USING (true);

  -- Policy: Semua orang bisa CREATE orders (customer bisa pesan)
  CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

  -- Policy: Authenticated users (admin) bisa CRUD semua
  CREATE POLICY "Authenticated users can manage categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

  CREATE POLICY "Authenticated users can manage menu items" ON menu_items
    FOR ALL USING (auth.role() = 'authenticated');

  CREATE POLICY "Authenticated users can manage orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

  CREATE POLICY "Authenticated users can update orders" ON orders
    FOR UPDATE USING (auth.role() = 'authenticated');

  CREATE POLICY "Authenticated users can delete orders" ON orders
    FOR DELETE USING (auth.role() = 'authenticated');

  -- Policy untuk order_items
  CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Authenticated users can view order items" ON order_items
    FOR SELECT USING (auth.role() = 'authenticated');

  CREATE POLICY "Authenticated users can manage order items" ON order_items
    FOR ALL USING (auth.role() = 'authenticated');

  -- 6. SEED DATA - CATEGORIES
  -- ============================================
  INSERT INTO categories (id, label, emoji, sort_order) VALUES
    ('ayam', 'Ayam', '🍗', 1),
    ('daging', 'Daging', '🥩', 2),
    ('ikan', 'Ikan', '🐟', 3),
    ('minuman', 'Minuman', '🥤', 4),
    ('nasi', 'Nasi', '🍚', 5),
    ('sambal', 'Sambal', '🌶️', 6)
  ON CONFLICT (id) DO NOTHING;

  -- 7. SEED DATA - MENU ITEMS
  -- ============================================
  INSERT INTO menu_items (id, name, price, description, category_id, available) VALUES
    -- Ayam
    (1, 'Ayam Goreng', 15000, 'Ayam goreng bumbu kuning khas Padang, renyah di luar lembut di dalam', 'ayam', true),
    (2, 'Ayam Bakar', 18000, 'Ayam bakar dengan bumbu rica-rica yang pedas dan harum', 'ayam', true),
    (3, 'Ayam Pop', 20000, 'Ayam goreng khas Padang yang lembut dengan kulit putih keemasan', 'ayam', true),
    (4, 'Ayam Rendang', 22000, 'Ayam dengan bumbu rendang yang kaya rempah dan gurih', 'ayam', true),
    (5, 'Ayam Gulai', 19000, 'Ayam dengan kuah gulai kuning yang kental dan beraroma', 'ayam', true),
    -- Daging
    (10, 'Rendang Daging', 28000, 'Rendang daging sapi legendaris Padang, bumbu meresap sempurna', 'daging', true),
    (11, 'Dendeng Balado', 30000, 'Dendeng tipis dengan sambal balado pedas yang menggugah selera', 'daging', true),
    (12, 'Gulai Daging', 25000, 'Gulai daging sapi dengan kuah bumbu kuning yang kaya rasa', 'daging', true),
    (13, 'Kalio Daging', 26000, 'Kalio daging dengan kuah sedang, tidak terlalu kering', 'daging', true),
    (14, 'Daging Bakar', 27000, 'Daging sapi bakar bumbu padang dengan aroma smoky', 'daging', true),
    -- Ikan
    (20, 'Ikan Goreng', 18000, 'Ikan segar goreng garing dengan bumbu kuning', 'ikan', true),
    (21, 'Ikan Bakar', 22000, 'Ikan bakar dengan sambal khas yang pedas dan segar', 'ikan', true),
    (22, 'Gulai Ikan', 24000, 'Gulai ikan dengan kuah kuning yang gurih dan harum', 'ikan', true),
    (23, 'Ikan Asam Padeh', 26000, 'Ikan dengan kuah asam pedas segar khas Minang', 'ikan', true),
    (24, 'Ikan Balado', 25000, 'Ikan goreng dengan sambal balado merah yang pedas', 'ikan', true),
    -- Minuman
    (30, 'Es Teh Manis', 5000, 'Es teh manis segar dengan es batu', 'minuman', true),
    (31, 'Teh Tawar Hangat', 3000, 'Teh tawar hangat tanpa gula', 'minuman', true),
    (32, 'Es Jeruk', 8000, 'Es jeruk peras segar dengan vitamin C', 'minuman', true),
    (33, 'Kelapa Muda', 12000, 'Air kelapa muda segar langsung dari buahnya', 'minuman', true),
    (34, 'Es Campur', 15000, 'Es campur dengan berbagai topping segar', 'minuman', true),
    -- Nasi
    (40, 'Nasi Putih', 5000, 'Nasi putih pulen hangat', 'nasi', true),
    (41, 'Nasi Uduk', 8000, 'Nasi gurih dengan santan dan bumbu rempah', 'nasi', true),
    -- Sambal
    (50, 'Sambal Hijau', 5000, 'Sambal hijau khas Padang yang pedas segar', 'sambal', true),
    (51, 'Sambal Merah', 5000, 'Sambal merah pedas dengan bawang dan cabai', 'sambal', true),
    (52, 'Sambal Lado', 6000, 'Sambal lado dengan pete yang harum', 'sambal', true)
  ON CONFLICT (id) DO NOTHING;

  -- Reset sequence untuk menu_items
  SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));

  -- ============================================
  -- SELESAI! 
  -- Sekarang buat admin user di:
  -- Supabase Dashboard -> Authentication -> Users -> Add User
  -- ============================================
