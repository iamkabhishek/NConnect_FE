'use client';

import { useRouter } from 'next/navigation';
import { CampaignsPage } from '@/app/components/campaigns/CampaignsPage';

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
    if (page === 'dashboard') router.push('/dashboard');
    else if (page === 'templates') router.push('/dashboard/templates');
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
