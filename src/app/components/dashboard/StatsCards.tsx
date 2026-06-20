import { Users, Send, MousePointerClick, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor: string;
}

function StatCard({ title, value, change, changeLabel, icon, iconColor }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="size-4 text-green-600" />
                ) : (
                  <TrendingDown className="size-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {change}%
                </span>
                {changeLabel && (
                  <span className="text-sm text-gray-500">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconColor}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  stats: {
    totalContacts: number;
    campaignsSent: number;
    avgOpenRate: number;
    avgClickRate: number;
  };
  changes?: {
    contacts: number;
    campaigns: number;
    openRate: number;
    clickRate: number;
  };
}

export function StatsCards({ stats, changes }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Contacts"
        value={stats.totalContacts.toLocaleString()}
        change={changes?.contacts}
        changeLabel="vs last month"
        icon={<Users className="size-6 text-blue-600" />}
        iconColor="bg-blue-100"
      />
      <StatCard
        title="Campaigns Sent"
        value={stats.campaignsSent.toLocaleString()}
        change={changes?.campaigns}
        changeLabel="vs last month"
        icon={<Send className="size-6 text-purple-600" />}
        iconColor="bg-purple-100"
      />
      <StatCard
        title="Avg. Open Rate"
        value={`${stats.avgOpenRate}%`}
        change={changes?.openRate}
        changeLabel="vs last month"
        icon={<TrendingUp className="size-6 text-green-600" />}
        iconColor="bg-green-100"
      />
      <StatCard
        title="Avg. Click Rate"
        value={`${stats.avgClickRate}%`}
        change={changes?.clickRate}
        changeLabel="vs last month"
        icon={<MousePointerClick className="size-6 text-orange-600" />}
        iconColor="bg-orange-100"
      />
    </div>
  );
}
