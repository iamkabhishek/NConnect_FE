'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  RotateCcw, 
  Trash2, 
  Check, 
  Clock, 
  BookOpen, 
  Save, 
  Eye, 
  FileCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Interfaces mapping directly to PDF DB schemas
interface Document {
  id: string;
  workspaceId: string;
  slug: string;
  title: string;
  type: 'policy' | 'faq' | 'toc';
  liveVersionId: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentVersion {
  id: string;
  documentId: string;
  title: string;
  content: string;
  version: number;
  status: 'draft' | 'live' | 'archived';
  changeSummary: string;
  createdBy: string;
  createdAt: string;
}

export default function ModuleCMS() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'policy' | 'faq' | 'toc'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');
  const [isEditing, setIsLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editorTitle, setEditorTitle] = useState('');
  const [editorChangeSummary, setEditorChangeSummary] = useState('');

  // Mock DB - documents table
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc-1', workspaceId: 'ws-system', slug: 'privacy-policy', title: 'Privacy Policy', type: 'policy', liveVersionId: 'ver-1-2', createdAt: '2025-01-10T12:00:00Z', updatedAt: '2026-06-10T15:30:00Z' },
    { id: 'doc-2', workspaceId: 'ws-system', slug: 'terms-of-service', title: 'Terms of Service', type: 'toc', liveVersionId: 'ver-2-1', createdAt: '2025-01-12T09:00:00Z', updatedAt: '2025-01-12T09:00:00Z' },
    { id: 'doc-3', workspaceId: 'ws-system', slug: 'refund-policy', title: 'Refund Policy & SLA', type: 'policy', liveVersionId: 'ver-3-1', createdAt: '2025-03-20T10:15:00Z', updatedAt: '2025-03-20T10:15:00Z' },
    { id: 'doc-4', workspaceId: 'ws-system', slug: 'onboarding-faq', title: 'Onboarding General FAQ', type: 'faq', liveVersionId: 'ver-4-2', createdAt: '2025-05-01T14:20:00Z', updatedAt: '2026-02-15T11:45:00Z' }
  ]);

  // Mock DB - document_versions table
  const [versions, setVersions] = useState<DocumentVersion[]>([
    // Privacy Policy versions
    { id: 'ver-1-1', documentId: 'doc-1', title: 'Privacy Policy v1.0', content: `# Privacy Policy\n\nYour privacy is important to us. This policy describes how we collect, store, and distribute your data.\n\n### 1. Data Collection\nWe collect basic account information including emails and name metadata.`, version: 1, status: 'archived', changeSummary: 'Initial boilerplate policy publication.', createdBy: 'Naman Dev', createdAt: '2025-01-10T12:00:00Z' },
    { id: 'ver-1-2', documentId: 'doc-1', title: 'Privacy Policy v1.1', content: `# Privacy Policy\n\nYour privacy is important to us. This policy describes how we collect, store, and distribute your data under Socially.me.\n\n### 1. Data Collection\nWe collect account information including email and billing transactions.\n\n### 2. GDPR Compliance\nIn accordance with GDPR, you possess absolute deletion and soft-delete entitlements over your user profiles.`, version: 2, status: 'live', changeSummary: 'Amended GDPR compliance clauses and explicit soft-delete descriptions.', createdBy: 'Naman Dev', createdAt: '2026-06-10T15:30:00Z' },
    
    // Terms of Service versions
    { id: 'ver-2-1', documentId: 'doc-2', title: 'Terms of Service v1.0', content: `# Terms of Service\n\nWelcome to Socially.me! By accessing our workspaces, you agree to these terms.\n\n### 1. Account Creation\nEvery registered workspace is bound to a platform operator review prior to access activation.`, version: 1, status: 'live', changeSummary: 'Initial production rollout.', createdBy: 'Naman Dev', createdAt: '2025-01-12T09:00:00Z' },
    
    // Refund Policy versions
    { id: 'ver-3-1', documentId: 'doc-3', title: 'Refund Policy v1.0', content: `# Refund Policy & SLA\n\nWe provide a 14-day trial period gating for all commercial plans.\n\n### 1. Cancellations\nNo grace period refunds are permitted outside of verified system outages.`, version: 1, status: 'live', changeSummary: 'Standard plan trial descriptions added.', createdBy: 'Peter Parker', createdAt: '2025-03-20T10:15:00Z' },

    // Onboarding FAQ versions
    { id: 'ver-4-1', documentId: 'doc-4', title: 'Onboarding FAQ v1.0', content: `# Onboarding FAQ\n\n**Q: How long does approval take?**\nAns: Approvals typically require less than 24 hours under active operations review.`, version: 1, status: 'archived', changeSummary: 'Initial drafting.', createdBy: 'Peter Parker', createdAt: '2025-05-01T14:20:00Z' },
    { id: 'ver-4-2', documentId: 'doc-4', title: 'Onboarding FAQ v1.1', content: `# Onboarding FAQ\n\n**Q: How long does approval take?**\nAns: Approvals typically require less than 24 hours under active operations review.\n\n**Q: Do I need a credit card during onboarding?**\nAns: No, trial accounts do not require card authorization upfront.`, version: 2, status: 'live', changeSummary: 'Added card validation FAQ under billing requirements update.', createdBy: 'Peter Parker', createdAt: '2026-02-15T11:45:00Z' }
  ]);

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];
  const selectedDocVersions = versions.filter(v => v.documentId === selectedDocId).sort((a, b) => b.version - a.version);
  const liveVersion = selectedDocVersions.find(v => v.status === 'live') || selectedDocVersions[0];

  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    setIsLoading(false);
  };

  const handleStartEdit = () => {
    setEditorTitle(`${selectedDoc.title} v${selectedDocVersions.length + 1}.0 Draft`);
    setEditorContent(liveVersion.content);
    setEditorChangeSummary('');
    setIsLoading(true);
  };

  const handlePublishDraft = () => {
    if (!editorContent.trim() || !editorChangeSummary.trim()) {
      toast.error('Content and change summary are required to publish!');
      return;
    }

    const nextVerNo = selectedDocVersions.length + 1;
    const newVerId = `ver-${selectedDoc.id.replace('doc-', '')}-${nextVerNo}`;
    
    const newVersion: DocumentVersion = {
      id: newVerId,
      documentId: selectedDoc.id,
      title: editorTitle,
      content: editorContent,
      version: nextVerNo,
      status: 'live',
      changeSummary: editorChangeSummary,
      createdBy: 'Naman Dev',
      createdAt: new Date().toISOString()
    };

    // Update old live version of this doc to archived
    setVersions(prev => prev.map(v => {
      if (v.documentId === selectedDoc.id && v.status === 'live') {
        return { ...v, status: 'archived' };
      }
      return v;
    }).concat(newVersion));

    // Update parent doc live version reference
    setDocuments(prev => prev.map(d => {
      if (d.id === selectedDoc.id) {
        return { ...d, liveVersionId: newVerId, updatedAt: new Date().toISOString() };
      }
      return d;
    }));

    setIsLoading(false);
    toast.success(`Published ${selectedDoc.title} Version ${nextVerNo} successfully!`);
  };

  const handleRollback = (ver: DocumentVersion) => {
    if (ver.status === 'live') {
      toast.info('This version is already live!');
      return;
    }

    // Set old live version of this doc to archived
    setVersions(prev => prev.map(v => {
      if (v.documentId === selectedDoc.id) {
        if (v.id === ver.id) return { ...v, status: 'live' };
        if (v.status === 'live') return { ...v, status: 'archived' };
      }
      return v;
    }));

    // Update parent doc reference
    setDocuments(prev => prev.map(d => {
      if (d.id === selectedDoc.id) {
        return { ...d, liveVersionId: ver.id, updatedAt: new Date().toISOString() };
      }
      return d;
    }));

    toast.success(`Rolled back ${selectedDoc.title} to Version ${ver.version} successfully!`);
  };

  const filteredDocs = documents.filter(d => {
    const matchesCat = selectedCategory === 'all' || d.type === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          CMS Policy Management
        </h1>
        <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">
          Track policies, FAQs, and terms versions with rollback capabilities. Fully synchronized with documents & document_versions schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left column: Directory ledger */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search slugs or titles..."
                className="w-full bg-zinc-50 border border-zinc-200 text-xs font-semibold px-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'policy', 'faq', 'toc'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'bg-purple-50 border-purple-200 text-purple-700'
                      : 'bg-zinc-50/50 border-zinc-200/50 text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {cat === 'toc' ? 'Terms (TOC)' : cat}
                </button>
              ))}
            </div>

            {/* Documents List */}
            <div className="space-y-2 pt-2 max-h-[380px] overflow-y-auto">
              {filteredDocs.map(doc => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-50/40 to-indigo-50/10 border-purple-200/60 shadow-sm'
                        : 'bg-white border-zinc-200/40 hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-100/60 text-purple-600' : 'bg-zinc-100 text-zinc-400'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-zinc-900">{doc.title}</h4>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold">/{doc.slug}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/40">
                      {doc.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Document Detail pane & Editor */}
        <div className="xl:col-span-8">
          {isEditing ? (
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[500px] space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                    <h3 className="text-sm font-extrabold text-zinc-900">Draft Composer</h3>
                  </div>
                  <button
                    onClick={() => setIsLoading(false)}
                    className="text-[11px] font-bold text-zinc-400 hover:text-zinc-600"
                  >
                    Cancel Draft
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Draft version Title</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-50 border border-zinc-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Change summary (Required to publish)</label>
                    <input
                      type="text"
                      placeholder="e.g. Added section 3 relating to refund grace periods"
                      className="w-full bg-zinc-50 border border-zinc-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
                      value={editorChangeSummary}
                      onChange={(e) => setEditorChangeSummary(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Document Rich Text (Markdown format)</label>
                  <textarea
                    rows={12}
                    className="w-full bg-zinc-50/50 border border-zinc-200 text-xs font-mono p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handlePublishDraft}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] px-6 py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/10 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Publish Draft v{selectedDocVersions.length + 1}.0
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm min-h-[500px] flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* File Metadata */}
                <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4">
                  <div>
                    <h2 className="text-[15px] font-extrabold text-zinc-950 flex items-center gap-2">
                      {selectedDoc.title}
                      <span className="text-[9px] font-mono font-bold bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded text-purple-700">
                        Version {liveVersion.version}.0 Live
                      </span>
                    </h2>
                    <span className="text-[11px] font-mono font-semibold text-zinc-400">
                      ID: {selectedDoc.id} • Slug: /{selectedDoc.slug}
                    </span>
                  </div>
                  <button
                    onClick={handleStartEdit}
                    className="border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-[11px] px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5 text-zinc-500" />
                    Create New Version Draft
                  </button>
                </div>

                {/* Sub-pane split: Text Preview & Versions history */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left sub-pane: Versions History (5 columns) */}
                  <div className="lg:col-span-5 space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Document Version History
                    </h4>
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {selectedDocVersions.map((v) => {
                        const isLive = v.status === 'live';
                        return (
                          <div
                            key={v.id}
                            className={`p-3 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                              isLive
                                ? 'bg-purple-50/10 border-purple-200/50 ring-2 ring-purple-600/5'
                                : 'bg-zinc-50/50 border-zinc-200/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-zinc-900">v{v.version}.0 {v.status === 'live' ? 'Live' : 'Archived'}</span>
                              <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                isLive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
                                  : 'bg-zinc-100 text-zinc-500 border border-zinc-200/30'
                              }`}>
                                {v.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-semibold italic">"{v.changeSummary}"</p>
                            <div className="flex items-center justify-between pt-1 border-t border-zinc-200/30">
                              <span className="text-[9px] text-zinc-400 font-bold font-mono">By: {v.createdBy}</span>
                              {!isLive && (
                                <button
                                  onClick={() => handleRollback(v)}
                                  className="text-[9px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Rollback To v{v.version}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right sub-pane: Markdown Content Preview (7 columns) */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      Live Markdown preview
                    </h4>
                    <div className="bg-zinc-50/50 border border-zinc-200/50 rounded-xl p-4 h-[300px] overflow-y-auto text-xs font-semibold prose prose-zinc max-w-none text-zinc-700">
                      {liveVersion.content.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={idx} className="text-lg font-bold text-zinc-950 mt-1 mb-2">{line.replace('# ', '')}</h1>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={idx} className="text-sm font-extrabold text-zinc-900 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('**')) {
                          return <p key={idx} className="text-zinc-800 font-bold mb-2">{line}</p>;
                        }
                        return <p key={idx} className="mb-2 text-zinc-600 leading-relaxed font-semibold">{line}</p>;
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Support Card */}
              <div className="bg-zinc-50/30 border border-zinc-200/30 p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-mono text-zinc-400 font-bold">
                  All policy modifications write directly into Postgres and auto-trigger CDN caching invalidation for downstream workspace portals.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
