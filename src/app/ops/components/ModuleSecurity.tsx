'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Key, 
  Radio, 
  Search, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  X, 
  Check, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Interfaces mapping directly to PDF DB schemas
interface AuditLog {
  id: string;
  workspaceId: string;
  actorId: string;
  actorType: 'human' | 'system';
  action: string;
  resource: string;
  resourceId: string | null;
  ipAddress: string;
  traceId: string;
  createdAt: string;
}

interface ApiKey {
  id: string;
  workspaceId: string;
  name: string;
  keyHash: string;
  type: string;
  permissions: string[];
  status: 'active' | 'revoked';
  createdBy: string;
  createdAt: string;
}

interface OutboundWebhook {
  id: string;
  workspaceId: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

export default function ModuleSecurity() {
  const [activeSubTab, setActiveSubTab] = useState<'keys' | 'webhooks' | 'audit'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'key-1', workspaceId: 'ws-horizon', name: 'Stripe Webhook Receiver Key', keyHash: 'nct_live_2b83d1c4e13028c04fe885', type: 'rest', permissions: ['subscribers.read', 'billing.write'], status: 'active', createdBy: 'Peter Parker', createdAt: '2026-01-10T12:00:00Z' },
    { id: 'key-2', workspaceId: 'ws-stark', name: 'AWS Lambda Sync Auth Token', keyHash: 'nct_live_c104e8d350b18fa3028cd3', type: 'rest', permissions: ['campaigns.write', 'media.read'], status: 'active', createdBy: 'Tony Stark', createdAt: '2026-03-15T09:30:00Z' },
    { id: 'key-3', workspaceId: 'ws-wayne', name: 'Legacy Marketing API Key', keyHash: 'nct_live_049fc3d024be8593a29cd0', type: 'rest', permissions: ['contacts.read'], status: 'revoked', createdBy: 'Peter Parker', createdAt: '2025-11-20T10:15:00Z' }
  ]);

  // Outbound webhooks state
  const [webhooks, setWebhooks] = useState<OutboundWebhook[]>([
    { id: 'wh-1', workspaceId: 'ws-horizon', url: 'https://api.horizon.sh/webhooks/campaign-delivery', secret: 'whsec_9b2e04f18d3c50b8ec92', events: ['campaign.sent', 'campaign.failed'], isActive: true, createdAt: '2026-02-12T14:20:00Z' },
    { id: 'wh-2', workspaceId: 'ws-stark', url: 'https://stark-comms.com/endpoints/auditing-sink', secret: 'whsec_8e3c12fe50ac2090b8f2', events: ['user.suspended', 'api_key.revoked'], isActive: true, createdAt: '2026-04-18T11:45:00Z' },
    { id: 'wh-3', workspaceId: 'ws-wayne', url: 'https://batcave.internal/logs/events', secret: 'whsec_e3c9284fa0c50293b2a8', events: ['contact.created'], isActive: false, createdAt: '2025-12-05T08:00:00Z' }
  ]);

  // Audit Logs database state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'log-1', workspaceId: 'ws-horizon', actorId: 'Peter Parker', actorType: 'human', action: 'api_key.generated', resource: 'api_keys', resourceId: 'key-1', ipAddress: '192.168.1.105', traceId: 'tr_2b83d1c4e13028c0', createdAt: '2026-06-19T10:15:32Z' },
    { id: 'log-2', workspaceId: 'ws-stark', actorId: 'System_Relay', actorType: 'system', action: 'webhook.dispatched', resource: 'webhooks', resourceId: 'wh-2', ipAddress: '10.0.0.4', traceId: 'tr_c104e8d350b18fa3', createdAt: '2026-06-19T11:45:10Z' },
    { id: 'log-3', workspaceId: 'ws-wayne', actorId: 'Naman Dev', actorType: 'human', action: 'user.suspended', resource: 'memberships', resourceId: 'mem-3-2', ipAddress: '110.22.45.18', traceId: 'tr_049fc3d024be8593', createdAt: '2026-06-19T12:30:15Z' },
    { id: 'log-4', workspaceId: 'ws-lex', actorId: 'System_Scheduler', actorType: 'system', action: 'subscription.expired', resource: 'subscriptions', resourceId: 'sub-l4-2', ipAddress: '127.0.0.1', traceId: 'tr_e3c9284fa0c50293', createdAt: '2026-06-19T14:20:00Z' }
  ]);

  // UI States
  const [revealSecrets, setRevealSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleSecret = (id: string) => {
    setRevealSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedKey(id);
    toast.success('Hashed key signature copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => prev.map(k => {
      if (k.id === id) {
        return { ...k, status: 'revoked' };
      }
      return k;
    }));

    // Inject revoke transaction log
    const key = apiKeys.find(k => k.id === id)!;
    const newLog: AuditLog = {
      id: `log-${Math.random().toString(36).substring(2, 6)}`,
      workspaceId: key.workspaceId,
      actorId: 'Naman Dev',
      actorType: 'human',
      action: 'api_key.revoked',
      resource: 'api_keys',
      resourceId: key.id,
      ipAddress: '110.22.45.18',
      traceId: `tr_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    toast.warning(`API Key '${key.name}' has been permanently revoked!`);
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, isActive: !w.isActive };
      }
      return w;
    }));
    toast.success('Webhook delivery gateway configuration updated.');
  };

  const handleTriggerWebhookTest = (wh: OutboundWebhook) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1400)),
      {
        loading: `Dispatching payload transaction to gateway on URL...`,
        success: `Payload dispatched. Gateway received HTTP 200 OK signature for ${wh.id}!`,
        error: `Payload timed out.`
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            Security: Data & Backup
          </h1>
          <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">
            Supervise compliance logs, revoke/generate programmatic API access keys, and secure outbound webhook dispatchers. Fully compliant with audit_log, api_keys, and webhooks schemas.
          </p>
        </div>

        {/* Sub tabs navigation */}
        <div className="flex bg-zinc-100 rounded-xl p-0.5 border border-zinc-200/50 shadow-sm">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
              activeSubTab === 'audit' ? 'bg-white text-purple-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Audit Trail Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('keys')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
              activeSubTab === 'keys' ? 'bg-white text-purple-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            API Keys Controller
          </button>
          <button
            onClick={() => setActiveSubTab('webhooks')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
              activeSubTab === 'webhooks' ? 'bg-white text-purple-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Webhook Gateway
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm min-h-[460px]">
        {activeSubTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-600" />
                Live Compliance Audit Stream
              </h3>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Buffer Status: Stable Running
              </span>
            </div>

            {/* Clean Audit Log Stream viewer */}
            <div className="bg-zinc-50 border border-zinc-200 shadow-inner rounded-2xl p-5 space-y-3.5 h-[360px] overflow-y-auto">
              {auditLogs.map((log) => {
                const isSystem = log.actorType === 'system';
                return (
                  <div key={log.id} className="hover:bg-white p-3.5 border-b border-zinc-200/50 rounded-xl transition-all duration-150 flex flex-wrap items-start justify-between gap-4 shadow-sm hover:shadow">
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-2 flex-wrap text-[12px] font-semibold text-zinc-600">
                        <span className="text-zinc-400 font-bold font-mono">[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border uppercase ${
                          isSystem 
                            ? 'bg-zinc-100 text-zinc-600 border-zinc-200' 
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {log.actorType}
                        </span>
                        <span className="text-zinc-800 font-extrabold">{log.actorId}</span>
                        <span className="text-zinc-400 font-medium">triggered</span>
                        <span className="text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded text-[10px] font-extrabold">
                          {log.action.toUpperCase()}
                        </span>
                        <span className="text-zinc-400 font-medium">on</span>
                        <span className="text-indigo-600 font-bold">schema://{log.resource}</span>
                      </div>
                      <div className="text-zinc-500 text-[10.5px] font-medium bg-zinc-100/50 p-2 rounded-lg border border-zinc-200/30 flex flex-wrap gap-x-4 gap-y-1.5">
                        <span>Trace: <span className="text-zinc-700 font-bold font-mono">{log.traceId}</span></span>
                        <span>Client IP: <span className="text-zinc-700 font-bold font-mono">{log.ipAddress}</span></span>
                        <span>Workspace: <span className="text-zinc-700 font-bold font-mono">{log.workspaceId}</span></span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-200/50 border border-zinc-200 px-2 py-0.5 rounded font-mono font-bold select-all shrink-0">
                      UUID: {log.id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'keys' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/50 pb-3">
              <h3 className="text-[12px] font-bold text-zinc-950 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-purple-600" />
                Programmatic API Key Ledger
              </h3>
              <button
                onClick={() => toast.info('Integration client credential creation window placeholder.')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Generate New Token
              </button>
            </div>

            {/* Keys grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {apiKeys.map((key) => {
                const isRevoked = key.status === 'revoked';
                return (
                  <div
                    key={key.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between h-[230px] transition-all ${
                      isRevoked 
                        ? 'bg-zinc-50/50 border-zinc-200/40 opacity-60' 
                        : 'bg-white border-zinc-200/60 shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-[12.5px] font-bold text-zinc-900 leading-tight">{key.name}</h4>
                          <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">{key.workspaceId}</span>
                        </div>
                        <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase ${
                          isRevoked 
                            ? 'bg-red-50 text-red-700 border border-red-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {key.status}
                        </span>
                      </div>

                      {/* Hash Key details */}
                      <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3.5 flex items-center justify-between font-mono text-xs text-zinc-600">
                        <span className="font-semibold">{key.keyHash}</span>
                        {!isRevoked && (
                          <button
                            onClick={() => handleCopyHash(key.id, key.keyHash)}
                            className="text-zinc-400 hover:text-purple-600 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Permissions arrays */}
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map(p => (
                          <span key={p} className="text-[9px] font-mono font-bold bg-zinc-100 text-zinc-600 border border-zinc-200/40 px-1.5 py-0.5 rounded">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 font-semibold font-mono">
                      <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                      {!isRevoked && (
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'webhooks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/50 pb-3">
              <h3 className="text-[12px] font-bold text-zinc-950 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple-600" />
                Outgoing Webhooks endpoints
              </h3>
              <button
                onClick={() => toast.info('Webhook register endpoint placeholder.')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Endpoint
              </button>
            </div>

            {/* Webhooks cards ledger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {webhooks.map((wh) => {
                const showSecret = revealSecrets[wh.id] || false;
                return (
                  <div key={wh.id} className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between h-[230px]">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">ID: {wh.id} • Workspace: {wh.workspaceId}</span>
                          <h4 className="text-[12px] font-bold text-zinc-950 truncate font-mono">{wh.url}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Toggle active switch */}
                          <button
                            onClick={() => handleToggleWebhook(wh.id)}
                            className={`w-9 h-5 rounded-full transition-all relative ${
                              wh.isActive ? 'bg-purple-600' : 'bg-zinc-200'
                            }`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                              wh.isActive ? 'right-0.5' : 'left-0.5'
                            }`}></span>
                          </button>
                        </div>
                      </div>

                      {/* Secret disclosure grid */}
                      <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3.5 flex items-center justify-between font-mono text-[11px] text-zinc-600">
                        <span className="font-semibold">
                          Secret: {showSecret ? wh.secret : 'whsec_••••••••••••••••••••'}
                        </span>
                        <button
                          onClick={() => toggleSecret(wh.id)}
                          className="text-zinc-400 hover:text-purple-600 transition-colors"
                        >
                          {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Webhook Events tags */}
                      <div className="flex flex-wrap gap-1">
                        {wh.events.map(ev => (
                          <span key={ev} className="text-[9px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 font-semibold font-mono">
                      <span>Created: {new Date(wh.createdAt).toLocaleDateString()}</span>
                      {wh.isActive && (
                        <button
                          onClick={() => handleTriggerWebhookTest(wh)}
                          className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                          Trigger Test Outbound Payload
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
