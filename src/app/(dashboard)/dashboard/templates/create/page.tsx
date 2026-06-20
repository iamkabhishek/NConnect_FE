'use client';

import { useRouter } from 'next/navigation';
import { CreateTemplatePage } from '@/app/components/templates/CreateTemplatePage';

export default function CreateTemplatePageRoute() {
  const router = useRouter();

  return (
    <CreateTemplatePage
      onCreateTemplate={() => router.push('/dashboard/templates')}
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
