import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  User,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { User as UserType } from '../../types';

export const MessagesChatView: React.FC = () => {
  const { currentUser, users, messages, sendMessage } = useApp();

  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    // If student, partner with mentor Budi Hartono by default
    if (currentUser?.role === 'siswa') return 'user-mentor-1';
    // If mentor, partner with student Anisa by default
    return 'user-siswa-1';
  });

  const [messageInput, setMessageInput] = useState('');

  const partners = users.filter(u => u.id !== currentUser?.id);
  const activePartner = users.find(u => u.id === activePartnerId) || partners[0];

  // Conversation filter
  const conversation = messages.filter(
    m =>
      (m.senderId === currentUser?.id && m.recipientId === activePartner?.id) ||
      (m.senderId === activePartner?.id && m.recipientId === currentUser?.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activePartner) return;
    sendMessage(activePartner.id, messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF8FC] via-white to-[#FCE7F3]/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-5 border border-[#E85D9E]/20 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#E85D9E] bg-[#FCE7F3] dark:bg-[#E85D9E]/20 px-2.5 py-0.5 rounded-full">
            Konsultasi & Diskusi DUDI
          </span>
          <span className="text-xs text-neutral-400">·</span>
          <span className="text-xs text-neutral-500">Komunikasi Siswa, Mentor & Guru</span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#302633] dark:text-white mt-1">
          Pusat Konsultasi & Pesan Magang
        </h1>
      </div>

      {/* Chat Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden h-[540px]">
        {/* Contact List */}
        <div className="border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full bg-neutral-50/50 dark:bg-gray-900/40">
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Kontak Bimbingan ({partners.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {partners.map(user => {
              const isActive = user.id === activePartnerId;
              return (
                <button
                  key={user.id}
                  onClick={() => setActivePartnerId(user.id)}
                  className={`w-full text-left p-3 flex items-center gap-3 transition ${
                    isActive
                      ? 'bg-[#FFF8FC] dark:bg-gray-800/80 border-r-2 border-[#E85D9E]'
                      : 'hover:bg-neutral-100/60 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#E85D9E] font-semibold uppercase tracking-wider">
                      {user.role.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {user.companyName || user.schoolName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages Pane */}
        <div className="md:col-span-2 flex flex-col h-full bg-white dark:bg-gray-900">
          {/* Header */}
          {activePartner ? (
            <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activePartner.avatar}
                  alt={activePartner.name}
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {activePartner.name}
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    {activePartner.role.replace('_', ' ').toUpperCase()} · {activePartner.companyName || activePartner.schoolName}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {conversation.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 text-xs italic space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-[#E85D9E]" />
                <p>Belum ada riwayat pesan dengan {activePartner?.name}.</p>
                <p className="text-[11px]">Ketik pesan di bawah untuk memulai konsultasi bimbingan.</p>
              </div>
            ) : (
              conversation.map(msg => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md px-3.5 py-2.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                        isMe
                          ? 'bg-[#E85D9E] text-white rounded-br-xs'
                          : 'bg-neutral-100 dark:bg-gray-800 text-neutral-800 dark:text-neutral-200 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <span
                        className={`text-[9px] font-mono block text-right ${
                          isMe ? 'text-pink-100' : 'text-neutral-400'
                        }`}
                      >
                        {msg.timestamp.split(' ')[1] || msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ketik pesan untuk ${activePartner?.name || 'kontak'}...`}
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D9E]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#E85D9E] hover:bg-[#D9468D] text-white shadow-xs transition"
              title="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
