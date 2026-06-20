'use client';

import { useRouter } from 'next/navigation';
import { GroupsModule } from '@/app/components/groups/GroupsModule';

export default function GroupsPageRoute() {
  const router = useRouter();

  return (
    <GroupsModule
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
