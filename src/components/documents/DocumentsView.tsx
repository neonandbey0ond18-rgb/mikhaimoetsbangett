import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  UploadCloud,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  FileCheck,
  Search,
  Plus,
  X,
  FileCode,
} from 'lucide-react';
import { DocumentItem } from '../../types';

export const DocumentsView: React.FC = () => {
  const {
    currentUser,
    documents,
    addDocument,
    verifyDocument,
    showToast,
  } = useApp();

  const isStudent = currentUser?.role === 'siswa';
  const canVerify = ['admin_sekolah', 'admin_perusahaan', 'guru', 'superadmin'].includes(
    currentUser?.role || ''
  );

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload form state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentItem['category']>('laporan_mingguan');
  const [docFileName, setDocFileName] = useState('');
  const [docFileSize, setDocFileSize] = useState('1.5 MB');

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // File validation: limit 15MB
      if (file.size > 15 * 1024 * 1024) {
        showToast('Ukuran file melebihi batas maksimum 15MB', 'error');
        return;
      }
      setDocFileName(file.name);
      setDocFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      showToast('Judul dokumen wajib diisi', 'error');
      return;
    }

    addDocument({
      title: docTitle.trim(),
      category: docCategory,
      fileUrl: '/documents/' + (docFileName || 'dokumen.pdf'),
      fileName: docFileName || `${docTitle.trim().replace(/\s+/g, '_')}.pdf`,
      fileSize: docFileSize,
      status: 'menunggu_verifikasi',
      accessRoles: ['siswa', 'mentor', 'guru', 'admin_sekolah', 'admin_perusahaan'],
    });

    setShowUploadModal(false);
    setDocTitle('');
    setDocFileName('');
  };

  const downloadFileSimulation = (doc: DocumentItem) => {
    showToast(`Mengunduh berkas: ${doc.fileName}...`, 'info');
    // Generate text blob for download
    const blob = new Blob([`MagangKu Verified Document: ${doc.title}\nUploaded by: ${doc.ownerName}\nCategory: ${doc.category}\nStatus: ${doc.status}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName || `${doc.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredDocs = documents.filter(d => {
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Document Center
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Pusat Berkas & Arsip Resmi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Dokumen & Laporan Magang
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Kelola CV, Surat Pengantar, Letter of Acceptance, Laporan Akhir, dan Portofolio.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Unggah Dokumen</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berkas, nama siswa, surat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 dark:bg-gray-800 rounded-xl">
            {[
              { id: 'all', label: 'Semua Berkas' },
              { id: 'surat_pengantar', label: 'Surat Pengantar' },
              { id: 'surat_penerimaan', label: 'Penerimaan (LoA)' },
              { id: 'cv', label: 'CV & Resume' },
              { id: 'laporan_akhir', label: 'Laporan Akhir' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition ${
                  categoryFilter === cat.id
                    ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => {
          const isApproved = doc.status === 'disetujui';
          const isPending = doc.status === 'menunggu_verifikasi';
          const isRejected = doc.status === 'ditolak';

          return (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:border-[#E85D9E]/40 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF8FC] dark:bg-gray-800 border border-[#E85D9E]/20 text-[#E85D9E] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : isPending
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                    }`}
                  >
                    {doc.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                    Pemilik: <strong>{doc.ownerName}</strong>
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                    {doc.fileName} · {doc.fileSize}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                {doc.verifiedBy && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Diverifikasi oleh: {doc.verifiedBy}</span>
                  </p>
                )}

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => downloadFileSimulation(doc)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-neutral-50 dark:bg-gray-800 hover:bg-[#FFF8FC] text-neutral-700 dark:text-neutral-300 font-semibold text-xs border border-neutral-200 dark:border-neutral-700 hover:border-[#E85D9E] transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#E85D9E]" />
                    <span>Unduh Berkas</span>
                  </button>

                  {canVerify && isPending && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => verifyDocument(doc.id, 'ditolak')}
                        className="px-2 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                        title="Tolak berkas"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => verifyDocument(doc.id, 'disetujui')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        title="Verifikasi & Setujui"
                      >
                        Verifikasi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#E85D9E]" />
                Unggah Dokumen Magang
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kategori Dokumen
                </label>
                <select
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value as DocumentItem['category'])}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                >
                  <option value="cv">Curriculum Vitae (CV) & Portofolio</option>
                  <option value="surat_pengantar">Surat Pengantar Sekolah</option>
                  <option value="surat_penerimaan">Surat Penerimaan Perusahaan (LoA)</option>
                  <option value="perjanjian">Surat Perjanjian / Tata Tertib</option>
                  <option value="laporan_mingguan">Laporan Mingguan</option>
                  <option value="laporan_akhir">Laporan Akhir PKL</option>
                  <option value="lainnya">Dokumen Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nama / Judul Dokumen
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Laporan Akhir PKL - Bab 1 sampai 4"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Pilih File Berkas (PDF, DOCX, ZIP maks 15MB)
                </label>
                <input
                  type="file"
                  onChange={handleSimulatedFileUpload}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FFF8FC] file:text-[#E85D9E] hover:file:bg-[#FCE7F3] cursor-pointer"
                />
                {docFileName && (
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                    ✓ File dipilih: {docFileName} ({docFileSize})
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold"
                >
                  Simpan & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
