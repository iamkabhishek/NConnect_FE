import { useState } from 'react';
import { ArrowRight, ArrowLeft, Key, UserCircle, Upload, Mail } from 'lucide-react';
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

export interface CredentialsData {
  useSameContact: boolean;
  username?: string;
  designation?: string;
  role?: string;
  email: string;
  profileImage?: string;
  otpVerified: boolean;
  otp?: string;
}

interface CreateWorkspaceStep3Props {
  onNext: (data: CredentialsData) => void;
  onBack: () => void;
  initialData?: CredentialsData;
  representativeEmail?: string;
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

export function CreateWorkspaceStep3Credentials({ 
  onNext, 
  onBack, 
  initialData,
  representativeEmail 
}: CreateWorkspaceStep3Props) {
  const [formData, setFormData] = useState<CredentialsData>(
    initialData || {
      useSameContact: true,
      email: representativeEmail || '',
      otpVerified: false,
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof CredentialsData, string>>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CredentialsData, string>> = {};

    if (!formData.useSameContact) {
      if (!formData.username?.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!formData.designation?.trim()) {
        newErrors.designation = 'Designation is required';
      }
      if (!formData.role) {
        newErrors.role = 'Please select a role';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }



    if (!formData.otpVerified) {
      newErrors.otp = 'Please verify your email with OTP';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const updateField = <K extends keyof CredentialsData>(field: K, value: CredentialsData[K]) => {
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

  const handleSendOTP = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    // Simulate sending OTP
    setOtpSent(true);
    // In a real application, this would call an API to send the OTP
    console.log('Sending OTP to:', formData.email);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter a valid 6-digit OTP' }));
      return;
    }

    setIsVerifying(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      // In a real application, this would call an API to verify the OTP
      setFormData(prev => ({ ...prev, otpVerified: true }));
      setErrors(prev => ({ ...prev, otp: undefined }));
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Key className="size-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Account Credentials</h3>
          <p className="text-sm text-gray-600">Set up login credentials for the workspace</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Use Same Contact Toggle */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.useSameContact}
              onChange={(e) => {
                const checked = e.target.checked;
                updateField('useSameContact', checked);
                if (checked) {
                  updateField('email', representativeEmail || '');
                }
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <span className="font-semibold text-gray-900">Use same contact person</span>
              <p className="text-sm text-gray-600 mt-1">
                Use the representative's email as account credentials
              </p>
            </div>
          </Label>
        </div>

        {/* New User Details (shown only if not using same contact) */}
        {!formData.useSameContact && (
          <>
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
                  <label htmlFor="newProfileImage">
                    <Button type="button" variant="outline" size="sm" className="w-full cursor-pointer" asChild>
                      <span>
                        <Upload className="size-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                  </label>
                  <input
                    id="newProfileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-sm font-semibold text-gray-900">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g., johndoe"
                className="mt-2"
                value={formData.username || ''}
                onChange={(e) => updateField('username', e.target.value)}
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <Label htmlFor="newDesignation" className="text-sm font-semibold text-gray-900">
                Designation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newDesignation"
                type="text"
                placeholder="e.g., Marketing Manager"
                className="mt-2"
                value={formData.designation || ''}
                onChange={(e) => updateField('designation', e.target.value)}
              />
              {errors.designation && (
                <p className="text-sm text-red-600 mt-1">{errors.designation}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="newRole" className="text-sm font-semibold text-gray-900">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role || ''}
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
          </>
        )}

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="user@company.com"
            className="mt-2"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={formData.useSameContact}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>



        {/* OTP Verification */}
        <div className="border-t pt-5">
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Email Verification <span className="text-red-500">*</span>
          </Label>
          
          {!formData.otpVerified ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp || ''}
                  onChange={(e) => updateField('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={!otpSent}
                  className="flex-1"
                />
                {!otpSent ? (
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    <Mail className="size-4 mr-2" />
                    Send OTP
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={isVerifying || !formData.otp || formData.otp.length !== 6}
                    className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                )}
              </div>
              {otpSent && (
                <p className="text-sm text-gray-600">
                  OTP sent to {formData.email}.{' '}
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              )}
              {errors.otp && (
                <p className="text-sm text-red-600">{errors.otp}</p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-700">Email verified successfully!</span>
            </div>
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
