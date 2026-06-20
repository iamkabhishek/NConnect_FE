'use client';

import { useRouter } from 'next/navigation';
import { WelcomeScreen } from '@/app/components/auth/WelcomeScreen';

export default function WelcomeRoute() {
  const router = useRouter();

  return (
    <WelcomeScreen
      onSignIn={() => router.push('/signin')}
      onSignUp={() => router.push('/signup')}
    />
  );
}
