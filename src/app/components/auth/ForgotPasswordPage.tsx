import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Invalid email address');
      return false;
    }
    setError('');
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setSubmittedEmail(email);
    setIsSuccess(true);
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Reset link sent again to ' + submittedEmail);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Sign In
          </Button>

          <div className="bg-white rounded-xl shadow-lg p-12">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="size-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Check your email
            </h1>
            <p className="text-center text-gray-600 mb-8 leading-relaxed">
              If an account exists for <strong>{submittedEmail}</strong>, we sent reset instructions to that email address.
            </p>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>What's next?</strong>
              </p>
              <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the reset link in the email</li>
                <li>Create a new password</li>
              </ol>
            </div>

            {/* Resend Option */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Sending...' : 'Resend email'}
              </Button>
            </div>

            {/* Back to Sign In */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Check your spam folder if you don't see the email within a few minutes
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          Back to Sign In
        </Button>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-12">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <Mail className="size-12 text-blue-600" />
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Reset your password
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your email and we'll send you a reset link
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
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
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
                  Sending reset link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Remember your password?{' '}
              <span className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 text-center">
            🔒 For security, we won't confirm if this email exists in our system
          </p>
        </div>
      </div>
    </div>
  );
}
