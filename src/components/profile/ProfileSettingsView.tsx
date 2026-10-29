import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Bell,
  Lock,
  CheckCircle2,
  Save,
  Phone,
  Mail,
  Building,
  GraduationCap,
} from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, setCurrentUser, showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [notifyAttendance, setNotifyAttendance] = useState(true);
  const [notifyJournal, setNotifyJournal] = useState(true);
  const [notifyTask, setNotifyTask] = useState(true);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      avatar: avatar.trim() || currentUser.avatar,
    });

    showToast('Profil pengguna berhasil diperbarui!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      showToast('Mohon isi kata sandi lama dan baru', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok', 'error');
      return;
    }
    showToast('Kata sandi berhasil diperbarui dengan aman.', 'success');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#E85D9E] shadow-xs"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#302633] dark:text-white">
              {currentUser?.name}
            </h1>
            <p className="text-xs text-[#E85D9E] font-semibold uppercase tracking-wider">
              Peran: {currentUser?.role.replace('_', ' ')}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {currentUser?.schoolName || currentUser?.companyName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <form
          onSubmit={handleUpdateProfile}
          className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <User className="w-4 h-4 text-[#E85D9E]" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Informasi Pribadi
            </h2>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Nama Lengkap & Gelar
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Email Akun
            </label>
            <input
              type="email"
              value={currentUser?.email}
              disabled
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-gray-800/60 text-neutral-500 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              URL Foto Profil
            </label>
            <input
              type="text"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <form
          onSubmit={handleChangePassword}
          className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Lock className="w-4 h-4 text-[#E85D9E]" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Ganti Kata Sandi
            </h2>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Kata Sandi Lama
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 font-bold transition"
            >
              Perbarui Sandi
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences & Privacy */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <Bell className="w-4 h-4 text-[#E85D9E]" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Preferensi Notifikasi & Kebijakan Privasi
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Pengingat Presensi & Keterlambatan</p>
              <p className="text-[11px] text-neutral-500">Kirim pemberitahuan in-app saat mendekati jam masuk</p>
            </div>
            <input
              type="checkbox"
              checked={notifyAttendance}
              onChange={e => setNotifyAttendance(e.target.checked)}
              className="w-4 h-4 text-[#E85D9E] rounded focus:ring-[#E85D9E]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Persetujuan & Revisi Jurnal Harian</p>
              <p className="text-[11px] text-neutral-500">Notifikasi saat mentor memberikan komentar atau verifikasi jurnal</p>
            </div>
            <input
              type="checkbox"
              checked={notifyJournal}
              onChange={e => setNotifyJournal(e.target.checked)}
              className="w-4 h-4 text-[#E85D9E] rounded focus:ring-[#E85D9E]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Deadline Tugas & Proyek Industri</p>
              <p className="text-[11px] text-neutral-500">Peringatan 24 jam sebelum batas pengumpulan tugas berakhir</p>
            </div>
            <input
              type="checkbox"
              checked={notifyTask}
              onChange={e => setNotifyTask(e.target.checked)}
              className="w-4 h-4 text-[#E85D9E] rounded focus:ring-[#E85D9E]"
            />
          </label>
        </div>

        <div className="p-3 rounded-xl bg-[#FFF8FC] dark:bg-gray-800/40 text-[11px] text-neutral-600 dark:text-neutral-400 border border-[#E85D9E]/20">
          ✓ Data pribadi Anda dilindungi sesuai regulasi privasi perlindungan data pendidikan dan tidak pernah disebarluaskan ke pihak ketiga tanpa persetujuan resmi.
        </div>
      </div>
    </div>
  );
};
