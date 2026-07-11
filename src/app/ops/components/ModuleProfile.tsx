'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  MapPin, 
  Share2, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  X, 
  Globe,
  Mail,
  Phone,
  PhoneCall,
  ExternalLink,
  Shield,
  Briefcase,
  Layers,
  MapPinIcon,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { OwnerProfile, Organization, CorporateAddress, SocialMedia } from '../types';
import { toast } from 'sonner';

interface ModuleProfileProps {
  onProfileUpdate: (profile: OwnerProfile) => void;
}

export default function ModuleProfile({ onProfileUpdate }: ModuleProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  // States
  const [profile, setProfile] = useState<OwnerProfile>({
    ownerId: '8b7f8c2e-4b6c-482e-9d2a-7f6c3821a364',
    firstName: 'Devon',
    lastName: 'Conway',
    designation: 'Managing Director & CTO',
    email: 'devon@nconnect.sh',
    alternateEmail: 'devon.ops@nconnect.sh',
    phone: '+91 98765 43210',
    alternatePhone: '+91 80 4321 0987',
    timezone: 'Asia/Kolkata (GMT+5:30)',
    createdAt: '2025-01-10T12:00:00Z',
    updatedAt: '2026-06-18T10:00:00Z'
  });

  const [org, setOrg] = useState<Organization>({
    companyId: 'd6b8f3e1-7c9b-43d2-bf14-387e6b2195f2',
    companyName: 'NConnect Private Limited',
    category: 'SaaS & Enterprise Communication',
    registrationNo: 'U72900KA2025PTC123456', // CIN
    gstRegistrationNo: '29AABCN1234A1Z5',
    website: 'https://nconnect.sh',
    size: '11-50 Employees',
    companyPhoneNumber: '+91 80 4321 1111',
    companyEmail: 'operations@nconnect.sh',
    companyAlternateEmail: 'legal@nconnect.sh'
  });

  const [address, setAddress] = useState<CorporateAddress>({
    addressLine1: 'NConnect Tech Labs, 4th Floor, Sector 3',
    addressLine2: 'HSR Layout, Outer Ring Road',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    country: 'India',
    pincode: '560102',
    isPrimary: true
  });

  const [social, setSocial] = useState<SocialMedia>({
    facebook: 'https://facebook.com/nconnect.hq',
    twitter: 'https://x.com/nconnect_hq',
    linkedin: 'https://linkedin.com/company/nconnect-hq',
    instagram: 'https://instagram.com/nconnect.io'
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load from LocalStorage + Perform Brand Name Cleanse Migration
  useEffect(() => {
    const cachedProfile = localStorage.getItem('nconnect_ops_owner_profile');
    const cachedOrg = localStorage.getItem('nconnect_ops_org');
    const cachedAddress = localStorage.getItem('nconnect_ops_address');
    const cachedSocial = localStorage.getItem('nconnect_ops_social');

    let profileData = cachedProfile ? JSON.parse(cachedProfile) : null;
    let orgData = cachedOrg ? JSON.parse(cachedOrg) : null;
    let addressData = cachedAddress ? JSON.parse(cachedAddress) : null;
    let socialData = cachedSocial ? JSON.parse(cachedSocial) : null;

    // Core Brand Name Cleanse Check: If outdated brand details are cached, purge them!
    const legacyNames = ['XY Digital Media', 'Socialy Private Limited', 'Socialy.Me'];
    const hasLegacyData = 
      (profileData && (legacyNames.some(name => profileData.email.includes(name.toLowerCase().replace('.', ''))))) ||
      (orgData && (legacyNames.some(name => orgData.companyName.includes(name) || orgData.companyEmail.includes(name.toLowerCase().replace('.', '')))));

    if (hasLegacyData) {
      // Cleanse
      localStorage.removeItem('nconnect_ops_owner_profile');
      localStorage.removeItem('nconnect_ops_org');
      localStorage.removeItem('nconnect_ops_address');
      localStorage.removeItem('nconnect_ops_social');
      profileData = null;
      orgData = null;
      addressData = null;
      socialData = null;
      toast.warning('Outdated cached branding detected and automatically cleansed to NConnect Corporate Defaults.', {
        duration: 4000,
        position: 'top-right'
      });
    }

    if (profileData) {
      setProfile(profileData);
      onProfileUpdate(profileData);
    } else {
      // If no cache, sync the default initial profile name to the header
      onProfileUpdate(profile);
    }
    if (orgData) setOrg(orgData);
    if (addressData) setAddress(addressData);
    if (socialData) setSocial(socialData);
  }, []);

  const triggerCopy = (val: string, fieldName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`, {
      position: 'top-right',
      duration: 1500
    });
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validations
    if (!profile.firstName || !profile.lastName || !profile.email) {
      toast.error('First Name, Last Name, and Email are mandatory fields!');
      return;
    }
    if (!org.companyName || !org.gstRegistrationNo) {
      toast.error('Company Name and GST Registration are required!');
      return;
    }

    // Persist
    localStorage.setItem('nconnect_ops_owner_profile', JSON.stringify(profile));
    localStorage.setItem('nconnect_ops_org', JSON.stringify(org));
    localStorage.setItem('nconnect_ops_address', JSON.stringify(address));
    localStorage.setItem('nconnect_ops_social', JSON.stringify(social));

    onProfileUpdate(profile);
    setIsEditing(false);
    toast.success('System credentials and settings persisted successfully to localStorage!', {
      position: 'top-right'
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title & Edit toggle row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/65 backdrop-blur-md border border-zinc-200/50 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight bg-gradient-to-r from-zinc-900 via-purple-950 to-zinc-900 bg-clip-text text-transparent">
            Personal Profile &amp; Organization Cockpit
          </h1>
          <p className="text-[12px] text-zinc-400 font-semibold tracking-tight mt-1">
            Manage corporate credentials, registered workspace configurations, and compliance identifiers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center justify-center gap-2 text-[12px] font-bold px-5 py-3 rounded-xl transition-all duration-300 border shadow-sm select-none hover:scale-[1.01] active:scale-[0.99] ${
            isEditing 
              ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
              : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white border-transparent'
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel Edit</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit Configuration</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Owner Profile settings */}
          <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100/80 shadow-inner">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">Operator Profile Credential</h3>
                  <p className="text-[11px] font-bold text-zinc-400 tracking-tight">Authority designation details and verification routes.</p>
                </div>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">First Name</label>
                    <input 
                      type="text" 
                      value={profile.firstName} 
                      onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Last Name</label>
                    <input 
                      type="text" 
                      value={profile.lastName} 
                      onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Designation</label>
                    <input 
                      type="text" 
                      value={profile.designation} 
                      onChange={e => setProfile({ ...profile, designation: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Email Address</label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Alternate Email</label>
                    <input 
                      type="email" 
                      value={profile.alternateEmail || ''} 
                      onChange={e => setProfile({ ...profile, alternateEmail: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Phone</label>
                    <input 
                      type="text" 
                      value={profile.phone || ''} 
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Alternate Phone</label>
                    <input 
                      type="text" 
                      value={profile.alternatePhone || ''} 
                      onChange={e => setProfile({ ...profile, alternatePhone: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-[15px] shadow-sm">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-zinc-900 tracking-tight">{profile.firstName} {profile.lastName}</h4>
                        <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5 mt-0.5">
                          <Briefcase className="w-3 h-3 text-zinc-400" />
                          {profile.designation}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-lg border border-purple-200/50 uppercase tracking-widest shadow-inner">
                      <Shield className="w-3.5 h-3.5" />
                      SYS-OWNER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-100">
                    <div className="space-y-1 bg-zinc-50/20 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200/80 transition-all duration-200">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Primary Email
                      </span>
                      <div className="flex items-center justify-between gap-1.5 mt-1">
                        <span className="text-[11.5px] font-bold text-zinc-700 truncate" title={profile.email}>{profile.email}</span>
                        <button 
                          type="button" 
                          onClick={() => triggerCopy(profile.email, 'Primary Email')} 
                          className="flex items-center justify-center p-1.5 rounded-lg bg-white border border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-400 hover:text-zinc-700 active:scale-95 transition-all duration-200"
                          title="Copy to clipboard"
                        >
                          {copiedField === 'Primary Email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 bg-zinc-50/20 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200/80 transition-all duration-200">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Alternate Email
                      </span>
                      <div className="flex items-center justify-between gap-1.5 mt-1">
                        <span className="text-[11.5px] font-bold text-zinc-700 truncate" title={profile.alternateEmail}>{profile.alternateEmail || 'N/A'}</span>
                        {profile.alternateEmail && (
                          <button 
                            type="button" 
                            onClick={() => triggerCopy(profile.alternateEmail || '', 'Alternate Email')} 
                            className="flex items-center justify-center p-1.5 rounded-lg bg-white border border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-400 hover:text-zinc-700 active:scale-95 transition-all duration-200"
                            title="Copy to clipboard"
                          >
                            {copiedField === 'Alternate Email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 bg-zinc-50/20 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200/80 transition-all duration-200">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Phone Mobile
                      </span>
                      <div className="flex items-center justify-between gap-1.5 mt-1">
                        <span className="text-[11.5px] font-bold text-zinc-700 truncate" title={profile.phone}>{profile.phone || 'N/A'}</span>
                        {profile.phone && (
                          <button 
                            type="button" 
                            onClick={() => triggerCopy(profile.phone || '', 'Mobile Phone')} 
                            className="flex items-center justify-center p-1.5 rounded-lg bg-white border border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-400 hover:text-zinc-700 active:scale-95 transition-all duration-200"
                            title="Copy to clipboard"
                          >
                            {copiedField === 'Mobile Phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 bg-zinc-50/20 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200/80 transition-all duration-200">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> Desk Hotline
                      </span>
                      <div className="flex items-center justify-between gap-1.5 mt-1">
                        <span className="text-[11.5px] font-bold text-zinc-700 truncate" title={profile.alternatePhone}>{profile.alternatePhone || 'N/A'}</span>
                        {profile.alternatePhone && (
                          <button 
                            type="button" 
                            onClick={() => triggerCopy(profile.alternatePhone || '', 'Hotline Phone')} 
                            className="flex items-center justify-center p-1.5 rounded-lg bg-white border border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-400 hover:text-zinc-700 active:scale-95 transition-all duration-200"
                            title="Copy to clipboard"
                          >
                            {copiedField === 'Hotline Phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!isEditing && (
              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/45 p-3 rounded-xl border border-zinc-200/30">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> Operators Timezone
                </span>
                <p className="text-[11.5px] font-bold text-purple-950">{profile.timezone}</p>
              </div>
            )}
          </div>

          {/* Card 2: Org details (GST/CIN, categories) */}
          <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 flex items-center justify-center border border-fuchsia-100/80 shadow-inner">
                  <Building2 className="w-5 h-5 text-fuchsia-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">Organization Parameters</h3>
                  <p className="text-[11px] font-bold text-zinc-400 tracking-tight">Registered corporate legal entities and identifiers.</p>
                </div>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Company Legal Name</label>
                    <input 
                      type="text" 
                      value={org.companyName} 
                      onChange={e => setOrg({ ...org, companyName: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Category Sector</label>
                    <input 
                      type="text" 
                      value={org.category} 
                      onChange={e => setOrg({ ...org, category: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Scale Size</label>
                    <input 
                      type="text" 
                      value={org.size} 
                      onChange={e => setOrg({ ...org, size: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Corporate Identity No (CIN)</label>
                    <input 
                      type="text" 
                      value={org.registrationNo} 
                      onChange={e => setOrg({ ...org, registrationNo: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">GSTIN Registry</label>
                    <input 
                      type="text" 
                      value={org.gstRegistrationNo} 
                      onChange={e => setOrg({ ...org, gstRegistrationNo: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Corporate Website</label>
                    <input 
                      type="text" 
                      value={org.website} 
                      onChange={e => setOrg({ ...org, website: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/40">
                    <div>
                      <h4 className="text-[15px] font-black text-zinc-900 tracking-tight">{org.companyName}</h4>
                      <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                        {org.category} &bull; {org.size}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-lg border border-emerald-200/50 uppercase tracking-widest shadow-inner">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      ACTIVE ORG
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-100">
                    <div className="space-y-1 bg-zinc-50/20 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200/80 transition-all duration-200">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">
                        GSTIN Registry
                      </span>
                      <div className="flex items-center justify-between gap-1.5 mt-1">
                        <span className="text-[11.5px] font-mono font-bold text-zinc-700 truncate" title={org.gstRegistrationNo}>{org.gstRegistrationNo}</span>
                        <button 
                          type="button" 
                          onClick={() => triggerCopy(org.gstRegistrationNo, 'GSTIN Registry')} 
                          className="flex items-center justify-center p-1.5 rounded-lg bg-white border border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-400 hover:text-zinc-700 active:scale-95 transition-all duration-200"
                          title="Copy to clipboard"
                        >
                          {copiedField === 'GSTIN Registry' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 bg-zinc-50/20 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200/80 transition-all duration-200">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">
                        CIN Registration
                      </span>
                      <div className="flex items-center justify-between gap-1.5 mt-1">
                        <span className="text-[11.5px] font-mono font-bold text-zinc-700 truncate" title={org.registrationNo}>{org.registrationNo}</span>
                        <button 
                          type="button" 
                          onClick={() => triggerCopy(org.registrationNo, 'CIN Registration')} 
                          className="flex items-center justify-center p-1.5 rounded-lg bg-white border border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-400 hover:text-zinc-700 active:scale-95 transition-all duration-200"
                          title="Copy to clipboard"
                        >
                          {copiedField === 'CIN Registration' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/45 p-3 rounded-xl border border-zinc-200/30">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Corporate Portal URL
                </span>
                <a 
                  href={org.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-purple-600 hover:text-purple-700 hover:underline transition-all bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100"
                >
                  <span>Visit website</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Card 3: Address & Corporate Registered address */}
          <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100/80 shadow-inner">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">Registered Office Address</h3>
                  <p className="text-[11px] font-bold text-zinc-400 tracking-tight">Official physical registered node coordinates and compliance address.</p>
                </div>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Address Line 1</label>
                    <input 
                      type="text" 
                      value={address.addressLine1} 
                      onChange={e => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Address Line 2</label>
                    <input 
                      type="text" 
                      value={address.addressLine2 || ''} 
                      onChange={e => setAddress({ ...address, addressLine2: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">City</label>
                    <input 
                      type="text" 
                      value={address.city} 
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Pincode</label>
                    <input 
                      type="text" 
                      value={address.pincode} 
                      onChange={e => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">State</label>
                    <input 
                      type="text" 
                      value={address.state} 
                      onChange={e => setAddress({ ...address, state: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Country</label>
                    <input 
                      type="text" 
                      value={address.country} 
                      onChange={e => setAddress({ ...address, country: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-zinc-50/30 p-4 rounded-xl border border-zinc-200/40 font-semibold text-zinc-700 text-[12px]">
                  <div className="flex items-start gap-2.5">
                    <MapPinIcon className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <p className="text-zinc-950 font-extrabold">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-zinc-500 font-medium">{address.addressLine2}</p>}
                      <p className="text-zinc-600">{address.city}, {address.district || address.city}</p>
                      <p className="text-zinc-600">{address.state} &bull; {address.pincode}</p>
                      <p className="text-zinc-400 text-[11px] uppercase tracking-wider font-extrabold mt-1">{address.country}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/45 p-3 rounded-xl border border-zinc-200/30">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  Designation Node
                </span>
                <span className="text-[10.5px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg shadow-sm">
                  PRIMARY HEADQUARTERS
                </span>
              </div>
            )}
          </div>

          {/* Card 4: Corporate social media linkages */}
          <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-200/80 shadow-inner">
                  <Share2 className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">Corporate Connections</h3>
                  <p className="text-[11px] font-bold text-zinc-400 tracking-tight">Verified social coordinates and corporate handles.</p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">LinkedIn URL</label>
                    <input 
                      type="text" 
                      value={social.linkedin || ''} 
                      onChange={e => setSocial({ ...social, linkedin: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Twitter / X URL</label>
                    <input 
                      type="text" 
                      value={social.twitter || ''} 
                      onChange={e => setSocial({ ...social, twitter: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Instagram URL</label>
                    <input 
                      type="text" 
                      value={social.instagram || ''} 
                      onChange={e => setSocial({ ...social, instagram: e.target.value })}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 rounded-xl px-3 py-2.5 font-semibold text-zinc-800 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/20 border border-zinc-100 hover:border-zinc-200/50 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></span>
                      <span className="text-[12px] font-bold text-zinc-700">LinkedIn Corporation</span>
                    </div>
                    {social.linkedin ? (
                      <a 
                        href={social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-black bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800 border border-zinc-200/50 px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        <span>VISIT LINK</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-zinc-400">NOT CONNECTED</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/20 border border-zinc-100 hover:border-zinc-200/50 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 shadow-[0_0_8px_rgba(9,9,11,0.4)]"></span>
                      <span className="text-[12px] font-bold text-zinc-700">X Platform (Twitter)</span>
                    </div>
                    {social.twitter ? (
                      <a 
                        href={social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-black bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800 border border-zinc-200/50 px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        <span>VISIT LINK</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-zinc-400">NOT CONNECTED</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/20 border border-zinc-100 hover:border-zinc-200/50 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 shadow-[0_0_8px_rgba(219,39,119,0.4)]"></span>
                      <span className="text-[12px] font-bold text-zinc-700">Instagram Network</span>
                    </div>
                    {social.instagram ? (
                      <a 
                        href={social.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-black bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800 border border-zinc-200/50 px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        <span>VISIT LINK</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-zinc-400">NOT CONNECTED</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/45 p-3 rounded-xl border border-zinc-200/30">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  Compliance Check
                </span>
                <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg shadow-sm">
                  100% SECURED AND ALIGNED
                </span>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2.5 text-[13px] font-extrabold px-7 py-3.5 rounded-xl transition-all duration-300 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white border-transparent shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-98"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Persist Credentials &amp; Address</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
