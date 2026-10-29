import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Sun,
  Moon,
  ChevronDown,
  UserCheck,
  RotateCcw,
  LogOut,
  Bell,
  HelpCircle,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    currentUser,
    switchRole,
    logout,
    isDarkMode,
    toggleDarkMode,
    activeView,
    setActiveView,
    resetAllData,
    announcements,
  } = useApp();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'siswa', label: 'Siswa Magang', desc: 'Anisa Rahmawati (SMKN 1 Jakarta)' },
    { role: 'mentor', label: 'Pembimbing Industri', desc: 'Budi Hartono (PT Tokopedia)' },
    { role: 'guru', label: 'Guru Pembimbing', desc: 'Dra. Siti Nurhaliza (SMKN 1 Jakarta)' },
    { role: 'admin_sekolah', label: 'Admin Sekolah / Hubin', desc: 'Drs. H. Bambang Subagyo' },
    { role: 'admin_perusahaan', label: 'HR Perusahaan Mitra', desc: 'Maya Indrawati (Tokopedia HR)' },
    { role: 'superadmin', label: 'Superadmin Sistem', desc: 'Raden Wijaya (MagangKu Center)' },
  ];

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'attendance':
        return 'Sistem Absensi & Kehadiran';
      case 'journals':
        return 'Jurnal Harian Magang';
      case 'tasks':
        return 'Tugas & Proyek Industri';
      case 'documents':
        return 'Pusat Dokumen & Arsip';
      case 'monitoring':
        return 'Monitoring Guru Pembimbing';
      case 'evaluations':
        return 'Evaluasi & Rubrik Penilaian';
      case 'certificates':
        return 'Penerbitan & Verifikasi Sertifikat';
      case 'calendar':
        return 'Kalender Kegiatan & Jadwal';
      case 'companies':
        return 'Mitra Industri & Program Magang';
      case 'announcements':
        return 'Papan Pengumuman';
      case 'messages':
        return 'Konsultasi & Diskusi';
      case 'help':
        return 'Pusat Bantuan & Laporan';
      case 'admin':
        return 'Panel Administrasi';
      case 'profile':
        return 'Pengaturan Akun & Profil';
      default:
        return 'Portal MagangKu';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-16 max-w-7xl mx-auto">
        {/* Zone 1: Brand Wordmark & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E85D9E] to-[#D9468D] flex items-center justify-center text-white shadow-xs">
              <span className="font-bold text-sm">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base tracking-tight text-[#302633] dark:text-white group-hover:text-[#E85D9E] transition-colors">
                Magang<span className="text-[#E85D9E]">Ku</span>
              </span>
              <span className="hidden lg:inline text-xs text-neutral-400 dark:text-neutral-500 ml-2">
                · Your Internship, Organized.
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Breadcrumb / Active Context View */}
        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-medium text-neutral-400 dark:text-neutral-500">MagangKu</span>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {getViewTitle()}
          </span>
        </div>

        {/* Zone 3: Actions, Quick Role Switcher, Dark Mode, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PWAInstallButton />

          {/* Quick Role Switcher Button */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E85D9E]/30 bg-[#FFF8FC] dark:bg-gray-800/80 text-[#E85D9E] dark:text-[#FCE7F3] hover:bg-[#FCE7F3]/40 text-xs font-semibold transition-colors whitespace-nowrap shadow-2xs"
            title="Ganti peran pengguna untuk uji coba"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#E85D9E]" />
            <span className="hidden sm:inline capitalize">
              {currentUser?.role.replace('_', ' ')}
            </span>
            <span className="sm:hidden text-[11px] uppercase">{currentUser?.role.slice(0, 3)}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Announcements shortcut */}
          <button
            onClick={() => setActiveView('announcements')}
            className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Pengumuman"
            aria-label="Pengumuman"
          >
            <Bell className="w-4 h-4" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E85D9E]" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#E85D9E]/30 transition"
              aria-label="Menu profil"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="font-semibold text-neutral-900 dark:text-white truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {currentUser?.email}
                  </p>
                  <p className="mt-1 text-[10px] text-[#E85D9E] font-medium uppercase tracking-wider">
                    Peran: {currentUser?.role.replace('_', ' ')}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    Profil & Pengaturan Akun
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('help');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Pusat Bantuan & FAQ
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset seluruh data ke kondisi awal demo?')) {
                        resetAllData();
                        setShowProfileMenu(false);
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-400 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Data Demo
                  </button>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar Sesi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Role Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Pilih Peran Demo MagangKu
                </h3>
                <p className="text-xs text-neutral-500">
                  Uji coba seluruh alur kerja sistem dari perspektif setiap role
                </p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
              {roles.map(item => {
                const isActive = currentUser?.role === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setShowRoleModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isActive
                        ? 'border-[#E85D9E] bg-[#FFF8FC] dark:bg-gray-800'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-semibold text-[#E85D9E] bg-[#FCE7F3] px-2 py-0.5 rounded-full">
                            Aktif Sekarang
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <UserCheck
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#E85D9E]' : 'text-neutral-300 dark:text-neutral-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
