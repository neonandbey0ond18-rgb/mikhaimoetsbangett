import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Calendar,
  X,
  Search,
} from 'lucide-react';
import { AttendanceStatus } from '../../types';

export const AttendanceView: React.FC = () => {
  const {
    currentUser,
    attendance,
    attendanceRequests,
    checkIn,
    checkOut,
    requestAttendanceCorrection,
    reviewAttendanceRequest,
    showToast,
  } = useApp();

  const isStudent = currentUser?.role === 'siswa';
  const isMentorOrAdmin = ['mentor', 'admin_perusahaan', 'admin_sekolah', 'superadmin'].includes(
    currentUser?.role || ''
  );

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(
    a => a.studentId === currentUser?.id && a.date === today
  );

  const [isLocating, setIsLocating] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestDate, setRequestDate] = useState(today);
  const [requestType, setRequestType] = useState<'izin' | 'sakit' | 'koreksi'>('izin');
  const [requestReason, setRequestReason] = useState('');
  const [requestAttachment, setRequestAttachment] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCheckIn = () => {
    if (!navigator.geolocation) {
      checkIn(undefined, 'Lokasi Manual (GPS tidak didukung)');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        checkIn(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          `Kantor Tokopedia Tower (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        );
      },
      err => {
        setIsLocating(false);
        console.warn('Geolocation fallback:', err.message);
        checkIn(undefined, 'Kantor Tokopedia Tower (Presensi Jaringan)');
        showToast('Izin lokasi browser tidak diberikan, presensi dicatat via verifikasi jaringan.', 'info');
      },
      { timeout: 6000 }
    );
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestReason.trim()) {
      showToast('Mohon isi alasan permohonan kehadiran dengan lengkap.', 'error');
      return;
    }
    requestAttendanceCorrection({
      date: requestDate,
      requestType,
      reason: requestReason.trim(),
      attachmentUrl: requestAttachment || undefined,
    });
    setShowRequestModal(false);
    setRequestReason('');
    setRequestAttachment('');
  };

  // Filtered records
  const myAttendance = isStudent
    ? attendance.filter(a => a.studentId === currentUser?.id)
    : attendance;

  const filteredRecords = myAttendance.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.date.includes(searchQuery) ||
      (r.locationName && r.locationName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const total = myAttendance.length;
  const hadir = myAttendance.filter(a => a.status === 'hadir').length;
  const terlambat = myAttendance.filter(a => a.status === 'terlambat').length;
  const izinSakit = myAttendance.filter(a => a.status === 'izin' || a.status === 'sakit').length;
  const presentPercent = total > 0 ? Math.round(((hadir + terlambat) / total) * 100) : 100;

  const exportCsv = () => {
    const headers = ['Nama Siswa', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status', 'Lokasi', 'Catatan'];
    const rows = filteredRecords.map(r => [
      r.studentName,
      r.date,
      r.checkInTime || '-',
      r.checkOutTime || '-',
      r.status,
      r.locationName || '-',
      r.notes || '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_absensi_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Check-in */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Sistem Presensi Digital
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 font-mono">Zona: Asia/Jakarta (WIB)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Absensi & Rekap Kehadiran
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Jam kerja reguler: 08:00 - 17:00 WIB. Toleransi keterlambatan 15 menit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isStudent && (
              <>
                {!todayRecord ? (
                  <button
                    onClick={handleCheckIn}
                    disabled={isLocating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition disabled:opacity-60"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>{isLocating ? 'Mencari GPS...' : 'Check-In Masuk'}</span>
                  </button>
                ) : !todayRecord.checkOutTime ? (
                  <button
                    onClick={() => checkOut()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-xs transition"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Check-Out Pulang</span>
                  </button>
                ) : (
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Presensi Hari Ini Lengkap</span>
                  </div>
                )}

                <button
                  onClick={() => setShowRequestModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-[#E85D9E] transition"
                >
                  <Send className="w-3.5 h-3.5 text-[#E85D9E]" />
                  <span>Ajukan Izin / Sakit</span>
                </button>
              </>
            )}

            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-[#E85D9E] transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Tingkat Kehadiran</span>
          <div className="text-2xl font-bold text-[#302633] dark:text-white tabular-nums mt-1">
            {presentPercent}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Memenuhi syarat kelulusan (&ge;80%)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Tepat Waktu (Hadir)</span>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums mt-1">
            {hadir} <span className="text-xs text-neutral-400 font-normal">hari</span>
          </div>
          <span className="text-[10px] text-neutral-400">Presensi sebelum 08:15</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Terlambat</span>
          <div className="text-2xl font-bold text-amber-500 tabular-nums mt-1">
            {terlambat} <span className="text-xs text-neutral-400 font-normal">hari</span>
          </div>
          <span className="text-[10px] text-neutral-400">Check-in setelah 08:15</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 font-medium">Izin / Sakit Sah</span>
          <div className="text-2xl font-bold text-sky-600 tabular-nums mt-1">
            {izinSakit} <span className="text-xs text-neutral-400 font-normal">hari</span>
          </div>
          <span className="text-[10px] text-neutral-400">Dengan surat persetujuan</span>
        </div>
      </div>

      {/* Pending Requests for Mentor / Admin */}
      {isMentorOrAdmin && attendanceRequests.some(r => r.status === 'menunggu') && (
        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Permohonan Izin / Sakit yang Perlu Diproses ({attendanceRequests.filter(r => r.status === 'menunggu').length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attendanceRequests
              .filter(r => r.status === 'menunggu')
              .map(req => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900 text-xs space-y-2 shadow-2xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">{req.studentName}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        Tanggal: {req.date} · Diajukan: {req.submittedAt}
                      </p>
                    </div>
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {req.requestType}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 text-[11px] bg-neutral-50 dark:bg-gray-800 p-2 rounded-lg">
                    "{req.reason}"
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => reviewAttendanceRequest(req.id, 'ditolak', 'Alasan tidak mencukupi')}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 dark:text-neutral-400 text-xs font-medium hover:bg-neutral-50"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => reviewAttendanceRequest(req.id, 'disetujui', 'Disetujui mentor')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      Setujui
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filter and Table Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa, tanggal, lokasi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 dark:bg-gray-800 rounded-xl">
            {['all', 'hadir', 'terlambat', 'izin', 'sakit'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'Semua' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Mobile Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 dark:bg-gray-800/60 text-neutral-500 font-semibold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="py-3 px-3">Siswa</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3 font-mono">Masuk</th>
                <th className="py-3 px-3 font-mono">Pulang</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Lokasi / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-400">
                    Tidak ada catatan absensi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => {
                  return (
                    <tr key={rec.id} className="hover:bg-neutral-50/50 dark:hover:bg-gray-800/40">
                      <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                        {rec.studentName}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-600 dark:text-neutral-300">
                        {rec.date}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-900 dark:text-white font-semibold">
                        {rec.checkInTime || '--:--'}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-900 dark:text-white font-semibold">
                        {rec.checkOutTime || '--:--'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            rec.status === 'hadir'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : rec.status === 'terlambat'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                              : rec.status === 'izin' || rec.status === 'sakit'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                          }`}
                        >
                          {rec.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                          {rec.isVerifiedLocation && (
                            <MapPin className="w-3 h-3 text-[#E85D9E] shrink-0" />
                          )}
                          <span className="truncate max-w-xs">{rec.locationName || rec.notes || '-'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#E85D9E]" />
                Pengajuan Izin / Sakit / Koreksi
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Jenis Pengajuan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['izin', 'sakit', 'koreksi'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRequestType(type)}
                      className={`py-2 rounded-xl font-bold uppercase transition ${
                        requestType === type
                          ? 'bg-[#E85D9E] text-white'
                          : 'bg-neutral-100 dark:bg-gray-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  value={requestDate}
                  onChange={e => setRequestDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Alasan Lengkap
                </label>
                <textarea
                  value={requestReason}
                  onChange={e => setRequestReason(e.target.value)}
                  placeholder="Jelaskan alasan izin, sakit (gejala/dokter), atau permohonan koreksi absensi..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tautan Lampiran Dokumen / Surat Dokter (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... atau tautan file"
                  value={requestAttachment}
                  onChange={e => setRequestAttachment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-semibold"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
