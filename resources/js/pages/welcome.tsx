import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, MousePointerClick, Calendar, CreditCard, Facebook, Twitter, Instagram, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'; // Import useState & useEffect

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    // Kita tetap ambil auth, tapi tidak dipakai di navbar rendering
    const { auth } = usePage<SharedData>().props;

    // --- STATE UNTUK MELACAK SECTION AKTIF ---
    const [activeSection, setActiveSection] = useState<string>('home');

    // --- LOGIKA SCROLL SPY (PEMANTAU SCROLL) ---
    useEffect(() => {
        // Cari semua section yang punya ID
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // Jika section terlihat di layar (isIntersecting), update state
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            // Threshold: Seberapa banyak bagian section harus terlihat baru dianggap "aktif"
            // rootMargin: Offset untuk navbar (supaya active berubah sebelum section benar-benar di atas)
            threshold: 0.3, 
            rootMargin: "-100px 0px -50% 0px" 
        });

        sections.forEach((section) => observer.observe(section));

        // Cleanup function
        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    // --- FUNGSI SMOOTH SCROLL ---
    const scrollToSection = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>, id: string) => {
        e.preventDefault(); // Mencegah loncat kasar default browser
        setActiveSection(id); // Set langsung jadi aktif saat diklik (biar responsif)
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Helper class untuk link navbar (supaya kodenya rapi)
    const getNavLinkClass = (sectionId: string) => {
        return `cursor-pointer transition ${
            activeSection === sectionId 
                ? 'text-blue-600 font-bold' // Style Active
                : 'text-gray-600 font-medium hover:text-blue-600' // Style Inactive
        }`;
    };

    return (
        <>
            <Head title="EasyWash - Cuci Mobil Terbaik" />

            <div className="min-h-screen bg-white font-sans text-[#1b1b18]">
                
                {/* --- NAVBAR --- */}
                <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        {/* Logo (Klik scroll ke home) */}
                        <div 
                            className="text-2xl font-extrabold tracking-tighter text-[#0F172A] cursor-pointer"
                            onClick={(e) => scrollToSection(e, 'home')}
                        >
                            Easy<span className="text-blue-600">Wash</span>
                        </div>

                        {/* Navigasi Tengah (Desktop) */}
                        <nav className="hidden md:flex gap-8 text-sm">
                            <a 
                                href="#home" 
                                onClick={(e) => scrollToSection(e, 'home')} 
                                className={getNavLinkClass('home')}
                            >
                                Beranda
                            </a>

                            <a 
                                href="#layanan" 
                                onClick={(e) => scrollToSection(e, 'layanan')} 
                                className={getNavLinkClass('layanan')}
                            >
                                Layanan
                            </a>
                            
                            <a 
                                href="#cara-kerja" 
                                onClick={(e) => scrollToSection(e, 'cara-kerja')} 
                                className={getNavLinkClass('cara-kerja')}
                            >
                                Cara Kerja
                            </a>
                            
                            <a 
                                href="#harga" 
                                onClick={(e) => scrollToSection(e, 'harga')} 
                                className={getNavLinkClass('harga')}
                            >
                                Harga
                            </a>
                        </nav>

                        {/* Tombol Kanan (Login / Register - SELALU TAMPIL) */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={login()}
                                className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- HERO SECTION --- */}
                <section id="home" className="relative pt-32 md:pt-40 pb-0 bg-[#0F172A]">
                    
                    {/* CONTAINER BACKGROUND */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                         <img 
                            src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1480&q=80" 
                            alt="Car Wash Footage Background" 
                            className="w-full h-full object-cover opacity-90 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/80 to-[#0F172A] z-10"></div>
                    </div>

                    {/* CONTENT HERO */}
                    <div className="relative w-full px-4 md:px-16 lg:px-24 text-center z-20">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 tracking-wide uppercase">
                            Cuci Mobil Terbaik di Lampung #1
                        </span>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight leading-tight w-full">
                            Reservasi Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Sekarang Juga</span>
                        </h1>
                        
                        <p className="text-gray-300 w-full max-w-4xl mx-auto mb-10 text-lg md:text-xl leading-relaxed">
                            Hemat waktu Anda dengan reservasi instan. Kami menjamin perawatan terbaik untuk kendaraan kesayangan Anda dengan teknologi terkini.
                        </p>
                        
                        <div className="mb-8 relative z-30">
                            <Link href={login()} className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1">
                                Reservasi Cuci Mobil
                            </Link>
                        </div>

                        {/* --- 2 GAMBAR MOBIL (OVERLAP EFFECT) --- */}
                        <div className="relative z-30 mt-12 flex flex-row justify-center items-end gap-2 md:gap-4 -mb-12 md:-mb-32 pointer-events-none w-full max-w-[98%] 2xl:max-w-screen-2xl mx-auto px-4">

                            {/* Mobil Kiri (Hitam Sedan) */}
                            <div className="relative z-10 w-[45%] md:w-[700px] transition-all duration-700 mb-1 md:mb-3">
                                <img
                                    src="https://pngimg.com/d/mercedes_PNG80136.png"
                                    alt="Mobil Hitam Kiri"
                                    className="w-full h-auto drop-shadow-2xl"
                                />
                            </div>

                            {/* Mobil Kanan (Silver SUV - Utama) */}
                            <div className="relative z-20 w-[50%] md:w-[850px] transition-all duration-700">
                                <img
                                    src="https://pngimg.com/d/mercedes_PNG80188.png"
                                    alt="Mobil Utama Silver"
                                    className="w-full h-auto drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- LAYANAN KAMI --- */}
                <section id="layanan" className="pt-24 md:pt-48 pb-24 bg-white relative z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end mb-16 gap-8">
                            <div className="md:w-1/3 border-l-4 border-blue-600 pl-6">
                                <h2 className="text-4xl font-bold text-[#0F172A] mb-2">Layanan Kami</h2>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-gray-500 text-lg">
                                    Kami menyediakan beberapa layanan perawatan kendaraan anda. 
                                    Dari pencucian rutin hingga detailing penuh.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="bg-white p-8 border border-blue-200 rounded-xl hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                    <CheckCircle2 className="text-blue-600 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] mb-4">Paket Standar</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Layanan kami yang paling populer - pencucian eksterior yang membuat mobil berkilau, dengan pembersihan seluruh interior.
                                </p>
                            </div>
                            
                            {/* Card 2 */}
                            <div className="bg-white p-8 border border-blue-200 rounded-xl hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                    <CheckCircle2 className="text-blue-600 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] mb-4">Paket Deluxe</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Paket deluxe yang mencakup pelindung yang lebih tahan lama, perawatan eksterior yang lebih keras dengan pembersihan interior.
                                </p>
                            </div>
                            
                            {/* Card 3 */}
                            <div className="bg-white p-8 border border-blue-200 rounded-xl hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                    <CheckCircle2 className="text-blue-600 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] mb-4">Paket Express</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Bagian luar bersih untuk pencucian yang cepat dan teratur. Menggunakan sarung tangan/spons berkualitas & sampo netral PH.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- CARA KERJA --- */}
                <section id="cara-kerja" className="relative py-24 bg-[#0F172A] overflow-hidden">
                    <div className="absolute inset-0 z-0">
                         <img 
                            src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop" 
                            alt="Background Texture" 
                            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A] z-10"></div>
                    </div>

                    <div className="relative z-20 max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cara Kerja Pemesanan Online</h2>
                            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                             {[
                                { title: "Langkah 1", icon: MapPin, sub: "Pilih Cabang EasyWash", desc: "Pilih cabang Easywash yang terdekat dengan lokasi anda" },
                                { title: "Langkah 2", icon: MousePointerClick, sub: "Pilihan Layanan", desc: "Dari Express, Standar, hingga Deluxe sesuai kebutuhan Anda" },
                                { title: "Langkah 3", icon: Calendar, sub: "Pilih Tanggal & Waktu", desc: "Situs Easywash buka setiap hari kecuali hari raya" },
                                { title: "Langkah 4", icon: CreditCard, sub: "Bayar & Datang", desc: "Staf kami siap menunggu mobil Anda terlihat seperti baru kembali" },
                             ].map((step, idx) => (
                                <div key={idx} className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-blue-400/30 hover:-translate-y-2 transition-all duration-500 group">
                                    <h4 className="font-bold text-blue-300 mb-6 tracking-wider uppercase text-sm">{step.title}</h4>
                                    <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-500">
                                        <step.icon className="w-9 h-9 text-white group-hover:text-blue-300 transition-colors duration-500" />
                                    </div>
                                    <h5 className="font-bold mb-3 text-xl text-white">{step.sub}</h5>
                                    <p className="text-sm text-gray-300 leading-relaxed">{step.desc}</p>
                                </div>
                             ))}
                        </div>
                    </div>
                </section>

                {/* --- HARGA (Pricing) --- */}
                <section id="harga" className="py-24 bg-[#F8FAFC]">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-[2]">
                            {/* Card 1 */}
                            <div className="bg-white p-6 shadow-lg hover:shadow-2xl border-t-4 border-blue-600 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                                <h3 className="font-bold text-2xl mb-3 text-[#0F172A]">Paket Standar</h3>
                                <p className="text-sm text-gray-500 mb-6">Pencucian eksterior & interior dasar.</p>
                                <div className="mt-auto">
                                    <a href="#" className="text-blue-600 text-sm font-semibold block mb-2 hover:underline">Lihat Lebih lanjut...</a>
                                    <p className="text-xs text-gray-400">Mulai dari</p>
                                    <p className="text-3xl font-bold text-[#0F172A] mb-6">Rp 80.000</p>
                                    <Link href={login()} className="block w-full py-3 text-center border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                        Reservasi Cuci Mobil
                                    </Link>
                                </div>
                            </div>

                             {/* Card 2 (Deluxe) */}
                             <div className="bg-white p-6 shadow-lg hover:shadow-2xl border-t-4 border-blue-600 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col md:-mt-4 relative z-10">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">POPULAR</div>
                                <h3 className="font-bold text-2xl mb-3 text-[#0F172A]">Paket Deluxe</h3>
                                <p className="text-sm text-gray-500 mb-6">Perlindungan tahan lama & perawatan ekstra.</p>
                                <div className="mt-auto">
                                    <a href="#" className="text-blue-600 text-sm font-semibold block mb-2 hover:underline">Lihat Lebih lanjut...</a>
                                    <p className="text-xs text-gray-400">Mulai dari</p>
                                    <p className="text-3xl font-bold text-[#0F172A] mb-6">Rp 120.000</p>
                                    <Link href={login()} className="block w-full py-3 text-center bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                        Reservasi Cuci Mobil
                                    </Link>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white p-6 shadow-lg hover:shadow-2xl border-t-4 border-blue-600 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                                <h3 className="font-bold text-2xl mb-3 text-[#0F172A]">Paket Express</h3>
                                <p className="text-sm text-gray-500 mb-6">Cuci cepat bagian luar dengan bahan premium.</p>
                                <div className="mt-auto">
                                    <a href="#" className="text-blue-600 text-sm font-semibold block mb-2 hover:underline">Lihat Lebih lanjut...</a>
                                    <p className="text-xs text-gray-400">Mulai dari</p>
                                    <p className="text-3xl font-bold text-[#0F172A] mb-6">Rp 50.000</p>
                                    <Link href={login()} className="block w-full py-3 text-center border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                        Reservasi Cuci Mobil
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 pt-4">
                            <div className="border-l-4 border-blue-600 pl-6 mb-8">
                                <h2 className="text-5xl font-bold text-[#0F172A] mb-2">Harga</h2>
                                <p className="text-blue-600 font-medium">Transparan & Terjangkau</p>
                            </div>
                            <p className="text-gray-500 mb-10 leading-relaxed text-lg">
                                Kami bangga dengan jangkauan dan kualitas layanan yang kami berikan kepada pelanggan kami. 
                                Dari pencucian rutin hingga detailing penuh, kami akan menjaga mobil Anda tetap tampil terbaik.
                            </p>
                            <Link href={login()} className="inline-block bg-[#0F172A] text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg">
                                Lihat Lebih Lengkap
                            </Link>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-[#0F172A] text-white py-12 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                         <div className="text-2xl font-extrabold tracking-tighter text-white mb-6">
                            Easy<span className="text-blue-500">Wash</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">Copyright © 2025, Universe.</p>
                        <p className="text-gray-400 text-sm mb-2">Bandar Lampung, Lampung, Indonesia.</p>
                        <p className="text-gray-400 text-sm mb-8 font-mono">+62 895-6179-69599 (CS)</p>
                        
                        <div className="flex justify-center gap-8">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition transform hover:scale-110"><Facebook size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110"><Twitter size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-pink-500 transition transform hover:scale-110"><Instagram size={24} /></a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}