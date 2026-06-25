import { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { sendOtp } from '@/app/lib/api';
import { useRouter } from 'next/navigation';


interface SignInPageProps {
  onSignUp: () => void;
  onSignInSuccess: (email: string, session: string) => void;
  onBack: () => void;
}

export function SignInPage({ onSignUp, onSignInSuccess, onBack }: SignInPageProps) {
  const { switchPersona } = useWorkspace();
  const router = useRouter();
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
    
    // Check for valid domain
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
      const result = await sendOtp(email, 'signin');
      
      // Synchronize persona state in global workspace context (creates dynamic owner persona if brand new)
      switchPersona(email);
      
      setIsLoading(false);
      onSignInSuccess(email, result.session);
    } catch (err: any) {
      console.error('[SignIn] sendOtp failed:', err);
      setError(err.message || 'Failed to send OTP code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleContactSupport = (e: React.MouseEvent) => {
    e.preventDefault();
    switchPersona('guest@nconnect.app');
    router.push('/helpdesk');
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
            Welcome back
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your email to sign in
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
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                className="mt-2"
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
                'Continue to Verify'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button
              onClick={onSignUp}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign up
            </button>
          </p>

          {/* Contact Support */}
          <p className="text-center text-sm text-gray-600 mt-3">
            Need help?{' '}
            <button
              type="button"
              onClick={handleContactSupport}
              className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none"
            >
              Contact Support
            </button>
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