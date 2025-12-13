import { Badge } from '@/components/ui/badge';
import bookings from '@/routes/bookings';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Calendar, CheckCircle, Clock, Package, Users, 
    ArrowRight, TrendingUp, Car, LogOut, User, 
    Facebook, Twitter, Instagram, MapPin, 
    MousePointerClick, CreditCard, CheckCircle2,
    Trash2, Edit3, Eye, Filter, DollarSign, Zap, AlertCircle
} from 'lucide-react';
import React, { useState } from 'react';

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

interface UserAccount {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    email_verified_at?: string;
}

interface Transaction {
    id: number;
    booking_id: number;
    amount: number;
    payment_method: string;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
    booking?: {
        vehicle_plate: string;
        service: {
            name: string;
        };
    };
}

interface WashStatus {
    id: number;
    booking_id: number;
    status: 'waiting' | 'washing' | 'drying' | 'completed' | 'quality_check';
    progress_percentage: number;
    notes?: string;
    updated_at: string;
}

interface Props {
    stats: Stats;
    recentBookings: Booking[];
    isAdmin: boolean;
    users?: UserAccount[];
    transactions?: Transaction[];
    washStatuses?: WashStatus[];
}

export default function Dashboard({ stats, recentBookings, isAdmin, users = [], transactions = [], washStatuses = [] }: Props) {
    // Mengambil data user yang sedang login
    const { auth } = usePage<SharedData>().props;
    const userName = auth?.user?.name || 'Pelanggan';
    const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'washStatus' | 'transactions'>('dashboard');
    const [searchUser, setSearchUser] = useState('');
    const [filterTransactionStatus, setFilterTransactionStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    // Handler untuk delete user
    const handleDeleteUser = async (userId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            setLoadingAction(`delete-user-${userId}`);
            try {
                const response = await fetch(`/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }
                });
                if (response.ok) {
                    alert('User berhasil dihapus');
                    window.location.reload();
                }
            } catch (error) {
                alert('Gagal menghapus user');
            } finally {
                setLoadingAction(null);
            }
        }
    };

    // Handler untuk update wash status
    const handleUpdateWashStatus = async (washId: number, newStatus: string) => {
        setLoadingAction(`wash-${washId}`);
        try {
            const response = await fetch(`/api/admin/wash-status/${washId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    status: newStatus,
                    progress_percentage: newStatus === 'completed' ? 100 : 50,
                })
            });
            if (response.ok) {
                alert('Status cuci berhasil diupdate');
                window.location.reload();
            }
        } catch (error) {
            alert('Gagal mengupdate status');
        } finally {
            setLoadingAction(null);
        }
    };

    // Handler untuk update transaction status
    const handleUpdateTransactionStatus = async (transactionId: number, newStatus: string) => {
        setLoadingAction(`txn-${transactionId}`);
        try {
            const response = await fetch(`/api/admin/transactions/${transactionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                alert('Status transaksi berhasil diupdate');
                window.location.reload();
            }
        } catch (error) {
            alert('Gagal mengupdate transaksi');
        } finally {
            setLoadingAction(null);
        }
    };

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
    // TAMPILAN 2: ADMIN VIEW (Dashboard + Management Panels)
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
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
        {
            title: 'Sedang Diproses',
            value: stats.in_progress_bookings,
            icon: Calendar,
            description: 'Sedang dicuci',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
        {
            title: 'Selesai',
            value: stats.completed_bookings,
            icon: CheckCircle,
            description: 'Siap diambil',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
    ];

    if (stats.total_services !== undefined) {
         statCards.push({
            title: 'Layanan Tersedia',
            value: stats.total_services,
            icon: Car,
            description: 'Jenis paket cuci',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        });
    }
    if (stats.total_users !== undefined) {
        statCards.push({
            title: 'Total Pengguna',
            value: stats.total_users,
            icon: Users,
            description: 'Pengguna terdaftar',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
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

    // Filter users berdasarkan search
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUser.toLowerCase())
    );

    // Filter transactions berdasarkan status
    const filteredTransactions = transactions.filter(t => 
        filterTransactionStatus === 'all' ? true : t.status === filterTransactionStatus
    );

    // Tab Navigation Component
    const TabButton = ({ tab, label, icon: Icon }: { tab: typeof adminTab; label: string; icon: any }) => (
        <button
            onClick={() => setAdminTab(tab)}
            className={`px-6 py-3 font-semibold text-sm flex items-center gap-2 transition-all rounded-lg border-b-2 ${
                adminTab === tab
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

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
                                Kelola pengguna, validasi status cuci, dan monitor transaksi masuk dengan mudah.
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

                        {/* Tab Navigation */}
                        <div className="bg-white rounded-t-2xl shadow-xl border border-gray-100 border-b-0 p-4">
                            <div className="flex gap-2 flex-wrap">
                                <TabButton tab="dashboard" label="Dashboard" icon={Calendar} />
                                <TabButton tab="users" label="Kelola Pengguna" icon={Users} />
                                <TabButton tab="washStatus" label="Status Cuci" icon={Zap} />
                                <TabButton tab="transactions" label="Transaksi" icon={DollarSign} />
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100">
                            {/* TAB 1: DASHBOARD */}
                            {adminTab === 'dashboard' && (
                                <div className="p-6 md:p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Antrian Hari Ini */}
                                        <div className="lg:col-span-2">
                                            <div className="border-b border-gray-50 pb-6 mb-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                                                            <Calendar className="w-6 h-6 text-blue-600" />
                                                            Antrian Hari Ini
                                                        </h2>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Real-time queue untuk {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-lg font-bold text-blue-600">🔄</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                                                {recentBookings.filter(b => {
                                                    const today = new Date().toDateString();
                                                    const bookingDate = new Date(b.scheduled_at).toDateString();
                                                    return bookingDate === today;
                                                }).length > 0 ? (
                                                    recentBookings
                                                        .filter(b => {
                                                            const today = new Date().toDateString();
                                                            const bookingDate = new Date(b.scheduled_at).toDateString();
                                                            return bookingDate === today;
                                                        })
                                                        .map((booking, index) => (
                                                            <div key={booking.id} className="p-5 md:p-6 hover:bg-blue-50/50 transition-colors duration-200 border-l-4 border-blue-600">
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex items-start gap-4 flex-1">
                                                                        <div className="flex-shrink-0">
                                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                                                {index + 1}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <h4 className="text-base font-bold text-[#0F172A] truncate">{booking.vehicle_plate}</h4>
                                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 text-gray-700 tracking-wide border border-gray-300 flex-shrink-0">
                                                                                    {booking.vehicle_type}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-blue-600 font-semibold text-sm mb-2">{booking.service.name}</p>
                                                                            {booking.user && (
                                                                                <p className="text-xs text-gray-600 font-medium">
                                                                                    👤 {booking.user.name}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                                        <div className="text-right">
                                                                            <p className="text-sm font-bold text-gray-700">
                                                                                {new Date(booking.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                                            </p>
                                                                        </div>
                                                                        <div>{getStatusBadge(booking.status)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                ) : (
                                                    <div className="py-16 px-6 text-center">
                                                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                        <p className="text-gray-500 font-medium">Tidak ada antrian hari ini</p>
                                                        <p className="text-xs text-gray-400 mt-1">Semua slot kosong, siap melayani</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info Sidekick */}
                                        <div className="space-y-6">
                                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Total Antrian</p>
                                                <p className="text-3xl font-bold text-blue-600">
                                                    {recentBookings.filter(b => {
                                                        const today = new Date().toDateString();
                                                        const bookingDate = new Date(b.scheduled_at).toDateString();
                                                        return bookingDate === today;
                                                    }).length}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">Sedang Diproses</p>
                                                <p className="text-3xl font-bold text-purple-600">
                                                    {recentBookings.filter(b => {
                                                        const today = new Date().toDateString();
                                                        const bookingDate = new Date(b.scheduled_at).toDateString();
                                                        return bookingDate === today && b.status === 'in_progress';
                                                    }).length}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                                                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">Menunggu Konfirmasi</p>
                                                <p className="text-3xl font-bold text-yellow-600">
                                                    {recentBookings.filter(b => {
                                                        const today = new Date().toDateString();
                                                        const bookingDate = new Date(b.scheduled_at).toDateString();
                                                        return bookingDate === today && b.status === 'pending';
                                                    }).length}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Selesai</p>
                                                <p className="text-3xl font-bold text-emerald-600">
                                                    {recentBookings.filter(b => {
                                                        const today = new Date().toDateString();
                                                        const bookingDate = new Date(b.scheduled_at).toDateString();
                                                        return bookingDate === today && b.status === 'completed';
                                                    }).length}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => location.reload()}
                                                className="w-full group flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 rounded-lg hover:shadow-lg hover:shadow-blue-600/50 transition-all active:scale-95"
                                            >
                                                <TrendingUp className="w-4 h-4" />
                                                Refresh Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: KELOLA PENGGUNA */}
                            {adminTab === 'users' && (
                                <div className="p-6 md:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Manajemen Akun Pengguna</h2>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    placeholder="Cari nama atau email pengguna..."
                                                    value={searchUser}
                                                    onChange={(e) => setSearchUser(e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Bergabung</th>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user) => (
                                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="font-semibold text-gray-900">{user.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                    user.role === 'admin' 
                                                                        ? 'bg-red-100 text-red-700 border-red-200'
                                                                        : 'bg-blue-100 text-blue-700 border-blue-200'
                                                                }`}>
                                                                    {user.role === 'admin' ? 'Admin' : 'Pelanggan'}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                    user.email_verified_at
                                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                                }`}>
                                                                    {user.email_verified_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600" title="Lihat Detail">
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                    <button className="p-2 hover:bg-yellow-100 rounded-lg transition text-yellow-600" title="Edit Pengguna">
                                                                        <Edit3 className="w-4 h-4" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        disabled={loadingAction === `delete-user-${user.id}`}
                                                                        className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 disabled:opacity-50"
                                                                        title="Hapus Pengguna"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center">
                                                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                            <p className="text-gray-500 font-medium">Tidak ada pengguna ditemukan</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: STATUS CUCI KENDARAAN */}
                            {adminTab === 'washStatus' && (
                                <div className="p-6 md:p-8">
                                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Validasi Status Cuci Kendaraan</h2>

                                    <div className="grid gap-6">
                                        {washStatuses && washStatuses.length > 0 ? (
                                            washStatuses.map((wash) => {
                                                const statusColors: Record<string, { bg: string; text: string; label: string }> = {
                                                    'waiting': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Menunggu' },
                                                    'washing': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Sedang Dicuci' },
                                                    'drying': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Pengeringan' },
                                                    'quality_check': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Cek Kualitas' },
                                                    'completed': { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Selesai' },
                                                };
                                                const color = statusColors[wash.status] || statusColors['waiting'];

                                                return (
                                                    <div key={wash.id} className={`p-6 rounded-xl border border-gray-200 ${color.bg}`}>
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div>
                                                                <p className="text-sm text-gray-600 mb-1">Booking ID: {wash.booking_id}</p>
                                                                <h3 className="text-lg font-bold text-gray-900">Status Proses Cuci</h3>
                                                            </div>
                                                            <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold rounded-full ${color.text} border-gray-300`}>
                                                                {color.label}
                                                            </Badge>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="mb-6">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm font-semibold text-gray-700">Progress</span>
                                                                <span className="text-sm font-bold text-gray-900">{wash.progress_percentage}%</span>
                                                            </div>
                                                            <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                                                    style={{ width: `${wash.progress_percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-3 flex-wrap">
                                                            <button 
                                                                onClick={() => handleUpdateWashStatus(wash.id, 'completed')}
                                                                disabled={loadingAction === `wash-${wash.id}`}
                                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                <Zap className="w-4 h-4" />
                                                                {loadingAction === `wash-${wash.id}` ? 'Loading...' : 'Update Status'}
                                                            </button>
                                                            <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition flex items-center gap-2">
                                                                <Edit3 className="w-4 h-4" />
                                                                Edit Catatan
                                                            </button>
                                                        </div>

                                                        {wash.notes && (
                                                            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-300">
                                                                <p className="text-xs text-gray-600 font-semibold mb-1">Catatan:</p>
                                                                <p className="text-sm text-gray-700">{wash.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="py-16 px-6 text-center bg-gray-50 rounded-lg">
                                                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500 font-medium">Tidak ada data status cuci</p>
                                                <p className="text-xs text-gray-400 mt-1">Mulai dengan membuat pemesanan baru</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: MONITORING TRANSAKSI */}
                            {adminTab === 'transactions' && (
                                <div className="p-6 md:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Monitoring Transaksi Masuk</h2>
                                        <div className="flex gap-3 flex-wrap">
                                            {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setFilterTransactionStatus(status)}
                                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                                                        filterTransactionStatus === status
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <Filter className="w-4 h-4" />
                                                    {status === 'all' ? 'Semua' : status === 'pending' ? 'Menunggu' : status === 'completed' ? 'Berhasil' : 'Gagal'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID Transaksi</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plat Kendaraan</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Layanan</th>
                                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Jumlah</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Metode</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Waktu</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredTransactions.length > 0 ? (
                                                    filteredTransactions.map((txn) => (
                                                        <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 font-semibold text-gray-900">#{txn.id}</td>
                                                            <td className="px-6 py-4 text-gray-600">{txn.booking?.vehicle_plate || '-'}</td>
                                                            <td className="px-6 py-4 text-gray-600">{txn.booking?.service.name || '-'}</td>
                                                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                                                Rp {txn.amount.toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant="outline" className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border-gray-300">
                                                                    {txn.payment_method === 'cash' ? 'Tunai' : 'Transfer'}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                    txn.status === 'completed' 
                                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                        : txn.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                                }`}>
                                                                    {txn.status === 'completed' ? 'Berhasil' : txn.status === 'pending' ? 'Menunggu' : 'Gagal'}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                                {new Date(txn.created_at).toLocaleDateString('id-ID')} {new Date(txn.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={7} className="px-6 py-8 text-center">
                                                            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                            <p className="text-gray-500 font-medium">Tidak ada transaksi</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}