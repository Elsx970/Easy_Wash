import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';

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
        title: 'Buat Pemesanan',
    },
];

interface Service {
    id: number;
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
}

interface Props {
    services: Service[];
}

export default function BookingsCreate({ services }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pemesanan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Buat Pemesanan Baru</h1>

                <div className="rounded-lg border border-sidebar-border bg-card p-6 dark:border-sidebar-border">
                    <Form
                        {...bookings.store.form()}
                        className="flex flex-col gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="service_id">Layanan</Label>
                                    <select
                                        id="service_id"
                                        name="service_id"
                                        className="mt-1 block w-full rounded-md border border-sidebar-border bg-background px-3 py-2"
                                        required
                                    >
                                        <option value="">Pilih Layanan</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name} - {service.price.toLocaleString('id-ID')} IDR ({service.duration_minutes} menit)
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.service_id} />
                                </div>

                                <div>
                                    <Label htmlFor="vehicle_type">Jenis Kendaraan</Label>
                                    <select
                                        id="vehicle_type"
                                        name="vehicle_type"
                                        className="mt-1 block w-full rounded-md border border-sidebar-border bg-background px-3 py-2"
                                        required
                                    >
                                        <option value="">Pilih Jenis Kendaraan</option>
                                        <option value="motor">Motor</option>
                                        <option value="mobil">Mobil</option>
                                        <option value="salon">Salon</option>
                                    </select>
                                    <InputError message={errors.vehicle_type} />
                                </div>

                                <div>
                                    <Label htmlFor="vehicle_plate">Nomor Plat</Label>
                                    <Input
                                        id="vehicle_plate"
                                        name="vehicle_plate"
                                        type="text"
                                        required
                                    />
                                    <InputError message={errors.vehicle_plate} />
                                </div>

                                <div>
                                    <Label htmlFor="scheduled_at">Tanggal & Waktu</Label>
                                    <Input
                                        id="scheduled_at"
                                        name="scheduled_at"
                                        type="datetime-local"
                                        required
                                    />
                                    <InputError message={errors.scheduled_at} />
                                </div>

                                <div>
                                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border border-sidebar-border bg-background px-3 py-2"
                                    />
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Buat Pemesanan'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(bookings.index().url)}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}

