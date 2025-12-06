import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import services from '@/routes/services';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Form } from '@inertiajs/react';

interface Service {
    id: number;
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
}

interface Props {
    service: Service;
    errors?: {
        name?: string;
        description?: string;
        duration_minutes?: string;
        price?: string;
    };
}

export default function ServiceEdit({ service, errors = {} }: Props) {
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
            title: `Edit ${service.name}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${service.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Layanan</h1>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-card p-6 dark:border-sidebar-border">
                    <Form {...services.update.form(service.id)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nama Layanan <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={service.name}
                                placeholder="Contoh: Cuci Mobil Premium"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={service.description || ''}
                                placeholder="Deskripsi layanan (opsional)"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="duration_minutes">
                                    Durasi (menit) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="duration_minutes"
                                    name="duration_minutes"
                                    type="number"
                                    min="1"
                                    defaultValue={service.duration_minutes}
                                    placeholder="Contoh: 60"
                                    required
                                />
                                {errors.duration_minutes && (
                                    <p className="text-sm text-red-500">
                                        {errors.duration_minutes}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Harga (Rp) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    defaultValue={service.price}
                                    placeholder="Contoh: 150000"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">{errors.price}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">
                                Update Layanan
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
                </div>
            </div>
        </AppLayout>
    );
}

