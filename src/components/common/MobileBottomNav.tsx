import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  CheckSquare,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { activeView, setActiveView, journals, tasks } = useApp();

  const pendingJournals = journals.filter(j => j.status === 'diajukan').length;
  const pendingTasks = tasks.filter(t => t.status === 'menunggu_review' || t.status === 'dikerjakan').length;

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'attendance', label: 'Absensi', icon: CalendarCheck },
    { id: 'journals', label: 'Jurnal', icon: BookOpen, badge: pendingJournals },
    { id: 'tasks', label: 'Tugas', icon: CheckSquare, badge: pendingTasks },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 border-t border-neutral-200 dark:border-neutral-800 backdrop-blur-md safe-area-pb">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center relative min-h-[44px] transition-colors ${
                isActive
                  ? 'text-[#E85D9E] font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#E85D9E] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Menu Drawer Toggle */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center relative min-h-[44px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 tracking-tight">Lainnya</span>
        </button>
      </div>
    </nav>
  );
};
