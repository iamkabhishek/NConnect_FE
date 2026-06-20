'use client';

import { useRouter } from 'next/navigation';
import { CreateTemplatePage } from '@/app/components/templates/CreateTemplatePage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function CreateTemplatePageRoute() {
  const router = useRouter();

  return (
    <CreateTemplatePage
      onCreateTemplate={() => router.push('/dashboard/templates')}
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
