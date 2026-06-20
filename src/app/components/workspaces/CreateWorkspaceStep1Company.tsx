import { useState } from 'react';
import { ArrowRight, Building2, Linkedin, Twitter, Facebook, Instagram, Youtube, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export interface CompanySetupData {
  name: string;
  registration: string;
  category: string;
  companySize: string;
  websiteUrl: string;
  address: string;
  location: string;
  timezone: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

interface CreateWorkspaceStep1Props {
  onNext: (data: CompanySetupData) => void;
  initialData?: CompanySetupData;
}

const companyCategories = [
  'Marketing Agency',
  'E-commerce',
  'SaaS',
  'Media & Publishing',
  'Education',
  'Non-profit',
  'Healthcare',
  'Financial Services',
  'Real Estate',
  'Technology',
  'Retail',
  'Other',
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees',
  '5001-10000 employees',
  '10000+ employees',
];

const timezones = [
  'America/New_York (EST/EDT)',
  'America/Chicago (CST/CDT)',
  'America/Denver (MST/MDT)',
  'America/Los_Angeles (PST/PDT)',
  'America/Phoenix (MST)',
  'America/Anchorage (AKST/AKDT)',
  'Pacific/Honolulu (HST)',
  'Europe/London (GMT/BST)',
  'Europe/Paris (CET/CEST)',
  'Europe/Berlin (CET/CEST)',
  'Asia/Dubai (GST)',
  'Asia/Kolkata (IST)',
  'Asia/Singapore (SGT)',
  'Asia/Tokyo (JST)',
  'Asia/Shanghai (CST)',
  'Australia/Sydney (AEDT/AEST)',
  'Pacific/Auckland (NZDT/NZST)',
];

export function CreateWorkspaceStep1Company({ onNext, initialData }: CreateWorkspaceStep1Props) {
  const [formData, setFormData] = useState<CompanySetupData>(
    initialData || {
      name: '',
      registration: '',
      category: '',
      companySize: '',
      websiteUrl: '',
      address: '',
      location: '',
      timezone: '',
      socialMedia: {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: '',
        youtube: '',
      },
    }
  );

  const [errors, setErrors] = useState<Partial<CompanySetupData>>({});
  
  // State to track which social media fields are visible
  const [visibleSocialFields, setVisibleSocialFields] = useState({
    linkedin: false,
    twitter: false,
    facebook: false,
    instagram: false,
    youtube: false,
  });

  const validate = (): boolean => {
    const newErrors: Partial<CompanySetupData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a company category';
    }

    if (!formData.companySize) {
      newErrors.companySize = 'Please select a company size';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Company address is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.timezone) {
      newErrors.timezone = 'Please select a timezone';
    }

    if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const updateField = (field: keyof CompanySetupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updateSocialMediaField = (field: keyof CompanySetupData['socialMedia'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [field]: value,
      },
    }));
    if (errors.socialMedia && errors.socialMedia[field]) {
      setErrors(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: undefined,
        },
      }));
    }
  };

  const toggleSocialField = (field: keyof typeof visibleSocialFields) => {
    setVisibleSocialFields(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const socialMediaPlatforms = [
    { key: 'linkedin' as const, name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
    { key: 'twitter' as const, name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
    { key: 'facebook' as const, name: 'Facebook', icon: Facebook, color: 'text-blue-700' },
    { key: 'instagram' as const, name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { key: 'youtube' as const, name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building2 className="size-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Company Information</h3>
          <p className="text-sm text-gray-600">Tell us about your company</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Company Name */}
        <div>
          <Label htmlFor="companyName" className="text-sm font-semibold text-gray-900">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="e.g., Acme Corporation"
            className="mt-2"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Company Registration */}
        <div>
          <Label htmlFor="registration" className="text-sm font-medium text-gray-700">
            Company Registration Number <span className="text-gray-500 text-xs">(Optional)</span>
          </Label>
          <Input
            id="registration"
            type="text"
            placeholder="e.g., 12345678"
            className="mt-2"
            value={formData.registration}
            onChange={(e) => updateField('registration', e.target.value)}
          />
        </div>

        {/* Company Category */}
        <div>
          <Label htmlFor="category" className="text-sm font-semibold text-gray-900">
            Company Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => updateField('category', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {companyCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category}</p>
          )}
        </div>

        {/* Company Size */}
        <div>
          <Label htmlFor="companySize" className="text-sm font-semibold text-gray-900">
            Company Size <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.companySize}
            onValueChange={(value) => updateField('companySize', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.companySize && (
            <p className="text-sm text-red-600 mt-1">{errors.companySize}</p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
            Company Website URL <span className="text-gray-500 text-xs">(Optional)</span>
          </Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://www.example.com"
            className="mt-2"
            value={formData.websiteUrl}
            onChange={(e) => updateField('websiteUrl', e.target.value)}
          />
          {errors.websiteUrl && (
            <p className="text-sm text-red-600 mt-1">{errors.websiteUrl}</p>
          )}
        </div>

        {/* Company Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-semibold text-gray-900">
            Company Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="123 Main Street, Suite 100"
            className="mt-2"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-sm font-semibold text-gray-900">
            City, State/Province, Country <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., New York, NY, USA"
            className="mt-2"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
          {errors.location && (
            <p className="text-sm text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Timezone */}
        <div>
          <Label htmlFor="timezone" className="text-sm font-semibold text-gray-900">
            Time Zone <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) => updateField('timezone', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>
                  {timezone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timezone && (
            <p className="text-sm text-red-600 mt-1">{errors.timezone}</p>
          )}
        </div>

        {/* Social Media Links */}
        <div>
          <Label className="text-sm font-semibold text-gray-900">
            Social Media Links <span className="text-gray-500 text-xs font-normal">(Optional)</span>
          </Label>
          <p className="text-xs text-gray-500 mt-1">Add your social media profiles</p>
          <div className="space-y-3 mt-3">
            {socialMediaPlatforms.map(platform => {
              const Icon = platform.icon;
              const isVisible = visibleSocialFields[platform.key] || formData.socialMedia[platform.key];
              
              return (
                <div key={platform.key}>
                  {isVisible ? (
                    <div className="flex items-center gap-2">
                      <Icon className={`size-4 ${platform.color}`} />
                      <Input
                        type="url"
                        placeholder={`https://${platform.name.toLowerCase()}.com/yourcompany`}
                        value={formData.socialMedia[platform.key]}
                        onChange={(e) => updateSocialMediaField(platform.key, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSocialField(platform.key)}
                      className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Icon className={`size-4 ${platform.color}`} />
                      <span>Add {platform.name} link</span>
                      <Plus className="size-4 ml-auto" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </form>
  );
}