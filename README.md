# EasyWash - Sistem Booking Layanan Cuci Kendaraan

EasyWash adalah sistem berbasis web untuk mempermudah proses pemesanan layanan cuci kendaraan secara online. Aplikasi ini dibangun menggunakan Laravel 12 (backend) dan React 19 dengan Inertia.js (frontend).

## Persyaratan Sistem

Sebelum memulai, pastikan sistem Anda memenuhi persyaratan berikut:

- PHP >= 8.2
- Composer >= 2.0
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 13.x (atau MySQL >= 8.0)
- Git

## Instalasi

### 1. Clone Repository

Clone repository ini ke direktori lokal Anda:

```bash
git clone <repository-url>
cd EasyWash
```

### 2. Install Dependencies PHP

Install semua dependency PHP menggunakan Composer:

```bash
composer install
```

### 3. Install Dependencies JavaScript

Install semua dependency JavaScript menggunakan npm:

```bash
npm install
```

### 4. Konfigurasi Environment

Salin file environment example dan buat file `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=easywash
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 5. Generate Application Key

Generate application key untuk Laravel:

```bash
php artisan key:generate
```

### 6. Jalankan Migration dan Seeder

Buat database dan jalankan migration:

```bash
php artisan migrate
```

Jalankan seeder untuk menambahkan data awal (admin user dan sample services):

```bash
php artisan db:seed
```

### 7. Build Assets Frontend

Build assets untuk production:

```bash
npm run build
```

Atau untuk development dengan hot reload:

```bash
npm run dev
```

### 8. Jalankan Server Development

Jalankan Laravel development server:

```bash
php artisan serve
```

Aplikasi akan tersedia di `http://localhost:8000`

## Kredensial Default

Setelah menjalankan seeder, Anda dapat login menggunakan kredensial berikut:

**Admin:**
- Email: `admin@easywash.com`
- Password: `password`

**User:**
- Buat akun baru melalui halaman registrasi atau gunakan API endpoint `/api/register`

## Struktur Proyek

```
EasyWash/
├── app/                    # Application logic
│   ├── Http/
│   │   ├── Controllers/   # Controllers (Web & API)
│   │   ├── Requests/      # Form Request validation
│   │   └── Resources/     # API Resources
│   └── Models/            # Eloquent models
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
├── resources/
│   └── js/               # Frontend React/TypeScript
│       ├── components/   # React components
│       ├── pages/        # Inertia pages
│       └── routes/       # Wayfinder generated routes
├── routes/
│   ├── web.php          # Web routes (Inertia)
│   └── api.php          # API routes (RESTful)
└── tests/               # Automated tests
```

## API Endpoints

### Authentication

- `POST /api/register` - Registrasi user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get authenticated user info

### Services (Public)

- `GET /api/v1/services` - List semua services
- `GET /api/v1/services/{id}` - Detail service

### Services (Admin Only)

- `POST /api/v1/services` - Create service
- `PUT /api/v1/services/{id}` - Update service
- `DELETE /api/v1/services/{id}` - Delete service

### Bookings (Authenticated)

- `GET /api/v1/bookings` - List bookings (user: own, admin: all)
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/{id}` - Detail booking
- `PUT /api/v1/bookings/{id}` - Update booking
- `DELETE /api/v1/bookings/{id}` - Delete booking
- `GET /api/v1/bookings/queue/live` - Real-time queue

### Locations (Public)

- `GET /api/v1/locations` - List semua locations
- `GET /api/v1/locations/{id}` - Detail location

## Testing

Jalankan semua tests menggunakan Pest:

```bash
php artisan test
```

Jalankan tests untuk file tertentu:

```bash
php artisan test tests/Feature/Api/ApiBookingTest.php
```

Jalankan tests dengan filter:

```bash
php artisan test --filter=testName
```

## Code Style

Proyek ini menggunakan Laravel Pint untuk code formatting. Format code sebelum commit:

```bash
vendor/bin/pint
```

Format hanya file yang diubah:

```bash
vendor/bin/pint --dirty
```

## Wayfinder Routes

Wayfinder digunakan untuk generate TypeScript routes dari Laravel routes. Regenerate routes setelah perubahan routes:

```bash
php artisan wayfinder:generate --with-form
```

## Development Workflow

1. Buat branch baru dari `main`:
   ```bash
   git checkout -b feature/nama-fitur
   ```

2. Lakukan perubahan dan commit:
   ```bash
   git add .
   git commit -m "Deskripsi perubahan"
   ```

3. Push ke remote:
   ```bash
   git push origin feature/nama-fitur
   ```

4. Buat Pull Request di repository

## Troubleshooting

### Error: "Vite manifest not found"

Jalankan build assets:
```bash
npm run build
```

### Error: "Column does not exist"

Pastikan semua migration sudah dijalankan:
```bash
php artisan migrate
```

### Error: "Class not found"

Jalankan composer autoload:
```bash
composer dump-autoload
```

### Error: "Wayfinder routes not found"

Regenerate Wayfinder routes:
```bash
php artisan wayfinder:generate --with-form
```

## Dokumentasi

- `WEB_STRUCTURE.md` - Dokumentasi lengkap struktur web aplikasi
- `FIGMA_STRUCTURE_UPDATE.md` - Update struktur berdasarkan desain Figma
- `BACKEND_CHECKLIST.md` - Checklist fitur backend yang sudah diimplementasi

## Teknologi yang Digunakan

- **Backend:** Laravel 12, PHP 8.2
- **Frontend:** React 19, Inertia.js v2, TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL
- **Authentication:** Laravel Fortify
- **Testing:** Pest PHP
- **Code Quality:** Laravel Pint, ESLint, Prettier

## Lisensi

Proyek ini dibuat untuk keperluan akademik.

## Kontributor

- Backend Developer: Dyvta Avryansyah
- Frontend Developer: Muhammad Abelian Pratama R
- UI/UX Designer: Iin Sumarni

## Support

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.

