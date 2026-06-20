import { ArrowRight, CheckCircle, FolderOpen, Settings, Users, Mail } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface OnboardingStep1Props {
  onNext: () => void;
}

export function OnboardingStep1Welcome({ onNext }: OnboardingStep1Props) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Welcome Illustration */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2">
          <Mail className="size-10 text-[#4A90E2]" />
          <span className="text-2xl font-bold text-gray-900">NConnect</span>
        </div>
      </div>

      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Welcome to NConnect!
      </h1>
      <p className="text-xl text-gray-600 mb-6">
        Let's set up your account in just a few steps
      </p>

      {/* Features List */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 text-center max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          In the next few steps, you'll:
        </h2>
        <ul className="space-y-3">
          <li className="flex items-center justify-center">
            <Users className="size-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Tell us a bit about yourself</span>
          </li>
          <li className="flex items-center justify-center">
            <Settings className="size-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Set up your agency profile</span>
          </li>
          <li className="flex items-center justify-center">
            <FolderOpen className="size-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Create your first workspace</span>
          </li>
          <li className="flex items-center justify-center">
            <CheckCircle className="size-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Choose your use case</span>
          </li>
        </ul>
      </div>

      {/* Continue Button */}
      <Button
        onClick={onNext}
        size="lg"
        className="bg-blue-500 hover:bg-blue-600 text-white h-14 px-10 text-lg"
      >
        Get Started
        <ArrowRight className="ml-2 size-5" />
      </Button>
    </div>
  );
}