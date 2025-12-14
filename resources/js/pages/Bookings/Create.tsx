import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import bookings from '@/routes/bookings';
import {
    MapPin, Phone, Clock, XCircle,
    Calendar as CalendarIcon, CreditCard, MousePointerClick,
    User, Map, Check,
    Car, Truck, Bike // <-- MENAMBAHKAN ICON KENDARAAN
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { type SharedData } from '@/types';

// --- CSS UNTUK HIDE SCROLLBAR & AUTOFILL FIX ---
const hideScrollbarStyle = `
  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
  
  /* Override browser autofill styling - AGGRESSIVE */
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #1b1b18 !important;
    transition: background-color 5000s ease-in-out 0s;
    background-color: white !important;
  }
  
  input:-webkit-autofill:hover {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #1b1b18 !important;
    background-color: white !important;
  }
  
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #1b1b18 !important;
    background-color: white !important;
  }
`;

// --- TIPE DATA ---
interface Service {
    id: number;
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
}

interface Location {
    id: number | string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    hours?: string;
}

interface Props {
    services: Service[];
    locations?: Location[];
}

// Backend will provide locations; keep empty fallback
const LOCATIONS: Location[] = [];

// --- DATA MOCKUP WAKTU ---
const TIME_SLOTS = [
    "09.00", "10.00", "11.00", "12.00",
    "13.00", "14.00", "15.00", "16.00", "17.00"
];

// --- DATA FITUR LAYANAN ---
const SERVICE_FEATURES = [
    {
        key: 'standar',
        title: 'Paket Standar',
        subtitle: 'Untuk mobil yang memerlukan sedikit perhatian lebih',
        listTitle: 'Layanan Paket Standar',
        features: [
            { text: 'Bilas bertekanan tinggi', included: true },
            { text: 'Pencucian seluruh bagian luar', included: true },
            { text: 'Pencucian roda & pelek', included: true },
            { text: 'Semir ban', included: true },
            { text: 'Pembersihan jendela & kaca spion', included: true },
            { text: 'Lap kusen pintu & bagasi', included: true },
            { text: 'Aplikasi cat lilin tangan (Wax)', included: false },
            { text: 'Interior vakum (matras, kursi, bagasi)', included: true },
            { text: 'Bersihkan kaca interior', included: true },
            { text: 'Bersihkan dasbor & trim', included: true },
        ]
    },
    {
        key: 'deluxe',
        title: 'Paket Deluxe',
        subtitle: 'Paket kendaraan special kami',
        listTitle: 'Layanan Paket Deluxe',
        features: [
            { text: 'Bilas bertekanan tinggi', included: true },
            { text: 'Pencucian seluruh bagian luar', included: true },
            { text: 'Pencucian roda & pelek', included: true },
            { text: 'Semir ban', included: true },
            { text: 'Pembersihan jendela & kaca spion', included: true },
            { text: 'Lap kusen pintu & bagasi', included: true },
            { text: 'Aplikasi cat lilin tangan (Wax)', included: true },
            { text: 'Interior vakum (matras, kursi, bagasi)', included: true },
            { text: 'Bersihkan kaca interior', included: true },
            { text: 'Bersihkan dasbor & trim', included: true },
        ]
    },
    {
        key: 'kilat',
        title: 'Paket Express',
        subtitle: 'Tingkat pemula, hanya bagian luar yang bersih',
        listTitle: 'Layanan Paket Express',
        features: [
            { text: 'Bilas bertekanan tinggi', included: true },
            { text: 'Pencucian seluruh bagian luar', included: true },
            { text: 'Pencucian roda & pelek', included: true },
            { text: 'Semir ban', included: true },
            { text: 'Pembersihan jendela & kaca spion', included: true },
            { text: 'Lap kusen pintu & bagasi', included: false },
            { text: 'Aplikasi cat lilin tangan (Wax)', included: false },
            { text: 'Interior vakum', included: false },
            { text: 'Bersihkan kaca interior', included: false },
            { text: 'Bersihkan dasbor & trim', included: false },
        ]
    }
];

// --- DATA PILIHAN KENDARAAN (BARU) ---
// Vehicle options include semantic type and optional size to satisfy backend validation
const VEHICLE_OPTIONS = [
    { id: 'mobil_m', type: 'mobil', size: 'M', label: 'M', name: 'Mobil (M)', icon: Car },
    { id: 'mobil_l', type: 'mobil', size: 'L', label: 'L', name: 'Mobil (L)', icon: Truck },
    { id: 'motor', type: 'motor', size: null, label: '', name: 'Motor', icon: Bike },
];

export default function BookingsCreate({ services, locations = [] }: Props) {
    const pageProps = usePage<SharedData>().props as any;
    const auth = pageProps.auth;
    const flash = pageProps.flash as Record<string, any> | undefined;
    const userName = auth?.user?.name || 'Pelanggan';

    const [step, setStep] = useState<number>(1);

    // Debug: Log locations received
    console.log('Locations passed to component:', locations);
    console.log('Locations length:', locations.length);

    // --- LOGIKA TANGGAL REALTIME (dengan timezone awareness) ---
    const today = new Date();
    // Gunakan tanggal lokal user untuk calendar display (apa yang user lihat)
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentMonthYear = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(today);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Helper untuk format tanggal lokal ke YYYY-MM-DD
    const formatLocalDate = (dateObj: Date): string => {
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    interface BookingFormData {
        location_id: string;
        service_id: string;
        vehicle_type: string;
        vehicle_size: string;
        vehicle_plate: string;
        date: string;
        time: string;
        scheduled_at: string;
        email: string;
        phone: string;
        name: string;
        address: string;
        zip_code: string;
        city: string;
        notes: string;
    }

    const { data, setData, post, processing, errors, transform } = useForm<BookingFormData>({
        location_id: '',
        service_id: '',
        vehicle_type: 'mobil', // backend expects 'mobil' | 'motor' | 'salon'
        vehicle_size: 'M',
        vehicle_plate: '',
        date: '',
        time: '',
        scheduled_at: '',
        email: auth?.user?.email || '',
        phone: '',
        name: auth?.user?.name || '',
        address: '',
        zip_code: '',
        city: '',
        notes: ''
    });

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep((prev) => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(number);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            scheduled_at: `${data.date} ${data.time.replace('.', ':')}:00`,
        }));
        post(bookings.store().url, {
            onSuccess: () => { },
            onError: (err) => {
                console.error("Booking Error:", err);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };

    const selectedService = services.find(s => s.id.toString() === data.service_id);
    const selectedLocation = (locations.length ? locations : LOCATIONS).find(l => String(l.id) === String(data.location_id));

    // Helper untuk menampilkan nama kendaraan yang dipilih
    const getVehicleLabel = (type: string, size?: string | null) => {
        const normalizedSize = size || null;
        const v = VEHICLE_OPTIONS.find(opt => 
            opt.type === type && (opt.size === normalizedSize || (opt.size === null && !normalizedSize))
        );
        return v ? v.name : 'Kendaraan';
    };

    // Helper function to check if time has passed
    const isTimePassed = (timeStr: string, selectedDate: string) => {
        if (!selectedDate) return false;
        
        const selectedDateObj = new Date(selectedDate);
        const isToday = selectedDateObj.toDateString() === today.toDateString();
        
        if (!isToday) return false;
        
        // Convert time string (e.g., "09.00") to hours and minutes
        const [hours, minutes] = timeStr.split('.').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const currentTime = today.getHours() * 60 + today.getMinutes();
        
        return timeInMinutes <= currentTime;
    };

    const getServiceIdByKey = (key: string) => {
        // Map package keys to service names
        let searchTerms: string[] = [];
        
        if (key === 'standar') {
            searchTerms = ['standar'];
        } else if (key === 'deluxe') {
            searchTerms = ['premium'];
        } else if (key === 'kilat') {
            searchTerms = ['express'];
        }
        
        const found = services.find(s => {
            const lowerName = s.name.toLowerCase();
            return searchTerms.some(term => lowerName.includes(term));
        });
        
        console.log(`getServiceIdByKey(${key}):`, { searchTerms, found: found?.name, id: found?.id });
        return found ? found.id.toString() : '';
    };

    // --- PERBAIKAN PROGRESS BAR ---
    // Mengembalikan rasio (0 sampai 1) bukan percentage string
    const getProgressRatio = () => {
        switch (step) {
            case 1: return 0;       // 0%
            case 2: return 0.3333;  // 1/3
            case 3: return 0.6666;  // 2/3
            case 4: return 1;       // Full
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1b1b18]">
            <Head title="Buat Pemesanan" />
            
            {/* Inject CSS untuk hide scrollbar */}
            <style>{hideScrollbarStyle}</style>

            {/* Flash / Validation Errors */}
            {(flash?.error || flash?.success || Object.keys(errors).length > 0) && (
                <div className="max-w-7xl mx-auto px-6 mt-6">
                    <div className="space-y-2">
                        {flash?.error && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
                                <strong className="font-semibold">Error:</strong>
                                <div className="mt-1">{flash.error}</div>
                            </div>
                        )}

                        {flash?.success && (
                            <div className="rounded-md bg-green-50 border border-green-200 p-4 text-green-700">
                                <strong className="font-semibold">Sukses:</strong>
                                <div className="mt-1">{flash.success}</div>
                            </div>
                        )}

                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-yellow-800">
                                <strong className="font-semibold">Periksa form:</strong>
                                <ul className="mt-2 list-disc list-inside text-sm">
                                    {Object.entries(errors).map(([k, v]) => (
                                        <li key={k}>{Array.isArray(v) ? v.join(', ') : String(v)}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- NAVBAR --- */}
            <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* LOGO: Arahkan ke /dashboard */}
                    <Link href="/dashboard" className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
                        Easy<span className="text-blue-600">Wash</span>
                    </Link>

                    <nav className="hidden md:flex gap-10 text-gray-500 font-medium">
                        {/* MENU BERANDA: Arahkan ke /dashboard */}
                        <Link href="/dashboard" className="hover:text-blue-600">Beranda</Link>
                        
                        <Link href="#" className="hover:text-blue-600">Lokasi</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[#0F172A]">{userName}</p>
                        </div>
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-200">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </header>

            {/* --- HERO STEPPER --- */}
            <section className="relative pt-32 pb-48 bg-[#0F172A] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop"
                        alt="Car Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <div className="relative flex justify-between items-start w-full px-8 md:px-24">
                        {/* Connecting Line Background */}
                        <div className="absolute top-[2rem] left-[6rem] right-[6rem] h-[2px] bg-gray-600 z-0 hidden md:block"></div>
                        
                        {/* Active Line Blue */}
                        <div
                            className="absolute top-[2rem] left-[6rem] h-[2px] bg-blue-500 z-0 hidden md:block transition-all duration-700 ease-in-out"
                            style={{ width: `calc((100% - 12rem) * ${getProgressRatio()})` }}
                        ></div>

                        {[
                            { id: 1, icon: Map, label: "Langkah 1", sub: "Pilih Lokasi" },
                            { id: 2, icon: MousePointerClick, label: "Langkah 2", sub: "Layanan & Kendaraan" }, // <-- UPDATE LABEL
                            { id: 3, icon: CalendarIcon, label: "Langkah 3", sub: "Waktu" },
                            { id: 4, icon: CreditCard, label: "Langkah 4", sub: "Konfirmasi" },
                        ].map((s) => {
                            const isActive = step >= s.id;
                            return (
                                <div key={s.id} className="relative z-10 flex flex-col items-center gap-4 w-40">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${isActive
                                                ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                                                : 'bg-white border-gray-200 text-[#0F172A]'
                                            }`}
                                    >
                                        <s.icon className="w-7 h-7" strokeWidth={1.5} />
                                    </div>
                                    <div className={`text-white transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                        <p className="font-medium text-sm mb-1">{s.label}</p>
                                        <p className="text-gray-300 text-[10px]">{s.sub}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* --- CONTENT AREA --- */}
            <main className="relative z-20 max-w-7xl mx-auto px-6 -mt-32 pb-24">

                {/* --- STEP 1: PILIH LOKASI --- */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-4xl font-extrabold text-center text-white mb-12 tracking-tight drop-shadow-md">
                            Temukan Lokasi Terdekat
                        </h2>

                        <div className="space-y-6">
                            {(locations.length ? locations : LOCATIONS).map((loc) => {
                                const isSelected = String(data.location_id) === String(loc.id);
                                return (
                                    <div
                                        key={loc.id}
                                        onClick={() => setData('location_id', String(loc.id))}
                                        className={`bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 cursor-pointer border hover:-translate-y-1 hover:shadow-xl ${isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="flex-1 w-full">
                                            <h3 className="text-2xl font-bold text-[#0F172A] border-b-2 border-gray-100 inline-block mb-6 pb-2">
                                                {loc.name}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-600 text-sm font-medium">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                                    <span className="leading-relaxed">{loc.address}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                                                    <span>{loc.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                                                    <div className="flex flex-col">
                                                        <span>Senin - Minggu</span>
                                                        <span>{loc.hours}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                            <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData('location_id', String(loc.id));
                                                nextStep();
                                            }}
                                            className={`px-10 py-6 rounded-lg text-sm font-bold transition-all duration-300 border ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                                                }`}
                                        >
                                            {isSelected ? 'Terpilih' : 'Pilih'}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- STEP 2: PILIH KENDARAAN & LAYANAN --- */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-4xl font-extrabold text-center text-white mb-12 tracking-tight drop-shadow-md">
                            Pilih Kendaraan & Paket Layanan
                        </h2>
                        
                        {/* --- NEW SECTION: PILIH TIPE KENDARAAN --- */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-10 max-w-3xl mx-auto border border-gray-100">
                             <h3 className="text-xl font-bold text-[#0F172A] text-center mb-2">Pilih Ukuran Kendaraan Kamu</h3>
                             <p className="text-center text-gray-600 text-sm mb-8">Pilih jenis kendaraan yang akan dicuci</p>
                             
                             <div className="flex justify-center gap-6 md:gap-12">
                                {VEHICLE_OPTIONS.map((v) => {
                                    const normalizedDataSize = data.vehicle_size || null;
                                    const isSelected = data.vehicle_type === v.type && 
                                        (v.size === normalizedDataSize || (v.size === null && !data.vehicle_size));
                                    return (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => {
                                                setData('vehicle_type', v.type);
                                                setData('vehicle_size', v.size ?? '');
                                            }}
                                            className={`flex flex-col items-center gap-4 cursor-pointer group p-6 rounded-xl transition-all duration-300 border-2 ${
                                                isSelected 
                                                    ? 'border-blue-600 bg-blue-50 scale-105 shadow-lg' 
                                                    : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
                                            }`}
                                        >
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                                isSelected 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                                                    : 'bg-gray-100 border-gray-300 text-gray-600 group-hover:border-blue-400'
                                            }`}>
                                                <v.icon className="w-10 h-10" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                {v.label && (
                                                    <span className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                                                        {v.label}
                                                    </span>
                                                )}
                                                {!v.label && (
                                                     <span className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                                                        Motor
                                                    </span>
                                                )}
                                                <span className={`text-xs font-medium ${isSelected ? 'text-blue-500' : 'text-gray-500'} mt-1`}>
                                                    {v.name}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                                                    <Check className="w-4 h-4" strokeWidth={3} />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                             </div>
                        </div>
                        {/* --- END NEW SECTION --- */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {SERVICE_FEATURES.map((feature, idx) => {
                                const dbId = getServiceIdByKey(feature.key);
                                const isSelected = data.service_id === dbId;

                                return (
                                    <div
                                        key={idx}
                                        className={`bg-white p-8 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:-translate-y-2 border ${isSelected ? 'border-blue-600 ring-2 ring-blue-100 scale-[1.02] z-10' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="text-center mb-6">
                                            <h3 className="text-3xl font-bold text-blue-600 mb-3">{feature.title}</h3>
                                            <p className="text-xs text-gray-500 px-4">{feature.subtitle}</p>
                                        </div>

                                        <div className="flex-1 text-left">
                                            <p className="font-bold text-sm text-[#0F172A] mb-4 pb-2 border-b border-gray-100">{feature.listTitle}</p>
                                            <ul className="space-y-4 mb-8">
                                                {feature.features.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-xs leading-snug">
                                                        {item.included ? (
                                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white">
                                                                <Check className="w-3 h-3" strokeWidth={3} />
                                                            </div>
                                                        ) : (
                                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0 text-white">
                                                                <XCircle className="w-3 h-3" strokeWidth={3} />
                                                            </div>
                                                        )}
                                                        <span className={item.included ? 'text-gray-600' : 'text-gray-400 line-through'}>{item.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-auto">
                                            <Button
                                                onClick={() => {
                                                    if (dbId) {
                                                        setData('service_id', dbId);
                                                        nextStep();
                                                    } else {
                                                        setData('service_id', 'dummy-' + feature.key);
                                                        nextStep();
                                                    }
                                                }}
                                                className={`w-full py-6 text-sm font-bold border transition-all rounded-lg ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                                                    }`}
                                            >
                                                Pilih Paket Ini
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- STEP 3: PILIH JADWAL --- */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-4xl font-extrabold text-center text-white mb-12 tracking-tight drop-shadow-md">
                            Pilih Tanggal & Waktu
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-4xl mx-auto">
                            {/* Calendar Container */}
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full md:w-[380px]">
                                <h3 className="text-xl font-bold mb-8 text-[#0F172A] text-center">{currentMonthYear}</h3>

                                <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center mb-4 text-xs text-gray-500 font-semibold uppercase">
                                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                                        <span key={d}>{d}</span>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
                                        // Buat Date object untuk tanggal ini
                                        const dateObj = new Date(currentYear, currentMonth, date);
                                        const dateStr = formatLocalDate(dateObj);
                                        const isSelected = data.date === dateStr;
                                        const isPast = date < today.getDate() && currentMonth === today.getMonth();

                                        return (
                                            <button
                                                key={date}
                                                type="button"
                                                disabled={isPast}
                                                onClick={() => !isPast && setData('date', dateStr)}
                                                className={`h-9 w-9 mx-auto flex items-center justify-center text-sm font-medium rounded-full transition-all 
                                                    ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : isPast 
                                                            ? 'text-gray-300 cursor-not-allowed' 
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {date}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Container dengan Scrollbar Tersembunyi (no-scrollbar) */}
                            <div className="bg-white p-0 rounded-xl shadow-lg border border-gray-100 w-full md:w-[200px] flex flex-col overflow-hidden">
                                <div className="bg-gray-50 p-4 text-center border-b border-gray-100">
                                    <h4 className="font-bold text-[#0F172A]">Jam</h4>
                                </div>
                                {/* Tambahkan class 'no-scrollbar' disini */}
                                <div className="flex-1 p-4 flex flex-col gap-2 items-center overflow-y-auto max-h-[300px] no-scrollbar">
                                    {TIME_SLOTS.map((time) => {
                                        const isSelected = data.time === time;
                                        const timePassed = isTimePassed(time, data.date);
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                disabled={timePassed}
                                                onClick={() => !timePassed && setData('time', time)}
                                                className={`w-full py-2 rounded text-sm font-medium transition-all ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : timePassed
                                                            ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="p-4 border-t border-gray-100">
                                    <Button
                                        onClick={nextStep}
                                        disabled={!data.date || !data.time}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium disabled:opacity-50"
                                    >
                                        Lanjut
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STEP 4: KONFIRMASI & DATA DIRI --- */}
                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-4xl font-extrabold text-center text-white mb-12 tracking-tight drop-shadow-md">
                            Konfirmasi & Pembayaran
                        </h2>

                        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">

                            {/* FORM KIRI: DATA DIRI */}
                            <div className="flex-1 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                                <h2 className="text-xl font-bold text-[#0F172A] mb-6 pb-4 border-b border-gray-100">Detail Pelanggan</h2>
                                <div className="space-y-5">
                                    <div>
                                        <Label htmlFor="vehicle_plate" className="font-bold text-[#0F172A] text-sm mb-2 block">
                                            Plat Nomor Kendaraan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="vehicle_plate"
                                            value={data.vehicle_plate}
                                            onChange={(e) => setData('vehicle_plate', e.target.value)}
                                            className="bg-white border-gray-200 rounded h-12 px-4 shadow-sm focus:border-blue-500 w-full"
                                            placeholder="Contoh: BE 1234 AB"
                                            required
                                        />
                                        <InputError message={errors.vehicle_plate} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="font-bold text-[#0F172A] text-sm mb-2 block">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="bg-white border-gray-200 rounded h-12 px-4 shadow-sm focus:border-blue-500 w-full"
                                            placeholder="Example@youremail.com"
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="font-bold text-[#0F172A] text-sm mb-2 block">Nomor Telepon</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="bg-white border-gray-200 rounded h-12 px-4 shadow-sm focus:border-blue-500 w-full"
                                            placeholder="0812-xxxx-xxxx"
                                        />
                                        <InputError message={errors.phone} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="name" className="font-bold text-[#0F172A] text-sm mb-2 block">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="bg-white border-gray-200 rounded h-12 px-4 shadow-sm focus:border-blue-500 w-full"
                                            placeholder="Nama Anda"
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="address" className="font-bold text-[#0F172A] text-sm mb-2 block">Alamat</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="bg-white border-gray-200 rounded h-12 px-4 shadow-sm focus:border-blue-500 w-full"
                                            placeholder="Alamat Lengkap"
                                        />
                                        <InputError message={errors.address} className="mt-1" />
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-1/2">
                                            <Label htmlFor="zip_code" className="font-bold text-[#0F172A] text-sm mb-2 block">Kode Pos</Label>
                                            <Input
                                                id="zip_code"
                                                value={data.zip_code}
                                                onChange={(e) => setData('zip_code', e.target.value)}
                                                className="bg-white border-gray-200 rounded h-12 px-4 shadow-sm focus:border-blue-500 w-full"
                                                placeholder="351xx"
                                            />
                                            <InputError message={errors.zip_code} className="mt-1" />
                                        </div>
                                        <div className="w-1/2">
                                            <Label htmlFor="city" className="font-bold text-[#0F172A] text-sm mb-2 block">Kota</Label>
                                            <Input
                                                id="city"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className="bg-white border-gray-200 rounded h-12 px-4 shadow-sm focus:border-blue-500 w-full"
                                                placeholder="Bandar Lampung"
                                            />
                                            <InputError message={errors.city} className="mt-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RINGKASAN KANAN */}
                            <div className="w-full lg:w-[450px]">
                                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-auto">
                                    <h2 className="text-xl font-bold text-[#0F172A] mb-6 pb-4 border-b border-gray-100">Ringkasan Pemesanan</h2>

                                    <div className="flex justify-between items-start mb-4">
                                        <span className="font-bold text-[#0F172A] text-lg">{selectedService?.name || 'Layanan'}</span>
                                        <span className="font-medium text-[#0F172A]">{selectedService ? formatRupiah(selectedService.price) : '-'}</span>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="text-sm flex justify-between items-start">
                                            <span className="text-gray-500">Lokasi: </span>
                                            <span className="font-bold text-[#0F172A] text-right max-w-[200px]">
                                                {selectedLocation?.name || '-'}
                                            </span>
                                        </div>
                                        {/* Added Vehicle Type to Summary */}
                                        <div className="text-sm flex justify-between items-start">
                                            <span className="text-gray-500">Kendaraan: </span>
                                            <span className="font-bold text-[#0F172A] text-right">
                                                {getVehicleLabel(data.vehicle_type, data.vehicle_size)}
                                            </span>
                                        </div>
                                        <div className="text-sm flex justify-between items-start">
                                            <span className="text-gray-500">Plat Nomor: </span>
                                            <span className="font-bold text-[#0F172A] text-right font-mono">
                                                {data.vehicle_plate || '-'}
                                            </span>
                                        </div>
                                        <div className="text-sm flex justify-between items-start">
                                            <span className="text-gray-500">Paket Layanan: </span>
                                            <span className="font-bold text-[#0F172A] text-right">
                                                {selectedService?.name || '-'}
                                            </span>
                                        </div>
                                        <div className="text-sm flex justify-between items-start">
                                            <span className="text-gray-500">Jadwal: </span>
                                            <span className="font-bold text-[#0F172A] text-right">
                                                {data.date ? `${data.date.split('-').reverse().join('-')} / ${data.time}` : '-'}
                                            </span>
                                        </div>
                                        <div className="border-t pt-4 mt-4">
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Detail Pelanggan</p>
                                            <div className="text-xs space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Nama:</span>
                                                    <span className="font-medium text-[#0F172A]">{data.name || '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Email:</span>
                                                    <span className="font-medium text-[#0F172A] text-right max-w-[180px]">{data.email || '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Telepon:</span>
                                                    <span className="font-medium text-[#0F172A]">{data.phone || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-gray-100">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Pembayaran</span>
                                            <span className="font-bold text-[#0F172A] text-right">Di Tempat</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold text-[#0F172A] mt-2">
                                            <span>Total</span>
                                            <span>{selectedService ? formatRupiah(selectedService.price) : '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-lg text-lg font-bold shadow-lg"
                                    >
                                        {processing ? 'Memproses...' : 'Konfirmasi Booking'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TOMBOL SEBELUMNYA --- */}
                {step > 1 && (
                    <div className="mt-12 max-w-6xl mx-auto px-6">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="bg-blue text-blue-600 border border-blue-600 hover:bg-blue-700 px-8 py-2 rounded h-auto font-medium"
                        >
                            Sebelumnya
                        </Button>
                    </div>
                )}

            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-[#0F172A] text-white py-16 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mb-4 text-white">EasyWash</h3>
                    <p className="text-gray-400 text-xs mb-1">Copyright © 2025, Universe.</p>
                    <p className="text-gray-400 text-xs mb-1">Bandar Lampung, Lampung, Indonesia.</p>
                    <p className="text-gray-400 text-xs mb-8 font-mono">+62 895-6179-69599 (CS)</p>
                </div>
            </footer>
        </div>
    );
}