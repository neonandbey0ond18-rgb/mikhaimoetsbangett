import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Sparkles,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Tag,
  ThumbsUp,
  X,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { DailyJournal, JournalStatus } from '../../types';

export const JournalView: React.FC = () => {
  const {
    currentUser,
    journals,
    addJournal,
    updateJournal,
    reviewJournal,
    showToast,
  } = useApp();

  const isStudent = currentUser?.role === 'siswa';
  const isMentor = currentUser?.role === 'mentor';
  const isTeacher = currentUser?.role === 'guru';

  const today = new Date().toISOString().split('T')[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJournal, setSelectedJournal] = useState<DailyJournal | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);

  // Form states
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend Development');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('16:30');
  const [description, setDescription] = useState('');
  const [output, setOutput] = useState('');
  const [competencies, setCompetencies] = useState('React, TypeScript, CSS');
  const [challenges, setChallenges] = useState('');
  const [solution, setSolution] = useState('');
  const [reflection, setReflection] = useState('');
  const [tags, setTags] = useState('Web, Feature, Testing');
  const [documentationUrl, setDocumentationUrl] = useState('');
  const [status, setStatus] = useState<JournalStatus>('diajukan');

  // AI polishing state
  const [isPolishing, setIsPolishing] = useState(false);

  // Review states
  const [reviewNote, setReviewNote] = useState('');

  const openNewJournalModal = () => {
    setEditingJournalId(null);
    setDate(today);
    setTitle('');
    setCategory('Frontend Development');
    setStartTime('08:30');
    setEndTime('16:30');
    setDescription('');
    setOutput('');
    setCompetencies('');
    setChallenges('');
    setSolution('');
    setReflection('');
    setTags('');
    setDocumentationUrl('');
    setStatus('diajukan');
    setShowEditorModal(true);
  };

  const openEditJournalModal = (jrn: DailyJournal) => {
    setEditingJournalId(jrn.id);
    setDate(jrn.date);
    setTitle(jrn.title);
    setCategory(jrn.category);
    setStartTime(jrn.startTime);
    setEndTime(jrn.endTime);
    setDescription(jrn.description);
    setOutput(jrn.output);
    setCompetencies(jrn.competenciesLearned.join(', '));
    setChallenges(jrn.challenges);
    setSolution(jrn.solution);
    setReflection(jrn.reflection);
    setTags(jrn.tags.join(', '));
    setDocumentationUrl(jrn.documentationUrl || '');
    setStatus(jrn.status);
    setShowEditorModal(true);
  };

  // AI Assistant: Polish Indonesian Technical Prose
  const handleAIAssist = () => {
    if (!description.trim() && !title.trim()) {
      showToast('Tuliskan poin-poin kegiatan kasar terlebih dahulu sebelum meminta bantuan AI.', 'info');
      return;
    }
    setIsPolishing(true);
    setTimeout(() => {
      setIsPolishing(false);
      // Polish the description and generate a refined reflection based on what the student wrote
      const polishedDesc = description
        ? `Melakukan ${description.trim()}. Mengimplementasikan standard operational procedure industri dengan memisahkan logic komponen dan state handler agar modular dan mudah di-maintain.`
        : 'Mengembangkan komponen antarmuka responsif sesuai wireframe desain dan standar clean code tim squad.';
      const polishedOutput = output
        ? `${output.trim()} (Tervalidasi sesuai requirement PR).`
        : 'Komponen berhasil terintegrasi, unit test lulus tanpa error console.';
      const polishedReflection = reflection
        ? `${reflection.trim()} Pembelajaran utama adalah pentingnya ketelitian dalam struktur alur data dan dokumentasi kode.`
        : 'Memahami bagaimana sinkronisasi antarmuka dan pengelolaan state sangat krusial bagi kenyamanan pengguna akhir.';

      setDescription(polishedDesc);
      if (!output) setOutput(polishedOutput);
      if (!reflection) setReflection(polishedReflection);
      if (!competencies) setCompetencies('React Framework, Clean Architecture, Problem Solving');
      showToast('AI Asisten berhasil merapikan draft jurnal teknis Anda. Silakan review dan sesuaikan!', 'success');
    }, 800);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Mohon lengkapi judul dan deskripsi kegiatan jurnal.', 'error');
      return;
    }

    const compArray = competencies.split(',').map(s => s.trim()).filter(Boolean);
    const tagArray = tags.split(',').map(s => s.trim()).filter(Boolean);

    if (editingJournalId) {
      const existing = journals.find(j => j.id === editingJournalId);
      if (!existing) return;
      updateJournal({
        ...existing,
        date,
        title: title.trim(),
        category,
        startTime,
        endTime,
        description: description.trim(),
        output: output.trim(),
        competenciesLearned: compArray,
        challenges: challenges.trim(),
        solution: solution.trim(),
        reflection: reflection.trim(),
        tags: tagArray,
        documentationUrl: documentationUrl.trim() || undefined,
        status,
      });
    } else {
      addJournal({
        date,
        title: title.trim(),
        category,
        startTime,
        endTime,
        description: description.trim(),
        output: output.trim(),
        competenciesLearned: compArray,
        challenges: challenges.trim(),
        solution: solution.trim(),
        reflection: reflection.trim(),
        tags: tagArray,
        documentationUrl: documentationUrl.trim() || undefined,
        status,
      });
    }

    setShowEditorModal(false);
  };

  // Filter journals
  const myJournals = isStudent
    ? journals.filter(j => j.studentId === currentUser?.id)
    : journals;

  const filteredJournals = myJournals.filter(j => {
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Jurnal Harian Magang
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Rekam Jejak Portofolio Industri</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Jurnal Aktivitas & Kompetensi
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Catat kemajuan teknis, output kerja, pemecahan masalah, dan refleksi harian.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isStudent && (
              <button
                onClick={openNewJournalModal}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Jurnal Baru</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-[#E85D9E] transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, kata kunci, tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 dark:bg-gray-800 rounded-xl">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'disetujui', label: 'Disetujui' },
              { id: 'diajukan', label: 'Diajukan' },
              { id: 'perlu_revisi', label: 'Perlu Revisi' },
              { id: 'draft', label: 'Draft' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800">
            <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Belum ada catatan jurnal
            </p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              {isStudent
                ? 'Mulai catat kegiatan praktik kerja lapangan hari ini untuk direview oleh mentor industri.'
                : 'Tidak ada jurnal yang sesuai dengan kriteria pencarian.'}
            </p>
            {isStudent && (
              <button
                onClick={openNewJournalModal}
                className="mt-4 px-4 py-2 rounded-xl bg-[#E85D9E] text-white text-xs font-bold shadow-xs hover:bg-[#D9468D]"
              >
                Tulis Jurnal Pertama
              </button>
            )}
          </div>
        ) : (
          filteredJournals.map(jrn => {
            const isApproved = jrn.status === 'disetujui';
            const isRevision = jrn.status === 'perlu_revisi';
            const isPending = jrn.status === 'diajukan';

            return (
              <div
                key={jrn.id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:border-[#E85D9E]/40 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-neutral-500">
                        {jrn.date}
                      </span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {jrn.startTime} - {jrn.endTime} WIB
                      </span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-xs font-medium text-[#E85D9E] bg-[#FFF8FC] px-2 py-0.5 rounded-md border border-[#E85D9E]/20">
                        {jrn.category}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                      {jrn.title}
                    </h3>
                    {!isStudent && (
                      <p className="text-xs text-neutral-500">Oleh: <strong>{jrn.studentName}</strong></p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : isRevision
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {jrn.status.replace('_', ' ')}
                    </span>

                    {isStudent && (jrn.status === 'draft' || jrn.status === 'perlu_revisi') && (
                      <button
                        onClick={() => openEditJournalModal(jrn)}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-[#E85D9E] hover:border-[#E85D9E]"
                        title="Edit jurnal"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {jrn.description}
                </p>

                {/* Technical highlights grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">Hasil / Output:</span>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">{jrn.output}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">Kendala & Solusi:</span>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {jrn.challenges} → {jrn.solution}
                    </p>
                  </div>
                </div>

                {jrn.reflection && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-300 italic bg-[#FFF8FC] dark:bg-gray-800/60 p-2.5 rounded-lg border-l-2 border-[#E85D9E]">
                    Refleksi & Pembelajaran: "{jrn.reflection}"
                  </div>
                )}

                {/* Tags and Mentor Feedback */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {jrn.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-neutral-500 bg-neutral-100 dark:bg-gray-800 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {jrn.mentorFeedback && (
                    <div className="text-xs text-[#E85D9E] font-medium flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Catatan Mentor: "{jrn.mentorFeedback}"</span>
                    </div>
                  )}

                  {!isStudent && jrn.status === 'diajukan' && (
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => {
                          const note = prompt('Catatan revisi untuk siswa:');
                          if (note) reviewJournal(jrn.id, 'perlu_revisi', note);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                      >
                        Minta Revisi
                      </button>
                      <button
                        onClick={() =>
                          reviewJournal(
                            jrn.id,
                            'disetujui',
                            'Jurnal diverifikasi dan disetujui mentor industri.'
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Setujui</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Journal Editor Modal */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#E85D9E]" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {editingJournalId ? 'Edit Jurnal Harian' : 'Tulis Jurnal Harian Magang'}
                </h3>
              </div>
              <button
                onClick={() => setShowEditorModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJournal} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Judul Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Implementasi Redux State & Form Validation"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kategori Pekerjaan
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend & API">Backend & API</option>
                    <option value="UI/UX Design & Prototyping">UI/UX Design & Prototyping</option>
                    <option value="Quality Assurance & Testing">Quality Assurance & Testing</option>
                    <option value="DevOps & Cloud Server">DevOps & Cloud Server</option>
                    <option value="Maintenance & Bug Fixing">Maintenance & Bug Fixing</option>
                  </select>
                </div>
              </div>

              {/* Description + AI Polish Assistant */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Deskripsi Detail Pekerjaan
                  </label>
                  <button
                    type="button"
                    onClick={handleAIAssist}
                    disabled={isPolishing}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#E85D9E] to-purple-600 text-white font-semibold text-[11px] shadow-2xs hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isPolishing ? 'Merapikan dengan AI...' : 'Rapikan Draft via AI Asisten'}</span>
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ceritakan apa yang Anda kerjakan, teknik yang digunakan, dan komponen yang dibuat..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Output / Hasil Pekerjaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PR branch #104 terbuat, 3 bug terselesaikan"
                    value={output}
                    onChange={e => setOutput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kompetensi yang Dipelajari (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="React Hooks, TypeScript, Git Branching"
                    value={competencies}
                    onChange={e => setCompetencies(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kendala yang Dihadapi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Infinite loop pada useEffect re-fetching"
                    value={challenges}
                    onChange={e => setChallenges(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Solusi yang Dilakukan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Menambahkan AbortController dan dependency array"
                    value={solution}
                    onChange={e => setSolution(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Refleksi / Pembelajaran Pribadi
                </label>
                <textarea
                  value={reflection}
                  onChange={e => setReflection(e.target.value)}
                  placeholder="Pelajaran apa yang dapat diambil untuk perbaikan ke depan..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tag Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="React, CSS, Bugfix"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tautan Dokumentasi Screenshot / PR (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/... atau screenshot link"
                    value={documentationUrl}
                    onChange={e => setDocumentationUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-neutral-600">Simpan Sebagai:</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as JournalStatus)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-800 font-bold text-[#E85D9E]"
                  >
                    <option value="diajukan">Ajukan ke Mentor</option>
                    <option value="draft">Simpan Draft</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditorModal(false)}
                    className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold shadow-xs"
                  >
                    Simpan Jurnal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
