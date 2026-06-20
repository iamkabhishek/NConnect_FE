'use client';

import { useRouter } from 'next/navigation';
import { ForgotPasswordPage } from '@/app/components/auth/ForgotPasswordPage';

export default function ForgotPasswordRoute() {
  const router = useRouter();

  return (
    <ForgotPasswordPage
      onBack={() => router.push('/signin')}
    />
  );
}
