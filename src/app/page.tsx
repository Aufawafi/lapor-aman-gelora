'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '@/lib/firebase';       
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ShieldAlert, MessageCircle, Zap, ArrowRight, CheckCircle, UserPlus, FileText, Lock, X, LogIn } from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // --- LOGIC: Cek Status Login & Role ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Simpan state user

        // Cek Role di Database
        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                
                // JIKA ADMIN/GURU -> REDIRECT KE DASHBOARD ADMIN
                if (role === 'admin' || role === 'guru') {
                    router.replace('/admin/dashboard');
                }
                // JIKA SISWA -> BIARIN DI BERANDA
            }
        } catch (error) {
            console.error("Gagal cek role:", error);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Handler saat tombol Lapor diklik
  const handleLaporClick = () => {
    if (user) {
      // Jika sudah login (sebagai siswa), langsung ke halaman lapor
      router.push('/lapor');
    } else {
      // Jika belum, tampilkan modal
      setShowLoginModal(true);
    }
  };


  // Variabel Animasi
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans overflow-x-hidden">
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <div className="relative w-full min-h-[90vh] flex items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
                    
                    {/* Hero Text */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="lg:w-1/2 text-center lg:text-left">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-blue-100 text-orange-500 text-sm font-semibold mb-6 shadow-sm">
                            <ShieldAlert size={16} className="text-orange-500" />
                            <span>Sekolah Aman Tanpa Perundungan</span>
                        </motion.div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6 tracking-tight">
                            Suarakan Kebenaran, <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-500">Hentikan Perundungan</span>
                        </h1>
                        
                        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Jangan biarkan rasa takut membungkammu. Laporkan segala bentuk perundungan dengan aman, rahasia, dan mudah melalui platform digital SMP Gelora.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button 
                                    onClick={handleLaporClick}
                                    className="inline-flex w-full sm:w-auto items-center justify-center bg-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all group">
                                    Lapor Sekarang
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Link href="/tentang-kami" className="inline-flex w-full sm:w-auto items-center justify-center bg-white text-gray-600 font-bold py-4 px-8 rounded-xl text-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300  hover:text-gray-800 transition-all shadow-sm">
                                 Pelajari Lebih Lanjut
                               </Link>
                            </motion.div>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>100% Aman</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Respon 24 Jam</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Terpercaya</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={scaleIn}
                        className="lg:w-1/2 w-full flex justify-center relative">
                        <div className="relative w-full max-w-lg">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-100 to-orange-50 rounded-[3rem] transform rotate-6 scale-95 z-0"></div>
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                <Image 
                                    src="/StopPerundungan.png" 
                                    alt="Ilustrasi Stop Perundungan" 
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Wave Separator */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg className="relative block w-full h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>
        </div>

        {/* --- 2. CARA KERJA --- */}
        <section className="py-20 bg-white relative border-b border-gray-100">
             <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-bold text-orange-500 uppercase tracking-wider mb-2">Alur Laporan</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Bagaimana Cara Kerjanya?</h3>
                    <p className="text-lg text-gray-600">Tiga langkah mudah untuk menciptakan perubahan positif.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                     {/* Garis Penghubung (Desktop Only) */}
                     <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gray-200 -z-0"></div>

                     {/* Step 1 */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="relative z-10 text-center group"
                     >
                        <div className="w-24 h-24 mx-auto bg-white border-4 border-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-200 transition-colors">
                            <UserPlus size={36} className="text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">1. Masuk Akun</h4>
                        <p className="text-gray-600 text-sm px-4 leading-relaxed">Login menggunakan akun siswa Anda untuk mengakses formulir pelaporan yang aman.</p>
                     </motion.div>

                     {/* Step 2 */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                        className="relative z-10 text-center group"
                     >
                        <div className="w-24 h-24 mx-auto bg-white border-4 border-orange-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:border-orange-200 transition-colors">
                            <FileText size={36} className="text-orange-500" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">2. Kirim Laporan</h4>
                        <p className="text-gray-600 text-sm px-4 leading-relaxed">Isi detail kejadian, lokasi, dan sertakan bukti foto jika ada. Identitas Anda aman.</p>
                     </motion.div>

                     {/* Step 3 */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                        className="relative z-10 text-center group"
                     >
                        <div className="w-24 h-24 mx-auto bg-white border-4 border-green-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:border-green-200 transition-colors">
                            <CheckCircle size={36} className="text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">3. Pantau Proses</h4>
                        <p className="text-gray-600 text-sm px-4 leading-relaxed">Pantau status laporan di dashboard dan dapatkan notifikasi tindak lanjut dari sekolah.</p>
                     </motion.div>
                </div>
            </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-base font-bold text-orange-500 uppercase tracking-wider mb-2">Kenapa Lapor Aman?</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">Platform Pelaporan Modern untuk Sekolah Masa Depan</h3>
                    <p className="text-lg text-gray-600">
                        Kami menghadirkan solusi teknologi untuk menciptakan lingkungan sekolah yang lebih aman, transparan, dan mendukung pertumbuhan siswa.
                    </p>
                </motion.div>
                
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {/* Feature 1 */}
                    <motion.div 
                        variants={fadeInUp}
                        className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <ShieldAlert size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-3">Kerahasiaan Terjamin</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Identitas pelapor dienkripsi dan hanya dapat diakses oleh pihak berwenang. Melapor tanpa rasa takut adalah hak setiap siswa.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div 
                        variants={fadeInUp}
                        className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <MessageCircle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-3">Respon Cepat & Tanggap</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Tim BK dan Admin Sekolah akan menerima notifikasi instan setiap ada laporan masuk, memastikan penanganan yang cepat dan tepat.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div 
                        variants={fadeInUp}
                        className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <Zap size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-3">Mudah Digunakan</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Antarmuka yang ramah pengguna, dapat diakses dari HP maupun Laptop. Melapor semudah mengirim pesan chat.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-10 bg-[#F8FAFC]">
            <div className="container mx-auto px-6">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl"
                >
                    {/* Background Patterns */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10"></div>
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                            Mari Ciptakan Lingkungan <span className="text-orange-500"> Sekolah yang Lebih Baik</span>
                        </h2>
                        <p className="text-gray-600 mb-10 leading-relaxed">
                            Perubahan dimulai dari satu langkah kecil. Jangan biarkan perundungan terjadi di sekitar kita. Jadilah pahlawan bagi temanmu.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/siswa/daftar" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-400 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-1">
                                Daftar Sekarang
                            </Link>
                            <Link href="/faq" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-400 transition transform hover:-translate-y-1">
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
      </main>
      
      {/* --- MODAL LOGIN (POP UP) - OPTIMIZED --- */}
      <AnimatePresence>
         {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-6">
            
            {/* OPTIMASI 1: Backdrop Gelap Solid (HAPUS backdrop-blur-sm, GANTI bg-black/60) */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60"
            ></motion.div>
            
            {/* OPTIMASI 2: Kontainer Modal (HAPUS bg-white/80, GANTI bg-white SOLID) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 overflow-hidden border border-gray-100"
            >
              <button 
                 onClick={() => setShowLoginModal(false)}
                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                 <X size={20} />
              </button>

              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-blue-100">
                   <Lock size={32} />
                 </div>
                
                 <h3 className="text-xl font-bold text-gray-800 mb-2">Akses Terbatas</h3>
                 <p className="text-sm text-gray-600 mb-8 leading-relaxed px-2">
                   Untuk menjaga kerahasiaan dan keamanan data, Anda harus <strong>Login</strong> atau <strong>Daftar</strong> terlebih dahulu sebelum membuat laporan.
                 </p>
                
                 <div className="flex flex-col gap-3">
                   <Link href="/siswa/login" className="w-full py-3.5 px-4 bg-blue-300 text-white rounded-xl font-bold text-sm hover:bg-blue-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                     <LogIn size={18} />
                     Login Siswa
                   </Link>
                   <Link href="/siswa/daftar" className="w-full py-3.5 px-4 bg-white text-blue-300 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-100 hover:text-blue-400 transition-colors">
                     Daftar Akun Baru
                   </Link>
                  </div>
              </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}