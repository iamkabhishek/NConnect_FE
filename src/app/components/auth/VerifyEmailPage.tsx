import { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/app/components/ui/input-otp';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { verifyOtp, getMe } from '@/app/lib/api';

interface VerifyEmailPageProps {
  email: string;
  session: string;
  onVerifySuccess: (needsOnboarding: boolean) => void;
  onBack: () => void;
}

export function VerifyEmailPage({ email, session, onVerifySuccess, onBack }: VerifyEmailPageProps) {
  const { setCurrentUser } = useWorkspace();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-verify when 6 digits entered
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp]);

  const handleVerify = async (code: string) => {
    // Validate only numbers
    if (!/^\d+$/.test(code)) {
      setError('OTP must contain only numbers');
      setOtp('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Verify OTP using custom challenge endpoint
      const authResult = await verifyOtp(email, code, session);
      
      // 2. Store tokens in localStorage
      localStorage.setItem('nconnect_id_token', authResult.token);
      localStorage.setItem('nconnect_access_token', authResult.accessToken);
      localStorage.setItem('nconnect_refresh_token', authResult.refreshToken);

      // 3. Fetch user profile and workspace info from /auth/me
      const me = await getMe(authResult.token);

      // 4. Update global context persona state
      setCurrentUser({
        id: me.userId,
        name: email.split('@')[0], // fallback display name
        email: email,
        role: (me.role as any) || 'owner',
        onboarded: !me.needsOnboarding,
        avatar: email.substring(0, 2).toUpperCase(),
        // Store sequential custom identifiers returned by backend Hono middleware
        customUserId: me.customUserId,
        customTenantId: me.customTenantId,
        permissions: {
          contacts: 'admin',
          campaigns: 'admin',
          templates: 'admin',
          automation: 'admin',
          settings: 'admin',
          users: 'admin',
          workspaces: 'admin',
          senderEmails: 'admin',
          reports: 'admin',
          media: 'admin',
        }
      });

      setIsLoading(false);
      onVerifySuccess(me.needsOnboarding);
    } catch (err: any) {
      console.error('[VerifyOTP] verification failed:', err);
      setError(err.message || 'Incorrect OTP code or expired session. Please try again.');
      setIsLoading(false);
      setOtp('');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(60); // 60 second cooldown
    setError('');
    setResendMessage('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset timer
    setTimeLeft(600);
    setCanResend(false);
    
    // Show success message
    setResendMessage('A new verification code has been sent to ' + email);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setResendMessage('');
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          Back
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
            Verify your email
          </h1>
          <p className="text-center text-gray-600 mb-8">
            We sent a 6-digit code to
            <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          {/* OTP Input */}
          <div className="mb-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                // Only allow numbers
                if (value === '' || /^\d+$/.test(value)) {
                  setOtp(value);
                  setError('');
                }
              }}
              disabled={isLoading || timeLeft <= 0}
              pattern="[0-9]*"
              inputMode="numeric"
            >
              <InputOTPGroup className="gap-2 justify-center">
                <InputOTPSlot index={0} className="size-14 text-2xl border-2" />
                <InputOTPSlot index={1} className="size-14 text-2xl border-2" />
                <InputOTPSlot index={2} className="size-14 text-2xl border-2" />
                <InputOTPSlot index={3} className="size-14 text-2xl border-2" />
                <InputOTPSlot index={4} className="size-14 text-2xl border-2" />
                <InputOTPSlot index={5} className="size-14 text-2xl border-2" />
              </InputOTPGroup>
            </InputOTP>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message for Resend */}
            {resendMessage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-600">{resendMessage}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="size-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-sm text-gray-600">Verifying...</span>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <p className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
              {timeLeft > 0 ? (
                <>Code expires in {formatTime(timeLeft)}</>
              ) : (
                <span className="text-red-600">Code expired - Please request a new one</span>
              )}
            </p>
          </div>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            {resendCooldown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend available in {resendCooldown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend code
              </button>
            )}
          </div>

          {/* Verify Button (Optional - auto-submits on 6th digit) */}
          <Button
            onClick={() => handleVerify(otp)}
            disabled={otp.length !== 6 || isLoading || timeLeft <= 0}
            className="w-full h-13 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold mt-8"
          >
            {isLoading ? (
              <>
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Demo:</strong> Use <strong>123456</strong> to verify. Only numeric digits are allowed.
          </p>
        </div>
      </div>
    </div>
  );
}