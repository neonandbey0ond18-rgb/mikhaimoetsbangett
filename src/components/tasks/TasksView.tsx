import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Columns3,
  List,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  Award,
  Send,
  User,
} from 'lucide-react';
import { TaskItem, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const {
    currentUser,
    users,
    tasks,
    addTask,
    updateTaskStatus,
    toggleSubtask,
    submitTask,
    gradeTaskSubmission,
    showToast,
  } = useApp();

  const isStudent = currentUser?.role === 'siswa';
  const isMentor = ['mentor', 'admin_perusahaan', 'superadmin'].includes(currentUser?.role || '');

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // New task modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskInstructions, setTaskInstructions] = useState('');
  const [taskPriority, setTaskPriority] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang');
  const [taskDeadline, setTaskDeadline] = useState('2026-11-15');
  const [taskAssignedStudents, setTaskAssignedStudents] = useState<string[]>(['user-siswa-1']);
  const [taskSubtasksInput, setTaskSubtasksInput] = useState('Slicing komponen, Integrasi API, Pengujian responsivitas');

  // Student submission states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');

  // Mentor grading states
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradingSubmissionId, setGradingSubmissionId] = useState('');
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');

  const studentList = users.filter(u => u.role === 'siswa');

  const myTasks = isStudent
    ? tasks.filter(t => t.assignedStudentIds.includes(currentUser?.id || ''))
    : tasks;

  const filteredTasks = myTasks.filter(t => {
    return priorityFilter === 'all' || t.priority === priorityFilter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      showToast('Judul tugas wajib diisi', 'error');
      return;
    }

    const subtasks = taskSubtasksInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, i) => ({
        id: 'sub-' + Date.now() + '-' + i,
        title: text,
        completed: false,
      }));

    addTask({
      companyId: currentUser?.companyId || 'comp-1',
      mentorId: currentUser?.id || 'user-mentor-1',
      mentorName: currentUser?.name || 'Mentor Perusahaan',
      assignedStudentIds: taskAssignedStudents,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      instructions: taskInstructions.trim(),
      priority: taskPriority,
      deadline: taskDeadline,
      status: 'belum_dimulai',
      subtasks,
    });

    setShowCreateModal(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskInstructions('');
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!submissionNote.trim() && !submissionLink.trim()) {
      showToast('Sertakan catatan atau tautan bukti pekerjaan.', 'error');
      return;
    }

    submitTask(selectedTask.id, {
      note: submissionNote.trim(),
      linkUrl: submissionLink.trim() || undefined,
    });

    setShowSubmitModal(false);
    setSubmissionNote('');
    setSubmissionLink('');
    // refresh selected task
    const updated = tasks.find(t => t.id === selectedTask.id);
    if (updated) setSelectedTask(updated);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !gradingSubmissionId) return;

    gradeTaskSubmission(selectedTask.id, gradingSubmissionId, gradeScore, gradeFeedback.trim());
    setShowGradeModal(false);
    setGradeFeedback('');
    // refresh selected task
    const updated = tasks.find(t => t.id === selectedTask.id);
    if (updated) setSelectedTask(updated);
  };

  const kanbanColumns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'belum_dimulai', label: 'Belum Dimulai', color: 'bg-neutral-100 text-neutral-700' },
    { status: 'dikerjakan', label: 'Sedang Dikerjakan', color: 'bg-blue-100 text-blue-800' },
    { status: 'menunggu_review', label: 'Menunggu Review', color: 'bg-amber-100 text-amber-800' },
    { status: 'revisi', label: 'Perlu Revisi', color: 'bg-rose-100 text-rose-800' },
    { status: 'selesai', label: 'Selesai', color: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 sm:p-6 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
                Manajemen Proyek Industri
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">Standar Kanban & Sprint Agile</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
              Tugas & Proyek Magang
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Pantau progres checklist subtugas, pengumpulan hasil kerja, dan umpan balik mentor industri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="p-1 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 shadow-2xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  viewMode === 'kanban'
                    ? 'bg-[#E85D9E] text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Kanban Board"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  viewMode === 'list'
                    ? 'bg-[#E85D9E] text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Tabel List"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daftar</span>
              </button>
            </div>

            {isMentor && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white text-xs font-bold shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Tugas Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Filter Prioritas:</span>
          {['all', 'tinggi', 'sedang', 'rendah'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-lg capitalize font-semibold transition ${
                priorityFilter === p
                  ? 'bg-[#FFF8FC] text-[#E85D9E] border border-[#E85D9E]/30'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {p === 'all' ? 'Semua' : p}
            </button>
          ))}
        </div>
        <span className="text-neutral-400 text-[11px]">
          Total {filteredTasks.length} tugas ditemukan
        </span>
      </div>

      {/* View Mode: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div
                key={col.status}
                className="rounded-2xl bg-neutral-50/70 dark:bg-gray-900/60 p-3 border border-neutral-200/70 dark:border-neutral-800 flex flex-col min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {col.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] flex items-center justify-center font-bold">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="py-8 text-center text-neutral-400 text-xs italic">
                      Kosong
                    </div>
                  ) : (
                    columnTasks.map(task => {
                      const completedSubs = task.subtasks.filter(s => s.completed).length;
                      const percent =
                        task.subtasks.length > 0
                          ? Math.round((completedSubs / task.subtasks.length) * 100)
                          : 0;

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200/80 dark:border-neutral-700 hover:border-[#E85D9E]/50 shadow-2xs hover:shadow-xs transition cursor-pointer space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                task.priority === 'tinggi'
                                  ? 'bg-rose-100 text-rose-700'
                                  : task.priority === 'sedang'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {task.deadline}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Subtasks progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-neutral-400">
                              <span>Checklist Subtugas</span>
                              <span className="font-semibold">{completedSubs}/{task.subtasks.length}</span>
                            </div>
                            <div className="w-full bg-neutral-100 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#E85D9E] h-full rounded-full transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700 text-[10px] text-neutral-400">
                            <span>{task.submissions.length} Pengumpulan</span>
                            <span className="text-[#E85D9E] font-medium">Buka Detail →</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode: LIST TABLE */
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 dark:bg-gray-800/60 text-neutral-500 font-semibold uppercase border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="py-3 px-3">Judul Tugas</th>
                <th className="py-3 px-3">Prioritas</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3">Subtugas</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredTasks.map(task => {
                const completedSubs = task.subtasks.filter(s => s.completed).length;
                return (
                  <tr key={task.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-3">
                      <p className="font-bold text-neutral-900 dark:text-white">{task.title}</p>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{task.description}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="uppercase text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-600 dark:text-neutral-300">
                      {task.deadline}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#E85D9E]">
                        {completedSubs}/{task.subtasks.length} selesai
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 uppercase">
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF8FC] border border-[#E85D9E]/30 text-[#E85D9E] font-medium hover:bg-[#FCE7F3]"
                      >
                        Detail & Kumpul
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 sm:p-6 my-8 space-y-4 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#FCE7F3] text-[#E85D9E]">
                    Prioritas {selectedTask.priority}
                  </span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-neutral-500 font-mono">Batas: {selectedTask.deadline}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {selectedTask.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Instructions */}
            <div className="space-y-2">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {selectedTask.description}
              </p>
              {selectedTask.instructions && (
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 space-y-1">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    Instruksi Khusus Mentor:
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                    {selectedTask.instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Subtasks Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-neutral-800 dark:text-neutral-200">
                <span>Checklist Subtugas ({selectedTask.subtasks.filter(s => s.completed).length}/{selectedTask.subtasks.length}):</span>
              </div>
              <div className="space-y-1.5">
                {selectedTask.subtasks.map(sub => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => toggleSubtask(selectedTask.id, sub.id)}
                      className="rounded text-[#E85D9E] focus:ring-[#E85D9E] w-4 h-4 cursor-pointer"
                    />
                    <span
                      className={`text-xs ${
                        sub.completed ? 'line-through text-neutral-400' : 'text-neutral-700 dark:text-neutral-200 font-medium'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Change Status for Mentor */}
            {isMentor && (
              <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-gray-800 rounded-xl">
                <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                  Ubah Status Tugas:
                </span>
                <select
                  value={selectedTask.status}
                  onChange={e => updateTaskStatus(selectedTask.id, e.target.value as TaskStatus)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-900 font-bold text-[#E85D9E]"
                >
                  <option value="belum_dimulai">Belum Dimulai</option>
                  <option value="dikerjakan">Sedang Dikerjakan</option>
                  <option value="menunggu_review">Menunggu Review</option>
                  <option value="revisi">Perlu Revisi</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            )}

            {/* Submissions Section */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  Riwayat Pengumpulan ({selectedTask.submissions.length}):
                </span>
                {isStudent && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#E85D9E] text-white font-semibold flex items-center gap-1 hover:bg-[#D9468D]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kumpulkan Hasil Kerja</span>
                  </button>
                )}
              </div>

              {selectedTask.submissions.length === 0 ? (
                <p className="text-neutral-400 italic py-2">Belum ada pengumpulan untuk tugas ini.</p>
              ) : (
                <div className="space-y-2">
                  {selectedTask.submissions.map(subm => (
                    <div
                      key={subm.id}
                      className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-[#FFF8FC]/40 dark:bg-gray-800/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-white">{subm.studentName}</span>
                        <span className="text-[10px] font-mono text-neutral-400">{subm.submittedAt}</span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300">{subm.note}</p>
                      {subm.linkUrl && (
                        <a
                          href={subm.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#E85D9E] font-semibold underline text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Buka Tautan: {subm.linkUrl}</span>
                        </a>
                      )}

                      {subm.grade !== undefined ? (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold">Nilai: {subm.grade}/100</span>
                            {subm.feedback && <p className="text-[11px] mt-0.5">Umpan balik: "{subm.feedback}"</p>}
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      ) : (
                        isMentor && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => {
                                setGradingSubmissionId(subm.id);
                                setShowGradeModal(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Beri Nilai & Feedback</span>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Kumpulkan Hasil Pekerjaan
            </h3>
            <form onSubmit={handleSubmitWork} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Catatan Pekerjaan / Ringkasan Hasil
                </label>
                <textarea
                  value={submissionNote}
                  onChange={e => setSubmissionNote(e.target.value)}
                  placeholder="Jelaskan apa yang telah Anda selesaikan, branch repo, atau instruksi pengujian..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tautan File / GitHub / Figma / Google Drive
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/... atau https://figma.com/..."
                  value={submissionLink}
                  onChange={e => setSubmissionLink(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold"
                >
                  Kirim ke Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Grade Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Penilaian & Umpan Balik Tugas
            </h3>
            <form onSubmit={handleSaveGrade} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nilai Skor (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={e => setGradeScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-bold text-base tabular-nums"
                  required
                />
                <span className="text-[10px] text-neutral-400">Nilai &ge; 75 otomatis menandai tugas 'Selesai'</span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Umpan Balik Mentor
                </label>
                <textarea
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  placeholder="Beri apresiasi atau hal yang perlu ditingkatkan pada sprint selanjutnya..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 my-8 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#E85D9E]" />
                Buat Tugas & Proyek Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Integrasi API Payment Gateway & Toast"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Jelaskan tujuan dan ruang lingkup tugas ini..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Instruksi Langkah Pengerjaan
                </label>
                <textarea
                  value={taskInstructions}
                  onChange={e => setTaskInstructions(e.target.value)}
                  placeholder="1. Buat branch feature/...\n2. Pasang error boundary\n3. Lakukan PR review..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Prioritas
                  </label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as 'rendah' | 'sedang' | 'tinggi')}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Batas Deadline
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={e => setTaskDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Checklist Subtugas (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Subtugas 1, Subtugas 2, Subtugas 3"
                  value={taskSubtasksInput}
                  onChange={e => setTaskSubtasksInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white font-bold"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
