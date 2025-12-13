import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />

            <div className="min-h-screen w-full flex bg-white">
                
                {/* --- BAGIAN KIRI: GAMBAR --- */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
                     <img 
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1480&q=80" 
                        alt="Car Wash Soap Detail" 
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-blue-700/30 to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col justify-center items-start p-16 xl:p-24 text-white h-full">
                        <div className="text-6xl font-extrabold mb-8 tracking-tight leading-tight">
                            Bergabunglah<br/>dengan Kami<br/>Sekarang!
                        </div>
                        <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
                            Daftar sekarang dan nikmati layanan pencucian kendaraan terbaik dengan harga terjangkau.
                        </p>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: FORM --- */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 lg:px-24 bg-white relative overflow-y-auto">
                    
                    {/* Logo Mobile */}
                    <div className="lg:hidden absolute top-8 left-8 text-2xl font-extrabold">
                        <span className="text-slate-900">Easy</span><span className="text-blue-600">Wash</span>
                    </div>

                    <div className="w-full max-w-xl">
                        <div className="mb-12">
                            <h1 className="text-4xl font-black text-slate-900 mb-2">Daftar</h1>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            className="space-y-8" 
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* --- INPUT NAMA --- */}
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-base font-bold text-slate-900 pl-1">Nama</Label>
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                type="text"
                                                name="name"
                                                required
                                                autoFocus
                                                autoComplete="name"
                                                placeholder="Masukan Nama"
                                                // SAYA PAKAI !py-5 UNTUK MAKSA TINGGI DAN rounded-xl
                                                className="w-full !py-5 pl-6 pr-12 !h-auto text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 text-slate-800 placeholder:text-gray-400"
                                            />
                                            <User className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                        </div>
                                        {errors.name && <InputError message={errors.name} />}
                                    </div>

                                    {/* --- INPUT EMAIL --- */}
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-base font-bold text-slate-900 pl-1">Email</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoComplete="email"
                                                placeholder="Masukan Email"
                                                className="w-full !py-5 pl-6 pr-12 !h-auto text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 text-slate-800 placeholder:text-gray-400"
                                            />
                                            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                        </div>
                                        {errors.email && <InputError message={errors.email} />}
                                    </div>

                                    {/* --- INPUT PASSWORD --- */}
                                    <div className="space-y-3">
                                        <Label htmlFor="password" className="text-base font-bold text-slate-900 pl-1">Kata sandi</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                autoComplete="new-password"
                                                placeholder="Masukan Kata Sandi"
                                                className="w-full !py-5 pl-6 pr-12 !h-auto text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 text-slate-800 placeholder:text-gray-400"
                                            />
                                            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                        </div>
                                        {errors.password && <InputError message={errors.password} />}
                                    </div>

                                    {/* --- INPUT PASSWORD CONFIRMATION --- */}
                                    <div className="space-y-3">
                                        <Label htmlFor="password_confirmation" className="text-base font-bold text-slate-900 pl-1">Konfirmasi Kata Sandi</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                required
                                                autoComplete="new-password"
                                                placeholder="Konfirmasi Kata Sandi"
                                                className="w-full !py-5 pl-6 pr-12 !h-auto text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 text-slate-800 placeholder:text-gray-400"
                                            />
                                            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                        </div>
                                        {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
                                    </div>

                                    {/* --- CHECKBOX --- */}
                                    <div className="flex items-center space-x-3 pt-2">
                                        <Checkbox 
                                            id="terms" 
                                            name="terms"
                                            className="w-6 h-6 border-2 border-gray-300 rounded text-blue-600"
                                        />
                                        <Label htmlFor="terms" className="text-base text-gray-500 font-medium">
                                            Saya setuju dengan semua ketentuan yang berlaku
                                        </Label>
                                    </div>

                                    {/* --- BUTTON --- */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full !py-7 !h-auto mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="h-6 w-6 text-white mr-2" />
                                                Loading...
                                            </>
                                        ) : (
                                            'Daftar'
                                        )}
                                    </Button>

                                    {/* --- LINK LOGIN --- */}
                                    <div className="text-center mt-6">
                                        <span className="text-gray-500 font-medium">Sudah punya akun? </span>
                                        <TextLink 
                                            href={login()} 
                                            className="font-bold text-blue-600 hover:text-blue-800"
                                        >
                                            Masuk
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}