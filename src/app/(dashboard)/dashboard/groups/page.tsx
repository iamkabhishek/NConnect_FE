'use client';

import { useRouter } from 'next/navigation';
import { GroupsModule } from '@/app/components/groups/GroupsModule';
import { resolveRoute } from '@/app/components/ui/utils';

export default function GroupsPageRoute() {
  const router = useRouter();

  return (
    <GroupsModule
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
