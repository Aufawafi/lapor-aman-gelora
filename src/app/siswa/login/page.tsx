'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; 
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, LogIn, Mail, Lock, School, ShieldCheck, X, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // --- State Reset Password ---
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  
  // --- State Timer Kirim Ulang ---
  const [cooldown, setCooldown] = useState(0); 

  const router = useRouter();

  // Efek Timer Mundur untuk Reset Password
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  // Handler Login 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Login ke Firebase Auth (Cek Email & Password)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Cek Role di Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Validasi Role: Harus 'siswa'
        if (userData.role !== 'siswa') {
           // Jika Admin/Guru coba login di sini -> TENDANG KELUAR
           await signOut(auth); 
           setError('Akses Ditolak: Akun ini bukan akun Siswa. Silakan login di halaman Admin.');
           setLoading(false);
           return;
        }

        // Jika Valid Siswa -> Masuk Dashboard
        router.push('/siswa/dashboard'); 
      } else {
        // Kasus langka: User ada di Auth tapi data di Firestore hilang
        setError('Data pengguna tidak ditemukan. Hubungi admin.');
        setLoading(false);
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      // Error handling bawaan Firebase
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email atau kata sandi salah. Silakan cek kembali.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan login gagal. Tunggu beberapa saat.');
      } else {
        setError('Gagal masuk. Periksa koneksi internet Anda.');
      }
      setLoading(false);
    }
  };

  // Handler Reset Password (API Custom)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return; 

    setResetLoading(true);
    setResetMessage(null);
    setResetError(null);

    if (!resetEmail) {
        setResetError("Mohon masukkan email Anda.");
        setResetLoading(false);
        return;
    }

    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmail }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Gagal mengirim email.');
        
        setResetMessage("Link reset telah dikirim! Cek Inbox email Anda.");
        setCooldown(60); 
    } catch (err: any) {
        setResetError(err.message || "Terjadi kesalahan. Coba lagi nanti.");
    }
    setResetLoading(false);
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

      {/* Container Utama */}
      <div className="w-full max-w-5xl bg-white/95 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row border border-white relative z-10">
        
        {/* BAGIAN KIRI (VISUAL) */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-300 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px] md:min-h-full">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/30 rounded-full blur-2xl"></div>
             <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl"></div>

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
                
                <h2 className="text-gray-800 text-2xl md:text-3xl font-extrabold mb-3">Selamat <span className="text-orange-500">Datang!</span></h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 font-medium">
                    Silakan masuk untuk mengakses dashboard laporan dan memantau status pengaduan Anda.
                </p>
                
                <div className="grid grid-cols-1 gap-3 w-full max-w-xs text-left">
                    <div className="flex items-center gap-3 bg-white/60 p-3.5 rounded-2xl text-sm border border-white/50 transition hover:bg-white/80 cursor-default shadow-sm">
                        <div className="p-1.5 bg-orange-100 rounded-lg text-orange-500"><School size={16} /></div>
                        <span className="text-gray-600 font-bold text-xs uppercase tracking-wide">Lingkungan Aman</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/60 p-3.5 rounded-2xl text-sm border border-white/50 transition hover:bg-white/80 cursor-default shadow-sm">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><ShieldCheck size={16} /></div>
                        <span className="text-gray-600 font-bold text-xs uppercase tracking-wide">Laporan Rahasia</span>
                    </div>
                </div>
             </div>
        </div>

        {/* BAGIAN KANAN (FORMULIR) */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Masuk Akun <span className="text-orange-500">Siswa</span></h1>
                <p className="text-sm text-gray-500 mt-2 font-medium">Masukkan email dan kata sandi yang terdaftar.</p>
            </div>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-start animate-pulse shadow-sm" role="alert">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                            placeholder="nama@email.com"
                            required
                            suppressHydrationWarning
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Kata Sandi</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors"/>
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all text-gray-800 text-sm placeholder-gray-400 font-medium"
                            placeholder="Masukkan kata sandi"
                            required
                            suppressHydrationWarning/>
                        {/* Tombol Toggle Password */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-600 transition-colors focus:outline-none">
                            { showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {/* Link Lupa Password */}
                    <div className="text-right mt-1">
                        <button 
                            type="button"
                            onClick={() => setShowResetModal(true)}
                            className="text-xs text-orange-500 hover:text-orange-800 hover:underline font-bold transition bg-transparent border-none cursor-pointer">
                            Lupa kata sandi?
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] hover:from-blue-400 hover:to-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all transform flex justify-center items-center gap-2 mt-2 ${loading ? 'opacity-70 cursor-not-allowed scale-100' : ''}`}>
                    {loading ? (
                        <> <Loader2 className="animate-spin" size={20} /> <span>Memproses...</span> </>
                    ) : (
                        <> <LogIn size={20} /> <span>Masuk Sekarang</span> </>
                    )}
                </button>
            </form>

            <div className="mt-4 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 font-medium">
                Belum punya akun? <Link href="/siswa/daftar" className="text-blue-300 hover:text-blue-500 font-bold hover:underline transition ml-1">Daftar di sini</Link>
            </div>
        </div>
      </div>

      {/* --- MODAL RESET PASSWORD (OPTIMIZED) --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 relative">
                
                <button 
                    onClick={() => setShowResetModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100">
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Reset Kata Sandi</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mereset kata sandi Anda.
                    </p>
                </div>

                {resetMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm text-center font-medium">
                        {resetMessage}
                    </div>
                )}

                {resetError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm text-center font-medium">
                        {resetError}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 ml-1">Email Anda</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400"/>
                             </div>
                             <input 
                                type="email" 
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-800 text-sm disabled:bg-gray-100 disabled:text-gray-500 font-medium"
                                placeholder="nama@email.com"
                                required
                                disabled={resetLoading || cooldown > 0}
                                suppressHydrationWarning
                             />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={resetLoading || cooldown > 0}
                        className={`w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-800 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 ${resetLoading || cooldown > 0 ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {resetLoading ? (
                             <> <Loader2 className="animate-spin" size={18} /> <span>Mengirim Link...</span> </>
                        ) : cooldown > 0 ? (
                             <> <RefreshCw className="animate-spin-slow" size={18} /> <span>Kirim Ulang ({cooldown}s)</span> </>
                        ) : (
                             'Kirim Link Reset'
                        )}
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}