import { useState } from 'react';
import { ArrowRight, ArrowLeft, Palette, Upload, X } from 'lucide-react';
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

export interface BrandingData {
  logo?: string;
  logoShape?: 'square' | 'circular';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  typography: string;
}

interface CreateWorkspaceStep4Props {
  onNext: (data: BrandingData) => void;
  onBack: () => void;
  initialData?: BrandingData;
}

const typographyOptions = [
  { value: 'inter', label: 'Inter (Modern & Clean)' },
  { value: 'roboto', label: 'Roboto (Professional)' },
  { value: 'opensans', label: 'Open Sans (Friendly)' },
  { value: 'lato', label: 'Lato (Corporate)' },
  { value: 'montserrat', label: 'Montserrat (Bold & Stylish)' },
  { value: 'poppins', label: 'Poppins (Contemporary)' },
  { value: 'raleway', label: 'Raleway (Elegant)' },
  { value: 'nunito', label: 'Nunito (Rounded & Soft)' },
  { value: 'others', label: 'Others' },
];

const colorPresets = {
  primary: ['#4A90E2', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981'],
  secondary: ['#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A', '#6B7280', '#9CA3AF'],
  tertiary: ['#F1F5F9', '#E2E8F0', '#CBD5E1', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#FECACA', '#FED7AA'],
};

export function CreateWorkspaceStep4Branding({ onNext, onBack, initialData }: CreateWorkspaceStep4Props) {
  const [formData, setFormData] = useState<BrandingData>(
    initialData || {
      primaryColor: '#4A90E2',
      secondaryColor: '#64748B',
      tertiaryColor: '#E2E8F0',
      typography: 'inter',
      logoShape: 'square',
    }
  );

  const [errors, setErrors] = useState<Partial<BrandingData>>({});
  const [showCustomTypographyDialog, setShowCustomTypographyDialog] = useState(false);
  const [customTypography, setCustomTypography] = useState('');
  const [customTypographyError, setCustomTypographyError] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<BrandingData> = {};

    if (!formData.logo) {
      newErrors.logo = 'Company logo is required';
    }

    if (!formData.primaryColor) {
      newErrors.primaryColor = 'Primary color is required';
    }

    if (!formData.secondaryColor) {
      newErrors.secondaryColor = 'Secondary color is required';
    }

    if (!formData.tertiaryColor) {
      newErrors.tertiaryColor = 'Tertiary color is required';
    }

    if (!formData.typography) {
      newErrors.typography = 'Please select a typography';
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

  const updateField = (field: keyof BrandingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
        if (errors.logo) {
          setErrors(prev => ({ ...prev, logo: undefined }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setFormData(prev => ({ ...prev, logo: undefined }));
  };

  const handleCustomTypographyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTypography(e.target.value);
    setCustomTypographyError('');
  };

  const handleCustomTypographySubmit = () => {
    if (customTypography.trim() === '') {
      setCustomTypographyError('Typography name is required');
      return;
    }
    updateField('typography', customTypography);
    setShowCustomTypographyDialog(false);
  };

  const handleTypographyChange = (value: string) => {
    if (value === 'others') {
      setShowCustomTypographyDialog(true);
      setCustomTypography('');
      setCustomTypographyError('');
    } else {
      updateField('typography', value);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Palette className="size-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Branding</h3>
          <p className="text-sm text-gray-600">Customize your workspace appearance</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Company Logo <span className="text-red-500">*</span>
          </Label>
          
          {/* Logo Shape Selection */}
          <div className="mb-4">
            <Label className="text-sm text-gray-700 mb-2 block">Logo Shape</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, logoShape: 'square' }))}
                className={`flex-1 px-4 py-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  formData.logoShape === 'square'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="w-6 h-6 border-2 border-current rounded"></div>
                <span className="font-medium">Square</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, logoShape: 'circular' }))}
                className={`flex-1 px-4 py-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  formData.logoShape === 'circular'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="w-6 h-6 border-2 border-current rounded-full"></div>
                <span className="font-medium">Circular</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div 
              className={`w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden border-2 ${
                errors.logo ? 'border-red-300' : 'border-dashed border-gray-300'
              } ${formData.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'}`}
            >
              {formData.logo ? (
                <div className="relative w-full h-full">
                  <img 
                    src={formData.logo} 
                    alt="Logo" 
                    className={`w-full h-full object-cover ${formData.logoShape === 'circular' ? '' : 'p-2 object-contain'}`}
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-500 hover:text-gray-900 shadow-md z-10"
                    onClick={handleLogoRemove}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <Upload className="size-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="logoUpload">
                <Button 
                  type="button" 
                  variant="outline" 
                  className={`w-full cursor-pointer ${errors.logo ? 'border-red-300' : ''}`}
                  asChild
                >
                  <span>
                    <Upload className="size-4 mr-2" />
                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                  </span>
                </Button>
              </label>
              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG or SVG, max 2MB. Shape will be {formData.logoShape === 'circular' ? 'circular' : 'square'}.
              </p>
              {errors.logo && (
                <p className="text-sm text-red-600 mt-1">{errors.logo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Primary Brand Color <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-2">
              {colorPresets.primary.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField('primaryColor', color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.primaryColor === color
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                placeholder="#4A90E2"
                className="flex-1"
              />
            </div>
          </div>
          {errors.primaryColor && (
            <p className="text-sm text-red-600 mt-1">{errors.primaryColor}</p>
          )}
        </div>

        {/* Secondary Color */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Secondary Brand Color <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-2">
              {colorPresets.secondary.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField('secondaryColor', color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.secondaryColor === color
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                placeholder="#64748B"
                className="flex-1"
              />
            </div>
          </div>
          {errors.secondaryColor && (
            <p className="text-sm text-red-600 mt-1">{errors.secondaryColor}</p>
          )}
        </div>

        {/* Tertiary Color */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Tertiary Brand Color <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-2">
              {colorPresets.tertiary.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField('tertiaryColor', color)}
                  className={`w-10 h-10 rounded-lg transition-all border ${
                    formData.tertiaryColor === color
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formData.tertiaryColor}
                onChange={(e) => updateField('tertiaryColor', e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.tertiaryColor}
                onChange={(e) => updateField('tertiaryColor', e.target.value)}
                placeholder="#E2E8F0"
                className="flex-1"
              />
            </div>
          </div>
          {errors.tertiaryColor && (
            <p className="text-sm text-red-600 mt-1">{errors.tertiaryColor}</p>
          )}
        </div>

        {/* Typography */}
        <div>
          <Label htmlFor="typography" className="text-sm font-semibold text-gray-900">
            Typography <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.typography}
            onValueChange={handleTypographyChange}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              {typographyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.typography && (
            <p className="text-sm text-red-600 mt-1">{errors.typography}</p>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Brand Preview</h4>
          <div className="flex items-center gap-3 flex-wrap">
            {formData.logo && (
              <div 
                className={`w-16 h-16 flex items-center justify-center bg-white border overflow-hidden ${
                  formData.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'
                }`}
              >
                <img 
                  src={formData.logo} 
                  alt="Logo Preview" 
                  className={`w-full h-full ${formData.logoShape === 'circular' ? 'object-cover' : 'object-contain p-2'}`}
                />
              </div>
            )}
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: formData.primaryColor }}
            >
              A
            </div>
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: formData.secondaryColor }}
            >
              B
            </div>
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-gray-600 font-bold border"
              style={{ backgroundColor: formData.tertiaryColor }}
            >
              C
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
    {/* Custom Typography Dialog */}
    {showCustomTypographyDialog && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Please Specify Typography</h3>
            <button
              onClick={() => setShowCustomTypographyDialog(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </div>

          {/* Dialog Content */}
          <div className="p-6">
            <Label htmlFor="customTypography" className="text-sm font-semibold text-gray-900">
              Custom Typography Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customTypography"
              type="text"
              value={customTypography}
              onChange={handleCustomTypographyChange}
              placeholder="e.g., Helvetica, Arial, Custom Font"
              className="mt-2"
              autoFocus
            />
            {customTypographyError && (
              <p className="text-sm text-red-600 mt-2">{customTypographyError}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Enter the name of your custom typography/font family
            </p>
          </div>

          {/* Dialog Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCustomTypographyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCustomTypographySubmit}
            >
              Save Typography
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}