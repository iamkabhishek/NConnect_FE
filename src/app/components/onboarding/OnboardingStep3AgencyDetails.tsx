import { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, Globe, MapPin, Share2, FileText, Mail, Phone } from 'lucide-react';
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

export interface AgencyAddressData {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  pincode: string;
  addressType: 'BILLING' | 'SHIPPING' | 'REGISTERED';
}

export interface AgencySocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export interface AgencyData {
  name: string;
  category: string;
  registrationNo?: string;
  gstRegistrationNo?: string;
  website?: string;
  size: string;
  timezone: string;
  email: string;
  alternateEmail?: string;
  phoneNumber?: string;
  telephoneNumber?: string;
  address: AgencyAddressData;
  socials: AgencySocialLinks;
}

interface OnboardingStepAgencyProps {
  onNext: (data: AgencyData) => void;
  onBack: () => void;
  initialData?: AgencyData;
  defaultEmail?: string;
}

const categories = [
  'Marketing Agency',
  'Advertising Agency',
  'Consulting Agency',
  'PR/Communications Agency',
  'Design Studio',
  'Tech/SaaS Agency',
  'Recruitment Agency',
  'Other',
];

const sizes = [
  '1-10 Employees',
  '11-50 Employees',
  '51-200 Employees',
  '201+ Employees',
];

const timezones = [
  'UTC',
  'Asia/Kolkata (IST)',
  'America/New_York (EST)',
  'America/Los_Angeles (PST)',
  'Europe/London (GMT)',
  'Europe/Paris (CET)',
  'Asia/Singapore (SGT)',
  'Australia/Sydney (AEST)',
];

export function OnboardingStep3AgencyDetails({
  onNext,
  onBack,
  initialData,
  defaultEmail = '',
}: OnboardingStepAgencyProps) {
  const [formData, setFormData] = useState<AgencyData>(
    initialData || {
      name: '',
      category: '',
      registrationNo: '',
      gstRegistrationNo: '',
      website: '',
      size: '',
      timezone: 'UTC',
      email: defaultEmail,
      alternateEmail: '',
      phoneNumber: '',
      telephoneNumber: '',
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        state: '',
        country: '',
        pincode: '',
        addressType: 'BILLING',
      },
      socials: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
      },
    }
  );

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    // Basic Agency details validation
    if (!formData.name.trim()) {
      newErrors.name = 'Agency name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select an agency category';
    }
    if (!formData.size) {
      newErrors.size = 'Please select company size';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Primary contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid primary email format';
    }

    if (formData.alternateEmail?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.alternateEmail)) {
      newErrors.alternateEmail = 'Invalid alternate email format';
    }

    if (formData.website?.trim() && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL format';
    }

    // Address validation
    if (!formData.address.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }
    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.address.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }

    // GST validation (simple India regex: 15 chars alphanumeric)
    if (formData.gstRegistrationNo?.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstRegistrationNo.toUpperCase())) {
      newErrors.gstRegistrationNo = 'Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const updateAgencyField = <K extends keyof AgencyData>(field: K, value: AgencyData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: undefined }));
    }
  };

  const updateAddressField = (field: keyof AgencyAddressData, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updateSocialField = (field: keyof AgencySocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value,
      },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Set up your Agency
        </h1>
        <p className="text-gray-600">
          Provide your legal details, address, and social links to configure your tenant profile.
        </p>
        <p className="text-sm text-gray-500 mt-4">Step 2 of 5</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 shadow-sm">
          
          {/* Section 1: Business Profile */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Building2 className="size-5 text-blue-500" />
              Agency Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="agencyName" className="text-sm font-semibold text-gray-900">
                  Agency Name (Legal / Display) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="agencyName"
                  placeholder="e.g. Pixel Perfect Marketing"
                  className="mt-2 h-11"
                  value={formData.name}
                  onChange={(e) => updateAgencyField('name', e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-gray-900">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateAgencyField('category', value)}
                >
                  <SelectTrigger id="category" className="mt-2 h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label htmlFor="size" className="text-sm font-semibold text-gray-900">
                  Agency Size <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => updateAgencyField('size', value)}
                >
                  <SelectTrigger id="size" className="mt-2 h-11">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.size && (
                  <p className="text-sm text-red-600 mt-1">{errors.size}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timezone" className="text-sm font-semibold text-gray-900">
                  Timezone <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => updateAgencyField('timezone', value)}
                >
                  <SelectTrigger id="timezone" className="mt-2 h-11">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="website" className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Globe className="size-4 text-gray-400" />
                  Website URL <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="website"
                  placeholder="https://agency.com"
                  className="mt-2 h-11"
                  value={formData.website}
                  onChange={(e) => updateAgencyField('website', e.target.value)}
                />
                {errors.website && (
                  <p className="text-sm text-red-600 mt-1">{errors.website}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Mail className="size-4 text-gray-400" />
                  Primary Contact Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@agency.com"
                  className="mt-2 h-11"
                  value={formData.email}
                  onChange={(e) => updateAgencyField('email', e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="alternateEmail" className="text-sm font-semibold text-gray-900">
                  Alternate Contact Email <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="alternateEmail"
                  type="email"
                  placeholder="backup@agency.com"
                  className="mt-2 h-11"
                  value={formData.alternateEmail}
                  onChange={(e) => updateAgencyField('alternateEmail', e.target.value)}
                />
                {errors.alternateEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.alternateEmail}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Phone className="size-4 text-gray-400" />
                  Primary Phone <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  className="mt-2 h-11"
                  value={formData.phoneNumber}
                  onChange={(e) => updateAgencyField('phoneNumber', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Registration & Compliance */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <FileText className="size-5 text-purple-500" />
              Registration & Tax
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="registrationNo" className="text-sm font-semibold text-gray-900">
                  Corporate Registration No (CIN / Reg No) <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="registrationNo"
                  placeholder="U74999DL2018PTC123456"
                  className="mt-2 h-11"
                  value={formData.registrationNo}
                  onChange={(e) => updateAgencyField('registrationNo', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="gstRegistrationNo" className="text-sm font-semibold text-gray-900">
                  GSTIN / Tax Registration No <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="gstRegistrationNo"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  className="mt-2 h-11"
                  value={formData.gstRegistrationNo}
                  onChange={(e) => updateAgencyField('gstRegistrationNo', e.target.value)}
                />
                {errors.gstRegistrationNo && (
                  <p className="text-sm text-red-600 mt-1">{errors.gstRegistrationNo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Billing Address */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <MapPin className="size-5 text-red-500" />
              Billing Address
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="addressLine1" className="text-sm font-semibold text-gray-900">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressLine1"
                  placeholder="e.g. Suite 404, Tech Plaza, 5th Avenue"
                  className="mt-2 h-11"
                  value={formData.address.addressLine1}
                  onChange={(e) => updateAddressField('addressLine1', e.target.value)}
                />
                {errors.addressLine1 && (
                  <p className="text-sm text-red-600 mt-1">{errors.addressLine1}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="addressLine2" className="text-sm font-semibold text-gray-900">
                  Address Line 2 <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="addressLine2"
                  placeholder="e.g. Near Central Park"
                  className="mt-2 h-11"
                  value={formData.address.addressLine2}
                  onChange={(e) => updateAddressField('addressLine2', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-sm font-semibold text-gray-900">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="New York"
                  className="mt-2 h-11"
                  value={formData.address.city}
                  onChange={(e) => updateAddressField('city', e.target.value)}
                />
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <Label htmlFor="district" className="text-sm font-semibold text-gray-900">
                  District <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="district"
                  placeholder="Manhattan"
                  className="mt-2 h-11"
                  value={formData.address.district}
                  onChange={(e) => updateAddressField('district', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-sm font-semibold text-gray-900">
                  State / Region <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  placeholder="NY"
                  className="mt-2 h-11"
                  value={formData.address.state}
                  onChange={(e) => updateAddressField('state', e.target.value)}
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <Label htmlFor="pincode" className="text-sm font-semibold text-gray-900">
                  Zip / Pin Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pincode"
                  placeholder="10001"
                  className="mt-2 h-11"
                  value={formData.address.pincode}
                  onChange={(e) => updateAddressField('pincode', e.target.value)}
                />
                {errors.pincode && (
                  <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-semibold text-gray-900">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  placeholder="United States"
                  className="mt-2 h-11"
                  value={formData.address.country}
                  onChange={(e) => updateAddressField('country', e.target.value)}
                />
                {errors.country && (
                  <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Social Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Share2 className="size-5 text-indigo-500" />
              Social Handles <span className="text-gray-500 text-xs font-normal">(Optional)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-900">
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/company/agency"
                  className="mt-2 h-11"
                  value={formData.socials.linkedin}
                  onChange={(e) => updateSocialField('linkedin', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-sm font-semibold text-gray-900">
                  Twitter / X URL
                </Label>
                <Input
                  id="twitter"
                  placeholder="https://x.com/agency"
                  className="mt-2 h-11"
                  value={formData.socials.twitter}
                  onChange={(e) => updateSocialField('twitter', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="facebook" className="text-sm font-semibold text-gray-900">
                  Facebook URL
                </Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/agency"
                  className="mt-2 h-11"
                  value={formData.socials.facebook}
                  onChange={(e) => updateSocialField('facebook', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="instagram" className="text-sm font-semibold text-gray-900">
                  Instagram URL
                </Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/agency"
                  className="mt-2 h-11"
                  value={formData.socials.instagram}
                  onChange={(e) => updateSocialField('instagram', e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 h-12 px-6"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-semibold"
          >
            Continue
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
