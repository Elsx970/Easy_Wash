import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import services from '@/routes/services';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Layanan',
        href: services.index().url,
    },
];

interface Service {
    id: number;
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    services: {
        data: Service[];
        links: PaginationLink[];
    };
}

export default function ServicesIndex({ services: servicesData }: Props) {
    const handleDelete = (serviceId: number, serviceName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus layanan "${serviceName}"?`)) {
            router.delete(services.destroy(serviceId).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layanan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Layanan</h1>
                    <Link href={services.create().url}>
                        <Button>Tambah Layanan</Button>
                    </Link>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-card p-4 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border">
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Nama</th>
                                    <th className="px-4 py-2 text-left">Deskripsi</th>
                                    <th className="px-4 py-2 text-left">Durasi</th>
                                    <th className="px-4 py-2 text-left">Harga</th>
                                    <th className="px-4 py-2 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicesData.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            Belum ada layanan. Klik "Tambah Layanan" untuk membuat layanan baru.
                                        </td>
                                    </tr>
                                ) : (
                                    servicesData.data.map((service) => (
                                        <tr key={service.id} className="border-b border-sidebar-border">
                                            <td className="px-4 py-2">#{service.id}</td>
                                            <td className="px-4 py-2 font-medium">{service.name}</td>
                                            <td className="px-4 py-2 text-muted-foreground">
                                                {service.description || '-'}
                                            </td>
                                            <td className="px-4 py-2">{service.duration_minutes} menit</td>
                                            <td className="px-4 py-2 font-medium">
                                                Rp {service.price.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={services.show(service.id).url}
                                                        className="text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        Lihat
                                                    </Link>
                                                    <Link
                                                        href={services.edit(service.id).url}
                                                        className="text-green-600 hover:underline dark:text-green-400"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(service.id, service.name)}
                                                        className="text-red-600 hover:underline dark:text-red-400"
                                                    >
                                                        Hapus
                                                    </button>
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

