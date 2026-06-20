'use client';

import { useRouter } from 'next/navigation';
import { SignUpPage } from '@/app/components/auth/SignUpPage';

export default function SignUpRoute() {
  const router = useRouter();

  const handleSignUpSuccess = (email: string) => {
    // Store or pass email to verification page
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <SignUpPage
      onSignIn={() => router.push('/signin')}
      onSignUpSuccess={handleSignUpSuccess}
      onBack={() => router.push('/welcome')}
    />
  );
}
