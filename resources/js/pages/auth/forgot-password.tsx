import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner'; // Pastikan import Spinner benar
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react'; // Gunakan Link untuk navigasi internal
import { Mail, ArrowLeft } from 'lucide-react'; // Icon Mail & ArrowLeft

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Kata Sandi" />

            <div className="min-h-screen w-full flex bg-white">
                
                {/* --- BAGIAN KIRI: GAMBAR BACKGROUND --- */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                     {/* Gambar konsisten dengan halaman Login/Register */}
                     <img 
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1480&q=80p" 
                        alt="Car Wash Detail" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                </div>

                {/* --- BAGIAN KANAN: FORM --- */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-white relative">
                    
                    {/* Logo Mobile */}
                    <div className="lg:hidden absolute top-8 left-8 text-2xl font-extrabold tracking-tighter text-[#0F172A]">
                        Easy<span className="text-blue-600">Wash</span>
                    </div>

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-left mb-8">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                Lupa Kata Sandi?
                            </h2>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                Jangan khawatir. Masukkan email Anda di bawah ini dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.
                            </p>
                        </div>

                        {/* Status Message (Jika sukses kirim email) */}
                        {status && (
                            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <Form 
                            {...email.form()}
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
                                                    autoComplete="off"
                                                    autoFocus
                                                    placeholder="Masukan Email"
                                                    // STYLE IDENTIK DENGAN REGISTER/LOGIN
                                                    className="bg-white pl-4 pr-12 py-7 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                                {/* Icon Mail */}
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    {/* --- BUTTON KIRIM --- */}
                                    <Button
                                        className="w-full py-7 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-200 transform active:scale-95 text-lg"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing && (
                                            <Spinner className="mr-2 h-5 w-5 text-white" />
                                        )}
                                        Kirim Tautan Reset
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* --- FOOTER LINK (KEMBALI KE LOGIN) --- */}
                        <div className="text-center mt-8">
                            <Link 
                                href={login()} 
                                className="inline-flex items-center justify-center text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                Kembali ke Masuk
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}