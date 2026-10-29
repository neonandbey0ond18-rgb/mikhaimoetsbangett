import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  Award,
  Plus,
  Printer,
  CheckCircle,
  FileText,
  User,
  Sliders,
  ChevronRight,
  X,
} from 'lucide-react';
import { EvaluationItem } from '../../types';

export const EvaluationView: React.FC = () => {
  const {
    currentUser,
    users,
    evaluations,
    addOrUpdateEvaluation,
    showToast,
  } = useApp();

  const isStudent = currentUser?.role === 'siswa';
  const isMentor = currentUser?.role === 'mentor';
  const isTeacher = currentUser?.role === 'guru';

  const [periodTab, setPeriodTab] = useState<'tengah_periode' | 'akhir_periode'>('tengah_periode');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('user-siswa-1');

  // 12 criteria rubric states
  const [scores, setScores] = useState({
    kedisiplinan: 92,
    kehadiran: 95,
    tanggungJawab: 90,
    komunikasi: 88,
    kerjaSama: 90,
    inisiatif: 92,
    adaptasi: 90,
    pemecahanMasalah: 94,
    penguasaanKeterampilan: 95,
    kualitasPekerjaan: 94,
    sikapProfesional: 95,
    pencapaianTarget: 92,
  });

  const [notes, setNotes] = useState('');

  const criteriaList = [
    { key: 'kedisiplinan', label: 'Kedisiplinan & Ketaatan Aturan' },
    { key: 'kehadiran', label: 'Kehadiran & Ketepatan Waktu' },
    { key: 'tanggungJawab', label: 'Tanggung Jawab Penugasan' },
    { key: 'komunikasi', label: 'Komunikasi & Koordinasi Tim' },
    { key: 'kerjaSama', label: 'Kerja Sama (Teamwork)' },
    { key: 'inisiatif', label: 'Inisiatif & Proaktivitas' },
    { key: 'adaptasi', label: 'Kemampuan Adaptasi Budaya Kerja' },
    { key: 'pemecahanMasalah', label: 'Pemecahan Masalah (Problem Solving)' },
    { key: 'penguasaanKeterampilan', label: 'Penguasaan Keterampilan Teknis (Hard Skills)' },
    { key: 'kualitasPekerjaan', label: 'Kualitas & Ketelitian Hasil Kerja' },
    { key: 'sikapProfesional', label: 'Sikap & Etika Profesional' },
    { key: 'pencapaianTarget', label: 'Pencapaian Target Tugas Sprint' },
  ];

  const students = users.filter(u => u.role === 'siswa');

  const calculateAverage = (sc: typeof scores) => {
    const vals = Object.values(sc);
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round((sum / vals.length) * 10) / 10;
  };

  const currentAverage = calculateAverage(scores);

  const getPredicate = (avg: number) => {
    if (avg >= 90) return 'Sangat Baik (A)';
    if (avg >= 80) return 'Baik (B)';
    if (avg >= 70) return 'Cukup (C)';
    return 'Kurang (D)';
  };

  const handleScoreChange = (key: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, val)),
    }));
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const student = users.find(u => u.id === selectedStudentId);
    if (!student) return;

    const avg = calculateAverage(scores);
    const predicate = getPredicate(avg);

    addOrUpdateEvaluation({
      studentId: student.id,
      studentName: student.name,
      evaluationPeriod: periodTab,
      scores,
      totalAverage: avg,
      predicate,
      notes: notes.trim() || 'Siswa menunjukkan performa yang memuaskan dan etos kerja tinggi.',
      status: 'final',
    });

    setShowFormModal(false);
  };

  // Filter evaluations for this period
  const periodEvaluations = evaluations.filter(e => e.evaluationPeriod === periodTab);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Sistem Evaluasi 12 Dimensi Kompetensi
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 font-mono">Standar Kurikulum Merdeka & Industri</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Evaluasi & Penilaian Magang
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Penilaian terstandar oleh mentor perusahaan, guru pembimbing, dan refleksi diri siswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isStudent && (
              <button
                onClick={() => setShowFormModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Input Nilai Siswa</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-[#E85D9E] transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Nilai</span>
            </button>
          </div>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-100 dark:bg-gray-800/80 rounded-2xl max-w-sm">
        <button
          onClick={() => setPeriodTab('tengah_periode')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            periodTab === 'tengah_periode'
              ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Evaluasi Tengah Periode
        </button>
        <button
          onClick={() => setPeriodTab('akhir_periode')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            periodTab === 'akhir_periode'
              ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Evaluasi Akhir Periode
        </button>
      </div>

      {/* Evaluations List Cards */}
      <div className="space-y-4">
        {periodEvaluations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <Award className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Belum ada data evaluasi untuk {periodTab.replace('_', ' ')}
            </p>
            <p className="text-xs text-neutral-400">
              Pembimbing industri dan guru pembimbing dapat memasukkan formulir penilaian rubrik 12 kompetensi.
            </p>
          </div>
        ) : (
          periodEvaluations.map(ev => (
            <div
              key={ev.id}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#E85D9E] bg-[#FFF8FC] px-2.5 py-0.5 rounded-full border border-[#E85D9E]/30 uppercase">
                      {ev.evaluationPeriod.replace('_', ' ')}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-xs text-neutral-400 font-mono">Disahkan: {ev.createdAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                    Lembar Penilaian: {ev.studentName}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Penilai: <strong>{ev.evaluatorName}</strong> ({ev.evaluatorRole.toUpperCase()})
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 text-right shrink-0">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Skor Rata-Rata</span>
                  <div className="text-2xl font-black text-[#E85D9E] tabular-nums font-mono">
                    {ev.totalAverage.toFixed(1)}
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{ev.predicate}</span>
                </div>
              </div>

              {/* 12 Competencies Rubric Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Rincian 12 Dimensi Kompetensi (Skala 0 - 100):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
                  {criteriaList.map(({ key, label }) => {
                    const val = (ev.scores as any)[key] || 90;
                    return (
                      <div
                        key={key}
                        className="p-2.5 rounded-xl bg-[#FFF8FC]/30 dark:bg-gray-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
                      >
                        <span className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate max-w-[150px]">
                          {label}
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white tabular-nums font-mono">
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              {ev.notes && (
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-gray-800/50 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    Ulasan & Rekomendasi Evaluator:
                  </span>
                  <p className="italic">"{ev.notes}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Score Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 sm:p-6 my-8 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-[#E85D9E]" />
                Formulir Evaluasi Rubrik 12 Kompetensi
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Pilih Siswa
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  >
                    {students.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.identifierNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tahapan Evaluasi
                  </label>
                  <select
                    value={periodTab}
                    onChange={e => setPeriodTab(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  >
                    <option value="tengah_periode">Evaluasi Tengah Periode (Mid-term)</option>
                    <option value="akhir_periode">Evaluasi Akhir Periode (Final)</option>
                  </select>
                </div>
              </div>

              {/* 12 sliders or number inputs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    Nilai Dimensi (0 - 100):
                  </span>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-400">Rata-rata: </span>
                    <span className="text-sm font-bold text-[#E85D9E] tabular-nums font-mono">
                      {currentAverage.toFixed(1)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 ml-1">
                      ({getPredicate(currentAverage)})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {criteriaList.map(({ key, label }) => {
                    const val = (scores as any)[key];
                    return (
                      <div
                        key={key}
                        className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-gray-800/40 space-y-1"
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[180px]">
                            {label}
                          </span>
                          <span className="font-bold text-[#E85D9E] tabular-nums">{val}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={val}
                          onChange={e => handleScoreChange(key, Number(e.target.value))}
                          className="w-full accent-[#E85D9E] h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Catatan & Rekomendasi
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Catatan prestasi siswa, pencapaian kompetensi, dan saran pengembangan..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold shadow-xs"
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
