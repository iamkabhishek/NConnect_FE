import { useState } from 'react';
import { Mail, X, Send, Paperclip, AlertCircle } from 'lucide-react';
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
import { Contact } from './ContactsTable';

interface SendEmailDialogProps {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
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
    subject: 'Welcome to NConnect, {{firstName}}!',
    body: 'Hi {{firstName}},\n\nWelcome to NConnect! We\'re excited to have you on board.\n\nYour registered email is: {{email}}\n\nBest regards,\nThe NConnect Team',
    category: 'Onboarding'
  },
  {
    id: '2',
    name: 'Newsletter Subscription',
    subject: 'You\'re subscribed to our newsletter',
    body: 'Hello {{firstName}} {{lastName}},\n\nThank you for subscribing to our newsletter! You\'ll receive updates at {{email}}.\n\nStay tuned for exciting content!\n\nRegards,\nMarketing Team',
    category: 'Marketing'
  },
  {
    id: '3',
    name: 'Account Verification',
    subject: 'Verify your account - {{email}}',
    body: 'Dear {{firstName}},\n\nPlease verify your account registered with email: {{email}}\n\nIf you have any questions, feel free to contact us.\n\nBest,\nSupport Team',
    category: 'Transactional'
  },
];

export function SendEmailDialog({ open, onClose, contact }: SendEmailDialogProps) {
  const [fromEmail, setFromEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Function to replace template variables with contact data
  const replaceTemplateVariables = (text: string, contact: Contact | null) => {
    if (!contact) return text;
    
    return text
      .replace(/{{firstName}}/g, contact.firstName || '')
      .replace(/{{lastName}}/g, contact.lastName || '')
      .replace(/{{name}}/g, contact.name || '')
      .replace(/{{email}}/g, contact.email || '')
      .replace(/{{phone}}/g, contact.phone || '')
      .replace(/{{company}}/g, contact.company || '')
      .replace(/{{jobTitle}}/g, contact.jobTitle || '')
      .replace(/{{city}}/g, contact.city || '')
      .replace(/{{country}}/g, contact.country || '');
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
      // Replace variables in subject and body with contact data
      const populatedSubject = replaceTemplateVariables(template.subject, contact);
      const populatedBody = replaceTemplateVariables(template.body, contact);
      
      setSubject(populatedSubject);
      setMessage(populatedBody);
    }
  };

  const handleSend = async () => {
    if (!contact || !fromEmail || !subject || !message) return;

    setIsSending(true);

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSending(false);
    
    // Reset form
    setFromEmail('');
    setSubject('');
    setMessage('');
    
    // Show success message
    alert(`Email sent successfully to ${contact.email} from ${fromEmail}`);
    
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="size-5 mr-2 text-blue-600" />
            Send Email
          </DialogTitle>
          <DialogDescription>
            Compose and send an email to {contact?.name || 'this contact'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient */}
          <div>
            <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
              To
            </Label>
            <div className="mt-1 flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 flex-1">
                <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {contact?.name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{contact?.name}</div>
                  <div className="text-xs text-gray-600">{contact?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* From */}
          <div>
            <Label htmlFor="from" className="text-sm font-medium text-gray-700">
              From <span className="text-red-500">*</span>
            </Label>
            <Select
              value={fromEmail}
              onValueChange={(value) => setFromEmail(value)}
              className="mt-1"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a verified sender email">
                  {fromEmail ? (
                    VERIFIED_SENDER_EMAILS.find((email) => email.email === fromEmail)?.name
                  ) : (
                    'Select a verified sender email'
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {VERIFIED_SENDER_EMAILS.map((email) => (
                  <SelectItem key={email.id} value={email.email}>
                    {email.name} ({email.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template */}
          <div>
            <Label htmlFor="template" className="text-sm font-medium text-gray-700">
              Template
            </Label>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateSelect}
              className="mt-1"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a template">
                  {selectedTemplate ? (
                    PUBLISHED_TEMPLATES.find((template) => template.id === selectedTemplate)?.name
                  ) : (
                    'Select a template'
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PUBLISHED_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This email will be sent through your configured ESP integration. 
              Make sure you have proper consent to email this contact.
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
                  Sending...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}