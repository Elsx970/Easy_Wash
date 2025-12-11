import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { 
    Calendar, 
    Car, 
    Clock, 
    User, 
    MoreHorizontal, 
    Trash2, 
    Pencil, 
    Eye 
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Pemesanan',
    },
];

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
    filters?: {
        search?: string;
        status?: string;
    };
    isAdmin: boolean;
}

export default function BookingsIndex({ bookings: bookingsData, isAdmin }: Props) {
    
    // Helper untuk warna status (Logika dipertahankan)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'in_progress':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'completed':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    // Helper untuk label status
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu';
            case 'in_progress': return 'Sedang Diproses';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    const handleDelete = (bookingId: number, vehiclePlate: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pemesanan ${vehiclePlate}?`)) {
            router.delete(bookings.destroy(bookingId).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Pemesanan" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden p-4 md:p-6 bg-gray-50/50 dark:bg-transparent">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Riwayat Pemesanan</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola semua jadwal cuci kendaraan Anda di sini.
                        </p>
                    </div>
                    <Link href={bookings.create().url}>
                        <Button className="w-full md:w-auto shadow-md hover:shadow-lg transition-all">
                            + Buat Pemesanan Baru
                        </Button>
                    </Link>
                </div>

                {/* Content Section: List Card Style */}
                <div className="space-y-4">
                    {bookingsData.data.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-white dark:bg-sidebar-accent">
                            <div className="flex justify-center mb-4">
                                <Car className="h-12 w-12 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Belum ada pemesanan</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Mulai dengan membuat jadwal cuci kendaraan baru.</p>
                        </div>
                    ) : (
                        bookingsData.data.map((booking) => (
                            <div 
                                key={booking.id} 
                                className="group bg-white dark:bg-sidebar-accent border border-gray-100 dark:border-sidebar-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                            >
                                {/* Kiri: Info Utama (Layanan & Kendaraan) */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                            {booking.service.name}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                            {getStatusLabel(booking.status)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                                #{booking.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Car className="w-4 h-4" />
                                            <span className="capitalize">{booking.vehicle_type}</span>
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">({booking.vehicle_plate})</span>
                                        </div>
                                        {isAdmin && booking.user && (
                                            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                                <User className="w-4 h-4" />
                                                <span>{booking.user.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tengah: Jadwal */}
                                <div className="flex flex-col md:items-end gap-1 min-w-[180px]">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>
                                            {new Date(booking.scheduled_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {new Date(booking.scheduled_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit', minute: '2-digit'
                                            })} WIB
                                        </span>
                                    </div>
                                </div>

                                {/* Kanan: Aksi (Buttons) */}
                                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                                    <Link href={bookings.show(booking.id).url}>
                                        <Button variant="outline" size="sm" className="h-9 px-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:text-blue-400">
                                            Lihat
                                        </Button>
                                    </Link>

                                    {/* Menu Dropdown untuk Admin agar rapi, atau tombol langsung jika preferensi */}
                                    {isAdmin && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link href={bookings.edit(booking.id).url}>
                                                    <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-700">
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                    onClick={() => handleDelete(booking.id, booking.vehicle_plate)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination (Jika ada) - Bisa ditambahkan di sini sesuai props links */}
            </div>
        </AppLayout>
    );
}