'use client';

import { useRouter } from 'next/navigation';
import { WorkspacesPage } from '@/app/components/workspaces/WorkspacesPage';

export default function WorkspacesPageRoute() {
  const router = useRouter();

  return (
    <WorkspacesPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
