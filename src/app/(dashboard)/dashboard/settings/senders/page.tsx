'use client';

import { useRouter } from 'next/navigation';
import { SenderEmailsPage } from '@/app/components/senders/SenderEmailsPage';

export default function SenderEmailsPageRoute() {
  const router = useRouter();

  return (
    <SenderEmailsPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
