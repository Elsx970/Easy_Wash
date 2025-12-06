import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';

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
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const handleDelete = (bookingId: number, vehiclePlate: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pemesanan ${vehiclePlate}?`)) {
            router.delete(bookings.destroy(bookingId).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemesanan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Pemesanan</h1>
                    <Link href={bookings.create().url}>
                        <Button>Buat Pemesanan Baru</Button>
                    </Link>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-card p-4 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border">
                                    <th className="px-4 py-2 text-left">ID</th>
                                    {isAdmin && <th className="px-4 py-2 text-left">Pelanggan</th>}
                                    <th className="px-4 py-2 text-left">Layanan</th>
                                    <th className="px-4 py-2 text-left">Jenis Kendaraan</th>
                                    <th className="px-4 py-2 text-left">Plat Nomor</th>
                                    <th className="px-4 py-2 text-left">Jadwal</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingsData.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={isAdmin ? 8 : 7}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            Belum ada pemesanan. Klik "Buat Pemesanan Baru" untuk membuat pemesanan.
                                        </td>
                                    </tr>
                                ) : (
                                    bookingsData.data.map((booking) => (
                                        <tr key={booking.id} className="border-b border-sidebar-border">
                                            <td className="px-4 py-2 font-medium">#{booking.id}</td>
                                            {isAdmin && (
                                                <td className="px-4 py-2">{booking.user?.name}</td>
                                            )}
                                            <td className="px-4 py-2">{booking.service.name}</td>
                                            <td className="px-4 py-2 capitalize">{booking.vehicle_type}</td>
                                            <td className="px-4 py-2 font-medium">{booking.vehicle_plate}</td>
                                            <td className="px-4 py-2 text-sm text-muted-foreground">
                                                {new Date(booking.scheduled_at).toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                                                        booking.status,
                                                    )}`}
                                                >
                                                    {booking.status === 'pending' && 'Menunggu'}
                                                    {booking.status === 'in_progress' && 'Sedang Diproses'}
                                                    {booking.status === 'completed' && 'Selesai'}
                                                    {booking.status === 'cancelled' && 'Dibatalkan'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={bookings.show(booking.id).url}
                                                        className="text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        Lihat
                                                    </Link>
                                                    {isAdmin && (
                                                        <>
                                                            <Link
                                                                href={bookings.edit(booking.id).url}
                                                                className="text-green-600 hover:underline dark:text-green-400"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(booking.id, booking.vehicle_plate)
                                                                }
                                                                className="text-red-600 hover:underline dark:text-red-400"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

