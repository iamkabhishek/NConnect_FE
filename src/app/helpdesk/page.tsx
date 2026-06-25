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
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getMe } from '../lib/api';

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [activeTicketMessages, setActiveTicketMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Active Simulated Guest Profile
  const [activeProfile, setActiveProfile] = useState<'Acme Creative Corp' | 'TechVibe Media' | 'PixelPerfect Agency'>('Acme Creative Corp');
  
  // Guest Profile automatic details
  const [guestName, setGuestName] = useState('Sarah Connor');
  const [guestEmail, setGuestEmail] = useState('sarah@acme.com');

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

  // Session recovery states
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupCode, setLookupCode] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

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

  // Update guest form pre-fills on switcher profile toggles
  useEffect(() => {
    if (activeProfile === 'Acme Creative Corp') {
      setGuestName('Sarah Connor');
      setGuestEmail('sarah@acme.com');
    } else if (activeProfile === 'TechVibe Media') {
      setGuestName('Marcus Aurelius');
      setGuestEmail('marcus@techvibe.media');
    } else {
      setGuestName('Admin Manager');
      setGuestEmail('admin@pixelperfect.agency');
    }
  }, [activeProfile]);

  // Load Auth Session & Initial Tickets
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      setIsLoading(true);
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('nconnect_id_token') : null;
      setToken(storedToken);
      
      if (storedToken) {
        try {
          const profile = await getMe(storedToken);
          setUserProfile(profile);
          
          // Fetch Authenticated Tickets
          const res = await fetch('/api/v1/helpdesk/tickets', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          const data = await res.json();
          if (data.success && data.tickets) {
            setTickets(data.tickets);
            if (data.tickets.length > 0) {
              setSelectedTicketId(data.tickets[0].id);
            }
          }
        } catch (err: any) {
          console.error('Failed to load profile or authenticated tickets:', err);
          setToken(null);
        }
      } else {
        // Guest mode — load ticket cache from localStorage
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
      setIsLoading(false);
    };
    
    checkAuthAndLoad();
  }, []);

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
        
        const res = await fetch(`/api/v1/helpdesk/tickets/${selectedTicketId}/messages`, { headers });
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
            'Authorization': `Bearer ${token}`,
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
        const workspaceId = `GUEST_${activeProfile.toUpperCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
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
            'Authorization': `Bearer ${token}`,
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

  const handleLookupTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail.trim() || !lookupCode.trim()) {
      toast.error('Please enter both email and ticket code.');
      return;
    }
    
    setIsLookingUp(true);
    try {
      const res = await fetch('/api/v1/helpdesk/tickets/guest/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lookupEmail, ticketCode: lookupCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ticket not found.');
      }
      
      const restoredTicket = data.ticket;
      
      setTickets(prev => {
        if (prev.some(t => t.id === restoredTicket.id)) {
          return prev.map(t => t.id === restoredTicket.id ? restoredTicket : t);
        }
        return [restoredTicket, ...prev];
      });
      setSelectedTicketId(restoredTicket.id);
      setActiveTicketMessages(restoredTicket.messages || []);

      // Cache guest tickets in localStorage
      const saved = localStorage.getItem('nconnect_guest_tickets');
      const existing = saved ? JSON.parse(saved) : [];
      if (!existing.some((t: any) => t.id === restoredTicket.id)) {
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
      }
      
      toast.success(`Session recovered successfully! Selected Ticket ${restoredTicket.ticketCode}`);
      setLookupCode('');
      setLookupEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Lookup failed.');
    } finally {
      setIsLookingUp(false);
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
              {token ? 'Tenant Support Center' : 'Helpdesk Support Center'}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-semibold tracking-tight mt-1 max-w-2xl">
            {token 
              ? 'Welcome back! Create secure workspace tickets, track ongoing discussions with support staff, and review system audits.' 
              : 'Create guest support tickets, track active discussions, view status streams, and collaborate directly with our operations team.'}
          </p>
        </div>
      </div>

      {/* Interactive Shell Body */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Col: Dispatch Triage & Simulation (2 spans) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Guest Simulation Switcher Card (Only shown if unauthenticated) */}
          {!token && (
            <div className="bg-white border border-zinc-200/60 shadow-md p-6 rounded-2xl space-y-3.5">
              <div className="flex items-center gap-2">
                <SlidersVertical className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-extrabold text-zinc-900 font-mono uppercase tracking-wider">Simulation Profile Switcher</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-bold leading-relaxed">
                Toggle simulated guest client profiles below to automatically populate sandbox test values and test real DB transactions:
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5">
                {(['Acme Creative Corp', 'TechVibe Media', 'PixelPerfect Agency'] as const).map((profile) => (
                  <button
                    key={profile}
                    type="button"
                    onClick={() => {
                      setActiveProfile(profile);
                      toast.info(`Switched simulated guest profile context to: ${profile}`);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold font-mono transition-all border shadow-sm ${
                      activeProfile === profile
                        ? 'bg-gradient-to-r from-[#030213] to-indigo-950 text-white border-zinc-900'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {profile}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ticket Dispatch Card */}
          <div className="bg-white border border-zinc-200/60 shadow-md rounded-2xl overflow-hidden">
            <div className="bg-zinc-50/50 border-b border-zinc-200/60 p-6">
              <h4 className="text-xs sm:text-[13px] uppercase tracking-wider text-zinc-800 flex items-center gap-2 font-bold">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Dispatch Support Ticket</span>
              </h4>
              <p className="text-zinc-400 font-semibold text-[11px] mt-0.5">
                {token ? 'Securely lodge a priority workspace ticket.' : 'Describe structural errors, API concerns, or pre-sign-up issues.'}
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-5">
              
              {/* If guest, display read-only or editable sender profile details for clarity */}
              {!token && (
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
                  <span>Attach Logs</span>
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

          {/* Session Recovery / Ticket Lookup Card (Always available in guest/unauthenticated mode) */}
          {!token && (
            <div className="bg-white border border-zinc-200/60 shadow-md rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs uppercase tracking-wider text-zinc-800 font-extrabold font-mono">Restore Guest Session</h4>
              </div>
              <p className="text-[11px] text-zinc-400 font-bold leading-relaxed">
                Closed your tab? Reopen your active live-chat thread and previous logs instantly by entering your ticket details:
              </p>
              <form onSubmit={handleLookupTicket} className="space-y-3.5">
                <div>
                  <label className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">Registered Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. sarah@acme.com"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-zinc-50/50 border border-zinc-200 text-xs text-zinc-950 font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">Ticket Recovery Code</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. TCK-1234"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-zinc-50/50 border border-zinc-200 text-xs text-zinc-950 font-mono font-extrabold focus:outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLookingUp}
                  className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-mono font-extrabold text-[10px] uppercase tracking-wider h-10 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isLookingUp ? 'Searching Database...' : 'Recover Active Session'}
                </button>
              </form>
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
                    activeTicket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-150' :
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
                                    download={file.name}
                                    className="flex items-center gap-2.5 p-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 rounded-xl transition-all select-none"
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
                    title="Attach logs or files"
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

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
            {token ? 'NCONNECT CUSTOMER SUPPORT' : 'NCONNECT GUEST SUPPORT'}
          </span>
        </div>

        <button 
          onClick={() => router.push(token ? '/dashboard' : '/signin')}
          className="text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          {token ? 'Back to Dashboard' : 'Back to Sign In'}
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
    </div>
  );
}
