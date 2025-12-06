# 📋 Update Struktur Backend Berdasarkan Desain Figma

Dokumentasi update struktur backend berdasarkan analisis desain Figma yang diberikan.

## 🆕 Fitur Baru yang Ditambahkan

### 1. **Location/Branch Management**

#### Model & Migration
- ✅ **Model:** `app/Models/Location.php`
- ✅ **Migration:** `create_locations_table.php`
- ✅ **Fields:**
  - `name` - Nama lokasi (e.g., "Kedaton", "Way Halim", "Antasari")
  - `address` - Alamat lengkap
  - `phone` - Nomor telepon
  - `operating_hours` - Jam operasional (e.g., "Senin - Minggu 08.00 - 17.00")
  - `latitude` & `longitude` - Koordinat GPS (optional)
  - `is_active` - Status aktif/tidak aktif

#### Controllers
- ✅ **LocationController** - Web controller untuk halaman locations
- ✅ **ApiLocationController** - API controller untuk locations
- ✅ **LocationResource** - API resource untuk format JSON

#### Routes
- ✅ **Web:** 
  - `GET /locations` - List semua locations (public)
  - `GET /locations/{location}` - Detail location (public)
- ✅ **API:**
  - `GET /api/v1/locations` - List locations (public)
  - `GET /api/v1/locations/{location}` - Detail location (public)

#### Seeder
- ✅ Sample locations berdasarkan desain Figma:
  - Kedaton
  - Way Halim
  - Antasari

---

### 2. **Vehicle Size Selection**

#### Database Update
- ✅ **Migration:** `add_location_and_vehicle_size_to_bookings_table.php`
- ✅ **Field:** `vehicle_size` (nullable, string: 'M' atau 'L')
  - `M` = Medium (Mobil kecil/sedang)
  - `L` = Large (Mobil besar/SUV)
  - `null` = Motor (tidak perlu size)

#### Model Update
- ✅ **Booking Model:** Field `vehicle_size` ditambahkan ke `$fillable`
- ✅ **Validation:** `StoreBookingRequest` updated untuk accept `vehicle_size`

---

### 3. **Booking Code**

#### Database Update
- ✅ **Field:** `booking_code` (unique, string)
  - Format: 9 digit (e.g., "000000001")
  - Auto-generated saat booking dibuat

#### Model Update
- ✅ **Booking Model:** Method `generateBookingCode()` untuk generate unique code
- ✅ **Controllers:** Auto-generate booking_code saat create booking

---

### 4. **Invoice/Receipt**

#### Controller
- ✅ **InvoiceController** - Controller untuk halaman invoice
  - `show()` - Tampilkan invoice
  - `download()` - Download invoice (placeholder untuk PDF)

#### Routes
- ✅ **Web:**
  - `GET /bookings/{booking}/invoice` - Tampilkan invoice
  - `GET /bookings/{booking}/invoice/download` - Download invoice

#### Data Structure
Invoice menampilkan:
- Booking code
- User information (billed to)
- Service details
- Vehicle information
- Scheduled date & time
- Estimated finish time
- Payment method (offline/on-site)
- Total price

---

## 📊 Updated Models & Relationships

### **Booking Model**
```php
// New fields
'location_id' => foreign key to locations
'vehicle_size' => 'M' | 'L' | null
'booking_code' => unique string

// New relationship
location() => BelongsTo Location
```

### **Location Model**
```php
// Relationships
bookings() => HasMany Booking
```

---

## 🔄 Updated Controllers

### **BookingController**
- ✅ Load `location` relationship di semua methods
- ✅ Generate `booking_code` saat create booking
- ✅ Support `location_id` dan `vehicle_size` di create/update

### **ApiBookingController**
- ✅ Load `location` relationship di semua methods
- ✅ Generate `booking_code` saat create booking
- ✅ Support `location_id` dan `vehicle_size` di create/update

### **BookingResource**
- ✅ Include `booking_code`, `location`, dan `vehicle_size` di response

---

## 🛣️ Updated Routes

### **Web Routes** (`routes/web.php`)
```php
// Public routes
GET /locations
GET /locations/{location}

// Authenticated routes
GET /bookings/{booking}/invoice
GET /bookings/{booking}/invoice/download
```

### **API Routes** (`routes/api.php`)
```php
// Public routes
GET /api/v1/locations
GET /api/v1/locations/{location}
```

---

## 📝 Multi-Step Booking Flow (Struktur)

Berdasarkan desain Figma, booking flow terdiri dari 4 langkah:

### **Langkah 1: Pilih Lokasi EasyWash**
- User memilih lokasi/cabang
- Data: `location_id`

### **Langkah 2: Pilih Layanan**
- User memilih service package (Standar, Deluxe, Express)
- Data: `service_id`

### **Langkah 3: Pilih Tanggal & Waktu**
- User memilih tanggal dan waktu
- User memilih ukuran kendaraan (M, L, atau Motor)
- Data: `scheduled_at`, `vehicle_type`, `vehicle_size`

### **Langkah 4: Detail Pembayaran & Konfirmasi**
- User input detail pembayaran (email, phone, address, dll)
- Konfirmasi booking
- Data: `notes` (optional), payment info (stored in notes or separate table)

**Note:** Frontend developer akan mengimplementasikan multi-step form. Backend sudah siap menerima semua data yang diperlukan.

---

## 🎯 Halaman yang Perlu Dibuat Frontend

Berdasarkan desain Figma, halaman-halaman berikut perlu dibuat (struktur backend sudah siap):

1. **Landing Page** (`/`)
   - Hero section dengan CTA "Reservasi Cuci Mobil"
   - Section "Layanan Kami" (services list)
   - Section "Antrian" (queue display)
   - Section "Cara Kerja Pemesanan Online" (4 steps)
   - Section "Harga" (pricing)
   - Footer

2. **Location Selection** (`/locations` atau step 1 booking)
   - List semua locations
   - Map view (optional)
   - Select location

3. **Service Selection** (Step 2 booking)
   - List services dengan detail
   - Vehicle size selection (M, L, Motor)

4. **Date & Time Selection** (Step 3 booking)
   - Calendar untuk pilih tanggal
   - Time slots untuk pilih waktu

5. **Payment Details** (Step 4 booking)
   - Form input detail pembayaran
   - Order summary
   - Confirm booking

6. **Invoice Page** (`/bookings/{id}/invoice`)
   - Display invoice details
   - Download button

---

## ✅ Status Implementasi

### **Backend (100% Complete)**
- ✅ Location model & migration
- ✅ Location controllers (Web & API)
- ✅ Location seeder dengan 3 sample locations
- ✅ Booking model update (location_id, vehicle_size, booking_code)
- ✅ Booking controllers update
- ✅ Invoice controller
- ✅ Routes update
- ✅ API resources update
- ✅ Validation update

### **Frontend (Pending)**
- ⏳ Landing page dengan semua sections
- ⏳ Location selection page
- ⏳ Multi-step booking form
- ⏳ Invoice page
- ⏳ Queue display component

---

## 🚀 Next Steps untuk Frontend Developer

1. **Gunakan API endpoints yang sudah tersedia:**
   - `GET /api/v1/locations` - Untuk list locations
   - `GET /api/v1/services` - Untuk list services
   - `POST /api/v1/bookings` - Untuk create booking
   - `GET /api/v1/bookings/queue/live` - Untuk real-time queue

2. **Implementasi multi-step form:**
   - Step 1: Pilih location → set `location_id`
   - Step 2: Pilih service → set `service_id`
   - Step 3: Pilih tanggal, waktu, vehicle size → set `scheduled_at`, `vehicle_type`, `vehicle_size`
   - Step 4: Input payment details & confirm → POST to `/api/v1/bookings`

3. **Styling:**
   - Ikuti desain Figma yang sudah diberikan
   - Gunakan komponen UI yang sudah ada di `@/components/ui/`

---

**Semua struktur backend sudah siap! Frontend developer bisa langsung mulai implementasi tampilan sesuai desain Figma.**

