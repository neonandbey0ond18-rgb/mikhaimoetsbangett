import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  GraduationCap,
  FileCheck,
  Award,
  AlertTriangle,
  Activity,
  Plus,
  Download,
  Settings,
  ShieldCheck,
  Database,
} from 'lucide-react';

export const AdminOverviewDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    companies,
    programs,
    placements,
    documents,
    certificates,
    auditLogs,
    setActiveView,
    attendance,
    journals,
    resetAllData,
  } = useApp();

  const role = currentUser?.role || 'admin_sekolah';
  const isSuperadmin = role === 'superadmin';
  const isCompanyAdmin = role === 'admin_perusahaan';

  // Stats
  const totalStudents = users.filter(u => u.role === 'siswa').length;
  const totalTeachers = users.filter(u => u.role === 'guru').length;
  const totalMentors = users.filter(u => u.role === 'mentor').length;
  const placedStudents = placements.filter(p => p.status === 'aktif').length;
  const pendingDocs = documents.filter(d => d.status === 'menunggu_verifikasi').length;

  const exportSummaryCsv = () => {
    const headers = ['Nama Siswa', 'NISN', 'Perusahaan', 'Divisi', 'Mentor', 'Guru', 'Status'];
    const rows = placements.map(p => [
      p.studentName,
      users.find(u => u.id === p.studentId)?.identifierNumber || '-',
      p.companyName,
      p.department,
      p.mentorName,
      p.teacherName,
      p.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_penempatan_magang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {isSuperadmin
                  ? 'Master Superadmin'
                  : isCompanyAdmin
                  ? 'HR Perusahaan Mitra'
                  : 'Hubungan Industri & BKK Sekolah'}
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {currentUser?.schoolName || currentUser?.companyName || 'Pusat Manajemen MagangKu'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Panel Pengendali — {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              {isSuperadmin
                ? 'Monitoring kesehatan infrastruktur multi-tenant, audit trail keamanan, dan kontrol basis data.'
                : isCompanyAdmin
                ? 'Manajemen kuota peserta magang perusahaan, penugasan mentor, dan perizinan kerja.'
                : 'Kelola program penempatan siswa PKL, verifikasi berkas, dan penerbitan sertifikat resmi.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportSummaryCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-[#302633] dark:text-neutral-200 hover:border-[#E85D9E] shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Ekspor Rekap CSV</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-semibold shadow-xs transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Konfigurasi & Master</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Siswa Terdaftar</span>
            <GraduationCap className="w-4 h-4 text-[#E85D9E]" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            {totalStudents}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {placedStudents} telah aktif di DUDI
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Perusahaan Mitra</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            {companies.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {programs.length} program magang aktif
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Dokumen Pending</span>
            <FileCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            {pendingDocs}
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Butuh verifikasi Hubin</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Sertifikat Terbit</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            {certificates.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Telah tersahkan & terverifikasi QR</p>
        </div>
      </div>

      {/* Grid: Placement Management & Real Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Table */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E85D9E]" />
              Data Penempatan Siswa Magang
            </h2>
            <button
              onClick={() => setActiveView('companies')}
              className="text-xs text-[#E85D9E] font-semibold hover:underline"
            >
              Lihat Mitra & Lowongan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 dark:bg-gray-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Siswa</th>
                  <th className="py-2.5 px-3">Perusahaan & Divisi</th>
                  <th className="py-2.5 px-3">Pembimbing (Mentor & Guru)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {placements.map(plc => (
                  <tr key={plc.id} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-neutral-900 dark:text-white">{plc.studentName}</p>
                      <p className="text-[10px] text-neutral-400">{plc.studentClass}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{plc.companyName}</p>
                      <p className="text-[10px] text-neutral-400">{plc.department}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="text-neutral-800 dark:text-neutral-200">
                        <span className="text-[10px] text-neutral-400">Mentor:</span> {plc.mentorName}
                      </p>
                      <p className="text-neutral-800 dark:text-neutral-200">
                        <span className="text-[10px] text-neutral-400">Guru:</span> {plc.teacherName}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                        {plc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Audit Log Stream */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E85D9E]" />
              Audit Log Aktivitas Sistem
            </h2>
            <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-neutral-500 font-mono">
              Live
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {auditLogs.slice(0, 5).map(log => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 text-[11px] space-y-1 bg-neutral-50/50 dark:bg-gray-800/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E85D9E] font-mono text-[10px]">{log.action}</span>
                  <span className="text-neutral-400 text-[10px] font-mono">{log.timestamp.split(' ')[1]}</span>
                </div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  {log.userName} ({log.role})
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-[10px] line-clamp-2">
                  {log.details}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveView('admin')}
            className="w-full py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center transition"
          >
            Buka Seluruh Audit Trail →
          </button>
        </div>
      </div>
    </div>
  );
};
