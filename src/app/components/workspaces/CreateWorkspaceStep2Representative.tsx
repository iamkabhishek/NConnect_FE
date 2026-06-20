import { useState } from 'react';
import { ArrowRight, ArrowLeft, UserCircle, Upload } from 'lucide-react';
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

export interface RepresentativeData {
  name: string;
  designation: string;
  role: string;
  email: string;
  phone: string;
  profileImage?: string;
}

interface CreateWorkspaceStep2Props {
  onNext: (data: RepresentativeData) => void;
  onBack: () => void;
  initialData?: RepresentativeData;
}

const roles = [
  'CEO',
  'CTO',
  'CMO',
  'Marketing Manager',
  'Marketing Director',
  'Account Manager',
  'Business Owner',
  'Team Lead',
  'Project Manager',
  'Other',
];

export function CreateWorkspaceStep2Representative({ onNext, onBack, initialData }: CreateWorkspaceStep2Props) {
  const [formData, setFormData] = useState<RepresentativeData>(
    initialData || {
      name: '',
      designation: '',
      role: '',
      email: '',
      phone: '',
      profileImage: undefined,
    }
  );

  const [errors, setErrors] = useState<Partial<RepresentativeData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<RepresentativeData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Contact person name is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const updateField = (field: keyof RepresentativeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <UserCircle className="size-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Account Representative</h3>
          <p className="text-sm text-gray-600">Primary contact person for this workspace</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile Image */}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Profile Image <span className="text-gray-500 text-xs">(Optional)</span>
          </Label>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="size-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="profileImage">
                <Button type="button" variant="outline" size="sm" className="w-full cursor-pointer" asChild>
                  <span>
                    <Upload className="size-4 mr-2" />
                    Upload Photo
                  </span>
                </Button>
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, max 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Contact Person Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
            Contact Person Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., John Doe"
            className="mt-2"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <Label htmlFor="designation" className="text-sm font-semibold text-gray-900">
            Designation <span className="text-red-500">*</span>
          </Label>
          <Input
            id="designation"
            type="text"
            placeholder="e.g., Marketing Director"
            className="mt-2"
            value={formData.designation}
            onChange={(e) => updateField('designation', e.target.value)}
          />
          {errors.designation && (
            <p className="text-sm text-red-600 mt-1">{errors.designation}</p>
          )}
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
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
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

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@company.com"
            className="mt-2"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
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
            className="mt-2"
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
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </form>
  );
}
