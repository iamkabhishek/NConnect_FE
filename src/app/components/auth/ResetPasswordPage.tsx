import { useState } from 'react';
import { Mail, Eye, EyeOff, Check, X, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';

interface ResetPasswordPageProps {
  token?: string;
  onResetSuccess: () => void;
}

export function ResetPasswordPage({ token = 'demo-token', onResetSuccess }: ResetPasswordPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 12.5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  // Password requirements
  const requirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'One number', met: /[0-9]/.test(newPassword) },
    { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);

    // Countdown and redirect
    let timeLeft = 3;
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft === 0) {
        clearInterval(timer);
        onResetSuccess();
      }
    }, 1000);
  };

  // Token expired/invalid state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="bg-red-100 p-4 rounded-full inline-block mb-6">
              <X className="size-12 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Link Expired
            </h1>
            <p className="text-gray-600 mb-8">
              This password reset link has expired or is invalid.
            </p>

            <Button
              onClick={() => window.location.href = '/forgot-password'}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Request New Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
              <CheckCircle className="size-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Password Reset Successful!
            </h1>
            <p className="text-gray-600 mb-8">
              Your password has been updated successfully.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                Redirecting to sign in page in <strong>{countdown}</strong> seconds...
              </p>
            </div>

            <Button
              onClick={onResetSuccess}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Sign In Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
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
            Create new password
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter a new password for your account
          </p>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-900">
                New Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoFocus
                  className="h-12 pr-10"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors(prev => ({
                      ...prev,
                      newPassword: e.target.value.length < 8 ? 'Password must be at least 8 characters' : undefined,
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength < 40 ? 'text-red-600' : 
                      passwordStrength < 70 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className="h-2" indicatorClassName={getStrengthColor()} />
                </div>
              )}

              {/* Password Requirements */}
              {newPassword && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.met ? (
                        <Check className="size-3 text-green-600 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="size-3 text-gray-400 mr-2 flex-shrink-0" />
                      )}
                      <span className={req.met ? 'text-green-600' : 'text-gray-600'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900">
                Confirm New Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="h-12 pr-10"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => ({
                      ...prev,
                      confirmPassword: e.target.value !== newPassword ? 'Passwords do not match' : undefined,
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <X className="size-3 mr-1" />
                  Passwords do not match
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <Check className="size-3 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !!errors.newPassword || !!errors.confirmPassword}
              className="w-full h-13 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold mt-8"
            >
              {isLoading ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-900 text-center">
            🔒 After resetting, you'll need to sign in with your new password
          </p>
        </div>
      </div>
    </div>
  );
}