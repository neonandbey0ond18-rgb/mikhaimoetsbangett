import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  ExternalLink,
  Plus,
  Search,
  CheckCircle,
  Clock,
  X,
  Send,
} from 'lucide-react';
import { Company, InternshipProgram } from '../../types';

export const CompaniesProgramView: React.FC = () => {
  const { currentUser, companies, programs, showToast } = useApp();

  const isStudent = currentUser?.role === 'siswa';

  const [searchQuery, setSearchQuery] = useState('');
  const [modelFilter, setModelFilter] = useState<'all' | 'onsite' | 'hybrid' | 'remote'>('all');
  const [selectedProgram, setSelectedProgram] = useState<InternshipProgram | null>(null);

  // Application modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    showToast(`Lamaran untuk "${selectedProgram.title}" di ${selectedProgram.companyName} berhasil diajukan ke HR!`, 'success');
    setShowApplyModal(false);
    setSelectedProgram(null);
    setCoverNote('');
    setPortfolioLink('');
  };

  const filteredPrograms = programs.filter(p => {
    const matchesModel = modelFilter === 'all' || p.workModel === modelFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Jejaring Mitra Industri
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Lowongan & Program Magang DUDI</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Mitra Perusahaan & Program Magang
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Telusuri lowongan magang resmi, persyaratan kompetensi, model kerja, dan ajukan pendaftaran.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Companies Showcase Strip */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Perusahaan Mitra Resmi MagangKu
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {companies.map(comp => (
            <div
              key={comp.id}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-2 hover:border-[#E85D9E]/40 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={comp.logo}
                  alt={comp.name}
                  className="w-10 h-10 rounded-xl object-cover border"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {comp.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 truncate">{comp.city}</p>
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">{comp.description}</p>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <span className="capitalize font-semibold text-[#E85D9E]">{comp.workModel}</span>
                <span>Kuota: {comp.quota} siswa</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Vacancies Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari program, posisi, keahlian..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 dark:bg-gray-800 rounded-xl text-xs">
            {(['all', 'onsite', 'hybrid', 'remote'] as const).map(model => (
              <button
                key={model}
                onClick={() => setModelFilter(model)}
                className={`px-3 py-1 font-semibold rounded-lg capitalize whitespace-nowrap transition ${
                  modelFilter === model
                    ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {model === 'all' ? 'Semua Model' : model}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Open Internship Programs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map(prog => (
          <div
            key={prog.id}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-[#E85D9E]/40 transition"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FFF8FC] text-[#E85D9E] border border-[#E85D9E]/20">
                  {prog.workModel}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Sisa Kuota: {prog.quota - prog.registeredCount} kursi
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {prog.title}
                </h3>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                  {prog.companyName}
                </p>
                <p className="text-[11px] text-neutral-400">Divisi: {prog.department} · {prog.location}</p>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {prog.description}
              </p>

              {/* Requirements */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Kualifikasi:</span>
                <div className="flex flex-wrap gap-1">
                  {prog.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-neutral-100 dark:bg-gray-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-md"
                    >
                      ✓ {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Periode: {prog.startDate} s/d {prog.endDate}
              </span>
              {isStudent && (
                <button
                  onClick={() => {
                    setSelectedProgram(prog);
                    setShowApplyModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
                >
                  Daftar Magang
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Daftar Program: {selectedProgram.title}
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-neutral-600 dark:text-neutral-300">
              Anda mendaftar ke <strong>{selectedProgram.companyName}</strong> sebagai calon peserta magang.
            </p>

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Surat Pengantar Singkat / Pernyataan Motivasi
                </label>
                <textarea
                  value={coverNote}
                  onChange={e => setCoverNote(e.target.value)}
                  placeholder="Ceritakan latar belakang, ketertarikan, dan kesiapan Anda..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tautan Portofolio / CV Online (GitHub / Figma / Drive)
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/... atau https://..."
                  value={portfolioLink}
                  onChange={e => setPortfolioLink(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold"
                >
                  Kirim Lamaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
