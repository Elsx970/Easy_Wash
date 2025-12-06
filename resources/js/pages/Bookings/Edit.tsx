import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Car, Clock, User } from 'lucide-react';

interface Booking {
    id: number;
    vehicle_type: string;
    vehicle_plate: string;
    scheduled_at: string;
    estimated_finish_at: string;
    status: string;
    notes: string;
    service: {
        id: number;
        name: string;
        duration_minutes: number;
        price: number;
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    booking: Booking;
    errors?: {
        status?: string;
        notes?: string;
    };
}

export default function BookingEdit({ booking, errors = {} }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Pemesanan',
            href: bookings.index().url,
        },
        {
            title: `Edit #${booking.id}`,
        },
    ];

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Menunggu',
            in_progress: 'Sedang Diproses',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status] || '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pemesanan #${booking.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Pemesanan #{booking.id}</h1>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Info Kendaraan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                Informasi Kendaraan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Jenis:</span>
                                <span className="font-medium capitalize">{booking.vehicle_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Plat Nomor:</span>
                                <span className="font-medium">{booking.vehicle_plate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Layanan:</span>
                                <span className="font-medium">{booking.service.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Harga:</span>
                                <span className="font-medium">Rp {booking.service.price.toLocaleString('id-ID')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Waktu */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Informasi Waktu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Dijadwalkan:</span>
                                <span className="font-medium">
                                    {new Date(booking.scheduled_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estimasi Selesai:</span>
                                <span className="font-medium">
                                    {new Date(booking.estimated_finish_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Durasi:</span>
                                <span className="font-medium">{booking.service.duration_minutes} menit</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Pelanggan (Admin only) */}
                    {isAdmin && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Pelanggan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nama:</span>
                                    <span className="font-medium">{booking.user.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium">{booking.user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID User:</span>
                                    <span className="font-medium">#{booking.user.id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Form Update Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isAdmin ? 'Update Status Pemesanan' : 'Update Catatan'}
                        </CardTitle>
                        <CardDescription>
                            {isAdmin
                                ? 'Ubah status pemesanan dan tambahkan catatan jika diperlukan'
                                : 'Anda hanya dapat mengubah catatan pemesanan'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...bookings.update.form(booking.id)} className="space-y-4">
                            {isAdmin && (
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status Pemesanan</Label>
                                    <Select name="status" defaultValue={booking.status}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Menunggu</SelectItem>
                                            <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                                            <SelectItem value="completed">Selesai</SelectItem>
                                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status}</p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={booking.notes || ''}
                                    placeholder="Tambahkan catatan untuk pemesanan ini (opsional)"
                                    rows={4}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-500">{errors.notes}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">
                                    {isAdmin ? 'Update Status' : 'Simpan Catatan'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Batal
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

