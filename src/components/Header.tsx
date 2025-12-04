'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react'; 
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '@/lib/firebase'; 
import { User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();

  // Daftar rute di mana header HARUS disembunyikan
  const shouldHide = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/siswa/login') ||
    pathname.startsWith('/siswa/daftar') ||
    pathname === '/login';

  // Efek untuk memantau status login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.nama.split(' ')[0] || userData.email); 
          } else {
            setUserName(currentUser.email || 'Pengguna');
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserName(currentUser.email || 'Pengguna');
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  if (shouldHide) {
    return null;
  }

  // --- Komponen Tombol Otentikasi Dinamis ---
  const AuthButtons = ({ isMobile }: { isMobile?: boolean }) => {
    const mobileBtnClass = isMobile ? "w-full justify-center" : "";
    const mobileContainerClass = isMobile ? "flex flex-col w-full space-y-3" : "flex items-center space-x-3";

    if (isLoggedIn) {
      return (
        <div className={isMobile ? "w-full" : "flex items-center space-x-3"}>
          <Link 
            href="/siswa/dashboard" 
            onClick={isMobile ? handleMobileLinkClick : undefined}
            className={`flex items-center gap-2 bg-blue-300 text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-blue-500 transition duration-300 transform hover:scale-105 ${mobileBtnClass}`}>
            <User size={16} className="flex-shrink-0" />
            <span>Halo, {userName}</span>
          </Link>
        </div>
      );
    }

    return (
      <div className={mobileContainerClass}>
        <Link 
            href="/siswa/daftar" 
            onClick={isMobile ? handleMobileLinkClick : undefined}
            className={`bg-orange-500 text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition duration-300 shadow-lg shadow-orange-200 transform hover:scale-105 text-center ${isMobile ? "w-full" : ""}`}>
          Daftar
        </Link>
        <Link 
            href="/login" 
            onClick={isMobile ? handleMobileLinkClick : undefined}
            className={`bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition duration-300 hover:border-gray-300 text-center ${isMobile ? "w-full" : ""}`}>
          Login
        </Link>
      </div>
    );
  };

  return (
    // OPTIMASI 1: Hapus backdrop-blur-md, ganti dengan bg-white/95 (Solid tapi sedikit transparan)
    <header className="bg-white/95 sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        
        {/* Logo & Brand */}
         <div className="flex items-center">
            {/* OPTIMASI 2: Tambahkan priority agar logo tidak berkedip */}
            <Image 
              src="/LOGO-sekolahGHAMA.png" 
              alt="Logo Sekolah Ghama" 
              width={150} // Ukuran disesuaikan agar tidak terlalu besar file-nya
              height={150} 
              className="mr-3 w-auto h-10"
              priority
            />
            <span className="mt-3 font-extrabold text-gray-800">LAPOR</span>
            <span className="ml-1.5 mt-3 font-extrabold text-orange-500">AMAN</span>
          </div>
            
        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center space-x-6 lg:space-x-8 font-semibold text-sm tracking-wide">
            <Link href="/" className="text-gray-600 hover:text-orange-500 transition duration-300">Beranda</Link>
            <Link href="/tentang-kami" className="text-gray-600 hover:text-orange-500 transition duration-300">Tentang Kami</Link>
            <Link href="/faq" className="text-gray-600 hover:text-orange-500 transition duration-300">FAQ</Link>
          </div>
          <AuthButtons />
        </div>

        {/* Tombol Menu Mobile */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Toggle Menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>
      
      {/* Menu Mobile Dropdown */}
      <div 
        className={`
          md:hidden 
          bg-white border-b border-gray-200 shadow-xl absolute top-full left-0 w-full z-40
          transition-all duration-300 ease-in-out overflow-hidden origin-top
          ${isOpen ? 'max-h-screen opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'}
        `}>
        {/* OPTIMASI 3: Hapus backdrop-blur-xl di atas. Gunakan bg-white solid agar animasi lancar */}
        
        <div className="flex flex-col px-6 py-6 space-y-4 text-center">
          <Link href="/" className="block py-2 text-gray-800 hover:text-orange-500 font-medium text-lg" onClick={handleMobileLinkClick}>Beranda</Link>
          <Link href="/tentang-kami" className="block py-2 text-gray-800 hover:text-orange-500 font-medium text-lg" onClick={handleMobileLinkClick}>Tentang Kami</Link>
          <Link href="/faq" className="block py-2 text-gray-800 hover:text-orange-500 font-medium text-lg" onClick={handleMobileLinkClick}>FAQ</Link>
          <div className="w-full h-px bg-gray-200 my-2"></div>
          
          <AuthButtons isMobile={true} />
        </div>
      </div>
    </header>
  );
};

export default Header;