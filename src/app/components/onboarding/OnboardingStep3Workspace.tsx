import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, FolderOpen, Check, X, Mail } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

interface OnboardingStep3Props {
  onNext: (data: WorkspaceData) => void;
  onBack: () => void;
  initialData?: WorkspaceData;
}

export interface WorkspaceData {
  name: string;
  identifier: string;
  description: string;
  color: string;
}

const presetColors = [
  { name: 'Blue', value: '#4A90E2' },
  { name: 'Green', value: '#27AE60' },
  { name: 'Purple', value: '#9B59B6' },
  { name: 'Red', value: '#E74C3C' },
  { name: 'Orange', value: '#F39C12' },
  { name: 'Teal', value: '#1ABC9C' },
  { name: 'Dark Gray', value: '#34495E' },
  { name: 'Pink', value: '#E91E63' },
];

export function OnboardingStep3Workspace({ onNext, onBack, initialData }: OnboardingStep3Props) {
  const [formData, setFormData] = useState<WorkspaceData>(
    initialData || {
      name: '',
      identifier: '',
      description: '',
      color: '#4A90E2',
    }
  );
  const [errors, setErrors] = useState<Partial<WorkspaceData>>({});
  const [identifierAvailable, setIdentifierAvailable] = useState<boolean | null>(null);
  const [checkingIdentifier, setCheckingIdentifier] = useState(false);

  // Auto-generate identifier from name
  useEffect(() => {
    if (formData.name && !formData.identifier) {
      const generated = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);
      setFormData(prev => ({ ...prev, identifier: generated }));
    }
  }, [formData.name]);

  // Check identifier availability (mock)
  useEffect(() => {
    if (formData.identifier.length >= 3) {
      setCheckingIdentifier(true);
      const timer = setTimeout(() => {
        // Mock availability check - in real app, this would be an API call
        setIdentifierAvailable(true);
        setCheckingIdentifier(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIdentifierAvailable(null);
    }
  }, [formData.identifier]);

  const validate = (): boolean => {
    const newErrors: Partial<WorkspaceData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Workspace name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Workspace name must be at least 3 characters';
    }

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Workspace identifier is required';
    } else if (formData.identifier.length < 3) {
      newErrors.identifier = 'Identifier must be at least 3 characters';
    } else if (!/^[a-z0-9-]+$/.test(formData.identifier)) {
      newErrors.identifier = 'Only lowercase letters, numbers, and hyphens allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && identifierAvailable) {
      onNext(formData);
    }
  };

  const updateField = (field: keyof WorkspaceData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create your workspace
        </h1>
        <p className="text-gray-600">
          Create a workspace to segregate organizations, departments, or clients. Once created, it will be automatically available throughout the portal with your chosen color and settings.
        </p>
        <p className="text-sm text-gray-500 mt-4">Step 3 of 5</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
          {/* Workspace Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., My Business Newsletter"
              autoFocus
              className="mt-2 h-12"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Workspace Identifier */}
          <div>
            <Label htmlFor="identifier" className="text-sm font-semibold text-gray-900">
              Workspace Identifier <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">nconnect.com/ws/</span>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="my-workspace"
                  className="h-12 flex-1"
                  value={formData.identifier}
                  onChange={(e) => {
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '')
                      .substring(0, 30);
                    updateField('identifier', value);
                  }}
                />
              </div>
              {formData.identifier && (
                <div className="mt-2 flex items-center text-sm">
                  {checkingIdentifier ? (
                    <>
                      <div className="size-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-gray-600">Checking availability...</span>
                    </>
                  ) : identifierAvailable ? (
                    <>
                      <Check className="size-4 text-green-600 mr-2" />
                      <span className="text-green-600">Available</span>
                    </>
                  ) : identifierAvailable === false ? (
                    <>
                      <X className="size-4 text-red-600 mr-2" />
                      <span className="text-red-600">Already taken</span>
                    </>
                  ) : null}
                </div>
              )}
              {errors.identifier && (
                <p className="text-sm text-red-600 mt-1">{errors.identifier}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Your workspace URL: https://nconnect.com/ws/{formData.identifier || 'identifier'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
              Description <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of your workspace..."
              className="mt-2"
              rows={3}
              maxLength={200}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Color Picker */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Workspace Color <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => updateField('color', color.value)}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {formData.color === color.value && (
                    <Check className="size-5 text-white mx-auto drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Preview</p>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: formData.color }}
              >
                <FolderOpen className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg truncate">
                  {formData.name || 'Workspace Name'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {formData.identifier || 'workspace-id'}
                </p>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {formData.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <span>0 Contacts</span>
                  <span>•</span>
                  <span>0 Campaigns</span>
                </div>
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
            disabled={!identifierAvailable || checkingIdentifier}
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