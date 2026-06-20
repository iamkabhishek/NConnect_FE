'use client';

import { useRouter } from 'next/navigation';
import { ContactsModule } from '@/app/components/contacts/ContactsModule';
import { resolveRoute } from '@/app/components/ui/utils';

export default function ContactsPageRoute() {
  const router = useRouter();

  return (
    <ContactsModule
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
