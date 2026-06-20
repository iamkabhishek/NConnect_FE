'use client';

import { useRouter } from 'next/navigation';
import { MediaLibraryPage } from '@/app/components/media/MediaLibraryPage';

export default function MediaLibraryPageRoute() {
  const router = useRouter();

  return (
    <MediaLibraryPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
