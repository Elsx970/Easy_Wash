import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { MapPin, Phone, Mail, User as UserIcon, Download, MonitorPlay, ArrowLeft, Ticket } from 'lucide-react';

// --- INTERFACES ---
interface QueueData {
    current_serving: {
        number: string;
        status: string;
    };
    user_queue: {
        number: string;
        status: string;
        estimated_wait_time: string;
    };
    upcoming_list: Array<{
        time: string;
        number: string;
        status: string;
    }>;
}

interface Booking {
    id: number;
    vehicle_type: string;
    vehicle_plate: string;
    scheduled_at: string;
    estimated_finish_at: string | null;
    status: string;
    queue_number: string;
    notes?: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    customer_address?: string;
    location?: { name: string; address: string };
    service: { id: number; name: string; description: string; price: number };
}

// Pastikan Controller mengirimkan 'queue' juga
interface Props {
    booking: Booking;
    queue: QueueData; 
}

export default function BookingsShow({ booking, queue }: Props) {
    // STATE: Mengontrol tampilan ('details' atau 'queue')
    const [viewMode, setViewMode] = useState<'details' | 'queue'>('details');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Pemesanan', href: '/bookings' },
        { title: viewMode === 'details' ? 'Detail Pemesanan' : 'Monitor Antrean' },
    ];

    // Helpers
    const handlePrint = () => window.print();
    
    const formatRupiah = (num: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // --- RENDER COMPONENT: VIEW DETAIL ---
    const renderDetails = () => (
        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-300">
            {/* Kolom Kiri: Layanan & Kendaraan */}
            <div className="md:col-span-2 space-y-6">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-blue-600"/> Rincian Layanan
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Paket</h3>
                            <p className="text-lg font-semibold text-blue-600">{booking.service.name}</p>
                            <p className="text-sm text-gray-600">{booking.service.description}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Biaya</h3>
                            <p className="text-lg font-semibold text-gray-900">{formatRupiah(booking.service.price)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Jadwal</h3>
                            <p className="font-medium">
                                {new Date(booking.scheduled_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2">Kendaraan</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Plat Nomor</h3>
                            <div className="mt-1 inline-block bg-gray-900 text-white px-3 py-1 rounded font-mono font-bold">
                                {booking.vehicle_plate}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Tipe</h3>
                            <p className="font-medium capitalize">{booking.vehicle_type}</p>
                        </div>
                        {booking.notes && (
                            <div className="sm:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Catatan</h3>
                                <p className="text-sm bg-gray-50 p-2 rounded mt-1 italic">"{booking.notes}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Kolom Kanan: Pelanggan */}
            <div className="space-y-6">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2">Pelanggan</h2>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <div><p className="text-sm text-gray-500">Nama</p><p className="font-medium">{booking.customer_name}</p></div>
                        </div>
                        <div className="flex gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div><p className="text-sm text-gray-500">Telepon</p><p className="font-medium">{booking.customer_phone}</p></div>
                        </div>
                        <div className="flex gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium break-all text-sm">{booking.customer_email}</p></div>
                        </div>
                        {booking.location && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex gap-3">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Lokasi Cabang</p>
                                        <p className="font-bold text-gray-800">{booking.location.name}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- RENDER COMPONENT: VIEW QUEUE ---
    const renderQueue = () => (
        <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 py-6">
            <div className="w-full max-w-5xl grid gap-8 md:grid-cols-2">
                
                {/* KIRI: Antrean Sedang Jalan */}
                <div className="flex flex-col items-center justify-center space-y-6">
                    <h2 className="text-2xl font-bold text-blue-600 uppercase tracking-wider">Sedang Dilayani</h2>
                    
                    <div className="relative flex items-center justify-center w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-blue-600 shadow-xl shadow-blue-200">
                        <span className="text-8xl lg:text-9xl font-bold text-white tracking-tighter">
                            {queue.current_serving.number.replace(/[A-Z]/g, '')}
                        </span>
                        <div className="absolute -bottom-4 bg-white px-6 py-2 rounded-full shadow-lg border border-blue-100">
                            <span className="font-bold text-blue-800 text-lg">
                                {queue.current_serving.number}
                            </span>
                        </div>
                    </div>

                    <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full font-bold text-sm uppercase tracking-wide">
                        Status: {queue.current_serving.status}
                    </span>

                    {/* Table Upcoming */}
                    <div className="w-full max-w-xs mt-4 bg-white rounded-lg border shadow-sm">
                        <div className="px-3 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">Antrean Berikutnya</div>
                        {queue.upcoming_list.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 border-b last:border-0 text-sm">
                                <span className="font-mono text-gray-500">{item.time}</span>
                                <span className="font-bold text-gray-800">{item.number}</span>
                                <span className="text-xs font-medium text-gray-500">{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KANAN: Antrean User */}
                <div className="flex flex-col items-center justify-center space-y-6 md:border-l md:pl-8 border-dashed border-gray-300">
                    <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">Antrean Anda</h2>
                    
                    <div className="relative flex items-center justify-center w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-white border-8 border-blue-500 shadow-xl">
                        <span className="text-8xl lg:text-9xl font-bold text-gray-800 tracking-tighter">
                            {queue.user_queue.number.replace(/[A-Z]/g, '')}
                        </span>
                        <div className="absolute -bottom-5 bg-blue-600 px-8 py-2 rounded-full shadow-lg">
                            <span className="font-bold text-white text-xl">
                                {queue.user_queue.number}
                            </span>
                        </div>
                    </div>

                    <div className="text-center space-y-2 pt-4">
                        <p className="text-lg font-medium text-gray-600">Estimasi Giliran</p>
                        <p className="text-3xl font-bold text-blue-600">{queue.user_queue.estimated_wait_time}</p>
                    </div>

                    <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg max-w-xs text-center border border-yellow-200">
                        <p>Mohon bersiap di area tunggu jika nomor antrean Anda sudah dekat.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pemesanan #${booking.id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-8">
                
                {/* HEADER UTAMA */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            {viewMode === 'queue' && (
                                <button onClick={() => setViewMode('details')} className="md:hidden mr-2">
                                    <ArrowLeft className="w-5 h-5"/>
                                </button>
                            )}
                            <h1 className="text-2xl font-bold text-gray-900">
                                {viewMode === 'details' ? `Order #${booking.id}` : 'Monitor Antrean'}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                                {booking.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Kode Antrean: <span className="font-mono font-bold text-gray-900">{booking.queue_number}</span>
                        </p>
                    </div>

                    {/* ACTION BUTTONS (State Switcher) */}
                    <div className="flex flex-wrap gap-3">
                        {viewMode === 'details' ? (
                            <>
                                <Button variant="outline" onClick={handlePrint} className="gap-2">
                                    <Download className="w-4 h-4" /> Slip
                                </Button>
                                <Button 
                                    onClick={() => setViewMode('queue')}
                                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                                >
                                    <MonitorPlay className="w-4 h-4" /> Lihat Antrean
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={() => setViewMode('details')} className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> Kembali ke Detail
                            </Button>
                        )}
                    </div>
                </div>

                {/* CONTENT AREA (Conditional Rendering) */}
                <div className="min-h-[500px]">
                    {viewMode === 'details' ? renderDetails() : renderQueue()}
                </div>

            </div>
        </AppLayout>
    );
}