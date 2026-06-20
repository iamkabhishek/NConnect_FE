'use client';

import { useRouter } from 'next/navigation';
import { MediaLibraryPage } from '@/app/components/media/MediaLibraryPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function MediaLibraryPageRoute() {
  const router = useRouter();

  return (
    <MediaLibraryPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
