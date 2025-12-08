import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox'; // Diperlukan untuk "Remember me"
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react'; // Icon yang dibutuhkan

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <>
            <Head title="Masuk" />

            <div className="min-h-screen w-full flex bg-white">
                
                {/* --- BAGIAN KIRI: GAMBAR BACKGROUND --- */}
                {/* Menggunakan gambar & overlay yang sama persis dengan Register agar konsisten */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                     <img 
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1480&q=80" 
                        alt="Car Wash Soap Detail" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                </div>

                {/* --- BAGIAN KANAN: FORM LOGIN --- */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-white relative">
                    
                    {/* Logo Mobile */}
                    <div className="lg:hidden absolute top-8 left-8 text-2xl font-extrabold tracking-tighter text-[#0F172A]">
                        Easy<span className="text-blue-600">Wash</span>
                    </div>

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-left mb-8">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                Masuk
                            </h2>
                             <p className="mt-2 text-sm text-gray-500">Selamat datang kembali!</p> 
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="mt-8 space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-5">
                                        
                                        {/* --- INPUT EMAIL --- */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="font-bold text-gray-800 text-sm">Email</Label>
                                            <div className="relative">
                                                 <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="Masukan Email"
                
                                                    className="bg-blue pl-4 pr-12 py-7 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* --- INPUT PASSWORD --- */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="font-bold text-gray-800 text-sm">Kata Sandi</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                                        tabIndex={4}
                                                    >
                                                        Lupa kata sandi?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Masukan Kata Sandi"
                                                    // STYLE SAMA PERSIS DENGAN REGISTER
                                                    className="bg-white pl-4 pr-12 py-7 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                                     <Lock className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>
                                    </div>

                                    {/* --- REMEMBER ME CHECKBOX --- */}
                                    <div className="flex items-center space-x-2 mt-4">
                                        <Checkbox 
                                            id="remember" 
                                            name="remember"
                                            className="border-gray-300 text-blue-600 focus:ring-blue-600 rounded" 
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember" className="text-sm font-medium text-gray-500 cursor-pointer">
                                            Ingat saya
                                        </Label>
                                    </div>

                                    {/* --- TOMBOL MASUK --- */}
                                    <Button
                                        type="submit"
                                        className="w-full py-7 mt-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-200 transform active:scale-95 text-lg"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner className="mr-2 h-5 w-5 text-white" />}
                                        Masuk
                                    </Button>

                                    {/* --- FOOTER LINK --- */}
                                    {canRegister && (
                                        <div className="text-center text-sm text-gray-500 mt-1">
                                            Tidak Punya Akun?{' '}
                                            <TextLink href={register()} tabIndex={5} className="font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-600/30 hover:decoration-blue-800">
                                                Daftar
                                            </TextLink>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}