export type UserRole =
  | 'siswa'
  | 'mentor'
  | 'guru'
  | 'admin_sekolah'
  | 'admin_perusahaan'
  | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  schoolId?: string;
  schoolName?: string;
  companyId?: string;
  companyName?: string;
  department?: string;
  identifierNumber?: string; // NISN or NIP
  classGrade?: string; // e.g. "XII RPL 1"
  status: 'aktif' | 'nonaktif';
  joinedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  address: string;
  city: string;
  workModel: 'onsite' | 'hybrid' | 'remote';
  quota: number;
  availablePositions: string[];
  contactEmail: string;
  contactPhone: string;
  description: string;
  website?: string;
}

export interface InternshipProgram {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  quota: number;
  registeredCount: number;
  workModel: 'onsite' | 'hybrid' | 'remote';
  location: string;
  startDate: string;
  endDate: string;
  status: 'buka' | 'tutup';
}

export interface InternshipApplication {
  id: string;
  studentId: string;
  studentName: string;
  programId: string;
  programTitle: string;
  companyId: string;
  companyName: string;
  appliedDate: string;
  status: 'draft' | 'diajukan' | 'ditinjau' | 'diterima' | 'ditolak' | 'daftar_tunggu';
  notes?: string;
  documents: {
    cvUrl?: string;
    coverLetterUrl?: string;
    portfolioUrl?: string;
  };
}

export interface InternshipPlacement {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  companyId: string;
  companyName: string;
  department: string;
  mentorId: string;
  mentorName: string;
  mentorPhone?: string;
  teacherId: string;
  teacherName: string;
  teacherPhone?: string;
  period: string; // e.g. "Juli - Desember 2026"
  startDate: string;
  endDate: string;
  status: 'belum_ditempatkan' | 'menunggu_verifikasi' | 'aktif' | 'selesai';
}

export type AttendanceStatus =
  | 'hadir'
  | 'terlambat'
  | 'izin'
  | 'sakit'
  | 'dinas'
  | 'libur'
  | 'alpa';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  status: AttendanceStatus;
  locationCoords?: {
    lat: number;
    lng: number;
  };
  locationName?: string;
  notes?: string;
  photoUrl?: string;
  isVerifiedLocation?: boolean;
}

export interface AttendanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  requestType: 'izin' | 'sakit' | 'koreksi';
  reason: string;
  attachmentUrl?: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  submittedAt: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export type JournalStatus = 'draft' | 'diajukan' | 'perlu_revisi' | 'disetujui';

export interface DailyJournal {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: string;
  description: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  output: string;
  competenciesLearned: string[];
  challenges: string;
  solution: string;
  reflection: string;
  documentationUrl?: string;
  tags: string[];
  status: JournalStatus;
  mentorFeedback?: string;
  mentorReviewedAt?: string;
  teacherFeedback?: string;
  revisionCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus =
  | 'belum_dimulai'
  | 'dikerjakan'
  | 'menunggu_review'
  | 'revisi'
  | 'selesai';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  note: string;
  linkUrl?: string;
  fileName?: string;
  grade?: number;
  feedback?: string;
}

export interface TaskItem {
  id: string;
  companyId: string;
  mentorId: string;
  mentorName: string;
  assignedStudentIds: string[];
  title: string;
  description: string;
  instructions: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  deadline: string; // YYYY-MM-DD
  status: TaskStatus;
  subtasks: TaskSubtask[];
  submissions: TaskSubmission[];
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  category:
    | 'cv'
    | 'surat_pengantar'
    | 'surat_penerimaan'
    | 'perjanjian'
    | 'laporan_mingguan'
    | 'laporan_akhir'
    | 'sertifikat'
    | 'lainnya';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'menunggu_verifikasi' | 'disetujui' | 'ditolak';
  verifiedBy?: string;
  accessRoles: UserRole[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  category: 'kerja' | 'deadline' | 'monitoring' | 'kunjungan' | 'rapat' | 'libur' | 'evaluasi';
  description: string;
  location?: string;
  targetRole: 'all' | UserRole;
}

export interface MonitoringRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  companyName: string;
  visitDate: string;
  visitType: 'onsite' | 'virtual';
  studentProgressPercentage: number;
  attendanceScore: number;
  workQualityScore: number;
  challenges: string;
  recommendations: string;
  followUpPlan: string;
  createdAt: string;
}

export interface EvaluationItem {
  id: string;
  studentId: string;
  studentName: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: 'mentor' | 'guru' | 'self';
  evaluationPeriod: 'tengah_periode' | 'akhir_periode';
  scores: {
    kedisiplinan: number;
    kehadiran: number;
    tanggungJawab: number;
    komunikasi: number;
    kerjaSama: number;
    inisiatif: number;
    adaptasi: number;
    pemecahanMasalah: number;
    penguasaanKeterampilan: number;
    kualitasPekerjaan: number;
    sikapProfesional: number;
    pencapaianTarget: number;
  };
  totalAverage: number;
  predicate: 'Sangat Baik (A)' | 'Baik (B)' | 'Cukup (C)' | 'Kurang (D)';
  notes: string;
  status: 'draft' | 'final';
  createdAt: string;
}

export interface CertificateItem {
  id: string;
  certificateNumber: string;
  verificationCode: string;
  studentId: string;
  studentName: string;
  nisn: string;
  schoolName: string;
  companyName: string;
  division: string;
  period: string;
  issueDate: string;
  finalScore: number;
  predicate: string;
  mentorSigner: string;
  schoolSigner: string;
  isVerified: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  targetRole: 'all' | UserRole;
  priority: 'normal' | 'penting' | 'darurat';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  category: 'teknis' | 'administrasi' | 'penempatan' | 'lainnya';
  title: string;
  description: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: 'terbuka' | 'diproses' | 'selesai';
  createdAt: string;
  responses: {
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}
