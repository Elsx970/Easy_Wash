# 📐 Struktur Web EasyWash

Dokumentasi lengkap struktur web aplikasi EasyWash berdasarkan requirement dan best practices.

## 🗂️ Struktur File & Folder

```
EasyWash/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── ApiAuthController.php      # API Authentication
│   │   │   │   ├── ApiBookingController.php   # API Bookings CRUD
│   │   │   │   └── ApiServiceController.php    # API Services CRUD
│   │   │   ├── BookingController.php          # Web Bookings (Inertia)
│   │   │   ├── DashboardController.php       # Dashboard
│   │   │   └── ServiceController.php         # Web Services (Inertia)
│   │   └── Requests/
│   │       ├── StoreBookingRequest.php        # Validation: Create Booking
│   │       ├── UpdateBookingRequest.php       # Validation: Update Booking
│   │       ├── StoreServiceRequest.php        # Validation: Create Service
│   │       └── UpdateServiceRequest.php       # Validation: Update Service
│   ├── Http/
│   │   └── Resources/
│   │       ├── BookingResource.php           # API Response: Booking
│   │       ├── ServiceResource.php           # API Response: Service
│   │       └── UserResource.php              # API Response: User
│   └── Models/
│       ├── Booking.php                       # Booking Model
│       ├── Service.php                        # Service Model
│       └── User.php                          # User Model
│
├── routes/
│   ├── web.php                               # Web Routes (Inertia)
│   └── api.php                               # API Routes (RESTful)
│
└── resources/
    └── js/
        ├── pages/
        │   ├── auth/                         # Authentication Pages
        │   │   ├── login.tsx
        │   │   ├── register.tsx
        │   │   ├── forgot-password.tsx
        │   │   ├── reset-password.tsx
        │   │   ├── verify-email.tsx
        │   │   ├── confirm-password.tsx
        │   │   └── two-factor-challenge.tsx
        │   ├── Bookings/                     # Booking Pages
        │   │   ├── Index.tsx                 # List Bookings
        │   │   ├── Create.tsx                # Create Booking
        │   │   ├── Show.tsx                  # Detail Booking
        │   │   └── Edit.tsx                  # Edit Booking
        │   ├── Services/                     # Service Pages (Admin)
        │   │   ├── Index.tsx                 # List Services
        │   │   ├── Create.tsx                # Create Service
        │   │   ├── Show.tsx                  # Detail Service
        │   │   └── Edit.tsx                  # Edit Service
        │   ├── dashboard.tsx                 # Dashboard
        │   ├── welcome.tsx                   # Landing Page
        │   └── settings/                     # Settings Pages
        │       ├── profile.tsx
        │       ├── password.tsx
        │       ├── two-factor.tsx
        │       └── appearance.tsx
        ├── components/
        │   ├── app-sidebar.tsx               # Sidebar Navigation
        │   ├── app-header.tsx                # Header Navigation
        │   └── ui/                           # UI Components
        └── routes/                           # Wayfinder Generated Routes
            ├── bookings/
            │   └── index.ts
            └── services/
                └── index.ts
```

---

## 🛣️ Routing Structure

### **Public Routes** (Tidak perlu login)

| Method | URL | Controller | Description |
|--------|-----|------------|-------------|
| GET | `/` | `welcome` | Landing page / Home |
| GET | `/login` | Fortify | Login page |
| POST | `/login` | Fortify | Process login |
| GET | `/register` | Fortify | Registration page |
| POST | `/register` | Fortify | Process registration |
| GET | `/forgot-password` | Fortify | Forgot password page |
| POST | `/forgot-password` | Fortify | Send reset link |
| GET | `/reset-password/{token}` | Fortify | Reset password form |
| POST | `/reset-password` | Fortify | Process reset |

### **Authenticated Routes** (Perlu login)

#### **Dashboard**
| Method | URL | Controller | Description | Access |
|--------|-----|------------|-------------|--------|
| GET | `/dashboard` | `DashboardController@index` | Dashboard utama | User & Admin |

#### **Bookings** (Semua user authenticated)
| Method | URL | Controller | Description | Access |
|--------|-----|------------|-------------|--------|
| GET | `/bookings` | `BookingController@index` | List semua bookings | User & Admin |
| GET | `/bookings/create` | `BookingController@create` | Form create booking | User & Admin |
| POST | `/bookings` | `BookingController@store` | Simpan booking baru | User & Admin |
| GET | `/bookings/{id}` | `BookingController@show` | Detail booking | User (own) / Admin (all) |
| GET | `/bookings/{id}/edit` | `BookingController@edit` | Form edit booking | User (own) / Admin (all) |
| PUT/PATCH | `/bookings/{id}` | `BookingController@update` | Update booking | User (own) / Admin (all) |
| DELETE | `/bookings/{id}` | `BookingController@destroy` | Hapus booking | User (own) / Admin (all) |
| GET | `/bookings/queue/live` | `BookingController@queue` | Real-time queue | User & Admin |

#### **Services** (Admin only)
| Method | URL | Controller | Description | Access |
|--------|-----|------------|-------------|--------|
| GET | `/services` | `ServiceController@index` | List semua services | Admin |
| GET | `/services/create` | `ServiceController@create` | Form create service | Admin |
| POST | `/services` | `ServiceController@store` | Simpan service baru | Admin |
| GET | `/services/{id}` | `ServiceController@show` | Detail service | Admin |
| GET | `/services/{id}/edit` | `ServiceController@edit` | Form edit service | Admin |
| PUT/PATCH | `/services/{id}` | `ServiceController@update` | Update service | Admin |
| DELETE | `/services/{id}` | `ServiceController@destroy` | Hapus service | Admin |

#### **Settings** (Semua user authenticated)
| Method | URL | Controller | Description |
|--------|-----|------------|-------------|
| GET | `/settings/profile` | `ProfileController@edit` | Edit profile |
| PATCH | `/settings/profile` | `ProfileController@update` | Update profile |
| GET | `/settings/password` | `PasswordController@edit` | Change password |
| PUT | `/settings/password` | `PasswordController@update` | Update password |
| GET | `/settings/two-factor` | `TwoFactorController@show` | 2FA settings |
| GET | `/settings/appearance` | - | Appearance settings |

---

## 🔌 API Routes Structure

### **Authentication API** (`/api/*`)

| Method | URL | Controller | Description |
|--------|-----|------------|-------------|
| POST | `/api/register` | `ApiAuthController@register` | Register user baru |
| POST | `/api/login` | `ApiAuthController@login` | Login user |
| POST | `/api/logout` | `ApiAuthController@logout` | Logout user |
| GET | `/api/user` | `ApiAuthController@user` | Get authenticated user |

### **Bookings API** (`/api/v1/bookings`)

| Method | URL | Controller | Description | Auth |
|--------|-----|------------|-------------|------|
| GET | `/api/v1/bookings` | `ApiBookingController@index` | List bookings | Required |
| POST | `/api/v1/bookings` | `ApiBookingController@store` | Create booking | Required |
| GET | `/api/v1/bookings/{id}` | `ApiBookingController@show` | Detail booking | Required |
| PUT/PATCH | `/api/v1/bookings/{id}` | `ApiBookingController@update` | Update booking | Required |
| DELETE | `/api/v1/bookings/{id}` | `ApiBookingController@destroy` | Delete booking | Required |
| GET | `/api/v1/bookings/queue/live` | `ApiBookingController@queue` | Real-time queue | Required |

### **Services API** (`/api/v1/services`)

| Method | URL | Controller | Description | Auth |
|--------|-----|------------|-------------|------|
| GET | `/api/v1/services` | `ApiServiceController@index` | List services | Public |
| GET | `/api/v1/services/{id}` | `ApiServiceController@show` | Detail service | Public |
| POST | `/api/v1/services` | `ApiServiceController@store` | Create service | Admin |
| PUT/PATCH | `/api/v1/services/{id}` | `ApiServiceController@update` | Update service | Admin |
| DELETE | `/api/v1/services/{id}` | `ApiServiceController@destroy` | Delete service | Admin |

---

## 📄 Page Components Structure

### **Authentication Pages** (`resources/js/pages/auth/`)

1. **login.tsx** - Halaman login
2. **register.tsx** - Halaman registrasi
3. **forgot-password.tsx** - Lupa password
4. **reset-password.tsx** - Reset password
5. **verify-email.tsx** - Verifikasi email
6. **confirm-password.tsx** - Konfirmasi password
7. **two-factor-challenge.tsx** - 2FA challenge

### **Booking Pages** (`resources/js/pages/Bookings/`)

1. **Index.tsx** - Daftar semua bookings
   - Filter by status (pending, in_progress, completed, cancelled)
   - Search by vehicle plate / user name
   - Pagination
   - Admin: Lihat semua bookings
   - User: Hanya bookings sendiri

2. **Create.tsx** - Form membuat booking baru
   - Pilih service
   - Input vehicle type (motor/mobil/salon)
   - Input vehicle plate
   - Pilih scheduled_at (datetime)
   - Input notes (optional)

3. **Show.tsx** - Detail booking
   - Informasi booking lengkap
   - Status booking
   - Estimasi waktu selesai
   - Admin: Bisa update status
   - User: Hanya lihat

4. **Edit.tsx** - Form edit booking
   - Admin: Bisa update status & notes
   - User: Hanya bisa update notes (jika status pending)

### **Service Pages** (`resources/js/pages/Services/`) - Admin Only

1. **Index.tsx** - Daftar semua services
   - Search by name
   - Pagination
   - Action: Create, Edit, Delete, Show

2. **Create.tsx** - Form membuat service baru
   - Input name
   - Input description
   - Input duration_minutes
   - Input price

3. **Show.tsx** - Detail service
   - Informasi service lengkap
   - List bookings yang menggunakan service ini

4. **Edit.tsx** - Form edit service
   - Update semua field service

### **Dashboard** (`resources/js/pages/dashboard.tsx`)

- **User View:**
  - Total bookings saya
  - Bookings pending
  - Bookings in progress
  - Bookings completed
  - Recent bookings (5 terakhir)

- **Admin View:**
  - Total bookings (semua)
  - Bookings pending
  - Bookings in progress
  - Bookings completed
  - Total services
  - Total users
  - Recent bookings (10 terakhir)

---

## 🎯 Navigation Structure

### **Sidebar Navigation** (`app-sidebar.tsx`)

**Untuk Semua User:**
- 🏠 Dashboard
- 📅 Pemesanan

**Untuk Admin (Tambahan):**
- ✨ Layanan

### **Header Navigation** (`app-header.tsx`)

- Mobile menu (hamburger)
- Breadcrumbs
- User menu (profile, settings, logout)

---

## 🔐 Authorization & Access Control

### **Middleware**

1. **`auth`** - Memastikan user sudah login
2. **`verified`** - Memastikan email sudah diverifikasi
3. **`admin`** - Memastikan user adalah admin

### **Access Rules**

| Resource | User | Admin |
|----------|------|-------|
| Dashboard | ✅ Own stats | ✅ All stats |
| Bookings List | ✅ Own only | ✅ All |
| Booking Create | ✅ | ✅ |
| Booking Show | ✅ Own only | ✅ All |
| Booking Edit | ✅ Own (pending only) | ✅ All |
| Booking Delete | ✅ Own (pending only) | ✅ All |
| Services List | ❌ | ✅ |
| Service CRUD | ❌ | ✅ |

---

## 📊 Data Flow

### **Booking Flow**

1. **User membuat booking:**
   ```
   User → /bookings/create
   → Pilih service, input data
   → POST /bookings
   → BookingController@store
   → Calculate estimated_finish_at
   → Save to database
   → Redirect to /bookings/{id}
   ```

2. **Admin update status:**
   ```
   Admin → /bookings/{id}/edit
   → Update status (pending → in_progress → completed)
   → PUT /bookings/{id}
   → BookingController@update
   → Recalculate estimated_finish_at (if in_progress)
   → Update database
   → Redirect to /bookings/{id}
   ```

### **Service Flow (Admin)**

1. **Admin membuat service:**
   ```
   Admin → /services/create
   → Input service data
   → POST /services
   → ServiceController@store
   → Save to database
   → Redirect to /services
   ```

2. **Admin update service:**
   ```
   Admin → /services/{id}/edit
   → Update service data
   → PUT /services/{id}
   → ServiceController@update
   → Update database
   → Redirect to /services
   ```

---

## 🎨 Component Structure

### **Layout Components**

- `AppLayout` - Main layout wrapper
  - `AppSidebar` - Sidebar navigation
  - `AppHeader` - Header dengan breadcrumbs
  - `{children}` - Page content

### **UI Components** (`resources/js/components/ui/`)

- `button.tsx` - Button component
- `input.tsx` - Input component
- `textarea.tsx` - Textarea component
- `label.tsx` - Label component
- `card.tsx` - Card component
- `select.tsx` - Select component
- `sidebar.tsx` - Sidebar components
- Dan lainnya...

---

## ✅ Status Implementasi

### **✅ Sudah Diimplementasi:**

- ✅ Authentication (Login, Register, Logout)
- ✅ Dashboard (User & Admin views)
- ✅ Bookings CRUD (Web & API)
- ✅ Services CRUD (Web & API) - Admin only
- ✅ Real-time Queue endpoint
- ✅ Authorization & Access Control
- ✅ Form Validation
- ✅ API Resources
- ✅ Wayfinder Routes
- ✅ Responsive Navigation

### **📝 Catatan untuk Frontend Developer:**

1. **Tidak perlu membuat tampilan** - Semua halaman sudah ada struktur file-nya
2. **Fokus pada styling** - Sesuaikan dengan desain Figma
3. **Komponen UI sudah tersedia** - Gunakan dari `@/components/ui/`
4. **Routes sudah di-generate** - Import dari `@/routes/`
5. **API sudah siap** - Gunakan endpoint `/api/v1/*` untuk integrasi

---

## 🚀 Next Steps (Optional)

Jika diperlukan fitur tambahan berdasarkan desain Figma:

1. **Notifikasi** - Event & Notification system
2. **Queue Display** - Halaman khusus untuk menampilkan antrean real-time
3. **Reports** - Laporan untuk admin
4. **Profile Picture** - Upload foto profil
5. **Email Notifications** - Notifikasi via email

---

**Dokumen ini akan diupdate sesuai kebutuhan.**

