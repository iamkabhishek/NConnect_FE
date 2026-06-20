'use client';

import React, { useState } from 'react';
import { 
  BellRing, 
  Workflow, 
  FileCode, 
  Mail, 
  Clock, 
  Settings, 
  Activity, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

// Interfaces mapping directly to PDF DB schemas
interface NotificationWorkflow {
  id: string;
  messageType: string;
  critical: boolean;
  status: 'active' | 'paused' | 'archived';
}

interface WorkflowStep {
  id: string;
  workflowId: string;
  order: number;
  type: 'channel' | 'delay' | 'condition';
  config: {
    channel?: 'email' | 'sms' | 'slack' | 'in_app';
    duration?: string;
    conditionKey?: string;
    conditionVal?: string;
  };
  templateId: string | null;
}

interface NotificationTemplate {
  id: string;
  name: string;
  channel: 'email' | 'sms' | 'slack' | 'in_app';
  subject: string;
  body: string;
  version: number;
}

interface DeliveryLog {
  id: string;
  jobId: string;
  channel: string;
  provider: string;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'failed';
  trackingToken: string;
  errorMessage: string | null;
  sentAt: string;
  openedAt: string | null;
}

export default function ModuleNotifications() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-1');
  const [activeTab, setActiveTab] = useState<'steps' | 'template' | 'logs'>('steps');

  // Mock DB - notification_workflows table
  const [workflows, setWorkflows] = useState<NotificationWorkflow[]>([
    { id: 'wf-1', messageType: 'billing.invoice_failed', critical: true, status: 'active' },
    { id: 'wf-2', messageType: 'campaign.delivery_completed', critical: false, status: 'active' },
    { id: 'wf-3', messageType: 'user.invited', critical: true, status: 'active' },
    { id: 'wf-4', messageType: 'subscriber.new_signup', critical: false, status: 'paused' }
  ]);

  // Mock DB - notification_workflow_steps table
  const [steps, setSteps] = useState<WorkflowStep[]>([
    // billing.invoice_failed steps
    { id: 'step-1-1', workflowId: 'wf-1', order: 1, type: 'channel', config: { channel: 'email' }, templateId: 'tmpl-1' },
    { id: 'step-1-2', workflowId: 'wf-1', order: 2, type: 'delay', config: { duration: '24 hours' }, templateId: null },
    { id: 'step-1-3', workflowId: 'wf-1', order: 3, type: 'channel', config: { channel: 'sms' }, templateId: 'tmpl-2' },
    
    // campaign.delivery_completed steps
    { id: 'step-2-1', workflowId: 'wf-2', order: 1, type: 'channel', config: { channel: 'in_app' }, templateId: 'tmpl-3' },
    { id: 'step-2-2', workflowId: 'wf-2', order: 2, type: 'channel', config: { channel: 'slack' }, templateId: 'tmpl-4' },

    // user.invited steps
    { id: 'step-3-1', workflowId: 'wf-3', order: 1, type: 'channel', config: { channel: 'email' }, templateId: 'tmpl-5' }
  ]);

  // Mock DB - notification_templates table
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    { id: 'tmpl-1', name: 'Invoice Failed Alert Template', channel: 'email', subject: 'Urgent: Payment failed for NConnect subscription {{workspaceName}}', body: 'Hi {{ownerName}},\n\nYour recent renewal charge of {{amount}} failed. We will retry in 24 hours. Please update your card billing address to avoid service suspension.\n\nThanks,\nNConnect Support Team', version: 1 },
    { id: 'tmpl-2', name: 'Invoice Failed SMS Template', channel: 'sms', subject: '', body: 'Urgent: NConnect payment failed for {{workspaceName}}. Renew card details on: https://nconnect.com/billing to resume.', version: 1 },
    { id: 'tmpl-3', name: 'Campaign Success Toast Template', channel: 'in_app', subject: 'Campaign delivered!', body: 'Your campaign "{{campaignName}}" has been fully dispatched to {{subscriberCount}} recipients.', version: 1 },
    { id: 'tmpl-4', name: 'Slack Campaign Broadcast Template', channel: 'slack', subject: '', body: ':rocket: *Campaign Dispatched!* \nCampaign: `{{campaignName}}` dispatched to `{{subscriberCount}}` contacts successfully.', version: 1 },
    { id: 'tmpl-5', name: 'Outbound Invitation Template', channel: 'email', subject: 'Invite: Join {{workspaceName}} workspace on NConnect', body: 'Hi {{invitedEmail}},\n\nYou have been invited by {{invitedBy}} to collaborate as role: {{role}}.\n\nClick to accept invitation:\nhttps://nconnect.com/invites/accept?token={{token}}', version: 1 }
  ]);

  // Mock DB - notification_delivery_log table
  const [logs, setLogs] = useState<DeliveryLog[]>([
    { id: 'dl-1', jobId: 'job-101', channel: 'email', provider: 'aws_ses', status: 'opened', trackingToken: 'tok_5b8c1d30f', errorMessage: null, sentAt: '2026-06-19T10:30:12Z', openedAt: '2026-06-19T11:15:40Z' },
    { id: 'dl-2', jobId: 'job-102', channel: 'sms', provider: 'twilio', status: 'delivered', trackingToken: 'tok_6a1d82fc3', errorMessage: null, sentAt: '2026-06-19T11:45:00Z', openedAt: null },
    { id: 'dl-3', jobId: 'job-103', channel: 'email', provider: 'aws_ses', status: 'failed', trackingToken: 'tok_04e8d350b', errorMessage: 'SMTP Error 554: Message Rejected. Recipient email is hard-bounced.', sentAt: '2026-06-19T12:00:15Z', openedAt: null },
    { id: 'dl-4', jobId: 'job-104', channel: 'slack', provider: 'slack_gateway', status: 'sent', trackingToken: 'tok_e3c9284fa', errorMessage: null, sentAt: '2026-06-19T14:20:00Z', openedAt: null }
  ]);

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];
  const selectedSteps = steps.filter(s => s.workflowId === selectedWorkflow.id).sort((a, b) => a.order - b.order);

  const handleToggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === 'active' ? 'paused' : 'active';
        return { ...w, status: nextStatus };
      }
      return w;
    }));
    toast.success('System dispatcher workflow status updated.');
  };

  const handleTestDispatch = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1200)),
      {
        loading: 'Enqueueing notification job & running template compiler...',
        success: 'Notification enqueued! Log ID successfully generated in notification_delivery_log.',
        error: 'Enqueueing failed.'
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
          <BellRing className="w-5 h-5 text-purple-600" />
          Preferences & Notifications
        </h1>
        <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">
          Configure notification steps, edit template blueprints, and trace gateway delivery logs. Fully synchronized with notification_workflows, steps, and delivery schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left pane: Workflows List */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-purple-600" />
                Active system Workflows
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {workflows.map(wf => {
                const isSelected = wf.id === selectedWorkflowId;
                const isPaused = wf.status === 'paused';
                return (
                  <div
                    key={wf.id}
                    onClick={() => setSelectedWorkflowId(wf.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-50/20 to-indigo-50/5 border-purple-200/80 shadow-sm'
                        : 'bg-white border-zinc-200/40 hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-[12px] font-bold text-zinc-900 truncate font-mono">
                        {wf.messageType}
                      </h4>
                      {wf.critical && (
                        <span className="text-[8px] font-mono font-extrabold px-1 bg-red-50 text-red-600 border border-red-100 rounded">
                          critical
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                      <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase">ID: {wf.id}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWorkflowStatus(wf.id);
                        }}
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded transition-colors ${
                          isPaused 
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200/30' 
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/30'
                        }`}
                      >
                        {wf.status}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right pane: Steps, blueprints and delivery logs */}
        <div className="xl:col-span-8">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm min-h-[460px] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header Tab controller */}
              <div className="border-b border-zinc-200/50 pb-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-950 font-mono">
                    {selectedWorkflow.messageType}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase">
                    Workflow Root ID: {selectedWorkflow.id}
                  </span>
                </div>

                {/* Sub Sub tab selection */}
                <div className="flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/40">
                  <button
                    onClick={() => setActiveTab('steps')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                      activeTab === 'steps' ? 'bg-white text-purple-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    Dispatch Steps ({selectedSteps.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('template')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                      activeTab === 'template' ? 'bg-white text-purple-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Template Blueprint
                  </button>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                      activeTab === 'logs' ? 'bg-white text-purple-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    SMTP Delivery Tracing
                  </button>
                </div>
              </div>

              {/* Tab 1: Dispatch Steps (Visual Workflow Flowchart) */}
              {activeTab === 'steps' && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col gap-4">
                    {selectedSteps.map((step, idx) => {
                      const isDelay = step.type === 'delay';
                      const tmpl = templates.find(t => t.id === step.templateId);

                      return (
                        <div key={step.id} className="flex items-center gap-4">
                          {/* Step number badge */}
                          <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono font-bold text-xs text-zinc-500 shadow-sm">
                            {idx + 1}
                          </div>

                          {/* Step Card details */}
                          <div className={`flex-1 p-4 rounded-xl border flex items-center justify-between ${
                            isDelay 
                              ? 'bg-amber-50/10 border-amber-200/40 border-dashed' 
                              : 'bg-zinc-50/40 border-zinc-200/50 shadow-[inset_1px_1px_2px_rgba(200,200,200,0.03)]'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDelay ? 'bg-amber-100/60 text-amber-600' : 'bg-purple-100/60 text-purple-600'}`}>
                                {isDelay ? <Clock className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                              </div>
                              <div>
                                <h4 className="text-[12px] font-bold text-zinc-950 uppercase font-mono">
                                  {step.type === 'channel' ? `DISPATCH_VIA_${step.config.channel}` : `TIMEOUT_DELAY`}
                                </h4>
                                <span className="text-[10.5px] text-zinc-400 font-semibold">
                                  {isDelay 
                                    ? `Wait for ${step.config.duration} before proceeding to next transaction.` 
                                    : `Linked Template Blueprint: ${tmpl ? tmpl.name : 'Unknown'}`
                                  }
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-400 font-bold select-all">UUID: {step.id}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Template Blueprints Edit Panel */}
              {activeTab === 'template' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {selectedSteps.filter(s => s.templateId).map(step => {
                    const tmpl = templates.find(t => t.id === step.templateId)!;
                    return (
                      <div key={tmpl.id} className="bg-zinc-50/50 border border-zinc-200/40 rounded-2xl p-4 space-y-3.5 flex flex-col justify-between min-h-[220px]">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-zinc-200/40 pb-2">
                            <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase">{tmpl.channel} • VERSION {tmpl.version}.0</span>
                            <span className="text-[9.5px] font-mono text-zinc-400 font-bold select-all">UUID: {tmpl.id}</span>
                          </div>
                          <h4 className="text-[12px] font-extrabold text-zinc-900">{tmpl.name}</h4>
                          {tmpl.subject && (
                            <p className="text-[11px] font-bold text-zinc-600 leading-snug"><span className="text-zinc-400">Subject:</span> {tmpl.subject}</p>
                          )}
                          <div className="bg-white border border-zinc-200/40 p-3 rounded-xl max-h-[140px] overflow-y-auto font-mono text-[10.5px] text-zinc-500 whitespace-pre-line leading-relaxed">
                            {tmpl.body}
                          </div>
                        </div>

                        <div className="bg-zinc-100 p-2 rounded-lg flex items-center gap-1.5 text-[9px] text-zinc-400 font-mono font-bold">
                          <Info className="w-3 h-3 text-zinc-400" />
                          Variables: {"{{workspaceName}}"}, {"{{ownerName}}"}, {"{{amount}}"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: SMTP Gateway Delivery Tracing Trace logs */}
              {activeTab === 'logs' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Gateway Envelope Record Logs</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Buffer: Tracing Active
                    </span>
                  </div>

                  {/* Clean Graphical Log Stream viewer */}
                  <div className="bg-zinc-50 border border-zinc-200 shadow-inner rounded-2xl p-5 space-y-3.5 max-h-[300px] overflow-y-auto">
                    {logs.map((log) => {
                      const isFailed = log.status === 'failed';
                      return (
                        <div key={log.id} className="py-3 border-b border-zinc-200/50 flex items-start justify-between gap-4 flex-wrap hover:bg-zinc-100/40 px-3.5 rounded-xl transition-all duration-150">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2.5 flex-wrap text-[11.5px] font-semibold text-zinc-600">
                              <span className="text-zinc-400 font-bold font-mono">[{new Date(log.sentAt).toLocaleTimeString()}]</span>
                              <span className="text-purple-700 bg-purple-50 border border-purple-100 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                {log.provider.toUpperCase()}
                              </span>
                              <span className="text-zinc-400 font-medium">dispatched via</span>
                              <span className="text-zinc-800 font-extrabold">{log.channel.toUpperCase()}</span>
                              <span className="text-zinc-400 font-medium">status</span>
                              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border uppercase ${
                                log.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                log.status === 'opened' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-zinc-100 text-zinc-600 border-zinc-200'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                            {isFailed && (
                              <div className="text-red-700 text-[10.5px] font-semibold bg-red-50/70 p-2.5 rounded-xl border border-red-200/60 max-w-xl">
                                Error: {log.errorMessage}
                              </div>
                            )}
                            {log.openedAt && (
                              <div className="text-emerald-700 text-[10.5px] font-semibold bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60 max-w-xl">
                                Recipient interaction tracked: Opened envelope link at {new Date(log.openedAt).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400 bg-zinc-200/50 border border-zinc-200 px-2 py-0.5 rounded font-mono font-bold select-all shrink-0">
                            Token: {log.trackingToken}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Test Trigger Button */}
            <div className="border-t border-zinc-200/50 pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-400 font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                Notification jobs are dispatched asynchronously via Next background workers.
              </span>
              <button
                onClick={handleTestDispatch}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10.5px] px-4.5 py-2 rounded-xl transition-all shadow-md shadow-purple-600/10 flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                Trigger Mock Dispatch Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
