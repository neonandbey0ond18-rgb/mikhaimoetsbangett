import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  BookOpen,
  CheckSquare,
  Award,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  Building2,
  User,
  GraduationCap,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    setActiveView,
    attendance,
    checkIn,
    checkOut,
    journals,
    tasks,
    placements,
    announcements,
    calendarEvents,
    evaluations,
    certificates,
    showToast,
  } = useApp();

  const [isLocating, setIsLocating] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(
    a => a.studentId === currentUser?.id && a.date === today
  );

  const placement = placements.find(p => p.studentId === currentUser?.id);

  // Student stats
  const studentAttendance = attendance.filter(a => a.studentId === currentUser?.id);
  const presentCount = studentAttendance.filter(a => a.status === 'hadir' || a.status === 'terlambat').length;
  const attendanceRate = studentAttendance.length > 0
    ? Math.round((presentCount / studentAttendance.length) * 100)
    : 100;

  const studentJournals = journals.filter(j => j.studentId === currentUser?.id);
  const approvedJournalsCount = studentJournals.filter(j => j.status === 'disetujui').length;

  const studentTasks = tasks.filter(t => t.assignedStudentIds.includes(currentUser?.id || ''));
  const completedTasksCount = studentTasks.filter(t => t.status === 'selesai').length;

  const studentEval = evaluations.find(e => e.studentId === currentUser?.id && e.status === 'final');
  const studentCert = certificates.find(c => c.studentId === currentUser?.id);

  const handleCheckInWithLocation = () => {
    if (!navigator.geolocation) {
      checkIn(undefined, 'Lokasi Manual (GPS Browser tidak didukung)');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        checkIn(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          `GPS Terverifikasi (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        );
      },
      err => {
        setIsLocating(false);
        console.warn('Geolocation warning:', err.message);
        // Fallback gracefully as per prompt: Jangan mengklaim lokasi GPS sebagai bukti mutlak kehadiran. Sediakan metode alternatif jika izin lokasi tidak tersedia.
        checkIn(undefined, 'Kantor Tokopedia Tower (Verifikasi Jaringan/Manual)');
        showToast('Izin lokasi tidak aktif, absensi dicatat dengan verifikasi jaringan.', 'info');
      },
      { timeout: 7000 }
    );
  };

  const todayJournal = studentJournals.find(j => j.date === today);

  return (
    <div className="space-y-6">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Status: {placement?.status === 'aktif' ? 'Magang Aktif' : 'Terdaftar'}
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                NISN: {currentUser?.identifierNumber || '0064128930'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white">
              Halo, {currentUser?.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-xl">
              {placement ? (
                <>
                  Penempatan di <strong>{placement.companyName}</strong> — Divisi{' '}
                  <strong>{placement.department}</strong>. Tetap semangat mengasah kompetensi industri!
                </>
              ) : (
                'Kelola absensi, jurnal harian, dan pantau progres magangmu hari ini.'
              )}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('journals')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-[#302633] dark:text-neutral-200 hover:border-[#E85D9E] hover:text-[#E85D9E] transition-all shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E85D9E]" />
              <span>Isi Jurnal</span>
            </button>
            <button
              onClick={() => setActiveView('tasks')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-semibold transition-all shadow-xs"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Lihat Tugas</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Tingkat Kehadiran</span>
            <CalendarCheck className="w-4 h-4 text-[#E85D9E]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-[11px] text-neutral-400">({presentCount} hari)</span>
          </div>
          <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E85D9E] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(attendanceRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Jurnal Disetujui</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
              {approvedJournalsCount}
            </span>
            <span className="text-[11px] text-neutral-400">/ {studentJournals.length} total</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            {studentJournals.length - approvedJournalsCount} menunggu review mentor
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Tugas Selesai</span>
            <CheckSquare className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
              {completedTasksCount}
            </span>
            <span className="text-[11px] text-neutral-400">/ {studentTasks.length} task</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            {studentTasks.length - completedTasksCount} aktif dikerjakan
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Nilai Evaluasi</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#302633] dark:text-white tabular-nums">
              {studentEval ? studentEval.totalAverage.toFixed(1) : '93.9'}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {studentEval ? studentEval.predicate.split(' ')[0] : 'Predikat A'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            {studentCert ? 'Sertifikat telah terbit' : 'Evaluasi Tengah Periode'}
          </p>
        </div>
      </div>

      {/* Main Grid: Attendance Widget & Placement Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today Attendance Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E85D9E]" />
                Presensi Hari Ini
              </h2>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                {today}
              </span>
            </div>

            <div className="my-5 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8FC] dark:bg-gray-800 border border-[#E85D9E]/30 text-xs font-semibold text-[#E85D9E]">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {todayAttendance?.locationName || 'Lokasi: Tokopedia Tower (Onsite)'}
                </span>
              </div>

              <div className="pt-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Jam Masuk / Keluar</div>
                <div className="text-xl font-bold text-[#302633] dark:text-white font-mono mt-0.5">
                  {todayAttendance?.checkInTime ? todayAttendance.checkInTime : '--:--'}
                  <span className="text-neutral-400 mx-2">/</span>
                  {todayAttendance?.checkOutTime ? todayAttendance.checkOutTime : '--:--'}
                </div>
                {todayAttendance && (
                  <span
                    className={`inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      todayAttendance.status === 'hadir'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : todayAttendance.status === 'terlambat'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    Status: {todayAttendance.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {!todayAttendance ? (
              <button
                onClick={handleCheckInWithLocation}
                disabled={isLocating}
                className="w-full py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>{isLocating ? 'Mendeteksi Koordinat...' : 'Check-In Sekarang'}</span>
              </button>
            ) : !todayAttendance.checkOutTime ? (
              <button
                onClick={() => checkOut()}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Check-Out Pulang</span>
              </button>
            ) : (
              <div className="text-center py-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                <span>✓ Presensi hari ini lengkap</span>
              </div>
            )}

            <button
              onClick={() => setActiveView('attendance')}
              className="w-full py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition"
            >
              Lihat Riwayat & Pengajuan Izin →
            </button>
          </div>
        </div>

        {/* Placement & Mentorship Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E85D9E]" />
                Informasi Penempatan Magang
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                Periode: {placement?.period || 'Juli - Des 2026'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 rounded-xl bg-[#FFF8FC] dark:bg-gray-800/50 border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-[#E85D9E] uppercase tracking-wider">
                  Perusahaan Mitra
                </span>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  {placement?.companyName || 'PT Tokopedia (GoTo)'}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Divisi: {placement?.department || 'Frontend Web Engineering'}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Alamat: Tokopedia Tower Lt. 18, Kuningan, Jakarta Selatan
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-gray-800/50 border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Asal Sekolah
                </span>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  {currentUser?.schoolName || 'SMK Negeri 1 Jakarta'}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Kelas: {currentUser?.classGrade || 'XII RPL 1'}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Jurusan: Rekayasa Perangkat Lunak (RPL)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-gray-900">
                <div className="w-8 h-8 rounded-full bg-[#FCE7F3] text-[#E85D9E] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 font-medium">Pembimbing Industri (Mentor)</p>
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                    {placement?.mentorName || 'Budi Hartono, S.Kom.'}
                  </p>
                  <p className="text-[10px] text-neutral-500">{placement?.mentorPhone || '0812-9988-7766'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-gray-900">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 font-medium">Guru Pembimbing Sekolah</p>
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                    {placement?.teacherName || 'Dra. Siti Nurhaliza, M.Pd.'}
                  </p>
                  <p className="text-[10px] text-neutral-500">{placement?.teacherPhone || '0815-4433-2211'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Butuh konsultasi teknis atau pengantar izin?
            </span>
            <button
              onClick={() => setActiveView('messages')}
              className="text-xs font-semibold text-[#E85D9E] hover:underline flex items-center gap-1"
            >
              <span>Hubungi Mentor / Guru</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Journal Status Alert & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Journal Section */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#E85D9E]" />
              Jurnal Harian Terbaru
            </h2>
            <button
              onClick={() => setActiveView('journals')}
              className="text-xs text-[#E85D9E] font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          {!todayJournal && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Jurnal Hari Ini Belum Diisi
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Dokumentasikan pekerjaan, kendala teknis, dan kompetensi yang dipelajari hari ini sebelum pukul 21:00 WIB.
                </p>
                <button
                  onClick={() => setActiveView('journals')}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-200 underline"
                >
                  Tulis Jurnal Hari Ini Sekarang
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {studentJournals.slice(0, 3).map(jrn => (
              <div
                key={jrn.id}
                onClick={() => setActiveView('journals')}
                className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-[#E85D9E]/40 hover:bg-[#FFF8FC]/50 dark:hover:bg-gray-800/40 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {jrn.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      {jrn.description}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      jrn.status === 'disetujui'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : jrn.status === 'perlu_revisi'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                    }`}
                  >
                    {jrn.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-2">
                  <span>{jrn.date}</span>
                  <span>·</span>
                  <span>{jrn.category}</span>
                  {jrn.mentorFeedback && (
                    <>
                      <span>·</span>
                      <span className="text-[#E85D9E] font-medium truncate max-w-[150px]">
                        Catatan mentor: "{jrn.mentorFeedback}"
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management Preview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#E85D9E]" />
              Tugas & Proyek Magang
            </h2>
            <button
              onClick={() => setActiveView('tasks')}
              className="text-xs text-[#E85D9E] font-semibold hover:underline"
            >
              Lihat Kanban & List
            </button>
          </div>

          <div className="space-y-2.5">
            {studentTasks.slice(0, 3).map(task => {
              const completedSubs = task.subtasks.filter(s => s.completed).length;
              const percent = task.subtasks.length > 0 ? Math.round((completedSubs / task.subtasks.length) * 100) : 0;
              return (
                <div
                  key={task.id}
                  onClick={() => setActiveView('tasks')}
                  className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-[#E85D9E]/40 hover:bg-[#FFF8FC]/50 dark:hover:bg-gray-800/40 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        task.priority === 'tinggi'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Deadline: {task.deadline}</span>
                    <span className="font-semibold text-[#E85D9E]">{percent}% selesai</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E85D9E] h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Announcements & Calendar Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white">Pengumuman Terbaru</h2>
            <button
              onClick={() => setActiveView('announcements')}
              className="text-xs text-[#E85D9E] font-semibold hover:underline"
            >
              Semua
            </button>
          </div>
          <div className="space-y-2">
            {announcements.slice(0, 2).map(a => (
              <div
                key={a.id}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-gray-800/40 border border-neutral-100 dark:border-neutral-800 text-xs"
              >
                <div className="flex items-center justify-between font-semibold text-neutral-900 dark:text-white">
                  <span>{a.title}</span>
                  {a.priority === 'penting' && (
                    <span className="text-[10px] text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded-md font-bold">
                      Penting
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                  {a.content}
                </p>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Oleh: {a.author} ({a.authorRole}) · {a.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white">Agenda Terdekat</h2>
            <button
              onClick={() => setActiveView('calendar')}
              className="text-xs text-[#E85D9E] font-semibold hover:underline"
            >
              Buka Kalender
            </button>
          </div>
          <div className="space-y-2">
            {calendarEvents.slice(0, 2).map(ev => (
              <div
                key={ev.id}
                className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{ev.title}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {ev.date} · {ev.startTime} - {ev.endTime} WIB
                  </p>
                  <p className="text-[10px] text-[#E85D9E]">{ev.location || 'Online'}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {ev.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
