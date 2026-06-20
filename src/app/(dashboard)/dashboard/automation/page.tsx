'use client';

import { useRouter } from 'next/navigation';
import { AutomationPage } from '@/app/components/automation/AutomationPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function AutomationPageRoute() {
  const router = useRouter();

  return (
    <AutomationPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
