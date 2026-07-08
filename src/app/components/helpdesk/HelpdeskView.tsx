'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  SlidersVertical, 
  Plus, 
  Send, 
  Paperclip, 
  HelpCircle, 
  FileCode, 
  ChevronDown, 
  Bell, 
  Search, 
  User,
  Building2,
  LayoutDashboard,
  Share2,
  SquarePen,
  Calendar,
  Inbox as InboxIcon,
  ChartColumn,
  Images,
  Users,
  Settings,
  ChevronLeft,
  RefreshCw,
  SearchIcon,
  Lock,
  Download,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getMe, getStoredToken, API_URL } from '@/app/lib/api';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'support';
  message: string;
  createdAt: string;
  isInternal?: boolean;
  isEmail?: boolean;
}

interface Ticket {
  id: string;
  ticketCode: string;
  tenantId: string | null;
  email: string;
  name: string;
  workspaceId: string;
  subject: string;
  category: 'questions' | 'billing' | 'technical';
  priority: 'low' | 'medium' | 'high' | 'critical' | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export default function HelpdeskView({ embedMode = false }: { embedMode?: boolean }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Auth & API States
  const [token, setToken] = useState<string | null>(null);
  const { currentUser } = useWorkspace();
  const [isRegistered, setIsRegistered] = useState(embedMode);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [activeTicketMessages, setActiveTicketMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Guest Profile details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Forms States
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'questions' | 'billing' | 'technical'>('questions');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical' | null>(null);
  const [description, setDescription] = useState('');
  
  // Chat Reply State
  const [replyText, setReplyMessage] = useState('');

  // Attachments States
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; size: number; type: string; base64: string }[]>([]);
  const [replyFiles, setReplyFiles] = useState<{ name: string; size: number; type: string; base64: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const replyFileInputRef = React.useRef<HTMLInputElement>(null);

  const parseMessageContent = (rawMessage: string) => {
    const delimiter = '\n\n---ATTACHMENTS---\n';
    if (rawMessage.includes(delimiter)) {
      const parts = rawMessage.split(delimiter);
      const textContent = parts[0];
      try {
        const attachments = JSON.parse(parts[1]);
        return { text: textContent, attachments };
      } catch (e) {
        return { text: rawMessage, attachments: [] };
      }
    }
    return { text: rawMessage, attachments: [] };
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'dispatch' | 'reply') => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    filesArray.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 10MB size limit.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const payload = {
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64String
        };
        
        if (target === 'dispatch') {
          setSelectedFiles(prev => [...prev, payload]);
        } else {
          setReplyFiles(prev => [...prev, payload]);
        }
      };
      reader.onerror = () => {
        toast.error(`Failed to read file ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const removeSelectedFile = (index: number, target: 'dispatch' | 'reply') => {
    if (target === 'dispatch') {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setReplyFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    setMounted(true);
    // Cleanup old guest tickets from local storage to prevent ghosting
    localStorage.removeItem('nconnect_guest_tickets');
  }, []);

  // Load Auth Session & Initial Tickets
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      setIsLoading(true);
      const storedToken = getStoredToken();
      
      let isPlatformAdmin = false;
      let isRegisteredUser = false;

      if (storedToken) {
        try {
          const payloadBase64 = storedToken.split('.')[1];
          if (payloadBase64) {
            let normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            while (normalized.length % 4) normalized += '=';
            const payload = JSON.parse(atob(normalized));
            if (payload) {
              if (payload['custom:role'] === 'platform_admin') {
                isPlatformAdmin = true;
              } else {
                isRegisteredUser = true;
              }
              const tokenEmail = payload.email || '';
              setGuestEmail(tokenEmail);
              setGuestName(tokenEmail.split('@')[0] || 'Registered User');
            }
          }
        } catch (e) {
          console.error('Failed to parse token role in helpdesk:', e);
        }
      } else if (currentUser && currentUser.role !== 'guest') {
        isRegisteredUser = true;
        const safeEmail = currentUser.email && currentUser.email.includes('@')
          ? currentUser.email
          : `${(currentUser.name || 'user').toLowerCase().replace(/\s+/g, '')}@nconnect.app`;
        setGuestEmail(safeEmail);
        setGuestName(currentUser.name || 'Registered User');
      }

      // Set effective token and registration state
      const effectiveToken = storedToken || null;
      setToken(effectiveToken);
      setIsRegistered(!!storedToken || isRegisteredUser);
      
      if (storedToken) {
        try {
          const profile = await getMe(storedToken);
          setUserProfile(profile);
        } catch (err: any) {
          console.error('Failed to load profile in helpdesk:', err);
        }
      }

      if (effectiveToken) {
        try {
          // Fetch Authenticated Tickets
          const res = await fetch(`${API_URL}/api/v1/helpdesk/tickets/user`, {
            headers: { 'Authorization': `Bearer ${effectiveToken.trim().replace(/^"|"$/g, '')}` }
          });
          const data = await res.json();
          if (data.success && data.tickets) {
            setTickets(data.tickets);
            // Auto-select the first ticket if nothing is selected
            if (data.tickets.length > 0 && !selectedTicketId) {
              setSelectedTicketId(data.tickets[0].id);
            }
          }
        } catch (err: any) {
          console.error('Failed to load tickets in helpdesk:', err);
        }
      } else {
        setTickets([]);
        setSelectedTicketId('');
      }
      setIsLoading(false);
    };
    
    checkAuthAndLoad();
  }, [embedMode, currentUser]);

  // Fetch Messages when selected ticket changes (with background auto-polling every 8 seconds)
  useEffect(() => {
    if (!selectedTicketId) {
      setActiveTicketMessages([]);
      return;
    }
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/helpdesk/tickets/${selectedTicketId}/messages`, {
          headers: token ? { 'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, '')}` } : {}
        });
        const data = await res.json();
        if (data.success && data.messages) {
          setActiveTicketMessages(data.messages);
          // Sync status from backend to ensure real-time locking
          if (data.status) {
            setTickets(prev => prev.map(t => 
              t.id === selectedTicketId ? { ...t, status: data.status } : t
            ));
          }
        }
      } catch (err) {
        console.error('Error fetching ticket messages:', err);
      }
    };

    fetchMessages();

    // Auto-poll messages quietly in the background
    const interval = setInterval(() => {
      fetchMessages();
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedTicketId, token]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  // Manual messages refresh trigger
  const handleRefreshMessages = async () => {
    if (!selectedTicketId) return;
    setIsRefreshing(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token.trim().replace(/^"|"$/g, '')}`;
      }
      const res = await fetch(`/api/v1/helpdesk/tickets/${selectedTicketId}/messages`, { headers });
      const data = await res.json();
      if (data.success && data.messages) {
        setActiveTicketMessages(data.messages);
        toast.success('Chat thread refreshed successfully.');
      }
    } catch (err) {
      toast.error('Failed to refresh messages.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('Please fill in all ticket details.');
      return;
    }

    setIsCreating(true);
    try {
      // Append attachments if present
      let messageBody = description;
      if (selectedFiles.length > 0) {
        messageBody += `\n\n---ATTACHMENTS---\n${JSON.stringify(selectedFiles)}`;
      }

      // Check both state token and fresh localStorage token to prevent race conditions on refresh
      const activeToken = token || getStoredToken();

      if (activeToken) {
        // Authenticated client creation
        const res = await fetch(`${API_URL}/api/v1/helpdesk/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken.trim().replace(/^"|"$/g, '')}`,
          },
          body: JSON.stringify({
            subject,
            category,
            priority,
            message: messageBody,
            workspaceId: currentUser?.customTenantId || currentUser?.tenantId || '',
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to dispatch ticket. Your account may not be associated with a workspace.');
        }

        const newTicket = data.ticket;
        setTickets(prev => [newTicket, ...prev]);
        setSelectedTicketId(newTicket.id);
        
        setSubject('');
        setDescription('');
        setSelectedFiles([]);
        toast.success(`Support ticket ${newTicket.ticketCode} successfully dispatched to support operations queue!`);
      } else {
        toast.error('Your session has expired. Please log in again to raise a support ticket.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit ticket.');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = replyText.trim();
    if (!messageContent && replyFiles.length === 0) return;
    if (!selectedTicketId) return;

    if (activeTicket?.status === 'closed') {
      toast.error('This ticket has been closed. You cannot send new messages.');
      return;
    }

    setIsReplying(true);
    try {
      let finalMessage = messageContent;
      if (replyFiles.length > 0) {
        finalMessage += `\n\n---ATTACHMENTS---\n${JSON.stringify(replyFiles)}`;
      }

      const activeToken = token || getStoredToken();

      if (activeToken) {
        // Authenticated client reply
        const res = await fetch(`${API_URL}/api/v1/helpdesk/tickets/${selectedTicketId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken.trim().replace(/^"|"$/g, '')}`,
          },
          body: JSON.stringify({ message: finalMessage }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to stream reply.');
        }

        setActiveTicketMessages(prev => [...prev, data.message]);
        setReplyMessage('');
        setReplyFiles([]);
        toast.success('Your message has been streamed to the support dashboard.');
      } else {
        toast.error('Session expired. Please log in to reply.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to post reply.');
    } finally {
      setIsReplying(false);
    }
  };

  const innerContent = (
    <>
      {/* Main Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-zinc-200/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600 shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-950 font-mono tracking-tight uppercase">
              Tenant Support Center
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-semibold tracking-tight mt-1 max-w-2xl">
            Welcome back! Create secure workspace tickets, track ongoing discussions with support staff, and review system audits.
          </p>
        </div>
      </div>

      {/* Interactive Shell Body (Restored 2-Column Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Col: Dispatch Triage (2 spans) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Ticket Dispatch Card */}
          <div className="bg-white border border-zinc-200/60 shadow-md rounded-2xl overflow-hidden">
            <div className="bg-zinc-50/50 border-b border-zinc-200/60 p-6">
              <h4 className="text-xs sm:text-[13px] uppercase tracking-wider text-zinc-800 flex items-center gap-2 font-bold">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Dispatch Support Ticket</span>
              </h4>
              <p className="text-zinc-400 font-semibold text-[11px] mt-0.5">
                Securely lodge a priority workspace ticket.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-5">
              <div>
                <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Subject Line</label>
                <input 
                  type="text" 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the issue..."
                  className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-zinc-50/50 border border-zinc-200 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 hover:bg-zinc-50 transition-colors font-semibold shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Category Select</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-zinc-50/50 border border-zinc-200 text-xs text-zinc-800 font-bold focus:outline-none focus:border-indigo-500 hover:bg-zinc-50 transition-colors cursor-pointer shadow-sm"
                  >
                    <option value="questions">General Questions</option>
                    <option value="billing">Billing & Receipts</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Detailed Description</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a step-by-step description of the technical error..."
                  className="w-full p-4 h-32 bg-zinc-50/50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 hover:bg-zinc-50 transition-colors resize-none leading-relaxed shadow-sm"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 w-full">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-700 shadow-sm">
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <span className="text-[9px] text-zinc-400 font-mono">({formatFileSize(file.size)})</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(idx, 'dispatch')}
                        className="text-zinc-400 hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 text-[10px] font-bold h-9 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Attachments</span>
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileChange(e, 'dispatch')}
                />
                <button 
                  type="submit"
                  disabled={isCreating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/10 border border-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {isCreating ? 'Dispatching...' : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Col: Conversational Chat Thread (3 spans) */}
        <div className="xl:col-span-3">
          <div className="bg-white border border-zinc-200/60 shadow-md rounded-2xl flex flex-col h-[600px] overflow-hidden">
            
            {tickets.length > 0 && activeTicket ? (
              <div className="p-5 border-b border-zinc-200/50 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-zinc-200/80 shadow-sm shrink-0 h-9 px-3 hover:bg-zinc-50 transition-all">
                        <HelpCircle className="w-4 h-4 text-indigo-500" />
                        <span className="text-zinc-800 text-xs font-extrabold font-mono">
                          {activeTicket?.ticketCode || 'Select Ticket'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 rounded-2xl border-zinc-200/60 shadow-xl p-1.5 max-h-[190px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300">
                      <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
                        Active Tickets
                      </DropdownMenuLabel>
                      {tickets.map(t => (
                        <DropdownMenuItem
                          key={t.id}
                          onClick={() => setSelectedTicketId(t.id)}
                          className={`rounded-xl p-2 cursor-pointer transition-all duration-150 text-xs font-mono font-bold ${
                            t.id === selectedTicketId ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          {t.ticketCode}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-extrabold text-zinc-950 truncate leading-snug">{activeTicket.subject}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={handleRefreshMessages}
                    disabled={isRefreshing}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors text-zinc-400 hover:text-zinc-600 disabled:opacity-50 shadow-sm mr-1"
                    title="Refresh Chat Logs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <span className={`px-2.5 py-1 text-[8.5px] font-mono font-black rounded-lg border ${
                    activeTicket.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-150' :
                    activeTicket.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-150' :
                    activeTicket.status === 'closed' ? 'bg-zinc-50 text-zinc-500 border-zinc-150' :
                    'bg-zinc-50 text-zinc-500 border-zinc-200'
                  }`}>
                    {activeTicket.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 border-b border-zinc-200/50 bg-zinc-50/50 text-center">
                <span className="text-xs font-bold text-zinc-400">No active support threads.</span>
              </div>
            )}

            <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-zinc-50/30 scrollbar-thin scrollbar-thumb-zinc-200 border-b border-zinc-200/40">
              {tickets.length > 0 && activeTicket ? (
                activeTicketMessages.length > 0 ? (
                  activeTicketMessages.map((msg) => {
                    const isClient = msg.senderRole === 'client';
                    const { text, attachments } = parseMessageContent(msg.message);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col p-4 rounded-2xl border max-w-[85%] text-xs shadow-sm transition-all duration-300 ${
                          isClient
                            ? 'ml-auto bg-gradient-to-br from-indigo-50/70 to-indigo-100/20 border-indigo-100/60 text-zinc-800 rounded-tr-none'
                            : 'mr-auto bg-white border-zinc-200 text-zinc-800 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-bold text-[11px] ${isClient ? 'text-indigo-600' : 'text-zinc-800'}`}>
                            {isClient ? msg.senderName : 'Support Agent'}
                          </span>
                          {!isClient && msg.isEmail && (
                            <span className="text-[8px] font-mono font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-100/40 ml-1">
                              reponded via email
                            </span>
                          )}
                          <span className="text-[9px] text-zinc-400 font-mono ml-auto">
                            {mounted ? `${formatDate(msg.createdAt)} | ${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap text-zinc-700 font-semibold">{text}</p>

                        {attachments && attachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-zinc-100/60 space-y-2">
                            <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider block">Attachments:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {attachments.map((file: any, fileIdx: number) => {
                                const isImage = file.type?.startsWith('image/');
                                return (
                                  <a
                                    key={fileIdx}
                                    href={file.base64}
                                    download={!isImage ? file.name : undefined}
                                    onClick={(e) => {
                                      if (isImage) {
                                        e.preventDefault();
                                        setPreviewImage({ url: file.base64, name: file.name });
                                      }
                                    }}
                                    className="flex items-center gap-2.5 p-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 rounded-xl transition-all select-none cursor-pointer"
                                  >
                                    <div className="bg-white p-1.5 rounded-lg border border-zinc-200/50 shadow-sm shrink-0">
                                      {isImage ? (
                                        <img src={file.base64} alt={file.name} className="w-6 h-6 object-cover rounded" />
                                      ) : (
                                        <FileCode className="w-6 h-6 text-indigo-500" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h5 className="text-[10px] font-bold text-zinc-800 truncate" title={file.name}>
                                        {file.name}
                                      </h5>
                                      <p className="text-[8.5px] text-zinc-400 font-mono mt-0.5">{formatFileSize(file.size)}</p>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
                    <InboxIcon className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
                    <h5 className="text-xs font-bold text-zinc-800">Initialising support log stream...</h5>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="p-4 bg-indigo-50 rounded-full border border-indigo-100/30 text-indigo-500">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h5 className="text-xs sm:text-[13px] font-extrabold text-zinc-800">No Support Thread Selected</h5>
                </div>
              )}
            </div>

            {/* Composer */}
            {tickets.length > 0 && activeTicket && (
              <div className="border-t border-zinc-200/50 p-4 bg-white space-y-3">
                {activeTicket.status === 'closed' ? (
                  <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 border border-zinc-200/60 rounded-xl space-y-2 text-center shadow-inner">
                    <span className="p-2.5 bg-zinc-100 rounded-xl text-zinc-400 border border-zinc-200/30">
                      <Lock className="w-5 h-5 text-zinc-500 animate-pulse" />
                    </span>
                    <h5 className="text-xs font-black text-zinc-800 font-mono tracking-tight uppercase">Support Thread Closed</h5>
                    <p className="text-[10px] text-zinc-400 max-w-md font-bold leading-normal">
                      This support request has been completed and marked as closed by operations administration. No further responses can be sent on this thread.
                    </p>
                  </div>
                ) : (
                  <>
                    {replyFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/50">
                        {replyFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[10px] font-bold text-zinc-700 shadow-sm">
                            <span className="truncate max-w-[120px]">{file.name}</span>
                            <span className="text-[9px] text-zinc-400 font-mono">({formatFileSize(file.size)})</span>
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(idx, 'reply')}
                              className="text-zinc-400 hover:text-red-500 transition-colors ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handlePostReply} className="flex gap-2.5 items-center">
                      <button 
                        type="button" 
                        onClick={() => replyFileInputRef.current?.click()}
                        className="border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 p-3 rounded-xl flex items-center justify-center shadow-sm transition-all"
                        title="Attachments"
                      >
                        <Paperclip className="w-4 h-4 text-indigo-500" />
                      </button>
                      <input 
                        type="file"
                        ref={replyFileInputRef}
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileChange(e, 'reply')}
                      />
                      <input 
                        type="text" 
                        value={replyText}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Reply to helpdesk support operator..."
                        className="flex-1 bg-zinc-50 border border-zinc-200/80 text-xs font-semibold px-4.5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                        disabled={isReplying}
                      />
                      <button 
                        type="submit"
                        disabled={isReplying || (!replyText.trim() && replyFiles.length === 0)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-md shadow-indigo-600/5 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-white border border-zinc-200/60 rounded-2xl shadow-md p-8">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400 font-mono">Syncing helpdesk dashboard logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {innerContent}
    </div>
  );
}
