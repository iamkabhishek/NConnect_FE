'use client';

import { useRouter } from 'next/navigation';
import { UserManagementPage } from '@/app/components/users/UserManagementPage';

export default function UserManagementPageRoute() {
  const router = useRouter();

  return (
    <UserManagementPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
