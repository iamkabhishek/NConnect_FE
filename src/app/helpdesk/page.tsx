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
import { getMe, getStoredToken } from '../lib/api';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'support';
  message: string;
  createdAt: string;
  isInternal?: boolean;
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
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export default function ClientHelpdesk({ embedMode = false }: { embedMode?: boolean }) {
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
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
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

      let effectiveToken = null;
      if (embedMode) {
        setIsRegistered(isRegisteredUser);
        effectiveToken = isPlatformAdmin ? null : storedToken;
        setToken(effectiveToken);
      } else {
        setIsRegistered(false);
        setToken(null);
      }
      
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
          const res = await fetch('/api/v1/helpdesk/tickets', {
            headers: { 'Authorization': `Bearer ${effectiveToken.trim().replace(/^"|"$/g, '')}` }
          });
          const data = await res.json();
          if (data.success && data.tickets) {
            setTickets(data.tickets);
            if (data.tickets.length > 0) {
              setSelectedTicketId(data.tickets[0].id);
            }
          }
        } catch (err: any) {
          console.error('Failed to load authenticated tickets:', err);
          setToken(null);
        }
      } else {
        // Guest mode or Simulated persona — check if we have secure session restore query parameters in the URL
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const urlCode = params ? params.get('ticketCode') : null;
        const urlEmail = params ? params.get('email') : null;

        if (urlCode && urlEmail) {
          try {
            const res = await fetch('/api/v1/helpdesk/tickets/guest/lookup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: urlEmail, ticketCode: urlCode }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
              const restoredTicket = data.ticket;
              
              // Load current localStorage guest tickets to merge and update cache
              const saved = localStorage.getItem('nconnect_guest_tickets');
              let existing = saved ? JSON.parse(saved) : [];
              
              // De-duplicate if the ticket already exists in the cache
              existing = existing.filter((t: any) => t.id !== restoredTicket.id);
              
              const ticketSummary = {
                id: restoredTicket.id,
                ticketCode: restoredTicket.ticketCode,
                tenantId: null,
                email: restoredTicket.email,
                name: restoredTicket.name,
                workspaceId: restoredTicket.workspaceId,
                subject: restoredTicket.subject,
                category: restoredTicket.category,
                priority: restoredTicket.priority,
                status: restoredTicket.status,
                createdAt: restoredTicket.createdAt,
                updatedAt: restoredTicket.updatedAt
              };
              existing.unshift(ticketSummary);
              localStorage.setItem('nconnect_guest_tickets', JSON.stringify(existing));
              
              setTickets(existing);
              setSelectedTicketId(restoredTicket.id);
              setActiveTicketMessages(restoredTicket.messages || []);
              
              toast.success(`Session recovered successfully! Selected Ticket ${restoredTicket.ticketCode}`);
              
              // Clean up URL parameters beautifully
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, '', cleanUrl);
            } else {
              throw new Error(data.error || 'Ticket not found.');
            }
          } catch (err: any) {
            console.error('Failed to auto-restore session from URL:', err);
            toast.error(`Auto-restore failed: ${err.message || 'Check ticket details'}`);
            
            // Fallback: load cache from localStorage
            const saved = localStorage.getItem('nconnect_guest_tickets');
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                setTickets(parsed);
                if (parsed.length > 0) {
                  setSelectedTicketId(parsed[0].id);
                }
              } catch (e) {
                console.error('Failed to parse guest tickets:', e);
              }
            }
          }
        } else {
          // No parameters in the URL — load normal guest cache from localStorage
          const saved = localStorage.getItem('nconnect_guest_tickets');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setTickets(parsed);
              if (parsed.length > 0) {
                setSelectedTicketId(parsed[0].id);
              }
            } catch (e) {
              console.error('Failed to parse guest tickets:', e);
            }
          } else {
            setTickets([]);
            setSelectedTicketId('');
          }
        }
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
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`/api/v1/helpdesk/tickets/${selectedTicketId}/messages`, {
          headers: { 'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, '')}` }
        });
        const data = await res.json();
        if (data.success && data.messages) {
          setActiveTicketMessages(data.messages);
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
        headers['Authorization'] = `Bearer ${token}`;
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

      if (token) {
        // Authenticated client creation
        const res = await fetch('/api/v1/helpdesk/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, '')}`,
          },
          body: JSON.stringify({
            subject,
            category,
            priority,
            message: messageBody,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to dispatch ticket.');
        }

        const newTicket = data.ticket;
        setTickets(prev => [newTicket, ...prev]);
        setSelectedTicketId(newTicket.id);
        
        setSubject('');
        setDescription('');
        setSelectedFiles([]);
        toast.success(`Support ticket ${newTicket.ticketCode} successfully dispatched to support operations queue!`);
      } else {
        // Guest mode creation
        const guestSlug = guestName ? guestName.toUpperCase().replace(/\s+/g, '_').substring(0, 15) : 'ANONYMOUS';
        const workspaceId = `GUEST_${guestSlug}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const res = await fetch('/api/v1/helpdesk/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: guestName,
            email: guestEmail,
            workspaceId,
            subject,
            category,
            priority,
            message: messageBody,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to dispatch ticket.');
        }

        const newTicket = data.ticket;
        setTickets(prev => [newTicket, ...prev]);
        setSelectedTicketId(newTicket.id);

        // Sync with localStorage
        const saved = localStorage.getItem('nconnect_guest_tickets');
        const existing = saved ? JSON.parse(saved) : [];
        const ticketSummary = {
          id: newTicket.id,
          ticketCode: newTicket.ticketCode,
          tenantId: null,
          email: newTicket.email,
          name: newTicket.name,
          workspaceId: newTicket.workspaceId,
          subject: newTicket.subject,
          category: newTicket.category,
          priority: newTicket.priority,
          status: newTicket.status,
          createdAt: newTicket.createdAt,
          updatedAt: newTicket.updatedAt
        };
        existing.unshift(ticketSummary);
        localStorage.setItem('nconnect_guest_tickets', JSON.stringify(existing));

        setSubject('');
        setDescription('');
        setSelectedFiles([]);
        toast.success(`Support ticket ${newTicket.ticketCode} dispatched! Recovery code is saved in your local session cache.`);
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

      if (token) {
        // Authenticated client reply
        const res = await fetch(`/api/v1/helpdesk/tickets/${selectedTicketId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, '')}`,
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
        // Guest user reply
        const ticket = tickets.find(t => t.id === selectedTicketId);
        if (!ticket) return;

        const res = await fetch(`/api/v1/helpdesk/tickets/${selectedTicketId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: ticket.email,
            senderName: ticket.name,
            message: finalMessage,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to stream reply.');
        }

        setActiveTicketMessages(prev => [...prev, data.message]);
        setReplyMessage('');
        setReplyFiles([]);
        toast.success('Your guest message has been streamed to the support dashboard.');
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
              {isRegistered ? 'Tenant Support Center' : 'Helpdesk Support Center'}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-semibold tracking-tight mt-1 max-w-2xl">
            {isRegistered 
              ? 'Welcome back! Create secure workspace tickets, track ongoing discussions with support staff, and review system audits.' 
              : 'Create guest support tickets, track active discussions, view status streams, and collaborate directly with our operations team.'}
          </p>
        </div>
      </div>

      {/* Interactive Shell Body */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Col: Dispatch Triage & Simulation (2 spans) */}
        <div className="xl:col-span-2 space-y-6">
          


          {/* Ticket Dispatch Card */}
          <div className="bg-white border border-zinc-200/60 shadow-md rounded-2xl overflow-hidden">
            <div className="bg-zinc-50/50 border-b border-zinc-200/60 p-6">
              <h4 className="text-xs sm:text-[13px] uppercase tracking-wider text-zinc-800 flex items-center gap-2 font-bold">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Dispatch Support Ticket</span>
              </h4>
              <p className="text-zinc-400 font-semibold text-[11px] mt-0.5">
                {isRegistered ? 'Securely lodge a priority workspace ticket.' : 'Describe structural errors, API concerns, or pre-sign-up issues.'}
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-5">
              
              {/* If guest, display read-only or editable sender profile details for clarity */}
              {!isRegistered && (
                <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
                  <div>
                    <label className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-950 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">Your Email</label>
                    <input 
                      type="email" 
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-950 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              )}

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Priority Urgency</label>
                  <div className="flex gap-1 mt-2 bg-zinc-100 p-1 rounded-xl border border-zinc-200/60 shadow-inner">
                    {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 text-[9px] py-1.5 rounded-lg font-bold font-mono transition-all border ${
                          priority === p
                            ? p === 'critical' ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' :
                              p === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm' :
                              p === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm' :
                              'bg-zinc-50 text-zinc-600 border-zinc-200 shadow-sm'
                            : 'border-transparent text-zinc-400 hover:text-zinc-700'
                        }`}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Detailed Description</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a step-by-step description of the technical error, including any endpoint details or API payloads..."
                  className="w-full p-4 h-32 bg-zinc-50/50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 hover:bg-zinc-50 transition-colors resize-none leading-relaxed shadow-sm"
                />
              </div>

              {/* Selected Files Preview List */}
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
          {/* Active & Past Queries for Registered Users */}
          {isRegistered && (
            <div className="bg-white border border-zinc-200/60 shadow-md rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <InboxIcon className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs uppercase tracking-wider text-zinc-800 font-extrabold font-mono">Your Support Queries</h4>
              </div>
              
              {tickets.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                  <HelpCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-500">No support tickets lodged yet.</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Use the dispatch form above to submit your first query.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200">
                  {tickets.map((t) => {
                    const isActive = t.id === selectedTicketId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 shadow-sm select-none relative ${
                          isActive
                            ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950 font-extrabold'
                            : 'bg-white border-zinc-150 hover:bg-zinc-50/80 text-zinc-700 hover:border-zinc-200'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r" />
                        )}
                        <div className="min-w-0 flex-1 pl-1.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9.5px] font-mono font-black tracking-wider uppercase text-indigo-600">
                              {t.ticketCode}
                            </span>
                            <span className="text-[8px] font-mono font-bold bg-zinc-100/70 border border-zinc-200 text-zinc-500 px-1.5 py-0.2 rounded uppercase">
                              {t.category}
                            </span>
                          </div>
                          <h5 className="text-[11.5px] font-bold truncate leading-snug">
                            {t.subject}
                          </h5>
                          <span className="text-[8px] text-zinc-400 font-mono mt-0.5 block">
                            {mounted ? new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>
                        
                        {/* Status badge */}
                        <span className={`px-2 py-0.5 text-[8px] font-mono font-black rounded-lg border shrink-0 ${
                          t.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-150' :
                          t.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-150' :
                          t.status === 'closed' ? 'bg-zinc-50 text-zinc-500 border-zinc-150' :
                          'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}>
                          {t.status.toUpperCase().replace('_', ' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Col: Conversational Chat Thread (3 spans) */}
        <div className="xl:col-span-3">
          <div className="bg-white border border-zinc-200/60 shadow-md rounded-2xl flex flex-col h-[600px] overflow-hidden">
            
            {/* Active Chat Header */}
            {tickets.length > 0 && activeTicket ? (
              <div className="p-5 border-b border-zinc-200/50 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                  <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-zinc-200/80 shadow-sm shrink-0">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <select 
                      value={selectedTicketId}
                      onChange={(e) => setSelectedTicketId(e.target.value)}
                      className="h-6 px-1.5 bg-transparent border-0 text-zinc-800 text-xs font-extrabold font-mono focus:outline-none cursor-pointer"
                    >
                      {tickets.map(t => (
                        <option key={t.id} value={t.id}>{t.ticketCode}</option>
                      ))}
                    </select>
                  </div>
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
                  <span className="px-2.5 py-1 text-[8.5px] font-mono font-bold rounded-lg border border-zinc-200 text-zinc-500 bg-white">
                    SLA: Reply within 1h
                  </span>
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
                <span className="text-xs font-bold text-zinc-400">No active support threads in this session.</span>
              </div>
            )}

            {/* Messages stream */}
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
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-mono ml-auto">
                            {mounted ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap text-zinc-700 font-semibold">{text}</p>

                        {/* Attachments rendering */}
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
                    <p className="text-[10px] text-zinc-400 max-w-xs">Loading database records. If this takes too long, hit refresh above.</p>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="p-4 bg-indigo-50 rounded-full border border-indigo-100/30 text-indigo-500">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h5 className="text-xs sm:text-[13px] font-extrabold text-zinc-800">No Support Thread Selected</h5>
                  <p className="text-[11px] text-zinc-400 max-w-sm">
                    Submit a new ticket using the dispatch console, or recover an existing guest ticket session with your email and ticket code.
                  </p>
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
                      This support request has been completed and marked as closed by operations administration. No further responses can be sent on this thread. If you require additional help, please raise a new ticket.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Reply Files Preview */}
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

  if (embedMode) {
    return (
      <div className="p-8 space-y-6">
        {innerContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col">
      {/* Guest Premium Top Header */}
      <header className="h-16 border-b border-zinc-200/60 bg-white sticky top-0 z-30 flex items-center justify-between px-8 select-none shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
            <MessageSquare className="size-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-zinc-950 font-mono">
            {isRegistered ? 'NCONNECT CUSTOMER SUPPORT' : 'NCONNECT GUEST SUPPORT'}
          </span>
        </div>

        <button 
          onClick={() => {
            const loggedIn = typeof window !== 'undefined' ? !!localStorage.getItem('nconnect_id_token') : false;
            router.push(loggedIn ? '/dashboard' : '/signin');
          }}
          className="text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          {typeof window !== 'undefined' && localStorage.getItem('nconnect_id_token') ? 'Back to Dashboard' : 'Back to Sign In'}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-zinc-400">Syncing helpdesk dashboard logs...</p>
            </div>
          </div>
        ) : innerContent}
      </main>

      {/* Premium Image Preview Modal Overlay */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md transition-all duration-300 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Info bar */}
            <div className="absolute top-[-45px] left-0 right-0 flex items-center justify-between text-white px-1">
              <span className="text-xs font-mono font-bold truncate max-w-[70%]">{previewImage.name}</span>
              <div className="flex items-center gap-3">
                <a 
                  href={previewImage.url} 
                  download={previewImage.name}
                  className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/85 text-zinc-300 hover:text-white border border-zinc-700/40 shadow-sm transition-all flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider font-mono px-3"
                  title="Save to Disk"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save</span>
                </a>
                <button 
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/85 text-zinc-300 hover:text-white border border-zinc-700/40 shadow-sm transition-all"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl flex items-center justify-center p-1.5 max-h-[80vh]">
              <img 
                src={previewImage.url} 
                alt={previewImage.name} 
                className="max-w-full max-h-[75vh] object-contain rounded-xl select-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
