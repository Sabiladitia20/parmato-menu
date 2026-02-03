# 🚀 Panduan Setup Supabase untuk Parmato Digital Menu

## Langkah 1: Buat Tabel di Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda (syoajfvkqbtrvhftvfex)
3. Klik **SQL Editor** di sidebar kiri
4. Salin semua isi dari file `supabase-setup.sql`
5. Paste di SQL Editor dan klik **Run**

> ⚠️ **Pastikan menjalankan SQL ini pertama kali sebelum menggunakan aplikasi!**

## Langkah 2: Buat Admin User

1. Di Supabase Dashboard, klik **Authentication** di sidebar
2. Klik tab **Users**
3. Klik tombol **Add User** → **Create New User**
4. Isi:
   - **Email**: admin@parmato.com (atau email Anda)
   - **Password**: password yang aman
   - Centang **Auto Confirm User**
5. Klik **Create User**

## Langkah 3: Test Aplikasi

### Customer View (Tanpa Login)
- Buka `http://localhost:3000` - Lihat menu digital
- Customer bisa lihat menu dan melakukan pemesanan tanpa login

### Admin Dashboard (Perlu Login)
- Buka `http://localhost:3000/admin/login`
- Login dengan email dan password yang dibuat di Langkah 2
- Fitur admin:
  - 📊 **Dashboard**: Lihat statistik pesanan dan pendapatan
  - 📋 **Pesanan**: Kelola pesanan (konfirmasi, selesaikan, batalkan)
  - 🍽️ **Menu**: Tambah, edit, hapus, dan toggle ketersediaan menu

## Struktur Database

### Tabel `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(50) | Primary key (ayam, daging, dll) |
| label | VARCHAR(100) | Nama tampilan |
| emoji | VARCHAR(10) | Emoji kategori |
| sort_order | INTEGER | Urutan tampilan |

### Tabel `menu_items`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Nama menu |
| price | INTEGER | Harga dalam Rupiah |
| description | TEXT | Deskripsi menu |
| category_id | VARCHAR(50) | FK ke categories |
| image | TEXT | URL gambar (opsional) |
| available | BOOLEAN | Status ketersediaan |

### Tabel `orders`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| customer_name | VARCHAR(255) | Nama pelanggan |
| table_number | VARCHAR(50) | Nomor meja |
| total_price | INTEGER | Total harga |
| status | VARCHAR(50) | pending/confirmed/completed/cancelled |
| notes | TEXT | Catatan pesanan |

### Tabel `order_items`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| order_id | UUID | FK ke orders |
| menu_item_id | INTEGER | FK ke menu_items |
| quantity | INTEGER | Jumlah item |
| price_at_order | INTEGER | Harga saat order |

## Row Level Security (RLS)

Aplikasi menggunakan RLS untuk keamanan:

| Tabel | Customer (Anonymous) | Admin (Authenticated) |
|-------|---------------------|----------------------|
| categories | ✅ Read | ✅ Full Access |
| menu_items | ✅ Read | ✅ Full Access |
| orders | ✅ Create | ✅ Full Access |
| order_items | ✅ Create | ✅ Full Access |

## Fitur Realtime

Admin dashboard akan menerima update realtime saat ada pesanan baru masuk! 🔔

---

**Happy coding!** 🎉
