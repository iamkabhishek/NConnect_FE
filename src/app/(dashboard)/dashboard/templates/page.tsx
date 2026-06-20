'use client';

import { useRouter } from 'next/navigation';
import { TemplatesPage } from '@/app/components/templates/TemplatesPage';

export default function TemplatesPageRoute() {
  const router = useRouter();

  return (
    <TemplatesPage
      onNavigateToCreate={() => router.push('/dashboard/templates/create')}
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
