import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Reply, 
  Clock, 
  X, 
  Send 
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminMessage, MessageStatus } from '../../../types/admin';

export const AdminMessagesPage: React.FC = () => {
  const { messages, updateMessageStatus, replyToMessage, deleteMessage } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | MessageStatus>('All');
  
  // Quick reply modal
  const [activeReplyMsg, setActiveReplyMsg] = useState<AdminMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReplyMsg || !replyText) return;

    replyToMessage(activeReplyMsg.id, replyText);
    setActiveReplyMsg(null);
    setReplyText('');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete message inquiry from "${name}"?`)) {
      deleteMessage(id);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            INBOX & CLIENT INQUIRIES
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            Messages & Inquiries
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Direct web inquiries, custom shoot requests, and studio consultations.
          </p>
        </div>

        <div className="text-xs text-neutral-500 font-semibold">
          {messages.filter(m => m.status === 'Unread').length} Unread Messages
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Unread', 'Read', 'Replied'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-neutral-900 text-[#f3e5ab] shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/90 shadow-sm space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#aa820a] flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-neutral-800 font-cinzel">Studio Inbox Clear</p>
            <p className="text-xs text-neutral-500">
              {searchQuery || statusFilter !== 'All'
                ? 'No inquiries match your filter criteria.'
                : 'No client messages or inquiries yet. When visitors fill out the Contact page on the website, their message will appear here in real time.'}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-sm ${
                msg.status === 'Unread' 
                  ? 'border-[#d4af37]/80 bg-amber-50/20' 
                  : 'border-neutral-200/90 hover:border-neutral-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#aa820a] flex items-center justify-center font-bold font-cinzel shrink-0">
                    {msg.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      {msg.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        <span>{msg.email}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{msg.phone}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    msg.status === 'Unread' 
                      ? 'bg-amber-100 text-amber-900 border-amber-300' 
                      : msg.status === 'Replied'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}>
                    {msg.status}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {msg.receivedAt}
                  </span>
                </div>
              </div>

              {/* Subject & Message Content */}
              <div className="py-3 space-y-1">
                <h4 className="text-xs font-bold text-neutral-900 font-cinzel">
                  Subject: {msg.subject}
                </h4>
                <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  {msg.message}
                </p>
              </div>

              {/* Recorded Reply Note if present */}
              {msg.replyNote && (
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-blue-700">
                    <span>Studio Staff Reply:</span>
                    <span>{msg.repliedAt}</span>
                  </div>
                  <p className="italic">"{msg.replyNote}"</p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {msg.status === 'Unread' && (
                    <button
                      onClick={() => updateMessageStatus(msg.id, 'Read')}
                      className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold"
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveReplyMsg(msg);
                      setReplyText(msg.replyNote || '');
                    }}
                    className="px-3.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Reply className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{msg.status === 'Replied' ? 'Update Reply' : 'Send Studio Reply'}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(msg.id, msg.name)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-100 text-neutral-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* REPLY MODAL */}
      {activeReplyMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                  Reply to {activeReplyMsg.name}
                </h3>
                <p className="text-xs text-neutral-500">{activeReplyMsg.email} • {activeReplyMsg.phone}</p>
              </div>
              <button onClick={() => setActiveReplyMsg(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-700">
              <span className="font-semibold block text-neutral-900 mb-1">Inquiry:</span>
              "{activeReplyMsg.message}"
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Studio Response / Quotation Message *</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Dear client, thank you for reaching out to NG Digital Studio..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setActiveReplyMsg(null)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
