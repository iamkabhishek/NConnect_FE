'use client';

import { useRouter } from 'next/navigation';
import { ReportsPage } from '@/app/components/reports/ReportsPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function ReportsPageRoute() {
  const router = useRouter();

  return (
    <ReportsPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
