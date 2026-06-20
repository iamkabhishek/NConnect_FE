import { useState } from 'react';
import { ArrowLeft, Send, Inbox, ArrowLeftRight, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface OnboardingStep4Props {
  onComplete: (data: UseCaseData) => void;
  onBack: () => void;
  initialData?: UseCaseData;
}

export interface UseCaseData {
  primaryGoal: 'send' | 'receive' | 'both' | '';
  subscriberCount: string;
  frequency: string;
  industry: string;
}

const subscriberRanges = [
  'Just starting (0-100)',
  'Growing (100-500)',
  'Established (500-1,000)',
  'Scaling (1,000-5,000)',
  'Large audience (5,000+)',
];

const frequencies = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Occasionally'];

const industries = [
  'Technology',
  'E-commerce',
  'Marketing/Advertising',
  'Media/Publishing',
  'Education',
  'Healthcare',
  'Finance',
  'Non-profit',
  'SaaS',
  'Agency',
  'Consulting',
  'Real Estate',
  'Entertainment',
  'Food & Beverage',
  'Other',
];

const goalOptions = [
  {
    id: 'send' as const,
    icon: Send,
    title: 'Send newsletters to my subscribers',
    description: 'I want to create and send email campaigns',
    color: 'blue',
  },
  {
    id: 'receive' as const,
    icon: Inbox,
    title: 'Manage incoming newsletters',
    description: 'I want to organize newsletters I receive',
    color: 'purple',
  },
  {
    id: 'both' as const,
    icon: ArrowLeftRight,
    title: 'Both sending and receiving',
    description: 'I need both capabilities',
    color: 'green',
  },
];

export function OnboardingStep4UseCase({ onComplete, onBack, initialData }: OnboardingStep4Props) {
  const [formData, setFormData] = useState<UseCaseData>(
    initialData || {
      primaryGoal: '',
      subscriberCount: '',
      frequency: '',
      industry: '',
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof UseCaseData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UseCaseData, string>> = {};

    if (!formData.primaryGoal) {
      newErrors.primaryGoal = 'Please select your primary goal';
    }
    if (!formData.subscriberCount) {
      newErrors.subscriberCount = 'Please select your subscriber count';
    }
    if (!formData.frequency) {
      newErrors.frequency = 'Please select your sending frequency';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onComplete(formData);
  };

  const updateField = <K extends keyof UseCaseData>(field: K, value: UseCaseData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          How will you use NConnect?
        </h1>
        <p className="text-gray-600">
          This helps us set up your workspace with the right defaults
        </p>
        <p className="text-sm text-gray-500 mt-4">Step 5 of 5</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primary Goal Cards */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-4 block">
            Primary Goal <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goalOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.primaryGoal === option.id;
              
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateField('primaryGoal', option.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-500 rounded-full p-1">
                        <Check className="size-3 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      option.color === 'blue'
                        ? 'bg-blue-100'
                        : option.color === 'purple'
                        ? 'bg-purple-100'
                        : 'bg-green-100'
                    }`}
                  >
                    <Icon
                      className={`size-6 ${
                        option.color === 'blue'
                          ? 'text-blue-600'
                          : option.color === 'purple'
                          ? 'text-purple-600'
                          : 'text-green-600'
                      }`}
                    />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
          {errors.primaryGoal && (
            <p className="text-sm text-red-600 mt-2">{errors.primaryGoal}</p>
          )}
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
          {/* Subscriber Count */}
          <div>
            <Label htmlFor="subscriberCount" className="text-sm font-semibold text-gray-900">
              Current Subscriber Count <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.subscriberCount}
              onValueChange={(value) => updateField('subscriberCount', value)}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {subscriberRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subscriberCount && (
              <p className="text-sm text-red-600 mt-1">{errors.subscriberCount}</p>
            )}
          </div>

          {/* Send Frequency */}
          <div>
            <Label htmlFor="frequency" className="text-sm font-semibold text-gray-900">
              How often do you send? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => updateField('frequency', value)}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-sm text-red-600 mt-1">{errors.frequency}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <Label htmlFor="industry" className="text-sm font-semibold text-gray-900">
              Industry <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => updateField('industry', value)}
            >
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-gray-600"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-8"
          >
            {isSubmitting ? (
              <>
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup
                <Check className="ml-2 size-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}