import React, { useState, useEffect } from 'react';
import { Footer } from './common/Footer';

// Customization Configuration
const CONFIG = {
  PRODUCT_NAME: 'NConnect',
  DEMO_DURATION: 30,
  CONTACT_EMAIL: 'demo@nconnect.com',
  ORGANIZER_NAME: 'NConnect Demo Team',
  TRUST_CHIPS: ['SOC 2 Certified', '4.9 ★ G2 Rating', 'ISO 27001', '500+ Companies', '99.9% Uptime'],
  WHAT_YOU_LL_LEARN: [
    'How to digitize FAT & ITP workflows end-to-end',
    'Real-time equipment calibration tracking',
    'Multi-stakeholder approval workflows',
    'Automated report generation and PDF export',
    'Role-based access for teams and clients',
    'Integration with your existing tools',
  ],
};

interface Timezone {
  timezoneId: number;
  label: string;
  ianaIdentifier: string;
  utcOffsetDisplay: string;
}

interface Slot {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isAvailable: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  company: string;
  teamSize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  message?: string;
}

interface FormErrors {
  [key: string]: boolean;
}

export function ScheduleDemo({
  onBack,
  onNavigateToAboutUs,
  onNavigateToContact,
  onNavigateToPrivacyPolicy,
  onNavigateToTermsOfService,
  onNavigateToDataDeletion
}: {
  onBack?: () => void;
  onNavigateToAboutUs?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToPrivacyPolicy?: () => void;
  onNavigateToTermsOfService?: () => void;
  onNavigateToDataDeletion?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    teamSize: '1-10',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // API State
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedSlotObj, setSelectedSlotObj] = useState<Slot | null>(null);
  const [calendarStartDate, setCalendarStartDate] = useState(new Date());
  const [timezoneId, setTimezoneId] = useState<number>(8); // Default to IST (8)
  const [timezoneLabel, setTimezoneLabel] = useState('IST (India)');

  // 1. Fetch Timezones on mount
  useEffect(() => {
    fetch('/api/v1/demo-scheduler/timezones')
      .then(res => res.json())
      .then(data => {
        if (data.timezones) {
          setTimezones(data.timezones);
          // Try to match system timezone if possible
          const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const match = data.timezones.find((t: Timezone) => t.ianaIdentifier === systemTz);
          if (match) {
            setTimezoneId(match.timezoneId);
            setTimezoneLabel(match.label);
          }
        }
      })
      .catch(err => console.error('Failed to fetch timezones', err));
  }, []);

  // 2. Fetch Slots when month changes
  useEffect(() => {
    const monthStr = `${calendarStartDate.getFullYear()}-${String(calendarStartDate.getMonth() + 1).padStart(2, '0')}`;
    setIsLoadingSlots(true);
    fetch(`/api/v1/demo-scheduler/slots/available?month=${monthStr}`)
      .then(res => res.json())
      .then(data => {
        if (data.slots) {
          setAvailableSlots(data.slots);
        }
        setIsLoadingSlots(false);
      })
      .catch(err => {
        console.error('Failed to fetch slots', err);
        setIsLoadingSlots(false);
      });
  }, [calendarStartDate]);

  const validateAndNext = () => {
    const errors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) errors.firstName = true;
    if (!formData.lastName.trim()) errors.lastName = true;
    if (!formData.email.trim() || !emailPattern.test(formData.email)) errors.email = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.company.trim()) errors.company = true;

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentStep(2);
    }
  };

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setSelectedSlotId(null);
    setSelectedSlotObj(null);
  };

  const selectTime = (slot: Slot) => {
    setSelectedSlotId(slot.slotId);
    setSelectedSlotObj(slot);
  };

  const shiftCalendar = (days: number) => {
    const newDate = new Date(calendarStartDate);
    newDate.setDate(newDate.getDate() + days);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate >= today || days > 0) {
      setCalendarStartDate(newDate);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlotId) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/demo-scheduler/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          workEmail: formData.email,
          phoneNumber: formData.phone,
          companyName: formData.company,
          slotId: selectedSlotId,
          timezoneId: timezoneId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Booking failed. Please try again.');
      }

      setCurrentStep(3);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToGoogleCalendar = () => {
    if (!selectedSlotObj) return;

    const [hours, minutes] = selectedSlotObj.startTime.split(':');
    const startTime = new Date(selectedSlotObj.slotDate);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + selectedSlotObj.slotDurationMinutes);

    const formatGoogleDate = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');

    const title = `${CONFIG.PRODUCT_NAME} Demo`;
    const details = `Demo session with ${formData.firstName} ${formData.lastName} from ${formData.company}`;
    const location = 'Video Call';

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${formatGoogleDate(startTime)}/${formatGoogleDate(endTime)}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}`;

    window.open(url, '_blank');
  };

  const downloadICS = () => {
    if (!selectedSlotObj) return;

    const [hours, minutes] = selectedSlotObj.startTime.split(':');
    const startTime = new Date(selectedSlotObj.slotDate);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + selectedSlotObj.slotDurationMinutes);

    const formatICSDate = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${CONFIG.PRODUCT_NAME}//Demo Booking//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
DTSTAMP:${formatICSDate(new Date())}
ORGANIZER;CN=${CONFIG.ORGANIZER_NAME}:mailto:${CONFIG.CONTACT_EMAIL}
UID:${Date.now()}@${CONFIG.PRODUCT_NAME.toLowerCase()}.com
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${formData.firstName} ${
      formData.lastName
    }:mailto:${formData.email}
SUMMARY:${CONFIG.PRODUCT_NAME} Demo
DESCRIPTION:Personalized demo session for ${formData.company}
LOCATION:Video Call
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${CONFIG.PRODUCT_NAME}-demo.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', teamSize: '1-10' });
    setFormErrors({});
    setSelectedDate(null);
    setSelectedSlotId(null);
    setSelectedSlotObj(null);
    setCalendarStartDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
                aria-label="Back to landing page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
              🔧
            </div>
            <div>
              <h1 className="font-bold text-gray-900">NConnect</h1>
              <p className="text-xs text-gray-600">Digital MEP Testing</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[380px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h2 className="text-4xl font-serif mb-4 text-gray-900">
              See{' '}
              <span className="italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NConnect
              </span>{' '}
              in action
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm mb-6 shadow-sm">
              <span>⏱️</span>
              <span>30-minute personalized demo</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-900">What you'll learn:</h3>
            <ul className="space-y-3">
              {CONFIG.WHAT_YOU_LL_LEARN.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {CONFIG.TRUST_CHIPS.map((chip, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 shadow-sm">
            Average response time: <strong className="text-green-600">Under 2 hours</strong>
          </div>
        </aside>

        {/* Form Card */}
        <main className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b-2 border-gray-200">
            {[
              { num: 1, label: 'Your details' },
              { num: 2, label: 'Pick a time' },
              { num: 3, label: 'Confirm' },
            ].map((tab) => (
              <div
                key={tab.num}
                className={`flex items-center gap-2 pb-4 relative ${
                  currentStep === tab.num
                    ? 'text-gray-900'
                    : currentStep > tab.num
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    currentStep === tab.num
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                      : currentStep > tab.num
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {currentStep > tab.num ? '✓' : tab.num}
                </div>
                <span className="font-medium">{tab.label}</span>
                {currentStep === tab.num && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Contact Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-3 bg-white border ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {formErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1.5">First name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-3 bg-white border ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {formErrors.lastName && <p className="text-xs text-red-500 mt-1.5">Last name is required</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 bg-white border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1.5">Valid work email is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 bg-white border ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {formErrors.phone && <p className="text-xs text-red-500 mt-1.5">Phone number is required</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle || ''}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={`w-full px-4 py-3 bg-white border ${
                      formErrors.company ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {formErrors.company && (
                    <p className="text-xs text-red-500 mt-1.5">Company name is required</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <select
                  value={formData.teamSize || '1-10'}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you hoping to solve? (Optional)
                </label>
                <textarea
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="Tell us about your current challenges..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                onClick={validateAndNext}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Continue to Date & Time
              </button>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <Step2Calendar
              calendarStartDate={calendarStartDate}
              selectedDate={selectedDate}
              selectedSlotId={selectedSlotId}
              timezones={timezones}
              timezoneId={timezoneId}
              availableSlots={availableSlots}
              isLoadingSlots={isLoadingSlots}
              onDateSelect={selectDate}
              onTimeSelect={selectTime}
              onShiftCalendar={shiftCalendar}
              onTimezoneChange={(id, label) => { setTimezoneId(id); setTimezoneLabel(label); }}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
              onSubmit={handleBookingSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && selectedSlotObj && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl">
                🎉
              </div>

              <div>
                <h3 className="text-2xl font-serif mb-2 text-gray-900">Demo Scheduled!</h3>
                <p className="text-gray-600">
                  Confirmation sent to <strong className="text-gray-900">{formData.email}</strong>
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-left space-y-3 shadow-sm">
                <DetailRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
                <DetailRow label="Company" value={formData.company} />
                <DetailRow
                  label="Date"
                  value={new Date(selectedSlotObj.slotDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
                <DetailRow label="Time" value={`${selectedSlotObj.startTime.slice(0,5)} (${selectedSlotObj.slotDurationMinutes} minutes)`} />
                <DetailRow
                  label="Timezone"
                  value={timezoneLabel}
                />
                <DetailRow label="Format" value="Video Call (Link will be sent via email)" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                📧 A calendar invite has been sent to your email
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={addToGoogleCalendar}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                >
                  📅 Add to Google Calendar
                </button>
                <button
                  onClick={downloadICS}
                  className="flex-1 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  📥 Download .ics
                </button>
              </div>

              <button
                onClick={resetForm}
                className="w-full py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Schedule Another Demo
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer
        onNavigateToAboutUs={onNavigateToAboutUs}
        onNavigateToContact={onNavigateToContact}
        onNavigateToPrivacyPolicy={onNavigateToPrivacyPolicy}
        onNavigateToTermsOfService={onNavigateToTermsOfService}
        onNavigateToDataDeletion={onNavigateToDataDeletion}
      />
    </div>
  );
}

// Helper Components
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function Step2Calendar({
  calendarStartDate,
  selectedDate,
  selectedSlotId,
  timezones,
  timezoneId,
  availableSlots,
  isLoadingSlots,
  onDateSelect,
  onTimeSelect,
  onShiftCalendar,
  onTimezoneChange,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
  submitError
}: {
  calendarStartDate: Date;
  selectedDate: string | null;
  selectedSlotId: string | null;
  timezones: Timezone[];
  timezoneId: number;
  availableSlots: Slot[];
  isLoadingSlots: boolean;
  onDateSelect: (dateKey: string) => void;
  onTimeSelect: (slot: Slot) => void;
  onShiftCalendar: (days: number) => void;
  onTimezoneChange: (id: number, label: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(calendarStartDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 13);

  const dates: Date[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const firstDayOfWeek = startDate.getDay();
  const emptySlots = Array(firstDayOfWeek).fill(null);

  // Group slots by date for easy lookup
  const slotsByDate: Record<string, Slot[]> = {};
  availableSlots.forEach(s => {
    if (!slotsByDate[s.slotDate]) slotsByDate[s.slotDate] = [];
    slotsByDate[s.slotDate].push(s);
  });

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Select a date</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Timezone:</span>
            <select
              value={timezoneId}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                const tz = timezones.find(t => t.timezoneId === id);
                if (tz) onTimezoneChange(id, tz.label);
              }}
              className="px-2 py-1 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz.timezoneId} value={tz.timezoneId}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => onShiftCalendar(-7)}
            disabled={startDate <= today}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-gray-700"
          >
            ← Previous Week
          </button>
          <span className="font-medium text-gray-900">
            {startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => onShiftCalendar(7)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 font-medium text-gray-700"
          >
            Next Week →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 relative">
          {isLoadingSlots && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 font-semibold py-2">
              {day}
            </div>
          ))}
          {emptySlots.map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {dates.map((date) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const dateKey = date.toDateString();
            const isPast = date < today;
            const isToday = date.getTime() === today.getTime();
            const hasSlots = slotsByDate[dateStr] && slotsByDate[dateStr].length > 0;
            const isAvailable = !isPast && hasSlots;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateKey}
                onClick={() => isAvailable && onDateSelect(dateStr)}
                disabled={!isAvailable}
                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                  isAvailable
                    ? isSelected
                      ? 'bg-green-500 border-green-500 text-white font-bold'
                      : 'bg-green-50 border-green-500 hover:bg-green-100 hover:scale-105 text-gray-900'
                    : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50 text-gray-400'
                } ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              >
                <span className="font-semibold">{date.getDate()}</span>
                <span className="text-[10px]">
                  {hasSlots ? `${slotsByDate[dateStr].length} slots` : (isPast ? '' : 'No slots')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Select a time</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {slotsByDate[selectedDate]?.map((slot) => {
              const isSelected = selectedSlotId === slot.slotId;
              return (
                <button
                  key={slot.slotId}
                  onClick={() => onTimeSelect(slot)}
                  className={`py-3 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? 'bg-green-500 border-green-500 text-white font-bold'
                      : 'bg-green-50 border-green-500 hover:bg-green-100 hover:-translate-y-1 text-gray-900'
                  }`}
                >
                  {slot.startTime.slice(0, 5)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-6">
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {submitError}
          </div>
        )}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-3">
            {selectedDate ? (
              <span className="px-4 py-2 bg-green-100 border border-green-500 rounded-full text-sm text-green-700 font-medium">
                📅{' '}
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            ) : null}
            {selectedSlotId ? (
              <span className="px-4 py-2 bg-green-100 border border-green-500 rounded-full text-sm text-green-700 font-medium">
                ⏰ {availableSlots.find(s => s.slotId === selectedSlotId)?.startTime.slice(0, 5)}
              </span>
            ) : null}
            {!selectedDate || !selectedSlotId ? (
              <span className="text-sm text-gray-600">Select date and time to continue</span>
            ) : null}
          </div>
          <button
            onClick={onSubmit}
            disabled={!selectedDate || !selectedSlotId || isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Booking...
              </>
            ) : 'Review Booking'}
          </button>
        </div>
      </div>

      <button
        onClick={onBack}
        className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all"
      >
        ← Back
      </button>
    </div>
  );
}
