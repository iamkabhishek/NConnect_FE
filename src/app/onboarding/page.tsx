'use client';

import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/app/components/onboarding/OnboardingFlow';

export default function OnboardingRoute() {
  const router = useRouter();

  const handleComplete = () => {
    alert('Onboarding complete! 🎉\\n\\nIn the full app, you would see the dashboard with all your workspace data.');
    router.push('/dashboard');
  };

  return (
    <OnboardingFlow
      onComplete={handleComplete}
    />
  );
}
