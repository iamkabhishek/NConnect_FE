import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Shield, AlertTriangle } from 'lucide-react';

interface WorkspaceDeliverability {
  id: string;
  name: string;
  color: string;
  bounceRate: number;
  spamReports: number;
  openRateByDomain: {
    domain: string;
    rate: number;
    volume: number;
  }[];
  overallScore: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

const workspaces: WorkspaceDeliverability[] = [
  {
    id: '1',
    name: 'My Business Newsletter',
    color: '#4A90E2',
    bounceRate: 1.2,
    spamReports: 0.03,
    openRateByDomain: [
      { domain: 'gmail.com', rate: 28.5, volume: 12400 },
      { domain: 'outlook.com', rate: 22.1, volume: 8200 },
      { domain: 'yahoo.com', rate: 19.8, volume: 5100 },
    ],
    overallScore: 92,
    status: 'excellent',
  },
  {
    id: '2',
    name: 'Marketing Team',
    color: '#9B59B6',
    bounceRate: 2.8,
    spamReports: 0.12,
    openRateByDomain: [
      { domain: 'gmail.com', rate: 24.2, volume: 9800 },
      { domain: 'outlook.com', rate: 18.9, volume: 6300 },
      { domain: 'yahoo.com', rate: 16.5, volume: 4200 },
    ],
    overallScore: 78,
    status: 'good',
  },
  {
    id: '3',
    name: 'Sales Team',
    color: '#E74C3C',
    bounceRate: 4.5,
    spamReports: 0.28,
    openRateByDomain: [
      { domain: 'gmail.com', rate: 18.7, volume: 7200 },
      { domain: 'outlook.com', rate: 15.3, volume: 5100 },
      { domain: 'yahoo.com', rate: 12.1, volume: 3400 },
    ],
    overallScore: 65,
    status: 'warning',
  },
];

interface DeliverabilityStatusProps {
  workspaceName?: string;
}

export function DeliverabilityStatus({ workspaceName = 'My Business Newsletter' }: DeliverabilityStatusProps) {
  // Filter to show only the selected workspace
  const selectedWorkspace = workspaces.find(w => w.name === workspaceName) || workspaces[0];
  const filteredWorkspaces = [selectedWorkspace];

  const getStatusBadge = (status: string) => {
    const badges = {
      excellent: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="size-4" />,
        label: 'Excellent',
      },
      good: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Shield className="size-4" />,
        label: 'Good',
      },
      warning: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <AlertTriangle className="size-4" />,
        label: 'Needs Attention',
      },
      critical: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <AlertCircle className="size-4" />,
        label: 'Critical',
      },
    };

    return badges[status as keyof typeof badges] || badges.good;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreRing = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Deliverability Status</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Monitor email health across all workspaces</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Live Monitoring</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredWorkspaces.map((workspace) => {
              const badge = getStatusBadge(workspace.status);
              return (
                <div
                  key={workspace.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all w-full"
                >
                  {/* Workspace Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: workspace.color }}
                      >
                        {workspace.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{workspace.name}</h3>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mt-1 ${badge.bg} ${badge.text}`}>
                          {badge.icon}
                          {badge.label}
                        </div>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="size-20">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${(workspace.overallScore / 100) * 201} 201`}
                            strokeLinecap="round"
                            className={`${getScoreRing(workspace.overallScore)} transition-all`}
                            transform="rotate(-90 40 40)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-2xl font-bold ${getScoreColor(workspace.overallScore)}`}>
                            {workspace.overallScore}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Health Score</p>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Bounce Rate */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Bounce Rate
                        </span>
                        {workspace.bounceRate < 2 ? (
                          <TrendingDown className="size-4 text-green-600" />
                        ) : (
                          <TrendingUp className="size-4 text-red-600" />
                        )}
                      </div>
                      <p className={`text-2xl font-bold ${workspace.bounceRate < 2 ? 'text-green-600' : workspace.bounceRate < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {workspace.bounceRate}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {workspace.bounceRate < 2 ? 'Healthy' : workspace.bounceRate < 5 ? 'Monitor' : 'Action needed'}
                      </p>
                    </div>

                    {/* Spam Reports */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Spam Reports
                        </span>
                        {workspace.spamReports < 0.1 ? (
                          <TrendingDown className="size-4 text-green-600" />
                        ) : (
                          <TrendingUp className="size-4 text-red-600" />
                        )}
                      </div>
                      <p className={`text-2xl font-bold ${workspace.spamReports < 0.1 ? 'text-green-600' : workspace.spamReports < 0.3 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {workspace.spamReports}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {workspace.spamReports < 0.1 ? 'Excellent' : workspace.spamReports < 0.3 ? 'Monitor' : 'Critical'}
                      </p>
                    </div>
                  </div>

                  {/* Open Rates by Domain */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Open Rates by Domain</h4>
                    <div className="space-y-3">
                      {workspace.openRateByDomain.map((domain) => (
                        <div key={domain.domain} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{domain.domain}</span>
                              <span className="text-sm font-bold text-gray-900">{domain.rate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  domain.rate > 25
                                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                                    : domain.rate > 18
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                }`}
                                style={{ width: `${Math.min(domain.rate * 2, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{domain.volume.toLocaleString()} emails sent</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {workspace.status !== 'excellent' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="size-4" />
                        Recommendations
                      </h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        {workspace.bounceRate > 2 && (
                          <li>• Clean your email list to reduce bounce rate</li>
                        )}
                        {workspace.spamReports > 0.1 && (
                          <li>• Review email content and improve engagement strategies</li>
                        )}
                        {workspace.openRateByDomain.some((d) => d.rate < 18) && (
                          <li>• Optimize send times and subject lines for low-performing domains</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Bounce Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {(workspaces.reduce((sum, w) => sum + w.bounceRate, 0) / workspaces.length).toFixed(2)}%
            </p>
          </div>
          <div className="text-center border-l border-r border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Avg Spam Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {(workspaces.reduce((sum, w) => sum + w.spamReports, 0) / workspaces.length).toFixed(2)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Health Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(workspaces.reduce((sum, w) => sum + w.overallScore, 0) / workspaces.length)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}