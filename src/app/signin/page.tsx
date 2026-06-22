'use client';

import { useRouter } from 'next/navigation';
import { SignInPage } from '@/app/components/auth/SignInPage';

export default function SignInRoute() {
  const router = useRouter();

  const handleSignInSuccess = (email: string, session: string) => {
    router.push(`/verify-email?email=${encodeURIComponent(email)}&session=${encodeURIComponent(session)}`);
  };

  return (
    <SignInPage
      onSignUp={() => router.push('/signup')}
      onSignInSuccess={handleSignInSuccess}
      onBack={() => router.push('/welcome')}
    />
  );
}
