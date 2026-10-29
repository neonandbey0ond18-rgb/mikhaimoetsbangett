import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Plus,
  AlertCircle,
  Clock,
  User,
  X,
  Send,
  Pin,
} from 'lucide-react';
import { AnnouncementItem, UserRole } from '../../types';

export const AnnouncementsView: React.FC = () => {
  const { currentUser, announcements, addAnnouncement, showToast } = useApp();

  const canPost = ['admin_sekolah', 'admin_perusahaan', 'guru', 'superadmin'].includes(
    currentUser?.role || ''
  );

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementItem['priority']>('normal');
  const [targetRole, setTargetRole] = useState<'all' | UserRole>('all');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Judul dan isi pengumuman wajib diisi', 'error');
      return;
    }

    addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      priority,
      targetRole,
    });

    setShowModal(false);
    setTitle('');
    setContent('');
  };

  const userRole = currentUser?.role || 'siswa';
  const visibleAnnouncements = announcements.filter(
    a => a.targetRole === 'all' || a.targetRole === userRole || canPost
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Pusat Informasi & Pengumuman
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Siaran Resmi Sekolah & Industri</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Papan Pengumuman Magang
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Pemberitahuan administratif, jadwal pengumpulan laporan, dan informasi townhall industri.
            </p>
          </div>

          {canPost && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pengumuman Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {visibleAnnouncements.map(anc => {
          const isUrgent = anc.priority === 'penting' || anc.priority === 'darurat';
          return (
            <div
              key={anc.id}
              className={`p-5 rounded-2xl bg-white dark:bg-gray-900 border transition shadow-2xs space-y-2.5 ${
                isUrgent
                  ? 'border-rose-300 dark:border-rose-900/60'
                  : 'border-neutral-200/80 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isUrgent && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
                      Penting
                    </span>
                  )}
                  <span className="text-xs text-neutral-400 font-mono">{anc.createdAt}</span>
                </div>
                <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 dark:bg-gray-800 px-2 py-0.5 rounded-md capitalize">
                  Target: {anc.targetRole === 'all' ? 'Semua Pengguna' : anc.targetRole}
                </span>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {anc.title}
              </h3>

              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {anc.content}
              </p>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#E85D9E]" />
                <span>Dipublikasikan oleh: <strong>{anc.author}</strong> ({anc.authorRole})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#E85D9E]" />
                Publikasikan Pengumuman
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Batas Akhir Unggah Bab 2 Laporan Magang"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="penting">Penting / Segera</option>
                    <option value="darurat">Darurat</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Target Audiens
                  </label>
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  >
                    <option value="all">Semua Pengguna</option>
                    <option value="siswa">Khusus Siswa</option>
                    <option value="mentor">Khusus Mentor</option>
                    <option value="guru">Khusus Guru</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Isi Pengumuman
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Tuliskan isi pengumuman atau instruksi dengan jelas..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold"
                >
                  Publikasikan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
