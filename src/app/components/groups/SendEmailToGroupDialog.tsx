import { useState } from 'react';
import { Mail, X, Send, Users, AlertCircle } from 'lucide-react';
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

interface SendEmailToGroupDialogProps {
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

export function SendEmailToGroupDialog({ isOpen, onClose, group }: SendEmailToGroupDialogProps) {
  const [fromEmail, setFromEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

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
    }
  };

  const handleSend = async () => {
    if (!group || !fromEmail || !subject || !message) return;

    setIsSending(true);

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSending(false);
    
    // Reset form
    setFromEmail('');
    setSelectedTemplate('');
    setSubject('');
    setMessage('');
    
    // Show success message
    alert(`Campaign sent successfully to ${group.contactCount} contacts in "${group.name}" from ${fromEmail}`);
    
    onClose();
  };

  const handleClose = () => {
    setFromEmail('');
    setSelectedTemplate('');
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="size-5 mr-2 text-blue-600" />
            Send Campaign to Group
          </DialogTitle>
          <DialogDescription>
            Send an email campaign to all contacts in {group?.name || 'this group'}
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
                  {group?.contactCount?.toLocaleString() || 0} contacts will receive this email
                </div>
              </div>
            </div>
          </div>

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
                <SelectValue placeholder="Choose a template or write custom email" />
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
              rows={10}
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
                <strong>Important:</strong> This email will be sent to {group?.contactCount?.toLocaleString() || 0} contacts. 
                Make sure you have proper consent and the content complies with GDPR/CAN-SPAM regulations.
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This campaign will be sent through your configured ESP integration. 
              You can track campaign performance in the Analytics section.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!fromEmail || !subject || !message || isSending}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSending ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending to {group?.contactCount || 0} contacts...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Send Campaign
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}