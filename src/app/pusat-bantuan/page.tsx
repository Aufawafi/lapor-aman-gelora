'use client';

import Link from 'next/link';
import { Mail, MapPin, MessageCircle, AlertTriangle, LifeBuoy, Clock, ChevronRight, UserCheck, HeartHandshake } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function BantuanPage() {
  // Variabel Animasi
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
        
      {/* --- HERO SECTION --- */}
      <div className="relative w-full bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 pt-16 pb-22 lg:pb-24 rounded-b-[40px] lg:rounded-b-[60px] shadow-lg overflow-hidden mb-16">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         
         <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl"></div>

         <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-inner border border-white/20 text-white">
                <LifeBuoy size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Pusat <span className="text-gray-800">Bantuan</span>
              </h1>
              <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed font-medium">
                Butuh bantuan lebih lanjut atau keadaan darurat? Tim kami siap mendengarkan dan membantu Anda kapan saja.
              </p>
            </motion.div>
         </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* 1. Kartu Kontak Utama (Hanya 2 Kolom: Email & Lokasi) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          // UPDATE: Mengubah grid menjadi 2 kolom dan membatasi lebar agar rapi di tengah
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto"
        >
          {/* Kartu Email */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 text-center group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border border-orange-100">
              <Mail size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email Resmi</h3>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-6 bg-gray-100 py-1 px-3 rounded-full inline-flex">
                <Clock size={14} /> <span>Respon dalam 1x24 Jam</span>
            </div>
            <a href="mailto:bk.smpgelora@gmail.com" className="text-lg font-bold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 py-3 px-6 rounded-xl block w-full transition-colors border border-orange-100 border-dashed truncate">
                gelora1984@gmail.com
            </a>
          </motion.div>

          {/* Kartu Lokasi */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 text-center group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border border-blue-100">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ruang BK</h3>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-6 bg-gray-100 py-1 px-3 rounded-full inline-flex">
                <UserCheck size={14}/> <span>Konseling Tatap Muka</span>
            </div>
            <div className="text-lg font-bold text-blue-500 bg-blue-50 py-3 px-6 rounded-xl block w-full border border-blue-100 border-dashed">
                Gedung B, Lantai 2
            </div>
          </motion.div>
        </motion.div>

        {/* 2. Section FAQ Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-[2.5rem] p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-orange-900/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/30 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-3">Masih Bingung Caranya?</h2>
            <p className="text-white text-lg font-medium">Cek pertanyaan yang sering diajukan teman-temanmu di halaman FAQ.</p>
          </div>
          <Link href="/faq" className="relative z-10 bg-white text-gray-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 hover:text-gray-800 transition shadow-lg flex items-center gap-3 transform hover:-translate-y-1">
            <MessageCircle size={20} />
            Buka Halaman FAQ
          </Link>
        </motion.div>

        {/* 3. Section Darurat */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4, duration: 0.6 }}
           className="bg-red-50 border border-red-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 shadow-sm"
        >
           <div className="p-5 md:p-6 bg-white text-red-600 rounded-3xl shadow-sm border border-red-100 flex-shrink-0 animate-pulse">
             <AlertTriangle size={40} className="md:w-12 md:h-12" />
           </div>
           
           <div className="text-center md:text-left w-full">
             <h3 className="text-2xl font-extrabold text-red-700 mb-3">Keadaan Darurat?</h3>
             <p className="text-red-800/80 leading-relaxed text-sm md:text-lg mb-6">
               Jika Anda atau teman Anda dalam bahaya fisik, jangan menunggu balasan aplikasi. 
               Hubungi <strong>Layanan SAPA 129 (Kemenpppa)</strong> untuk perlindungan anak & perempuan atau layanan darurat nasional.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                 <a 
                    href="tel:112" 
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200 hover:-translate-y-1 transform"
                 >
                    Darurat (112) <ChevronRight size={20} />
                 </a>
                 <a 
                    href="https://wa.me/628111129129" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-50 transition shadow-sm hover:-translate-y-1 transform"
                 >
                    <HeartHandshake size={20} /> SAPA 129 (WA)
                 </a>
             </div>
           </div>
        </motion.div>

      </main>
    </div>
  );
}