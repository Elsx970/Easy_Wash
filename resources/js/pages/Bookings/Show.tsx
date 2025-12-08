import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react'; // Hapus router jika tidak dipakai
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { MapPin, Phone, Mail, User as UserIcon } from 'lucide-react'; // Tambah icon

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Pemesanan',
        href: '/bookings',
    },
    {
        title: 'Detail Pemesanan',
    },
];

// Update Interface agar sesuai dengan data dari form Create
interface Booking {
    id: number;
    vehicle_type: string;
    vehicle_plate: string;
    scheduled_at: string;
    estimated_finish_at: string | null; // Allow null untuk safety
    status: string;
    notes?: string;
    // Tambahan field dari form create (pastikan backend mengirim ini)
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    customer_address?: string;
    location?: { // Tambahan relasi lokasi
        name: string;
        address: string;
    };
    service: {
        id: number;
        name: string;
        description: string;
        duration_minutes: number;
        price: number;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    booking: Booking;
    canUpdate: boolean;
}

export default function BookingsShow({ booking, canUpdate }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Format Rupiah
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pemesanan #${booking.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pemesanan #{booking.id}</h1>
                        <p className="text-sm text-muted-foreground">
                            Dibuat pada {new Date().toLocaleDateString('id-ID')} {/* Idealnya ada created_at */}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                        </span>
                        {canUpdate && (
                            <Link href={`/bookings/${booking.id}/edit`}>
                                <Button variant="outline">Edit Pesanan</Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    
                    {/* KOLOM KIRI: Detail Layanan & Kendaraan */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Card Utama */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 border-b pb-2">Informasi Layanan</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Paket Layanan</h3>
                                    <p className="text-lg font-semibold text-blue-600">{booking.service.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{booking.service.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Total Biaya</h3>
                                    <p className="text-lg font-semibold text-gray-900">{formatRupiah(booking.service.price)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Jadwal Booking</h3>
                                    <p className="font-medium">
                                        {new Date(booking.scheduled_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Estimasi Selesai</h3>
                                    <p className="font-medium">
                                        {booking.estimated_finish_at 
                                            ? new Date(booking.estimated_finish_at).toLocaleString('id-ID', { timeStyle: 'short' }) 
                                            : '-' /* Handle jika null */}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card Kendaraan */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 border-b pb-2">Detail Kendaraan</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Plat Nomor</h3>
                                    <div className="mt-1 inline-block bg-black text-white px-3 py-1 rounded font-mono font-bold">
                                        {booking.vehicle_plate}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Jenis Kendaraan</h3>
                                    <p className="font-medium capitalize">{booking.vehicle_type}</p>
                                </div>
                                {booking.notes && (
                                    <div className="sm:col-span-2">
                                        <h3 className="text-sm font-medium text-gray-500">Catatan Tambahan</h3>
                                        <p className="mt-1 text-sm bg-gray-50 p-3 rounded-md italic">"{booking.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Informasi Pelanggan & Lokasi */}
                    <div className="space-y-6">
                        {/* Card Pelanggan (Data dari input manual step 4) */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 border-b pb-2">Data Pelanggan</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nama</p>
                                        <p className="font-medium">{booking.customer_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Telepon</p>
                                        <p className="font-medium">{booking.customer_phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium break-all">{booking.customer_email}</p>
                                    </div>
                                </div>
                                {booking.customer_address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Alamat</p>
                                            <p className="font-medium text-sm">{booking.customer_address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Lokasi Cabang */}
                        {booking.location && (
                            <div className="rounded-xl border bg-blue-50 p-6 shadow-sm border-blue-100">
                                <h2 className="text-lg font-bold mb-4 text-blue-800 border-b border-blue-200 pb-2">Lokasi Cabang</h2>
                                <h3 className="font-bold text-gray-900">{booking.location.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{booking.location.address}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}