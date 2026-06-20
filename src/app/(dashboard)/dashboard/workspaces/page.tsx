'use client';

import { useRouter } from 'next/navigation';
import { WorkspacesPage } from '@/app/components/workspaces/WorkspacesPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function WorkspacesPageRoute() {
  const router = useRouter();

  return (
    <WorkspacesPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
