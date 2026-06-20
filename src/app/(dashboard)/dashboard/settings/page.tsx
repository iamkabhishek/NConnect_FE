'use client';

import { useRouter } from 'next/navigation';
import { SettingsPage } from '@/app/components/settings/SettingsPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function SettingsPageRoute() {
  const router = useRouter();

  return (
    <SettingsPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
