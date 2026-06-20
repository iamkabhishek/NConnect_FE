'use client';

import { useRouter } from 'next/navigation';
import { ReportsPage } from '@/app/components/reports/ReportsPage';

export default function ReportsPageRoute() {
  const router = useRouter();

  return (
    <ReportsPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
