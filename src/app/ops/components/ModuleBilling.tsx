'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Search, 
  Info, 
  Check, 
  ChevronRight, 
  Sliders, 
  Activity,
  Zap,
  Save,
  Tag
} from 'lucide-react';
import { FeatureUnit, SaaSPackage } from '../types';
import { toast } from 'sonner';

const getCleanFeatureName = (code: string, fallbackName: string) => {
  switch (code) {
    case 'WORKSPACE':
      return 'Workspaces';
    case 'WORKSPACE_USER':
      return 'User Seats';
    case 'STORAGE_GB':
      return 'GB Cloud Storage';
    default:
      return fallbackName
        .replace(/^Extra\s+/i, '')
        .replace(/\s+Limit$/i, '')
        .replace(/\s+Seat$/i, '')
        .trim();
  }
};

export default function ModuleBilling() {
  const [activeSubTab, setActiveSubTab] = useState<'features' | 'plans'>('features');

  // Sub-Tab 1: Feature CRUD States
  const [features, setFeatures] = useState<FeatureUnit[]>([
    { id: 'f-ws', name: 'Extra Workspace Limit', code: 'WORKSPACE', category: 'Workspaces', basePrice: 500, promoPrice: 500, isAddon: true, discountCap: 0 },
    { id: 'f-user', name: 'Extra Workspace User Seat', code: 'WORKSPACE_USER', category: 'Users', basePrice: 100, promoPrice: 100, isAddon: true, discountCap: 0 },
    { id: 'f-stg', name: 'Extra S3 Storage (1GB)', code: 'STORAGE_GB', category: 'Storage', basePrice: 100, promoPrice: 100, isAddon: true, discountCap: 0 },
  ]);

  const [featureForm, setFeatureForm] = useState<Omit<FeatureUnit, 'id'>>({
    name: '',
    code: '',
    category: 'Workspaces',
    basePrice: 500,
    promoPrice: 500,
    isAddon: true,
    discountCap: 0
  });

  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [featureSearch, setFeatureSearch] = useState('');
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState<string>('All');

  // Sub-Tab 2: Plan Creator States
  const [packages, setPackages] = useState<SaaSPackage[]>([
    {
      id: 'p-standard',
      name: 'Standard Plan',
      billingCycle: 'monthly',
      trialDays: 14,
      gracePeriodDays: 5,
      features: [
        { featureCode: 'WORKSPACE', quantity: 2 },
        { featureCode: 'WORKSPACE_USER', quantity: 5 },
        { featureCode: 'STORAGE_GB', quantity: 2 }
      ],
      baseMonthlyPrice: 1500,
      promoMonthlyPrice: 1500,
      yearlyPrice: 15300, // (1500 * 12) * 0.85
      isPublished: true
    },
    {
      id: 'p-pro',
      name: 'Pro Plan',
      billingCycle: 'monthly',
      trialDays: 30,
      gracePeriodDays: 7,
      features: [
        { featureCode: 'WORKSPACE', quantity: 5 },
        { featureCode: 'WORKSPACE_USER', quantity: 10 },
        { featureCode: 'STORAGE_GB', quantity: 5 }
      ],
      baseMonthlyPrice: 4000,
      promoMonthlyPrice: 4000,
      yearlyPrice: 40800, // (4000 * 12) * 0.85
      isPublished: true
    },
    {
      id: 'p-business',
      name: 'Business Plan',
      billingCycle: 'monthly',
      trialDays: 30,
      gracePeriodDays: 10,
      features: [
        { featureCode: 'WORKSPACE', quantity: 10 },
        { featureCode: 'WORKSPACE_USER', quantity: 20 },
        { featureCode: 'STORAGE_GB', quantity: 10 }
      ],
      baseMonthlyPrice: 8000,
      promoMonthlyPrice: 8000,
      yearlyPrice: 81600, // (8000 * 12) * 0.85
      isPublished: true
    }
  ]);

  const [packageForm, setPackageForm] = useState<{
    name: string;
    billingCycle: 'monthly' | 'yearly';
    trialDays: number;
    gracePeriodDays: number;
    features: Record<string, { checked: boolean; quantity: number }>;
  }>({
    name: '',
    billingCycle: 'monthly',
    trialDays: 14,
    gracePeriodDays: 5,
    features: {
      'WORKSPACE': { checked: true, quantity: 2 },
      'WORKSPACE_USER': { checked: true, quantity: 5 },
      'STORAGE_GB': { checked: true, quantity: 2 }
    }
  });

  // Monthly/Yearly preview state for package catalog (Right side)
  const [catalogBillingToggle, setCatalogBillingToggle] = useState<'monthly' | 'yearly'>('monthly');

  // Load from local storage on mount (with forced initial alignments)
  useEffect(() => {
    const cachedFeatures = localStorage.getItem('nconnect_ops_billing_features');
    const cachedPackages = localStorage.getItem('nconnect_ops_billing_packages');
    if (cachedFeatures) {
      const parsed = JSON.parse(cachedFeatures);
      if (parsed.some((f: any) => f.code === 'WORKSPACE')) {
        setFeatures(parsed);
      } else {
        localStorage.setItem('nconnect_ops_billing_features', JSON.stringify(features));
      }
    } else {
      localStorage.setItem('nconnect_ops_billing_features', JSON.stringify(features));
    }
    
    if (cachedPackages) {
      const parsed = JSON.parse(cachedPackages);
      if (parsed.some((p: any) => p.id === 'p-standard' || p.id === 'p-pro')) {
        setPackages(parsed);
      } else {
        localStorage.setItem('nconnect_ops_billing_packages', JSON.stringify(packages));
      }
    } else {
      localStorage.setItem('nconnect_ops_billing_packages', JSON.stringify(packages));
    }
  }, []);

  // Sync to local storage
  const saveFeaturesToCache = (updatedList: FeatureUnit[]) => {
    setFeatures(updatedList);
    localStorage.setItem('nconnect_ops_billing_features', JSON.stringify(updatedList));
  };

  const savePackagesToCache = (updatedList: SaaSPackage[]) => {
    setPackages(updatedList);
    localStorage.setItem('nconnect_ops_billing_packages', JSON.stringify(updatedList));
  };

  // Feature Unit CRUD Handlers
  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureForm.name || !featureForm.code) {
      toast.error('Feature Name and Feature Code are mandatory!');
      return;
    }

    // Format Code to uppercase & alphanumeric with underscores
    const formattedCode = featureForm.code.toUpperCase().replace(/[^A-Z0-9_]/g, '_');

    if (selectedFeatureId) {
      // Edit
      const updated = features.map(f => f.id === selectedFeatureId ? { ...f, ...featureForm, code: formattedCode } : f);
      saveFeaturesToCache(updated);
      setSelectedFeatureId(null);
      toast.success('Feature unit updated successfully!');
    } else {
      // Create
      if (features.some(f => f.code === formattedCode)) {
        toast.error(`Feature code ${formattedCode} already registered!`);
        return;
      }
      const newFeature: FeatureUnit = {
        id: 'f-' + Math.random().toString(36).substring(2, 9),
        ...featureForm,
        code: formattedCode
      };
      saveFeaturesToCache([...features, newFeature]);
      toast.success('New atomic feature unit successfully registered!');
    }

    // Reset Form
    setFeatureForm({
      name: '',
      code: '',
      category: 'Users',
      basePrice: 10,
      promoPrice: 8,
      isAddon: false,
      discountCap: 10
    });
  };

  const handleSelectFeatureToEdit = (f: FeatureUnit) => {
    setSelectedFeatureId(f.id);
    setFeatureForm({
      name: f.name,
      code: f.code,
      category: f.category,
      basePrice: f.basePrice,
      promoPrice: f.promoPrice,
      isAddon: f.isAddon,
      discountCap: f.discountCap
    });
  };

  const handleDeleteFeature = (id: string, code: string) => {
    // Check if feature is mapped to any active packages
    const isMapped = packages.some(p => p.features.some(pf => pf.featureCode === code));
    if (isMapped) {
      toast.error(`Cannot delete feature ${code}. It is currently referenced in registered packages!`, {
        duration: 4000
      });
      return;
    }

    const updated = features.filter(f => f.id !== id);
    saveFeaturesToCache(updated);
    toast.success('Feature unit removed successfully!');
    if (selectedFeatureId === id) {
      setSelectedFeatureId(null);
    }
  };

  // Live Math Plan Price Composer Formulas
  const calculateLiveComposedPrices = () => {
    let baseSum = 0;
    let promoSum = 0;

    Object.entries(packageForm.features).forEach(([code, mapping]) => {
      if (mapping.checked) {
        const featureRef = features.find(f => f.code === code);
        if (featureRef) {
          baseSum += featureRef.basePrice * mapping.quantity;
          promoSum += featureRef.promoPrice * mapping.quantity;
        }
      }
    });

    const publishedMonthlyRate = promoSum;
    const discountMonthlyRate = baseSum - promoSum;
    const calculatedYearlySum = Math.round((publishedMonthlyRate * 12) * 0.85); // 15% bulk yearly discount

    return {
      baseMonthlySum: baseSum,
      promoMonthlySum: promoSum,
      publishedMonthlyRate,
      discountMonthlyRate,
      calculatedYearlySum
    };
  };

  const livePrices = calculateLiveComposedPrices();

  // Plan Creator Save Handler
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.name) {
      toast.error('Package Name is a mandatory configuration!');
      return;
    }

    const activeFeatures = Object.entries(packageForm.features)
      .filter(([_, mapping]) => mapping.checked)
      .map(([code, mapping]) => ({
        featureCode: code,
        quantity: mapping.quantity
      }));

    if (activeFeatures.length === 0) {
      toast.error('A SaaS plan must contain at least 1 checked feature!');
      return;
    }

    const newPackage: SaaSPackage = {
      id: 'p-' + Math.random().toString(36).substring(2, 9),
      name: packageForm.name,
      billingCycle: packageForm.billingCycle,
      trialDays: packageForm.trialDays,
      gracePeriodDays: packageForm.gracePeriodDays,
      features: activeFeatures,
      baseMonthlyPrice: livePrices.baseMonthlySum,
      promoMonthlyPrice: livePrices.promoMonthlySum,
      yearlyPrice: livePrices.calculatedYearlySum,
      isPublished: true
    };

    savePackagesToCache([...packages, newPackage]);
    toast.success(`Published package "${packageForm.name}" registered successfully!`);

    // Reset Package form
    setPackageForm({
      name: '',
      billingCycle: 'monthly',
      trialDays: 14,
      gracePeriodDays: 5,
      features: features.reduce((acc, f) => {
        acc[f.code] = { checked: false, quantity: 1 };
        return acc;
      }, {} as Record<string, { checked: boolean; quantity: number }>)
    });
  };

  // Filter Features List
  const filteredFeatures = features.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(featureSearch.toLowerCase()) || f.code.toLowerCase().includes(featureSearch.toLowerCase());
    const matchesCategory = featureCategoryFilter === 'All' || f.category === featureCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Tab Select & Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">SaaS Billing Units & Plan Creator</h1>
          <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">Construct atomic feature items, define system limits, and compose multi-tier subscription plans with live math.</p>
        </div>
        <div className="flex bg-zinc-100 rounded-xl p-0.5 border border-zinc-200/50">
          <button
            onClick={() => setActiveSubTab('features')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all ${
              activeSubTab === 'features' 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Atomic Billing Units ({features.length})
          </button>
          <button
            onClick={() => setActiveSubTab('plans')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all ${
              activeSubTab === 'plans' 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Plan Creator & Composer ({packages.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'features' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CRUD Form (Left Column) */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-2xl shadow-sm p-6 space-y-5 h-fit">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100/40">
                <Sliders className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  {selectedFeatureId ? 'Edit Billing Unit' : 'Register Atomic Unit'}
                </h3>
                <p className="text-[11px] font-semibold text-zinc-400 tracking-tight">Register features with base, promo, and discount boundaries.</p>
              </div>
            </div>

            <form onSubmit={handleFeatureSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Feature Name</label>
                <input 
                  type="text" 
                  value={featureForm.name}
                  onChange={e => setFeatureForm({ ...featureForm, name: e.target.value })}
                  placeholder="e.g. Workspace Operator Seat"
                  className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-semibold text-zinc-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Unique Code (System Barrel)</label>
                <input 
                  type="text" 
                  value={featureForm.code}
                  onChange={e => setFeatureForm({ ...featureForm, code: e.target.value })}
                  placeholder="e.g. USER_SEAT"
                  className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-semibold text-zinc-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Category Mappings</label>
                  <select
                    value={featureForm.category}
                    onChange={e => setFeatureForm({ ...featureForm, category: e.target.value as any })}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-bold text-zinc-700 outline-none"
                  >
                    <option value="Users">Users & Seats</option>
                    <option value="Workspaces">Workspaces</option>
                    <option value="Storage">Storage</option>
                    <option value="API Limits">API Limits</option>
                    <option value="Campaigns">Email Campaigns</option>
                    <option value="Automations">Automations</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Discount Cap (%)</label>
                  <input 
                    type="number" 
                    value={featureForm.discountCap}
                    onChange={e => setFeatureForm({ ...featureForm, discountCap: parseInt(e.target.value) })}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-semibold text-zinc-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Base Unit Price ($/mo)</label>
                  <input 
                    type="number" 
                    value={featureForm.basePrice}
                    onChange={e => setFeatureForm({ ...featureForm, basePrice: parseFloat(e.target.value) })}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-semibold text-zinc-800 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Promo Unit Price ($/mo)</label>
                  <input 
                    type="number" 
                    value={featureForm.promoPrice}
                    onChange={e => setFeatureForm({ ...featureForm, promoPrice: parseFloat(e.target.value) })}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-semibold text-zinc-800 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-zinc-100">
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-bold text-zinc-700">Add-on Item Switch</span>
                  <span className="text-[10px] text-zinc-400 font-semibold leading-tight">Flag this unit as a stand-alone workspace add-on.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={featureForm.isAddon}
                    onChange={e => setFeatureForm({ ...featureForm, isAddon: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-[12.5px] font-extrabold shadow-md border border-transparent"
                >
                  <Zap className="w-4 h-4 text-white fill-current animate-pulse" />
                  <span>{selectedFeatureId ? 'Update Configured Feature' : 'Register Atomic Unit'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Roster & Directory (Right Column) */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Feature Catalog</h3>
                <p className="text-[11px] font-semibold text-zinc-400 tracking-tight">Verified list of standard atomic pricing units.</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={featureCategoryFilter}
                  onChange={e => setFeatureCategoryFilter(e.target.value)}
                  className="text-[11px] bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-bold text-zinc-600 outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Users">Users & Seats</option>
                  <option value="Storage">Storage</option>
                  <option value="Campaigns">Email Campaigns</option>
                  <option value="Automations">Automations</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredFeatures.map((f) => (
                <div 
                  key={f.id}
                  onClick={() => handleSelectFeatureToEdit(f)}
                  className="group p-4 rounded-xl border border-zinc-200/50 hover:border-purple-300 bg-zinc-50/30 hover:bg-gradient-to-r hover:from-white hover:to-purple-50/5 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-purple-50 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-400 group-hover:text-purple-600 transition-all border border-zinc-200/20">
                      limit
                    </div>
                    <div>
                      <p className="text-[12.5px] font-extrabold text-zinc-800">{f.name}</p>
                      <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Code: {f.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[13px] font-extrabold text-zinc-900">${f.promoPrice} <span className="text-[10.5px] text-zinc-400 font-semibold line-through font-normal">${f.basePrice}</span></p>
                      <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Cap: {f.discountCap}%</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFeature(f.id, f.code);
                      }}
                      className="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 flex items-center justify-center border border-zinc-200/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Plan Creator Form (Left Column) */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/40">
                <Sliders className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Plan Spec Composer</h3>
                <p className="text-[11px] font-semibold text-zinc-400 tracking-tight">Combine registered features and calculate published rates.</p>
              </div>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">SaaS Plan Package Name</label>
                  <input 
                    type="text" 
                    value={packageForm.name}
                    onChange={e => setPackageForm({ ...packageForm, name: e.target.value })}
                    placeholder="e.g. NConnect Professional Suite"
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-bold text-zinc-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Trial Days Threshold</label>
                  <input 
                    type="number" 
                    value={packageForm.trialDays}
                    onChange={e => setPackageForm({ ...packageForm, trialDays: parseInt(e.target.value) })}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-semibold text-zinc-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Grace Period Days</label>
                  <input 
                    type="number" 
                    value={packageForm.gracePeriodDays}
                    onChange={e => setPackageForm({ ...packageForm, gracePeriodDays: parseInt(e.target.value) })}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 font-semibold text-zinc-800 outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Feature Checklist list */}
              <div className="space-y-3.5 pt-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block px-1">
                  Active Resource Checklist
                </label>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {features.map((f) => {
                    const mapped = packageForm.features[f.code] || { checked: false, quantity: 1 };
                    return (
                      <div 
                        key={f.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                          mapped.checked 
                            ? 'bg-purple-50/20 border-purple-300' 
                            : 'bg-zinc-50/40 border-zinc-200/50 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={mapped.checked}
                            onChange={e => {
                              setPackageForm(prev => ({
                                ...prev,
                                features: {
                                  ...prev.features,
                                  [f.code]: { ...mapped, checked: e.target.checked }
                                }
                              }));
                            }}
                            className="w-4 h-4 text-purple-600 border-zinc-300 rounded focus:ring-purple-500"
                          />
                          <div>
                            <p className="text-[12.5px] font-bold text-zinc-800">{getCleanFeatureName(f.code, f.name)}</p>
                            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Base rate: ${f.basePrice}/unit</p>
                          </div>
                        </div>

                        {mapped.checked && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-400">Qty:</span>
                            <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white">
                              <button
                                type="button"
                                onClick={() => {
                                  setPackageForm(prev => ({
                                    ...prev,
                                    features: {
                                      ...prev.features,
                                      [f.code]: { ...mapped, quantity: Math.max(1, mapped.quantity - 1) }
                                    }
                                  }));
                                }}
                                className="px-2 py-1 bg-zinc-50 hover:bg-zinc-100 text-[11px] font-extrabold text-zinc-500 transition-all"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 font-bold text-zinc-700 text-[11.5px] bg-white min-w-8 text-center select-none">
                                {mapped.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPackageForm(prev => ({
                                    ...prev,
                                    features: {
                                      ...prev.features,
                                      [f.code]: { ...mapped, quantity: mapped.quantity + 1 }
                                    }
                                  }));
                                }}
                                className="px-2 py-1 bg-zinc-50 hover:bg-zinc-100 text-[11px] font-extrabold text-zinc-500 transition-all"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Sum Blueprint Card (Live Math) */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 rounded-2xl text-white shadow-lg space-y-4 relative overflow-hidden border border-zinc-700/50">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>
                <div className="flex justify-between items-center border-b border-zinc-700/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Real-Time Price Formula</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                    live compile
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[12px] font-semibold text-zinc-300">
                  <div className="space-y-1">
                    <p className="text-zinc-500 text-[9px] font-mono font-bold tracking-tight uppercase">Monthly Base Sum</p>
                    <p className="text-[14px] text-white font-extrabold">${livePrices.baseMonthlySum}/mo</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-500 text-[9px] font-mono font-bold tracking-tight uppercase">Volume Discount Cap</p>
                    <p className="text-[14px] text-purple-400 font-extrabold">-${livePrices.discountMonthlyRate}/mo</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-700/50 flex items-end justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Composed Monthly Rate</p>
                    <p className="text-xl font-extrabold text-white">${livePrices.publishedMonthlyRate}<span className="text-[11px] text-zinc-400">/month</span></p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Calculated Yearly Sum (15% Disc)</p>
                    <p className="text-[15px] font-extrabold text-emerald-400">${livePrices.calculatedYearlySum}<span className="text-[10px] text-zinc-400">/year</span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 text-[12px] font-bold px-6 py-3 rounded-xl transition-all duration-200 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white border-transparent shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish & Save Plan Package</span>
                </button>
              </div>
            </form>
          </div>

          {/* Plan Package Catalog Previews (Right Column) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                Published Package Catalog
              </h3>
              {/* Billing Cycle preview toggle */}
              <div className="flex bg-zinc-100 rounded-lg p-0.5 border border-zinc-200/50">
                <button
                  onClick={() => setCatalogBillingToggle('monthly')}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-tight transition-all ${
                    catalogBillingToggle === 'monthly' ? 'bg-white text-purple-700' : 'text-zinc-500'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setCatalogBillingToggle('yearly')}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-tight transition-all ${
                    catalogBillingToggle === 'yearly' ? 'bg-white text-purple-700' : 'text-zinc-500'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {packages.map((pack) => {
                const displayPrice = catalogBillingToggle === 'monthly' ? pack.promoMonthlyPrice : pack.yearlyPrice;
                const cycleLabel = catalogBillingToggle === 'monthly' ? '/month' : '/year';

                return (
                  <div key={pack.id} className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-sm space-y-4 hover:border-purple-300 transition-all duration-200">
                    <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                      <div>
                        <h4 className="text-[13.5px] font-extrabold text-zinc-900">{pack.name}</h4>
                        <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">Trials: {pack.trialDays} days &bull; Grace: {pack.gracePeriodDays} days</p>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200/50 uppercase font-mono">
                        active
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Bundled Quota limits</p>
                      <ul className="space-y-1">
                        {pack.features.map((pf) => {
                          const featureRef = features.find(f => f.code === pf.featureCode);
                          return (
                            <li key={pf.featureCode} className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                              <span>{pf.quantity} {getCleanFeatureName(pf.featureCode, featureRef ? featureRef.name : pf.featureCode)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Published rate</span>
                      <p className="text-[15.5px] font-extrabold text-zinc-900">
                        ${displayPrice}
                        <span className="text-[11px] text-zinc-400 font-semibold">{cycleLabel}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
