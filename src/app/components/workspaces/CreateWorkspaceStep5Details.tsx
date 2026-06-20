import { useState } from 'react';
import { ArrowLeft, Check, Briefcase, Upload, Copy } from 'lucide-react';
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
import { BrandingData } from './CreateWorkspaceStep4Branding';

// Utility function to generate workspace ID
const generateWorkspaceId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'WS-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export interface WorkspaceDetailsData {
  workspaceId: string;
  name: string;
  logo?: string;
  category: string;
  color: string;
  branding?: BrandingData;
}

interface CreateWorkspaceStep5Props {
  onComplete: (data: WorkspaceDetailsData) => void;
  onBack: () => void;
  initialData?: WorkspaceDetailsData;
  companyLogo?: string;
}

const workspaceCategories = [
  'Marketing',
  'Sales',
  'Product',
  'Customer Success',
  'Internal Communications',
  'Agency Client Work',
  'Personal Projects',
  'Other',
];

const colorOptions = [
  '#4A90E2', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export function CreateWorkspaceStep5Details({ 
  onComplete, 
  onBack, 
  initialData,
  companyLogo 
}: CreateWorkspaceStep5Props) {
  const [formData, setFormData] = useState<WorkspaceDetailsData>(
    initialData || {
      workspaceId: generateWorkspaceId(),
      name: '',
      logo: companyLogo,
      category: '',
      color: '#4A90E2',
    }
  );

  const [errors, setErrors] = useState<Partial<WorkspaceDetailsData>>({});
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyWorkspaceId = () => {
    navigator.clipboard.writeText(formData.workspaceId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const validate = (): boolean => {
    const newErrors: Partial<WorkspaceDetailsData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Workspace name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a workspace category';
    }

    if (!formData.color) {
      newErrors.color = 'Please select a workspace color';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete(formData);
    }
  };

  const updateField = (field: keyof WorkspaceDetailsData, value: string) => {
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
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Briefcase className="size-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Workspace Details</h3>
          <p className="text-sm text-gray-600">Final step - configure your workspace</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Workspace ID (Auto-generated) */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Workspace ID
          </Label>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-blue-700 mb-1 font-medium">Auto-generated ID</p>
                <p className="text-lg font-mono font-bold text-blue-900">
                  {formData.workspaceId}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyWorkspaceId}
                className="flex-shrink-0"
              >
                {copiedId ? (
                  <Check className="size-4 mr-1 text-green-600" />
                ) : (
                  <Copy className="size-4 mr-1" />
                )}
                {copiedId ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              This unique identifier will be used to reference your workspace across the platform
            </p>
          </div>
        </div>

        {/* Workspace Name */}
        <div>
          <Label htmlFor="workspaceName" className="text-sm font-semibold text-gray-900">
            Workspace Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="workspaceName"
            type="text"
            placeholder="e.g., Marketing Workspace, Client Project"
            className="mt-2"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            This name will appear in your workspace selector and throughout the platform
          </p>
        </div>

        {/* Workspace Logo */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Workspace Logo
          </Label>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-blue-800">
              <strong>Auto-fetched:</strong> Using company logo from branding step
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
              {formData.logo ? (
                <img src={formData.logo} alt="Workspace Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <Briefcase className="size-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="workspaceLogo">
                <Button type="button" variant="outline" className="w-full cursor-pointer" asChild>
                  <span>
                    <Upload className="size-4 mr-2" />
                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                  </span>
                </Button>
              </label>
              <input
                id="workspaceLogo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <p className="text-xs text-gray-500 mt-2">
                Optional: Override with a different logo
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Category */}
        <div>
          <Label htmlFor="category" className="text-sm font-semibold text-gray-900">
            Workspace Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => updateField('category', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {workspaceCategories.map((category) => (
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

        {/* Workspace Color */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">
            Workspace Color <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-8 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateField('color', color)}
                className={`w-10 h-10 rounded-lg transition-all ${
                  formData.color === color
                    ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              >
                {formData.color === color && (
                  <Check className="size-5 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
          {errors.color && (
            <p className="text-sm text-red-600 mt-1">{errors.color}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            This color will be used for workspace identification
          </p>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Workspace Preview</h4>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: formData.color }}
            >
              {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {formData.name || 'Workspace Name'}
              </p>
              <p className="text-xs font-mono text-gray-500">
                {formData.workspaceId}
              </p>
              <p className="text-sm text-gray-600">
                {formData.category || 'Category'}
              </p>
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
          <Check className="mr-2 size-4" />
          Create Workspace
        </Button>
      </div>
    </form>
  );
}