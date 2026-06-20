import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
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

interface OnboardingStep2Props {
  onNext: (data: PersonalInfoData) => void;
  onBack: () => void;
  initialData?: PersonalInfoData;
}

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  phone: string;
}

const roleOptions = [
  'Content Creator',
  'Marketer',
  'Business Owner',
  'Marketing Agency',
  'Developer',
  'Other',
];

export function OnboardingStep2Personal({ onNext, onBack, initialData }: OnboardingStep2Props) {
  const [formData, setFormData] = useState<PersonalInfoData>(
    initialData || {
      firstName: '',
      lastName: '',
      company: '',
      role: '',
      phone: '',
    }
  );
  const [errors, setErrors] = useState<Partial<PersonalInfoData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<PersonalInfoData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
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

  const updateField = (field: keyof PersonalInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tell us about yourself
        </h1>
        <p className="text-gray-600">
          This helps us personalize your experience
        </p>
        <p className="text-sm text-gray-500 mt-4">Step 1 of 5</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName" className="text-sm font-semibold text-gray-900">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              autoFocus
              className="mt-2 h-12"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName" className="text-sm font-semibold text-gray-900">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="mt-2 h-12"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Company/Organization */}
          <div>
            <Label htmlFor="company" className="text-sm font-semibold text-gray-900">
              Company/Organization <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Inc"
              className="mt-2 h-12"
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role" className="text-sm font-semibold text-gray-900">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => updateField('role', value)}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="mt-2 h-12"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-gray-600"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-8"
          >
            Continue
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}