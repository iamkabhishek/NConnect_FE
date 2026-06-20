import { useState } from 'react';
import { Calendar, X, Clock, Users, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Group } from './GroupsTable';

interface ScheduleCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

// Mock verified sender emails - in production, this would come from workspace settings
const VERIFIED_SENDER_EMAILS = [
  { id: '1', email: 'noreply@nconnect.com', name: 'NConnect No-Reply', isVerified: true },
  { id: '2', email: 'support@nconnect.com', name: 'NConnect Support', isVerified: true },
  { id: '3', email: 'marketing@nconnect.com', name: 'Marketing Team', isVerified: true },
];

// Mock published templates - in production, this would come from workspace published templates
const PUBLISHED_TEMPLATES = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to NConnect!',
    body: 'Hi there,\n\nWelcome to NConnect! We\'re excited to have you on board.\n\nBest regards,\nThe NConnect Team',
    category: 'Onboarding'
  },
  {
    id: '2',
    name: 'Newsletter Update',
    subject: 'Monthly Newsletter - January 2025',
    body: 'Hello,\n\nHere\'s what\'s new this month at NConnect!\n\nStay tuned for exciting content!\n\nRegards,\nMarketing Team',
    category: 'Marketing'
  },
  {
    id: '3',
    name: 'Promotional Offer',
    subject: 'Exclusive Offer Just For You!',
    body: 'Dear valued customer,\n\nWe have a special offer just for you.\n\nCheck it out before it expires!\n\nBest,\nSales Team',
    category: 'Promotional'
  },
];

export function ScheduleCampaignDialog({ isOpen, onClose, group }: ScheduleCampaignDialogProps) {
  const [campaignName, setCampaignName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get minimum time if date is today
  const getMinTime = () => {
    if (scheduleDate === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '';
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (!templateId) {
      // If cleared, reset subject and message
      setSubject('');
      setMessage('');
      return;
    }

    const template = PUBLISHED_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.body);
      
      // Auto-generate campaign name if empty
      if (!campaignName) {
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        setCampaignName(`${template.name} - ${group?.name} - ${dateStr}`);
      }
    }
  };

  const handleSchedule = async () => {
    if (!group || !campaignName || !fromEmail || !selectedTemplate || !subject || !message) return;
    
    if (scheduleType === 'later' && (!scheduleDate || !scheduleTime)) return;

    setIsScheduling(true);

    // Simulate scheduling campaign
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsScheduling(false);
    
    // Format schedule info
    let scheduleInfo = 'immediately';
    if (scheduleType === 'later') {
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      scheduleInfo = scheduledDateTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    
    // Reset form
    resetForm();
    
    // Show success message
    if (scheduleType === 'now') {
      alert(`Campaign "${campaignName}" is being sent to ${group.contactCount} contacts in "${group.name}" from ${fromEmail}`);
    } else {
      alert(`Campaign "${campaignName}" scheduled for ${scheduleInfo}\nRecipients: ${group.contactCount} contacts in "${group.name}"\nFrom: ${fromEmail}`);
    }
    
    onClose();
  };

  const resetForm = () => {
    setCampaignName('');
    setFromEmail('');
    setSelectedTemplate('');
    setSubject('');
    setMessage('');
    setScheduleType('now');
    setScheduleDate('');
    setScheduleTime('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = () => {
    const baseValid = campaignName && fromEmail && selectedTemplate && subject && message;
    if (scheduleType === 'later') {
      return baseValid && scheduleDate && scheduleTime;
    }
    return baseValid;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="size-5 mr-2 text-blue-600" />
            Schedule Campaign for Group
          </DialogTitle>
          <DialogDescription>
            Create and schedule an email campaign for {group?.name || 'this group'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Info */}
          <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 flex-1">
              <div 
                className="size-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: group?.color || '#4A90E2' }}
              >
                <Users className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{group?.name}</div>
                <div className="text-xs text-gray-600">
                  {group?.contactCount?.toLocaleString() || 0} contacts • {group?.id}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Name */}
          <div>
            <Label htmlFor="campaign-name" className="text-sm font-medium text-gray-700">
              Campaign Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="campaign-name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., January Newsletter - Premium Members"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This name is for internal tracking only and won't be visible to recipients
            </p>
          </div>

          {/* Schedule Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              When to send <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScheduleType('now')}
                className={`px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                  scheduleType === 'now'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Send className="size-4" />
                  <span>Send Now</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('later')}
                className={`px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                  scheduleType === 'later'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="size-4" />
                  <span>Schedule for Later</span>
                </div>
              </button>
            </div>
          </div>

          {/* Schedule Date/Time - Only show if "later" is selected */}
          {scheduleType === 'later' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <Label htmlFor="schedule-date" className="text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={today}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="schedule-time" className="text-sm font-medium text-gray-700">
                  Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  min={getMinTime()}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* From Email */}
          <div>
            <Label htmlFor="from-email" className="text-sm font-medium text-gray-700">
              From <span className="text-red-500">*</span>
            </Label>
            <Select value={fromEmail} onValueChange={setFromEmail}>
              <SelectTrigger id="from-email" className="mt-1">
                <SelectValue placeholder="Select sender email" />
              </SelectTrigger>
              <SelectContent>
                {VERIFIED_SENDER_EMAILS.map((sender) => (
                  <SelectItem key={sender.id} value={sender.email}>
                    <div className="flex items-center gap-2">
                      <span>{sender.name}</span>
                      <span className="text-xs text-gray-500">({sender.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Selection */}
          <div>
            <Label htmlFor="template" className="text-sm font-medium text-gray-700">
              Template <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger id="template" className="mt-1">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {PUBLISHED_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col">
                      <span>{template.name}</span>
                      <span className="text-xs text-gray-500">{template.category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplate && (
              <p className="text-xs text-gray-500 mt-1">
                Template selected. You can still edit the content below.
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="mt-1"
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              className="mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length} characters
            </p>
          </div>

          {/* Warning Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="size-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-orange-800">
                <strong>Important:</strong> This campaign will be sent to {group?.contactCount?.toLocaleString() || 0} contacts. 
                Make sure you have proper consent and the content complies with GDPR/CAN-SPAM regulations.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isScheduling}>
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!isFormValid() || isScheduling}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isScheduling ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {scheduleType === 'now' ? 'Sending...' : 'Scheduling...'}
                </>
              ) : (
                <>
                  {scheduleType === 'now' ? (
                    <>
                      <Send className="size-4 mr-2" />
                      Send Now
                    </>
                  ) : (
                    <>
                      <Calendar className="size-4 mr-2" />
                      Schedule Campaign
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
