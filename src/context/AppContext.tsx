import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Company,
  InternshipProgram,
  InternshipPlacement,
  AttendanceRecord,
  AttendanceRequest,
  DailyJournal,
  TaskItem,
  TaskStatus,
  TaskSubmission,
  DocumentItem,
  CalendarEvent,
  MonitoringRecord,
  EvaluationItem,
  CertificateItem,
  AnnouncementItem,
  ChatMessage,
  SupportTicket,
  AuditLog,
} from '../types';
import {
  SEED_USERS,
  SEED_COMPANIES,
  SEED_PROGRAMS,
  SEED_PLACEMENTS,
  SEED_ATTENDANCE,
  SEED_ATTENDANCE_REQUESTS,
  SEED_JOURNALS,
  SEED_TASKS,
  SEED_DOCUMENTS,
  SEED_CALENDAR_EVENTS,
  SEED_MONITORING,
  SEED_EVALUATIONS,
  SEED_CERTIFICATES,
  SEED_ANNOUNCEMENTS,
  SEED_MESSAGES,
  SEED_TICKETS,
  SEED_AUDIT_LOGS,
} from '../data/seedData';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface SystemSettings {
  workStartTime: string;
  workEndTime: string;
  lateGraceMinutes: number;
  autoLocationVerification: boolean;
  minAttendancePercentForCert: number;
  minApprovedJournalsForCert: number;
  evaluationWeights: {
    mentorWeight: number;
    schoolWeight: number;
  };
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  
  // Entities
  users: User[];
  companies: Company[];
  programs: InternshipProgram[];
  placements: InternshipPlacement[];
  attendance: AttendanceRecord[];
  attendanceRequests: AttendanceRequest[];
  journals: DailyJournal[];
  tasks: TaskItem[];
  documents: DocumentItem[];
  calendarEvents: CalendarEvent[];
  monitoringRecords: MonitoringRecord[];
  evaluations: EvaluationItem[];
  certificates: CertificateItem[];
  announcements: AnnouncementItem[];
  messages: ChatMessage[];
  tickets: SupportTicket[];
  auditLogs: AuditLog[];
  systemSettings: SystemSettings;
  updateSystemSettings: (s: Partial<SystemSettings>) => void;

  // Actions
  checkIn: (coords?: { lat: number; lng: number }, locationName?: string, notes?: string) => void;
  checkOut: (notes?: string) => void;
  requestAttendanceCorrection: (req: { date: string; requestType: 'izin' | 'sakit' | 'koreksi'; reason: string; attachmentUrl?: string }) => void;
  reviewAttendanceRequest: (id: string, status: 'disetujui' | 'ditolak', note: string) => void;
  addJournal: (j: Omit<DailyJournal, 'id' | 'studentId' | 'studentName' | 'createdAt' | 'updatedAt' | 'revisionCount'>) => void;
  updateJournal: (j: DailyJournal) => void;
  reviewJournal: (id: string, status: 'disetujui' | 'perlu_revisi', feedback: string) => void;
  addTask: (t: Omit<TaskItem, 'id' | 'createdAt' | 'submissions'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  submitTask: (taskId: string, sub: { note: string; linkUrl?: string; fileName?: string }) => void;
  gradeTaskSubmission: (taskId: string, submissionId: string, grade: number, feedback: string) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate' | 'ownerId' | 'ownerName'>) => void;
  verifyDocument: (id: string, status: 'disetujui' | 'ditolak') => void;
  addCalendarEvent: (ev: Omit<CalendarEvent, 'id'>) => void;
  addMonitoringRecord: (rec: Omit<MonitoringRecord, 'id' | 'createdAt' | 'teacherId' | 'teacherName'>) => void;
  addOrUpdateEvaluation: (evalItem: Omit<EvaluationItem, 'id' | 'createdAt' | 'evaluatorId' | 'evaluatorName' | 'evaluatorRole'>) => void;
  issueCertificate: (certData: Omit<CertificateItem, 'id' | 'certificateNumber' | 'verificationCode' | 'issueDate' | 'isVerified'>) => void;
  addAnnouncement: (anc: Omit<AnnouncementItem, 'id' | 'createdAt' | 'author' | 'authorRole'>) => void;
  sendMessage: (recipientId: string, text: string) => void;
  addTicket: (tkt: Omit<SupportTicket, 'id' | 'userId' | 'userName' | 'role' | 'createdAt' | 'responses'>) => void;
  respondTicket: (id: string, text: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'magangku_v1_';

function getStoredOr<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveStore<T>(key: string, val: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Local storage save error', e);
  }
}

const DEFAULT_SETTINGS: SystemSettings = {
  workStartTime: '08:00',
  workEndTime: '17:00',
  lateGraceMinutes: 15,
  autoLocationVerification: true,
  minAttendancePercentForCert: 80,
  minApprovedJournalsForCert: 15,
  evaluationWeights: {
    mentorWeight: 60,
    schoolWeight: 40,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getStoredOr<User | null>('current_user', SEED_USERS[0]);
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return getStoredOr<boolean>('dark_mode', false);
  });
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Entities stored in localStorage
  const [users, setUsers] = useState<User[]>(() => getStoredOr('users', SEED_USERS));
  const [companies, setCompanies] = useState<Company[]>(() => getStoredOr('companies', SEED_COMPANIES));
  const [programs, setPrograms] = useState<InternshipProgram[]>(() => getStoredOr('programs', SEED_PROGRAMS));
  const [placements, setPlacements] = useState<InternshipPlacement[]>(() => getStoredOr('placements', SEED_PLACEMENTS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStoredOr('attendance', SEED_ATTENDANCE));
  const [attendanceRequests, setAttendanceRequests] = useState<AttendanceRequest[]>(() => getStoredOr('attendance_requests', SEED_ATTENDANCE_REQUESTS));
  const [journals, setJournals] = useState<DailyJournal[]>(() => getStoredOr('journals', SEED_JOURNALS));
  const [tasks, setTasks] = useState<TaskItem[]>(() => getStoredOr('tasks', SEED_TASKS));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => getStoredOr('documents', SEED_DOCUMENTS));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => getStoredOr('calendar', SEED_CALENDAR_EVENTS));
  const [monitoringRecords, setMonitoringRecords] = useState<MonitoringRecord[]>(() => getStoredOr('monitoring', SEED_MONITORING));
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(() => getStoredOr('evaluations', SEED_EVALUATIONS));
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => getStoredOr('certificates', SEED_CERTIFICATES));
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => getStoredOr('announcements', SEED_ANNOUNCEMENTS));
  const [messages, setMessages] = useState<ChatMessage[]>(() => getStoredOr('messages', SEED_MESSAGES));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getStoredOr('tickets', SEED_TICKETS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStoredOr('audit_logs', SEED_AUDIT_LOGS));
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => getStoredOr('system_settings', DEFAULT_SETTINGS));

  // Sync to local storage
  useEffect(() => saveStore('current_user', currentUser), [currentUser]);
  useEffect(() => saveStore('dark_mode', isDarkMode), [isDarkMode]);
  useEffect(() => saveStore('users', users), [users]);
  useEffect(() => saveStore('companies', companies), [companies]);
  useEffect(() => saveStore('programs', programs), [programs]);
  useEffect(() => saveStore('placements', placements), [placements]);
  useEffect(() => saveStore('attendance', attendance), [attendance]);
  useEffect(() => saveStore('attendance_requests', attendanceRequests), [attendanceRequests]);
  useEffect(() => saveStore('journals', journals), [journals]);
  useEffect(() => saveStore('tasks', tasks), [tasks]);
  useEffect(() => saveStore('documents', documents), [documents]);
  useEffect(() => saveStore('calendar', calendarEvents), [calendarEvents]);
  useEffect(() => saveStore('monitoring', monitoringRecords), [monitoringRecords]);
  useEffect(() => saveStore('evaluations', evaluations), [evaluations]);
  useEffect(() => saveStore('certificates', certificates), [certificates]);
  useEffect(() => saveStore('announcements', announcements), [announcements]);
  useEffect(() => saveStore('messages', messages), [messages]);
  useEffect(() => saveStore('tickets', tickets), [tickets]);
  useEffect(() => saveStore('audit_logs', auditLogs), [auditLogs]);
  useEffect(() => saveStore('system_settings', systemSettings), [systemSettings]);

  // Apply dark mode to root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (action: string, target: string, details: string) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      userId: currentUser?.id || 'anon',
      userName: currentUser?.name || 'Sistem',
      role: currentUser?.role || 'sistem',
      action,
      target,
      timestamp,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || SEED_USERS.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setActiveView('dashboard');
      showToast(`Beralih peran ke: ${targetUser.name} (${role.toUpperCase()})`, 'info');
      addAuditLog('SWITCH_ROLE', `Role ${role}`, `Pengguna beralih peran ke ${targetUser.name}`);
    }
  };

  const login = (email: string, role?: UserRole): boolean => {
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user && role) {
      user = users.find(u => u.role === role);
    }
    if (user) {
      setCurrentUser(user);
      setActiveView('dashboard');
      showToast(`Selamat datang kembali, ${user.name}!`, 'success');
      addAuditLog('LOGIN', 'Sesi Pengguna', `Login berhasil sebagai ${user.role}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('LOGOUT', 'Sesi Pengguna', `${currentUser.name} keluar dari sistem`);
    }
    setCurrentUser(null);
    setActiveView('login');
    showToast('Anda telah berhasil keluar dari akun.', 'info');
  };

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Pengaturan sistem berhasil disimpan', 'success');
    addAuditLog('UPDATE_SETTINGS', 'Sistem', 'Memperbarui konfigurasi sistem');
  };

  // Attendance Actions
  const checkIn = (coords?: { lat: number; lng: number }, locationName?: string, notes?: string) => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Determine status: check against systemSettings.workStartTime
    const [startH, startM] = systemSettings.workStartTime.split(':').map(Number);
    const limitMinutes = startH * 60 + startM + systemSettings.lateGraceMinutes;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const status = currentMinutes > limitMinutes ? 'terlambat' : 'hadir';

    const existingIdx = attendance.findIndex(a => a.studentId === currentUser.id && a.date === today);
    if (existingIdx >= 0) {
      showToast('Anda sudah melakukan check-in hari ini.', 'info');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      date: today,
      checkInTime: timeStr,
      status,
      locationCoords: coords,
      locationName: locationName || (coords ? `Koordinat (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : 'Lokasi Terverifikasi'),
      notes: notes || (status === 'terlambat' ? 'Check-in melewati batas jam kerja' : 'Check-in tepat waktu'),
      isVerifiedLocation: Boolean(coords),
    };

    setAttendance(prev => [newRecord, ...prev]);
    showToast(`Check-in berhasil (${timeStr}) — Status: ${status.toUpperCase()}`, status === 'hadir' ? 'success' : 'info');
    addAuditLog('CHECK_IN', 'Absensi', `${currentUser.name} check-in pukul ${timeStr} status ${status}`);
  };

  const checkOut = (notes?: string) => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const record = attendance.find(a => a.studentId === currentUser.id && a.date === today);
    if (!record) {
      showToast('Anda belum melakukan check-in hari ini!', 'error');
      return;
    }
    if (record.checkOutTime) {
      showToast('Anda sudah melakukan check-out hari ini.', 'info');
      return;
    }

    setAttendance(prev =>
      prev.map(a =>
        a.id === record.id
          ? {
              ...a,
              checkOutTime: timeStr,
              notes: notes ? `${a.notes || ''} | Out: ${notes}` : a.notes,
            }
          : a
      )
    );
    showToast(`Check-out berhasil pukul ${timeStr}. Sampai jumpa besok!`, 'success');
    addAuditLog('CHECK_OUT', 'Absensi', `${currentUser.name} check-out pukul ${timeStr}`);
  };

  const requestAttendanceCorrection = (req: {
    date: string;
    requestType: 'izin' | 'sakit' | 'koreksi';
    reason: string;
    attachmentUrl?: string;
  }) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newReq: AttendanceRequest = {
      id: 'att-req-' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      date: req.date,
      requestType: req.requestType,
      reason: req.reason,
      attachmentUrl: req.attachmentUrl,
      status: 'menunggu',
      submittedAt: timeStr,
    };
    setAttendanceRequests(prev => [newReq, ...prev]);
    showToast(`Permohonan ${req.requestType.toUpperCase()} berhasil dikirimkan ke pembimbing.`, 'success');
    addAuditLog('REQUEST_ATTENDANCE', 'Permohonan Kehadiran', `${currentUser.name} mengajukan ${req.requestType} untuk tanggal ${req.date}`);
  };

  const reviewAttendanceRequest = (id: string, status: 'disetujui' | 'ditolak', note: string) => {
    const target = attendanceRequests.find(r => r.id === id);
    if (!target) return;

    setAttendanceRequests(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status, reviewedBy: currentUser?.name || 'Mentor', reviewNote: note }
          : r
      )
    );

    // If approved, update or insert corresponding attendance record
    if (status === 'disetujui') {
      const attendanceStatus = target.requestType === 'izin' ? 'izin' : target.requestType === 'sakit' ? 'sakit' : 'hadir';
      setAttendance(prev => {
        const exist = prev.find(a => a.studentId === target.studentId && a.date === target.date);
        if (exist) {
          return prev.map(a =>
            a.id === exist.id
              ? { ...a, status: attendanceStatus, notes: `Disetujui: ${target.reason}` }
              : a
          );
        } else {
          const newAtt: AttendanceRecord = {
            id: 'att-' + Date.now(),
            studentId: target.studentId,
            studentName: target.studentName,
            date: target.date,
            status: attendanceStatus,
            notes: `Permohonan ${target.requestType}: ${target.reason}`,
          };
          return [newAtt, ...prev];
        }
      });
    }

    showToast(`Permohonan ${target.studentName} telah ${status}.`, 'info');
    addAuditLog('REVIEW_ATTENDANCE', 'Permohonan Kehadiran', `${currentUser?.name} ${status} permohonan #${id}`);
  };

  // Journal Actions
  const addJournal = (j: Omit<DailyJournal, 'id' | 'studentId' | 'studentName' | 'createdAt' | 'updatedAt' | 'revisionCount'>) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newJournal: DailyJournal = {
      ...j,
      id: 'jrn-' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      revisionCount: 0,
      createdAt: timeStr,
      updatedAt: timeStr,
    };
    setJournals(prev => [newJournal, ...prev]);
    showToast('Jurnal harian berhasil disimpan!', 'success');
    addAuditLog('CREATE_JOURNAL', 'Jurnal Harian', `${currentUser.name} membuat jurnal: ${j.title}`);
  };

  const updateJournal = (j: DailyJournal) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setJournals(prev =>
      prev.map(item =>
        item.id === j.id
          ? { ...j, updatedAt: timeStr, revisionCount: item.revisionCount + (j.status === 'diajukan' ? 1 : 0) }
          : item
      )
    );
    showToast('Perubahan jurnal berhasil disimpan!', 'success');
    addAuditLog('UPDATE_JOURNAL', 'Jurnal Harian', `Memperbarui jurnal #${j.id}`);
  };

  const reviewJournal = (id: string, status: 'disetujui' | 'perlu_revisi', feedback: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setJournals(prev =>
      prev.map(j =>
        j.id === id
          ? {
              ...j,
              status,
              mentorFeedback: feedback,
              mentorReviewedAt: timeStr,
              updatedAt: timeStr,
            }
          : j
      )
    );
    showToast(`Status jurnal diperbarui menjadi: ${status === 'disetujui' ? 'DISETUJUI' : 'PERLU REVISI'}`, 'info');
    addAuditLog('REVIEW_JOURNAL', 'Jurnal Harian', `${currentUser?.name} memberikan review: ${status}`);
  };

  // Task Actions
  const addTask = (t: Omit<TaskItem, 'id' | 'createdAt' | 'submissions'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newTask: TaskItem = {
      ...t,
      id: 'task-' + Date.now(),
      submissions: [],
      createdAt: today,
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Tugas baru berhasil dibuat dan ditugaskan!', 'success');
    addAuditLog('CREATE_TASK', 'Manajemen Tugas', `Membuat tugas baru: ${t.title}`);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
    showToast(`Status tugas diperbarui ke: ${status.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const updatedSubs = t.subtasks.map(s => (s.id === subtaskId ? { ...s, completed: !s.completed } : s));
        const allDone = updatedSubs.length > 0 && updatedSubs.every(s => s.completed);
        return {
          ...t,
          subtasks: updatedSubs,
          status: allDone ? 'menunggu_review' : t.status === 'belum_dimulai' ? 'dikerjakan' : t.status,
        };
      })
    );
  };

  const submitTask = (taskId: string, sub: { note: string; linkUrl?: string; fileName?: string }) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newSub: TaskSubmission = {
      id: 'subm-' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      submittedAt: timeStr,
      note: sub.note,
      linkUrl: sub.linkUrl,
      fileName: sub.fileName,
    };

    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'menunggu_review',
          submissions: [newSub, ...t.submissions.filter(s => s.studentId !== currentUser.id)],
        };
      })
    );
    showToast('Tugas berhasil dikumpulkan untuk direview mentor!', 'success');
    addAuditLog('SUBMIT_TASK', 'Pengumpulan Tugas', `${currentUser.name} mengumpulkan tugas #${taskId}`);
  };

  const gradeTaskSubmission = (taskId: string, submissionId: string, grade: number, feedback: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const updatedSubmissions = t.submissions.map(s =>
          s.id === submissionId ? { ...s, grade, feedback } : s
        );
        return {
          ...t,
          status: grade >= 75 ? 'selesai' : 'revisi',
          submissions: updatedSubmissions,
        };
      })
    );
    showToast(`Nilai tugas (${grade}/100) dan umpan balik tersimpan.`, 'success');
    addAuditLog('GRADE_TASK', 'Penilaian Tugas', `Menilai pengumpulan #${submissionId} dengan nilai ${grade}`);
  };

  // Document Actions
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadDate' | 'ownerId' | 'ownerName'>) => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const newDoc: DocumentItem = {
      ...doc,
      id: 'doc-' + Date.now(),
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      uploadDate: today,
      status: 'menunggu_verifikasi',
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Dokumen "${doc.title}" berhasil diunggah!`, 'success');
    addAuditLog('UPLOAD_DOC', 'Dokumen', `${currentUser.name} mengunggah ${doc.title}`);
  };

  const verifyDocument = (id: string, status: 'disetujui' | 'ditolak') => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === id ? { ...d, status, verifiedBy: currentUser?.name || 'Admin' } : d
      )
    );
    showToast(`Dokumen telah diverifikasi: ${status.toUpperCase()}`, 'info');
    addAuditLog('VERIFY_DOC', 'Dokumen', `${currentUser?.name} memverifikasi dokumen #${id} (${status})`);
  };

  // Calendar Event Actions
  const addCalendarEvent = (ev: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = {
      ...ev,
      id: 'ev-' + Date.now(),
    };
    setCalendarEvents(prev => [...prev, newEv]);
    showToast(`Agenda "${ev.title}" berhasil ditambahkan ke kalender!`, 'success');
    addAuditLog('ADD_EVENT', 'Kalender', `Menambahkan agenda: ${ev.title}`);
  };

  // Monitoring Actions
  const addMonitoringRecord = (rec: Omit<MonitoringRecord, 'id' | 'createdAt' | 'teacherId' | 'teacherName'>) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newRec: MonitoringRecord = {
      ...rec,
      id: 'mon-' + Date.now(),
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      createdAt: timeStr,
    };
    setMonitoringRecords(prev => [newRec, ...prev]);
    showToast('Laporan monitoring kunjungan berhasil disimpan!', 'success');
    addAuditLog('ADD_MONITORING', 'Monitoring Guru', `Catatan monitoring untuk ${rec.studentName} disimpan`);
  };

  // Evaluation Actions
  const addOrUpdateEvaluation = (evalItem: Omit<EvaluationItem, 'id' | 'createdAt' | 'evaluatorId' | 'evaluatorName' | 'evaluatorRole'>) => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const role = (currentUser.role === 'mentor' || currentUser.role === 'guru' ? currentUser.role : 'self') as 'mentor' | 'guru' | 'self';
    const newEval: EvaluationItem = {
      ...evalItem,
      id: 'eval-' + Date.now(),
      evaluatorId: currentUser.id,
      evaluatorName: currentUser.name,
      evaluatorRole: role,
      createdAt: today,
    };
    setEvaluations(prev => {
      const filtered = prev.filter(e => !(e.studentId === evalItem.studentId && e.evaluationPeriod === evalItem.evaluationPeriod && e.evaluatorRole === role));
      return [newEval, ...filtered];
    });
    showToast('Formulir evaluasi nilai berhasil disimpan!', 'success');
    addAuditLog('SAVE_EVALUATION', 'Penilaian Siswa', `Evaluasi ${evalItem.studentName} disimpan`);
  };

  // Certificate Actions
  const issueCertificate = (certData: Omit<CertificateItem, 'id' | 'certificateNumber' | 'verificationCode' | 'issueDate' | 'isVerified'>) => {
    const today = new Date();
    const months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const certNum = `MGK/${certData.companyName.substring(0, 3).toUpperCase()}/${today.getFullYear()}/${months[today.getMonth()]}/${randomHex.toString().substring(0, 4)}`;
    const verifCode = `MGK-${today.getFullYear()}-${certData.companyName.substring(0, 3).toUpperCase()}-${randomHex}`;
    
    const newCert: CertificateItem = {
      ...certData,
      id: 'cert-' + Date.now(),
      certificateNumber: certNum,
      verificationCode: verifCode,
      issueDate: `${today.getDate()} Oktober ${today.getFullYear()}`,
      isVerified: true,
    };
    setCertificates(prev => [newCert, ...prev]);
    showToast(`Sertifikat Resmi diterbitkan dengan kode verifikasi: ${verifCode}`, 'success');
    addAuditLog('ISSUE_CERTIFICATE', 'Sertifikat Magang', `Menerbitkan sertifikat ${certNum} untuk ${certData.studentName}`);
  };

  // Announcements
  const addAnnouncement = (anc: Omit<AnnouncementItem, 'id' | 'createdAt' | 'author' | 'authorRole'>) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAnc: AnnouncementItem = {
      ...anc,
      id: 'anc-' + Date.now(),
      author: currentUser.name,
      authorRole: currentUser.role.replace('_', ' ').toUpperCase(),
      createdAt: timeStr,
    };
    setAnnouncements(prev => [newAnc, ...prev]);
    showToast('Pengumuman berhasil dipublikasikan!', 'success');
    addAuditLog('ADD_ANNOUNCEMENT', 'Pengumuman', `Membuat pengumuman: ${anc.title}`);
  };

  // Chat Messages
  const sendMessage = (recipientId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId,
      text: text.trim(),
      timestamp: timeStr,
    };
    setMessages(prev => [...prev, newMsg]);
    showToast('Pesan terkirim', 'info');
  };

  // Support Tickets
  const addTicket = (tkt: Omit<SupportTicket, 'id' | 'userId' | 'userName' | 'role' | 'createdAt' | 'responses'>) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newTicket: SupportTicket = {
      ...tkt,
      id: 'tkt-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      createdAt: timeStr,
      responses: [],
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast('Laporan masalah berhasil dikirim ke admin sistem!', 'success');
    addAuditLog('CREATE_TICKET', 'Pusat Bantuan', `${currentUser.name} membuka tiket: ${tkt.title}`);
  };

  const respondTicket = (id: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setTickets(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              status: 'selesai',
              responses: [
                ...t.responses,
                {
                  senderName: currentUser.name,
                  text: text.trim(),
                  timestamp: timeStr,
                },
              ],
            }
          : t
      )
    );
    showToast('Tanggapan tiket tersimpan dan tiket ditandai selesai.', 'success');
  };

  // Reset demo data
  const resetAllData = () => {
    localStorage.clear();
    setUsers(SEED_USERS);
    setCompanies(SEED_COMPANIES);
    setPrograms(SEED_PROGRAMS);
    setPlacements(SEED_PLACEMENTS);
    setAttendance(SEED_ATTENDANCE);
    setAttendanceRequests(SEED_ATTENDANCE_REQUESTS);
    setJournals(SEED_JOURNALS);
    setTasks(SEED_TASKS);
    setDocuments(SEED_DOCUMENTS);
    setCalendarEvents(SEED_CALENDAR_EVENTS);
    setMonitoringRecords(SEED_MONITORING);
    setEvaluations(SEED_EVALUATIONS);
    setCertificates(SEED_CERTIFICATES);
    setAnnouncements(SEED_ANNOUNCEMENTS);
    setMessages(SEED_MESSAGES);
    setTickets(SEED_TICKETS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setSystemSettings(DEFAULT_SETTINGS);
    setCurrentUser(SEED_USERS[0]);
    showToast('Data demo berhasil di-reset ke kondisi awal.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        login,
        logout,
        isDarkMode,
        toggleDarkMode,
        activeView,
        setActiveView,
        toasts,
        showToast,
        dismissToast,
        users,
        companies,
        programs,
        placements,
        attendance,
        attendanceRequests,
        journals,
        tasks,
        documents,
        calendarEvents,
        monitoringRecords,
        evaluations,
        certificates,
        announcements,
        messages,
        tickets,
        auditLogs,
        systemSettings,
        updateSystemSettings,
        checkIn,
        checkOut,
        requestAttendanceCorrection,
        reviewAttendanceRequest,
        addJournal,
        updateJournal,
        reviewJournal,
        addTask,
        updateTaskStatus,
        toggleSubtask,
        submitTask,
        gradeTaskSubmission,
        addDocument,
        verifyDocument,
        addCalendarEvent,
        addMonitoringRecord,
        addOrUpdateEvaluation,
        issueCertificate,
        addAnnouncement,
        sendMessage,
        addTicket,
        respondTicket,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
