'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  AlertCircle, 
  User, 
  ShieldAlert, 
  Send, 
  Check, 
  Clock, 
  X, 
  Eye, 
  Lock, 
  Globe 
} from 'lucide-react';
import { toast } from 'sonner';

// Interfaces mapping directly to PDF DB schemas
interface SupportTicket {
  id: string;
  workspaceId: string;
  subject: string;
  category: 'billing' | 'technical' | 'questions';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
}

interface TicketReply {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'support';
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export default function ModuleHelpDesk() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('ticket-1');
  
  // New reply compose states
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Mock DB - tickets table
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'ticket-1', workspaceId: 'ws-horizon', subject: 'Billing error: Charged twice on professional plan renewal', category: 'billing', priority: 'high', status: 'open', createdBy: 'Peter Parker', assignedTo: null, createdAt: '2026-06-18T10:00:00Z' },
    { id: 'ticket-2', workspaceId: 'ws-stark', subject: 'SMTP SMTP relay handshake timeout on ap-south-1', category: 'technical', priority: 'critical', status: 'in_progress', createdBy: 'Tony Stark', assignedTo: 'Naman Dev', createdAt: '2026-06-18T11:20:00Z' },
    { id: 'ticket-3', workspaceId: 'ws-wayne', subject: 'How do I export my weekly campaigns analytics report?', category: 'questions', priority: 'low', status: 'resolved', createdBy: 'Lucius Fox', assignedTo: 'Naman Dev', createdAt: '2026-06-15T09:15:00Z' },
    { id: 'ticket-4', workspaceId: 'ws-lex', subject: 'Webhook signature verification fails consistently', category: 'technical', priority: 'medium', status: 'open', createdBy: 'Lex Luthor', assignedTo: null, createdAt: '2026-06-19T08:00:00Z' }
  ]);

  // Mock DB - ticket_replies table
  const [replies, setReplies] = useState<TicketReply[]>([
    // Ticket 1: Double Billing Replies
    { id: 'rep-1-1', ticketId: 'ticket-1', senderId: 'user-peter', senderName: 'Peter Parker', senderRole: 'client', message: 'Hello, I checked my bank ledger and noticed I was charged twice ($49 x 2) for my professional plan subscription today. Please help refund one charge.', isInternal: false, createdAt: '2026-06-18T10:00:00Z' },
    { id: 'rep-1-2', ticketId: 'ticket-1', senderId: 'op-naman', senderName: 'Naman Dev', senderRole: 'support', message: 'Check Razorpay payment ledger for transaction hash duplicates under the email peter@horizon.sh.', isInternal: true, createdAt: '2026-06-18T10:15:00Z' },

    // Ticket 2: SMTP relay timeout
    { id: 'rep-2-1', ticketId: 'ticket-2', senderId: 'user-tony', senderName: 'Tony Stark', senderRole: 'client', message: 'The SES SMTP handshake times out during onboarding. Is ap-south-1 experiencing a gateway failure?', isInternal: false, createdAt: '2026-06-18T11:20:00Z' },
    { id: 'rep-2-2', ticketId: 'ticket-2', senderId: 'op-naman', senderName: 'Naman Dev', senderRole: 'support', message: 'Checked AWS regional status page. Cognito token validations are lagging. Simulated relay fallback to ap-southeast-1 to buy time.', isInternal: true, createdAt: '2026-06-18T11:25:00Z' },
    { id: 'rep-2-3', ticketId: 'ticket-2', senderId: 'op-naman', senderName: 'Naman Dev', senderRole: 'support', message: 'Hello Tony! We detected regional Cognito latency in AWS AP-SOUTH-1. I have updated your relay rules to route via SE-1 which should resolve the timeout immediately. Can you verify now?', isInternal: false, createdAt: '2026-06-18T11:30:00Z' },
    
    // Ticket 3: Report export question
    { id: 'rep-3-1', ticketId: 'ticket-3', senderId: 'user-lucius', senderName: 'Lucius Fox', senderRole: 'client', message: 'Is there a CSV or JSON payload export endpoint for campaign reports?', isInternal: false, createdAt: '2026-06-15T09:15:00Z' },
    { id: 'rep-3-2', ticketId: 'ticket-3', senderId: 'op-naman', senderName: 'Naman Dev', senderRole: 'support', message: 'Hi Lucius, yes! Head over to Dashboard -> Reports, and click the "Export Ledger" dropdown on the top right. You can select either raw CSV or optimized PDF report output.', isInternal: false, createdAt: '2026-06-15T10:05:00Z' }
  ]);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];
  const selectedReplies = replies.filter(r => r.ticketId === selectedTicket.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const newReply: TicketReply = {
      id: `rep-${selectedTicket.id.replace('ticket-', '')}-${selectedReplies.length + 1}`,
      ticketId: selectedTicket.id,
      senderId: 'op-naman',
      senderName: 'Naman Dev',
      senderRole: 'support',
      message: replyMessage,
      isInternal: isInternalNote,
      createdAt: new Date().toISOString()
    };

    setReplies(prev => [...prev, newReply]);
    
    // Auto-update ticket status to in_progress on operator reply (unless resolved/closed)
    if (selectedTicket.status === 'open' && !isInternalNote) {
      setTickets(prev => prev.map(t => {
        if (t.id === selectedTicket.id) {
          return { ...t, status: 'in_progress' };
        }
        return t;
      }));
    }

    setReplyMessage('');
    
    if (isInternalNote) {
      toast.info('Private internal staff note added!');
    } else {
      toast.success('Reply submitted to customer client!');
    }
  };

  const handleStatusChange = (status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return { ...t, status };
      }
      return t;
    }));
    toast.success(`Ticket status updated to ${status.toUpperCase()}!`);
  };

  const handlePriorityChange = (priority: SupportTicket['priority']) => {
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return { ...t, priority };
      }
      return t;
    }));
    toast.success(`Priority escalated to ${priority.toUpperCase()}!`);
  };

  const handleAssignToMe = () => {
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return { ...t, assignedTo: 'Naman Dev' };
      }
      return t;
    }));
    toast.success('Support ticket successfully assigned to your workspace session.');
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.workspaceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          Support Help Desk
        </h1>
        <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">
          Resolve client tickets, dispatch public replies, and manage private internal operator audit trails. Fully compliant with tickets & ticket_replies tables.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left pane: Ticket queue registry */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search subjects, clients, workspace..."
                className="w-full bg-zinc-50 border border-zinc-200 text-xs font-semibold px-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sub Filters */}
            <div className="flex gap-1 bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/40">
              {(['all', 'open', 'in_progress', 'resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all ${
                    statusFilter === tab
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {tab === 'in_progress' ? 'Active' : tab}
                </button>
              ))}
            </div>

            {/* Tickets Grid */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredTickets.map(t => {
                const isSelected = t.id === selectedTicketId;
                const pColor = 
                  t.priority === 'critical' ? 'text-red-600 bg-red-50 border-red-200' :
                  t.priority === 'high' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                  t.priority === 'medium' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                  'text-zinc-600 bg-zinc-50 border-zinc-200';

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-50/20 to-indigo-50/5 border-purple-200/80 shadow-sm'
                        : 'bg-white border-zinc-200/40 hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tight">
                        ID: {t.id} • {t.category}
                      </span>
                      <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${pColor}`}>
                        {t.priority}
                      </span>
                    </div>

                    <h4 className="text-[12px] font-bold text-zinc-900 leading-snug line-clamp-2">
                      {t.subject}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[10px] text-zinc-400 font-semibold">
                      <span>By: {t.createdBy}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        t.status === 'open' ? 'bg-blue-50 text-blue-600' :
                        t.status === 'in_progress' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right pane: conversational chat workspace */}
        <div className="xl:col-span-7">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[500px] h-[550px]">
            {/* Header controls */}
            <div className="border-b border-zinc-200/50 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-950 leading-snug line-clamp-1">
                  {selectedTicket.subject}
                </h3>
                <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-zinc-400" />
                  Client Admin: {selectedTicket.createdBy} • Partition Workspace: {selectedTicket.workspaceId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Assign Button */}
                {!selectedTicket.assignedTo ? (
                  <button
                    onClick={handleAssignToMe}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all"
                  >
                    Assign To Me
                  </button>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/50">
                    Assigned: {selectedTicket.assignedTo}
                  </span>
                )}

                {/* Status Switcher */}
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(e.target.value as SupportTicket['status'])}
                  className="bg-zinc-50 border border-zinc-200 text-[10px] font-bold uppercase rounded-xl px-2 py-2"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Replies Stream Feed */}
            <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
              {selectedReplies.map((r) => {
                const isSupport = r.senderRole === 'support';
                const isInternal = r.isInternal;

                return (
                  <div
                    key={r.id}
                    className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-xs font-semibold ${
                      isInternal
                        ? 'bg-amber-50/50 border border-amber-200/50 mr-auto shadow-[inset_1px_1px_3px_rgba(245,158,11,0.02)]'
                        : isSupport
                          ? 'bg-purple-500/5 border border-purple-200/40 ml-auto'
                          : 'bg-zinc-50/80 border border-zinc-200/40 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-zinc-900">{r.senderName}</span>
                        {isInternal && (
                          <span className="text-[8px] font-mono font-extrabold text-amber-700 bg-amber-100/50 px-1 rounded flex items-center gap-0.5">
                            <Lock className="w-2 h-2" />
                            INTERNAL NOTE
                          </span>
                        )}
                        {!isInternal && isSupport && (
                          <span className="text-[8px] font-mono font-extrabold text-purple-700 bg-purple-100/50 px-1 rounded flex items-center gap-0.5">
                            <Globe className="w-2 h-2" />
                            CLIENT PUBLIC
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400">
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-zinc-700 font-semibold whitespace-pre-line leading-relaxed">
                      {r.message}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Message compose bar */}
            <form onSubmit={handlePostReply} className="border-t border-zinc-200/50 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                {/* Note toggle */}
                <button
                  type="button"
                  onClick={() => setIsInternalNote(!isInternalNote)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                    isInternalNote
                      ? 'bg-amber-50 border-amber-200 text-amber-700 font-black'
                      : 'bg-zinc-50/50 border-zinc-200/50 text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Lock className={`w-3 h-3 ${isInternalNote ? 'text-amber-600' : 'text-zinc-400'}`} />
                  Post as Private Internal Note
                </button>

                <span className="text-[9.5px] font-mono text-zinc-400 font-bold">
                  SMTP Mail Status: <span className="text-emerald-500 font-extrabold">GATEWAY VERIFIED</span>
                </span>
              </div>

              <div className="flex gap-2.5">
                <input
                  type="text"
                  placeholder={isInternalNote ? "Leave a private audit note for internal support staff..." : "Draft a message to the customer..."}
                  className="flex-1 bg-zinc-50 border border-zinc-200 text-xs font-semibold px-4 py-3 rounded-xl focus:outline-none"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className={`text-white font-bold text-xs p-3.5 rounded-xl transition-all shadow-md flex items-center justify-center ${
                    isInternalNote
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/10'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/10'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
