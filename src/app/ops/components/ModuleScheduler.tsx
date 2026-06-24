'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Check, X, AlertTriangle, AlertCircle, RefreshCw, 
  User, Building, Plus, CalendarDays, Link as LinkIcon, Trash2, Mail, Users 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function ModuleScheduler() {
  const [activeQueueTab, setActiveQueueTab] = useState<'pending' | 'confirmed' | 'all'>('pending');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSelectedSuccessMessage] = useState<string | null>(null);

  // Approval Modal State
  const [approvalModalBooking, setApprovalModalBooking] = useState<any | null>(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<any | null>(null);
  const [availableSlotsForDate, setAvailableSlotsForDate] = useState<any[]>([]);
  const [selectedRescheduleSlotId, setSelectedRescheduleSlotId] = useState<string | null>(null);
  const [rescheduleDateInput, setRescheduleDateInput] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Slot Generator Form State
  const [configMonth, setConfigMonth] = useState('');
  const [dailyStartTime, setDailyStartTime] = useState('09:00:00');
  const [dailyEndTime, setDailyEndTime] = useState('17:00:00');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<30 | 60>(30);
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default
  const [isGenerating, setIsGenerating] = useState(false);

  // Exceptions & Overrides Form State
  const [exceptionDate, setExceptionDate] = useState('');
  const [exceptionType, setExceptionType] = useState<'blocked' | 'custom_available'>('blocked');
  const [exceptionTime, setExceptionTime] = useState('');
  const [exceptionReason, setExceptionReason] = useState('');
  const [isSettingException, setIsSettingException] = useState(false);

  const [overrideDate, setOverrideDate] = useState('');
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [customDuration, setCustomDuration] = useState<'30' | '60' | 'default'>('30');
  const [overrideReason, setOverrideReason] = useState('');
  const [isSettingOverride, setIsSettingOverride] = useState(false);

  // Fetch all bookings
  const fetchBookings = () => {
    setIsLoading(true);
    fetch('/api/v1/demo-scheduler/admin/bookings')
      .then(res => res.json())
      .then(data => {
        if (data.bookings) {
          setBookings(data.bookings);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
    
    // Set configMonth to current month by default
    const now = new Date();
    setConfigMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  // Filtered Bookings for the Table tabs
  const filteredBookings = bookings.filter(b => {
    if (activeQueueTab === 'pending') return b.booking.status === 'pending';
    if (activeQueueTab === 'confirmed') return b.booking.status === 'confirmed';
    return true; // All
  });

  // Handle slot generation submission
  const handleGenerateSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);
    setSelectedSuccessMessage(null);

    try {
      const res = await fetch('/api/v1/demo-scheduler/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configMonth,
          dailyStartTime,
          dailyEndTime,
          slotDurationMinutes,
          workingDays
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate slots.');
      }

      setSelectedSuccessMessage(`Successfully bulk-generated ${data.count} slots for month ${configMonth}!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Slot generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle booking approval action
  const handleApproveBooking = async () => {
    if (!approvalModalBooking || !meetingLink) return;
    setIsApproving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/demo-scheduler/admin/bookings/${approvalModalBooking.booking.bookingId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingLink })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Approval failed.');
      }

      setSelectedSuccessMessage(`Booking ID ${approvalModalBooking.booking.bookingId} approved successfully!`);
      setApprovalModalBooking(null);
      setMeetingLink('');
      fetchBookings();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsApproving(false);
    }
  };

  // Handle booking cancellation action
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Old slots will be restored.')) return;
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/demo-scheduler/admin/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: 'Cancelled by platform operator' })
      });

      if (!res.ok) {
        throw new Error('Failed to cancel booking.');
      }

      setSelectedSuccessMessage(`Booking ${bookingId} cancelled successfully.`);
      fetchBookings();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  // Fetch available slots for rescheduling on specified date
  const loadSlotsForReschedule = async (dateStr: string) => {
    if (!dateStr) return;
    try {
      const res = await fetch(`/api/v1/demo-scheduler/slots/available?date=${dateStr}`);
      const data = await res.json();
      if (data.slots) {
        setAvailableSlotsForDate(data.slots);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle booking rescheduling submission
  const handleRescheduleSubmit = async () => {
    if (!rescheduleBooking || !selectedRescheduleSlotId) return;
    setIsRescheduling(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/demo-scheduler/admin/bookings/${rescheduleBooking.booking.bookingId}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSlotId: selectedRescheduleSlotId })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Reschedule failed.');
      }

      setSelectedSuccessMessage('Booking rescheduled successfully!');
      setRescheduleBooking(null);
      setSelectedRescheduleSlotId(null);
      setAvailableSlotsForDate([]);
      setRescheduleDateInput('');
      fetchBookings();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsRescheduling(false);
    }
  };

  // Handle setting date block/exceptions
  const handleSetException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exceptionDate) return;
    setIsSettingException(true);
    setErrorMessage(null);
    setSelectedSuccessMessage(null);

    try {
      const res = await fetch('/api/v1/demo-scheduler/admin/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exceptionDate,
          exceptionTime: exceptionTime ? `${exceptionTime}:00` : null,
          exceptionType,
          reason: exceptionReason,
          createdBy: 'platform-operator'
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Exception setup failed.');
      }

      setSelectedSuccessMessage(`Slot exception set successfully for ${exceptionDate}!`);
      setExceptionDate('');
      setExceptionTime('');
      setExceptionReason('');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSettingException(false);
    }
  };

  // Handle setting day-level override
  const handleSetOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideDate) return;
    setIsSettingOverride(true);
    setErrorMessage(null);
    setSelectedSuccessMessage(null);

    try {
      const res = await fetch('/api/v1/demo-scheduler/admin/day-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overrideDate,
          customStartTime: customStartTime ? `${customStartTime}:00` : null,
          customEndTime: customEndTime ? `${customEndTime}:00` : null,
          customSlotDurationMinutes: customDuration === 'default' ? null : Number(customDuration),
          reason: overrideReason,
          createdBy: 'platform-operator'
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Override setup failed.');
      }

      setSelectedSuccessMessage(`Workday override applied successfully for ${overrideDate}!`);
      setOverrideDate('');
      setCustomStartTime('');
      setCustomEndTime('');
      setOverrideReason('');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSettingOverride(false);
    }
  };

  const handleWorkingDayCheckboxChange = (dayNum: number) => {
    if (workingDays.includes(dayNum)) {
      setWorkingDays(workingDays.filter(d => d !== dayNum));
    } else {
      setWorkingDays([...workingDays, dayNum].sort());
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-purple-600" />
          Demo Booking Manager
        </h1>
        <p className="text-xs text-zinc-500 font-medium">Configure templates, exceptions, overrides, and process pending client meetings.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Queue & Booking Management */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm flex flex-col min-h-[500px]">
            {/* Tab header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base">Booking Queue</h3>
                  <p className="text-[11px] text-zinc-400 font-medium">Incoming demo requests.</p>
                </div>
              </div>

              {/* Sub-tabs list */}
              <div className="bg-zinc-100/80 border border-zinc-200/20 p-1 rounded-xl flex items-center gap-1">
                {(['pending', 'confirmed', 'all'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveQueueTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      activeQueueTab === tab 
                        ? 'bg-white text-purple-700 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue Table */}
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-zinc-400 gap-2">
                <Calendar className="w-7 h-7 text-zinc-300" />
                <p className="text-xs font-bold">No bookings in this tab.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
                      <th className="pb-3 pl-2">Customer / Company</th>
                      <th className="pb-3">Scheduled Slot (UTC)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm">
                    {filteredBookings.map((b) => (
                      <tr key={b.booking.bookingId} className="hover:bg-zinc-50/40 transition-colors">
                        {/* Attendee customer detail */}
                        <td className="py-3.5 pl-2 max-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 text-xs flex-shrink-0">
                              {b.user.firstName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-extrabold text-zinc-800 truncate">{b.user.firstName} {b.user.lastName}</p>
                              <p className="text-[10px] text-zinc-400 font-medium truncate flex items-center gap-1">
                                <Mail className="w-3 h-3 flex-shrink-0" /> {b.user.workEmail}
                              </p>
                              <p className="text-[10px] text-zinc-500 font-medium truncate flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3 flex-shrink-0" /> {b.user.companyName} ({b.user.teamSize} emp)
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Scheduled slot details */}
                        <td className="py-3.5">
                          <p className="font-bold text-zinc-800">
                            {new Date(b.slot.slotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            {b.slot.startTime.slice(0, 5)} - {b.slot.endTime.slice(0, 5)}
                            <span className="text-zinc-400 font-normal">({b.slot.slotDurationMinutes} min)</span>
                          </p>
                        </td>

                        {/* Status label */}
                        <td className="py-3.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            b.booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : b.booking.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                          }`}>
                            {b.booking.status}
                          </span>
                        </td>

                        {/* Operational Actions */}
                        <td className="py-3.5 text-right pr-2 space-x-1">
                          {b.booking.status === 'pending' && (
                            <button
                              onClick={() => setApprovalModalBooking(b)}
                              className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-emerald-200/50"
                            >
                              Approve
                            </button>
                          )}
                          {b.booking.status === 'confirmed' && (
                            <button
                              onClick={() => {
                                setRescheduleBooking(b);
                                setRescheduleDateInput(b.slot.slotDate);
                                loadSlotsForReschedule(b.slot.slotDate);
                              }}
                              className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-blue-200/50"
                            >
                              Reschedule
                            </button>
                          )}
                          {b.booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(b.booking.bookingId)}
                              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all inline-flex items-center justify-center"
                              title="Cancel Booking"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Control Forms (Schedules, Exceptions, Overrides) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Form 1: Monthly Bulk Slot Generator */}
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              Monthly Generator
            </h3>
            
            <form onSubmit={handleGenerateSlots} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Config Month *</label>
                <input 
                  type="month" 
                  value={configMonth}
                  onChange={e => setConfigMonth(e.target.value)}
                  required
                  className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Start (Local) *</label>
                  <input 
                    type="time" 
                    value={dailyStartTime.slice(0, 5)}
                    onChange={e => setDailyStartTime(`${e.target.value}:00`)}
                    required
                    className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">End (Local) *</label>
                  <input 
                    type="time" 
                    value={dailyEndTime.slice(0, 5)}
                    onChange={e => setDailyEndTime(`${e.target.value}:00`)}
                    required
                    className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Slot Duration *</label>
                <div className="grid grid-cols-2 gap-3">
                  {([30, 60] as const).map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSlotDurationMinutes(dur)}
                      className={`h-10 rounded-xl border text-xs font-bold transition-all ${
                        slotDurationMinutes === dur 
                          ? 'bg-purple-50 border-purple-500 text-purple-700' 
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-600'
                      }`}
                    >
                      {dur} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Working Days *</label>
                <div className="flex flex-wrap gap-1.5">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                    const isChecked = workingDays.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleWorkingDayCheckboxChange(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          isChecked 
                            ? 'bg-purple-600 text-white shadow-sm' 
                            : 'bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-500'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/10 active:scale-95 transition-all mt-6 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Generating Slots...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Generate Available Slots
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Form 2: Exception Manager */}
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              Set Slot Exception
            </h3>

            <form onSubmit={handleSetException} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Date *</label>
                <input 
                  type="date" 
                  value={exceptionDate}
                  onChange={e => setExceptionDate(e.target.value)}
                  required
                  className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Exception Type *</label>
                  <select
                    value={exceptionType}
                    onChange={e => setExceptionType(e.target.value as any)}
                    className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-bold text-zinc-600 focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                  >
                    <option value="blocked">Block Slot</option>
                    <option value="custom_available">Re-Open Slot</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Time (Optional)</label>
                  <input 
                    type="time" 
                    value={exceptionTime}
                    onChange={e => setExceptionTime(e.target.value)}
                    placeholder="All Day"
                    className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none focus:border-purple-500/50 text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Reason / Details</label>
                <input 
                  type="text" 
                  placeholder="e.g. Christmas Off, Team Retreat"
                  value={exceptionReason}
                  onChange={e => setExceptionReason(e.target.value)}
                  className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <Button
                type="submit"
                disabled={isSettingException}
                className="w-full h-10 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all mt-4"
              >
                {isSettingException ? 'Applying Exception...' : 'Apply Exception'}
              </Button>
            </form>
          </div>

        </div>

      </div>

      {/* APPROVAL OVERLAY MODAL */}
      {approvalModalBooking && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-2xl w-full max-w-lg relative animate-scale-up">
            <button 
              onClick={() => setApprovalModalBooking(null)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg p-1 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-zinc-900 text-lg flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-emerald-500" /> Approve Demo Booking
            </h3>
            <p className="text-xs text-zinc-400 mb-6 font-medium">Configure video-call link for attendee: **{approvalModalBooking.user.firstName} {approvalModalBooking.user.lastName}**</p>

            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-6 text-left space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Attendee Name</span>
                  <p className="font-extrabold text-zinc-700">{approvalModalBooking.user.firstName} {approvalModalBooking.user.lastName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Work Email</span>
                  <p className="font-extrabold text-zinc-700 truncate">{approvalModalBooking.user.workEmail}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-200/50">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Requested Time Slot</span>
                  <p className="font-black text-purple-700 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    {new Date(approvalModalBooking.slot.slotDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    {' at '}
                    {approvalModalBooking.slot.startTime.slice(0, 5)} - {approvalModalBooking.slot.endTime.slice(0, 5)} (UTC)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mb-6">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Video Call URL *</label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input 
                  type="url" 
                  placeholder="https://zoom.us/j/92482310"
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 focus:border-purple-500/50 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setApprovalModalBooking(null)}
                className="h-10 text-zinc-500 hover:bg-zinc-50 px-4 rounded-xl text-xs font-bold transition-all"
              >
                Go Back
              </button>
              <Button
                onClick={handleApproveBooking}
                disabled={!meetingLink || isApproving}
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95 transition-all"
              >
                {isApproving ? 'Approving...' : 'Confirm Approval'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE OVERLAY MODAL */}
      {rescheduleBooking && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-2xl w-full max-w-lg relative animate-scale-up">
            <button 
              onClick={() => { setRescheduleBooking(null); setSelectedRescheduleSlotId(null); setAvailableSlotsForDate([]); }}
              className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg p-1 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-zinc-900 text-lg flex items-center gap-2 mb-2">
              <CalendarDays className="w-5 h-5 text-purple-600" /> Reschedule Booking
            </h3>
            <p className="text-xs text-zinc-400 mb-6 font-medium">Re-allocate a replacement slot for: **{rescheduleBooking.user.firstName} {rescheduleBooking.user.lastName}**</p>

            <div className="space-y-4 mb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Target Reschedule Date *</label>
                <input 
                  type="date" 
                  value={rescheduleDateInput}
                  onChange={e => {
                    setRescheduleDateInput(e.target.value);
                    loadSlotsForReschedule(e.target.value);
                  }}
                  required
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Available Times for Date</label>
                
                {availableSlotsForDate.length === 0 ? (
                  <p className="text-xs text-zinc-400 bg-zinc-50 p-4 border rounded-xl font-medium">No available slots found on this date. Please try another date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto pr-1">
                    {availableSlotsForDate.map(slot => {
                      const isSelected = selectedRescheduleSlotId === slot.slotId;
                      return (
                        <button
                          key={slot.slotId}
                          type="button"
                          onClick={() => setSelectedRescheduleSlotId(slot.slotId)}
                          className={`h-11 rounded-xl border text-xs font-extrabold transition-all flex flex-col items-center justify-center ${
                            isSelected 
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                              : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-600'
                          }`}
                        >
                          <span>{slot.startTime.slice(0, 5)}</span>
                          <span className={`text-[8px] ${isSelected ? 'text-purple-200' : 'text-zinc-400'}`}>
                            {slot.slotDurationMinutes} mins
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                onClick={() => { setRescheduleBooking(null); setSelectedRescheduleSlotId(null); setAvailableSlotsForDate([]); }}
                className="h-10 text-zinc-500 hover:bg-zinc-50 px-4 rounded-xl text-xs font-bold transition-all"
              >
                Go Back
              </button>
              <Button
                onClick={handleRescheduleSubmit}
                disabled={!selectedRescheduleSlotId || isRescheduling}
                className="h-10 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                {isRescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
