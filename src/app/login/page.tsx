'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, ShieldCheck, ChevronRight, School, Lock } from 'lucide-react';

export default function LoginPage() {
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
        {/* Overlay warna solid ringan menggantikan blur berat */}
        <div className="absolute inset-0 bg-blue-900/20"></div>
      </div>
      
      {/* CONTAINER UTAMA */}
      <div className="w-full max-w-5xl bg-white/95 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 overflow-hidden flex flex-col md:flex-row border border-white relative z-10">
        
        {/* BAGIAN KIRI (VISUAL/BRANDING) */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-300 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px] md:min-h-full">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* Aksen Dekoratif */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/40 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Statis */}
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-[2rem] p-4 mb-6 shadow-lg shadow-blue-900/5 flex items-center justify-center">
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
                
                <h1 className="text-3xl font-extrabold tracking-tight mb-3">
                    <span className="text-gray-800">LAPOR </span><span className="text-orange-500">AMAN</span>
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-xs font-medium">
                    Platform pelaporan perundungan yang aman dan terpercaya untuk lingkungan sekolah yang lebih baik.
                </p>

                <div className="grid grid-cols-1 gap-3 w-full max-w-xs text-left">
                    <div className="flex items-center gap-3 bg-white/60 p-3.5 rounded-2xl text-sm border border-white/50 transition hover:bg-white/80 cursor-default shadow-sm">
                        <div className="p-1.5 bg-orange-100 rounded-lg text-orange-500"><School size={16} /></div>
                        <span className="text-gray-600 font-bold text-xs uppercase tracking-wide">SMP Gelora</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/60 p-3.5 rounded-2xl text-sm border border-white/50 transition hover:bg-white/80 cursor-default shadow-sm">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><ShieldCheck size={16} /></div>
                        <span className="text-gray-600 font-bold text-xs uppercase tracking-wide">Aman & Rahasia</span>
                    </div>
                </div>
            </div>
        </div>

        {/* BAGIAN KANAN (PILIHAN LOGIN) */}
        <div className="md:w-7/12 p-8 md:p-16 bg-white flex flex-col justify-center">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800">Pilih Akses Masuk</h2>
                <p className="text-sm text-gray-600 mt-2 font-medium">Silakan pilih peran Anda untuk melanjutkan.</p>
            </div>

            <div className="space-y-4">
                
                {/* Tombol Login Siswa */}
                <Link 
                    href="/siswa/login" 
                    className="group relative block w-full bg-white border border-gray-200 hover:border-blue-500 p-1 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-4 flex items-center justify-between rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                <User size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-blue-400 group-hover:text-blue-500 transition-colors text-lg">Login Siswa</h3>
                                <p className="text-xs text-gray-400 font-medium group-hover:text-blue-600/80">Melapor & Cek Status</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-white group-hover:text-blue-500 group-hover:translate-x-1 transition-all shadow-sm">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </Link>

                {/* Tombol Login Admin */}
                <Link 
                    href="/admin/login" 
                    className="group relative block w-full bg-white border border-gray-200 hover:border-gray-500 p-1 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-4 flex items-center justify-between rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-all duration-300 shadow-sm">
                                <Lock size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-600 group-hover:text-gray-800 transition-colors text-lg">Login Admin</h3>
                                <p className="text-xs text-gray-400 font-medium group-hover:text-indigo-600/80">Guru & Petugas BK</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-white group-hover:text-gray-800 group-hover:translate-x-1 transition-all shadow-sm">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-4 text-center pt-6 border-t border-gray-200">
                <Link href="/" className="text-sm font-bold text-gray-400 hover:text-orange-500 transition flex items-center justify-center gap-2 group">
                    <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span> Kembali ke Beranda
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}