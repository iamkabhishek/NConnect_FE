import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Contact } from './ContactsTable';

interface AddContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id' | 'addedDate' | 'workspaceId' | 'name'>) => void;
  editContact?: Contact;
  currentWorkspace?: string; // Current workspace name for display
  availableWorkspaces?: Array<{ id: string; name: string }>; // Available workspaces for selection
  existingContacts?: Contact[]; // Existing contacts to check for duplicates
}

export function AddContactDialog({ open, onClose, onSave, editContact, currentWorkspace, availableWorkspaces, existingContacts }: AddContactDialogProps) {
  // State for form sections
  const [showDemographics, setShowDemographics] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showProfessional, setShowProfessional] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Information (always visible)
    firstName: editContact?.firstName || '',
    lastName: editContact?.lastName || '',
    email: editContact?.email || '',
    phone: editContact?.phone || '',
    
    // Demographics
    dateOfBirth: editContact?.dateOfBirth || '',
    gender: editContact?.gender || '',
    language: editContact?.language || '',
    
    // Location
    address: editContact?.address || '',
    city: editContact?.city || '',
    state: editContact?.state || '',
    country: editContact?.country || '',
    postalCode: editContact?.postalCode || '',
    timezone: editContact?.timezone || '',
    
    // Professional
    company: editContact?.company || '',
    jobTitle: editContact?.jobTitle || '',
    industry: editContact?.industry || '',
    
    // Engagement
    tags: editContact?.tags.join(', ') || '',
    status: editContact?.status || 'subscribed',
    notes: editContact?.notes || '',
    source: editContact?.source || 'manual',
    
    // Consent
    consentObtained: editContact?.consentObtained || false,
  });

  const [errors, setErrors] = useState<{ 
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    postalCode?: string;
    firstName?: string;
    lastName?: string;
    consent?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return 'Invalid email address';
    }
    
    // Check for duplicate email (case-insensitive)
    if (existingContacts) {
      const isDuplicate = existingContacts.some(contact => {
        // When editing, exclude the current contact from duplicate check
        if (editContact && contact.id === editContact.id) {
          return false;
        }
        return contact.email.toLowerCase() === email.toLowerCase();
      });
      
      if (isDuplicate) {
        return 'This email address is already registered';
      }
    }
    
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return undefined; // Optional field
    // Allow international format with + and digits, or local format with parentheses and dashes
    if (!/^(\+?\d{1,3}[-.\\s]?)?\(?\d{1,4}\)?[-.\\s]?\d{1,4}[-.\\s]?\d{1,9}$/.test(phone.replace(/\s/g, ''))) {
      return 'Invalid phone number format';
    }
    
    // Check for duplicate phone number
    if (existingContacts) {
      const normalizedPhone = phone.replace(/[\s\-\(\)]/g, ''); // Remove formatting for comparison
      const isDuplicate = existingContacts.some(contact => {
        // When editing, exclude the current contact from duplicate check
        if (editContact && contact.id === editContact.id) {
          return false;
        }
        if (!contact.phone) return false;
        const normalizedContactPhone = contact.phone.replace(/[\s\-\(\)]/g, '');
        return normalizedContactPhone === normalizedPhone;
      });
      
      if (isDuplicate) {
        return 'This phone number is already registered';
      }
    }
    
    return undefined;
  };

  const validateDateOfBirth = (date: string): string | undefined => {
    if (!date.trim()) return undefined; // Optional field
    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate > today) {
      return 'Date of birth cannot be in the future';
    }
    // Check if person would be more than 120 years old
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 120);
    if (selectedDate < maxDate) {
      return 'Please enter a valid date of birth';
    }
    return undefined;
  };

  const validatePostalCode = (postalCode: string): string | undefined => {
    if (!postalCode.trim()) return undefined; // Optional field
    // Allow alphanumeric postal codes (supports various international formats)
    if (!/^[A-Z0-9\s-]{3,10}$/i.test(postalCode)) {
      return 'Invalid postal code format';
    }
    return undefined;
  };

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name.trim()) return undefined; // Optional field
    if (name.trim().length < 2) {
      return `${fieldName} must be at least 2 characters`;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    }
    return undefined;
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    // Required field validations
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Consent validation
    if (!formData.consentObtained) {
      newErrors.consent = 'You must confirm that consent has been obtained';
    }

    // Optional field validations (only if data is entered)
    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (formData.dateOfBirth) {
      const dobError = validateDateOfBirth(formData.dateOfBirth);
      if (dobError) newErrors.dateOfBirth = dobError;
    }

    if (formData.postalCode) {
      const postalError = validatePostalCode(formData.postalCode);
      if (postalError) newErrors.postalCode = postalError;
    }

    if (formData.firstName) {
      const firstNameError = validateName(formData.firstName, 'First name');
      if (firstNameError) newErrors.firstName = firstNameError;
    }

    if (formData.lastName) {
      const lastNameError = validateName(formData.lastName, 'Last name');
      if (lastNameError) newErrors.lastName = lastNameError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender as Contact['gender'] || undefined,
      language: formData.language || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      postalCode: formData.postalCode || undefined,
      timezone: formData.timezone || undefined,
      company: formData.company || undefined,
      jobTitle: formData.jobTitle || undefined,
      industry: formData.industry || undefined,
      status: formData.status as Contact['status'],
      tags,
      notes: formData.notes || undefined,
      source: formData.source,
      lastModified: new Date().toISOString(),
      consentObtained: formData.consentObtained,
    });

    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      language: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      timezone: '',
      company: '',
      jobTitle: '',
      industry: '',
      tags: '',
      status: 'subscribed',
      notes: '',
      source: 'manual',
      consentObtained: false,
    });
    setErrors({});
    setShowDemographics(false);
    setShowLocation(false);
    setShowProfessional(false);
    setShowAdditional(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-white">
          <DialogHeader>
            <DialogTitle>{editContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
            <DialogDescription>
              {editContact
                ? 'Update contact information below. Only email is required.'
                : 'Add a new contact to your subscriber list. Only email is required, but more details help with targeting.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
            {/* Basic Information - Always Visible */}
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              {/* Contact ID and Workspace - Always shown */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-blue-200">
                <div>
                  <Label htmlFor="contactId" className="text-sm">
                    Contact ID
                  </Label>
                  {editContact ? (
                    <Input
                      id="contactId"
                      type="text"
                      className="mt-1.5 h-10 bg-gray-100 text-gray-600"
                      value={editContact.id}
                      disabled
                      readOnly
                    />
                  ) : (
                    <div className="mt-1.5 h-10 bg-gray-100 border border-gray-300 rounded-md px-3 flex items-center text-gray-500 text-sm">
                      Auto-generated on save
                    </div>
                  )}
                  {!editContact && (
                    <p className="text-xs text-gray-600 mt-1">
                      Workspace-prefixed ID will be generated automatically
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="workspace" className="text-sm">
                    Workspace <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="workspace"
                    type="text"
                    className="mt-1.5 h-10 bg-gray-100 text-gray-600"
                    value={currentWorkspace || 'No Workspace Selected'}
                    disabled
                    readOnly
                  />
                  {!editContact && (
                    <p className="text-xs text-gray-600 mt-1">
                      Contact will be created in this workspace
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="mt-1.5 h-10 bg-white"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="mt-1.5 h-10 bg-white"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                  {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="mt-1.5 h-10 bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="mt-1.5 h-10 bg-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="status" className="text-sm">
                  Subscription Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="mt-1.5 h-10 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subscribed">Subscribed</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Demographics - Collapsible */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDemographics(!showDemographics)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <span className="font-semibold text-gray-900">Demographics</span>
                {showDemographics ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
              
              {showDemographics && (
                <div className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-sm">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className="mt-1.5 h-10"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                    {errors.dateOfBirth && <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-sm">
                      Gender
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger className="mt-1.5 h-10">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language" className="text-sm">
                      Preferred Language
                    </Label>
                    <Input
                      id="language"
                      type="text"
                      placeholder="English, Spanish, etc."
                      className="mt-1.5 h-10"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Location - Collapsible */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowLocation(!showLocation)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <span className="font-semibold text-gray-900">Location</span>
                {showLocation ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
              
              {showLocation && (
                <div className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-sm">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Main St"
                      className="mt-1.5 h-10"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm">
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="New York"
                        className="mt-1.5 h-10"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm">
                        State/Province
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="NY"
                        className="mt-1.5 h-10"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country" className="text-sm">
                        Country
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="United States"
                        className="mt-1.5 h-10"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="postalCode" className="text-sm">
                        Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        type="text"
                        placeholder="10001"
                        className="mt-1.5 h-10"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      />
                      {errors.postalCode && <p className="text-sm text-red-600 mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timezone" className="text-sm">
                      Timezone
                    </Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                      <SelectTrigger className="mt-1.5 h-10">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {/* Americas */}
                        <SelectItem value="America/New_York">Eastern Time (America/New_York)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (America/Chicago)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (America/Denver)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</SelectItem>
                        <SelectItem value="America/Anchorage">Alaska Time (America/Anchorage)</SelectItem>
                        <SelectItem value="Pacific/Honolulu">Hawaii Time (Pacific/Honolulu)</SelectItem>
                        <SelectItem value="America/Toronto">Toronto (America/Toronto)</SelectItem>
                        <SelectItem value="America/Vancouver">Vancouver (America/Vancouver)</SelectItem>
                        <SelectItem value="America/Mexico_City">Mexico City (America/Mexico_City)</SelectItem>
                        <SelectItem value="America/Sao_Paulo">São Paulo (America/Sao_Paulo)</SelectItem>
                        <SelectItem value="America/Buenos_Aires">Buenos Aires (America/Buenos_Aires)</SelectItem>
                        <SelectItem value="America/Santiago">Santiago (America/Santiago)</SelectItem>
                        <SelectItem value="America/Bogota">Bogotá (America/Bogota)</SelectItem>
                        <SelectItem value="America/Lima">Lima (America/Lima)</SelectItem>
                        <SelectItem value="America/Caracas">Caracas (America/Caracas)</SelectItem>
                        
                        {/* Europe */}
                        <SelectItem value="Europe/London">London (Europe/London)</SelectItem>
                        <SelectItem value="Europe/Dublin">Dublin (Europe/Dublin)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (Europe/Paris)</SelectItem>
                        <SelectItem value="Europe/Berlin">Berlin (Europe/Berlin)</SelectItem>
                        <SelectItem value="Europe/Rome">Rome (Europe/Rome)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid (Europe/Madrid)</SelectItem>
                        <SelectItem value="Europe/Amsterdam">Amsterdam (Europe/Amsterdam)</SelectItem>
                        <SelectItem value="Europe/Brussels">Brussels (Europe/Brussels)</SelectItem>
                        <SelectItem value="Europe/Vienna">Vienna (Europe/Vienna)</SelectItem>
                        <SelectItem value="Europe/Zurich">Zurich (Europe/Zurich)</SelectItem>
                        <SelectItem value="Europe/Stockholm">Stockholm (Europe/Stockholm)</SelectItem>
                        <SelectItem value="Europe/Copenhagen">Copenhagen (Europe/Copenhagen)</SelectItem>
                        <SelectItem value="Europe/Oslo">Oslo (Europe/Oslo)</SelectItem>
                        <SelectItem value="Europe/Helsinki">Helsinki (Europe/Helsinki)</SelectItem>
                        <SelectItem value="Europe/Warsaw">Warsaw (Europe/Warsaw)</SelectItem>
                        <SelectItem value="Europe/Prague">Prague (Europe/Prague)</SelectItem>
                        <SelectItem value="Europe/Budapest">Budapest (Europe/Budapest)</SelectItem>
                        <SelectItem value="Europe/Bucharest">Bucharest (Europe/Bucharest)</SelectItem>
                        <SelectItem value="Europe/Athens">Athens (Europe/Athens)</SelectItem>
                        <SelectItem value="Europe/Istanbul">Istanbul (Europe/Istanbul)</SelectItem>
                        <SelectItem value="Europe/Moscow">Moscow (Europe/Moscow)</SelectItem>
                        <SelectItem value="Europe/Lisbon">Lisbon (Europe/Lisbon)</SelectItem>
                        
                        {/* Asia */}
                        <SelectItem value="Asia/Dubai">Dubai (Asia/Dubai)</SelectItem>
                        <SelectItem value="Asia/Riyadh">Riyadh (Asia/Riyadh)</SelectItem>
                        <SelectItem value="Asia/Kuwait">Kuwait (Asia/Kuwait)</SelectItem>
                        <SelectItem value="Asia/Karachi">Karachi (Asia/Karachi)</SelectItem>
                        <SelectItem value="Asia/Kolkata">Kolkata (Asia/Kolkata)</SelectItem>
                        <SelectItem value="Asia/Mumbai">Mumbai (Asia/Mumbai)</SelectItem>
                        <SelectItem value="Asia/Delhi">Delhi (Asia/Delhi)</SelectItem>
                        <SelectItem value="Asia/Dhaka">Dhaka (Asia/Dhaka)</SelectItem>
                        <SelectItem value="Asia/Bangkok">Bangkok (Asia/Bangkok)</SelectItem>
                        <SelectItem value="Asia/Jakarta">Jakarta (Asia/Jakarta)</SelectItem>
                        <SelectItem value="Asia/Singapore">Singapore (Asia/Singapore)</SelectItem>
                        <SelectItem value="Asia/Kuala_Lumpur">Kuala Lumpur (Asia/Kuala_Lumpur)</SelectItem>
                        <SelectItem value="Asia/Manila">Manila (Asia/Manila)</SelectItem>
                        <SelectItem value="Asia/Hong_Kong">Hong Kong (Asia/Hong_Kong)</SelectItem>
                        <SelectItem value="Asia/Shanghai">Shanghai (Asia/Shanghai)</SelectItem>
                        <SelectItem value="Asia/Beijing">Beijing (Asia/Beijing)</SelectItem>
                        <SelectItem value="Asia/Taipei">Taipei (Asia/Taipei)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (Asia/Tokyo)</SelectItem>
                        <SelectItem value="Asia/Seoul">Seoul (Asia/Seoul)</SelectItem>
                        <SelectItem value="Asia/Pyongyang">Pyongyang (Asia/Pyongyang)</SelectItem>
                        <SelectItem value="Asia/Ho_Chi_Minh">Ho Chi Minh (Asia/Ho_Chi_Minh)</SelectItem>
                        <SelectItem value="Asia/Yangon">Yangon (Asia/Yangon)</SelectItem>
                        <SelectItem value="Asia/Kathmandu">Kathmandu (Asia/Kathmandu)</SelectItem>
                        <SelectItem value="Asia/Colombo">Colombo (Asia/Colombo)</SelectItem>
                        <SelectItem value="Asia/Jerusalem">Jerusalem (Asia/Jerusalem)</SelectItem>
                        <SelectItem value="Asia/Beirut">Beirut (Asia/Beirut)</SelectItem>
                        <SelectItem value="Asia/Baghdad">Baghdad (Asia/Baghdad)</SelectItem>
                        <SelectItem value="Asia/Tehran">Tehran (Asia/Tehran)</SelectItem>
                        <SelectItem value="Asia/Kabul">Kabul (Asia/Kabul)</SelectItem>
                        <SelectItem value="Asia/Tashkent">Tashkent (Asia/Tashkent)</SelectItem>
                        <SelectItem value="Asia/Almaty">Almaty (Asia/Almaty)</SelectItem>
                        
                        {/* Africa */}
                        <SelectItem value="Africa/Cairo">Cairo (Africa/Cairo)</SelectItem>
                        <SelectItem value="Africa/Lagos">Lagos (Africa/Lagos)</SelectItem>
                        <SelectItem value="Africa/Nairobi">Nairobi (Africa/Nairobi)</SelectItem>
                        <SelectItem value="Africa/Johannesburg">Johannesburg (Africa/Johannesburg)</SelectItem>
                        <SelectItem value="Africa/Casablanca">Casablanca (Africa/Casablanca)</SelectItem>
                        <SelectItem value="Africa/Algiers">Algiers (Africa/Algiers)</SelectItem>
                        <SelectItem value="Africa/Tunis">Tunis (Africa/Tunis)</SelectItem>
                        <SelectItem value="Africa/Tripoli">Tripoli (Africa/Tripoli)</SelectItem>
                        <SelectItem value="Africa/Khartoum">Khartoum (Africa/Khartoum)</SelectItem>
                        <SelectItem value="Africa/Addis_Ababa">Addis Ababa (Africa/Addis_Ababa)</SelectItem>
                        <SelectItem value="Africa/Dar_es_Salaam">Dar es Salaam (Africa/Dar_es_Salaam)</SelectItem>
                        <SelectItem value="Africa/Kampala">Kampala (Africa/Kampala)</SelectItem>
                        <SelectItem value="Africa/Accra">Accra (Africa/Accra)</SelectItem>
                        <SelectItem value="Africa/Kinshasa">Kinshasa (Africa/Kinshasa)</SelectItem>
                        
                        {/* Australia & Pacific */}
                        <SelectItem value="Australia/Sydney">Sydney (Australia/Sydney)</SelectItem>
                        <SelectItem value="Australia/Melbourne">Melbourne (Australia/Melbourne)</SelectItem>
                        <SelectItem value="Australia/Brisbane">Brisbane (Australia/Brisbane)</SelectItem>
                        <SelectItem value="Australia/Perth">Perth (Australia/Perth)</SelectItem>
                        <SelectItem value="Australia/Adelaide">Adelaide (Australia/Adelaide)</SelectItem>
                        <SelectItem value="Australia/Darwin">Darwin (Australia/Darwin)</SelectItem>
                        <SelectItem value="Pacific/Auckland">Auckland (Pacific/Auckland)</SelectItem>
                        <SelectItem value="Pacific/Fiji">Fiji (Pacific/Fiji)</SelectItem>
                        <SelectItem value="Pacific/Guam">Guam (Pacific/Guam)</SelectItem>
                        <SelectItem value="Pacific/Port_Moresby">Port Moresby (Pacific/Port_Moresby)</SelectItem>
                        <SelectItem value="Pacific/Tahiti">Tahiti (Pacific/Tahiti)</SelectItem>
                        <SelectItem value="Pacific/Samoa">Samoa (Pacific/Samoa)</SelectItem>
                        
                        {/* Atlantic */}
                        <SelectItem value="Atlantic/Reykjavik">Reykjavik (Atlantic/Reykjavik)</SelectItem>
                        <SelectItem value="Atlantic/Azores">Azores (Atlantic/Azores)</SelectItem>
                        <SelectItem value="Atlantic/Cape_Verde">Cape Verde (Atlantic/Cape_Verde)</SelectItem>
                        
                        {/* UTC */}
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Professional - Collapsible */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowProfessional(!showProfessional)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <span className="font-semibold text-gray-900">Professional Information</span>
                {showProfessional ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
              
              {showProfessional && (
                <div className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="company" className="text-sm">
                      Company
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Acme Inc."
                      className="mt-1.5 h-10"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="jobTitle" className="text-sm">
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      placeholder="Marketing Manager"
                      className="mt-1.5 h-10"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-sm">
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      placeholder="Technology, Healthcare, etc."
                      className="mt-1.5 h-10"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information - Collapsible */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdditional(!showAdditional)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <span className="font-semibold text-gray-900">Additional Information</span>
                {showAdditional ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
              
              {showAdditional && (
                <div className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="tags" className="text-sm">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      type="text"
                      placeholder="customer, vip, newsletter (comma separated)"
                      className="mt-1.5 h-10"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes about this contact..."
                      className="mt-1.5 min-h-[100px]"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={formData.consentObtained}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, consentObtained: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor="consent" 
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Consent Obtained for Marketing Communications
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    I confirm that this contact has given explicit consent to receive newsletters and email campaigns. This helps ensure GDPR and CAN-SPAM compliance.
                  </p>
                  {errors.consent && <p className="text-sm text-red-600 mt-1">{errors.consent}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-white">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="contact-form"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {editContact ? 'Updating...' : 'Adding...'}
              </>
            ) : editContact ? (
              'Update Contact'
            ) : (
              'Add Contact'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}