import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Award,
  ShieldCheck,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
  QrCode,
  Download,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { CertificateItem } from '../../types';

export const CertificateView: React.FC = () => {
  const {
    currentUser,
    users,
    placements,
    certificates,
    attendance,
    journals,
    evaluations,
    issueCertificate,
    showToast,
  } = useApp();

  const isStudent = currentUser?.role === 'siswa';
  const canIssue = ['admin_sekolah', 'admin_perusahaan', 'superadmin'].includes(currentUser?.role || '');

  const [activeTab, setActiveTab] = useState<'certificates' | 'verify'>('certificates');
  const [verifyInput, setVerifyInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<CertificateItem | null | 'not_found'>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Issue modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('user-siswa-1');

  const students = users.filter(u => u.role === 'siswa');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verifyInput.trim().toUpperCase();
    if (!cleanCode) return;

    const found = certificates.find(
      c => c.verificationCode.toUpperCase() === cleanCode || c.certificateNumber.toUpperCase() === cleanCode
    );

    if (found) {
      setVerificationResult(found);
      showToast('Sertifikat TERVERIFIKASI SAH dalam database MagangKu!', 'success');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setVerificationResult('not_found');
      showToast('Sertifikat tidak ditemukan. Periksa kembali kode verifikasi Anda.', 'error');
    }
  };

  const handlePreviewCertificate = (cert: CertificateItem) => {
    setSelectedCert(cert);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const st = users.find(u => u.id === selectedStudentId);
    const plc = placements.find(p => p.studentId === selectedStudentId);

    if (!st || !plc) return;

    // Check prerequisites
    const stAtt = attendance.filter(a => a.studentId === st.id);
    const pres = stAtt.filter(a => a.status === 'hadir' || a.status === 'terlambat').length;
    const attRate = stAtt.length > 0 ? Math.round((pres / stAtt.length) * 100) : 100;
    const stJournals = journals.filter(j => j.studentId === st.id && j.status === 'disetujui');

    if (attRate < 75) {
      showToast(`Kehadiran siswa (${attRate}%) di bawah batas minimal 75%`, 'error');
      return;
    }

    issueCertificate({
      studentId: st.id,
      studentName: st.name,
      nisn: st.identifierNumber || '0064128930',
      schoolName: st.schoolName || 'SMK Negeri 1 Jakarta',
      companyName: plc.companyName,
      division: plc.department,
      period: plc.period,
      finalScore: 94.2,
      predicate: 'Dengan Pujian / Sangat Baik (A)',
      mentorSigner: plc.mentorName + ' (Mentor Industri)',
      schoolSigner: 'Drs. H. Bambang Subagyo (Hubin)',
    });

    setShowIssueModal(false);
  };

  const myCertificates = isStudent
    ? certificates.filter(c => c.studentId === currentUser?.id)
    : certificates;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Sertifikasi Digital Terverifikasi
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 font-mono">Keaslian Terjamin QR Hash</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Sertifikat Kelulusan Magang
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Diterbitkan secara resmi bersama sekolah dan mitra industri setelah memenuhi seluruh persyaratan administratif dan evaluasi kompetensi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canIssue && (
              <button
                onClick={() => setShowIssueModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
              >
                <Award className="w-4 h-4" />
                <span>Terbitkan Sertifikat</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-100 dark:bg-gray-800 rounded-2xl max-w-sm text-xs">
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 py-2 font-bold rounded-xl transition ${
            activeTab === 'certificates'
              ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Daftar Sertifikat
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`flex-1 py-2 font-bold rounded-xl transition ${
            activeTab === 'verify'
              ? 'bg-white dark:bg-gray-900 text-[#E85D9E] shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Verifikasi Keaslian
        </button>
      </div>

      {activeTab === 'certificates' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCertificates.map(cert => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#E85D9E] bg-[#FFF8FC] px-2 py-0.5 rounded-md border border-[#E85D9E]/30 font-semibold">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Terverifikasi Sah</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {cert.studentName}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    NISN: {cert.nisn} · {cert.schoolName}
                  </p>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300">
                    Program Magang: <strong>{cert.companyName}</strong> ({cert.division})
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <span>Nilai Akhir: {cert.finalScore}</span>
                    <span>·</span>
                    <span>{cert.predicate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-mono text-neutral-400">
                    Kode: {cert.verificationCode}
                  </div>
                  <button
                    onClick={() => handlePreviewCertificate(cert)}
                    className="px-4 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Buka Pratinjau & Cetak</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* PUBLIC VERIFICATION SEARCH */
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-6 max-w-xl mx-auto">
          <div className="text-center space-y-1">
            <ShieldCheck className="w-10 h-10 text-[#E85D9E] mx-auto" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Cek Keaslian Sertifikat MagangKu
            </h2>
            <p className="text-xs text-neutral-500">
              Masukkan Kode Verifikasi (contoh: <code>MGK-2026-TKP-088192</code>) atau Nomor Sertifikat resmi.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="MGK-2026-TKP-088192"
                value={verifyInput}
                onChange={e => setVerifyInput(e.target.value)}
                className="w-full pl-4 pr-24 py-3 text-sm font-mono uppercase font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85D9E]"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold text-xs"
              >
                Verifikasi
              </button>
            </div>
          </form>

          {verificationResult === 'not_found' && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs text-center">
              Nomor / Kode Verifikasi tidak ditemukan dalam pangkalan data resmi MagangKu.
            </div>
          )}

          {verificationResult && verificationResult !== 'not_found' && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>SERTIFIKAT ASLI & TERVERIFIKASI RESMI</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-neutral-700 dark:text-neutral-300">
                <div>
                  <span className="text-[10px] text-neutral-400">Nama Penerima:</span>
                  <p className="font-bold">{verificationResult.studentName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">NISN:</span>
                  <p className="font-bold">{verificationResult.nisn}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Sekolah:</span>
                  <p className="font-bold">{verificationResult.schoolName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Mitra Industri:</span>
                  <p className="font-bold">{verificationResult.companyName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Nilai Akhir:</span>
                  <p className="font-bold text-emerald-700">{verificationResult.finalScore} ({verificationResult.predicate})</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Tanggal Terbit:</span>
                  <p className="font-bold">{verificationResult.issueDate}</p>
                </div>
              </div>
              <button
                onClick={() => handlePreviewCertificate(verificationResult)}
                className="w-full mt-2 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Lihat Lembar Sertifikat
              </button>
            </div>
          )}
        </div>
      )}

      {/* Official Certificate Preview & Print Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white text-neutral-900 shadow-2xl p-6 sm:p-10 my-8 space-y-6 relative border-4 border-double border-[#E85D9E]/40">
            {/* Action Bar (no-print) */}
            <div className="flex items-center justify-between no-print border-b border-neutral-100 pb-3">
              <span className="text-xs font-mono text-neutral-400">Pratinjau Format Cetak Sertifikat</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-semibold hover:bg-neutral-50"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* CERTIFICATE FORMAL LAYOUT */}
            <div className="text-center space-y-4 py-4">
              {/* Header Logos & Title */}
              <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-4">
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {selectedCert.schoolName}
                  </p>
                  <p className="text-xs font-semibold text-neutral-700">Departemen Hubungan Industri & BKK</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#E85D9E] text-white font-black flex items-center justify-center text-xl shadow-xs">
                  M
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {selectedCert.companyName}
                  </p>
                  <p className="text-xs font-semibold text-neutral-700">{selectedCert.division}</p>
                </div>
              </div>

              <div className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-widest text-[#302633] uppercase">
                  SERTIFIKAT MAGANG
                </h1>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  Nomor: {selectedCert.certificateNumber}
                </p>
              </div>

              <p className="text-xs text-neutral-600 max-w-lg mx-auto pt-2">
                Diberikan sebagai bukti sah atas dedikasi, kedisiplinan, dan penyelesaian seluruh kegiatan Praktik Kerja Lapangan (PKL) / Magang Industri kepada:
              </p>

              <div className="py-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E85D9E] tracking-tight">
                  {selectedCert.studentName}
                </h2>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  Nomor Induk Siswa Nasional (NISN): {selectedCert.nisn}
                </p>
              </div>

              <p className="text-xs text-neutral-700 max-w-xl mx-auto leading-relaxed">
                Telah melaksanakan dan menyelesaikan program magang kerja pada <strong>{selectedCert.companyName}</strong> divisi <strong>{selectedCert.division}</strong> selama periode <strong>{selectedCert.period}</strong> dengan memperoleh predikat:
              </p>

              <div className="inline-block px-6 py-2 rounded-2xl bg-[#FFF8FC] border-2 border-[#E85D9E] text-sm font-bold text-[#E85D9E] shadow-2xs">
                {selectedCert.predicate} — Rata-rata Nilai: {selectedCert.finalScore}
              </div>

              {/* Signatures & Verification Code */}
              <div className="grid grid-cols-3 gap-4 pt-8 text-xs text-neutral-800 items-end">
                <div className="text-center space-y-12">
                  <p className="text-[11px] text-neutral-500">Pembimbing Industri,</p>
                  <div>
                    <p className="font-bold underline">{selectedCert.mentorSigner}</p>
                    <p className="text-[10px] text-neutral-400">{selectedCert.companyName}</p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-300 mx-auto flex flex-col items-center justify-center p-1">
                    <QrCode className="w-10 h-10 text-neutral-700" />
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 block">
                    ID: {selectedCert.verificationCode}
                  </span>
                </div>

                <div className="text-center space-y-12">
                  <p className="text-[11px] text-neutral-500">Jakarta, {selectedCert.issueDate}</p>
                  <div>
                    <p className="font-bold underline">{selectedCert.schoolSigner}</p>
                    <p className="text-[10px] text-neutral-400">{selectedCert.schoolName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
