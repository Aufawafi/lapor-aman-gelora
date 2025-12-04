'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Loader2, User, Mail, Lock, BookOpen, UserPlus, 
  School, ShieldCheck, UserRound, UserRoundCheck, Hash, Eye, EyeOff
} from 'lucide-react';

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [nis, setNis] = useState(''); 
  const [gender, setGender] = useState(''); 
  const [kelas, setKelas] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!gender) {
        setError('Mohon pilih jenis kelamin.');
        setLoading(false);
        return;
    }

    try {
      // 1. Buat Akun Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Display Name di Auth
      await updateProfile(user, { displayName: nama });

      // 3. Simpan Data Lengkap di Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nama: nama,
        nis: nis || null, 
        gender: gender,
        kelas: kelas,
        email: email,
        role: "siswa",
        stats_dibatalkan: 0,
        createdAt: serverTimestamp()
      });

      router.push('/siswa/login'); 
    } catch (err: any) {
      console.error("Register Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar. Silakan login.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kata sandi terlalu lemah (minimal 6 karakter).');
      } else {
        setError('Gagal mendaftar. Periksa koneksi atau coba lagi nanti.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans py-8 relative overflow-hidden">
      
      {/* BACKGROUND IMAGE - OPTIMIZED */}
      <div className="absolute inset-0 z-0">
          <Image 
              src="/smp gelora.png" 
              alt="Gedung SMP Gelora" 
              fill
              sizes="100vw" 
              className="object-cover object-center"
              priority
            />
          <div className="absolute inset-0 bg-blue-900/10"></div>
      </div>
      <div className="w-full max-w-5xl bg-white/95 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row border border-white relative z-10">
        
        {/* BAGIAN KIRI (VISUAL) */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-300 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px] md:min-h-full">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/30 rounded-full blur-2xl"></div>
             <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>

             <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-[2rem] p-4 mb-6 shadow-lg shadow-blue-900/5 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image 
                            src="/LOGO-sekolahGHAMA.png" 
                            alt="Logo Sekolah" 
                            fill 
                            sizes="(max-width: 768px) 150px, 200px" 
                            className="object-contain" 
                            priority 
                        />
                    </div>
                </div>
                
                <h2 className="text-gray-800 text-2xl md:text-3xl font-extrabold mb-3">Gabung Bersama <span className="text-orange-500">Kami!</span></h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 font-medium">
                    Buat akun untuk mulai melaporkan kejadian perundungan dan menciptakan lingkungan sekolah yang lebih aman.
                </p>
                
                <div className="grid grid-cols-1 gap-3 w-full max-w-xs text-left">
                    <div className="flex items-center gap-3 bg-white/60 p-3.5 rounded-2xl text-sm border border-white/50 transition hover:bg-white/80 cursor-default shadow-sm">
                        <div className="p-1.5 bg-orange-100 rounded-lg text-orange-500"><School size={16} /></div>
                        <span className="text-gray-600 font-bold text-xs uppercase tracking-wide">Terhubung Dengan Sekolah</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/60 p-3.5 rounded-2xl text-sm border border-white/50 transition hover:bg-white/80 cursor-default shadow-sm">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><ShieldCheck size={16} /></div>
                        <span className="text-gray-600 font-bold text-xs uppercase tracking-wide">Data Terlindungi</span>
                    </div>
                </div>
             </div>
        </div>

        {/* BAGIAN KANAN (FORMULIR) */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Daftar Akun <span className="text-orange-500">Siswa</span></h1>
                <p className="text-sm text-gray-500 mt-2 font-medium">Lengkapi data diri Anda dengan benar.</p>
            </div>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-start animate-pulse shadow-sm" role="alert">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Nama Lengkap */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Nama Lengkap</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                            placeholder="Contoh: Budi Santoso"
                            required
                            suppressHydrationWarning/>
                    </div>
                </div>

                {/* Grid: NIS & Kelas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* NIS (Opsional) */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">NIS <span className="text-gray-400 normal-case font-normal">(Opsional)</span></label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Hash size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="number" 
                                value={nis}
                                onChange={(e) => setNis(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                                placeholder="123456"
                                suppressHydrationWarning/>
                        </div>
                    </div>

                    {/* Kelas */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Kelas</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <BookOpen size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                value={kelas}
                                onChange={(e) => setKelas(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                                placeholder="Contoh: IX-A"
                                required
                                suppressHydrationWarning/>
                        </div>
                    </div>
                </div>

                {/* Gender Selection */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Jenis Kelamin</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setGender('Laki-laki')}
                            className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2
                                ${gender === 'Laki-laki' 
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-200 shadow-sm' 
                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300'
                                }`}
                            suppressHydrationWarning>
                            {gender === 'Laki-laki' ? <UserRoundCheck size={18}/> : <UserRound size={18}/>}
                            <span>Laki-laki</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setGender('Perempuan')}
                            className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2
                                ${gender === 'Perempuan' 
                                    ? 'bg-pink-50 border-pink-500 text-pink-700 ring-1 ring-pink-200 shadow-sm' 
                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300'
                                }`}
                            suppressHydrationWarning>
                            {gender === 'Perempuan' ? <UserRoundCheck size={18}/> : <UserRound size={18}/>}
                            <span>Perempuan</span>
                        </button>
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                            placeholder="nama@email.com"
                            required
                            suppressHydrationWarning/>
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Kata Sandi</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors"/>
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                            placeholder="Minimal 6 karakter"
                            required
                            suppressHydrationWarning/>
                        {/* Tombol Toggle Password */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-600 transition-colors focus:outline-none">
                            {   showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] hover:from-blue-400 hover:to-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all transform flex justify-center items-center gap-2 mt-2 ${loading ? 'opacity-70 cursor-not-allowed scale-100' : ''}`}>
                    {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Mendaftarkan...</span>
                    </>
                    ) : (
                    <>
                        <UserPlus size={20} />
                        <span>Buat Akun Sekarang</span>
                    </>
                    )}
                </button>
            </form>
            <div className="mt-4 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 font-medium">
                Sudah punya akun? <Link href="/siswa/login" className="text-blue-300 hover:text-blue-500 font-bold hover:underline transition ml-1">Login di sini</Link>
            </div>
        </div>
      </div>
    </div>
  );
}