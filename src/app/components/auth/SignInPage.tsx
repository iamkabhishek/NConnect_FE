import { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle, Shield, User, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

interface SignInPageProps {
  onSignUp: () => void;
  onSignInSuccess: (email: string) => void;
  onBack: () => void;
}

export function SignInPage({ onSignUp, onSignInSuccess, onBack }: SignInPageProps) {
  const { switchPersona, personas } = useWorkspace();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [selectedPersonaEmail, setSelectedPersonaEmail] = useState<string>('');

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
    
    // Simulate API call to check if user exists and session status
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const customPersonas = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('nconnect_custom_personas') || '[]')
      : [];
    const customEmails = customPersonas.map((p: any) => p.email.toLowerCase());

    const validEmails = [
      'john@example.com',
      'jane@example.com',
      'mark@example.com',
      'test@example.com',
      'admin@nconnect.com',
      'user@example.com',
      ...customEmails
    ];
    
    if (!validEmails.includes(email.toLowerCase())) {
      setIsLoading(false);
      setError('This email does not exist. Try john@example.com, jane@example.com, or mark@example.com.');
      return;
    }
    
    // Synchronize persona state in global workspace context
    switchPersona(email);
    
    setIsLoading(false);
    onSignInSuccess(email);
  };

  const selectPersona = (personaEmail: string) => {
    setEmail(personaEmail);
    setSelectedPersonaEmail(personaEmail);
    setError('');
    switchPersona(personaEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-purple-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 -ml-2 text-zinc-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        {/* Form Card */}
        <div className="bg-white/80 border border-zinc-200/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-500/5 p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 p-3.5 rounded-2xl shadow-lg shadow-purple-500/20">
              <Mail className="size-8 text-white" />
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-extrabold text-center text-zinc-950 tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-center text-zinc-500 mb-8 font-medium">
            Select a demo persona or enter your email to sign in
          </p>

          {/* Interactive Persona Quick Switcher */}
          <div className="mb-8 bg-zinc-50/50 border border-zinc-200/40 rounded-2xl p-5">
            <p className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase mb-3">
              ⚡ Demo Personas (Select to auto-fill)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {personas.map((persona) => {
                const isSelected = email.toLowerCase() === persona.email.toLowerCase();
                const iconMap = {
                  owner: <CrownIcon className="size-4 text-amber-500" />,
                  workspace_admin: <Shield className="size-4 text-purple-600" />,
                  workspace_member: <User className="size-4 text-zinc-600" />
                };

                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => selectPersona(persona.email)}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-tr from-purple-500/10 via-fuchsia-500/5 to-transparent border-purple-500/60 shadow-md shadow-purple-500/5 scale-[1.02]'
                        : 'bg-white border-zinc-200/60 hover:border-zinc-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 w-full">
                      <span className="font-bold text-zinc-900 text-sm">{persona.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="size-4 text-purple-600 flex-shrink-0" />
                      ) : (
                        iconMap[persona.role]
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-zinc-500 mb-1">{persona.email}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        persona.role === 'owner'
                          ? 'bg-amber-100 text-amber-800'
                          : persona.role === 'workspace_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {persona.role.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-bold text-zinc-800">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com, jane@example.com..."
                autoFocus
                autoComplete="email"
                className="mt-2 h-12 rounded-xl border-zinc-200 focus:border-purple-500 focus:ring-purple-500"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSelectedPersonaEmail('');
                  setError('');
                }}
              />
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-semibold text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white text-base font-bold rounded-xl shadow-lg shadow-purple-500/10 transition-all duration-200"
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
          <p className="text-center text-sm text-zinc-600 mt-6 font-medium">
            Don't have an account?{' '}
            <button
              onClick={onSignUp}
              className="text-purple-600 hover:text-purple-700 font-bold underline"
            >
              Sign up
            </button>
          </p>

          {/* Contact Support */}
          <p className="text-center text-xs text-zinc-400 mt-4">
            Need help?{' '}
            <a
              href="/contact"
              className="text-zinc-500 hover:text-purple-600 font-semibold underline"
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-purple-50/50 rounded-xl border border-purple-100/50">
          <p className="text-xs text-purple-900 font-semibold text-center flex items-center justify-center gap-1.5">
            🔒 Enter code <strong>123456</strong> on the next screen to verify successfully.
          </p>
        </div>
      </div>
    </div>
  );
}

// Mini crown icon helper
function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-6 7-6-7z" />
      <path d="M5 20h14" />
    </svg>
  );
}