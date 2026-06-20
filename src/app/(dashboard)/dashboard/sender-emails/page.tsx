'use client';

import { useRouter } from 'next/navigation';
import { SenderEmailsPage } from '@/app/components/senders/SenderEmailsPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function SenderEmailsPageRoute() {
  const router = useRouter();

  return (
    <SenderEmailsPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
