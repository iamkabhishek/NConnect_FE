import { useState } from 'react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
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
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  FileText,
  Users,
  Calendar,
  Eye,
  Send,
  Clock,
  Search,
  Star,
} from 'lucide-react';
import { getPublishedTemplates } from '@/app/data/templates';
import { TemplatePreviewDialog } from '@/app/components/templates/TemplatePreviewDialog';
import { Template } from '@/app/components/templates/types';

interface CampaignFormData {
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  preheader: string;
  templateId: string;
  recipientType: 'all' | 'groups' | 'contacts';
  selectedGroups: string[];
  selectedContacts: string[];
  scheduleType: 'now' | 'later';
  scheduledDate: string;
  scheduledTime: string;
}

// Sample groups and contacts data
const SAMPLE_GROUPS = [
  { 
    id: '1', 
    groupId: 'GRP-001',
    name: 'Newsletter Subscribers', 
    count: 3420,
    category: 'Marketing',
    tags: ['Newsletter', 'Active']
  },
  { 
    id: '2', 
    groupId: 'GRP-002',
    name: 'VIP Customers', 
    count: 450,
    category: 'Sales',
    tags: ['VIP', 'Premium']
  },
  { 
    id: '3', 
    groupId: 'GRP-003',
    name: 'Trial Users', 
    count: 1250,
    category: 'Onboarding',
    tags: ['Trial', 'New']
  },
  { 
    id: '4', 
    groupId: 'GRP-004',
    name: 'Inactive Users', 
    count: 820,
    category: 'Re-engagement',
    tags: ['Inactive', 'Dormant']
  },
];

const SAMPLE_CONTACTS = [
  { 
    id: '1', 
    contactId: 'CNT-001',
    name: 'John Doe', 
    email: 'john@example.com',
    tags: ['VIP', 'Active']
  },
  { 
    id: '2', 
    contactId: 'CNT-002',
    name: 'Jane Smith', 
    email: 'jane@example.com',
    tags: ['Newsletter', 'Premium']
  },
  { 
    id: '3', 
    contactId: 'CNT-003',
    name: 'Bob Johnson', 
    email: 'bob@example.com',
    tags: ['Trial', 'New']
  },
  { 
    id: '4', 
    contactId: 'CNT-004',
    name: 'Alice Williams', 
    email: 'alice@example.com',
    tags: ['Active', 'Newsletter']
  },
];

// Verified sender email addresses for the workspace
const VERIFIED_SENDER_EMAILS = [
  'hello@nconnect.com',
  'support@nconnect.com',
  'noreply@nconnect.com',
  'info@nconnect.com',
  'news@nconnect.com',
];

interface CreateCampaignPageProps {
  onBack?: () => void;
  onCreateCampaign?: (data: CampaignFormData) => void;
  onNavigate?: (page: string) => void;
  creationType?: 'scratch' | 'template' | 'quick';
}

export function CreateCampaignPage({ onBack, onCreateCampaign, onNavigate, creationType = 'scratch' }: CreateCampaignPageProps) {
  const [userName] = useState('John Doe');
  const [workspaceName] = useState('My Workspace');
  const [workspaceColor] = useState('#4A90E2');
  const [workspaceId] = useState('workspace-1'); // Current workspace ID

  // Determine total steps based on creation type
  const totalSteps = creationType === 'quick' ? 3 : 5;

  const [currentStep, setCurrentStep] = useState(1);

  // Generate Campaign ID on component mount
  const [campaignId] = useState(() => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const campaignNumber = String(timestamp % 10000 + randomNum).padStart(3, '0');
    return `${workspaceName}-C${campaignNumber}`;
  });

  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    subject: '',
    fromName: 'NConnect',
    fromEmail: 'hello@nconnect.com',
    replyTo: '',
    preheader: '',
    templateId: '',
    recipientType: 'all',
    selectedGroups: [],
    selectedContacts: [],
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: '',
  });

  // Search states
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');

  // Preview dialog state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (onNavigate) {
      onNavigate('campaigns');
    }
  };

  const handleSubmit = () => {
    if (onCreateCampaign) {
      onCreateCampaign(formData);
    }
  };

  const selectedTemplate = getPublishedTemplates(workspaceId).find((t) => t.id === formData.templateId);

  // Filter published templates based on search query and category filter
  const getFilteredTemplates = () => {
    return getPublishedTemplates(workspaceId).filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
      const matchesCategory = templateCategoryFilter === 'all' || template.category === templateCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  };

  const getTotalRecipients = () => {
    if (formData.recipientType === 'all') {
      return SAMPLE_GROUPS.reduce((sum, group) => sum + group.count, 0);
    }
    if (formData.recipientType === 'groups') {
      return formData.selectedGroups.reduce((sum, groupId) => {
        const group = SAMPLE_GROUPS.find((g) => g.id === groupId);
        return sum + (group?.count || 0);
      }, 0);
    }
    return formData.selectedContacts.length;
  };

  // Define steps based on creation type
  const getSteps = () => {
    if (creationType === 'quick') {
      return [
        { number: 1, title: 'Campaign Setup', icon: Mail },
        { number: 2, title: 'Choose Recipients', icon: Users },
        { number: 3, title: 'Review & Send', icon: Eye },
      ];
    }
    
    if (creationType === 'template') {
      return [
        { number: 1, title: 'Select Template', icon: FileText },
        { number: 2, title: 'Campaign Details', icon: Mail },
        { number: 3, title: 'Choose Recipients', icon: Users },
        { number: 4, title: 'Schedule', icon: Calendar },
        { number: 5, title: 'Review & Send', icon: Eye },
      ];
    }

    // Default 'scratch' flow
    return [
      { number: 1, title: 'Campaign Details', icon: Mail },
      { number: 2, title: 'Select Template', icon: FileText },
      { number: 3, title: 'Choose Recipients', icon: Users },
      { number: 4, title: 'Schedule', icon: Calendar },
      { number: 5, title: 'Review & Send', icon: Eye },
    ];
  };

  const steps = getSteps();

  // Map current step to actual content based on creation type
  const getStepContent = () => {
    if (creationType === 'quick') {
      // Quick: Step 1 = Details+Template, Step 2 = Recipients, Step 3 = Review
      return currentStep === 1 ? 'details-template' :
             currentStep === 2 ? 'recipients' : 'review';
    }
    
    if (creationType === 'template') {
      // Template: Step 1 = Template, Step 2 = Details, Step 3 = Recipients, Step 4 = Schedule, Step 5 = Review
      return currentStep === 1 ? 'template' :
             currentStep === 2 ? 'details' :
             currentStep === 3 ? 'recipients' :
             currentStep === 4 ? 'schedule' : 'review';
    }

    // Scratch: Step 1 = Details, Step 2 = Template, Step 3 = Recipients, Step 4 = Schedule, Step 5 = Review
    return currentStep === 1 ? 'details' :
           currentStep === 2 ? 'template' :
           currentStep === 3 ? 'recipients' :
           currentStep === 4 ? 'schedule' : 'review';
  };

  const stepContent = getStepContent();

  const canProceedFromStep = (step: number): boolean => {
    const content = getStepContent();
    
    // For quick campaign
    if (creationType === 'quick') {
      if (step === 1) {
        // Details + Template
        return !!(formData.name && formData.subject && formData.fromEmail && formData.templateId);
      }
      if (step === 2) {
        // Recipients
        if (formData.recipientType === 'groups') {
          return formData.selectedGroups.length > 0;
        }
        if (formData.recipientType === 'contacts') {
          return formData.selectedContacts.length > 0;
        }
        return true;
      }
      return true;
    }

    // For template/scratch campaigns
    if (content === 'details') {
      return !!(formData.name && formData.subject && formData.fromEmail);
    }
    if (content === 'template') {
      return !!formData.templateId;
    }
    if (content === 'recipients') {
      if (formData.recipientType === 'groups') {
        return formData.selectedGroups.length > 0;
      }
      if (formData.recipientType === 'contacts') {
        return formData.selectedContacts.length > 0;
      }
      return true;
    }
    if (content === 'schedule') {
      if (formData.scheduleType === 'later') {
        return !!(formData.scheduledDate && formData.scheduledTime);
      }
      return true;
    }
    return true;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar activeItem="campaigns" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          workspaceName={workspaceName}
          workspaceColor={workspaceColor}
          onSettingsClick={() => onNavigate?.('settings')}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <Button variant="ghost" onClick={() => onNavigate?.('campaigns')} className="mb-4 -ml-2">
              <ArrowLeft className="size-4 mr-2" />
              Back to Campaigns
            </Button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
              <p className="text-gray-600 mt-1">
                Follow the steps to create and send your email campaign
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;

                  return (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                            isCompleted
                              ? 'bg-green-600 text-white'
                              : isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="size-5" />
                          ) : (
                            <Icon className="size-5" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 text-center font-medium ${
                            isActive
                              ? 'text-blue-600'
                              : isCompleted
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>

                      {index < steps.length - 1 && (
                        <div className="flex-1 h-0.5 bg-gray-200 mx-2 mb-6">
                          <div
                            className={`h-full transition-all ${
                              currentStep > step.number ? 'bg-green-600 w-full' : 'w-0'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              {/* Step 1: Campaign Details */}
              {stepContent === 'details' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Campaign Details
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Provide basic information about your email campaign
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1.5 rounded border border-gray-200">
                      {campaignId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name">Campaign Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Welcome Series - Week 1"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="subject">Email Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="e.g., Welcome to NConnect!"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name *</Label>
                      <Input
                        id="fromName"
                        placeholder="Your Company Name"
                        value={formData.fromName}
                        onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email *</Label>
                      <Select
                        value={formData.fromEmail}
                        onValueChange={(value) => setFormData({ ...formData, fromEmail: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a verified sender email">
                            {formData.fromEmail}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {VERIFIED_SENDER_EMAILS.map((email) => (
                            <SelectItem key={email} value={email}>
                              {email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="replyTo">Reply-To Email (Optional)</Label>
                      <Input
                        id="replyTo"
                        type="email"
                        placeholder="support@yourcompany.com"
                        value={formData.replyTo}
                        onChange={(e) => setFormData({ ...formData, replyTo: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="preheader">Preheader Text (Optional)</Label>
                      <Textarea
                        id="preheader"
                        placeholder="Preview text that appears in inbox..."
                        value={formData.preheader}
                        onChange={(e) => setFormData({ ...formData, preheader: e.target.value })}
                        rows={2}
                      />
                      <p className="text-xs text-gray-500">
                        This text appears next to the subject line in email clients
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Select Template */}
              {stepContent === 'template' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Select Email Template
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Choose a published template for your email campaign
                    </p>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search templates by name or description..."
                        value={templateSearchQuery}
                        onChange={(e) => setTemplateSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={templateCategoryFilter}
                      onValueChange={(value) => setTemplateCategoryFilter(value)}
                    >
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Templates Grid */}
                  {getFilteredTemplates().length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="size-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">No templates found</h3>
                      <p className="text-sm text-gray-600">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Showing {getFilteredTemplates().length} of {getPublishedTemplates(workspaceId).length} templates
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getFilteredTemplates().map((template) => (
                          <div
                            key={template.id}
                            onClick={() => setFormData({ ...formData, templateId: template.id })}
                            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all group ${
                              formData.templateId === template.id
                                ? 'border-blue-600 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            {/* Template Thumbnail */}
                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                              <img
                                src={template.thumbnail}
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Preview overlay on hover */}
                              <div
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewTemplate(template);
                                  setPreviewDialogOpen(true);
                                }}
                              >
                                <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-2 pointer-events-none">
                                  <Eye className="size-4" />
                                  <span className="text-sm font-medium">Preview</span>
                                </div>
                              </div>
                            </div>

                            {/* Template Info */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">
                                  {template.name}
                                </h3>
                                {template.isFavorite && (
                                  <Star className="size-4 text-yellow-500 fill-yellow-500 flex-shrink-0 ml-2" />
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-500 font-mono mb-2">
                                Template ID: {template.id}
                              </p>
                              
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {template.description}
                              </p>

                              {/* Meta information */}
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <Users className="size-3" />
                                  {template.usageCount} uses
                                </span>
                                <span>
                                  {new Date(template.lastModified).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                  })}
                                </span>
                              </div>

                              {/* Category and Status badges */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded capitalize font-medium">
                                  {template.category}
                                </span>
                                <span className="text-xs px-2 py-1 bg-green-600 text-white rounded font-medium">
                                  Published
                                </span>
                              </div>
                            </div>

                            {/* Selection indicator */}
                            {formData.templateId === template.id && (
                              <div className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="size-5 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Choose Recipients */}
              {stepContent === 'recipients' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Choose Recipients
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Select who will receive this campaign
                    </p>
                  </div>

                  {/* Recipient Type Selection */}
                  <div className="space-y-3">
                    <Label>Send To</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, recipientType: 'all' })
                        }
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.recipientType === 'all'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Users className="size-5 mb-2 text-blue-600" />
                        <h3 className="font-semibold text-gray-900 mb-1">All Contacts</h3>
                        <p className="text-xs text-gray-600">
                          Send to everyone ({SAMPLE_GROUPS.reduce((sum, g) => sum + g.count, 0).toLocaleString()})
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, recipientType: 'groups' })
                        }
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.recipientType === 'groups'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Users className="size-5 mb-2 text-purple-600" />
                        <h3 className="font-semibold text-gray-900 mb-1">Specific Groups</h3>
                        <p className="text-xs text-gray-600">Choose one or more groups</p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, recipientType: 'contacts' })
                        }
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.recipientType === 'contacts'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Mail className="size-5 mb-2 text-green-600" />
                        <h3 className="font-semibold text-gray-900 mb-1">Specific Contacts</h3>
                        <p className="text-xs text-gray-600">Select individual contacts</p>
                      </button>
                    </div>
                  </div>

                  {/* Groups Selection */}
                  {formData.recipientType === 'groups' && (
                    <div className="space-y-3">
                      <Label>Select Groups</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="flex items-center px-3 py-2 bg-gray-50 border-b">
                          <Search className="size-4 mr-2 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search groups by name, ID, category, or tags..."
                            value={groupSearchQuery}
                            onChange={(e) => setGroupSearchQuery(e.target.value)}
                            className="border-0 bg-transparent p-0 focus:ring-0"
                          />
                        </div>
                        <div className="divide-y max-h-64 overflow-y-auto">
                          {SAMPLE_GROUPS.filter((group) =>
                            group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                            group.groupId.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                            group.category.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                            group.tags.some((tag) => tag.toLowerCase().includes(groupSearchQuery.toLowerCase()))
                          ).length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                              <p className="text-sm">No groups found</p>
                              <p className="text-xs mt-1">Try a different search term</p>
                            </div>
                          ) : (
                            SAMPLE_GROUPS.filter((group) =>
                              group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                              group.groupId.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                              group.category.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                              group.tags.some((tag) => tag.toLowerCase().includes(groupSearchQuery.toLowerCase()))
                            ).map((group) => (
                              <label
                                key={group.id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.selectedGroups.includes(group.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData({
                                        ...formData,
                                        selectedGroups: [...formData.selectedGroups, group.id],
                                      });
                                    } else {
                                      setFormData({
                                        ...formData,
                                        selectedGroups: formData.selectedGroups.filter(
                                          (id) => id !== group.id
                                        ),
                                      });
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-gray-900"> {group.name}</p>
                                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                      {group.groupId}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
                                      {group.category}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {group.count.toLocaleString()} contacts
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {group.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contacts Selection */}
                  {formData.recipientType === 'contacts' && (
                    <div className="space-y-3">
                      <Label>Select Contacts</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="flex items-center px-3 py-2 bg-gray-50 border-b">
                          <Search className="size-4 mr-2 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search contacts by name, ID, email, or tags..."
                            value={contactSearchQuery}
                            onChange={(e) => setContactSearchQuery(e.target.value)}
                            className="border-0 bg-transparent p-0 focus:ring-0"
                          />
                        </div>
                        <div className="divide-y max-h-64 overflow-y-auto">
                          {SAMPLE_CONTACTS.filter(
                            (contact) =>
                              contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                              contact.contactId.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                              contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                              contact.tags.some((tag) => tag.toLowerCase().includes(contactSearchQuery.toLowerCase()))
                          ).length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                              <p className="text-sm">No contacts found</p>
                              <p className="text-xs mt-1">Try a different search term</p>
                            </div>
                          ) : (
                            SAMPLE_CONTACTS.filter(
                              (contact) =>
                                contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                                contact.contactId.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                                contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                                contact.tags.some((tag) => tag.toLowerCase().includes(contactSearchQuery.toLowerCase()))
                            ).map((contact) => (
                              <label
                                key={contact.id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.selectedContacts.includes(contact.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData({
                                        ...formData,
                                        selectedContacts: [...formData.selectedContacts, contact.id],
                                      });
                                    } else {
                                      setFormData({
                                        ...formData,
                                        selectedContacts: formData.selectedContacts.filter(
                                          (id) => id !== contact.id
                                        ),
                                      });
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-gray-900">{contact.name}</p>
                                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                      {contact.contactId}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {contact.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Schedule */}
              {stepContent === 'schedule' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Schedule Campaign
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Choose when to send your campaign
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleType: 'now' })}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.scheduleType === 'now'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Send className="size-5 mb-2 text-blue-600" />
                        <h3 className="font-semibold text-gray-900 mb-1">Send Now</h3>
                        <p className="text-xs text-gray-600">
                          Campaign will be sent immediately
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleType: 'later' })}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.scheduleType === 'later'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Clock className="size-5 mb-2 text-purple-600" />
                        <h3 className="font-semibold text-gray-900 mb-1">Schedule for Later</h3>
                        <p className="text-xs text-gray-600">Choose a specific date and time</p>
                      </button>
                    </div>

                    {formData.scheduleType === 'later' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="scheduledDate">Date *</Label>
                          <Input
                            id="scheduledDate"
                            type="date"
                            value={formData.scheduledDate}
                            onChange={(e) =>
                              setFormData({ ...formData, scheduledDate: e.target.value })
                            }
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="scheduledTime">Time *</Label>
                          <Input
                            id="scheduledTime"
                            type="time"
                            value={formData.scheduledTime}
                            onChange={(e) =>
                              setFormData({ ...formData, scheduledTime: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review & Send */}
              {stepContent === 'review' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Review & Send Campaign
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Review your campaign details before sending
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Campaign Details */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Mail className="size-5 text-blue-600" />
                        Campaign Details
                      </h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Campaign Name:</dt>
                          <dd className="font-medium text-gray-900">{formData.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Subject Line:</dt>
                          <dd className="font-medium text-gray-900">{formData.subject}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">From:</dt>
                          <dd className="font-medium text-gray-900">
                            {formData.fromName} &lt;{formData.fromEmail}&gt;
                          </dd>
                        </div>
                        {formData.preheader && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Preheader:</dt>
                            <dd className="font-medium text-gray-900">{formData.preheader}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {/* Template */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="size-5 text-blue-600" />
                        Email Template
                      </h3>
                      {selectedTemplate && (
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedTemplate.thumbnail}
                            alt={selectedTemplate.name}
                            className="w-20 h-16 object-cover rounded border"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{selectedTemplate.name}</p>
                            <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recipients */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="size-5 text-blue-600" />
                        Recipients
                      </h3>
                      <div className="text-sm">
                        <p className="text-gray-600 mb-2">
                          {formData.recipientType === 'all' && 'Sending to all subscribers'}
                          {formData.recipientType === 'groups' &&
                            `Sending to ${formData.selectedGroups.length} selected group(s)`}
                          {formData.recipientType === 'contacts' &&
                            `Sending to ${formData.selectedContacts.length} selected contact(s)`}
                        </p>
                        <p className="font-semibold text-gray-900 text-lg">
                          Total: {getTotalRecipients().toLocaleString()} recipients
                        </p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="size-5 text-blue-600" />
                        Schedule
                      </h3>
                      <p className="text-sm text-gray-900">
                        {formData.scheduleType === 'now' ? (
                          <span className="flex items-center gap-2">
                            <Send className="size-4 text-green-600" />
                            Send immediately
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Clock className="size-4 text-blue-600" />
                            Scheduled for{' '}
                            {new Date(
                              `${formData.scheduledDate}T${formData.scheduledTime}`
                            ).toLocaleString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Important:</strong> Please review all details carefully before
                      sending. Once sent, the campaign cannot be cancelled.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? handleCancel : handleBack}
              >
                <ArrowLeft className="size-4 mr-2" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedFromStep(currentStep)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {formData.scheduleType === 'now' ? (
                    <>
                      <Send className="size-4 mr-2" />
                      Send Campaign
                    </>
                  ) : (
                    <>
                      <Calendar className="size-4 mr-2" />
                      Schedule Campaign
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Template Preview Dialog */}
      <TemplatePreviewDialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        template={previewTemplate}
        simpleMode={true}
      />
    </div>
  );
}