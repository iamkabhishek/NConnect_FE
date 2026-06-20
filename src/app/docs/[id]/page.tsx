'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArticleDetailPage } from '@/app/components/documentation/ArticleDetailPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function ArticleDetailPageRoute() {
  const router = useRouter();
  const params = useParams();
  const articleId = Array.isArray(params?.id) ? params.id[0] : params?.id || '';

  return (
    <ArticleDetailPage
      onNavigate={(page) => router.push(resolveRoute(page))}
      onBackToDocumentation={() => router.push('/docs')}
    />
  );
}
