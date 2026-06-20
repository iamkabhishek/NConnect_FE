'use client';

import { useRouter } from 'next/navigation';
import { DocumentationPage } from '@/app/components/documentation/DocumentationPage';

export default function DocumentationPageRoute() {
  const router = useRouter();

  return (
    <DocumentationPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
      onViewArticle={(articleId) => router.push(`/docs/${articleId}`)}
    />
  );
}
