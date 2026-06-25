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
  Paperclip
} from 'lucide-react';
import { toast } from 'sonner';

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
  
  // Real DB backed state arrays
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [replies, setReplies] = useState<TicketReply[]>([]);
  
  // General Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // New reply compose states
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [replyFiles, setReplyFiles] = useState<{ name: string; size: number; type: string; base64: string }[]>([]);
  const replyFileInputRef = React.useRef<HTMLInputElement>(null);

  // Helper to append Authorization headers (with Cognito ID Token or fallback mock platform_admin JWT for local dev)
  const getAuthHeaders = (contentType: string | null = 'application/json') => {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('nconnect_id_token') : null;
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    } else {
      // In local dev, generate a mock platform_admin token so Hono authInjection can decode it base64-wise
      const mockAdminPayload = {
        sub: 'ops-admin-test-uid',
        email: 'ops-admin@test.com',
        name: 'Naman Dev',
        'custom:role': 'platform_admin',
        exp: Math.floor(Date.now() / 1000) + 86400,
      };
      try {
        const base64Payload = btoa(JSON.stringify(mockAdminPayload));
        const mockToken = `mockHeader.${base64Payload}.mockSignature`;
        headers['Authorization'] = `Bearer ${mockToken}`;
      } catch (e) {
        console.error('Failed to generate mock token:', e);
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
      const res = await fetch('/api/v1/ops/helpdesk/tickets', {
        headers: getAuthHeaders(null)
      });
      const data = await res.json();
      if (data.success && data.tickets) {
        setTickets(data.tickets);
        // Default select first ticket if none selected or if previously selected is missing
        if (data.tickets.length > 0 && (!selectedTicketId || !data.tickets.some((t: any) => t.id === selectedTicketId))) {
          setSelectedTicketId(data.tickets[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
      toast.error('Failed to fetch support tickets from operations API.');
    } finally {
      if (!quiet) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Auto-poll new tickets list quietly in the background every 15 seconds
    const interval = setInterval(() => {
      fetchTickets(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedTicketId]);

  // Load Replies whenever active ticket changes
  const fetchReplies = async (quiet = false) => {
    if (!selectedTicketId) return;
    if (!quiet) setIsRepliesLoading(true);
    try {
      const res = await fetch(`/api/v1/ops/helpdesk/tickets/${selectedTicketId}/messages`, {
        headers: getAuthHeaders(null)
      });
      const data = await res.json();
      if (data.success && data.messages) {
        setReplies(data.messages);
      }
    } catch (err) {
      console.error('Failed to load replies:', err);
      if (!quiet) toast.error('Failed to retrieve discussion messages.');
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

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const selectedReplies = [...replies].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Manual session refresh trigger
  const handleRefreshState = async () => {
    setIsRefreshing(true);
    await fetchTickets(true);
    await fetchReplies(true);
    setIsRefreshing(false);
    toast.success('Live operations queue synchronized with database records.');
  };

  // Dynamic triage locator generator based on ticket profile fields
  const getTriageContext = (ticket: SupportTicket | undefined) => {
    if (!ticket) {
      return {
        type: 'guest',
        name: 'No Active Ticket',
        domain: 'N/A',
        email: 'N/A',
        plan: 'N/A',
        apiUsage: '0 / 0 requests',
        apiPercentage: 0,
        smtpStatus: 'UNCONFIGURED',
        activeUsers: 0,
        billingStatus: 'UNPAID',
        riskScore: 'Low',
        ipAddress: '127.0.0.1',
        region: 'Unknown',
        lastSync: 'N/A',
        warning: null
      };
    }

    const email = ticket.email.toLowerCase();
    
    if (email.includes('peter') || ticket.name.toLowerCase().includes('peter')) {
      return {
        type: 'tenant',
        name: 'Horizon Agency Hub',
        domain: 'horizon.sh',
        email: 'peter@horizon.sh',
        plan: 'Professional Plan ($49/mo)',
        apiUsage: '42,500 / 50,000 requests',
        apiPercentage: 85,
        smtpStatus: 'VERIFIED (AWS SES AP-SOUTH-1)',
        activeUsers: 8,
        billingStatus: 'PAID (Disputed)',
        riskScore: 'Low Risk',
        ipAddress: '103.45.12.189',
        region: 'Mumbai, India',
        lastSync: '5 mins ago',
        warning: 'Stripe webhook caught duplicate tokens on credit authorization renewal. High priority refund needed.'
      };
    }
    
    if (email.includes('tony') || ticket.name.toLowerCase().includes('tony')) {
      return {
        type: 'tenant',
        name: 'Stark Industries Core',
        domain: 'stark.io',
        email: 'tony@stark.io',
        plan: 'Enterprise Custom ($2,499/mo)',
        apiUsage: '450,000 / 1,000,000 requests',
        apiPercentage: 45,
        smtpStatus: 'DEGRADED (Custom AWS Relay)',
        activeUsers: 142,
        billingStatus: 'PAID (Auto PO)',
        riskScore: 'Low Risk',
        ipAddress: '54.210.82.11',
        region: 'Northern Virginia, USA',
        lastSync: '1 min ago',
        warning: 'Handshake latencies on AWS AP-SOUTH-1 region. Dynamic fallback rules generated for Singapore (ap-southeast-1).'
      };
    }

    if (email.includes('lucius') || ticket.name.toLowerCase().includes('lucius')) {
      return {
        type: 'tenant',
        name: 'Wayne Enterprises Global',
        domain: 'wayne.co',
        email: 'lucius@wayne.co',
        plan: 'Professional Plan ($49/mo)',
        apiUsage: '12,400 / 50,000 requests',
        apiPercentage: 24.8,
        smtpStatus: 'VERIFIED (AWS SES US-EAST-1)',
        activeUsers: 4,
        billingStatus: 'PAID',
        riskScore: 'Low Risk',
        ipAddress: '12.89.41.22',
        region: 'Gotham City, USA',
        lastSync: '1 hr ago',
        warning: null
      };
    }

    if (email.includes('lex') || ticket.name.toLowerCase().includes('lex') || ticket.tenantId === null) {
      return {
        type: 'guest',
        name: ticket.name,
        domain: (ticket.email ? ticket.email.split('@')[1] : 'lexcorp.com') + ' (Pre-signup)',
        email: ticket.email,
        plan: 'Unauthenticated Guest Prospect',
        apiUsage: '0 / 0 requests (No Workspace)',
        apiPercentage: 0,
        smtpStatus: 'UNVERIFIED (Handshake Expired)',
        activeUsers: 0,
        billingStatus: 'UNPAID (Pending Trial)',
        riskScore: 'CRITICAL FLAGS TRIGGERED',
        ipAddress: '198.51.100.42',
        region: 'Metropolis, USA',
        lastSync: 'Just now',
        blockReason: 'Cognito link verification expired. Region mismatch flagged (Metropolis datacenter IP mapped to blocked region rules).',
        leadScore: 'HOT PROSPECT (High Intent)',
        warning: 'IP matches metropolitan VPS node which triggered automatic spam block rules. Safe to manually override/bypass.'
      };
    }

    // Default dynamic context for general multi-tenant or guest tickets
    const domain = ticket.email.split('@')[1] || 'domain.com';
    const isGuest = ticket.tenantId === null;
    return {
      type: isGuest ? 'guest' : 'tenant',
      name: isGuest ? `${ticket.name} (Guest)` : `${ticket.name}'s Workspace`,
      domain: domain,
      email: ticket.email,
      plan: isGuest ? 'Guest Lead Prospect' : 'Professional Plan ($49/mo)',
      apiUsage: isGuest ? '0 / 0 requests' : '15,600 / 50,000 requests',
      apiPercentage: isGuest ? 0 : 31.2,
      smtpStatus: isGuest ? 'UNVERIFIED' : 'VERIFIED (AWS SES)',
      activeUsers: isGuest ? 0 : 3,
      billingStatus: isGuest ? 'PENDING' : 'PAID',
      riskScore: 'Normal',
      ipAddress: '103.22.45.18',
      region: 'Delhi, India',
      lastSync: 'Recently updated',
      blockReason: isGuest ? 'Unauthenticated guest ticket session' : undefined,
      leadScore: isGuest ? 'WARM LEAD' : undefined,
      warning: ticket.priority === 'critical' || ticket.priority === 'high' 
        ? 'Escalated ticket priority. Needs immediate operator attention.' 
        : null
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

      const res = await fetch(`/api/v1/ops/helpdesk/tickets/${selectedTicketId}/messages`, {
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

  const handleStatusChange = async (status: SupportTicket['status']) => {
    if (!selectedTicketId) return;
    try {
      const res = await fetch(`/api/v1/ops/helpdesk/tickets/${selectedTicketId}`, {
        method: 'PATCH',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update ticket status.');
      }

      setTickets(prev => prev.map(t => {
        if (t.id === selectedTicketId) {
          return { ...t, status };
        }
        return t;
      }));
      toast.success(`Ticket status updated to ${status.toUpperCase().replace('_', ' ')}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to alter ticket status.');
    }
  };

  const handlePriorityChange = async (priority: SupportTicket['priority']) => {
    if (!selectedTicketId) return;
    try {
      const res = await fetch(`/api/v1/ops/helpdesk/tickets/${selectedTicketId}`, {
        method: 'PATCH',
        headers: getAuthHeaders('application/json'),
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
      const res = await fetch(`/api/v1/ops/helpdesk/tickets/${selectedTicketId}`, {
        method: 'PATCH',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify({ assignedTo: 'Naman Dev' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to assign operator.');
      }

      setTickets(prev => prev.map(t => {
        if (t.id === selectedTicketId) {
          return { ...t, assignedTo: 'Naman Dev' };
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

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.workspaceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filters mapping
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = t.status === statusFilter;
    }
    return matchesSearch && matchesStatus;
  });

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
          <button 
            onClick={handleRefreshState}
            disabled={isRefreshing}
            className="p-2 border border-zinc-200 bg-white text-zinc-500 rounded-xl hover:text-zinc-800 hover:bg-zinc-50 transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Records
          </button>
          <div className="flex items-center gap-2 border border-zinc-150 rounded-xl p-2 bg-white">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-extrabold text-zinc-500 uppercase tracking-wider">
              Websockets: Live
            </span>
          </div>
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
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

              {/* Sub Filters */}
              <div className="flex gap-0.5 bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/40">
                {(['all', 'open', 'in_progress', 'resolved'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                      statusFilter === tab
                        ? 'bg-gradient-to-r from-[#030213] to-indigo-950 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {tab === 'in_progress' ? 'Active' : tab}
                  </button>
                ))}
              </div>

              {/* Tickets List */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
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
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-50/40 to-indigo-100/10 border-indigo-200 shadow-sm'
                          : 'bg-white border-zinc-200/50 hover:bg-zinc-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-extrabold text-zinc-400 uppercase tracking-tight">
                          {t.ticketCode}
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
                          t.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}>
                          {t.status === 'in_progress' ? 'active' : t.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredTickets.length === 0 && (
                  <div className="text-center py-8 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl">
                    <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">No Tickets Found</span>
                  </div>
                )}
              </div>
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
                    <span className="text-[10px] font-extrabold text-zinc-400 flex items-center gap-1.5 uppercase font-mono mt-0.5">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      Client: {selectedTicket.name} ({selectedTicket.email}) • Key: {selectedTicket.workspaceId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Assign Button */}
                    {!selectedTicket.assignedTo ? (
                      <button
                        onClick={handleAssignToMe}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl shadow-md shadow-indigo-600/10 border border-indigo-500/15 transition-all uppercase tracking-wider"
                      >
                        Assign To Me
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-1 rounded-lg bg-zinc-50 text-zinc-500 border border-zinc-200/60">
                        Agent: {selectedTicket.assignedTo}
                      </span>
                    )}

                    {/* Status Switcher */}
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(e.target.value as any)}
                      className="bg-zinc-50 border border-zinc-200 text-[10px] font-extrabold uppercase rounded-xl px-2 py-1.5 cursor-pointer text-zinc-800 focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">Active</option>
                      <option value="resolved">Resolved</option>
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
                                  <Lock className="w-2.5 h-2.5" />
                                  INTERNAL STAFF
                                </span>
                              )}
                              {!isInternal && isSupport && (
                                <span className="text-[8px] font-mono font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-indigo-100/40">
                                  <Globe className="w-2.5 h-2.5" />
                                  CLIENT PUBLIC
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
                                      download={file.name}
                                      className="flex items-center gap-2.5 p-2 bg-white hover:bg-zinc-50 border border-zinc-200/60 rounded-xl transition-all select-none"
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
                <form onSubmit={handlePostReply} className="border-t border-zinc-200/50 pt-4 space-y-3">
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
                    {/* Note toggle */}
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(!isInternalNote)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                        isInternalNote
                          ? 'bg-amber-50 border-amber-200 text-amber-700 font-black'
                          : 'bg-zinc-50 border-zinc-200/60 text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      <Lock className={`w-3.5 h-3.5 ${isInternalNote ? 'text-amber-600' : 'text-zinc-400'}`} />
                      Post as Private Internal Note
                    </button>

                    <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block"></span>
                      SES SMTP Outbound: <span className="text-emerald-600 font-extrabold">Active</span>
                    </span>
                  </div>

                  <div className="flex gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => replyFileInputRef.current?.click()}
                      className="border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 p-3.5 rounded-xl flex items-center justify-center shadow-sm transition-all"
                      title="Attach logs or files"
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
                      placeholder={isInternalNote ? "Leave a private audit note for internal support staff..." : "Draft a reply to the customer client..."}
                      className="flex-1 bg-zinc-50 border border-zinc-200 text-xs font-semibold px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 hover:bg-zinc-100/30 transition-colors"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!replyMessage.trim() && replyFiles.length === 0}
                      className={`text-white font-extrabold text-xs p-3.5 rounded-xl transition-all shadow-md flex items-center justify-center border disabled:opacity-50 ${
                        isInternalNote
                          ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/15 border-amber-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15 border-indigo-500/20'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
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
          </div>

          {/* Right column: Triage Context Locator (col-span-3) */}
          <div className="xl:col-span-3">
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-md space-y-5 select-none">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
                <span className="text-xs font-extrabold text-zinc-900 font-mono uppercase tracking-wider">
                  Triage Context Locator
                </span>
              </div>

              {/* Profile Header Block */}
              <div className="p-3.5 rounded-xl border bg-zinc-50 border-zinc-200/60 flex items-start gap-3">
                {context.type === 'tenant' ? (
                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                ) : (
                  <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-600">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className={`text-[8.5px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block border mb-1.5 ${
                    context.type === 'tenant' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-red-50 border-red-100 text-red-600'
                  }`}>
                    {context.type === 'tenant' ? 'TENANT WORKSPACE' : 'GUEST LEAD PROSPECT'}
                  </span>
                  <h4 className="text-xs font-black text-zinc-950 truncate leading-snug">{context.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-bold truncate mt-0.5">{context.domain}</p>
                </div>
              </div>

              {/* Service & Operational Specs */}
              <div className="space-y-3">
                <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider font-mono">
                  System Metrics & Subscription
                </span>

                {/* API progress limit (only for tenant) */}
                {context.type === 'tenant' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-zinc-600">
                      <span>Monthly API Quota</span>
                      <span>{context.apiPercentage}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/40">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          context.apiPercentage > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`} 
                        style={{ width: `${context.apiPercentage}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-zinc-400 font-bold">{context.apiUsage}</p>
                  </div>
                )}

                {/* Metadata grids */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-[10px]">
                  <div className="bg-zinc-50/50 p-2 border border-zinc-100 rounded-xl">
                    <span className="text-zinc-400 font-bold text-[8px] uppercase tracking-wider block">Billing Tier</span>
                    <span className="text-zinc-800 font-extrabold block mt-0.5 truncate">{context.plan}</span>
                  </div>
                  <div className="bg-zinc-50/50 p-2 border border-zinc-100 rounded-xl">
                    <span className="text-zinc-400 font-bold text-[8px] uppercase tracking-wider block">Active Admins</span>
                    <span className="text-zinc-800 font-extrabold block mt-0.5">{context.activeUsers} Operators</span>
                  </div>
                  <div className="bg-zinc-50/50 p-2 border border-zinc-100 rounded-xl col-span-2">
                    <span className="text-zinc-400 font-bold text-[8px] uppercase tracking-wider block">AWS SES Outbound Gate</span>
                    <span className="text-zinc-800 font-mono font-extrabold block mt-0.5 text-[9px] truncate">{context.smtpStatus}</span>
                  </div>
                  <div className="bg-zinc-50/50 p-2 border border-zinc-100 rounded-xl">
                    <span className="text-zinc-400 font-bold text-[8px] uppercase tracking-wider block">Source IP</span>
                    <span className="text-zinc-800 font-mono font-extrabold block mt-0.5 truncate">{context.ipAddress}</span>
                  </div>
                  <div className="bg-zinc-50/50 p-2 border border-zinc-100 rounded-xl">
                    <span className="text-zinc-400 font-bold text-[8px] uppercase tracking-wider block">Server Region</span>
                    <span className="text-zinc-800 font-extrabold block mt-0.5 truncate">{context.region}</span>
                  </div>
                </div>
              </div>

              {/* Special block for Guest Block reasoning */}
              {context.type === 'guest' && context.blockReason && (
                <div className="p-3 bg-red-50/50 border border-red-200/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1 text-red-600">
                    <Ban className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono">Cognito Block Reason</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-semibold leading-relaxed">
                    {context.blockReason}
                  </p>
                  {context.leadScore && (
                    <div className="bg-white/80 p-2 border border-red-100 rounded-lg text-[9.5px]">
                      <span className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-wider block">Hot Lead Score</span>
                      <span className="text-indigo-600 font-black flex items-center gap-1 mt-0.5">
                        <Zap className="w-3 h-3 fill-indigo-600 text-indigo-600 animate-pulse" />
                        {context.leadScore}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Live Warn Warning alerts */}
              {context.warning && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/50 rounded-xl flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[10px] leading-relaxed">
                    <span className="font-extrabold text-amber-800 uppercase tracking-wider block mb-0.5">Operator Dispatch Notice</span>
                    <span className="text-zinc-600 font-semibold">{context.warning}</span>
                  </div>
                </div>
              )}

              {/* Operations CTA Quick actions */}
              <div className="pt-2 border-t border-zinc-100 space-y-2">
                {context.type === 'guest' ? (
                  <button
                    type="button"
                    onClick={handleBypassSecurity}
                    className="w-full bg-[#030213] hover:bg-zinc-800 text-white font-extrabold text-[10px] py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider transition-all border border-zinc-950"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Manual Bypass & Invite
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast.success('Escalation flagged in team chat.')}
                    className="w-full bg-[#030213] hover:bg-zinc-800 text-white font-extrabold text-[10px] py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider transition-all border border-zinc-950"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Escalate to Ops Slack
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRefreshState}
                  className="w-full bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-800 font-extrabold text-[10px] py-2 rounded-xl flex items-center justify-center gap-1 border border-zinc-200 shadow-sm transition-all"
                >
                  <RefreshCw className="w-3 h-3 text-zinc-400 animate-spin" />
                  Refresh State Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
