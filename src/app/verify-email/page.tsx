'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyEmailPage } from '@/app/components/auth/VerifyEmailPage';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

function VerifyEmailInner() {
  const router = useRouter();
  const { currentUser } = useWorkspace();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'user@example.com';

  const handleVerifySuccess = () => {
    // Onboarding bypass guard:
    // Only organization owners who have NOT yet completed onboarding go to /onboarding.
    // Since John Doe (owner) has completed onboarding, and Jane Smith (admin) & Mark Miller (member)
    // are invited workspace members, they do not need to onboard and go straight to the dashboard.
    if (currentUser.role === 'owner' && !currentUser.onboarded) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <VerifyEmailPage
      email={email}
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
