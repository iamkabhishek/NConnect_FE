'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Terminal, 
  Info, 
  Check, 
  Percent, 
  DollarSign, 
  Play, 
  HelpCircle,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Coupon, SaaSPackage } from '../types';
import { toast } from 'sonner';

export default function ModuleCoupons() {
  // Coupon State
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'c-1',
      code: 'NCONNECT30',
      deductionType: 'percentage',
      deductionValue: 30,
      minOrderSubtotal: 100,
      restrictedPlans: ['NConnect Growth Package', 'NConnect Scale-Up Pack'],
      redemptionCount: 14,
      isActive: true
    },
    {
      id: 'c-2',
      code: 'NCONNECT_WELCOME_FLAT',
      deductionType: 'flat',
      deductionValue: 25,
      minOrderSubtotal: 50,
      restrictedPlans: ['All Plans'],
      redemptionCount: 42,
      isActive: true
    },
    {
      id: 'c-3',
      code: 'ENTERPRISE_VIP_ONLY',
      deductionType: 'percentage',
      deductionValue: 50,
      minOrderSubtotal: 1000,
      restrictedPlans: ['NConnect Enterprise VIP', 'NConnect Scale-Up Pack'],
      redemptionCount: 3,
      isActive: false
    }
  ]);

  // Packages (to populate restricted plan options)
  const [availablePackages, setAvailablePackages] = useState<string[]>([
    'All Plans',
    'NConnect Growth Package',
    'NConnect Scale-Up Pack',
    'NConnect Enterprise VIP'
  ]);

  // Coupon Creation Form State
  const [couponForm, setCouponForm] = useState<Omit<Coupon, 'id' | 'redemptionCount'>>({
    code: '',
    deductionType: 'percentage',
    deductionValue: 10,
    minOrderSubtotal: 0,
    restrictedPlans: ['All Plans'],
    isActive: true
  });

  // Sandbox Tester State
  const [sandboxSubtotal, setSandboxSubtotal] = useState<number>(150);
  const [sandboxSelectedPlan, setSandboxSelectedPlan] = useState<string>('NConnect Growth Package');
  const [sandboxCouponCode, setSandboxCouponCode] = useState<string>('NCONNECT30');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [finalDiscount, setFinalDiscount] = useState<number>(0);
  const [finalNetPrice, setFinalNetPrice] = useState<number>(150);

  // Load from local storage on mount
  useEffect(() => {
    const cachedCoupons = localStorage.getItem('nconnect_ops_coupons');
    if (cachedCoupons) {
      setCoupons(JSON.parse(cachedCoupons));
    }

    // Try to load packages from billing module to make plans select option realistic
    const cachedPackages = localStorage.getItem('nconnect_ops_billing_packages');
    if (cachedPackages) {
      try {
        const pkgs: SaaSPackage[] = JSON.parse(cachedPackages);
        const names = ['All Plans', ...pkgs.map(p => p.name)];
        setAvailablePackages(names);
      } catch (err) {
        console.error('Error parsing packages cache in coupons module', err);
      }
    }
  }, []);

  // Cache coupons list
  const saveCouponsToCache = (updatedList: Coupon[]) => {
    setCoupons(updatedList);
    localStorage.setItem('nconnect_ops_coupons', JSON.stringify(updatedList));
  };

  // Handle Form Change with uppercase enforcement for coupon codes
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const caps = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setCouponForm(prev => ({ ...prev, code: caps }));
  };

  // Toggle single restricted plan
  const handleTogglePlanRestriction = (planName: string) => {
    setCouponForm(prev => {
      let updated: string[];
      if (planName === 'All Plans') {
        updated = ['All Plans'];
      } else {
        // If All Plans was selected previously, remove it
        const current = prev.restrictedPlans.filter(p => p !== 'All Plans');
        if (current.includes(planName)) {
          updated = current.filter(p => p !== planName);
          if (updated.length === 0) updated = ['All Plans'];
        } else {
          updated = [...current, planName];
        }
      }
      return { ...prev, restrictedPlans: updated };
    });
  };

  // Coupon Creation Submit Handler
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) {
      toast.error('Coupon Code cannot be empty!');
      return;
    }

    if (couponForm.deductionValue <= 0) {
      toast.error('Discount value must be greater than zero!');
      return;
    }

    if (couponForm.deductionType === 'percentage' && couponForm.deductionValue > 100) {
      toast.error('Percentage discount cannot exceed 100%!');
      return;
    }

    // Duplicate Check
    if (coupons.some(c => c.code === couponForm.code)) {
      toast.error(`Coupon code ${couponForm.code} already exists!`);
      return;
    }

    const newCoupon: Coupon = {
      id: 'c-' + Math.random().toString(36).substring(2, 9),
      code: couponForm.code,
      deductionType: couponForm.deductionType,
      deductionValue: Number(couponForm.deductionValue),
      minOrderSubtotal: Number(couponForm.minOrderSubtotal),
      restrictedPlans: couponForm.restrictedPlans,
      redemptionCount: 0,
      isActive: couponForm.isActive
    };

    const updated = [...coupons, newCoupon];
    saveCouponsToCache(updated);
    toast.success(`Coupon Campaign "${couponForm.code}" published successfully!`);

    // Reset Form
    setCouponForm({
      code: '',
      deductionType: 'percentage',
      deductionValue: 10,
      minOrderSubtotal: 0,
      restrictedPlans: ['All Plans'],
      isActive: true
    });
  };

  // Toggle active status
  const handleToggleStatus = (id: string) => {
    const updated = coupons.map(c => {
      if (c.id === id) {
        const nextStatus = !c.isActive;
        toast.success(`Coupon ${c.code} is now ${nextStatus ? 'Active' : 'Inactive'}`);
        return { ...c, isActive: nextStatus };
      }
      return c;
    });
    saveCouponsToCache(updated);
  };

  // Delete Coupon
  const handleDeleteCoupon = (id: string, code: string) => {
    const updated = coupons.filter(c => c.id !== id);
    saveCouponsToCache(updated);
    toast.success(`Coupon campaign ${code} terminated.`);
  };

  // Interactive Sandbox Checkout Simulator Handler
  const runSandboxCheckoutSimulation = async () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setTerminalLogs([]);
    setFinalDiscount(0);
    setFinalNetPrice(sandboxSubtotal);

    const logs: string[] = [];
    const addLog = (text: string) => {
      logs.push(text);
      setTerminalLogs([...logs]);
    };

    // Helper sleep function
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    addLog(`[SYSTEM] Initializing NConnect Sandbox Checkout Engine v2.0.4...`);
    await sleep(250);
    addLog(`[INSPECT] Order parameters detected:`);
    addLog(`   * Target Plan:  "${sandboxSelectedPlan}"`);
    addLog(`   * Base Subtotal: $${sandboxSubtotal.toFixed(2)}`);
    addLog(`   * Coupon Code:   "${sandboxCouponCode.trim() || 'N/A'}"`);
    await sleep(350);

    const couponCode = sandboxCouponCode.trim().toUpperCase();
    if (!couponCode) {
      addLog(`[WARNING] No discount voucher specified in payload. Proceeding to standard billing path.`);
      addLog(`[SUCCESS] Compilation complete. Net Billing Rate: $${sandboxSubtotal.toFixed(2)}`);
      setFinalDiscount(0);
      setFinalNetPrice(sandboxSubtotal);
      setIsCompiling(false);
      return;
    }

    addLog(`[QUERY] Scanning local cache for coupon signature '${couponCode}'...`);
    await sleep(400);

    const activeCoupon = coupons.find(c => c.code === couponCode);

    if (!activeCoupon) {
      addLog(`[ERROR] VOUCHER_NOT_FOUND: Code '${couponCode}' does not exist on active registry.`);
      addLog(`[CRITICAL] Aborting coupon deduction. Reverting to base subtotal: $${sandboxSubtotal.toFixed(2)}`);
      toast.error(`Invalid coupon code "${couponCode}"!`);
      setIsCompiling(false);
      return;
    }

    addLog(`[SUCCESS] Coupon signature matched: ID [${activeCoupon.id}]`);
    await sleep(300);

    // Check if active
    addLog(`[CHECK] Verifying status: IsActive = ${activeCoupon.isActive}`);
    if (!activeCoupon.isActive) {
      addLog(`[ERROR] VOUCHER_EXPIRED_OR_SUSPENDED: The campaign '${couponCode}' is currently set to Offline.`);
      addLog(`[CRITICAL] Application terminated. Net Rate: $${sandboxSubtotal.toFixed(2)}`);
      toast.error(`Coupon "${couponCode}" is currently inactive!`);
      setIsCompiling(false);
      return;
    }
    await sleep(300);

    // Check minimum order value bounds
    addLog(`[CHECK] Validating minimum subtotal requirement...`);
    addLog(`   * Required: >= $${activeCoupon.minOrderSubtotal.toFixed(2)}`);
    addLog(`   * Present:     $${sandboxSubtotal.toFixed(2)}`);
    if (sandboxSubtotal < activeCoupon.minOrderSubtotal) {
      addLog(`[ERROR] MIN_ORDER_SUBTOTAL_NOT_MET: Required minimum order is $${activeCoupon.minOrderSubtotal.toFixed(2)}.`);
      addLog(`[CRITICAL] Campaign rules violated. Discount rejected.`);
      toast.error(`Order subtotal does not meet the $${activeCoupon.minOrderSubtotal} minimum!`);
      setIsCompiling(false);
      return;
    }
    addLog(`[SUCCESS] Minimum subtotal bounds successfully satisfied.`);
    await sleep(300);

    // Check plan restriction mapping
    addLog(`[CHECK] Testing plan eligibility constraints...`);
    addLog(`   * Restrict-List: [${activeCoupon.restrictedPlans.join(', ')}]`);
    
    const isPlanAllowed = activeCoupon.restrictedPlans.includes('All Plans') || 
                          activeCoupon.restrictedPlans.includes(sandboxSelectedPlan);

    if (!isPlanAllowed) {
      addLog(`[ERROR] PLAN_RESTRICTION_BLOCKED: Selected plan '${sandboxSelectedPlan}' is barred from campaign.`);
      addLog(`[CRITICAL] Coupon rules violated. Net price unchanged: $${sandboxSubtotal.toFixed(2)}`);
      toast.error(`Coupon not applicable for the selected plan "${sandboxSelectedPlan}"!`);
      setIsCompiling(false);
      return;
    }
    addLog(`[SUCCESS] Subscription plan matched against coupon whitelist.`);
    await sleep(350);

    // Perform deduction
    addLog(`[MATH] Initiating discount reduction calculator:`);
    let calculatedDiscount = 0;
    if (activeCoupon.deductionType === 'percentage') {
      calculatedDiscount = (sandboxSubtotal * activeCoupon.deductionValue) / 100;
      addLog(`   * Formula: ($${sandboxSubtotal.toFixed(2)} * ${activeCoupon.deductionValue}%)`);
    } else {
      calculatedDiscount = activeCoupon.deductionValue;
      addLog(`   * Formula: ($${sandboxSubtotal.toFixed(2)} - Flat $${activeCoupon.deductionValue.toFixed(2)})`);
    }

    // Ensure discount doesn't exceed order subtotal
    if (calculatedDiscount > sandboxSubtotal) {
      calculatedDiscount = sandboxSubtotal;
      addLog(`   * [INFO] Discount capped to order subtotal limit: $${sandboxSubtotal.toFixed(2)}`);
    }

    const netRate = sandboxSubtotal - calculatedDiscount;
    addLog(`   * Calculation Result: Net Rate = $${netRate.toFixed(2)}`);
    await sleep(300);

    addLog(`[MUTATION] Updating ledger records...`);
    // Simulated increment redemption count
    const updatedCoupons = coupons.map(c => {
      if (c.id === activeCoupon.id) {
        return { ...c, redemptionCount: c.redemptionCount + 1 };
      }
      return c;
    });
    setCoupons(updatedCoupons);
    localStorage.setItem('nconnect_ops_coupons', JSON.stringify(updatedCoupons));

    addLog(`[SUCCESS] Redemption ledger updated. Coupon redemption incremented.`);
    await sleep(250);
    addLog(`[SUCCESS] Checkout compilation completed successfully!`);
    addLog(`[FINAL] Discount applied: -$${calculatedDiscount.toFixed(2)} | Net Rate: $${netRate.toFixed(2)}`);

    setFinalDiscount(calculatedDiscount);
    setFinalNetPrice(netRate);
    setIsCompiling(false);
    toast.success(`Coupon "${couponCode}" applied! Saved $${calculatedDiscount.toFixed(2)}`);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Promotion Campaigns & Coupon Sandbox</h1>
        <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">Configure promotional discount codes, enforce subtotal boundaries, plan restrictions, and run real-time compilations in the sandbox.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side: Coupon Creation Panel (5cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-md rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-fuchsia-50 text-fuchsia-600 rounded-xl">
                <Tag className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-800 tracking-tight">Coupon Campaign Manager</h2>
                <p className="text-[10px] text-zinc-400 font-medium">Publish atomic promotion rules & coupon vouchers</p>
              </div>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Voucher Coupon Code</label>
                <div className="relative">
                  <input
                    type="text"
                    value={couponForm.code}
                    onChange={handleCodeChange}
                    placeholder="e.g. NCONNECT_SUMMER_50"
                    className="w-full text-xs font-bold tracking-widest uppercase bg-zinc-50/50 border border-zinc-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-zinc-800 placeholder:text-zinc-300"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded font-mono">
                    ALPHANUMERIC
                  </div>
                </div>
              </div>

              {/* Deduction Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Deduction Method</label>
                  <div className="flex bg-zinc-100 rounded-xl p-0.5 border border-zinc-200/60">
                    <button
                      type="button"
                      onClick={() => setCouponForm(prev => ({ ...prev, deductionType: 'percentage' }))}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        couponForm.deductionType === 'percentage'
                          ? 'bg-white text-purple-700 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      <Percent className="w-3 h-3" /> Percentage
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponForm(prev => ({ ...prev, deductionType: 'flat' }))}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        couponForm.deductionType === 'flat'
                          ? 'bg-white text-purple-700 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" /> Flat Rate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Value {couponForm.deductionType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={couponForm.deductionType === 'percentage' ? 100 : 10000}
                    value={couponForm.deductionValue}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, deductionValue: Number(e.target.value) }))}
                    className="w-full text-xs font-bold bg-zinc-50/50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-zinc-800"
                  />
                </div>
              </div>

              {/* Minimum Subtotal */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Minimum Order Subtotal ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    value={couponForm.minOrderSubtotal}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, minOrderSubtotal: Number(e.target.value) }))}
                    className="w-full text-xs font-bold bg-zinc-50/50 border border-zinc-200 rounded-xl pl-6 pr-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-zinc-800"
                  />
                  <div className="absolute right-3 top-2.5 text-[9px] text-zinc-400 italic">
                    0 = No minimum subtotal
                  </div>
                </div>
              </div>

              {/* Restricted Subscription Plans */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Plan Applicability ({couponForm.restrictedPlans.includes('All Plans') ? 'All' : `${couponForm.restrictedPlans.length} Selected`})
                </label>
                <div className="bg-zinc-50/50 border border-zinc-200 rounded-xl p-2.5 space-y-1.5 max-h-36 overflow-y-auto">
                  {availablePackages.map(planName => {
                    const isSelected = couponForm.restrictedPlans.includes(planName);
                    return (
                      <button
                        key={planName}
                        type="button"
                        onClick={() => handleTogglePlanRestriction(planName)}
                        className={`w-full flex items-center justify-between text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all text-left ${
                          isSelected
                            ? 'bg-purple-50 text-purple-700 border border-purple-100'
                            : 'bg-white hover:bg-zinc-100/70 border border-zinc-100 text-zinc-500'
                        }`}
                      >
                        <span className="truncate">{planName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[9px] text-zinc-400 mt-1 font-semibold">
                  * Note: Restricting to specific plans blocks users on other subscription configurations from applying the voucher.
                </p>
              </div>

              {/* Create Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create & Publish Campaign
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Campaigns Table (Top) & Sandbox Terminal (Bottom) (7cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Active Campaign Registry */}
          <div className="bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-800 tracking-tight">Active Promotion Registry</h2>
                  <p className="text-[10px] text-zinc-400 font-medium">Currently registered and active marketing campaigns</p>
                </div>
              </div>
              <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full font-mono font-bold">
                {coupons.length} CODES REGISTERED
              </span>
            </div>

            {/* Coupons List */}
            <div className="overflow-x-auto">
              {coupons.length === 0 ? (
                <div className="text-center py-8 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                  <HelpCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-zinc-400">No promo coupons currently in registry.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {coupons.map((c) => (
                    <div 
                      key={c.id} 
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl border transition-all ${
                        c.isActive 
                          ? 'bg-gradient-to-r from-zinc-50/50 to-white border-zinc-200/60 hover:shadow-sm' 
                          : 'bg-zinc-100/40 border-zinc-200/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          c.isActive ? 'bg-fuchsia-50 text-fuchsia-600' : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-mono font-extrabold text-zinc-800 tracking-widest">{c.code}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              c.deductionType === 'percentage' 
                                ? 'bg-indigo-50 text-indigo-600' 
                                : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {c.deductionType === 'percentage' ? `${c.deductionValue}% off` : `$${c.deductionValue} off`}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-zinc-400 font-semibold">
                            <span>Min: <b className="text-zinc-600 font-bold">${c.minOrderSubtotal}</b></span>
                            <span className="text-zinc-300">•</span>
                            <span className="truncate max-w-[180px]">
                              Scope: <b className="text-purple-600 font-mono text-[9px] font-bold">{c.restrictedPlans.join(', ')}</b>
                            </span>
                            <span className="text-zinc-300">•</span>
                            <span>Redeemed: <b className="text-zinc-600 font-bold">{c.redemptionCount}</b></span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-zinc-100 sm:border-0">
                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleToggleStatus(c.id)}
                          className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                          title={c.isActive ? "Deactivate" : "Activate"}
                        >
                          {c.isActive ? (
                            <ToggleRight className="w-7 h-7 text-fuchsia-600" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 text-zinc-300" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 bg-zinc-50 hover:bg-red-50 border border-zinc-100 rounded-lg transition-all cursor-pointer"
                          title="Terminate Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Checkout Math Sandbox Terminal Simulator */}
          <div className="bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-md rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-800 tracking-tight">Interactive Coupon Sandbox</h2>
                <p className="text-[10px] text-zinc-400 font-medium">Test active codes, verify order subtotals, and simulate live server compilation</p>
              </div>
            </div>

            {/* Sandbox Inputs Panel */}
            <div className="bg-zinc-50/50 border border-zinc-200/60 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Order total */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Simulated Subtotal ($)</label>
                <input
                  type="number"
                  min="1"
                  value={sandboxSubtotal}
                  onChange={(e) => setSandboxSubtotal(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-purple-500 transition-all text-zinc-800"
                />
              </div>

              {/* Subscription target */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Target Subscription Plan</label>
                <select
                  value={sandboxSelectedPlan}
                  onChange={(e) => setSandboxSelectedPlan(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-purple-500 transition-all text-zinc-700 cursor-pointer"
                >
                  {availablePackages.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Coupon input */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Input Coupon Code</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={sandboxCouponCode}
                    onChange={(e) => setSandboxCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                    placeholder="e.g. NCONNECT30"
                    className="w-full text-xs font-mono font-bold bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-purple-500 transition-all text-zinc-800 tracking-wider placeholder:text-zinc-300"
                  />
                  <button
                    onClick={runSandboxCheckoutSimulation}
                    disabled={isCompiling}
                    className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 active:scale-95 disabled:opacity-50 text-white p-2 rounded-xl transition-all cursor-pointer"
                    title="Execute Simulation"
                  >
                    <Play className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Clean Diagnostic Trace Logs */}
            <div className="relative">
              <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                COMPILATION TRACE
              </div>
              <div className="bg-zinc-50 border border-zinc-200 shadow-inner p-5 rounded-2xl min-h-[160px] max-h-[260px] overflow-y-auto space-y-2.5">
                {terminalLogs.length === 0 ? (
                  <span className="text-zinc-400 block text-xs font-semibold text-center py-8 italic">
                    Sandbox idle. Set simulated subtotal, select plan, and click play to run order calculation trace.
                  </span>
                ) : (
                  terminalLogs.map((log, index) => {
                    let styleClass = 'text-zinc-600 bg-white border border-zinc-200/50';
                    if (log.includes('[ERROR]')) styleClass = 'text-rose-700 bg-rose-50 border-rose-200 font-bold';
                    else if (log.includes('[SUCCESS]')) styleClass = 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold';
                    else if (log.includes('[WARNING]')) styleClass = 'text-amber-700 bg-amber-50 border-amber-200';
                    else if (log.includes('[CRITICAL]')) styleClass = 'text-red-700 bg-red-50 border-red-200 font-bold';
                    else if (log.includes('[FINAL]')) styleClass = 'text-fuchsia-700 bg-fuchsia-50/50 border-fuchsia-200 font-extrabold text-[11px] border-t border-dashed mt-2 pt-2';
                    else if (log.includes('[INFO]')) styleClass = 'text-indigo-700 bg-indigo-50 border-indigo-200';
                    else if (log.includes('[SYSTEM]')) styleClass = 'text-purple-700 bg-purple-50 border-purple-200 font-bold';
                    else if (log.includes('[CHECK]')) styleClass = 'text-cyan-700 bg-cyan-50 border-cyan-200';
                    else if (log.includes('[MATH]')) styleClass = 'text-yellow-800 bg-yellow-50 border-yellow-200';

                    return (
                      <div key={index} className={`${styleClass} px-3.5 py-2 rounded-xl text-[10.5px] font-semibold leading-relaxed whitespace-pre-wrap shadow-sm transition-all duration-150 hover:scale-[1.002]`}>
                        {log}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sandbox Ledger Bill Result */}
            {terminalLogs.length > 0 && !isCompiling && (
              <div className="mt-4 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-200/40 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-600 shrink-0" />
                  <div className="text-[10px] text-zinc-500 font-semibold">
                    Simulated Net Bill Rate calculated successfully.
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[9px] text-zinc-400 font-bold block uppercase">Savings</span>
                    <span className="text-xs font-bold text-fuchsia-600 font-mono">-${finalDiscount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 font-bold block uppercase">Net Rate</span>
                    <span className="text-sm font-extrabold text-zinc-800 font-mono">${finalNetPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
