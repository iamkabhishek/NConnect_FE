'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Plus, 
  Minus, 
  Layers, 
  Users, 
  HardDrive, 
  Sparkles, 
  Receipt,
  HelpCircle,
  Building2,
  Lock,
  Percent
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';

export interface PlanData {
  tier: 'Standard' | 'Pro' | 'Business';
  cycle: 'monthly' | 'yearly';
  addons: {
    workspaces: number;
    users: number;
    storage: number;
  };
  pricing: {
    basePrice: number;
    addonsPrice: number;
    subtotal: number;
    discount: number;
    gst: number;
    total: number;
  };
}

interface OnboardingStep4PlanProps {
  onNext: (data: PlanData) => void;
  onBack: () => void;
  initialData?: PlanData;
}

const planTiers = [
  {
    id: 'Standard' as const,
    name: 'Standard Plan',
    priceMonthly: 1500,
    features: {
      workspaces: 2,
      users: 5,
      storage: 2, // 2 GB
    },
    description: 'Perfect for small growing teams and marketing startups.',
    accentColor: 'from-blue-500 to-indigo-600',
    hoverRing: 'focus:ring-indigo-500/30 hover:border-indigo-400',
  },
  {
    id: 'Pro' as const,
    name: 'Pro Plan',
    priceMonthly: 4000,
    features: {
      workspaces: 5,
      users: 10,
      storage: 5, // 5 GB
    },
    description: 'Highly recommended for mid-sized agencies requiring advanced seats.',
    accentColor: 'from-violet-600 to-fuchsia-600',
    hoverRing: 'focus:ring-purple-500/30 hover:border-purple-400',
    popular: true,
  },
  {
    id: 'Business' as const,
    name: 'Business Plan',
    priceMonthly: 8000,
    features: {
      workspaces: 10,
      users: 20,
      storage: 10, // 10 GB
    },
    description: 'Constructed for scale, large enterprises, and massive operations.',
    accentColor: 'from-zinc-800 to-zinc-950',
    hoverRing: 'focus:ring-zinc-800/30 hover:border-zinc-700',
  },
];

export function OnboardingStep4Plan({ onNext, onBack, initialData }: OnboardingStep4PlanProps) {
  const [tier, setTier] = useState<'Standard' | 'Pro' | 'Business'>(initialData?.tier || 'Pro');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>(initialData?.cycle || 'monthly');
  const [addons, setAddons] = useState({
    workspaces: initialData?.addons?.workspaces || 0,
    users: initialData?.addons?.users || 0,
    storage: initialData?.addons?.storage || 0,
  });

  // Credit Card Form States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const selectedTierConfig = planTiers.find((t) => t.id === tier) || planTiers[1];

  // Pricing calculations
  const basePrice = selectedTierConfig.priceMonthly;
  const addonsPrice = (addons.workspaces * 500) + (addons.users * 100) + (addons.storage * 100);
  const monthlyTotal = basePrice + addonsPrice;

  let subtotal = 0;
  let discount = 0;
  if (cycle === 'yearly') {
    const annualBase = monthlyTotal * 12;
    subtotal = Math.round(annualBase * 0.85); // 15% discount
    discount = Math.round(annualBase * 0.15);
  } else {
    subtotal = monthlyTotal;
  }

  const gst = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + gst;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddonChange = (type: 'workspaces' | 'users' | 'storage', operation: 'inc' | 'dec') => {
    setAddons((prev) => {
      const current = prev[type];
      const next = operation === 'inc' ? current + 1 : Math.max(0, current - 1);
      return { ...prev, [type]: next };
    });
  };

  const validateCard = () => {
    if (!cardName.trim()) return 'Cardholder Name is required';
    if (cardNumber.replace(/\s/g, '').length < 16) return 'Valid 16-digit Card Number is required';
    if (!cardExpiry.includes('/') || cardExpiry.length < 5) return 'Valid Card Expiration (MM/YY) is required';
    if (cardCvv.length < 3) return 'Valid CVV/CVC is required';
    return null;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateCard();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setIsPaying(true);
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPaying(false);

    toast.success('Subscription Payment Simulated Successfully! Welcome on board.');

    onNext({
      tier,
      cycle,
      addons,
      pricing: {
        basePrice,
        addonsPrice,
        subtotal,
        discount,
        gst,
        total,
      },
    });
  };

  // Card formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCardCvv(value);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
          Choose Your Plan & Entitlements
        </h1>
        <p className="text-zinc-600 font-medium">
          Select a flexible base plan, adjust resource addons dynamically to fit your agency, and subscribe securely in real-time.
        </p>
      </div>

      {/* Cycle Toggle */}
      <div className="flex justify-center items-center gap-3">
        <span className={`text-sm font-bold transition-all ${cycle === 'monthly' ? 'text-purple-700' : 'text-zinc-400'}`}>
          Monthly Billing
        </span>
        <button
          type="button"
          onClick={() => setCycle(cycle === 'monthly' ? 'yearly' : 'monthly')}
          className="relative w-14 h-7 bg-zinc-200 border border-zinc-300 rounded-full transition-colors outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <span
            className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white border border-zinc-200 rounded-full transition-transform ${
              cycle === 'yearly' ? 'translate-x-7 bg-purple-600 border-purple-700' : ''
            }`}
          />
        </button>
        <span className={`text-sm font-bold transition-all flex items-center gap-1.5 ${cycle === 'yearly' ? 'text-purple-700' : 'text-zinc-400'}`}>
          <span>Yearly Billing</span>
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-0.5 animate-pulse">
            <Percent className="w-2.5 h-2.5" />
            <span>Save 15%</span>
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tiers Selection & Addons Config (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Plan Tiers Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {planTiers.map((p) => {
              const isSelected = tier === p.id;
              const monthlyRate = p.priceMonthly;
              const yearlyRate = Math.round((monthlyRate * 12) * 0.85);

              return (
                <div
                  key={p.id}
                  onClick={() => setTier(p.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-full bg-white group hover:scale-[1.01] ${
                    isSelected
                      ? `border-purple-600 shadow-md shadow-purple-500/5 ring-4 ring-purple-500/10`
                      : 'border-zinc-200 hover:border-zinc-300 shadow-sm'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>Most Popular</span>
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-extrabold text-zinc-900 tracking-tight group-hover:text-purple-700 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-[11.5px] font-medium text-zinc-400 mt-1 leading-normal">
                        {p.description}
                      </p>
                    </div>

                    <div className="border-t border-b border-zinc-100 py-3.5 space-y-2">
                      <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                        Included Entitlements
                      </p>
                      <ul className="space-y-1.5 text-[11.5px] font-semibold text-zinc-600">
                        <li className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>{p.features.workspaces} Workspaces</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>{p.features.users} Active Users / Seats</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <HardDrive className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>{p.features.storage} GB Cloud Storage</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <p className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
                      Plan Base Rate
                    </p>
                    <p className="text-2xl font-extrabold text-zinc-950 mt-1">
                      {cycle === 'monthly' ? (
                        <>
                          {formatCurrency(monthlyRate)}
                          <span className="text-xs font-semibold text-zinc-400">/mo</span>
                        </>
                      ) : (
                        <>
                          {formatCurrency(yearlyRate)}
                          <span className="text-xs font-semibold text-zinc-400">/yr</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Addons Adjuster Card */}
          <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Configure Extra Resource Add-ons</span>
              </h3>
              <p className="text-[11.5px] text-zinc-400 font-semibold tracking-tight mt-0.5">
                Need more scale? Expand your subscription entitlements instantly with extra workspaces, user seats, and cloud storage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Extra Workspaces */}
              <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/20 flex flex-col justify-between gap-4">
                <div className="flex gap-2.5 items-start">
                  <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-zinc-800">Workspaces Addon</h4>
                    <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">₹500 / month / workspace</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border border-zinc-200 rounded-xl overflow-hidden bg-white p-1">
                  <button
                    type="button"
                    onClick={() => handleAddonChange('workspaces', 'dec')}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 font-extrabold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[12.5px] font-extrabold text-zinc-800 w-10 text-center select-none">
                    +{addons.workspaces}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddonChange('workspaces', 'inc')}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 font-extrabold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Extra Users */}
              <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/20 flex flex-col justify-between gap-4">
                <div className="flex gap-2.5 items-start">
                  <div className="p-2 rounded-lg bg-purple-50 border border-purple-100/50 text-purple-600 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-zinc-800">Seats / User Seats</h4>
                    <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">₹100 / month / user seat</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border border-zinc-200 rounded-xl overflow-hidden bg-white p-1">
                  <button
                    type="button"
                    onClick={() => handleAddonChange('users', 'dec')}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 font-extrabold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[12.5px] font-extrabold text-zinc-800 w-10 text-center select-none">
                    +{addons.users}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddonChange('users', 'inc')}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 font-extrabold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Extra Storage */}
              <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/20 flex flex-col justify-between gap-4">
                <div className="flex gap-2.5 items-start">
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-zinc-800">Cloud Storage</h4>
                    <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">₹100 / month / GB S3 Storage</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border border-zinc-200 rounded-xl overflow-hidden bg-white p-1">
                  <button
                    type="button"
                    onClick={() => handleAddonChange('storage', 'dec')}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 font-extrabold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[12.5px] font-extrabold text-zinc-800 w-10 text-center select-none">
                    +{addons.storage} GB
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddonChange('storage', 'inc')}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 font-extrabold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Business Rules Summary Section */}
          <div className="bg-purple-50/30 border border-purple-100 rounded-2xl p-5 flex gap-3 text-left">
            <span className="text-base select-none">📑</span>
            <div className="text-[11.5px] leading-relaxed text-purple-950 font-medium space-y-1">
              <p className="font-extrabold text-[12px] text-purple-900">Important Subscription Rules:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Addon Lifecycles</strong>: Add-ons are dynamically attached to your core billing cycle. They expire on the exact same date as your core subscription renewal, making your billing clean and invoices predictable.</li>
                <li><strong>Dynamic Entitlement formula</strong>: Your final active system capabilities is calculated dynamically in real-time as: <span className="font-bold underline text-purple-800">Final Limits = Base Plan Features + Active Addons</span>.</li>
                <li><strong>Downgrade Protections</strong>: Subscriptions can be changed or downgraded later, but system blocks downgrades if your active resource usage (workspaces, active users) exceeds the new target limits.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Panel & Invoice Breakdown (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 shadow-lg rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="p-6 space-y-5">
            {/* Invoice Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 border-b border-zinc-100 pb-3">
                <Receipt className="w-4 h-4 text-purple-500" />
                <span>Invoice Breakdown</span>
              </h3>

              <div className="space-y-2.5 text-[12px] font-semibold text-zinc-600">
                {/* Base Plan */}
                <div className="flex justify-between items-center">
                  <span>{tier} Base Tier {cycle === 'yearly' ? '(Annual)' : '(Monthly)'}</span>
                  <span className="font-extrabold text-zinc-900">
                    {cycle === 'monthly' ? formatCurrency(basePrice) : formatCurrency(basePrice * 12)}
                  </span>
                </div>

                {/* Addons listed if active */}
                {addonsPrice > 0 && (
                  <div className="space-y-1.5 border-t border-dashed border-zinc-100 pt-2">
                    <p className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Active Add-on Components</p>
                    {addons.workspaces > 0 && (
                      <div className="flex justify-between items-center text-[11px] text-zinc-500">
                        <span>+ {addons.workspaces} Extra Workspace(s) @ ₹500/mo</span>
                        <span>{formatCurrency(addons.workspaces * 500 * (cycle === 'yearly' ? 12 : 1))}</span>
                      </div>
                    )}
                    {addons.users > 0 && (
                      <div className="flex justify-between items-center text-[11px] text-zinc-500">
                        <span>+ {addons.users} Extra User Seat(s) @ ₹100/mo</span>
                        <span>{formatCurrency(addons.users * 100 * (cycle === 'yearly' ? 12 : 1))}</span>
                      </div>
                    )}
                    {addons.storage > 0 && (
                      <div className="flex justify-between items-center text-[11px] text-zinc-500">
                        <span>+ {addons.storage} GB Cloud Storage @ ₹100/GB</span>
                        <span>{formatCurrency(addons.storage * 100 * (cycle === 'yearly' ? 12 : 1))}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between items-center border-t border-zinc-100 pt-2.5 text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-zinc-700">
                    {cycle === 'monthly' ? formatCurrency(monthlyTotal) : formatCurrency(monthlyTotal * 12)}
                  </span>
                </div>

                {/* Yearly discount */}
                {cycle === 'yearly' && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />
                      <span>15% Flat Yearly Savings</span>
                    </span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                {/* GST */}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span>GST (18%)</span>
                    <HelpCircle className="w-3 h-3 text-zinc-400" title="18% Goods and Services Tax standard rate" />
                  </span>
                  <span className="font-extrabold text-zinc-900">{formatCurrency(gst)}</span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-center border-t border-zinc-200 pt-3 text-[13.5px] font-extrabold">
                  <span className="text-zinc-900">Total Renewal Price</span>
                  <span className="text-purple-700 text-[15px]">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Simulated Payment Sheet */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-zinc-150">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-purple-500" />
                <span>Simulated Credit Card Payment</span>
              </h4>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <Label htmlFor="cardName" className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Cardholder Name</Label>
                  <input
                    type="text"
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isPaying}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-lg px-3 py-2 font-semibold text-zinc-800 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cardNumber" className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Card Number</Label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="•••• •••• •••• ••••"
                    disabled={isPaying}
                    className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-lg px-3 py-2 font-mono font-bold text-zinc-800 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="cardExpiry" className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Expiration</Label>
                    <input
                      type="text"
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      disabled={isPaying}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-lg px-3 py-2 font-mono font-bold text-zinc-800 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="cardCvv" className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-tight">CVC / CVV</Label>
                    <input
                      type="password"
                      id="cardCvv"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      disabled={isPaying}
                      className="w-full text-[12px] bg-zinc-50 border border-zinc-200 focus:border-purple-500 rounded-lg px-3 py-2 font-mono font-bold text-zinc-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex justify-center items-center gap-1 text-[10px] font-semibold text-zinc-400 py-1 bg-zinc-50/50 rounded-lg border border-zinc-100">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Simulated Secure SSL Encrypted Sandbox</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full flex items-center justify-center gap-1.5 py-3 px-5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-[12.5px] font-extrabold shadow-md border border-transparent disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {isPaying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>Processing Sim payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Pay {formatCurrency(total)} & Subscribe</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Controls footer */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isPaying}
              className="text-zinc-500 text-[11.5px] font-extrabold hover:bg-zinc-100"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Back</span>
            </Button>
            <span className="text-[10px] font-bold text-zinc-400">Step 4 of 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
