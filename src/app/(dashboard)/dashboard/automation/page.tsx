'use client';

import { useRouter } from 'next/navigation';
import { AutomationPage } from '@/app/components/automation/AutomationPage';

export default function AutomationPageRoute() {
  const router = useRouter();

  return (
    <AutomationPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
