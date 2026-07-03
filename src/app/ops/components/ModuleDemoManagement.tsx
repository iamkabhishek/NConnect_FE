'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Check, X, AlertTriangle, AlertCircle, RefreshCw, 
  User, Building, Plus, CalendarDays, Link as LinkIcon, Trash2, Mail, Users,
  ChevronLeft, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function ModuleDemoManagement() {
  const [activeQueueTab, setActiveQueueTab] = useState<'pending' | 'confirmed' | 'all'>('pending');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSelectedSuccessMessage] = useState<string | null>(null);

  // Calendar Management State
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [allSlots, setAllSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

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

  // Fetch all bookings
  const fetchBookings = () => {
    setIsLoading(true);
    fetch('/api/v1/ops/demo-scheduler/bookings')
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

  // Fetch all slots for calendar management
  const fetchAllSlots = (monthStr: string) => {
    setIsLoadingSlots(true);
    fetch(`/api/v1/ops/demo-scheduler/slots?month=${monthStr}`)
      .then(res => res.json())
      .then(data => {
        if (data.slots) {
          setAllSlots(data.slots);
        }
        setIsLoadingSlots(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingSlots(false);
      });
  };

  useEffect(() => {
    fetchBookings();
    
    // Set configMonth to current month by default
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setConfigMonth(monthStr);
    fetchAllSlots(monthStr);
  }, []);

  useEffect(() => {
    const monthStr = `${currentViewDate.getFullYear()}-${String(currentViewDate.getMonth() + 1).padStart(2, '0')}`;
    fetchAllSlots(monthStr);
  }, [currentViewDate]);

  // Filtered Bookings for the Table tabs
  const filteredBookings = bookings.filter(b => {
    if (activeQueueTab === 'pending') return b.booking.status === 'pending';
    if (activeQueueTab === 'confirmed') return b.booking.status === 'confirmed';
    return true; // All
  });

  const handleGenerateSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);
    setSelectedSuccessMessage(null);

    try {
      const res = await fetch('/api/v1/ops/demo-scheduler/schedule', {
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
      fetchAllSlots(configMonth);
    } catch (err: any) {
      setErrorMessage(err.message || 'Slot generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveBooking = async () => {
    if (!approvalModalBooking || !meetingLink) return;
    setIsApproving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/ops/demo-scheduler/bookings/${approvalModalBooking.booking.bookingId}/approve`, {
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

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Old slots will be restored.')) return;
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/ops/demo-scheduler/bookings/${bookingId}/cancel`, {
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

  const handleRescheduleSubmit = async () => {
    if (!rescheduleBooking || !selectedRescheduleSlotId) return;
    setIsRescheduling(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/ops/demo-scheduler/bookings/${rescheduleBooking.booking.bookingId}/reschedule`, {
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

  const toggleSlotAvailability = async (slotId: string) => {
    try {
      const res = await fetch(`/api/v1/ops/demo-scheduler/slots/${slotId}/toggle`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setAllSlots(prev => prev.map(s => s.slotId === slotId ? { ...s, isAvailable: !s.isAvailable } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDayAvailability = async (date: string, available: boolean) => {
    try {
      const res = await fetch(`/api/v1/ops/demo-scheduler/slots/day/${date}/toggle?available=${available}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setAllSlots(prev => prev.map(s => s.slotDate === date ? { ...s, isAvailable: available } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWorkingDayCheckboxChange = (dayNum: number) => {
    if (workingDays.includes(dayNum)) {
      setWorkingDays(workingDays.filter(d => d !== dayNum));
    } else {
      setWorkingDays([...workingDays, dayNum].sort());
    }
  };

  // Calendar Helpers
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentViewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentViewDate(newDate);
    setSelectedCalendarDate(null);
  };

  const slotsByDate: Record<string, any[]> = {};
  allSlots.forEach(s => {
    if (!slotsByDate[s.slotDate]) slotsByDate[s.slotDate] = [];
    slotsByDate[s.slotDate].push(s);
  });

  return (
    <div className="space-y-8 select-none">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-purple-600" />
          Demo Management
        </h1>
        <p className="text-xs text-zinc-500 font-medium">Manage demo requests, configure availability, and maintain the scheduling calendar.</p>
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
        
        {/* LEFT COLUMN: Booking Queue */}
        <div className="xl:col-span-12 space-y-6">
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base">Booking Queue</h3>
                  <p className="text-[11px] text-zinc-400 font-medium">Manage demo requests from prospects.</p>
                </div>
              </div>

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
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 text-xs">
                              {b.user.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-extrabold text-zinc-800">{b.user.firstName} {b.user.lastName}</p>
                              <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {b.user.workEmail}
                              </p>
                              <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3" /> {b.user.companyName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <p className="font-bold text-zinc-800">
                            {new Date(b.slot.slotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {b.slot.startTime.slice(0, 5)} - {b.slot.endTime.slice(0, 5)}
                          </p>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            b.booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : b.booking.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-zinc-100 text-zinc-500'
                          }`}>
                            {b.booking.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-2 space-x-1">
                          {b.booking.status === 'pending' && (
                            <button
                              onClick={() => setApprovalModalBooking(b)}
                              className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleCancelBooking(b.booking.bookingId)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Calendar Availability Manager */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base">Availability Calendar</h3>
                  <p className="text-[11px] text-zinc-400 font-medium">Click a date to manage individual slots.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-zinc-100 rounded-xl transition-all">
                  <ChevronLeft className="w-5 h-5 text-zinc-600" />
                </button>
                <span className="text-sm font-bold text-zinc-900 min-w-[120px] text-center">
                  {currentViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-zinc-100 rounded-xl transition-all">
                  <ChevronRight className="w-5 h-5 text-zinc-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-mono font-bold text-zinc-400 uppercase pb-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 relative">
              {isLoadingSlots && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
              )}
              {Array(firstDayOfMonth(currentViewDate)).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {Array(daysInMonth(currentViewDate)).fill(null).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentViewDate.getFullYear()}-${String(currentViewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasSlots = slotsByDate[dateStr]?.length > 0;
                const allAvailable = hasSlots && slotsByDate[dateStr].every(s => s.isAvailable);
                const someAvailable = hasSlots && slotsByDate[dateStr].some(s => s.isAvailable);
                const isSelected = selectedCalendarDate === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedCalendarDate(isSelected ? null : dateStr)}
                    className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center p-1 group relative ${
                      isSelected 
                        ? 'ring-2 ring-purple-600 ring-offset-2' 
                        : ''
                    } ${
                      hasSlots 
                        ? allAvailable 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : someAvailable 
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                    }`}
                  >
                    <span className="text-sm font-bold">{day}</span>
                    {hasSlots && (
                      <span className="text-[8px] font-bold mt-0.5 uppercase opacity-60">
                        {slotsByDate[dateStr].filter(s => s.isAvailable).length}/{slotsByDate[dateStr].length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Date Slot Detail */}
            {selectedCalendarDate && (
              <div className="mt-8 p-6 bg-zinc-50 border border-zinc-200 rounded-3xl animate-scale-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-zinc-900">Manage Slots for {new Date(selectedCalendarDate).toLocaleDateString('default', { month: 'short', day: 'numeric' })}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-200 text-zinc-600 rounded-full font-bold uppercase tracking-wider">
                      {slotsByDate[selectedCalendarDate]?.length || 0} Slots
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleDayAvailability(selectedCalendarDate, true)}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-all"
                    >
                      Enable All
                    </button>
                    <button 
                      onClick={() => toggleDayAvailability(selectedCalendarDate, false)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-all"
                    >
                      Disable All
                    </button>
                  </div>
                </div>

                {(!slotsByDate[selectedCalendarDate] || slotsByDate[selectedCalendarDate].length === 0) ? (
                  <p className="text-xs text-zinc-400 italic">No slots generated for this date. Use the Monthly Generator on the right to create slots.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {slotsByDate[selectedCalendarDate].map(slot => (
                      <button
                        key={slot.slotId}
                        onClick={() => toggleSlotAvailability(slot.slotId)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 group relative ${
                          slot.isAvailable 
                            ? 'bg-white border-emerald-500 text-emerald-700' 
                            : 'bg-zinc-100 border-zinc-300 text-zinc-400 grayscale'
                        }`}
                      >
                        <span className="text-xs font-black">{slot.startTime.slice(0, 5)}</span>
                        {slot.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Slot Generator */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-purple-600" />
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
                    className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">End (Local) *</label>
                  <input 
                    type="time" 
                    value={dailyEndTime.slice(0, 5)}
                    onChange={e => setDailyEndTime(`${e.target.value}:00`)}
                    required
                    className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-medium focus:outline-none"
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
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600'
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
                            : 'bg-zinc-50 border border-zinc-200 text-zinc-500'
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
                className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all mt-6 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Available Slots'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* APPROVAL MODAL */}
      {approvalModalBooking && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-2xl w-full max-w-lg relative">
            <button onClick={() => setApprovalModalBooking(null)} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-zinc-900 text-lg mb-2">Approve Demo Booking</h3>
            <p className="text-xs text-zinc-400 mb-6 font-medium">For: {approvalModalBooking.user.firstName} {approvalModalBooking.user.lastName}</p>
            <div className="space-y-1.5 mb-6">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Video Call URL *</label>
              <input 
                type="url" 
                placeholder="https://zoom.us/j/..."
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-sm font-medium focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button onClick={handleApproveBooking} disabled={!meetingLink || isApproving} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 rounded-xl text-xs">
                {isApproving ? 'Approving...' : 'Confirm Approval'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleBooking && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-2xl w-full max-w-lg relative">
            <button onClick={() => setRescheduleBooking(null)} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-zinc-900 text-lg mb-2">Reschedule Booking</h3>
            <div className="space-y-4">
              <input 
                type="date" 
                value={rescheduleDateInput}
                onChange={e => { setRescheduleDateInput(e.target.value); loadSlotsForReschedule(e.target.value); }}
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                {availableSlotsForDate.map(slot => (
                  <button
                    key={slot.slotId}
                    onClick={() => setSelectedRescheduleSlotId(slot.slotId)}
                    className={`h-10 rounded-xl border text-xs font-bold ${selectedRescheduleSlotId === slot.slotId ? 'bg-purple-600 text-white' : 'bg-zinc-50 text-zinc-600'}`}
                  >
                    {slot.startTime.slice(0, 5)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6">
              <Button onClick={handleRescheduleSubmit} disabled={!selectedRescheduleSlotId || isRescheduling} className="h-10 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 rounded-xl text-xs">
                {isRescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
