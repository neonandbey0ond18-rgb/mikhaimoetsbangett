import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Eye,
  Plus,
  Calendar,
  Building2,
  CheckCircle,
  AlertCircle,
  Users,
  Search,
  X,
  MapPin,
  Video,
} from 'lucide-react';
import { MonitoringRecord } from '../../types';

export const MonitoringView: React.FC = () => {
  const {
    currentUser,
    users,
    placements,
    monitoringRecords,
    addMonitoringRecord,
    journals,
    attendance,
    tasks,
    showToast,
  } = useApp();

  const isTeacherOrAdmin = ['guru', 'admin_sekolah', 'superadmin'].includes(currentUser?.role || '');

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState('user-siswa-1');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitType, setVisitType] = useState<'onsite' | 'virtual'>('onsite');
  const [progressPercent, setProgressPercent] = useState(70);
  const [attendanceScore, setAttendanceScore] = useState(95);
  const [qualityScore, setQualityScore] = useState(92);
  const [challenges, setChallenges] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [followUp, setFollowUp] = useState('');

  const students = users.filter(u => u.role === 'siswa');

  const handleSaveMonitoring = (e: React.FormEvent) => {
    e.preventDefault();
    const student = users.find(u => u.id === selectedStudentId);
    const plc = placements.find(p => p.studentId === selectedStudentId);

    if (!student) return;

    addMonitoringRecord({
      studentId: student.id,
      studentName: student.name,
      companyName: plc?.companyName || 'Mitra Industri',
      visitDate,
      visitType,
      studentProgressPercentage: progressPercent,
      attendanceScore,
      workQualityScore: qualityScore,
      challenges: challenges.trim() || 'Tidak ada kendala kritis yang dilaporkan.',
      recommendations: recommendations.trim() || 'Terus tingkatkan kecepatan pengerjaan tugas sprint.',
      followUpPlan: followUp.trim() || 'Evaluasi berkala pada kunjungan berikutnya.',
    });

    setShowAddModal(false);
    setChallenges('');
    setRecommendations('');
    setFollowUp('');
  };

  const filteredRecords = monitoringRecords.filter(m => {
    return (
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Supervisi & Evaluasi DUDI
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Monitoring Perkembangan Siswa</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Monitoring Guru Pembimbing
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Kunjungan berkala (onsite/virtual), pencatatan progres kompetensi, serta sinkronisasi dengan mentor perusahaan.
            </p>
          </div>

          {isTeacherOrAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Log Monitoring</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Cards per Student */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(st => {
          const plc = placements.find(p => p.studentId === st.id);
          const stJournals = journals.filter(j => j.studentId === st.id);
          const approvedJ = stJournals.filter(j => j.status === 'disetujui').length;
          const stAtt = attendance.filter(a => a.studentId === st.id);
          const pres = stAtt.filter(a => a.status === 'hadir' || a.status === 'terlambat').length;
          const attRate = stAtt.length > 0 ? Math.round((pres / stAtt.length) * 100) : 100;
          const stTasks = tasks.filter(t => t.assignedStudentIds.includes(st.id));
          const completedT = stTasks.filter(t => t.status === 'selesai').length;

          return (
            <div
              key={st.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={st.avatar}
                  alt={st.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {st.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate">
                    {plc?.companyName || 'Menunggu Penempatan'}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {st.classGrade || 'SMK'} · Divisi: {plc?.department || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-gray-800">
                  <span className="text-[10px] text-neutral-400">Presensi</span>
                  <p className="text-xs font-bold text-emerald-600 tabular-nums">{attRate}%</p>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-gray-800">
                  <span className="text-[10px] text-neutral-400">Jurnal Sah</span>
                  <p className="text-xs font-bold text-[#E85D9E] tabular-nums">{approvedJ}/{stJournals.length}</p>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-gray-800">
                  <span className="text-[10px] text-neutral-400">Tugas</span>
                  <p className="text-xs font-bold text-sky-600 tabular-nums">{completedT}/{stTasks.length}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monitoring History Records */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#E85D9E]" />
            Riwayat Log Supervisi & Kunjungan Lapangan
          </h2>
          <span className="text-xs text-neutral-400">Total {filteredRecords.length} log supervisi</span>
        </div>

        <div className="space-y-3">
          {filteredRecords.map(rec => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FFF8FC]/20 dark:bg-gray-800/30 space-y-2.5 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white">{rec.studentName}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-600 dark:text-neutral-300 font-medium">{rec.companyName}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Guru Penguji: {rec.teacherName} · Tanggal Supervisi: {rec.visitDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase ${
                      rec.visitType === 'onsite'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    }`}
                  >
                    {rec.visitType === 'onsite' ? <MapPin className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                    <span>Kunjungan {rec.visitType}</span>
                  </span>
                  <span className="text-xs font-bold text-[#E85D9E] bg-[#FCE7F3] px-2.5 py-0.5 rounded-full">
                    Progres {rec.studentProgressPercentage}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-gray-800/80 p-3 rounded-xl border border-neutral-100 dark:border-neutral-700">
                <div>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">Kendala Ditemukan:</span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">{rec.challenges}</p>
                </div>
                <div>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">Rekomendasi Guru:</span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">{rec.recommendations}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                <span>Rencana Tindak Lanjut: <strong>{rec.followUpPlan}</strong></span>
                <span className="font-mono">Nilai Kualitas: {rec.workQualityScore}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Monitoring Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 my-8 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#E85D9E]" />
                Catat Log Kunjungan Supervisi Guru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMonitoring} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Pilih Siswa yang Dimonitor
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.classGrade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tanggal Kunjungan
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Bentuk Kunjungan
                  </label>
                  <select
                    value={visitType}
                    onChange={e => setVisitType(e.target.value as 'onsite' | 'virtual')}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  >
                    <option value="onsite">Onsite (Ke Perusahaan)</option>
                    <option value="virtual">Virtual / Video Call</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Progres Magang (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={e => setProgressPercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Nilai Presensi
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceScore}
                    onChange={e => setAttendanceScore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kualitas Kerja
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={qualityScore}
                    onChange={e => setQualityScore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-bold tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kendala yang Ditemukan di Industri
                </label>
                <textarea
                  value={challenges}
                  onChange={e => setChallenges(e.target.value)}
                  placeholder="Kendala adaptasi, komunikasi, atau teknis..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Rekomendasi Guru untuk Siswa & Mentor
                </label>
                <textarea
                  value={recommendations}
                  onChange={e => setRecommendations(e.target.value)}
                  placeholder="Catatan arahan dan motivasi..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tindak Lanjut Berikutnya
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kunjungan kedua evaluasi akhir bulan depan"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold"
                >
                  Simpan Laporan Supervisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
