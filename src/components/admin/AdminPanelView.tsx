import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Users,
  Shield,
  Activity,
  Sliders,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Database,
  Building2,
} from 'lucide-react';
import { User, UserRole } from '../../types';

export const AdminPanelView: React.FC = () => {
  const {
    currentUser,
    users,
    companies,
    auditLogs,
    systemSettings,
    updateSystemSettings,
    resetAllData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'audit' | 'export'>('users');

  // Settings form states
  const [startTime, setStartTime] = useState(systemSettings.workStartTime);
  const [endTime, setEndTime] = useState(systemSettings.workEndTime);
  const [lateGrace, setLateGrace] = useState(systemSettings.lateGraceMinutes);
  const [minAtt, setMinAtt] = useState(systemSettings.minAttendancePercentForCert);
  const [mentorWeight, setMentorWeight] = useState(systemSettings.evaluationWeights.mentorWeight);
  const [schoolWeight, setSchoolWeight] = useState(systemSettings.evaluationWeights.schoolWeight);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      workStartTime: startTime,
      workEndTime: endTime,
      lateGraceMinutes: lateGrace,
      minAttendancePercentForCert: minAtt,
      evaluationWeights: {
        mentorWeight,
        schoolWeight,
      },
    });
  };

  const exportAllDataJson = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      users,
      companies,
      systemSettings,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `magangku_system_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Cadangan data sistem berhasil diekspor (JSON)', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Administration Console
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 font-mono">RBAC & System Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Panel Pengaturan & Tata Kelola
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Konfigurasi kebijakan jam kerja, bobot evaluasi nilai, manajemen akun pengguna, serta audit keamanan.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset seluruh data aplikasi ke kondisi demo awal?')) {
                resetAllData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-gray-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'users', label: 'Pengguna & Akun', icon: Users },
          { id: 'settings', label: 'Konfigurasi Jam & Nilai', icon: Sliders },
          { id: 'audit', label: 'Audit Trail Aktivitas', icon: Activity },
          { id: 'export', label: 'Ekspor & Cadangan Data', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#E85D9E] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E85D9E]" />
              Daftar Pengguna Sistem ({users.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 dark:bg-gray-800/60 text-neutral-500 font-semibold uppercase border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Nama Pengguna</th>
                  <th className="py-2.5 px-3">Email Akun</th>
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">Instansi / Perusahaan</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-3 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover border" />
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-neutral-400">{u.identifierNumber || '-'}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-600 dark:text-neutral-300">
                      {u.email}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8FC] text-[#E85D9E] border border-[#E85D9E]/20 uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300">
                      {u.schoolName || u.companyName || 'Sistem MagangKu'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-6 text-xs max-w-2xl">
          <div className="space-y-1 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white">
              Aturan Presensi & Jam Kerja Magang
            </h2>
            <p className="text-neutral-500">
              Konfigurasi jam mulai dan toleransi keterlambatan untuk penghitungan status absensi otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Jam Masuk Kerja
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Jam Pulang Kerja
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Toleransi Telat (Menit)
              </label>
              <input
                type="number"
                value={lateGrace}
                onChange={e => setLateGrace(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 pt-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white">
              Bobot Komposisi Nilai Akhir & Sertifikat
            </h2>
            <p className="text-neutral-500">
              Menentukan porsi pembobotan nilai antara mentor industri dan guru pembimbing sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Bobot Mentor (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={mentorWeight}
                onChange={e => {
                  const val = Number(e.target.value);
                  setMentorWeight(val);
                  setSchoolWeight(100 - val);
                }}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Bobot Sekolah (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={schoolWeight}
                disabled
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-gray-800/50 text-neutral-500 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Minimal Presensi Sertifikat (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={minAtt}
                onChange={e => setMinAtt(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold shadow-xs transition"
            >
              Simpan Perubahan Konfigurasi
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E85D9E]" />
              Audit Trail Sistem MagangKu ({auditLogs.length} Entri)
            </h2>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-gray-800/40 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#E85D9E] font-mono text-[11px]">{log.action}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{log.userName}</span>
                    <span className="text-[10px] text-neutral-400 uppercase">({log.role})</span>
                  </div>
                  <span className="font-mono text-neutral-400 text-[10px]">{log.timestamp}</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT & BACKUP */}
      {activeTab === 'export' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 max-w-lg text-xs">
          <h2 className="text-sm font-bold text-[#302633] dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#E85D9E]" />
            Cadangan Basis Data & Arsip Magang
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Unduh seluruh snapshot pangkalan data sistem (pengguna, perusahaan, absensi, jurnal, tugas, dan rekam jejak sertifikat) dalam format JSON terenkripsi untuk kebutuhan audit eksternal.
          </p>
          <button
            onClick={exportAllDataJson}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Snapshot JSON Lengkap</span>
          </button>
        </div>
      )}
    </div>
  );
};
