'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyEmailPage } from '@/app/components/auth/VerifyEmailPage';

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const session = searchParams.get('session') || '';

  const handleVerifySuccess = (needsOnboarding: boolean) => {
    if (needsOnboarding) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <VerifyEmailPage
      email={email}
      session={session}
      onVerifySuccess={handleVerifySuccess}
      onBack={() => router.push('/signin')}
    />
  );
}

export default function VerifyEmailRoute() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading verification screen...</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
