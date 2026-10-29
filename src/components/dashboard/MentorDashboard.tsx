import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle,
  Clock,
  BookOpen,
  CheckSquare,
  AlertCircle,
  Award,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Building,
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    placements,
    attendance,
    attendanceRequests,
    reviewAttendanceRequest,
    journals,
    reviewJournal,
    tasks,
    setActiveView,
    evaluations,
    showToast,
  } = useApp();

  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Find students assigned to this mentor
  const myPlacements = placements.filter(p => p.mentorId === currentUser?.id || currentUser?.role === 'admin_perusahaan');
  const myStudentIds = myPlacements.map(p => p.studentId);
  const myStudents = users.filter(u => myStudentIds.includes(u.id));

  const today = new Date().toISOString().split('T')[0];

  // Attendance of students today
  const studentsAttendanceToday = myStudentIds.map(sid => {
    const record = attendance.find(a => a.studentId === sid && a.date === today);
    const student = users.find(u => u.id === sid);
    return {
      student,
      record,
    };
  });

  // Pending journals to review
  const pendingJournals = journals.filter(
    j => myStudentIds.includes(j.studentId) && j.status === 'diajukan'
  );

  // Pending attendance requests
  const pendingRequests = attendanceRequests.filter(
    r => myStudentIds.includes(r.studentId) && r.status === 'menunggu'
  );

  // Mentor tasks
  const mentorTasks = tasks.filter(t => t.mentorId === currentUser?.id || t.companyId === currentUser?.companyId);

  const handleApproveJournal = (journalId: string) => {
    reviewJournal(
      journalId,
      'disetujui',
      feedbackText || 'Bagus sekali! Pekerjaan telah diverifikasi dan memenuhi standar industri.'
    );
    setSelectedJournalId(null);
    setFeedbackText('');
  };

  const handleRequestRevision = (journalId: string) => {
    if (!feedbackText.trim()) {
      showToast('Tolong sertakan catatan revisi agar siswa dapat memperbaiki jurnalnya.', 'error');
      return;
    }
    reviewJournal(journalId, 'perlu_revisi', feedbackText);
    setSelectedJournalId(null);
    setFeedbackText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Pembimbing Perusahaan
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {currentUser?.companyName || 'PT Tokopedia (GoTo)'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Dashboard Mentor — {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Membimbing {myStudents.length} siswa magang aktif dalam proyek engineering & industri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('tasks')}
              className="px-3.5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-semibold shadow-xs transition"
            >
              + Beri Tugas Baru
            </button>
            <button
              onClick={() => setActiveView('evaluations')}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-[#302633] dark:text-neutral-200 hover:border-[#E85D9E] transition"
            >
              Formulir Evaluasi
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Siswa Bimbingan</span>
            <Users className="w-4 h-4 text-[#E85D9E]" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
            {myStudents.length}
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">Aktif di squad Anda</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Jurnal Butuh Review</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
            {pendingJournals.length}
          </div>
          <p className="mt-1 text-[11px] text-amber-600 font-semibold">Menunggu persetujuan</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Permohonan Izin</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
            {pendingRequests.length}
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">Izin / Sakit / Koreksi</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Tugas Diberikan</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
            {mentorTasks.length}
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">Sprint berjalan</p>
        </div>
      </div>

      {/* Pending Attendance Requests Alert */}
      {pendingRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Permohonan Kehadiran Menunggu Persetujuan Mentor</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-amber-200/60 dark:border-amber-900/60 text-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white">{req.studentName}</span>
                    <span className="text-neutral-400 ml-1.5 font-mono text-[11px]">({req.date})</span>
                  </div>
                  <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {req.requestType}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 text-[11px]">
                  Alasan: "{req.reason}"
                </p>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => reviewAttendanceRequest(req.id, 'ditolak', 'Alasan tidak mencukupi')}
                    className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => reviewAttendanceRequest(req.id, 'disetujui', 'Disetujui mentor')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                  >
                    Setujui Permohonan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Split: Pending Journal Review Queue & Active Students Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Journal Review Queue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#E85D9E]" />
              Antrean Jurnal Harian Siswa
            </h2>
            <button
              onClick={() => setActiveView('journals')}
              className="text-xs text-[#E85D9E] font-semibold hover:underline"
            >
              Lihat Riwayat
            </button>
          </div>

          {pendingJournals.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Semua jurnal harian telah diperiksa!
              </p>
              <p className="text-[11px] text-neutral-500">
                Belum ada jurnal baru yang diajukan siswa hari ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJournals.map(jrn => (
                <div
                  key={jrn.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2 bg-[#FFF8FC]/30 dark:bg-gray-800/30"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">
                        {jrn.studentName}
                      </p>
                      <p className="text-[11px] text-[#E85D9E] font-semibold mt-0.5">
                        {jrn.title}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{jrn.date}</span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                    {jrn.description}
                  </p>

                  <div className="text-[11px] text-neutral-500 space-y-0.5 bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-700">
                    <p><strong>Output:</strong> {jrn.output}</p>
                    <p><strong>Kendala & Solusi:</strong> {jrn.challenges} → {jrn.solution}</p>
                  </div>

                  {selectedJournalId === jrn.id ? (
                    <div className="pt-2 space-y-2 border-t border-neutral-100 dark:border-neutral-800">
                      <textarea
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                        placeholder="Berikan catatan umpan balik / arahan teknis mentor..."
                        rows={2}
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedJournalId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleRequestRevision(jrn.id)}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                        >
                          Minta Revisi
                        </button>
                        <button
                          onClick={() => handleApproveJournal(jrn.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                        >
                          Setujui Jurnal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedJournalId(jrn.id);
                          setFeedbackText('');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
                      >
                        Beri Catatan...
                      </button>
                      <button
                        onClick={() => handleApproveJournal(jrn.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Langsung Setujui</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Interns Under Supervision */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E85D9E]" />
              Peserta Magang Bimbingan Anda
            </h2>
            <span className="text-xs text-neutral-500 font-medium">Hari ini: {today}</span>
          </div>

          <div className="space-y-3">
            {studentsAttendanceToday.map(({ student, record }) => {
              if (!student) return null;
              const hasCheckedIn = Boolean(record?.checkInTime);
              return (
                <div
                  key={student.id}
                  className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {student.classGrade || 'XII RPL'} · {student.department || 'Frontend Squad'}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {student.schoolName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        record?.status === 'hadir'
                          ? 'bg-emerald-100 text-emerald-700'
                          : record?.status === 'terlambat'
                          ? 'bg-amber-100 text-amber-700'
                          : record?.status === 'izin'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {record?.status ? record.status.toUpperCase() : 'BELUM PRESENSI'}
                    </span>
                    <p className="text-[11px] font-mono text-neutral-500 mt-1">
                      {hasCheckedIn && record ? `In: ${record.checkInTime}` : 'Belum hadir'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
            <span className="text-xs text-neutral-500">
              Evaluasi berkala menentukan nilai sertifikasi siswa.
            </span>
            <button
              onClick={() => setActiveView('evaluations')}
              className="text-xs font-semibold text-[#E85D9E] hover:underline"
            >
              Isi Nilai Akhir Siswa →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
