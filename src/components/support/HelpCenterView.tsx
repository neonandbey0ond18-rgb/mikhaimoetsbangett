import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Plus,
  Send,
  MessageCircle,
  FileQuestion,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
} from 'lucide-react';
import { SupportTicket } from '../../types';

export const HelpCenterView: React.FC = () => {
  const { currentUser, tickets, addTicket, respondTicket, showToast } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // Form states
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('teknis');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('sedang');
  const [ticketDesc, setTicketDesc] = useState('');

  const faqs = [
    {
      q: 'Bagaimana cara melakukan absensi jika GPS browser tidak mendeteksi lokasi?',
      a: 'Sistem MagangKu menyediakan fallback verifikasi jaringan. Anda tetap dapat menekan tombol Check-In. Jika terjadi kendala koneksi total, ajukan permohonan "Koreksi Absensi" melalui menu Absensi disertai alasan.',
    },
    {
      q: 'Kapan batas pengisian jurnal harian magang?',
      a: 'Jurnal harian wajib diisi setiap hari kerja sebelum pukul 21:00 WIB. Jurnal yang belum disetujui dapat direvisi berdasarkan catatan feedback pembimbing industri.',
    },
    {
      q: 'Bagaimana cara memverifikasi keaslian sertifikat magang?',
      a: 'Setiap sertifikat resmi MagangKu memiliki Kode Verifikasi unik (misal: MGK-2026-TKP-088192). Masukkan kode tersebut pada tab "Verifikasi Keaslian" di menu Sertifikat Magang untuk memeriksa validitas dari pangkalan data sekolah & mitra industri.',
    },
    {
      q: 'Apa saja syarat penerbitan sertifikat magang?',
      a: 'Syarat penerbitan sertifikat meliputi: (1) Tingkat kehadiran minimal 80%, (2) Jurnal harian disetujui minimal 15 entri, (3) Laporan akhir PKL terunggah dan diverifikasi, (4) Nilai evaluasi kompetensi final telah disahkan oleh mentor dan guru.',
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDesc.trim()) {
      showToast('Judul dan rincian masalah wajib diisi', 'error');
      return;
    }

    addTicket({
      category: ticketCategory,
      title: ticketTitle.trim(),
      description: ticketDesc.trim(),
      priority: ticketPriority,
      status: 'terbuka',
    });

    setShowNewTicketModal(false);
    setTicketTitle('');
    setTicketDesc('');
  };

  const myTickets = currentUser?.role === 'superadmin'
    ? tickets
    : tickets.filter(t => t.userId === currentUser?.id);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Help & Support Center
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Pusat Bantuan & Tiket Laporan Masalah</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Bantuan Pengguna & Layanan Kendala
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Pelajari panduan penggunaan atau buat tiket bantuan jika mengalami kendala teknis maupun administratif.
            </p>
          </div>

          <button
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Laporan Masalah</span>
          </button>
        </div>
      </div>

      {/* Grid: FAQ & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-[#E85D9E]" />
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>

          <div className="space-y-2.5">
            {faqs.map((item, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full text-left p-3.5 flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-[#FFF8FC]/50 dark:hover:bg-gray-800/50 transition"
                  >
                    <span>{item.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#E85D9E] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="p-3.5 pt-0 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-[#FFF8FC]/30 dark:bg-gray-800/30">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Tickets Section */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-[#E85D9E]" />
              Tiket Laporan Masalah ({myTickets.length})
            </h2>
          </div>

          <div className="space-y-3">
            {myTickets.length === 0 ? (
              <p className="text-center py-10 text-neutral-400 text-xs italic">
                Belum ada tiket masalah yang diajukan.
              </p>
            ) : (
              myTickets.map(tkt => (
                <div
                  key={tkt.id}
                  className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-[#FFF8FC]/20 dark:bg-gray-800/40 text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">{tkt.title}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {tkt.createdAt} · Kategori: {tkt.category}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        tkt.status === 'selesai'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-300">{tkt.description}</p>

                  {tkt.responses.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 text-[11px] space-y-1">
                      <span className="font-bold text-[#E85D9E]">Tanggapan Admin:</span>
                      {tkt.responses.map((resp, i) => (
                        <p key={i} className="text-neutral-700 dark:text-neutral-300 italic">
                          "{resp.text}" — <span className="text-neutral-400 font-normal">{resp.senderName} ({resp.timestamp})</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {currentUser?.role === 'superadmin' && tkt.status !== 'selesai' && (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          const resp = prompt('Masukkan tanggapan penyelesaian masalah:');
                          if (resp) respondTicket(tkt.id, resp);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                      >
                        Tanggapi & Selesaikan
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-[#E85D9E]" />
                Kirim Tiket Laporan Masalah
              </h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kategori Masalah
                </label>
                <select
                  value={ticketCategory}
                  onChange={e => setTicketCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                >
                  <option value="teknis">Kendala Teknis Aplikasi / Bug</option>
                  <option value="administrasi">Administrasi & Surat Pengantar</option>
                  <option value="penempatan">Penempatan Perusahaan / Mentor</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Judul Kendala
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kesalahan format upload laporan akhir"
                  value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Prioritas
                </label>
                <select
                  value={ticketPriority}
                  onChange={e => setTicketPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                >
                  <option value="rendah">Rendah</option>
                  <option value="sedang">Sedang</option>
                  <option value="tinggi">Tinggi / Mendesak</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Rincian Deskripsi Masalah
                </label>
                <textarea
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  placeholder="Jelaskan kronologi kendala atau lampirkan nomor dokumen..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold"
                >
                  Kirim Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
