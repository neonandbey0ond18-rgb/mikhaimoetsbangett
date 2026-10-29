import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Filter,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CalendarEvent } from '../../types';

export const CalendarScheduleView: React.FC = () => {
  const { currentUser, calendarEvents, addCalendarEvent, showToast } = useApp();

  const isMentorOrAdmin = ['mentor', 'guru', 'admin_sekolah', 'admin_perusahaan', 'superadmin'].includes(
    currentUser?.role || ''
  );

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-04');
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('11:00');
  const [eventCategory, setEventCategory] = useState<CalendarEvent['category']>('kerja');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLocation, setEventLocation] = useState('Kantor Tokopedia Tower');

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showToast('Judul kegiatan wajib diisi', 'error');
      return;
    }

    addCalendarEvent({
      title: eventTitle.trim(),
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      category: eventCategory,
      description: eventDesc.trim(),
      location: eventLocation.trim() || undefined,
      targetRole: 'all',
    });

    setShowAddModal(false);
    setEventTitle('');
    setEventDesc('');
  };

  const filteredEvents = calendarEvents.filter(ev => {
    return categoryFilter === 'all' || ev.category === categoryFilter;
  });

  const getCategoryColor = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'kerja':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'deadline':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200';
      case 'kunjungan':
      case 'monitoring':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200';
      case 'evaluasi':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200';
      case 'libur':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Jadwal & Agenda Magang
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Kalender Kegiatan DUDI</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Kalender Kegiatan & Agenda
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Jadwal jam kerja, deadline sprint, kunjungan supervisi guru, evaluasi tengah periode, dan hari libur.
            </p>
          </div>

          {isMentorOrAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Acara / Agenda</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Category */}
      <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-neutral-400 mr-2 shrink-0 font-medium">Filter Kategori:</span>
        {[
          { id: 'all', label: 'Semua Agenda' },
          { id: 'kerja', label: 'Kerja & Sprint' },
          { id: 'deadline', label: 'Deadline Tugas' },
          { id: 'kunjungan', label: 'Kunjungan Guru' },
          { id: 'evaluasi', label: 'Evaluasi Nilai' },
          { id: 'libur', label: 'Hari Libur' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition ${
              categoryFilter === cat.id
                ? 'bg-[#E85D9E] text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events Agenda List */}
      <div className="space-y-3">
        {filteredEvents.map(ev => (
          <div
            key={ev.id}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:border-[#E85D9E]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getCategoryColor(ev.category)}`}>
                  {ev.category}
                </span>
                <span className="text-neutral-300">·</span>
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 font-mono">
                  {ev.date}
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {ev.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
                {ev.description}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0 space-y-1 text-xs">
              <div className="flex items-center sm:justify-end gap-1.5 text-neutral-500 dark:text-neutral-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{ev.startTime} - {ev.endTime} WIB</span>
              </div>
              {ev.location && (
                <div className="flex items-center sm:justify-end gap-1.5 text-[#E85D9E] font-medium text-[11px]">
                  <MapPin className="w-3 h-3" />
                  <span>{ev.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#E85D9E]" />
                Tambah Agenda Magang
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nama Agenda / Acara
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Supervisi Tengah Magang SMKN 1 Jakarta"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={eventCategory}
                    onChange={e => setEventCategory(e.target.value as CalendarEvent['category'])}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  >
                    <option value="kerja">Kerja & Sprint</option>
                    <option value="deadline">Deadline Tugas</option>
                    <option value="kunjungan">Kunjungan Guru</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="evaluasi">Evaluasi Nilai</option>
                    <option value="libur">Hari Libur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={e => setEventStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={e => setEventEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Lokasi / Ruang Virtual
                </label>
                <input
                  type="text"
                  placeholder="Tokopedia Tower Lt 18 / Google Meet"
                  value={eventLocation}
                  onChange={e => setEventLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Deskripsi Agenda
                </label>
                <textarea
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  placeholder="Rincian pembahasan atau persiapan..."
                  rows={2}
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
