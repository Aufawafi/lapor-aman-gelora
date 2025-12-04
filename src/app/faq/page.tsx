'use client';

import { useState } from 'react';
import Link from 'next/link'; 
import { ChevronDown, HelpCircle, MessageCircle, Shield, Clock, UserCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data FAQ
const faqs = [
  {
    category: "Privasi & Keamanan",
    items: [
      {
        question: "Apakah identitas saya benar-benar aman?",
        answer: "Ya, 100% Aman. Sistem kami dirancang dengan enkripsi data. Identitas pelapor hanya dapat dilihat oleh Guru BK dan Admin Sekolah yang berwenang untuk keperluan penanganan kasus. Teman sekelas atau guru lain tidak memiliki akses ke data ini.",
        icon: Shield
      },
      {
        question: "Apakah saya bisa melapor jika saya hanya saksi?",
        answer: "Sangat bisa. Kami mendorong siswa untuk peduli (upstander). Jika Anda melihat teman Anda dirundung, silakan laporkan. Kami akan melindungi identitas Anda sebagai pelapor saksi.",
        icon: UserCheck
      }
    ]
  },
  {
    category: "Proses Pelaporan",
    items: [
      {
        question: "Apa yang terjadi setelah saya mengirim laporan?",
        answer: "Laporan Anda akan masuk ke dashboard Admin Sekolah (Guru BK). Tim penanganan akan memverifikasi kejadian, lalu menentukan langkah selanjutnya seperti pemanggilan untuk konseling tertutup atau mediasi, tergantung tingkat keparahan kasus.",
        icon: Activity
      },
      {
        question: "Bagaimana cara saya memantau status laporan?",
        answer: "Anda dapat login ke akun siswa Anda. Di halaman Dashboard, terdapat status real-time untuk setiap laporan Anda: 'Menunggu' (belum dibaca), 'Diproses' (sedang ditangani), atau 'Selesai' (kasus ditutup).",
        icon: MessageCircle
      },
      {
        question: "Berapa lama laporan saya akan diproses?",
        answer: "Kami berkomitmen merespons setiap laporan dalam waktu 1x24 jam pada hari kerja. Untuk kasus yang mendesak atau berbahaya, tindakan akan diambil sesegera mungkin setelah notifikasi diterima.",
        icon: Clock
      },
       {
        question: "Apakah saya bisa mengirim bukti foto atau video?",
        answer: "Ya, formulir kami mendukung unggah bukti foto/screenshot. Jika Anda memiliki bukti video, silakan simpan terlebih dahulu dan sebutkan di kolom deskripsi. Guru BK akan memintanya secara personal saat sesi konseling demi keamanan data.",
        icon: MessageCircle
      }
    ]
  },
  {
    category: "Lainnya",
    items: [
      {
        question: "Apakah kejadian di luar sekolah bisa dilaporkan?",
        answer: "Bisa. Selama kejadian tersebut melibatkan siswa aktif SMP Gelora Depok (baik sebagai korban maupun pelaku), sekolah memiliki tanggung jawab moral untuk membantu menyelesaikan masalah dan melindungi siswanya.",
        icon: HelpCircle
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0"); 

  const toggleFAQ = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 pt-16 pb-22 lg:pb-24 rounded-b-[40px] lg:rounded-b-[60px] shadow-lg overflow-hidden mb-16">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

         <div className="container mx-auto px-6 text-center relative z-10">
            <div>
              <div className="inline-flex items-center justify-center p-3 bg-white/30 rounded-2xl mb-6 shadow-sm border border-white/20 text-gray-600">
                <HelpCircle size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
                Pertanyaan <span className="text-orange-500">Umum</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Temukan jawaban lengkap seputar penggunaan aplikasi Lapor Aman, privasi, dan prosedur penanganan kasus di sini.
              </p>
            </div>
         </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="space-y-12">
            {faqs.map((section, sIndex) => (
                <div key={sIndex}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
                        <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                        {section.category}
                    </h3>

                    {/* FAQ Items */}
                    <div className="grid grid-cols-1 gap-4">
                        {section.items.map((faq, iIndex) => {
                            const currentIndex = `${sIndex}-${iIndex}`;
                            const isOpen = openIndex === currentIndex;
                            const Icon = faq.icon;

                            return (
                                <div 
                                    key={iIndex} 
                                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                                        isOpen 
                                        ? 'shadow-lg border-blue-200 ring-1 ring-blue-100' 
                                        : 'shadow-sm border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(currentIndex)}
                                        className="w-full flex justify-between items-center p-5 sm:p-6 text-left focus:outline-none group"
                                    >
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className={`p-3 rounded-xl transition-colors flex-shrink-0 hidden sm:flex ${
                                                isOpen ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                                            }`}>
                                                <Icon size={24} />
                                            </div>
                                            <span className={`font-bold text-base sm:text-lg pr-4 ${isOpen ? 'text-blue-500' : 'text-gray-600'}`}>
                                                {faq.question}
                                            </span>
                                        </div>
                                        
                                        <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>
                                    
                                    {/* Animasi Buka Tutup */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }} 
                                            >
                                                <div className="px-6 pb-6 sm:pl-[5.5rem] text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-200 pt-4">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-white rounded-[2.5rem] p-10 border border-gray-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-orange-400"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Masih punya pertanyaan lain?</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Jika jawaban yang Anda cari tidak tersedia di sini, silakan kunjungi halaman Pusat Bantuan kami.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link 
                        href="/pusat-bantuan" 
                        className="inline-flex items-center justify-center px-8 py-3 bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-500 transition transform hover:-translate-y-1"
                    >
                        Kunjungi Pusat Bantuan
                    </Link>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}