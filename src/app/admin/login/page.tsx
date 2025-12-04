'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut, AuthError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore'; 
import Image from 'next/image';
import { Lock, Loader2, Mail, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        if (userData.role !== 'admin' && userData.role !== 'guru') {
           await signOut(auth); 
           setError('Akses Ditolak: Akun ini adalah akun Siswa. Silakan login di halaman Siswa.');
           setLoading(false);
           return; 
        }

        router.push('/admin/dashboard'); 
      } else {
        await signOut(auth);
        setError('Data pengguna tidak ditemukan. Hubungi IT Support.');
        setLoading(false);
      }

    } catch (err) {
      const error = err as AuthError;
      console.error("Login Error:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Email atau kata sandi salah.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan login gagal. Silakan coba lagi nanti.');
      } else {
        setError('Terjadi kesalahan saat login. Periksa koneksi internet Anda.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
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

        <div className="absolute inset-0 bg-slate-900/40"></div>
      </div>

      {/* Container Utama */}
      <div className="w-full max-w-5xl bg-white/95 rounded-[2.5rem] shadow-2xl shadow-slate-900/30 overflow-hidden flex flex-col md:flex-row border border-white/50 relative z-10">
        
        {/* BAGIAN KIRI (VISUAL) */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 p-8 md:p-12 flex flex-col justify-center items-center text-center text-white relative overflow-hidden min-h-[300px] md:min-h-full">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
             <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-[2rem] p-4 mb-6 shadow-lg shadow-black/20 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image 
                            src="/LOGO-sekolahGHAMA.png" 
                            alt="Logo Sekolah Ghama" 
                            fill 
                            sizes="(max-width: 768px) 150px, 200px"
                            className="object-contain" 
                            priority 
                        />
                    </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
                    Portal <span className="text-orange-500">Admin</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium">
                    Kelola laporan siswa, tinjau kasus, dan pantau keamanan sekolah melalui dashboard terintegrasi.
                </p>
                <div className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl text-xs font-bold border border-white/10 shadow-sm tracking-wide uppercase">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span>Akses Terbatas</span>
                </div>
             </div>
        </div>

        {/* BAGIAN KANAN (FORMULIR) */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Login <span className="text-slate-600">Staff</span></h1>
                <p className="text-sm text-gray-600 mt-2 font-medium">Silakan masuk dengan akun Guru atau BK Anda.</p>
            </div>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-start animate-pulse shadow-sm" role="alert">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1" htmlFor="email">Email Sekolah</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <Mail size={18} className="text-gray-400 group-focus-within:text-slate-600 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                            placeholder="admin@smpgelora.sch.id"
                            required
                            suppressHydrationWarning
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1 mb-1">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Kata Sandi</label>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <Lock size={18} className="text-gray-400 group-focus-within:text-slate-600 transition-colors" />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                            placeholder="••••••••"
                            required
                            suppressHydrationWarning/>
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-600 transition-colors focus:outline-none">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-slate-500/20 hover:shadow-slate-500/30 hover:scale-[1.01] hover:from-slate-800 hover:to-black focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all transform flex justify-center items-center gap-2 mt-2 ${loading ? 'opacity-70 cursor-not-allowed scale-100' : ''}`}>
                    {loading ? (
                    <> <Loader2 className="animate-spin" size={20} /> <span>Memverifikasi...</span> </>
                    ) : (
                    <> <LogIn size={20} /> <span>Masuk Dashboard</span> </>
                    )}
                </button>
            </form>
            
            <div className="mt-4 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 font-medium">
                Bukan Admin? <Link href="/siswa/login" className="text-slate-600 hover:text-black font-bold hover:underline transition ml-1">Login Siswa</Link>
            </div>
        </div>
      </div>
    </div>
  );
}