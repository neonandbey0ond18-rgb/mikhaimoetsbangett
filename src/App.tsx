import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { AuthView } from './components/auth/AuthView';

// Views
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { MentorDashboard } from './components/dashboard/MentorDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { AdminOverviewDashboard } from './components/dashboard/AdminOverviewDashboard';
import { AttendanceView } from './components/attendance/AttendanceView';
import { JournalView } from './components/journal/JournalView';
import { TasksView } from './components/tasks/TasksView';
import { DocumentsView } from './components/documents/DocumentsView';
import { CompaniesProgramView } from './components/companies/CompaniesProgramView';
import { MonitoringView } from './components/monitoring/MonitoringView';
import { EvaluationView } from './components/evaluation/EvaluationView';
import { CertificateView } from './components/certificate/CertificateView';
import { CalendarScheduleView } from './components/calendar/CalendarScheduleView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { MessagesChatView } from './components/messages/MessagesChatView';
import { HelpCenterView } from './components/support/HelpCenterView';
import { AdminPanelView } from './components/admin/AdminPanelView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';

const MainLayout: React.FC = () => {
  const { currentUser, activeView } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser || activeView === 'login' || activeView === 'register') {
    return <AuthView initialMode={activeView === 'register' ? 'register' : 'login'} />;
  }

  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'siswa':
        return <StudentDashboard />;
      case 'mentor':
        return <MentorDashboard />;
      case 'guru':
        return <TeacherDashboard />;
      case 'admin_sekolah':
      case 'admin_perusahaan':
      case 'superadmin':
        return <AdminOverviewDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboardByRole();
      case 'attendance':
        return <AttendanceView />;
      case 'journals':
        return <JournalView />;
      case 'tasks':
        return <TasksView />;
      case 'documents':
        return <DocumentsView />;
      case 'companies':
        return <CompaniesProgramView />;
      case 'monitoring':
        return <MonitoringView />;
      case 'evaluations':
        return <EvaluationView />;
      case 'certificates':
        return <CertificateView />;
      case 'calendar':
        return <CalendarScheduleView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'messages':
        return <MessagesChatView />;
      case 'help':
        return <HelpCenterView />;
      case 'admin':
        return <AdminPanelView />;
      case 'profile':
        return <ProfileSettingsView />;
      default:
        return renderDashboardByRole();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8FC] dark:bg-gray-950 text-[#302633] dark:text-neutral-100 transition-colors">
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {renderCurrentView()}
        </main>
      </div>

      <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <OfflineIndicator />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
