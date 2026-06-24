'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Briefcase, Users, Calendar, Clock, Globe, 
  CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Loader2, Sparkles 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface DemoBookingWizardProps {
  onBackToLanding?: () => void;
}

export function DemoBookingWizard({ onBackToLanding }: DemoBookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timezones loaded from API
  const [timezones, setTimezones] = useState<any[]>([]);
  const [selectedTimezoneId, setSelectedTimezoneId] = useState<number>(8); // Default IST (8)
  const [selectedTimezone, setSelectedTimezone] = useState<any>({
    timezoneId: 8,
    label: 'IST (India)',
    ianaIdentifier: 'Asia/Calcutta'
  });

  // Step 1 Form Data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    phoneNumber: '',
    jobTitle: '',
    companyName: '',
    teamSize: ''
  });

  // Step 2 Selection State
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);

  // Final Confirmation Metadata
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Fetch supported timezones
  useEffect(() => {
    fetch('/api/v1/demo-scheduler/timezones')
      .then(res => res.json())
      .then(data => {
        if (data.timezones) {
          setTimezones(data.timezones);
          const ist = data.timezones.find((tz: any) => tz.timezoneId === 8);
          if (ist) setSelectedTimezone(ist);
        }
      })
      .catch(err => console.error('Failed to load timezones:', err));
  }, []);

  // Fetch available slots for the upcoming weeks
  useEffect(() => {
    if (step === 2) {
      setIsLoading(true);
      // Fetch available slots for next 30 days
      const today = new Date().toISOString().slice(0, 7); // Current month
      fetch(`/api/v1/demo-scheduler/slots/available?month=${today}`)
        .then(res => res.json())
        .then(data => {
          if (data.slots) {
            setAvailableSlots(data.slots);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [step]);

  // Handle timezone change and recalculate displayed offset times
  const handleTimezoneChange = (id: number) => {
    setSelectedTimezoneId(id);
    const tz = timezones.find(t => t.timezoneId === id);
    if (tz) setSelectedTimezone(tz);
  };

  // Helper to format UTC slot time into target timezone local display time
  const formatSlotTime = (dateStr: string, timeStr: string) => {
    try {
      const utcDate = new Date(`${dateStr}T${timeStr}Z`);
      return utcDate.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone.ianaIdentifier,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr.slice(0, 5);
    }
  };

  // Group available slots by date
  const groupedDates = availableSlots.reduce((acc: Record<string, any[]>, slot) => {
    if (!acc[slot.slotDate]) {
      acc[slot.slotDate] = [];
    }
    acc[slot.slotDate].push(slot);
    return acc;
  }, {});

  // Sorting dates chronologically
  const uniqueDates = Object.keys(groupedDates).sort();

  // Validate Step 1 form fields
  const validateStep1 = () => {
    const { firstName, lastName, workEmail, phoneNumber, companyName, teamSize } = formData;
    if (!firstName || !lastName || !workEmail || !phoneNumber || !companyName || !teamSize) {
      setErrorMessage('Please fill in all required fields.');
      return false;
    }
    // Simple Email Regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(workEmail)) {
      setErrorMessage('Please enter a valid work email address.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Submit Step 3 booking request
  const submitBooking = async () => {
    if (!selectedSlotId) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/demo-scheduler/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slotId: selectedSlotId,
          timezoneId: selectedTimezoneId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete booking.');
      }

      setBookingResult(data.booking);
      setStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 selection:bg-blue-500/30 font-sans relative overflow-hidden">
      {/* Premium Glow Accents */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Booking Card Wrapper */}
      <div className="w-full max-w-4xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative">
        
        {/* Header Block */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-100">NConnect Demo Booking</span>
          </div>
          {step < 3 && (
            <button 
              onClick={onBackToLanding}
              className="text-xs text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          )}
        </div>

        {/* Stepper Indicators */}
        <div className="flex items-center justify-center gap-3 mb-10 max-w-md mx-auto">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                  step === num 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20 scale-110' 
                    : step > num 
                      ? 'bg-zinc-800 text-zinc-400 border-zinc-700' 
                      : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                }`}>
                  {num}
                </div>
                <span className={`text-xs font-semibold ${step === num ? 'text-zinc-100' : 'text-zinc-500'}`}>
                  {num === 1 ? 'Details' : num === 2 ? 'Schedule' : 'Confirmed'}
                </span>
              </div>
              {num < 3 && <div className={`h-0.5 w-10 ${step > num ? 'bg-zinc-800' : 'bg-zinc-900'}`} />}
            </React.Fragment>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {errorMessage === 'SLOT_NO_LONGER_AVAILABLE' 
              ? 'This slot was just booked by another user! Please select another slot.' 
              : errorMessage === 'DUPLICATE_ACTIVE_BOOKING'
                ? 'An active booking already exists with this email address.'
                : errorMessage}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Details Submission */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="John"
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full h-11 bg-zinc-950/60 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Last Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full h-11 bg-zinc-950/60 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Work Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input 
                      type="email" 
                      placeholder="john@company.com"
                      value={formData.workEmail}
                      onChange={e => setFormData({...formData, workEmail: e.target.value})}
                      className="w-full h-11 bg-zinc-950/60 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full h-11 bg-zinc-950/60 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company Name *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Company Inc."
                      value={formData.companyName}
                      onChange={e => setFormData({...formData, companyName: e.target.value})}
                      className="w-full h-11 bg-zinc-950/60 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Team Size *</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500 z-10" />
                    <select 
                      value={formData.teamSize}
                      onChange={e => setFormData({...formData, teamSize: e.target.value})}
                      className="w-full h-11 bg-zinc-950/60 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all appearance-none cursor-pointer text-zinc-300"
                    >
                      <option value="">Select Team Size</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="201-500">201–500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                    <div className="absolute right-4 top-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-6 flex justify-end">
                <Button 
                  onClick={() => { if (validateStep1()) setStep(2); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 px-6 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-95 transition-all"
                >
                  Pick a Date & Time
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Timezone & Calendar Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Timezone Selector row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-zinc-400" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Select Timezone</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">All slot hours will be rendered relative to this selection.</p>
                  </div>
                </div>
                <div className="relative min-w-[200px]">
                  <select 
                    value={selectedTimezoneId}
                    onChange={e => handleTimezoneChange(Number(e.target.value))}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-xl px-3 text-xs font-semibold focus:outline-none appearance-none cursor-pointer text-zinc-300"
                  >
                    {timezones.map(tz => (
                      <option key={tz.timezoneId} value={tz.timezoneId}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3.5 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-400 pointer-events-none" />
                </div>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : uniqueDates.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-zinc-500 gap-2 border border-dashed border-zinc-800 rounded-2xl">
                  <Calendar className="w-8 h-8 text-zinc-600" />
                  <p className="text-sm font-semibold">No available slots found for this month.</p>
                  <p className="text-xs text-zinc-600">Please check back later or contact platform support.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[300px]">
                  
                  {/* Left Column: Dates selection list */}
                  <div className="md:col-span-5 space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1 mb-2">Available Dates</h5>
                    {uniqueDates.map(dateKey => {
                      const d = new Date(dateKey);
                      const isSelected = selectedDate === dateKey;
                      return (
                        <button
                          key={dateKey}
                          onClick={() => { setSelectedDate(dateKey); setSelectedSlotId(null); }}
                          className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-bold shadow-md' 
                              : 'bg-zinc-950/20 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:bg-zinc-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <div>
                              <p className="text-xs font-bold">{d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                              <p className="text-[10px] text-zinc-500 font-medium">{groupedDates[dateKey].length} slot(s) available</p>
                            </div>
                          </div>
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-500 animate-pulse' : 'bg-transparent'}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Time slots timeline selection buttons */}
                  <div className="md:col-span-7 space-y-2">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Available Times</h5>
                    
                    {!selectedDate ? (
                      <div className="h-[260px] border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-500 gap-1.5 p-4 text-center">
                        <Clock className="w-6 h-6 text-zinc-600" />
                        <p className="text-xs font-bold text-zinc-400">Select an Available Date</p>
                        <p className="text-[10px] text-zinc-600 max-w-xs leading-relaxed">Choose a date from the calendar to display corresponding times relative to your timezone.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[260px] overflow-y-auto pr-1">
                        {groupedDates[selectedDate].map((slot) => {
                          const isSelected = selectedSlotId === slot.slotId;
                          const formattedTime = formatSlotTime(slot.slotDate, slot.startTime);
                          return (
                            <button
                              key={slot.slotId}
                              onClick={() => { setSelectedSlotId(slot.slotId); setSelectedSlot(slot); }}
                              className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 scale-102' 
                                  : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:bg-zinc-900/40'
                              }`}
                            >
                              <span className="text-xs font-bold">{formattedTime}</span>
                              <span className={`text-[9px] ${isSelected ? 'text-blue-200' : 'text-zinc-500'} font-semibold`}>
                                {slot.slotDurationMinutes} mins
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Step 2 buttons bar */}
              <div className="pt-6 flex justify-between border-t border-zinc-800">
                <button
                  onClick={() => setStep(1)}
                  className="h-10 text-zinc-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Details
                </button>

                <Button
                  onClick={submitBooking}
                  disabled={!selectedSlotId || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 px-6 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Booking...
                    </>
                  ) : (
                    <>
                      Schedule Demo
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Complete & Confirmed */}
          {step === 3 && bookingResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 max-w-lg mx-auto"
            >
              {/* Success celebration animation checkmark */}
              <div className="flex justify-center mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-9 h-9 text-blue-500 animate-bounce-slow" />
                </motion.div>
              </div>

              {/* Status block */}
              <h2 className="text-3xl font-black mb-3 text-zinc-100 tracking-tight">Demo Request Submitted!</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Thank you for scheduling a demo. Your request is now **pending platform operator review**. A meeting confirmation containing details will be sent to your work email shortly!
              </p>

              {/* Metadata confirmation details summary card */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 mb-8 text-left space-y-4 shadow-inner">
                <h4 className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase pb-2 border-b border-zinc-800">
                  Meeting Details Summary
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Attendee Name</span>
                    <p className="text-xs font-bold text-zinc-200">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Work Email</span>
                    <p className="text-xs font-bold text-zinc-200 truncate">{formData.workEmail}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Company Name</span>
                    <p className="text-xs font-bold text-zinc-200">{formData.companyName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Team Size</span>
                    <p className="text-xs font-bold text-zinc-200">{formData.teamSize} employees</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Scheduled Time</span>
                    <p className="text-sm font-black text-blue-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedSlot?.slotDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      {' at '}
                      {formatSlotTime(selectedSlot?.slotDate, selectedSlot?.startTime)} ({selectedTimezone?.label})
                    </p>
                  </div>
                </div>
              </div>

              {/* Finish Actions */}
              <div className="flex justify-center">
                <Button 
                  onClick={onBackToLanding}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold h-11 px-8 rounded-xl active:scale-95 transition-all"
                >
                  Return to Home
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
