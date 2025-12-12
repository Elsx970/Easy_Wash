import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { 
    Clock, 
    MapPin, 
    Phone, 
    MoreHorizontal, 
    Trash2, 
    Pencil,
    User,
    ChevronDown,
    Facebook,
    Twitter,
    Instagram
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface Booking {
    id: number;
    vehicle_type: string;
    vehicle_plate: string;
    scheduled_at: string;
    estimated_finish_at: string;
    status: string;
    service: {
        id: number;
        name: string;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    bookings: {
        data: Booking[];
        links: PaginationLink[];
    };
    isAdmin: boolean;
    auth: {
        user: {
            name: string;
            email: string;
        }
    }
}

export default function BookingsIndex({ bookings: bookingsData, isAdmin, auth }: Props) {
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu';
            case 'in_progress': return 'Proses';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Batal';
            default: return status;
        }
    };

    const handleDelete = (bookingId: number, vehiclePlate: string) => {
        if (confirm(`Hapus pemesanan ${vehiclePlate}?`)) {
            router.delete(bookings.destroy(bookingId).url);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FB] font-sans">
            <Head title="Riwayat Pemesanan" />

            {/* --- NAVBAR SECTION --- */}
            <nav className="w-full bg-white h-20 border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    
                    {/* Logo: Easy Hitam + Wash Biru */}
                    <Link href="/" className="text-2xl font-extrabold tracking-tight">
                        <span className="text-[#0F172A]">Easy</span>
                        <span className="text-blue-600">Wash</span>
                    </Link>

                    {/* Menu Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            href={dashboard().url} 
                            className="text-[15px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            Beranda
                        </Link>
                        <Link 
                            href="#" 
                            className="text-[15px] font-bold text-blue-600 transition-colors"
                        >
                            Riwayat Pesanan
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 focus:outline-none group">
                                        
                                        {/* Name Text (Kiri) */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                {auth.user.name}
                                            </span>
                                        </div>

                                        {/* Avatar Circle (Kanan) */}
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-blue-200 transition-colors">
                                            <User className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                                        </div>
                                        
                                        {/* Chevron Icon */}
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                
                                {/* Dropdown Content (Hanya Info User, Tanpa Logout) */}
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{auth.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                             <Button className="bg-transparent border border-slate-900 text-slate-900 hover:bg-slate-50">
                                Reservasi
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
                
                {/* Page Title */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Riwayat Pemesanan</h1>
                        <p className="text-slate-500 mt-2">Kelola jadwal dan status pencucian kendaraan Anda.</p>
                    </div>
                    
                    <Link href={bookings.create().url}>
                         <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 h-11 shadow-lg shadow-blue-600/20">
                            + Buat Pesanan Baru
                        </Button>
                    </Link>
                </div>

                {/* Booking List */}
                <div className="space-y-6">
                    {bookingsData.data.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
                            <div className="flex justify-center mb-4">
                                <Clock className="h-12 w-12 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">Belum ada riwayat</h3>
                            <p className="text-slate-500 mt-1">Anda belum melakukan pemesanan cuci kendaraan.</p>
                        </div>
                    ) : (
                        bookingsData.data.map((booking) => (
                            <div 
                                key={booking.id} 
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            {booking.service.name}
                                        </h3>
                                    </div>

                                    {isAdmin && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link href={bookings.edit(booking.id).url}>
                                                    <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem onClick={() => handleDelete(booking.id, booking.vehicle_plate)} className="text-red-600">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                {/* Card Body (Grid Layout) */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    
                                    {/* Info 1: Kendaraan */}
                                    <div className="md:col-span-4 flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-0.5">Kendaraan</p>
                                            <p className="font-semibold text-slate-900">{booking.vehicle_plate}</p>
                                            <p className="text-xs text-slate-400 capitalize">{booking.vehicle_type}</p>
                                        </div>
                                    </div>

                                    {/* Info 2: Status */}
                                    <div className="md:col-span-3 flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-0.5">Status</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                                                ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                            <p className="text-xs text-slate-400 mt-0.5">ID: #{booking.id}</p>
                                        </div>
                                    </div>

                                    {/* Info 3: Waktu */}
                                    <div className="md:col-span-3 flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-0.5">Jadwal</p>
                                            <p className="font-semibold text-slate-900">{formatDate(booking.scheduled_at)}</p>
                                            <p className="text-xs text-slate-400">{formatTime(booking.scheduled_at)} WIB</p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="md:col-span-2 flex justify-end">
                                        <Link href={bookings.show(booking.id).url} className="w-full md:w-auto">
                                            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                                                Lihat
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* --- FOOTER SECTION --- */}
            <footer className="bg-[#0F1E2E] text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="text-2xl font-bold mb-4">EasyWash</h2>
                        <p className="text-slate-400 text-sm max-w-md mb-8">
                            Copyright © 2025, Universe.<br/>
                            Bandar Lampung, Bandar Lampung,<br/>
                            Indonesia.
                        </p>
                        <p className="text-slate-400 text-sm mb-8">
                            +62 895-6179-69599 (CS)
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex gap-6 mb-8">
                            <a href="#" className="text-white hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5"/></a>
                            <a href="#" className="text-white hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5"/></a>
                            <a href="#" className="text-white hover:text-blue-400 transition-colors"><Instagram className="w-5 h-5"/></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}