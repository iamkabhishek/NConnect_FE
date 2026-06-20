'use client';

import { useRouter } from 'next/navigation';
import { ResetPasswordPage } from '@/app/components/auth/ResetPasswordPage';

export default function ResetPasswordRoute() {
  const router = useRouter();

  return (
    <ResetPasswordPage
      onResetSuccess={() => router.push('/signin')}
    />
  );
}
