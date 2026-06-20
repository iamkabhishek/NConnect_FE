import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { StatsCards } from './StatsCards';
import { EngagementChart } from './EngagementChart';
import { RecentCampaigns } from './RecentCampaigns';
import { QuickActions } from './QuickActions';
import { DeliverabilityStatus } from './DeliverabilityStatus';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

interface DashboardProps {
  userName?: string;
  onNavigate?: (page: string) => void;
}

export function Dashboard({
  onNavigate,
}: DashboardProps) {
  const { selectedWorkspace, currentUser } = useWorkspace();
  const userName = currentUser?.name || 'John Doe';
  
  // Mock data for stats - filtered by workspace
  const stats = {
    totalContacts: 2847,
    campaignsSent: 12,
    avgOpenRate: 24.5,
    avgClickRate: 3.2,
  };

  // Navigation handlers
  const handleNavigateToCreateCampaign = () => onNavigate?.('create-campaign');
  const handleNavigateToContacts = () => onNavigate?.('contacts');
  const handleNavigateToTemplates = () => onNavigate?.('templates');
  const handleNavigateToReports = () => onNavigate?.('reports');
  const handleNavigateToSettings = () => onNavigate?.('settings');
  const handleNavigateToCampaignDetails = (campaignId: string) => {
    console.log('Navigate to campaign:', campaignId);
    onNavigate?.('campaign-details');
  };

  return (
    <ModuleLayout activeItem="dashboard" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your newsletters in {selectedWorkspace?.name || 'your workspace'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Engagement Chart - Takes full width */}
          <div className="lg:col-span-3">
            <EngagementChart />
          </div>
        </div>

        {/* Quick Actions - Full width section */}
        <div className="mb-8">
          <QuickActions 
            onCreateCampaign={handleNavigateToCreateCampaign}
            onAddContacts={handleNavigateToContacts}
            onNewTemplate={handleNavigateToTemplates}
            onImportCSV={handleNavigateToContacts}
            onViewReports={handleNavigateToReports}
            onESPSettings={handleNavigateToSettings}
          />
        </div>

        {/* Recent Campaigns */}
        <div className="mb-8">
          <RecentCampaigns 
            onViewCampaign={handleNavigateToCampaignDetails}
            onViewAll={() => onNavigate?.('campaigns')}
          />
        </div>

        {/* Deliverability Status */}
        <div>
          <DeliverabilityStatus workspaceName={selectedWorkspace?.name || 'My Business Newsletter'} />
        </div>
      </div>
    </ModuleLayout>
  );
}