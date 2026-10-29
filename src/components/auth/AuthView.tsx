import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Briefcase,
  Users,
  Shield,
  Building,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { login, switchRole, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nisn, setNisn] = useState('');
  const [classGrade, setClassGrade] = useState('XII Rekayasa Perangkat Lunak 1');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const demoAccounts: { role: UserRole; name: string; email: string; label: string; org: string }[] = [
    {
      role: 'siswa',
      name: 'Anisa Rahmawati',
      email: 'anisa.siswa@magangku.id',
      label: 'Siswa Magang',
      org: 'SMKN 1 Jakarta → Tokopedia',
    },
    {
      role: 'mentor',
      name: 'Budi Hartono, S.Kom.',
      email: 'budi.mentor@tokopedia.com',
      label: 'Pembimbing Industri',
      org: 'PT Tokopedia (GoTo)',
    },
    {
      role: 'guru',
      name: 'Dra. Siti Nurhaliza',
      email: 'siti.guru@smkn1jakarta.sch.id',
      label: 'Guru Pembimbing',
      org: 'SMK Negeri 1 Jakarta',
    },
    {
      role: 'admin_sekolah',
      name: 'Drs. H. Bambang Subagyo',
      email: 'bambang.hubin@smkn1jakarta.sch.id',
      label: 'Admin Sekolah (Hubin)',
      org: 'SMK Negeri 1 Jakarta',
    },
    {
      role: 'admin_perusahaan',
      name: 'Maya Indrawati, S.Psi.',
      email: 'maya.hr@tokopedia.com',
      label: 'HR Perusahaan Mitra',
      org: 'PT Tokopedia (GoTo)',
    },
    {
      role: 'superadmin',
      name: 'Raden Wijaya, M.Kom.',
      email: 'superadmin@magangku.id',
      label: 'Superadmin Sistem',
      org: 'Pusat Jaringan MagangKu',
    },
  ];

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Masukkan alamat email', 'error');
      return;
    }
    const success = login(email.trim());
    if (!success) {
      // Fallback: log in as student or the first matching role
      login('anisa.siswa@magangku.id', 'siswa');
      showToast('Masuk dengan profil demo Siswa', 'info');
    }
  };

  const handleManualRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Nama dan email wajib diisi', 'error');
      return;
    }
    // Switch to student demo
    switchRole('siswa');
    showToast(`Akun siswa ${name} berhasil didaftarkan dan login!`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-[#FFF8FC] via-white to-[#FCE7F3]/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl overflow-hidden">
        {/* Left Side: Brand Story & Quick Demo Logins */}
        <div className="p-6 sm:p-8 bg-[#FFF8FC] dark:bg-gray-800/60 border-b md:border-b-0 md:border-r border-neutral-200/70 dark:border-neutral-800 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E85D9E] to-[#D9468D] flex items-center justify-center text-white font-bold text-base shadow-xs">
                M
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-[#302633] dark:text-white">
                  Magang<span className="text-[#E85D9E]">Ku</span>
                </span>
                <p className="text-[10px] text-neutral-400 font-medium">Your Internship, Organized.</p>
              </div>
            </div>

            <h2 className="text-sm font-bold text-[#302633] dark:text-white pt-2">
              Masuk Cepat Demo Peran (1-Klik):
            </h2>
            <p className="text-[11px] text-neutral-500">
              Pilih salah satu peran di bawah untuk langsung menguji fungsionalitas sistem:
            </p>

            <div className="space-y-1.5 pt-1">
              {demoAccounts.map(demo => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => switchRole(demo.role)}
                  className="w-full p-2 rounded-xl border border-neutral-200/70 dark:border-neutral-700 bg-white dark:bg-gray-900 hover:border-[#E85D9E] hover:bg-[#FFF8FC] dark:hover:bg-gray-800 transition text-left flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-[#E85D9E] transition truncate">
                      {demo.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {demo.label} · {demo.org}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2 py-0.5 rounded-md shrink-0">
                    Masuk →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-neutral-400 flex items-center justify-between">
            <span>MagangKu Multi-Role Platform</span>
            <span>v1.4 Production</span>
          </div>
        </div>

        {/* Right Side: Traditional Login / Register Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-center space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {mode === 'login' ? 'Masuk ke Portal' : 'Pendaftaran Siswa Baru'}
            </h2>
            <p className="text-xs text-neutral-500">
              {mode === 'login'
                ? 'Gunakan akun Anda atau salah satu akun demo di sebelah kiri.'
                : 'Lengkapi identitas untuk pendaftaran kegiatan magang.'}
            </p>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="nama@magangku.id"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-[#E85D9E] hover:underline"
                  >
                    Lupa Sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold text-xs shadow-xs transition"
              >
                Masuk Sekarang
              </button>

              <div className="text-center pt-2">
                <span className="text-neutral-500">Belum memiliki akun siswa? </span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#E85D9E] hover:underline"
                >
                  Daftar di sini
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleManualRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Rizky"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    NISN (10 Digit)
                  </label>
                  <input
                    type="text"
                    placeholder="0061234567"
                    value={nisn}
                    onChange={e => setNisn(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kelas & Jurusan
                  </label>
                  <input
                    type="text"
                    value={classGrade}
                    onChange={e => setClassGrade(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Alamat Email Siswa
                </label>
                <input
                  type="email"
                  placeholder="rizky@smkn1jakarta.sch.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold text-xs shadow-xs transition"
              >
                Daftar & Masuk
              </button>

              <div className="text-center pt-1">
                <span className="text-neutral-500">Sudah punya akun? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#E85D9E] hover:underline"
                >
                  Kembali ke login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Pemulihan Kata Sandi
            </h3>
            <p className="text-neutral-500">
              Masukkan alamat email Anda untuk menerima tautan instruksi reset kata sandi.
            </p>
            <input
              type="email"
              placeholder="nama@email.com"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 rounded-xl text-neutral-500 hover:bg-neutral-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Tautan reset kata sandi telah dikirimkan ke email Anda.', 'success');
                  setShowForgotModal(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#E85D9E] text-white font-bold"
              >
                Kirim Tautan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
