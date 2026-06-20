'use client';

import { useRouter } from 'next/navigation';
import { SettingsPage } from '@/app/components/settings/SettingsPage';

export default function SettingsPageRoute() {
  const router = useRouter();

  return (
    <SettingsPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
