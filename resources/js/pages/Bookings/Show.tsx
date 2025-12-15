import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react'; // Added usePage
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes'; 
import { 
    MapPin, 
    Phone, 
    Mail, 
    User as UserIcon, 
    Download, 
    MonitorPlay, 
    ArrowLeft, 
    Ticket,
    Calendar,
    Car,
    Bike, 
    Clock,
    ChevronDown,
} from 'lucide-react';

// --- INTERFACES ---
interface QueueData {
    current_serving?: {
        number: string;
        status: string;
    };
    user_queue: {
        number: string;
        status: string;
        estimated_wait_time: string;
    };
    upcoming_list: Array<{
        time: string;
        number: string;
        status: string;
    }>;
}

interface Booking {
    id: number;
    vehicle_type: string;
    vehicle_size?: string;
    vehicle_plate: string;
    scheduled_at: string;
    estimated_finish_at: string | null;
    status: string;
    queue_number: string;
    notes?: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    customer_address?: string;
    location?: { name: string; address: string };
    service: { id: number; name: string; description: string; price: number };
}

interface Props {
    booking: Booking;
    queue: QueueData; 
}

// Interface tambahan untuk handle Auth via Inertia
interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            // tambahkan field lain jika perlu
        } | null;
    };
    [key: string]: any;
}

export default function BookingsShow({ booking, queue }: Props) {
    // AMBIL DATA USER LOGIN (Global Inertia Props)
    const { auth } = usePage<PageProps>().props;

    // STATE
    const [viewMode, setViewMode] = useState<'details' | 'queue'>('details');

    // STYLES (Inline CSS untuk animasi custom)
    const customStyles = `
        @keyframes wave {
            0%, 100% { transform: scaleX(1); opacity: 0.4; }
            50% { transform: scaleX(1.05); opacity: 0.8; }
        }
        
        @keyframes washingBubble {
            0% { transform: translateX(-20px) translateY(0); opacity: 1; }
            100% { transform: translateX(100vw) translateY(-20px); opacity: 0; }
        }
    `;

    // HELPERS
    const handlePrint = () => window.print();
    
    const formatRupiah = (num: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Helper Aman untuk Info Kendaraan
    const getVehicleInfo = (number: string | undefined | null) => {
        if (!number) return { type: 'Kendaraan', Icon: Car }; // Default jika null
        
        // Logika sederhana: M = Motor, Lainnya = Mobil (Sesuaikan dengan format nomor Anda)
        const isBike = number.toUpperCase().startsWith('M') || number.toUpperCase().includes('R2'); 
        return {
            type: isBike ? 'Motor' : 'Mobil',
            Icon: isBike ? Bike : Car
        };
    };

    // --- COMPONENTS ---
    
    const EasyWashCard = ({ title, children, className = "" }: { title?: string, children: React.ReactNode, className?: string }) => (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 ${className}`}>
            {title && <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>}
            {children}
        </div>
    );

    // --- RENDER VIEWS ---

    const renderDetails = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Status & Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900">Order #{booking.id}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">Kode Antrean: <span className="font-mono font-bold text-slate-900">{booking.queue_number}</span></p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={handlePrint} className="flex-1 md:flex-none border-gray-300 hover:bg-gray-50 text-slate-700">
                        <Download className="w-4 h-4 mr-2" /> Slip
                    </Button>
                    <Button onClick={() => setViewMode('queue')} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                        <MonitorPlay className="w-4 h-4 mr-2" /> Lihat Antrean
                    </Button>
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Rincian Layanan */}
                <EasyWashCard title="Rincian Pesanan">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Paket</p>
                                <p className="font-bold text-blue-600 text-lg">{booking.service.name}</p>
                                <p className="text-sm text-gray-400 mt-1">{booking.service.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Total Biaya</p>
                                <p className="font-bold text-slate-900 text-lg">{formatRupiah(booking.service.price)}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Jadwal</p>
                            <div className="flex items-center gap-2 text-slate-800 font-medium">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(booking.scheduled_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                            </div>
                        </div>
                    </div>
                </EasyWashCard>

                {/* 2. Kendaraan */}
                <EasyWashCard title="Kendaraan">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Plat Nomor</p>
                                <div className="inline-block bg-slate-900 text-white px-3 py-1.5 rounded-md font-mono font-bold tracking-wider">
                                    {booking.vehicle_plate}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tipe Kendaraan</p>
                                <div className="flex items-center gap-2">
                                    {booking.vehicle_type.toLowerCase().includes('motor') ? <Bike className="w-4 h-4 text-gray-400" /> : <Car className="w-4 h-4 text-gray-400" />}
                                    <span className="font-medium capitalize text-slate-900">
                                        {booking.vehicle_type} 
                                        {booking.vehicle_size && <span className="text-gray-400 font-normal"> ({booking.vehicle_size})</span>}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {booking.notes && (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Catatan</p>
                                <p className="text-sm text-yellow-800 italic">"{booking.notes}"</p>
                            </div>
                        )}
                    </div>
                </EasyWashCard>

                {/* 3. Data Pelanggan */}
                <EasyWashCard title="Data Pelanggan">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <UserIcon size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Nama</p>
                                <p className="font-medium text-slate-900 text-sm truncate">{booking.customer_name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Phone size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Telepon</p>
                                <p className="font-medium text-slate-900 text-sm">{booking.customer_phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Mail size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Email</p>
                                <p className="font-medium text-slate-900 text-sm break-all">{booking.customer_email}</p>
                            </div>
                        </div>
                    </div>
                    {booking.customer_address && (
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Alamat</p>
                                <p className="font-medium text-slate-900 text-sm">{booking.customer_address}</p>
                            </div>
                        </div>
                    )}
                </EasyWashCard>

                {/* 4. Lokasi Cabang */}
                {booking.location && (
                    <EasyWashCard title="Lokasi Cabang">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{booking.location.name}</h4>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{booking.location.address}</p>
                                <a href="#" className="text-xs font-bold text-blue-600 mt-2 inline-block hover:underline">Lihat di Google Maps &rarr;</a>
                            </div>
                        </div>
                    </EasyWashCard>
                )}
            </div>
        </div>
    );

    const renderQueue = () => {
        // --- SAFETY LOGIC (Mencegah Crash jika data kosong) ---
        const servingNumber = queue.current_serving?.number;
        const servingStatus = queue.current_serving?.status || 'Menunggu';
        const hasActiveServing = !!servingNumber;
        
        const currentServingInfo = getVehicleInfo(servingNumber);
        
        return (
            <div className="animate-in zoom-in-95 duration-500 max-w-4xl mx-auto py-4">
                {/* Header Back */}
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => setViewMode('details')} className="hover:bg-transparent hover:text-blue-600 p-0 text-slate-500 gap-2">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Rincian
                    </Button>
                </div>

                {/* Hero Monitor Card (Dark Blue) */}
                <div className="bg-[#0f172a] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-8">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        
                        {/* Kiri: Teks & Info User */}
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Live Status</span>
                            </div>
                            
                            <div>
                                <h2 className="text-4xl font-bold mb-2 tracking-tight">Monitor Antrean</h2>
                                <p className="text-slate-400 text-sm">Pantau giliran kendaraan Anda secara real-time.</p>
                            </div>

                            <div className="flex gap-4 justify-center md:justify-start">
                                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 min-w-[140px]">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Nomor Anda</p>
                                    <p className="text-3xl font-bold text-white">{queue.user_queue.number}</p>
                                </div>
                                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 min-w-[140px]">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Estimasi</p>
                                    <p className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-400" />
                                        {queue.user_queue.estimated_wait_time}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Card Putih "Sedang Dilayani" (Sesuai Visual Referensi) */}
                        <div className={`bg-white text-slate-900 rounded-2xl p-6 shadow-2xl w-full max-w-xs relative transition-all ${
                            servingStatus === 'Sedang Dicuci' ? 'border-2 border-blue-500 shadow-blue-300 shadow-2xl' : ''
                        }`}>
                            <div className="absolute inset-2 border-2 border-dashed border-gray-100 rounded-xl pointer-events-none"></div>
                            
                            {/* Animasi Gelombang Cuci (jika sedang dicuci) */}
                            {servingStatus === 'Sedang Dicuci' && (
                                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-blue-400/20 animate-pulse"></div>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" style={{animation: 'wave 2s ease-in-out infinite'}}></div>
                                </div>
                            )}
                            
                            <div className="relative z-10 flex flex-col items-center text-center py-2">
                                {hasActiveServing ? (
                                    <>
                                        {/* Icon Circle dengan animasi jika sedang dicuci */}
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${
                                            servingStatus === 'Sedang Dicuci' 
                                                ? 'bg-blue-100 text-blue-600 animate-bounce' 
                                                : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            <currentServingInfo.Icon size={32} strokeWidth={2} />
                                        </div>
                                        
                                        {/* Info Kendaraan */}
                                        <h3 className="text-xl font-bold text-slate-900">{currentServingInfo.type}</h3>
                                        {/* Placeholder Ukuran (karena data ukuran ada di list upcoming tapi tidak selalu di current) */}
                                        <p className="text-xs text-gray-400 font-medium mb-4">Nomor Antrean</p>

                                        {/* Nomor Antrean Besar */}
                                        <div className={`text-6xl font-black tracking-tighter mb-4 ${
                                            servingStatus === 'Sedang Dicuci' ? 'text-blue-600 animate-pulse' : 'text-slate-900'
                                        }`}>
                                            {servingNumber}
                                        </div>

                                        {/* Status Badge dengan warna berbeda jika sedang dicuci */}
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 ${
                                            servingStatus === 'Sedang Dicuci'
                                                ? 'bg-blue-500 text-white animate-pulse'
                                                : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {servingStatus}
                                        </div>

                                        {/* Button Memanggil atau Status Cuci */}
                                        {servingStatus === 'Sedang Dicuci' ? (
                                            <div className="px-6 py-3 rounded-lg bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-wider w-full flex items-center justify-center gap-2">
                                                <span className="w-2 h-2 bg-blue-700 rounded-full animate-pulse"></span>
                                                Sedang Diproses
                                            </div>
                                        ) : (
                                            <div className="px-6 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider w-full">
                                                Memanggil...
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="py-10 text-gray-400">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                            <Clock size={32} />
                                        </div>
                                        <p className="font-bold">Belum ada antrean</p>
                                        <p className="text-xs">Silakan menunggu...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Antrean Berikutnya */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-slate-900">Antrean Berikutnya</h3>
                        <Ticket className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="divide-y divide-gray-50">
                        {queue.upcoming_list && queue.upcoming_list.length > 0 ? (
                            queue.upcoming_list.map((item, idx) => {
                                const itemInfo = getVehicleInfo(item.number);
                                return (
                                    <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            {/* Icon Box */}
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <itemInfo.Icon size={20} />
                                            </div>
                                            <div>
                                                {/* Nama Kendaraan & Jam */}
                                                <p className="font-bold text-slate-900">{itemInfo.type}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs font-mono font-medium text-slate-500 bg-gray-100 px-1.5 rounded">{item.number}</span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {item.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1.5 rounded-lg">
                                            {item.status}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center text-gray-400">
                                <p className="text-sm">Tidak ada antrean berikutnya.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-600 flex flex-col">
            <Head title={`Pemesanan #${booking.id}`} />
            
            {/* Custom Animations */}
            <style>{customStyles}</style>

            {/* --- CUSTOM NAVBAR --- */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between relative">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight shrink-0 z-10">
                        EasyWash
                    </Link>

                    {/* Menu Tengah */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/dashboard" className="text-gray-500 hover:text-slate-900 transition-colors">Beranda</Link>
                        <Link href="/bookings" className="text-blue-600 font-semibold">Riwayat Pesanan</Link>
                    </div>

                    {/* User Profile DINAMIS */}
                    <div className="flex items-center gap-4 shrink-0 z-10">
                        <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
                            {/* NAMA USER DIAMBIL DARI AUTH */}
                            <span className="text-sm font-bold text-slate-700">
                                {auth.user?.name || 'Guest'}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-10">
                {/* Mobile Header */}
                <div className="md:hidden mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Riwayat Pesanan</h2>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-600" />
                    </div>
                </div>

                {viewMode === 'details' ? renderDetails() : renderQueue()}
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-[#0f172a] text-white py-10 mt-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">EasyWash</h2>
                    <div className="text-slate-400 text-sm leading-relaxed font-medium">
                        <p>Copyright &copy; 2025, Universe.</p>
                        <p>Bandar Lampung, Bandar Lampung,</p>
                        <p>Indonesia.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}