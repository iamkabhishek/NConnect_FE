'use client';

import { useRouter, useParams } from 'next/navigation';
import { CampaignDetailsPage } from '@/app/components/campaigns/CampaignDetailsPage';

export default function CampaignDetailsPageRoute() {
  const router = useRouter();
  const params = useParams();
  const campaignId = Array.isArray(params?.id) ? params.id[0] : params?.id || 'campaign-1';

  return (
    <CampaignDetailsPage
      campaignId={campaignId}
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
