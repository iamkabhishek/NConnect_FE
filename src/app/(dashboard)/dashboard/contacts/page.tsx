'use client';

import { useRouter } from 'next/navigation';
import { ContactsModule } from '@/app/components/contacts/ContactsModule';

export default function ContactsPageRoute() {
  const router = useRouter();

  return (
    <ContactsModule
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
