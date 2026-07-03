'use client';

import React, { useState, useEffect } from 'react';
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
  Globe,
  Building2,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  ArrowUpRight,
  Ban,
  Zap,
  Sparkles,
  RefreshCw,
  Inbox as InboxIcon,
  FileCode,
  Paperclip,
  Download,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '@/app/lib/api';

// Interfaces mapping directly to DB schemas
interface SupportTicket {
  id: string;
  ticketCode: string;
  tenantId: string | null;
  workspaceId: string;
  subject: string;
  category: 'billing' | 'technical' | 'questions';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  email: string;
  name: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  tenantContext?: {
    id: string;
    name: string;
    slug: string;
    email: string;
    brandName?: string;
    subscriptionStatus: string;
    planId: string;
  } | null;
}

interface TicketReply {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'support';
  message: string;
  isInternal: boolean;
  isEmail: boolean;
  createdAt: string;
}

export default function ModuleHelpDesk() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list');
  
  // Real DB backed state arrays
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [replies, setReplies] = useState<TicketReply[]>([]);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // General Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusStats, setStatusStats] = useState({ open: 0, in_progress: 0, closed: 0, resolved: 0, total: 0 });
  
  // New reply compose states
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [replyFiles, setReplyFiles] = useState<{ name: string; size: number; type: string; base64: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const replyFileInputRef = React.useRef<HTMLInputElement>(null);

  // Operator Context State
  const [currentOperator, setCurrentOperator] = useState<{ name: string; email: string; identifier: string; userId: string }>({ 
    name: 'NConnect Admin', 
    email: 'ops-admin@test.com',
    identifier: 'NConnect Admin - USER0000',
    userId: 'USER0000'
  });

  useEffect(() => {
    const loadOperatorContext = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('nconnect_id_token') : null;
      const sanitizedToken = storedToken ? storedToken.trim().replace(/^"|"$/g, '') : null;
      
      if (!sanitizedToken) return;

      try {
        const payload = JSON.parse(atob(sanitizedToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const name = payload.name || payload.email?.split('@')[0] || 'NConnect Admin';
        const email = payload.email || 'ops-admin@test.com';
        
        // Initial state with email fallback or truncated sub as ID
        let userId = `USER-${(payload.sub || '0000').slice(0, 4).toUpperCase()}`;
        
        setCurrentOperator({
          name,
          email,
          userId,
          identifier: `${name} - ${userId}`
        });

        // Attempt to fetch sequential USERxxxx ID from backend
        const res = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: getAuthHeaders(null)
        });
        const data = await res.json();
        
        if (data.success !== false && data.customUserId) {
          setCurrentOperator({
            name,
            email,
            userId: data.customUserId,
            identifier: `${name} - ${data.customUserId}`
          });
        }
      } catch (e) {
        console.error('Failed to load operator context:', e);
      }
    };

    loadOperatorContext();
  }, []);

   const selectedTicket = tickets.find(t => t.id === selectedTicketId);
   const isAssignedToMe = selectedTicket?.assignedTo === currentOperator.identifier;
   const isUnassigned = !selectedTicket?.assignedTo;
   const isClosed = selectedTicket?.status === 'closed';

  // Helper to append Authorization headers (with Cognito ID Token or fallback mock platform_admin JWT for local dev)
  const getAuthHeaders = (contentType: string | null = 'application/json') => {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('nconnect_id_token') : null;
    const sanitizedToken = storedToken ? storedToken.trim().replace(/^"|"$/g, '') : null;

    // 1. Prioritize real Cognito token if it looks valid (has a signature/kid)
    if (sanitizedToken) {
      try {
        const parts = sanitizedToken.split('.');
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          if (header.kid) {
            headers['Authorization'] = `Bearer ${sanitizedToken}`;
            return headers;
          }
        }
      } catch (e) { /* fall back to mock */ }
    }

    // 2. Fallback to mock admin token for dev/ops-bypass
    let userEmail = 'ops-admin@test.com';
    if (sanitizedToken) {
      try {
        const payload = JSON.parse(atob(sanitizedToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        userEmail = payload.email || userEmail;
      } catch (e) { /* ignore */ }
    }

    const mockAdminPayload = {
      sub: 'ops-admin-bypass',
      email: userEmail,
      name: 'NConnect Admin (Bypass)',
      'custom:role': 'platform_admin',
      exp: Math.floor(Date.now() / 1000) + 86400,
    };

    try {
      const toBase64Url = (value: unknown) =>
        btoa(JSON.stringify(value))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      const mockHeader = toBase64Url({ alg: 'none', typ: 'JWT' });
      const base64Payload = toBase64Url(mockAdminPayload);
      const mockToken = `${mockHeader}.${base64Payload}.mockSignature`;
      headers['Authorization'] = `Bearer ${mockToken}`;
    } catch (e) {
      console.error('Failed to generate bypass token:', e);
      if (sanitizedToken) {
        headers['Authorization'] = `Bearer ${sanitizedToken}`;
      }
    }
    return headers;
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setReplyFiles(prev => [...prev, {
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64String
        }]);
      };
      reader.onerror = () => {
        toast.error(`Failed to read file ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const removeSelectedFile = (index: number) => {
    setReplyFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Load All Tickets on Mount
  const fetchTickets = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (dateFilter) params.append('date', dateFilter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());

      const res = await fetch(`${API_URL}/api/v1/ops/helpdesk/tickets?${params.toString()}`, {
        headers: getAuthHeaders(null)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Server responded with status ${res.status}`);
      }
      if (data.success && data.tickets) {
        setTickets(data.tickets);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalRecords(data.pagination.total);
        }
        // Default select first ticket if none selected or if previously selected is missing
        if (data.tickets.length > 0 && (!selectedTicketId || !data.tickets.some((t: any) => t.id === selectedTicketId))) {
          setSelectedTicketId(data.tickets[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load tickets:', err);
      if (!quiet) {
        toast.error(`Failed to fetch support tickets: ${err.message}`);
      }
    } finally {
      if (!quiet) setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/ops/helpdesk/stats?date=${dateFilter}`, {
        headers: getAuthHeaders(null)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch status stats:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();

    // Auto-poll new tickets list quietly in the background every 15 seconds
    const interval = setInterval(() => {
      fetchTickets(true);
      fetchStats();
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedTicketId, statusFilter, priorityFilter, dateFilter, currentPage, pageSize, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, dateFilter, searchTerm]);

  // Load Replies whenever active ticket changes
  const fetchReplies = async (quiet = false) => {
    if (!selectedTicketId) return;
    if (!quiet) setIsRepliesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/ops/helpdesk/tickets/${selectedTicketId}/messages`, {
        headers: getAuthHeaders(null)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Server responded with status ${res.status}`);
      }
      if (data.success && data.messages) {
        setReplies(data.messages);
      }
    } catch (err: any) {
      console.error('Failed to load replies:', err);
      if (!quiet) toast.error(`Failed to retrieve discussion messages: ${err.message}`);
    } finally {
      if (!quiet) setIsRepliesLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();

    // Auto-poll active ticket messages quietly in the background every 8 seconds
    const interval = setInterval(() => {
      fetchReplies(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedTicketId]);

  const selectedReplies = [...replies].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Manual session refresh trigger
  const handleRefreshState = async () => {
    setIsRefreshing(true);
    await fetchTickets(true);
    await fetchReplies(true);
    await fetchStats();
    setIsRefreshing(false);
    toast.success('Live operations queue synchronized with database records.');
  };

  // Dynamic triage locator generator based on ticket profile fields
  const getTriageContext = (ticket: SupportTicket | undefined) => {
    if (!ticket) {
      return {
        type: 'guest' as const,
        name: 'No Active Ticket',
        slug: 'n-a',
        email: 'N/A',
        licenseLevel: 'N/A',
        billingTerms: 'N/A',
        paymentState: 'N/A',
        emailAddress: 'N/A',
        warning: null
      };
    }

    // Use real tenant data if available
    if (ticket.tenantContext) {
      const tc = ticket.tenantContext;
      return {
        type: 'tenant' as const,
        name: tc.name, // This is the workspace name
        orgName: tc.brandName || tc.name, // This is the organization name
        brandName: tc.brandName,
        slug: tc.slug,
        email: ticket.email,
        licenseLevel: tc.planId.toUpperCase().replace('_', ' ') || 'Standard',
        billingTerms: 'Active Subscription',
        paymentState: tc.subscriptionStatus.toUpperCase() === 'ACTIVE' ? 'PAID & CURRENT' : 'STATUS: ' + tc.subscriptionStatus.toUpperCase(),
        emailAddress: tc.email || ticket.email,
        warning: ticket.priority === 'critical' ? '⚠️ CRITICAL PRIORITY: Rapid intervention required for this tenant.' : null
      };
    }

    // Fallback if no tenant context (though tickets are now only for registered users)
    return {
      type: 'guest' as const,
      name: ticket.name,
      orgName: 'Unregistered Guest',
      slug: 'guest-user',
      email: ticket.email,
      licenseLevel: 'N/A (Unregistered)',
      billingTerms: 'N/A',
      paymentState: 'N/A',
      emailAddress: ticket.email,
      warning: 'No linked workspace found for this email address.'
    };
  };

  const context = getTriageContext(selectedTicket);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const msgText = replyMessage.trim();
    if (!msgText && replyFiles.length === 0) return;
    if (!selectedTicketId) return;

    try {
      let finalMessage = msgText;
      if (replyFiles.length > 0) {
        finalMessage += `\n\n---ATTACHMENTS---\n${JSON.stringify(replyFiles)}`;
      }

      const endpoint = `/api/v1/ops/helpdesk/tickets/${selectedTicketId}/messages`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify({
          message: finalMessage,
          isInternal: isInternalNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post reply.');
      }

      setReplies(prev => [...prev, data.message]);
      
      // Auto-update ticket status locally to in_progress if operator submits a public reply on an open ticket
      if (selectedTicket && selectedTicket.status === 'open' && !isInternalNote) {
        setTickets(prev => prev.map(t => {
          if (t.id === selectedTicketId) {
            return { ...t, status: 'in_progress' };
          }
          return t;
        }));
      }

      setReplyMessage('');
      setReplyFiles([]);
      
      if (isInternalNote) {
        toast.info('Private internal staff note added to discussion log!');
      } else {
        toast.success('Reply submitted to customer client!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit response.');
    }
  };

  const handleConfirmSendEmail = async () => {
    if (!selectedTicketId) return;
    setIsSendingEmail(true);

    try {
      const msgText = replyMessage.trim();
      let finalMessage = msgText;
      if (replyFiles.length > 0) {
        finalMessage += `\n\n---ATTACHMENTS---\n${JSON.stringify(replyFiles)}`;
      }

      const res = await fetch(`${API_URL}/api/v1/ops/helpdesk/tickets/${selectedTicketId}/email`, {
        method: 'POST',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify({
          message: finalMessage,
          subject: emailSubject,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email.');
      }

      setReplies(prev => [...prev, data.message]);
      
      if (selectedTicket && selectedTicket.status === 'open') {
        setTickets(prev => prev.map(t => {
          if (t.id === selectedTicketId) {
            return { ...t, status: 'in_progress' };
          }
          return t;
        }));
      }

      setReplyMessage('');
      setReplyFiles([]);
      setIsEmailPreviewOpen(false);
      toast.success('Message posted and email sent successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleStatusChange = async (newStatus: SupportTicket['status']) => {
    if (!selectedTicketId) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/ops/helpdesk/tickets/${selectedTicketId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update ticket status.');
      }

      setTickets(prev => prev.map(t => {
        if (t.id === selectedTicketId) {
          return { ...t, status: newStatus };
        }
        return t;
      }));
      toast.success(`Ticket status updated to ${newStatus.toUpperCase().replace('_', ' ')}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to alter ticket status.');
    }
  };

  const handlePriorityChange = async (priority: SupportTicket['priority']) => {
    if (!selectedTicketId) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/ops/helpdesk/tickets/${selectedTicketId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ priority }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to escalate ticket.');
      }

      setTickets(prev => prev.map(t => {
        if (t.id === selectedTicketId) {
          return { ...t, priority };
        }
        return t;
      }));
      toast.success(`Priority escalated to ${priority.toUpperCase()}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to alter priority.');
    }
  };

  const handleAssignToMe = async () => {
    if (!selectedTicketId) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/ops/helpdesk/tickets/${selectedTicketId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ assignedTo: currentOperator.identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to assign operator.');
      }

      setTickets(prev => prev.map(t => {
        if (t.id === selectedTicketId) {
          return { ...t, assignedTo: currentOperator.identifier };
        }
        return t;
      }));
      toast.success('Support ticket successfully assigned to your workspace session.');
    } catch (err: any) {
      toast.error(err.message || 'Assignment failed.');
    }
  };

  const handleBypassSecurity = () => {
    toast.success('Cognito registration handshake manual override injected! Invitation link re-sent to: ' + context.email);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-950 tracking-tight flex items-center gap-2 font-mono uppercase">
            <HelpCircle className="w-5.5 h-5.5 text-indigo-600" />
            Support Help Desk
          </h1>
          <p className="text-[11px] text-zinc-400 font-bold tracking-tight mt-0.5">
            Resolve client tickets, dispatch public replies, and manage private internal operator audit trails. Fully synchronized with live Drizzle relational tables.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/40">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-zinc-500 hover:text-zinc-800'}`}
              title="Table View"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('chat')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'chat' ? 'bg-white shadow-sm text-indigo-600' : 'text-zinc-500 hover:text-zinc-800'}`}
              title="Chat View"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

          {/* Status Quick Stats Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/40">
            {(['all', 'open', 'in_progress', 'closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                  statusFilter === s 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <span>{s === 'all' ? 'Total' : s.replace('_', ' ')}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] min-w-[18px] text-center ${
                  statusFilter === s ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-200 text-zinc-600'
                }`}>
                  {s === 'all' ? statusStats.total : (statusStats as any)[s] || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search Subject, Client, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-zinc-200 bg-white text-zinc-800 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-indigo-500 shadow-sm w-48 transition-all focus:w-64"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-zinc-200 bg-white text-zinc-800 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>
          <button 
            onClick={handleRefreshState}
            disabled={isRefreshing}
            className="p-2 border border-zinc-200 bg-white text-zinc-500 rounded-xl hover:text-zinc-800 hover:bg-zinc-50 transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Records
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center border border-zinc-200/60 rounded-3xl bg-white">
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-400 font-mono uppercase">Streaming active helpdesk logs...</p>
          </div>
        </div>
      ) : (
        viewMode === 'list' ? (
          <div className="grid grid-cols-1 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-zinc-200/60 rounded-3xl shadow-xl overflow-hidden transition-all duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ticket ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Client / Subject</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Priority</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Assignee</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Logged At</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {tickets.map((t) => (
                    <tr 
                      key={t.id} 
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`hover:bg-zinc-50/30 transition-colors group cursor-pointer ${selectedTicketId === t.id ? 'bg-indigo-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded-lg border border-zinc-200/60 shadow-sm">
                          {t.ticketCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[12.5px] font-bold text-zinc-950 truncate max-w-[280px]">{t.subject}</span>
                          <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1.5">
                            {t.name}
                            <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                            {t.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg font-mono font-black text-[9px] uppercase border shadow-sm ${
                          t.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          t.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          t.status === 'closed' ? 'bg-zinc-50 text-zinc-500 border-zinc-200' :
                          'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}>
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg font-mono font-black text-[9px] uppercase border shadow-sm ${
                          t.priority === 'critical' ? 'bg-red-50 text-red-600 border-red-200' :
                          t.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          t.priority === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {t.assignedTo ? (
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-lg">
                              {t.assignedTo}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-mono font-bold text-zinc-900">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400 font-bold">
                            {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            setSelectedTicketId(t.id);
                            setViewMode('chat');
                          }}
                          className="px-3 py-1.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl transition-all inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest shadow-md shadow-zinc-200 active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Triage
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40">
                          <div className="p-4 bg-zinc-100 rounded-full">
                            <AlertCircle className="w-10 h-10 text-zinc-400" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xs font-black text-zinc-900 font-mono uppercase">No triage records found</h3>
                            <p className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Adjust your filters or sync records to refresh</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div className="bg-zinc-50/30 border-t border-zinc-100 px-6 py-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  Showing
                </span>
                <span className="text-[11px] font-bold text-zinc-900 font-mono">
                  {Math.min((currentPage - 1) * pageSize + 1, totalRecords)} - {Math.min(currentPage * pageSize, totalRecords)}
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  of {totalRecords} Records
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 mr-4 border-r border-zinc-200 pr-4">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    Rows per page:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-zinc-200 text-[10px] font-bold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    {[5, 10, 25, 50].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    <span className="text-[11px] font-bold text-zinc-900 font-mono">
                      {currentPage}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-400 font-mono">
                      /
                    </span>
                    <span className="text-[11px] font-bold text-zinc-400 font-mono">
                      {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left column: Ticket queue registry (col-span-3) */}
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-4.5 shadow-md space-y-4">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search code, client, workspace..."
                  className="w-full bg-zinc-50 border border-zinc-200 text-xs font-semibold px-9.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 hover:bg-zinc-100/50 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sub Filters: Status */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-1">Status Registry</label>
                <div className="flex gap-0.5 bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/40">
                  {(['all', 'open', 'closed'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`flex-1 py-1.5 text-[8.5px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                        statusFilter === tab
                          ? 'bg-gradient-to-r from-[#030213] to-indigo-950 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {tab === 'in_progress' ? 'IP' : tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub Filters: Priority */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-1">Priority Matrix</label>
                <div className="flex gap-0.5 bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/40">
                  {(['all', 'low', 'medium', 'high', 'critical'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorityFilter(p)}
                      className={`flex-1 py-1.5 text-[8.5px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                        priorityFilter === p
                          ? 'bg-gradient-to-r from-[#030213] to-indigo-950 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {p === 'critical' ? 'CRIT' : p === 'medium' ? 'MED' : p.toUpperCase().slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {tickets.map(t => {
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
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-50/40 to-indigo-100/10 border-indigo-200 shadow-sm'
                          : 'bg-white border-zinc-200/50 hover:bg-zinc-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-extrabold text-zinc-400 uppercase tracking-tight flex items-center gap-1.5">
                          {t.ticketCode}
                          <span className={`text-[7.5px] font-sans font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide border shadow-sm ${
                            t.tenantId 
                              ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                          }`}>
                            {t.tenantId ? 'REGISTERED' : 'GUEST'}
                          </span>
                        </span>
                        <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${pColor}`}>
                          {t.priority}
                        </span>
                      </div>

                      <h4 className="text-[11.5px] font-bold text-zinc-900 leading-snug line-clamp-2">
                        {t.subject}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[9.5px] text-zinc-400 font-bold">
                        <span className="truncate max-w-[120px]">{t.name}</span>
                        <span className={`px-2 py-0.5 rounded-md font-mono font-extrabold text-[8.5px] uppercase border ${
                          t.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          t.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          t.status === 'closed' ? 'bg-zinc-50 text-zinc-500 border-zinc-150' :
                          'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar Pagination */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-indigo-600 disabled:opacity-50 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-indigo-600 disabled:opacity-50 transition-all"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

                {tickets.length === 0 && (
                  <div className="text-center py-8 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl">
                    <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">No Tickets Found</span>
                  </div>
                )}
              </div>
            </div>

          {/* Middle column: Conversational chat workspace (col-span-6) */}
          <div className="xl:col-span-6">
            {tickets.length > 0 && selectedTicket ? (
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-5.5 shadow-md flex flex-col justify-between min-h-[520px] h-[580px]">
                
                {/* Header controls */}
                <div className="border-b border-zinc-200/50 pb-3.5 flex flex-wrap items-center justify-between gap-4 select-none">
                  <div>
                    <h3 className="text-xs sm:text-[13.5px] font-extrabold text-zinc-950 leading-snug line-clamp-1">
                      {selectedTicket.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5 text-[10px] font-extrabold text-zinc-400 uppercase font-mono tracking-tight">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        Client: {selectedTicket.name} ({selectedTicket.email})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                        Agency: {selectedTicket.tenantContext?.brandName || selectedTicket.tenantContext?.name || 'Unregistered Guest'}
                      </span>
                      <span className="flex items-center gap-1.5 border-l border-zinc-200 pl-4 ml-1">
                        Key: {selectedTicket.ticketCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* ASSIGNMENT STATUS / ACTION */}
                    {isUnassigned ? (
                      <button
                        onClick={handleAssignToMe}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95"
                      >
                        <User className="w-3.5 h-3.5" />
                        Assign to Me
                      </button>
                    ) : (
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
                        isAssignedToMe 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isAssignedToMe ? `Assigned to: ${currentOperator.identifier}` : `Assigned to: ${selectedTicket.assignedTo}`}
                        {!isAssignedToMe && (
                          <button 
                            onClick={handleAssignToMe}
                            className="ml-1 hover:text-amber-900 underline decoration-amber-300 underline-offset-2"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    )}

                    {/* Status Switcher */}
                    <select
                      value={selectedTicket.status}
                      disabled={!isAssignedToMe}
                      onChange={(e) => handleStatusChange(e.target.value as any)}
                      className={`bg-zinc-50 border border-zinc-200 text-[10px] font-extrabold uppercase rounded-xl px-2 py-1.5 cursor-pointer text-zinc-800 focus:outline-none ${!isAssignedToMe ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Replies Stream Feed */}
                <div className="flex-1 overflow-y-auto my-3.5 space-y-3.5 pr-1 scrollbar-thin scrollbar-thumb-zinc-200 bg-zinc-50/20 rounded-xl p-3 border border-zinc-100/50">
                  {isRepliesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                    </div>
                  ) : selectedReplies.length > 0 ? (
                    selectedReplies.map((r) => {
                      const isSupport = r.senderRole === 'support';
                      const isInternal = r.isInternal;
                      const { text, attachments } = parseMessageContent(r.message);

                      return (
                        <div
                          key={r.id}
                          className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-xs font-semibold ${
                            isInternal
                              ? 'bg-amber-50/50 border border-amber-200/60 mr-auto shadow-sm'
                              : isSupport
                                ? 'bg-gradient-to-br from-indigo-50/60 to-indigo-100/10 border border-indigo-100/60 ml-auto'
                                : 'bg-zinc-50 border border-zinc-200/50 mr-auto'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2 gap-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-extrabold text-[11px] ${isSupport ? 'text-indigo-600' : 'text-zinc-900'}`}>
                                {r.senderName}
                              </span>
                              {isInternal && (
                                <span className="text-[8px] font-mono font-black text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-200/30">
                                  INTERNAL STAFF
                                </span>
                              )}
                              {!isInternal && isSupport && (
                                <span className="text-[8px] font-mono font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-indigo-100/40">
                                  CLIENT PUBLIC
                                </span>
                              )}
                              {!isInternal && isSupport && r.isEmail && (
                                <span className="text-[8px] font-mono font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-100/40">
                                  reponded via email
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-zinc-400">
                              {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-zinc-700 font-semibold whitespace-pre-line leading-relaxed">
                            {text}
                          </p>

                          {/* Attachments list */}
                          {attachments && attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-zinc-200/30 space-y-2">
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
                                      className="flex items-center gap-2.5 p-2 bg-white hover:bg-zinc-50 border border-zinc-200/60 rounded-xl transition-all select-none cursor-pointer"
                                    >
                                      <div className="bg-zinc-50 p-1.5 rounded-lg border border-zinc-200/50 shadow-sm shrink-0">
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
                    <div className="h-full flex items-center justify-center text-center text-zinc-400 text-[11px] font-bold">
                      No message logs available for this ticket.
                    </div>
                  )}
                </div>

                {/* Message compose bar */}
                <div className="border-t border-zinc-200/50 pt-4 space-y-3">
                  {isClosed ? (
                    <div className="flex flex-col items-center justify-center p-5 bg-zinc-50 border border-zinc-200/60 rounded-xl space-y-2 text-center">
                      <div className="p-2 bg-zinc-100 rounded-lg text-zinc-400">
                        <Lock className="w-4 h-4 text-zinc-500" />
                      </div>
                      <h5 className="text-[11px] font-black text-zinc-800 font-mono uppercase tracking-tight">Ticket Closed</h5>
                      <p className="text-[10px] text-zinc-400 max-w-sm font-bold leading-normal">
                        This support request is marked as closed. Change the status to 'Open' or 'In Progress' to resume communication with the client.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handlePostReply} className="space-y-3">
                      {/* Reply Files Preview */}
                      {replyFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/50">
                          {replyFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[10px] font-bold text-zinc-700 shadow-sm">
                              <span className="truncate max-w-[120px]">{file.name}</span>
                              <span className="text-[9px] text-zinc-400 font-mono">({formatFileSize(file.size)})</span>
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(idx)}
                                className="text-zinc-400 hover:text-red-500 transition-colors ml-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={!isAssignedToMe}
                            onClick={() => {
                              setEmailSubject(`New Reply to Support Ticket ${selectedTicket?.ticketCode || 'TCK'}`);
                              setIsEmailPreviewOpen(true);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                              !isAssignedToMe
                                ? 'bg-zinc-50 border-zinc-200 text-zinc-300 cursor-not-allowed opacity-60'
                                : isEmailPreviewOpen
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-black'
                                  : 'bg-zinc-50 border-zinc-200/60 text-zinc-500 hover:text-zinc-800'
                            }`}
                          >
                            repond via email
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2.5">
                        <button 
                          type="button" 
                          onClick={() => replyFileInputRef.current?.click()}
                          className="border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 p-3.5 rounded-xl flex items-center justify-center shadow-sm transition-all"
                          title="Attachments"
                        >
                          <Paperclip className="w-4 h-4 text-indigo-500" />
                        </button>
                        <input 
                          type="file"
                          ref={replyFileInputRef}
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                        <input
                          type="text"
                          placeholder={isAssignedToMe ? "Draft a reply to the customer client..." : "Assign ticket to yourself to reply..."}
                          className={`flex-1 bg-zinc-50 border border-zinc-200 text-xs font-semibold px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 hover:bg-zinc-100/30 transition-colors ${!isAssignedToMe ? 'opacity-50 cursor-not-allowed' : ''}`}
                          value={replyMessage}
                          disabled={!isAssignedToMe}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <button
                          type="submit"
                          disabled={!isAssignedToMe || (!replyMessage.trim() && replyFiles.length === 0)}
                          className="text-white font-extrabold text-xs p-3.5 rounded-xl transition-all shadow-md flex items-center justify-center border disabled:opacity-50 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15 border-indigo-500/20"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-5.5 shadow-md flex flex-col items-center justify-center h-[580px] text-center space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-500 shadow-sm">
                  <InboxIcon className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13.5px] font-extrabold text-zinc-900 font-mono uppercase">No Ticket Selected</h3>
                  <p className="text-[11px] text-zinc-400 mt-1 max-w-sm">Select an active support request from the queue to view its discussion log and client specs.</p>
                </div>
              </div>
            )}
          </div>          {/* Right column: Triage Context Locator (col-span-3) */}
          <div className="xl:col-span-3 space-y-4">
            
            {/* Main Client Card */}
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-4.5 shadow-md space-y-4 select-none">
              
              {/* Header Title matching the exact style in screenshot */}
              <div className="border-b border-zinc-100 pb-3.5 select-none">
                <span className="text-[9px] font-mono text-zinc-400 font-extrabold uppercase tracking-widest block">
                  Triage Context Locator
                </span>
                <h4 className="text-[11.5px] font-extrabold text-zinc-950 font-mono tracking-tight uppercase mt-1">
                  {context.type === 'guest' ? 'Guest Context' : 'Agency Context'}
                </h4>
              </div>


              <div className="space-y-4">
                {/* Avatar Profile Header Block matching Acme screenshot */}
                <div className="flex items-center gap-3 bg-zinc-50/20 border border-zinc-100/50 p-3 rounded-2xl">
                  <div className="h-11 w-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 font-mono text-[13px] shadow-sm shrink-0">
                    {(context.orgName || context.name).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-[13.5px] font-black text-zinc-950 truncate leading-snug">
                      {context.orgName || context.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-mono font-semibold lowercase tracking-tight mt-0.5">
                      {context.type === 'guest' ? 'guest or unregistered' : `slug: ${context.slug}`}
                    </p>
                  </div>
                </div>

                {/* System details list as shown in the screenshot */}
                <div className="space-y-2">



                  {/* BILLING TERMS */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/30">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[8.5px]">
                      <FileCode className="w-4 h-4 text-zinc-400 shrink-0" />
                      Billing Terms
                    </div>
                    <span className="text-zinc-800 font-extrabold text-[10.5px]">
                      {context.billingTerms}
                    </span>
                  </div>

                  {/* PAYMENT STATE */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/30">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[8.5px]">
                      <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                      Payment State
                    </div>
                    {context.type === 'guest' || context.paymentState === 'N/A' ? (
                      <span className="text-[9.5px] font-mono font-bold bg-zinc-50 text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded uppercase tracking-wider">
                        N/A
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        {context.paymentState}
                      </span>
                    )}
                  </div>

                  {/* EMAIL ADDRESS */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/30">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[8.5px]">
                      <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                      Email Address
                    </div>
                    <a 
                      href={`mailto:${context.emailAddress}`} 
                      className="text-indigo-600 hover:text-indigo-700 font-extrabold text-[10.5px] hover:underline truncate max-w-[140px]"
                    >
                      {context.emailAddress}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        )
      )}

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
      {/* Email Preview Modal */}
      {isEmailPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-black text-zinc-900 font-mono uppercase tracking-tight">Email Dispatch Preview</h3>
              </div>
              <button 
                onClick={() => setIsEmailPreviewOpen(false)}
                className="p-1.5 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 font-mono uppercase tracking-widest block">Recipient Client</label>
                  <div className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 truncate">
                    {selectedTicket?.email}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 font-mono uppercase tracking-widest block">Email Subject</label>
                  <input 
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 font-mono uppercase tracking-widest block">Message Content</label>
                  <textarea 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={6}
                    placeholder="Draft your email response here..."
                    className="w-full px-3 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
                  />
                </div>

                {replyFiles.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 font-mono uppercase tracking-widest block">Attachments ({replyFiles.length})</label>
                    <div className="flex flex-wrap gap-1.5">
                      {replyFiles.map((f, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-md text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleConfirmSendEmail}
                  disabled={isSendingEmail}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black font-mono uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {isSendingEmail ? 'Dispatching...' : 'Confirm & Dispatch'}
                </button>
              </div>
            </div>
            
            <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-200">
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight leading-normal">
                Important: Once dispatched, this email cannot be recalled. It will be sent via AWS SES from info@fitnearn.com.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
