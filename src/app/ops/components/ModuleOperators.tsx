'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  UserMinus, 
  Mail, 
  Key, 
  Lock, 
  AlertTriangle, 
  Check, 
  Eye, 
  EyeOff, 
  Copy,
  Info,
  ShieldAlert
} from 'lucide-react';
import { PlatformOperator } from '../types';
import { toast } from 'sonner';

interface ModuleOperatorsProps {
  activeOperator: PlatformOperator;
}

export default function ModuleOperators({ activeOperator }: ModuleOperatorsProps) {
  // Team operators list state
  const [operators, setOperators] = useState<PlatformOperator[]>([
    {
      id: 'op-1',
      name: 'Naman Dev',
      email: 'naman@nconnect.com',
      accessLevel: 'L3 - Full',
      status: 'Active',
      privilegeToken: 'NC_PRIV_TOKEN_L3_9240',
      isSelf: true
    },
    {
      id: 'op-2',
      name: 'Aditya Sen',
      email: 'aditya@nconnect.com',
      accessLevel: 'L2 - Console',
      status: 'Active',
      privilegeToken: 'NC_PRIV_TOKEN_L2_4021'
    },
    {
      id: 'op-3',
      name: 'Zoya Khan',
      email: 'zoya.k@nconnect.com',
      accessLevel: 'L1 - Help Desk',
      status: 'Offline',
      privilegeToken: 'NC_PRIV_TOKEN_L1_1259'
    }
  ]);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAccessLevel, setFormAccessLevel] = useState<'L3 - Full' | 'L2 - Console' | 'L1 - Help Desk'>('L1 - Help Desk');

  // Interactive security lock simulation state
  const [showInterlockError, setShowInterlockError] = useState<boolean>(false);
  const [interlockAttemptedName, setInterlockAttemptedName] = useState<string>('');
  const [revealedTokenIds, setRevealedTokenIds] = useState<Record<string, boolean>>({});

  // Sync / Load cache
  useEffect(() => {
    const cached = localStorage.getItem('nconnect_ops_operators');
    if (cached) {
      try {
        const parsed: PlatformOperator[] = JSON.parse(cached);
        // Ensure activeOperator is always present and marked as self
        const hasSelf = parsed.some(op => op.email === activeOperator.email);
        if (!hasSelf) {
          const selfOp: PlatformOperator = {
            id: activeOperator.id,
            name: activeOperator.name,
            email: activeOperator.email,
            accessLevel: activeOperator.accessLevel,
            status: activeOperator.status,
            privilegeToken: activeOperator.privilegeToken,
            isSelf: true
          };
          parsed.unshift(selfOp);
        } else {
          // Adjust isSelf flags
          parsed.forEach(op => {
            op.isSelf = op.email === activeOperator.email;
          });
        }
        setOperators(parsed);
      } catch (e) {
        console.error('Error parsing operator cache', e);
      }
    } else {
      // Sync initial set
      const initialWithSelf = operators.map(op => ({
        ...op,
        isSelf: op.email === activeOperator.email || op.id === activeOperator.id
      }));
      setOperators(initialWithSelf);
      localStorage.setItem('nconnect_ops_operators', JSON.stringify(initialWithSelf));
    }
  }, [activeOperator]);

  const saveOperatorsToCache = (updatedList: PlatformOperator[]) => {
    setOperators(updatedList);
    localStorage.setItem('nconnect_ops_operators', JSON.stringify(updatedList));
  };

  // Submit Handler
  const handleInviteOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      toast.error('All registration fields are mandatory!');
      return;
    }

    if (!formEmail.endsWith('@nconnect.com') && !formEmail.endsWith('.com')) {
      toast.error('Operator email must be a valid work credentials address!');
      return;
    }

    // Duplicate Check
    if (operators.some(op => op.email.toLowerCase() === formEmail.toLowerCase())) {
      toast.error(`Operator with email ${formEmail} already holds a privilege credential!`);
      return;
    }

    const uniqueId = 'op-' + Math.random().toString(36).substring(2, 9);
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const levelCode = formAccessLevel === 'L3 - Full' ? 'L3' : formAccessLevel === 'L2 - Console' ? 'L2' : 'L1';
    const mockToken = `NC_PRIV_TOKEN_${levelCode}_${suffix}`;

    const newOperator: PlatformOperator = {
      id: uniqueId,
      name: formName,
      email: formEmail.toLowerCase(),
      accessLevel: formAccessLevel,
      status: 'Offline',
      privilegeToken: mockToken
    };

    const updated = [...operators, newOperator];
    saveOperatorsToCache(updated);
    toast.success(`Access invitation dispatched to ${formName}! Profile initialized.`);

    // Reset Form
    setFormName('');
    setFormEmail('');
    setFormAccessLevel('L1 - Help Desk');
  };

  // Revoke Credential with Self-Revocation Interlock Safety Guard
  const handleRevokeOperator = (targetId: string) => {
    const targetOperator = operators.find(op => op.id === targetId);
    if (!targetOperator) return;

    // SELF-REVOCATION INTERLOCK INTERCEPTION
    const isSelfMatch = targetOperator.isSelf || 
                        targetOperator.id === activeOperator.id || 
                        targetOperator.email.toLowerCase() === activeOperator.email.toLowerCase();

    if (isSelfMatch) {
      // Trigger Interlock Security block state
      setInterlockAttemptedName(targetOperator.name);
      setShowInterlockError(true);
      
      toast.error('[ACCESS DENIED] Self-Revocation Interlock Active!', {
        description: 'An active platform operator cannot terminate their own profile.',
        duration: 5000
      });
      return;
    }

    // Standard Revocation Flow
    const updated = operators.filter(op => op.id !== targetId);
    saveOperatorsToCache(updated);
    toast.success(`Revoked all administrative access credentials for "${targetOperator.name}".`);
  };

  const handleToggleStatus = (targetId: string) => {
    const updated = operators.map(op => {
      if (op.id === targetId) {
        const nextStatus = op.status === 'Active' ? 'Offline' : 'Active';
        toast.success(`Operator ${op.name} is now ${nextStatus}`);
        return { ...op, status: nextStatus };
      }
      return op;
    });
    saveOperatorsToCache(updated);
  };

  // Toggle visible token characters
  const toggleTokenVisibility = (id: string) => {
    setRevealedTokenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy token to clipboard
  const copyTokenToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Privilege Token copied to administrator clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Platform Operators & Security Roles</h1>
        <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">Monitor active operators, manage secure credentials, and grant privilege levels. Built with absolute self-revocation safety interlocks.</p>
      </div>

      {/* Self-Revocation Interlock Banner Warning */}
      {showInterlockError && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start gap-4 animate-fadeIn">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Security Interlock: Self-Revocation Terminated
            </h3>
            <p className="text-xs font-semibold text-amber-800 leading-relaxed max-w-2xl">
              Platform security rules enforce a hard fail-safe: Active Session Administrator <strong className="font-extrabold text-amber-950 underline">({interlockAttemptedName})</strong> is barred from self-deletion. This prevents accidental cockpit lockouts. To revoke this credential, log in from a secondary L3 root operator account.
            </p>
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setShowInterlockError(false)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-[10px] font-bold tracking-tight rounded-lg transition-all cursor-pointer"
              >
                Acknowledge Security Alarm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side: Create Operator (5cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-md rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-800 tracking-tight">Provision Platform Operator</h2>
                <p className="text-[10px] text-zinc-400 font-medium">Issue secure privilege tokens & dashboard authorization</p>
              </div>
            </div>

            <form onSubmit={handleInviteOperator} className="space-y-4">
              {/* Operator Name */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Operator Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full text-xs font-bold bg-zinc-50/50 border border-zinc-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-zinc-800 placeholder:text-zinc-300"
                />
              </div>

              {/* Operator Email */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Corporate Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="r.sharma@nconnect.com"
                    className="w-full text-xs font-bold bg-zinc-50/50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-zinc-800 placeholder:text-zinc-300"
                  />
                </div>
              </div>

              {/* Access Privilege badge selector */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Administrative Privilege Level</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formAccessLevel === 'L3 - Full'
                      ? 'bg-purple-50/60 border-purple-200'
                      : 'bg-zinc-50/40 border-zinc-100 hover:bg-zinc-100/40'
                  }`}>
                    <input
                      type="radio"
                      name="privilegeLevel"
                      checked={formAccessLevel === 'L3 - Full'}
                      onChange={() => setFormAccessLevel('L3 - Full')}
                      className="text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-800">L3 - Full SuperAdmin</span>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-extrabold uppercase font-mono">Root Control</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Full capabilities: credentials, plan editing, coupon sandbox, tenant purges.</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formAccessLevel === 'L2 - Console'
                      ? 'bg-purple-50/60 border-purple-200'
                      : 'bg-zinc-50/40 border-zinc-100 hover:bg-zinc-100/40'
                  }`}>
                    <input
                      type="radio"
                      name="privilegeLevel"
                      checked={formAccessLevel === 'L2 - Console'}
                      onChange={() => setFormAccessLevel('L2 - Console')}
                      className="text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-800">L2 - Console Operator</span>
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-extrabold uppercase font-mono">Operations</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Read-write control of tenants and billing. Barred from SuperAdmin invitation updates.</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formAccessLevel === 'L1 - Help Desk'
                      ? 'bg-purple-50/60 border-purple-200'
                      : 'bg-zinc-50/40 border-zinc-100 hover:bg-zinc-100/40'
                  }`}>
                    <input
                      type="radio"
                      name="privilegeLevel"
                      checked={formAccessLevel === 'L1 - Help Desk'}
                      onChange={() => setFormAccessLevel('L1 - Help Desk')}
                      className="text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-800">L1 - Support Specialist</span>
                        <span className="text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-extrabold uppercase font-mono">Help Desk</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Read-only profile. Access to view accounts, domains, and check health logs.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Issue privilege Certificate
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Roster and Audits (7cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-800 tracking-tight">Privileged Operator Directory</h2>
                  <p className="text-[10px] text-zinc-400 font-medium">L3 root SuperAdmins down to active support operators</p>
                </div>
              </div>
              <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full font-mono font-bold">
                {operators.length} REGISTERED
              </span>
            </div>

            {/* Roster list */}
            <div className="space-y-3">
              {operators.map((op) => {
                const isTokenRevealed = !!revealedTokenIds[op.id];
                const activeIsSelf = op.isSelf || op.id === activeOperator.id;

                let levelBadgeColor = 'bg-zinc-100 text-zinc-600 border-zinc-200';
                if (op.accessLevel.includes('L3')) {
                  levelBadgeColor = 'bg-rose-50 text-rose-700 border-rose-100';
                } else if (op.accessLevel.includes('L2')) {
                  levelBadgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                }

                return (
                  <div 
                    key={op.id}
                    className={`p-4 rounded-xl border transition-all ${
                      activeIsSelf 
                        ? 'bg-gradient-to-r from-purple-500/5 via-fuchsia-500/5 to-white border-purple-200/50 shadow-sm'
                        : 'bg-white border-zinc-200/60 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Circle badge with first letter */}
                        <div className="relative shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shadow-sm ${
                            activeIsSelf 
                              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-white'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}>
                            {op.name.charAt(0)}
                          </div>
                          <button
                            onClick={() => handleToggleStatus(op.id)}
                            className="absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full ring-2 ring-white cursor-pointer"
                            title={`Toggle Status (current: ${op.status})`}
                          >
                            <span className={`relative flex h-full w-full rounded-full ${
                              op.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-300'
                            }`}>
                              {op.status === 'Active' && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              )}
                            </span>
                          </button>
                        </div>

                        {/* Text */}
                        <div className="space-y-0.5">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <h3 className="text-xs font-extrabold text-zinc-800">{op.name}</h3>
                            {activeIsSelf && (
                              <span className="text-[8px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold uppercase font-mono">
                                ACTIVE SESSION (YOU)
                              </span>
                            )}
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${levelBadgeColor}`}>
                              {op.accessLevel}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-semibold">{op.email}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <button
                        onClick={() => handleRevokeOperator(op.id)}
                        className={`sm:self-center flex items-center justify-center gap-1 px-3 py-1.5 border rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                          activeIsSelf 
                            ? 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200' 
                            : 'bg-red-50 hover:bg-red-100 active:scale-95 border-red-200 text-red-700'
                        }`}
                        title={activeIsSelf ? "Protected session operator account" : "Revoke Privilege"}
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Revoke</span>
                      </button>
                    </div>

                    {/* Secret Token drawer inside card */}
                    <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-zinc-400" />
                        <span className="text-[9px] font-mono font-bold text-zinc-400 tracking-wider">SECURE SHIELD SIGNATURE:</span>
                        <code className="text-[10px] font-mono font-bold text-zinc-700 select-all">
                          {isTokenRevealed ? op.privilegeToken : '••••••••••••••••••••'}
                        </code>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleTokenVisibility(op.id)}
                          className="p-1 text-zinc-400 hover:text-zinc-600 bg-white border border-zinc-200 rounded transition-all cursor-pointer"
                          title={isTokenRevealed ? "Hide token" : "Reveal token"}
                        >
                          {isTokenRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => copyTokenToClipboard(op.privilegeToken)}
                          className="p-1 text-zinc-400 hover:text-zinc-600 bg-white border border-zinc-200 rounded transition-all cursor-pointer"
                          title="Copy token to administrator clipboard"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit Log Note */}
            <div className="mt-4 bg-indigo-500/5 rounded-xl border border-indigo-100 p-3.5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                <span className="text-indigo-950 font-bold block mb-0.5 uppercase tracking-wide">Privilege Auditing Policy</span>
                Every token generation is cryptographically bound to the administrator account issuing it and stored in the localized keystore ledger. Session revocation takes effect immediately across all connected socket sessions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
