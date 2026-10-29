import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  CheckSquare,
  FileText,
  Calendar,
  Building2,
  Award,
  Eye,
  Star,
  Users,
  Settings,
  HelpCircle,
  MessageSquare,
  Bell,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { currentUser, activeView, setActiveView, journals, tasks, attendanceRequests } = useApp();

  const role = currentUser?.role || 'siswa';

  // Count pending badges
  const pendingJournalsCount = journals.filter(j => j.status === 'diajukan').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'menunggu_review').length;
  const pendingAttendanceRequests = attendanceRequests.filter(r => r.status === 'menunggu').length;

  interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    roles: string[];
  }

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'attendance',
      label: 'Absensi & Kehadiran',
      icon: CalendarCheck,
      badge: role === 'mentor' || role === 'admin_perusahaan' ? pendingAttendanceRequests : undefined,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'journals',
      label: 'Jurnal Harian',
      icon: BookOpen,
      badge: role === 'mentor' || role === 'guru' ? pendingJournalsCount : undefined,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'tasks',
      label: 'Tugas & Proyek',
      icon: CheckSquare,
      badge: role === 'mentor' ? pendingTasksCount : undefined,
      roles: ['siswa', 'mentor', 'guru', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'documents',
      label: 'Dokumen & Berkas',
      icon: FileText,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'companies',
      label: 'Mitra & Lowongan',
      icon: Building2,
      roles: ['siswa', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'monitoring',
      label: 'Monitoring Supervisi',
      icon: Eye,
      roles: ['guru', 'mentor', 'admin_sekolah', 'superadmin'],
    },
    {
      id: 'evaluations',
      label: 'Evaluasi & Nilai',
      icon: Star,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'certificates',
      label: 'Sertifikat Magang',
      icon: Award,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'calendar',
      label: 'Kalender Kegiatan',
      icon: Calendar,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'messages',
      label: 'Konsultasi & Chat',
      icon: MessageSquare,
      roles: ['siswa', 'mentor', 'guru'],
    },
    {
      id: 'announcements',
      label: 'Pengumuman',
      icon: Bell,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'admin',
      label: 'Panel Admin & Audit',
      icon: Settings,
      roles: ['admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
    {
      id: 'help',
      label: 'Bantuan & FAQ',
      icon: HelpCircle,
      roles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'],
    },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  const handleSelectView = (viewId: string) => {
    setActiveView(viewId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-neutral-200/80 dark:border-neutral-800 transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex md:hidden items-center justify-between px-5 h-16 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E85D9E] flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-bold text-sm text-[#302633] dark:text-white">MagangKu</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/60 hidden md:block">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FFF8FC] dark:bg-gray-800/60 border border-[#E85D9E]/20">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-white dark:border-gray-700 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#302633] dark:text-white truncate">
                {currentUser?.name}
              </p>
              <p className="text-[10px] text-[#E85D9E] font-semibold uppercase tracking-wider truncate">
                {currentUser?.role.replace('_', ' ')}
              </p>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                {currentUser?.companyName || currentUser?.schoolName || 'MagangKu System'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Menu Utama
          </div>

          {filteredMenu.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E85D9E] text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#FFF8FC] dark:hover:bg-gray-800 hover:text-[#E85D9E]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-[#E85D9E]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-[#E85D9E]' : 'bg-[#E85D9E] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 dark:text-neutral-500">
          <div className="flex items-center justify-between">
            <span>MagangKu v1.4</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-semibold">
              Live
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
