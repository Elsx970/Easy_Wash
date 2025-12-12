import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';

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

            <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 to-white">
                
                {/* --- BAGIAN KIRI: GAMBAR BACKGROUND --- */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
                     <img 
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1480&q=80" 
                        alt="Car Wash Soap Detail" 
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-blue-700/30 to-transparent"></div>
                    
                    {/* Content di kiri */}
                    <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
                        <div className="text-5xl font-extrabold mb-6 tracking-tight">
                            Selamat<br/>Datang<br/>Kembali!
                        </div>
                        <p className="text-lg text-blue-100 mb-8 max-w-md">
                            Masuk ke akun Anda untuk melanjutkan layanan pencucian kendaraan terbaik.
                        </p>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: FORM LOGIN --- */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 lg:py-24 lg:px-12 bg-white relative">
                    
                    {/* Logo Mobile */}
                    <div className="lg:hidden absolute top-8 left-8 text-2xl font-extrabold tracking-tighter">
                        <span className="text-[#0F172A]">Easy</span><span className="text-blue-600">Wash</span>
                    </div>

                    <div className="w-full max-w-2xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Masuk</h1>
                            <p className="text-gray-600 text-sm">Gunakan email dan kata sandi Anda untuk masuk</p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-8"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* --- INPUT EMAIL --- */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-semibold text-gray-800 text-sm">Email</Label>
                                        <div className="relative group">
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="nama@email.com"
                                                className="w-full pl-9 pr-4 py-4 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        {errors.email && <InputError message={errors.email} />}
                                    </div>

                                    {/* --- INPUT PASSWORD --- */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="font-semibold text-gray-800 text-sm">Kata Sandi</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    Lupa kata sandi?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Masukan kata sandi Anda"
                                                className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        {errors.password && <InputError message={errors.password} />}
                                    </div>

                                    {/* --- REMEMBER ME --- */}
                                    <div className="flex items-center space-x-3">
                                        <Checkbox 
                                            id="remember" 
                                            name="remember"
                                            className="w-5 h-5 border-gray-300 text-blue-600 rounded"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer font-medium">
                                            Ingat saya di perangkat ini
                                        </Label>
                                    </div>

                                    {/* --- BUTTON MASUK --- */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="h-4 w-4 text-white" />
                                                Sedang masuk...
                                            </>
                                        ) : (
                                            'Masuk'
                                        )}
                                    </Button>

                                    {/* --- FOOTER LINK --- */}
                                    {canRegister && (
                                        <div className="text-center text-sm text-gray-600 mt-8 pt-0">
                                            Belum punya akun?{' '}
                                            <TextLink 
                                                href={register()} 
                                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Daftar di sini
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