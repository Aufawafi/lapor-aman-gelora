'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, query, where, orderBy, onSnapshot, doc, updateDoc, 
  deleteDoc, increment, getDoc, writeBatch, Timestamp 
} from 'firebase/firestore'; 
import { auth, db } from '@/lib/firebase';
import { 
  LogOut, Clock, CheckCircle, AlertCircle, FileText, Trash2, 
  Plus, Calendar, MapPin, XCircle, Image as ImageIcon, AlertTriangle,
  MessageCircle, Globe, Users, Hand, ShieldAlert, ChevronRight, LayoutDashboard, HeartCrack,
  MessageSquareQuote, PieChart, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// --- Tipe Data ---
type LaporanSaya = {
  id: string;
  jenisKasus: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Dibatalkan';
  createdAt: any;
  deskripsi: string;
  lokasi?: string;
  imageUrl?: string;
  catatanAdmin?: string; 
};

type ProfilSiswa = {
    nama: string;
    kelas: string;
    email: string;
    role: string;
    stats_dibatalkan?: number; 
};

type SummaryStats = {
    menunggu: number;
    diproses: number;
    selesai: number;
    dibatalkan: number;
}

// --- Helper Functions ---
const formatDate = (timestamp: any) => {
  if (!timestamp) return "-";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const getDaysRemaining = (createdAt: any) => {
    if (!createdAt) return 0;
    const createdDate = new Date(createdAt.seconds * 1000);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(createdDate.getDate() + 25); 
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

const getCaseConfig = (jenis: string) => {
    switch(jenis) {
        case 'Fisik': return { icon: <Hand size={20} />, color: 'bg-red-50 text-red-600 border-red-100' };
        case 'Verbal': return { icon: <MessageCircle size={20} />, color: 'bg-yellow-50 text-yellow-700 border-yellow-100' };
        case 'Siber': return { icon: <Globe size={20} />, color: 'bg-purple-50 text-purple-600 border-purple-100' };
        case 'Sosial': return { icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
        case 'Emosional': return { icon: <HeartCrack size={20} />, color: 'bg-pink-50 text-pink-600 border-pink-100' };
        default: return { icon: <ShieldAlert size={20} />, color: 'bg-gray-50 text-gray-600 border-gray-100' };
    }
};

const getStatusBadge = (status: string) => {
    const configs: any = {
        Diproses: { style: "bg-orange-50 text-orange-600 ring-orange-500/30", icon: <Clock size={12} /> },
        Selesai: { style: "bg-green-50 text-green-600 ring-green-500/30", icon: <CheckCircle size={12} /> },
        Dibatalkan: { style: "bg-red-50 text-red-600 ring-red-500/30", icon: <XCircle size={12} /> },
        Menunggu: { style: "bg-gray-50 text-gray-600 ring-gray-500/30", icon: <AlertCircle size={12} /> }
    };
    // @ts-ignore
    const { style, icon } = configs[status] || configs.Menunggu;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${style}`}>
        {icon} {status}
      </span>
    );
};

// --- Komponen: QuotaCard (OPTIMIZED) ---
const QuotaCard = ({ count }: { count: number }) => {
    const limit = 2;
    const sisa = limit - count;
    const isFull = count >= limit;
    const percentage = Math.min((count / limit) * 100, 100);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-6 shadow-xl shadow-blue-900/5 border relative overflow-hidden mb-6 ${
                isFull 
                ? 'bg-red-50 border-red-100' 
                : 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-blue-200'
            }`}
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className={`font-bold flex items-center gap-2 ${isFull ? 'text-red-700' : 'text-blue-900'}`}>
                    <BarChart3 size={20} className={isFull ? 'text-red-500' : 'text-blue-700'} /> 
                    Kuota Harian
                </h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                    isFull ? 'bg-white/60 text-red-600' : 'bg-white/50 text-blue-900'
                }`}>
                    {count} / {limit}
                </span>
            </div>
            
            <div className="w-full bg-white/40 rounded-full h-3 mb-3 overflow-hidden relative z-10">
                <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                        isFull ? 'bg-red-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <p className={`text-xs font-medium relative z-10 ${isFull ? 'text-red-600' : 'text-blue-800'}`}>
                {isFull 
                    ? "Batas laporan tercapai. Kembali lagi besok."
                    : `Sisa ${sisa} kuota laporan lagi hari ini.`
                }
            </p>

            {!isFull && (
                 <div className="absolute -bottom-4 -right-4 text-blue-400/20 rotate-12">
                    <FileText size={80} />
                 </div>
            )}
        </motion.div>
    );
};

// --- Komponen Profile (OPTIMIZED) ---
const ProfileCard = ({ user, userData, onLogout }: { user: FirebaseUser | null, userData: ProfilSiswa | null, onLogout: () => void }) => {
    const displayName = userData?.nama || user?.displayName || "Siswa";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/10 border border-blue-100/50 relative overflow-hidden mb-6">
            <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center border border-blue-200 shadow-sm text-3xl font-bold text-blue-400">
                    {initial}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-800 truncate">{displayName}</h2>
                    <p className="text-sm text-gray-500 truncate mb-2">{userData?.email || user?.email}</p>
                    {userData?.kelas && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-500 border border-blue-200">
                            Kelas {userData.kelas}
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
                 <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-400 py-3 rounded-2xl text-sm font-bold hover:bg-blue-100 transition-all group border border-blue-100 hover:border-blue-200 shadow-sm">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Keluar Aplikasi
                </button>
            </div>
        </motion.div>
    );
};

// --- Komponen Stats (OPTIMIZED) ---
const StatsGrid = ({ summary }: { summary: SummaryStats }) => {
    const total = summary.menunggu + summary.diproses + summary.selesai + summary.dibatalkan;
    const createChartData = (count: number, color: string) => {
        const percentage = total === 0 ? 0 : (count / total) * 100;
        return `conic-gradient(${color} 0% ${percentage}%, #F3F4F6 ${percentage}% 100%)`;
    };

    const stats = [
        { label: "Menunggu", count: summary.menunggu, gradient: createChartData(summary.menunggu, "#6B7280"), textColor: "text-gray-600", bgColor: "bg-gray-50" },
        { label: "Diproses", count: summary.diproses, gradient: createChartData(summary.diproses, "#F97316"), textColor: "text-orange-600", bgColor: "bg-orange-50" },
        { label: "Selesai", count: summary.selesai, gradient: createChartData(summary.selesai, "#22C55E"), textColor: "text-green-600", bgColor: "bg-green-50" },
        { label: "Dibatalkan", count: summary.dibatalkan, gradient: createChartData(summary.dibatalkan, "#EF4444"), textColor: "text-red-600", bgColor: "bg-red-50" }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/10 border border-blue-100/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                    <PieChart size={20} className="text-orange-500"/> Statistik
                </h3>
                <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-lg text-gray-500">
                    Total: {total}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 ${stat.bgColor} hover:shadow-md transition-shadow`}>
                        <div className="relative w-16 h-16 mb-3 transition-transform hover:scale-105">
                            <div className="w-full h-full rounded-full" style={{ background: stat.gradient }}></div>
                            <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <span className={`text-sm font-extrabold ${stat.textColor}`}>{stat.count}</span>
                            </div>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide text-center">{stat.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const ReportList = ({ reports, onCancel }: { reports: LaporanSaya[], onCancel: (id: string) => void }) => {
    if (reports.length === 0) return <EmptyState />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence>
                {reports.map((item) => (
                    <ReportCard key={item.id} item={item} onCancel={onCancel} />
                ))}
            </AnimatePresence>
        </div>
    );
};

// --- ReportCard (OPTIMIZED) ---
const ReportCard = ({ item, onCancel }: { item: LaporanSaya, onCancel: (id: string) => void }) => {
    const { icon, color } = getCaseConfig(item.jenisKasus);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative"
        >
            <div className="p-5 flex items-start justify-between gap-3 border-b border-gray-200">
                <div className="flex gap-3 items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${color} shadow-sm`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.jenisKasus}</h3>
                        <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={10}/> {formatDate(item.createdAt)}
                        </span>
                    </div>
                </div>
                {getStatusBadge(item.status)}
            </div>

            {item.imageUrl && (
                <div className="relative h-36 w-full bg-gray-50 overflow-hidden group-hover:opacity-90 transition-opacity">
                    <Image 
                        src={item.imageUrl} 
                        alt="Bukti" 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                        <ImageIcon size={12} /> Bukti Foto
                    </div>
                </div>
            )}

            <div className="p-5 flex-1 flex flex-col">
                {item.lokasi && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-3 bg-gray-50 w-fit px-2 py-1 rounded-lg">
                        <MapPin size={12} className="text-gray-400" /> 
                        <span className="truncate max-w-[350px]">{item.lokasi}</span>
                    </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">&quot;{item.deskripsi}&quot;</p>

                {item.catatanAdmin && (
                    <div className="mt-auto bg-blue-50 rounded-2xl p-4 border border-blue-100 relative group/note hover:bg-blue-100/50 transition-colors">
                        <div className="absolute -top-2 left-4 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
                            Pesan Dari Sekolah
                        </div>
                        <div className="flex gap-3 items-start pt-2">
                            <MessageSquareQuote size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                &quot;{item.catatanAdmin}&quot;
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* --- INFO AUTO DELETE --- */}
            {item.status === 'Selesai' && (
                <div className="px-5 pb-4 mt-1">
                    <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-medium border border-red-100 w-full justify-center">
                        <Trash2 size={12} />
                        <span>Hapus otomatis dalam: {getDaysRemaining(item.createdAt)} hari</span>
                    </div>
                </div>
            )}

            {item.status === 'Menunggu' && (
                <div className="px-5 pb-5 mt-3 pt-3 border-t border-gray-200">
                    <button onClick={() => onCancel(item.id)} className="w-full py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 text-xs font-bold transition-colors flex items-center justify-center gap-2 group/btn border border-red-100">
                        <Trash2 size={14} className="group-hover/btn:scale-110 transition-transform"/> Batalkan Laporan
                    </button>
                </div>
            )}
        </motion.div>
    );
};

const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full py-20 px-6 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada laporan</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
            Lingkungan sekolah aman dimulai dari kita. Jangan ragu untuk melapor jika melihat perundungan.
        </p>
        <Link href="/lapor" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            Buat Laporan Pertama <ChevronRight size={18} />
        </Link>
    </motion.div>
);

const CancelModal = ({ isOpen, onClose, onConfirm, isCancelling }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, isCancelling: boolean }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-6">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                
                    className="absolute inset-0 bg-gray-800/60"
                ></motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 
                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 overflow-hidden"
                >
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-200">
                            <AlertTriangle size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Batalkan laporan ini?</h3>
                        <p className="text-sm text-gray-600 mb-8 leading-relaxed px-2">
                            Laporan akan dihapus permanen dari daftar Anda, namun tetap tercatat sebagai laporan dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={onClose} disabled={isCancelling} className="flex-1 py-3.5 px-4 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 border border-gray-100">
                                Kembali
                            </button>
                            <button onClick={onConfirm} disabled={isCancelling} className="flex-1 py-3.5 px-4 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 transition-all flex justify-center items-center disabled:opacity-50">
                                {isCancelling ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Ya, Batalkan"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- Komponen Utama ---
export default function SiswaDashboard() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<ProfilSiswa | null>(null);
  const [laporanList, setLaporanList] = useState<LaporanSaya[]>([]);
  const [dailyCount, setDailyCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  // --- PEMBERSIHAN OTOMATIS (KHUSUS USER INI) + HAPUS GAMBAR ---
  const autoDeleteOldReports = async (uid: string) => {
    try {
      const daysAgo = 25; 
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysAgo);
      
      const q = query(
        collection(db, "laporan_perundungan"),
        where("userId", "==", uid), 
        where("status", "==", "Selesai"),
        where("createdAt", "<=", Timestamp.fromDate(dateThreshold))
      );

      const { getDocs } = await import('firebase/firestore'); 
      const oldReportsSnap = await getDocs(q);

      if (oldReportsSnap.empty) return; 

      const batch = writeBatch(db);
      let count = 0;

      // Delete Image from Cloudinary
      const deleteImagePromises = oldReportsSnap.docs.map(async (docSnap) => {
          const data = docSnap.data();
          
          batch.delete(docSnap.ref);
          count++;

          // Jika ada gambar, hapus dari Cloudinary
          if (data.imageUrl) {
              try {
                  await fetch('/api/delete-image', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ imageUrl: data.imageUrl })
                  });
              } catch (err) {
                  console.error("Gagal hapus gambar auto:", err);
              }
          }
      });

      await Promise.all(deleteImagePromises);
      await batch.commit();
      console.log(`[Auto-Clean Siswa] Berhasil membersihkan ${count} laporan & gambar lama milik user ini.`);

    } catch (error) {
      console.error("Gagal auto-delete siswa:", error);
    }
  };

  // --- AUTH & DATA FETCHING ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/siswa/login');
      } else {
        
        // --- PROTEKSI HALAMAN ---
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const data = userSnap.data();
                if (data.role !== 'siswa') {
                    router.replace('/admin/dashboard');
                    return; 
                }
            }
        } catch (error) {
            console.error("Gagal verifikasi siswa:", error);
        }

        setUser(currentUser);

        // Eksekusi Auto Delete
        autoDeleteOldReports(currentUser.uid);
        
        // Ambil Profil 
        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) setUserData(docSnap.data() as ProfilSiswa);
            }, (error) => {
                if (error.code !== 'permission-denied') console.error("Profile listener error:", error);
            });
        } catch (err) { console.error("Gagal profil:", err); }

        // Ambil List Laporan 
        const qList = query(collection(db, "laporan_perundungan"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
        const unsubList = onSnapshot(qList, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LaporanSaya[];
          setLaporanList(data);
          setLoading(false);
        }, (error) => {
             if (error.code !== 'permission-denied') console.error("List listener error:", error);
        });

        // Ambil Kuota Harian 
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const qQuota = query(
            collection(db, "laporan_perundungan"),
            where("userId", "==", currentUser.uid),
            where("createdAt", ">=", today)
        );
        const unsubQuota = onSnapshot(qQuota, (snapshot) => {
            setDailyCount(snapshot.size);
        }, (error) => {
             if (error.code !== 'permission-denied') console.error("Quota listener error:", error);
        });

        return () => {
            unsubList();
            unsubQuota();
        };
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  const handleLogout = async () => { await signOut(auth); router.push('/login'); };
  const openCancelModal = (id: string) => { setSelectedReportId(id); setIsModalOpen(true); };
  const closeCancelModal = () => { setIsModalOpen(false); setSelectedReportId(null); };
  
  const handleConfirmCancel = async () => {
    if (!selectedReportId || !user) return;
    setIsCancelling(true);
    try {
        const reportRef = doc(db, "laporan_perundungan", selectedReportId);
        const reportSnap = await getDoc(reportRef); 

        if (reportSnap.exists()) {
             const data = reportSnap.data();
             
             // Delete Image Cloudinary jika ada
             if (data.imageUrl) {
                 try {
                     await fetch('/api/delete-image', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ imageUrl: data.imageUrl })
                     });
                 } catch (imgErr) {
                     console.error("Gagal hapus gambar:", imgErr);
                 }
             }
        }

        await deleteDoc(reportRef);
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { stats_dibatalkan: increment(1) });
        closeCancelModal();
    } catch (error) { alert("Gagal membatalkan laporan."); } 
    finally { setIsCancelling(false); }
  };

  const summary = useMemo(() => ({
    menunggu: laporanList.filter(l => l.status === 'Menunggu').length,
    diproses: laporanList.filter(l => l.status === 'Diproses').length,
    selesai: laporanList.filter(l => l.status === 'Selesai').length,
    dibatalkan: userData?.stats_dibatalkan || 0,
  }), [laporanList, userData]);

  const displayName = userData?.nama || user?.displayName || "Siswa";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
            <p className="text-sm text-gray-500 font-medium animate-pulse">Memuat data...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
      
      {/* Decoration Background */}
      <div className="absolute top-0 inset-x-0 h-[22rem] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-b-[3rem] shadow-lg z-0">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pt-4 gap-4 text-white">
            <div>
                <div className="flex items-center gap-2 mb-1 text-gray-600/80">
                    <LayoutDashboard size={18} />
                    <span className="font-medium text-sm tracking-wide uppercase">Dashboard Siswa</span>
                </div>
                <h1 className="text-gray-800 text-3xl md:text-4xl font-extrabold tracking-tight">Halo, <span className='text-orange-500'>{displayName.split(' ')[0]}!</span> 👋</h1>
                <p className="text-gray-600/80 text-sm mt-1">Selamat datang kembali di LAPOR AMAN.</p>
            </div>
            
            <div className="hidden md:block text-right">
                <div className="inline-block px-4 py-2 bg-blue-100/50 rounded-xl border border-blue-800/10">
                    <p className="text-sm font-medium text-gray-600">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-0">
                <ProfileCard user={user} userData={userData} onLogout={handleLogout} />
                
                <QuotaCard count={dailyCount} />
                
                <StatsGrid summary={summary} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                           <FileText size={24} className="text-gray-800"/>Riwayat Laporan
                        </h2>
                        <p className="text-sm text-gray-600/80 mt-1">Pantau status laporan yang telah Anda kirim.</p>
                    </div>
                    
                    {dailyCount < 2 &&
                        <Link href="/lapor" className="hidden sm:inline-flex items-center gap-2 bg-white text-gray-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-50 hover:scale-105 transition-all">
                            <Plus size={18} strokeWidth={3} /> Buat Laporan Baru
                        </Link>
                    }
                </div>
                
                <ReportList reports={laporanList} onCancel={openCancelModal} />
            </div>
        </div>

        {/* FAB Mobile */}
        {dailyCount < 2 &&
            <div className="fixed bottom-6 right-6 sm:hidden z-30">
                <Link href="/lapor" className="flex items-center justify-center w-14 h-14 bg-blue-300 text-white rounded-full shadow-xl shadow-blue-500/40 hover:scale-110 transition-transform">
                    <Plus size={28} />
                </Link>
            </div>
        }
      </main>

      <CancelModal 
        isOpen={isModalOpen} 
        onClose={closeCancelModal} 
        onConfirm={handleConfirmCancel} 
        isCancelling={isCancelling} 
      />
    </div>
  );
}