'use client';

import { useRouter } from 'next/navigation';
import { UserManagementPage } from '@/app/components/users/UserManagementPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function UserManagementPageRoute() {
  const router = useRouter();

  return (
    <UserManagementPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
