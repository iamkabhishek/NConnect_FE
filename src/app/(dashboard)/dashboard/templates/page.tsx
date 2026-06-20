'use client';

import { useRouter } from 'next/navigation';
import { TemplatesPage } from '@/app/components/templates/TemplatesPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function TemplatesPageRoute() {
  const router = useRouter();

  return (
    <TemplatesPage
      onNavigateToCreate={() => router.push('/dashboard/templates/create')}
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
