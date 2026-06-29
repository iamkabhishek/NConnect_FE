'use client';

import { useRouter } from 'next/navigation';
import LandingPage from '@/app/components/landing/LandingPage';

export default function Home() {
  const router = useRouter();

  return (
    <LandingPage 
      onGetStarted={() => router.push('/welcome')} 
      onBookDemo={() => router.push('/schedule-demo')}
    />
  );
}
