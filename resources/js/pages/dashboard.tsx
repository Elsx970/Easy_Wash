import { Badge } from '@/components/ui/badge';
import bookings from '@/routes/bookings';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Calendar, CheckCircle, Clock, Package, Users, 
    ArrowRight, TrendingUp, Car, LogOut, User, 
    Facebook, Twitter, Instagram, MapPin, 
    MousePointerClick, CreditCard, CheckCircle2,
    Trash2, Edit3, Eye, Filter, DollarSign, Zap, AlertCircle,
    X, Save, Loader2
} from 'lucide-react';
import React, { useState } from 'react';

// --- INTERFACES ---
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
    
    // --- STATE ADMIN ---
    const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'washStatus' | 'transactions'>('dashboard');
    const [searchUser, setSearchUser] = useState('');
    const [filterTransactionStatus, setFilterTransactionStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    // --- STATE UNTUK EDIT USER (MODAL) ---
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: 'customer' });

    // --- STATE UNTUK EDIT CATATAN WASH (MODAL) ---
    const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
    const [editingWashId, setEditingWashId] = useState<number | null>(null);
    const [noteForm, setNoteForm] = useState('');

    // ==========================================
    // LOGIKA ADMIN: USER MANAGEMENT
    // ==========================================

    // Buka Modal Edit User
    const handleOpenEditUser = (user: UserAccount) => {
        setEditingUser(user);
        setEditUserForm({ name: user.name, email: user.email, role: user.role });
        setIsEditUserOpen(true);
    };

    // Submit Edit User
    const handleSubmitEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        
        setLoadingAction('update-user');
        try {
            const response = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' 
                },
                body: JSON.stringify(editUserForm)
            });

            if (response.ok) {
                alert('Data pengguna berhasil diperbarui!');
                setIsEditUserOpen(false);
                window.location.reload(); 
            } else {
                alert('Gagal memperbarui data pengguna.');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan sistem.');
        } finally {
            setLoadingAction(null);
        }
    };

    // Delete User
    const handleDeleteUser = async (userId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini? Aksi ini tidak dapat dibatalkan.')) {
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

    // ==========================================
    // LOGIKA ADMIN: WASH STATUS & NOTES
    // ==========================================

    // Update Status Cucian
    const handleUpdateWashStatus = async (washId: number, newStatus: string) => {
        setLoadingAction(`wash-${washId}`);
        let progress = 0;
        switch(newStatus) {
            case 'waiting': progress = 0; break;
            case 'washing': progress = 25; break;
            case 'drying': progress = 50; break;
            case 'quality_check': progress = 75; break;
            case 'completed': progress = 100; break;
        }

        try {
            const response = await fetch(`/api/admin/wash-status/${washId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    status: newStatus,
                    progress_percentage: progress,
                })
            });
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            alert('Gagal mengupdate status');
        } finally {
            setLoadingAction(null);
        }
    };

    // Buka Modal Edit Catatan
    const handleOpenEditNote = (wash: WashStatus) => {
        setEditingWashId(wash.id);
        setNoteForm(wash.notes || '');
        setIsEditNoteOpen(true);
    };

    // Submit Edit Catatan
    const handleSubmitNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWashId) return;

        setLoadingAction('update-note');
        try {
            const response = await fetch(`/api/admin/wash-status/${editingWashId}/notes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ notes: noteForm })
            });

            if (response.ok) {
                alert('Catatan berhasil disimpan');
                setIsEditNoteOpen(false);
                window.location.reload();
            }
        } catch (error) {
            alert('Gagal menyimpan catatan');
        } finally {
            setLoadingAction(null);
        }
    };

    // --- FUNGSI UTILS ---
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

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

    // Filter Logic
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUser.toLowerCase())
    );

    const filteredTransactions = transactions.filter(t => 
        filterTransactionStatus === 'all' ? true : t.status === filterTransactionStatus
    );

    // Tab Component
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

    // =========================================================================
    // TAMPILAN 1: USER VIEW (PELANGGAN)
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
                                <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="text-blue-600 font-bold transition">Beranda</a>
                                <a href="#layanan" onClick={(e) => scrollToSection(e, 'layanan')} className="hover:text-blue-600 transition">Layanan</a>
                                <a href="#cara-kerja" onClick={(e) => scrollToSection(e, 'cara-kerja')} className="hover:text-blue-600 transition">Cara Kerja</a>
                                <a href="#harga" onClick={(e) => scrollToSection(e, 'harga')} className="hover:text-blue-600 transition">Harga</a>
                                <Link href={bookings.index().url} className="hover:text-blue-600 transition">Riwayat Pesanan</Link>
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
    // TAMPILAN 2: ADMIN VIEW (DENGAN LOGIKA PENUH)
    // =========================================================================
    
    // Data Stat Cards
    const statCards = [
        { title: 'Total Pemesanan', value: stats.total_bookings, icon: Package, description: 'Total transaksi masuk', color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Menunggu', value: stats.pending_bookings, icon: Clock, description: 'Perlu konfirmasi', color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { title: 'Sedang Diproses', value: stats.in_progress_bookings, icon: Calendar, description: 'Sedang dicuci', color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Selesai', value: stats.completed_bookings, icon: CheckCircle, description: 'Siap diambil', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];
    if (stats.total_services !== undefined) statCards.push({ title: 'Layanan', value: stats.total_services, icon: Car, description: 'Jenis paket', color: 'text-blue-600', bg: 'bg-blue-50' });
    if (stats.total_users !== undefined) statCards.push({ title: 'Pengguna', value: stats.total_users, icon: Users, description: 'Terdaftar', color: 'text-blue-600', bg: 'bg-blue-50' });

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
                            <Link href="/logout" method="post" as="button" className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition">
                                <LogOut className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="pb-20">
                    <div className="bg-[#0F172A] pt-12 pb-24 md:pb-32 px-6">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Halo Admin, {userName}! 👋</h1>
                            <p className="text-gray-400 mt-4 max-w-xl text-lg">Kelola pengguna, validasi status cuci, dan monitor transaksi.</p>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-20 relative z-10">
                        {/* STATS */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                            {statCards.map((stat, idx) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-600 hover:shadow-2xl transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase">{stat.title}</h3>
                                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}><Icon className="h-5 w-5" /></div>
                                        </div>
                                        <div className="text-3xl font-extrabold text-[#0F172A]">{stat.value}</div>
                                        <p className="text-xs text-gray-500 mt-2 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {stat.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* TABS */}
                        <div className="bg-white rounded-t-2xl shadow-xl border border-gray-100 border-b-0 p-4">
                            <div className="flex gap-2 flex-wrap">
                                <TabButton tab="dashboard" label="Dashboard" icon={Calendar} />
                                <TabButton tab="users" label="Kelola Pengguna" icon={Users} />
                                <TabButton tab="washStatus" label="Status Cuci" icon={Zap} />
                                <TabButton tab="transactions" label="Transaksi" icon={DollarSign} />
                            </div>
                        </div>

                        <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 min-h-[400px]">
                            {/* === TAB 1: DASHBOARD (ANTRIAN) === */}
                            {adminTab === 'dashboard' && (
                                <div className="p-6 md:p-8">
                                     <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2 mb-6">
                                        <Calendar className="w-6 h-6 text-blue-600" /> Antrian Hari Ini
                                    </h2>
                                    <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                                        {recentBookings.filter(b => new Date(b.scheduled_at).toDateString() === new Date().toDateString()).length > 0 ? (
                                            recentBookings
                                                .filter(b => new Date(b.scheduled_at).toDateString() === new Date().toDateString())
                                                .map((booking, index) => (
                                                    <div key={booking.id} className="p-5 border-l-4 border-blue-600 hover:bg-blue-50 transition">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-4">
                                                                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{index+1}</div>
                                                                <div>
                                                                    <h4 className="font-bold text-gray-800">{booking.vehicle_plate}</h4>
                                                                    <p className="text-sm text-blue-600">{booking.service.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-gray-700">{new Date(booking.scheduled_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</p>
                                                                {getStatusBadge(booking.status)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="text-center py-10 text-gray-400">Tidak ada antrian hari ini.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* === TAB 2: KELOLA PENGGUNA (DENGAN LOGIKA EDIT) === */}
                            {adminTab === 'users' && (
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-[#0F172A]">Manajemen Pengguna</h2>
                                        <input type="text" placeholder="Cari user..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="border px-4 py-2 rounded-lg" />
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-900">{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge variant="outline" className={user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                                                                {user.role}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge variant="outline" className={user.email_verified_at ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                                                                {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 flex justify-center gap-2">
                                                            <button 
                                                                onClick={() => handleOpenEditUser(user)}
                                                                className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition" title="Edit">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                disabled={loadingAction === `delete-user-${user.id}`}
                                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50" title="Hapus">
                                                                {loadingAction === `delete-user-${user.id}` ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* === TAB 3: STATUS CUCI (DENGAN LOGIKA EDIT NOTE & UPDATE) === */}
                            {adminTab === 'washStatus' && (
                                <div className="p-6 md:p-8">
                                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Validasi Status Cuci</h2>
                                    <div className="grid gap-6">
                                        {washStatuses.map((wash) => (
                                            <div key={wash.id} className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Booking ID: #{wash.booking_id}</p>
                                                        <h3 className="font-bold text-gray-800">Status Proses</h3>
                                                    </div>
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">{wash.status}</Badge>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>Progress</span>
                                                        <span className="font-bold">{wash.progress_percentage}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${wash.progress_percentage}%` }}></div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 flex-wrap items-center">
                                                    {/* Dropdown Update Status sederhana dengan Select */}
                                                    <select 
                                                        value={wash.status}
                                                        onChange={(e) => handleUpdateWashStatus(wash.id, e.target.value)}
                                                        className="px-3 py-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        disabled={loadingAction === `wash-${wash.id}`}
                                                    >
                                                        <option value="waiting">Menunggu</option>
                                                        <option value="washing">Sedang Dicuci</option>
                                                        <option value="drying">Pengeringan</option>
                                                        <option value="quality_check">Cek Kualitas</option>
                                                        <option value="completed">Selesai</option>
                                                    </select>
                                                    
                                                    <button 
                                                        onClick={() => handleOpenEditNote(wash)}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                                                    >
                                                        <Edit3 className="w-4 h-4" /> Edit Catatan
                                                    </button>
                                                    
                                                    {loadingAction === `wash-${wash.id}` && <span className="text-xs text-blue-500 animate-pulse">Updating...</span>}
                                                </div>

                                                {wash.notes && (
                                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                                        <strong>Catatan:</strong> {wash.notes}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {washStatuses.length === 0 && <div className="text-center py-10 text-gray-500">Belum ada data cucian aktif.</div>}
                                    </div>
                                </div>
                            )}

                            {/* === TAB 4: TRANSAKSI === */}
                            {adminTab === 'transactions' && (
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-[#0F172A]">Monitoring Transaksi</h2>
                                        <div className="flex gap-2">
                                            {['all', 'pending', 'completed', 'failed'].map(s => (
                                                <button key={s} onClick={() => setFilterTransactionStatus(s as any)} 
                                                    className={`px-3 py-1 text-sm rounded capitalize ${filterTransactionStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Plat</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500">Jumlah</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Metode</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredTransactions.map(txn => (
                                                <tr key={txn.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold">#{txn.id}</td>
                                                    <td className="px-6 py-4">{txn.booking?.vehicle_plate || '-'}</td>
                                                    <td className="px-6 py-4 text-right">Rp {txn.amount.toLocaleString('id-ID')}</td>
                                                    <td className="px-6 py-4 capitalize">{txn.payment_method}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className={txn.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                                                            {txn.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* =========================================
                    MODAL: EDIT USER
                   ========================================= */}
                {isEditUserOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800">Edit Pengguna</h3>
                                <button onClick={() => setIsEditUserOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5"/></button>
                            </div>
                            <form onSubmit={handleSubmitEditUser} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        value={editUserForm.name}
                                        onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={editUserForm.email}
                                        onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select 
                                        value={editUserForm.role}
                                        onChange={(e) => setEditUserForm({...editUserForm, role: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="customer">Pelanggan</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsEditUserOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Batal</button>
                                    <button 
                                        type="submit" 
                                        disabled={loadingAction === 'update-user'}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {loadingAction === 'update-user' ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* =========================================
                    MODAL: EDIT WASH NOTES
                   ========================================= */}
                {isEditNoteOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800">Catatan Cucian</h3>
                                <button onClick={() => setIsEditNoteOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5"/></button>
                            </div>
                            <form onSubmit={handleSubmitNote} className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tambahkan / Edit Catatan</label>
                                    <textarea 
                                        rows={4}
                                        value={noteForm}
                                        onChange={(e) => setNoteForm(e.target.value)}
                                        placeholder="Contoh: Ada baret halus di pintu kiri, perlu wax tambahan..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsEditNoteOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Batal</button>
                                    <button 
                                        type="submit" 
                                        disabled={loadingAction === 'update-note'}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {loadingAction === 'update-note' ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                                        Simpan Catatan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}