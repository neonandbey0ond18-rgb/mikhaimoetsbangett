import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  Eye,
  Building2,
  CalendarCheck,
  BookOpen,
  Award,
  Plus,
  Phone,
  MessageSquare,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    placements,
    monitoringRecords,
    journals,
    attendance,
    setActiveView,
    evaluations,
  } = useApp();

  const myPlacements = placements.filter(p => p.teacherId === currentUser?.id || currentUser?.role === 'admin_sekolah');
  const myStudentIds = myPlacements.map(p => p.studentId);
  const myStudents = users.filter(u => myStudentIds.includes(u.id));

  const myMonitoring = monitoringRecords.filter(m => m.teacherId === currentUser?.id);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Guru Pembimbing Sekolah
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {currentUser?.schoolName || 'SMK Negeri 1 Jakarta'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Portal Monitoring — {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Memantau perkembangan kompetensi, absensi, dan jurnal siswa magang di mitra Dunia Usaha / Dunia Industri (DUDI).
            </p>
          </div>

          <button
            onClick={() => setActiveView('monitoring')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Kunjungan Supervisi</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Siswa Terbimbing</span>
            <Users className="w-4 h-4 text-[#E85D9E]" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            {myStudents.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Ditempatkan di mitra industri</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Mitra Perusahaan</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            {Array.from(new Set(myPlacements.map(p => p.companyName))).length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Lokasi penempatan aktif</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Laporan Monitoring</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            {myMonitoring.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Kunjungan tercatat</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Rata-rata Nilai</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums">
            93.9
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Kategori Sangat Baik (A)</p>
        </div>
      </div>

      {/* Monitored Students Table with Mentors */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#E85D9E]" />
            Daftar Siswa Bimbingan & Kontak Mentor Industri
          </h2>
          <button
            onClick={() => setActiveView('monitoring')}
            className="text-xs text-[#E85D9E] font-semibold hover:underline"
          >
            Buka Panel Monitoring
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 dark:bg-gray-800/60 text-neutral-500 font-semibold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="py-3 px-3">Siswa</th>
                <th className="py-3 px-3">Perusahaan & Divisi</th>
                <th className="py-3 px-3">Mentor Industri</th>
                <th className="py-3 px-3 text-center">Jurnal Disetujui</th>
                <th className="py-3 px-3 text-center">Kehadiran</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {myStudents.map(student => {
                const plc = placements.find(p => p.studentId === student.id);
                const stJournals = journals.filter(j => j.studentId === student.id);
                const approvedJ = stJournals.filter(j => j.status === 'disetujui').length;
                const stAtt = attendance.filter(a => a.studentId === student.id);
                const pres = stAtt.filter(a => a.status === 'hadir' || a.status === 'terlambat').length;
                const attPercent = stAtt.length > 0 ? Math.round((pres / stAtt.length) * 100) : 100;

                return (
                  <tr key={student.id} className="hover:bg-neutral-50/60 dark:hover:bg-gray-800/40">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">{student.name}</p>
                          <p className="text-[10px] text-neutral-400">{student.identifierNumber} · {student.classGrade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">{plc?.companyName}</p>
                      <p className="text-[10px] text-neutral-400">{plc?.department}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{plc?.mentorName}</p>
                      <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" /> {plc?.mentorPhone || '0812-9988-7766'}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-[#E85D9E] tabular-nums">{approvedJ}</span>
                      <span className="text-neutral-400 text-[10px]"> / {stJournals.length}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-emerald-600 tabular-nums">{attPercent}%</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveView('monitoring')}
                          className="px-2 py-1 rounded-lg bg-[#FFF8FC] border border-[#E85D9E]/30 text-[#E85D9E] font-medium hover:bg-[#FCE7F3]"
                        >
                          Supervisi
                        </button>
                        <button
                          onClick={() => setActiveView('messages')}
                          className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                          title="Kirim pesan"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
