# Dokumentasi EasyWash

## Deskripsi Sistem

EasyWash adalah sistem booking cuci kendaraan berbasis web yang memungkinkan pengguna untuk:
- Mendaftar dan login
- Memilih layanan cuci kendaraan (motor, mobil, salon)
- Memesan jadwal cuci
- Melihat estimasi waktu selesai
- Memantau status pemesanan secara real-time

Admin dapat:
- Mengelola layanan (CRUD)
- Mengelola antrean pemesanan
- Update status pemesanan
- Melihat semua pemesanan

## Struktur Folder Proyek

```
EasyWash/
├── app/
│   ├── BookingStatus.php          # Enum untuk status booking
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── BookingController.php      # Web controller
│   │   │   ├── ServiceController.php      # Web controller
│   │   │   └── Api/
│   │   │       ├── ApiAuthController.php
│   │   │       ├── ApiBookingController.php
│   │   │       └── ApiServiceController.php
│   │   ├── Middleware/
│   │   │   └── EnsureUserIsAdmin.php
│   │   ├── Requests/
│   │   │   ├── StoreBookingRequest.php
│   │   │   ├── UpdateBookingRequest.php
│   │   │   ├── StoreServiceRequest.php
│   │   │   └── UpdateServiceRequest.php
│   │   └── Resources/
│   │       ├── BookingResource.php        # API Resource
│   │       ├── ServiceResource.php        # API Resource
│   │       └── UserResource.php          # API Resource
│   └── Models/
│       ├── Booking.php
│       ├── Service.php
│       └── User.php
├── database/
│   ├── factories/
│   │   ├── BookingFactory.php
│   │   ├── ServiceFactory.php
│   │   └── UserFactory.php
│   ├── migrations/
│   │   ├── create_services_table.php
│   │   └── create_bookings_table.php
│   └── seeders/
│       └── ServiceSeeder.php
├── resources/
│   └── js/
│       └── pages/
│           ├── Bookings/
│           │   ├── Index.tsx
│           │   ├── Create.tsx
│           │   └── Show.tsx
│           └── Services/
│               └── Index.tsx
├── routes/
│   ├── web.php                    # Web routes (Inertia)
│   └── api.php                    # API routes (JSON)
└── tests/
    └── Feature/
        ├── BookingTest.php
        ├── ServiceTest.php
        └── Api/
            ├── ApiAuthTest.php
            ├── ApiBookingTest.php
            └── ApiServiceTest.php
```

## ERD (Entity Relationship Diagram)

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id          │
│ name        │
│ email       │
│ password    │
│ role        │──┐
└─────────────┘  │
                 │ 1
                 │
                 │ N
┌─────────────┐  │
│  Bookings   │◄─┘
├─────────────┤
│ id          │
│ user_id     │──┐
│ service_id  │──┤
│ vehicle_type│  │
│ vehicle_plate│ │
│ scheduled_at│  │
│ estimated_  │  │
│   finish_at │  │
│ status      │  │
│ notes       │  │
└─────────────┘  │
                 │ N
                 │
                 │ 1
┌─────────────┐  │
│  Services   │◄─┘
├─────────────┤
│ id          │
│ name        │
│ description │
│ duration_   │
│   minutes   │
│ price       │
└─────────────┘
```

## Database Schema

### Tabel: users
- `id` (bigint, primary key)
- `name` (varchar)
- `email` (varchar, unique)
- `password` (varchar)
- `role` (varchar) - 'user' atau 'admin'
- `email_verified_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabel: services
- `id` (bigint, primary key)
- `name` (varchar)
- `description` (text, nullable)
- `duration_minutes` (integer)
- `price` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabel: bookings
- `id` (bigint, primary key)
- `user_id` (bigint, foreign key -> users.id)
- `service_id` (bigint, foreign key -> services.id)
- `vehicle_type` (varchar) - 'motor', 'mobil', atau 'salon'
- `vehicle_plate` (varchar)
- `scheduled_at` (timestamp)
- `estimated_finish_at` (timestamp)
- `status` (varchar) - 'pending', 'in_progress', 'completed', 'cancelled'
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## API Endpoints (RESTful)

### Base URL
- **Web Routes**: `http://localhost:8000`
- **API Routes**: `http://localhost:8000/api`

### Authentication API

#### POST /api/login
Login user/admin
- **Auth**: Not required
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login berhasil.",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

#### POST /api/logout
Logout user
- **Auth**: Required
- **Response**:
  ```json
  {
    "message": "Logout berhasil."
  }
  ```

#### GET /api/user
Get authenticated user info
- **Auth**: Required
- **Response**:
  ```json
  {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

### Booking API Endpoints

#### GET /api/bookings
Menampilkan daftar pemesanan (JSON)
- **Auth**: Required (User/Admin)
- **Query Parameters**:
  - `status` (optional): Filter by status (pending, in_progress, completed, cancelled)
  - `search` (optional): Search by vehicle plate or user name
  - `per_page` (optional): Items per page (default: 15)
- **Response**: JSON dengan pagination
  ```json
  {
    "data": [
      {
        "id": 1,
        "user": {...},
        "service": {...},
        "vehicle_type": "motor",
        "vehicle_plate": "B1234ABC",
        "scheduled_at": "2024-12-01T10:00:00+00:00",
        "estimated_finish_at": "2024-12-01T11:30:00+00:00",
        "status": "pending",
        "notes": null
      }
    ],
    "links": {...},
    "meta": {...}
  }
  ```

#### POST /api/bookings
Membuat pemesanan baru (JSON)
- **Auth**: Required (User)
- **Body**:
  ```json
  {
    "service_id": 1,
    "vehicle_type": "motor",
    "vehicle_plate": "B1234ABC",
    "scheduled_at": "2024-12-01T10:00:00",
    "notes": "Optional notes"
  }
  ```
- **Response**: 201 Created dengan booking data

#### GET /api/bookings/{id}
Menampilkan detail pemesanan (JSON)
- **Auth**: Required (User dapat melihat sendiri, Admin dapat melihat semua)
- **Response**: JSON dengan booking detail

#### PUT /api/bookings/{id}
Update pemesanan (JSON)
- **Auth**: Required
- **Body**:
  ```json
  {
    "status": "in_progress",
    "notes": "Updated notes"
  }
  ```
- **Response**: JSON dengan updated booking

#### DELETE /api/bookings/{id}
Hapus pemesanan (JSON)
- **Auth**: Required (User dapat hapus sendiri jika pending, Admin dapat hapus semua)
- **Response**:
  ```json
  {
    "message": "Pemesanan berhasil dibatalkan."
  }
  ```

#### GET /api/bookings/queue/live
Menampilkan antrean real-time (JSON)
- **Auth**: Required
- **Response**: JSON array dengan bookings yang status pending atau in_progress

### Service API Endpoints

#### GET /api/services
Menampilkan daftar layanan (JSON) - Public
- **Auth**: Not required
- **Query Parameters**:
  - `search` (optional): Search by name
  - `per_page` (optional): Items per page (default: 15)
- **Response**: JSON dengan pagination

#### GET /api/services/{id}
Menampilkan detail layanan (JSON) - Public
- **Auth**: Not required
- **Response**: JSON dengan service detail

#### POST /api/services
Membuat layanan baru (JSON) - Admin Only
- **Auth**: Required (Admin only)
- **Body**:
  ```json
  {
    "name": "Cuci Mobil Premium",
    "description": "Cuci mobil dengan paket premium",
    "duration_minutes": 120,
    "price": 150000
  }
  ```
- **Response**: 201 Created dengan service data

#### PUT /api/services/{id}
Update layanan (JSON) - Admin Only
- **Auth**: Required (Admin only)
- **Body**: Same as POST
- **Response**: JSON dengan updated service

#### DELETE /api/services/{id}
Hapus layanan (JSON) - Admin Only
- **Auth**: Required (Admin only)
- **Response**:
  ```json
  {
    "message": "Layanan berhasil dihapus."
  }
  ```

### Web Routes (Inertia/React)

#### GET /bookings
Menampilkan daftar pemesanan (Inertia page)
- **Auth**: Required (User/Admin)

#### GET /bookings/create
Form untuk membuat pemesanan baru (Inertia page)
- **Auth**: Required (User)

#### POST /bookings
Membuat pemesanan baru (Inertia redirect)
- **Auth**: Required (User)

#### GET /bookings/{id}
Menampilkan detail pemesanan (Inertia page)
- **Auth**: Required

#### GET /bookings/{id}/edit
Form untuk edit pemesanan (Inertia page)
- **Auth**: Required

#### PUT /bookings/{id}
Update pemesanan (Inertia redirect)
- **Auth**: Required

#### DELETE /bookings/{id}
Hapus pemesanan (Inertia redirect)
- **Auth**: Required

#### GET /services
Menampilkan daftar layanan (Inertia page) - Admin Only
- **Auth**: Required (Admin only)

#### GET /services/create
Form untuk membuat layanan baru (Inertia page) - Admin Only
- **Auth**: Required (Admin only)

#### POST /services
Membuat layanan baru (Inertia redirect) - Admin Only
- **Auth**: Required (Admin only)

#### GET /services/{id}
Menampilkan detail layanan (Inertia page) - Admin Only
- **Auth**: Required (Admin only)

#### GET /services/{id}/edit
Form untuk edit layanan (Inertia page) - Admin Only
- **Auth**: Required (Admin only)

#### PUT /services/{id}
Update layanan (Inertia redirect) - Admin Only
- **Auth**: Required (Admin only)

#### DELETE /services/{id}
Hapus layanan (Inertia redirect) - Admin Only
- **Auth**: Required (Admin only)

## Alur Login (User vs Admin)

### User Login
1. User mengakses `/login`
2. User memasukkan email dan password
3. Setelah login berhasil, user diarahkan ke `/dashboard`
4. User dapat mengakses:
   - `/bookings` - Daftar pemesanan mereka
   - `/bookings/create` - Buat pemesanan baru
   - `/bookings/{id}` - Detail pemesanan mereka

### Admin Login
1. Admin mengakses `/login`
2. Admin memasukkan email dan password (dengan role='admin')
3. Setelah login berhasil, admin diarahkan ke `/dashboard`
4. Admin dapat mengakses:
   - `/bookings` - Semua pemesanan
   - `/services` - Manajemen layanan (CRUD)
   - `/bookings/{id}` - Detail semua pemesanan
   - Update status pemesanan

### Middleware
- `auth` - Memastikan user sudah login
- `admin` - Memastikan user adalah admin (untuk routes services)

## Fitur Utama

### 1. Registrasi & Login
- Menggunakan Laravel Fortify
- User dapat registrasi dengan email dan password
- Admin harus dibuat manual atau melalui seeder

### 2. Pemesanan Layanan
- User memilih layanan (motor, mobil, salon)
- User memilih tanggal dan waktu
- Sistem menghitung estimasi waktu selesai berdasarkan antrean
- Status default: `pending`

### 3. Penjadwalan Otomatis
- Sistem menghitung `estimated_finish_at` berdasarkan:
  - Semua pemesanan yang `pending` atau `in_progress` sebelum waktu yang dipilih
  - Durasi setiap layanan
  - Durasi layanan yang dipilih

### 4. Estimasi Waktu Selesai
- Dihitung otomatis saat membuat pemesanan
- Diperbarui saat status berubah menjadi `in_progress`

### 5. Manajemen Data Admin
- Admin dapat CRUD layanan
- Admin dapat update status pemesanan
- Admin dapat melihat semua pemesanan

### 6. Notifikasi Status
- Status pemesanan dapat diupdate oleh admin
- Status: `pending`, `in_progress`, `completed`, `cancelled`

### 7. Antrean Realtime
- Endpoint `/bookings/queue/live` menampilkan semua pemesanan yang `pending` atau `in_progress`
- Diurutkan berdasarkan `scheduled_at`

## Testing

### Menjalankan Tests
```bash
# Semua tests
php artisan test

# Tests spesifik
php artisan test --filter BookingTest
php artisan test --filter ServiceTest
php artisan test --filter ApiBookingTest
php artisan test --filter ApiServiceTest
php artisan test --filter ApiAuthTest

# Test file tertentu
php artisan test tests/Feature/BookingTest.php
php artisan test tests/Feature/Api/ApiBookingTest.php
```

### Coverage Tests
- **BookingTest**: Test CRUD booking web routes, validasi, authorization
- **ServiceTest**: Test CRUD service web routes (admin only), validasi
- **ApiBookingTest**: Test CRUD booking API endpoints, JSON responses, authorization
- **ApiServiceTest**: Test CRUD service API endpoints, public/admin access
- **ApiAuthTest**: Test authentication API endpoints (login, logout, user info)

## Setup & Instalasi

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Setup Database
```bash
php artisan migrate
php artisan db:seed
```

### 4. Create Admin User
```bash
php artisan tinker
```
```php
User::create([
    'name' => 'Admin',
    'email' => 'admin@easywash.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
]);
```

### 5. Run Development Server
```bash
# Backend
php artisan serve

# Frontend (terminal baru)
npm run dev
```

## Frontend Pages (Simple)

### Bookings
- **Index**: Daftar pemesanan dengan tabel
- **Create**: Form untuk membuat pemesanan baru
- **Show**: Detail pemesanan

### Services (Admin Only)
- **Index**: Daftar layanan dengan tabel

## Catatan Penting

1. **Role-based Access**: Pastikan user memiliki `role='admin'` untuk mengakses routes services
2. **Validation**: Semua input divalidasi melalui Form Requests
3. **Authorization**: User hanya dapat melihat/mengedit pemesanan mereka sendiri (kecuali admin)
4. **Estimated Finish Time**: Dihitung otomatis berdasarkan antrean
5. **Status Booking**: Hanya dapat diupdate oleh admin atau user (jika status masih pending)

## Teknologi yang Digunakan

- **Backend**: Laravel 12
- **Frontend**: React 19, Inertia.js v2, Tailwind CSS v4
- **Database**: PostgreSQL
- **Authentication**: Laravel Fortify
- **Testing**: Pest PHP
- **Code Style**: Laravel Pint

