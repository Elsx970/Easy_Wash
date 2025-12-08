import { Badge } from '@/components/ui/badge';
import bookings from '@/routes/bookings';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Calendar, CheckCircle, Clock, Package, Users, 
    ArrowRight, TrendingUp, Car, LogOut, User, 
    Facebook, Twitter, Instagram, MapPin, 
    MousePointerClick, CreditCard, CheckCircle2 
} from 'lucide-react';
import React from 'react';

interface Stats {
    total_bookings: number;
    pending_bookings: number;
    in_progress_bookings: number;
    completed_bookings: number;
    total_services: number;
    total_users?: number;
}

interface Booking {
    id: number;
    vehicle_type: string;
    vehicle_plate: string;
    status: string;
    scheduled_at: string;
    service: {
        id: number;
        name: string;
    };
    user?: {
        id: number;
        name: string;
    };
}

interface Props {
    stats: Stats;
    recentBookings: Booking[];
    isAdmin: boolean;
}

export default function Dashboard({ stats, recentBookings, isAdmin }: Props) {
    // Mengambil data user yang sedang login
    const { auth } = usePage<SharedData>().props;
    const userName = auth?.user?.name || 'Pelanggan';

    // --- FUNGSI SMOOTH SCROLL ---
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault(); // Mencegah loncat kasar default browser
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // =========================================================================
    // TAMPILAN 1: USER VIEW (PERSIS LANDING PAGE + NAVIGASI BERANDA)
    // =========================================================================
    if (!isAdmin) {
        return (
            <>
                <Head title="Dashboard Pelanggan" />

                <div className="min-h-screen bg-white font-sans text-[#1b1b18]">
                    
                    {/* --- NAVBAR USER --- */}
                    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
                        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                            {/* Logo */}
                            <div className="text-2xl font-extrabold tracking-tighter text-[#0F172A] cursor-pointer" onClick={(e) => scrollToSection(e as any, 'home')}>
                                Easy<span className="text-blue-600">Wash</span>
                            </div>

                            {/* Navigasi Tengah */}
                            <nav className="hidden md:flex gap-8 text-gray-600 font-medium text-sm">
                                {/* Link Beranda (Aktif) */}
                                <a 
                                    href="#home" 
                                    onClick={(e) => scrollToSection(e, 'home')} 
                                    className="text-blue-600 font-bold transition"
                                >
                                    Beranda
                                </a>

                                <a 
                                    href="#layanan" 
                                    onClick={(e) => scrollToSection(e, 'layanan')} 
                                    className="hover:text-blue-600 transition"
                                >
                                    Layanan
                                </a>

                                <a 
                                    href="#cara-kerja" 
                                    onClick={(e) => scrollToSection(e, 'cara-kerja')} 
                                    className="hover:text-blue-600 transition"
                                >
                                    Cara Kerja
                                </a>

                                <a 
                                    href="#harga" 
                                    onClick={(e) => scrollToSection(e, 'harga')} 
                                    className="hover:text-blue-600 transition"
                                >
                                    Harga
                                </a>

                                <Link href={bookings.index().url} className="hover:text-blue-600 transition">
                                    Riwayat Pesanan
                                </Link>
                            </nav>

                            {/* Kanan: Sapaan & Logout */}
                            <div className="flex items-center gap-3">
                                <span className="px-5 py-2 text-sm font-medium text-gray-700 cursor-default truncate max-w-[150px]">
                                    Hi, {userName}
                                </span>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Keluar</span>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* --- HERO SECTION --- */}
                    {/* Tambahkan id="home" untuk target scroll Beranda */}
                    <section id="home" className="relative pt-32 md:pt-40 pb-0 bg-[#0F172A]">
                        {/* Background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                             <img 
                                src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1480&q=80" 
                                alt="Car Wash Footage" 
                                className="w-full h-full object-cover opacity-90 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/80 to-[#0F172A] z-10"></div>
                        </div>

                        {/* Content */}
                        <div className="relative w-full px-4 md:px-16 lg:px-24 text-center z-20">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 tracking-wide uppercase">
                                Selamat Datang Kembali, {userName}
                            </span>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight leading-tight w-full">
                                Mobil Kotor? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Cuci Sekarang</span>
                            </h1>
                            
                            <p className="text-gray-300 w-full max-w-4xl mx-auto mb-10 text-lg md:text-xl leading-relaxed">
                                Jangan biarkan debu menumpuk. Jadwalkan pencucian kendaraan Anda sekarang dengan mudah.
                            </p>
                            
                            <div className="mb-8 relative z-30">
                                <Link href={bookings.create().url} className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1 inline-flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Buat Reservasi Baru
                                </Link>
                            </div>

                            {/* Mobil Overlap */}
                            <div className="relative z-30 mt-12 flex flex-row justify-center items-end gap-2 md:gap-4 -mb-12 md:-mb-32 pointer-events-none w-full max-w-[98%] 2xl:max-w-screen-2xl mx-auto px-4">
                                <div className="relative z-10 w-[45%] md:w-[700px] transition-all duration-700 mb-1 md:mb-3">
                                    <img src="https://pngimg.com/d/mercedes_PNG80136.png" alt="Mobil Hitam" className="w-full h-auto drop-shadow-2xl" />
                                </div>
                                <div className="relative z-20 w-[50%] md:w-[850px] transition-all duration-700">
                                    <img src="https://pngimg.com/d/mercedes_PNG80188.png" alt="Mobil Silver" className="w-full h-auto drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- LAYANAN --- */}
                    <section id="layanan" className="pt-24 md:pt-48 pb-24 bg-white relative z-10">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row items-start md:items-end mb-16 gap-8">
                                <div className="md:w-1/3 border-l-4 border-blue-600 pl-6">
                                    <h2 className="text-4xl font-bold text-[#0F172A] mb-2">Pilih Layanan</h2>
                                </div>
                                <div className="md:w-2/3">
                                    <p className="text-gray-500 text-lg">Sesuaikan perawatan dengan kebutuhan kendaraan Anda hari ini.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Card 1 */}
                                <div className="bg-white p-8 border border-blue-200 rounded-xl hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                        <CheckCircle2 className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F172A] mb-4">Paket Standar</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6">Pencucian eksterior & interior dasar.</p>
                                    <Link href={bookings.create().url} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1">Pilih Paket <ArrowRight className="w-4 h-4"/></Link>
                                </div>
                                
                                {/* Card 2 */}
                                <div className="bg-white p-8 border border-blue-200 rounded-xl hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                        <CheckCircle2 className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F172A] mb-4">Paket Deluxe</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6">Perlindungan tahan lama & perawatan ekstra.</p>
                                    <Link href={bookings.create().url} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1">Pilih Paket <ArrowRight className="w-4 h-4"/></Link>
                                </div>
                                
                                {/* Card 3 */}
                                <div className="bg-white p-8 border border-blue-200 rounded-xl hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                        <CheckCircle2 className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F172A] mb-4">Paket Express</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6">Cuci cepat bagian luar dengan bahan premium.</p>
                                    <Link href={bookings.create().url} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1">Pilih Paket <ArrowRight className="w-4 h-4"/></Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- CARA KERJA --- */}
                    <section id="cara-kerja" className="relative py-24 bg-[#0F172A] overflow-hidden">
                        <div className="absolute inset-0 z-0">
                             <img 
                                src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop" 
                                alt="Background Texture" 
                                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A] z-10"></div>
                        </div>

                        <div className="relative z-20 max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Alur Pemesanan</h2>
                                <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                                 {[
                                    { title: "Langkah 1", icon: MapPin, sub: "Pilih Cabang", desc: "Pilih cabang Easywash terdekat" },
                                    { title: "Langkah 2", icon: MousePointerClick, sub: "Pilih Paket", desc: "Express, Standar, atau Deluxe" },
                                    { title: "Langkah 3", icon: Calendar, sub: "Atur Jadwal", desc: "Tentukan tanggal & waktu pencucian" },
                                    { title: "Langkah 4", icon: CreditCard, sub: "Datang & Bayar", desc: "Kami siap melayani kendaraan Anda" },
                                 ].map((step, idx) => (
                                    <div key={idx} className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/10 shadow-xl group hover:bg-white/10 transition">
                                        <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all">
                                            <step.icon className="w-9 h-9 text-white" />
                                        </div>
                                        <h5 className="font-bold mb-3 text-xl text-white">{step.sub}</h5>
                                        <p className="text-sm text-gray-300 leading-relaxed">{step.desc}</p>
                                    </div>
                                 ))}
                            </div>
                        </div>
                    </section>

                    {/* --- HARGA (Pricing) --- */}
                    <section id="harga" className="py-24 bg-[#F8FAFC]">
                        <div className="max-w-7xl mx-auto px-6">
                             <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-[#0F172A]">Daftar Harga</h2>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Paket Standar */}
                                <div className="bg-white p-6 shadow-lg hover:shadow-2xl border-t-4 border-blue-600 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                                    <h3 className="font-bold text-2xl mb-3 text-[#0F172A]">Paket Standar</h3>
                                    <p className="text-sm text-gray-500 mb-6">Pencucian eksterior & interior dasar.</p>
                                    <div className="mt-auto">
                                        <p className="text-xs text-gray-400">Mulai dari</p>
                                        <p className="text-3xl font-bold text-[#0F172A] mb-6">Rp 80.000</p>
                                        <Link href={bookings.create().url} className="block w-full py-3 text-center border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                            Pesan Sekarang
                                        </Link>
                                    </div>
                                </div>

                                 {/* Paket Deluxe */}
                                 <div className="bg-white p-6 shadow-lg hover:shadow-2xl border-t-4 border-blue-600 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col md:-mt-4 relative z-10">
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">POPULAR</div>
                                    <h3 className="font-bold text-2xl mb-3 text-[#0F172A]">Paket Deluxe</h3>
                                    <p className="text-sm text-gray-500 mb-6">Perlindungan tahan lama & perawatan ekstra.</p>
                                    <div className="mt-auto">
                                        <p className="text-xs text-gray-400">Mulai dari</p>
                                        <p className="text-3xl font-bold text-[#0F172A] mb-6">Rp 120.000</p>
                                        <Link href={bookings.create().url} className="block w-full py-3 text-center bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                            Pesan Sekarang
                                        </Link>
                                    </div>
                                </div>

                                {/* Paket Express */}
                                <div className="bg-white p-6 shadow-lg hover:shadow-2xl border-t-4 border-blue-600 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                                    <h3 className="font-bold text-2xl mb-3 text-[#0F172A]">Paket Express</h3>
                                    <p className="text-sm text-gray-500 mb-6">Cuci cepat bagian luar.</p>
                                    <div className="mt-auto">
                                        <p className="text-xs text-gray-400">Mulai dari</p>
                                        <p className="text-3xl font-bold text-[#0F172A] mb-6">Rp 50.000</p>
                                        <Link href={bookings.create().url} className="block w-full py-3 text-center border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                            Pesan Sekarang
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- FOOTER --- */}
                    <footer className="bg-[#0F172A] text-white py-12 border-t border-gray-800">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                             <div className="text-2xl font-extrabold tracking-tighter text-white mb-6">
                                Easy<span className="text-blue-500">Wash</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">Copyright © 2025, Universe.</p>
                            <p className="text-gray-400 text-sm mb-2">Bandar Lampung, Lampung, Indonesia.</p>
                            <p className="text-gray-400 text-sm mb-8 font-mono">+62 895-6179-69599 (CS)</p>
                            
                            <div className="flex justify-center gap-8">
                                <a href="#" className="text-gray-400 hover:text-blue-500 transition transform hover:scale-110"><Facebook size={24} /></a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110"><Twitter size={24} /></a>
                                <a href="#" className="text-gray-400 hover:text-pink-500 transition transform hover:scale-110"><Instagram size={24} /></a>
                            </div>
                        </div>
                    </footer>
                </div>
            </>
        );
    }

    // =========================================================================
    // TAMPILAN 2: ADMIN VIEW (Original Dashboard Style)
    // =========================================================================
    
    // Data Statistik Admin
    const statCards = [
        {
            title: 'Total Pemesanan',
            value: stats.total_bookings,
            icon: Package,
            description: 'Total transaksi masuk',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
        {
            title: 'Menunggu',
            value: stats.pending_bookings,
            icon: Clock,
            description: 'Perlu konfirmasi',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
        },
        {
            title: 'Sedang Diproses',
            value: stats.in_progress_bookings,
            icon: Calendar,
            description: 'Sedang dicuci',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
        },
        {
            title: 'Selesai',
            value: stats.completed_bookings,
            icon: CheckCircle,
            description: 'Siap diambil',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
        },
    ];

    if (stats.total_services !== undefined) {
         statCards.push({
            title: 'Layanan Tersedia',
            value: stats.total_services,
            icon: Car,
            description: 'Jenis paket cuci',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
        });
    }
    if (stats.total_users !== undefined) {
        statCards.push({
            title: 'Total Pengguna',
            value: stats.total_users,
            icon: Users,
            description: 'Pengguna terdaftar',
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            border: 'border-pink-200',
        });
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            in_progress: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20',
            completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200',
        };

        const labels: Record<string, string> = {
            pending: 'Menunggu',
            in_progress: 'Diproses',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        };

        return (
            <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || ''}`}>
                {labels[status] || status}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-gray-50 font-sans text-[#1b1b18]">
                {/* --- NAVBAR ADMIN --- */}
                <header className="sticky top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
                            Easy<span className="text-blue-600">Wash</span> <span className="text-xs text-gray-400 font-normal">Admin</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-sm font-bold text-[#0F172A]">{userName}</span>
                                <span className="text-xs text-red-500">Administrator</span>
                            </div>
                            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="h-8 w-px bg-gray-200 mx-1"></div>
                            <Link href="/logout" method="post" as="button" className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition">
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Keluar</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* --- CONTENT UTAMA ADMIN --- */}
                <main className="pb-20">
                    <div className="bg-[#0F172A] pt-12 pb-24 md:pb-32 px-6">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Halo Admin, {userName}! 👋
                            </h1>
                            <p className="text-gray-400 mt-4 max-w-xl text-lg">
                                Pantau statistik harian dan kelola operasional EasyWash dengan mudah dari sini.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-20 relative z-10">
                        {/* Grid Statistik */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                            {statCards.map((stat, idx) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</h3>
                                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-[#0F172A]">{stat.value}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 font-medium flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> {stat.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tabel Booking Terbaru */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                        Pemesanan Terbaru
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Daftar transaksi pencucian kendaraan terkini.
                                    </p>
                                </div>
                                <Link
                                    href={bookings.index().url}
                                    className="group flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    Lihat Semua
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {recentBookings.length > 0 ? (
                                    recentBookings.map((booking) => (
                                        <div key={booking.id} className="p-6 md:p-8 hover:bg-gray-50 transition-colors duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                            <div className="flex items-start gap-5">
                                                <div className="hidden md:flex h-14 w-14 rounded-2xl bg-[#0F172A] items-center justify-center text-white shrink-0 shadow-lg">
                                                    <Car className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-lg font-bold text-[#0F172A]">{booking.vehicle_plate}</h4>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 tracking-wide border border-gray-200">
                                                            {booking.vehicle_type}
                                                        </span>
                                                    </div>
                                                    <p className="text-blue-600 font-semibold text-sm mb-1">{booking.service.name}</p>
                                                    {booking.user && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Users className="w-3 h-3" />
                                                            {booking.user.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                                <div className="text-left md:text-right">
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {new Date(booking.scheduled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Pukul {new Date(booking.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                    </p>
                                                </div>
                                                <div>{getStatusBadge(booking.status)}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-sm text-gray-500">Belum ada data pemesanan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}