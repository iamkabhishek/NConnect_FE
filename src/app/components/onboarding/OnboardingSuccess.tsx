import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface OnboardingSuccessProps {
  workspaceName: string;
  onContinue: () => void;
}

export function OnboardingSuccess({ workspaceName, onContinue }: OnboardingSuccessProps) {
  const [countdown, setCountdown] = useState(5);
  const hasCalled = useRef(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!hasCalled.current) {
      hasCalled.current = true;
      onContinue();
    }
  }, [countdown, onContinue]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Confetti Animation Effect */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-32 w-32 rounded-full bg-green-400 opacity-20"></div>
        </div>
        <div className="relative bg-gradient-to-br from-green-100 to-green-200 rounded-full p-12 inline-block">
          <CheckCircle className="size-24 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        You're all set! 🎉
      </h1>
      <p className="text-xl text-gray-600 mb-12">
        Your workspace <span className="font-semibold text-blue-600">'{workspaceName}'</span> is ready to go
      </p>

      {/* Optional Tour Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8 mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="size-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            What's Next?
          </h2>
        </div>
        <p className="text-gray-700 mb-6">
          You can start exploring NConnect or take a quick tour to learn about the key features.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">📥 Import Contacts</h3>
            <p className="text-sm text-gray-600">Upload your subscriber list to get started</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">🎨 Create Template</h3>
            <p className="text-sm text-gray-600">Design beautiful email templates</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">📧 Send Campaign</h3>
            <p className="text-sm text-gray-600">Launch your first newsletter campaign</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Track Results</h3>
            <p className="text-sm text-gray-600">Monitor opens, clicks, and engagement</p>
          </div>
        </div>
      </div>

      {/* Auto-redirect Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          Redirecting to your dashboard in <strong className="text-blue-600">{countdown}</strong> seconds...
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white h-14 px-10 text-lg"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
