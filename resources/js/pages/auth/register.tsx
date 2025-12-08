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
                
                {/* --- BAGIAN KIRI: GAMBAR BACKGROUND --- */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                     <img 
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1480&q=80" 
                        alt="Car Wash Soap Detail" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                </div>

                {/* --- BAGIAN KANAN: FORM REGISTER --- */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-white relative">
                    
                    {/* Logo Mobile */}
                    <div className="lg:hidden absolute top-8 left-8 text-2xl font-extrabold tracking-tighter text-[#0F172A]">
                        Easy<span className="text-blue-600">Wash</span>
                    </div>

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-left mb-8">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                Daftar
                            </h2>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="mt-8 space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-5">
                                        {/* --- INPUT NAMA --- */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="font-bold text-gray-800 text-sm">Nama</Label>
                                            <div className="relative">
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    placeholder="Masukan Nama"
                                                    // PERUBAHAN: py-6 (lebih lebar) & focus ring biru tegas
                                                    className="bg-white pl-4 pr-12 py-7 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-sm transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <InputError message={errors.name} />
                                        </div>

                                        {/* --- INPUT EMAIL --- */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="font-bold text-gray-800 text-sm">Email</Label>
                                            <div className="relative">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    placeholder="Masukan Email"
                                                    // PERUBAHAN: py-6 (lebih lebar) & focus ring biru tegas
                                                    className="bg-white pl-4 pr-12 py-7 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-sm transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* --- INPUT PASSWORD --- */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="font-bold text-gray-800 text-sm">Kata sandi</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    placeholder="Masukan Kata Sandi"
                                                    // PERUBAHAN: py-6 (lebih lebar) & focus ring biru tegas
                                                    className="bg-white pl-4 pr-12 py-7 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-sm transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* --- INPUT CONFIRM PASSWORD --- */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation" className="font-bold text-gray-800 text-sm">Konfirmasi Kata sandi</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    name="password_confirmation"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    placeholder="Konfirmasi Kata Sandi"
                                                    // PERUBAHAN: py-6 (lebih lebar) & focus ring biru tegas
                                                    className="bg-white pl-4 pr-12 py-7 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-sm transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    {/* --- CHECKBOX --- */}
                                    <div className="flex items-center space-x-2 mt-4">
                                        <Checkbox id="terms" className="border-gray-300 text-blue-600 focus:ring-blue-600 rounded" />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-500"
                                        >
                                            Saya setuju dengan semua ketentuan yang berlaku
                                        </label>
                                    </div>

                                    {/* --- BUTTON DAFTAR --- */}
                                    <Button
                                        type="submit"
                                        className="w-full py-7
                                         mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-200 transform active:scale-95 text-lg"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner className="mr-2 h-5 w-5 text-white" />}
                                        Daftar
                                    </Button>

                                    {/* --- FOOTER LINK --- */}
                                    <div className="text-center text-sm text-gray-500 mt-">
                                        Sudah punya akun?{' '}
                                        <TextLink href={login()} tabIndex={6} className="font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-600/30 hover:decoration-blue-800">
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