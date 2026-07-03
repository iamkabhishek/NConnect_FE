'use client';

import { useRouter } from 'next/navigation';
import { CampaignsPage } from '@/app/components/campaigns/CampaignsPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function CampaignsPageRoute() {
  const router = useRouter();

  const handleCreateCampaign = (type?: 'scratch' | 'template' | 'quick') => {
    router.push(`/dashboard/campaigns/create?type=${type || 'scratch'}`);
  };

  const handleViewCampaign = (id: string) => {
    router.push(`/dashboard/campaigns/${id}`);
  };

  const handleEditCampaign = (id: string) => {
    router.push(`/dashboard/campaigns/create?id=${id}`);
  };

  const handleNavigate = (page: string) => {
    router.push(resolveRoute(page));
  };

  return (
    <CampaignsPage
      onCreateCampaign={handleCreateCampaign}
      onViewCampaign={handleViewCampaign}
      onEditCampaign={handleEditCampaign}
      onNavigate={handleNavigate}
    />
  );
}
