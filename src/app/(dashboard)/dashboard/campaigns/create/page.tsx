'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateCampaignPage } from '@/app/components/campaigns/CreateCampaignPage';

function CreateCampaignInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'scratch';
  const creationType = (['scratch', 'template', 'quick'].includes(typeParam) ? typeParam : 'scratch') as 'scratch' | 'template' | 'quick';

  return (
    <CreateCampaignPage
      creationType={creationType}
      onCreateCampaign={() => router.push('/dashboard/campaigns')}
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}

export default function CreateCampaignPageRoute() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading campaign creator...</div>}>
      <CreateCampaignInner />
    </Suspense>
  );
}
