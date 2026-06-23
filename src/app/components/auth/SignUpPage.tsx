import { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { sendOtp } from '@/app/lib/api';

interface SignUpPageProps {
  onSignIn: () => void;
  onSignUpSuccess: (email: string, session: string) => void;
  onBack: () => void;
}

export function SignUpPage({ onSignIn, onSignUpSuccess, onBack }: SignUpPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    // Check for @ symbol
    if (!email.includes('@')) {
      setError('Email must contain @ symbol');
      return false;
    }
    
    // Check for valid domain with .com or other TLD
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return false;
    }

    setError('');
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const result = await sendOtp(email);
      setIsLoading(false);
      onSignUpSuccess(email, result.session);
    } catch (err: any) {
      console.error('[SignUp] sendOtp failed:', err);
      setError(err.message || 'Failed to send OTP code. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Mail className="size-12 text-blue-500" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your email to get started
          </p>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoFocus
                className="mt-2 h-12"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={onSignIn}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in
            </button>
          </p>

          {/* Contact Support */}
          <p className="text-center text-sm text-gray-600 mt-3">
            Need help?{' '}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 text-center">
            🔒 We'll send an 8-digit verification code to your email
          </p>
        </div>
      </div>
    </div>
  );
}