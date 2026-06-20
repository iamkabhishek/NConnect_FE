'use client';

import { useRouter } from 'next/navigation';
import { DocumentationPage } from '@/app/components/documentation/DocumentationPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function DocumentationPageRoute() {
  const router = useRouter();

  return (
    <DocumentationPage
      onNavigate={(page) => router.push(resolveRoute(page))}
      onViewArticle={(articleId) => router.push(`/docs/${articleId}`)}
    />
  );
}
