import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import services from '@/routes/services';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, DollarSign, Trash2 } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    service: Service;
}

export default function ServiceShow({ service }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Layanan',
            href: services.index().url,
        },
        {
            title: service.name,
        },
    ];

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            router.delete(services.destroy(service.id).url, {
                onSuccess: () => {
                    router.visit(services.index().url);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={service.name} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{service.name}</h1>
                    <div className="flex gap-2">
                        <Link href={services.edit(service.id).url}>
                            <Button variant="outline">Edit Layanan</Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Durasi
                            </CardTitle>
                            <CardDescription>Waktu yang dibutuhkan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {service.duration_minutes} <span className="text-lg font-normal text-muted-foreground">menit</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Harga
                            </CardTitle>
                            <CardDescription>Biaya layanan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                Rp {service.price.toLocaleString('id-ID')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Deskripsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {service.description || 'Tidak ada deskripsi'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Tambahan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID Layanan:</span>
                            <span className="font-medium">#{service.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Dibuat pada:</span>
                            <span className="font-medium">
                                {new Date(service.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Terakhir diupdate:</span>
                            <span className="font-medium">
                                {new Date(service.updated_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

