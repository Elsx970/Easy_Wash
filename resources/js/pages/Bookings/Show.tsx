import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

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

interface Booking {
    id: number;
    vehicle_type: string;
    vehicle_plate: string;
    scheduled_at: string;
    estimated_finish_at: string;
    status: string;
    notes?: string;
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pemesanan #${booking.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Detail Pemesanan #{booking.id}</h1>
                    {canUpdate && (
                        <Link href={`/bookings/${booking.id}/edit`}>
                            <Button>Edit</Button>
                        </Link>
                    )}
                </div>

                <div className="rounded-lg border border-sidebar-border bg-card p-6 dark:border-sidebar-border">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="font-semibold">Layanan</h3>
                            <p className="text-muted-foreground">{booking.service.name}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Status</h3>
                            <span
                                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                    booking.status,
                                )}`}
                            >
                                {booking.status === 'pending' && 'Menunggu'}
                                {booking.status === 'in_progress' && 'Sedang Diproses'}
                                {booking.status === 'completed' && 'Selesai'}
                                {booking.status === 'cancelled' && 'Dibatalkan'}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold">Jenis Kendaraan</h3>
                            <p className="text-muted-foreground capitalize">{booking.vehicle_type}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Nomor Plat</h3>
                            <p className="text-muted-foreground">{booking.vehicle_plate}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Jadwal</h3>
                            <p className="text-muted-foreground">
                                {new Date(booking.scheduled_at).toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Estimasi Selesai</h3>
                            <p className="text-muted-foreground">
                                {new Date(booking.estimated_finish_at).toLocaleString('id-ID')}
                            </p>
                        </div>
                        {booking.user && (
                            <>
                                <div>
                                    <h3 className="font-semibold">Pelanggan</h3>
                                    <p className="text-muted-foreground">{booking.user.name}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="text-muted-foreground">{booking.user.email}</p>
                                </div>
                            </>
                        )}
                        {booking.notes && (
                            <div className="md:col-span-2">
                                <h3 className="font-semibold">Catatan</h3>
                                <p className="text-muted-foreground">{booking.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.visit('/bookings')}>
                        Kembali
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}

