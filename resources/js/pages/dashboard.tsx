import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Package, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

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
    const statCards = [
        {
            title: 'Total Pemesanan',
            value: stats.total_bookings,
            icon: Package,
            description: 'Semua pemesanan',
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Menunggu',
            value: stats.pending_bookings,
            icon: Clock,
            description: 'Pemesanan pending',
            color: 'text-yellow-600 dark:text-yellow-400',
        },
        {
            title: 'Sedang Diproses',
            value: stats.in_progress_bookings,
            icon: Calendar,
            description: 'Sedang dicuci',
            color: 'text-purple-600 dark:text-purple-400',
        },
        {
            title: 'Selesai',
            value: stats.completed_bookings,
            icon: CheckCircle,
            description: 'Pemesanan selesai',
            color: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Total Layanan',
            value: stats.total_services,
            icon: Package,
            description: 'Layanan tersedia',
            color: 'text-indigo-600 dark:text-indigo-400',
        },
    ];

    if (isAdmin && stats.total_users !== undefined) {
        statCards.push({
            title: 'Total Pengguna',
            value: stats.total_users,
            icon: Users,
            description: 'Pengguna terdaftar',
            color: 'text-pink-600 dark:text-pink-400',
        });
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            pending: 'secondary',
            in_progress: 'default',
            completed: 'default',
            cancelled: 'destructive',
        };

        const labels: Record<string, string> = {
            pending: 'Menunggu',
            in_progress: 'Diproses',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        };

        return (
            <Badge variant={variants[status] || 'outline'}>
                {labels[status] || status}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{stat.title}</CardTitle>
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <CardDescription>{stat.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Bookings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Pemesanan Terbaru</CardTitle>
                                <CardDescription>
                                    {isAdmin ? 'Semua pemesanan terbaru' : 'Pemesanan Anda yang terbaru'}
                                </CardDescription>
                            </div>
                            <Link
                                href={bookings.index().url}
                                className="text-sm text-primary hover:underline"
                            >
                                Lihat Semua →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentBookings.length > 0 ? (
                            <div className="space-y-4">
                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {booking.vehicle_type.toUpperCase()} - {booking.vehicle_plate}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.service.name}
                                                    </p>
                                                    {isAdmin && booking.user && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {booking.user.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(booking.scheduled_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(booking.scheduled_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>Belum ada pemesanan</p>
                                <Link
                                    href={bookings.create().url}
                                    className="text-primary hover:underline mt-2 inline-block"
                                >
                                    Buat Pemesanan Baru
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
