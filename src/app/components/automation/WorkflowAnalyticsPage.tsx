import { useState } from 'react';
import {
  ArrowLeft, TrendingUp, TrendingDown, Users, Mail, MousePointerClick,
  BarChart3, Clock, Target, Download, Calendar, Filter
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';

interface NavigationProps {
  onNavigate: (page: string) => void;
}

export function WorkflowAnalyticsPage({ onNavigate }: NavigationProps) {
  const [dateRange, setDateRange] = useState('30days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const workflowData = {
    name: 'Welcome Series',
    description: 'Automated welcome emails for new subscribers',
    status: 'active',
    startDate: 'Jan 10, 2026',
    totalEnrolled: 1245,
    activeSubscribers: 89,
    completed: 1156,
    conversionRate: 34.5,
    avgTimeInWorkflow: '5.2 days',
    steps: [
      {
        id: '1',
        name: 'Subscriber Joins Group',
        type: 'trigger',
        entered: 1245,
        completed: 1245,
        percentage: 100
      },
      {
        id: '2',
        name: 'Wait 1 Day',
        type: 'delay',
        entered: 1245,
        completed: 1231,
        percentage: 98.9
      },
      {
        id: '3',
        name: 'Welcome Email',
        type: 'email',
        entered: 1231,
        completed: 1198,
        percentage: 97.3,
        sent: 1231,
        delivered: 1215,
        opened: 856,
        clicked: 423,
        openRate: 70.5,
        clickRate: 49.4
      },
      {
        id: '4',
        name: 'Wait 2 Days',
        type: 'delay',
        entered: 1198,
        completed: 1189,
        percentage: 99.2
      },
      {
        id: '5',
        name: 'Getting Started Guide',
        type: 'email',
        entered: 1189,
        completed: 1156,
        percentage: 97.2,
        sent: 1189,
        delivered: 1178,
        opened: 789,
        clicked: 401,
        openRate: 67.0,
        clickRate: 50.8
      }
    ]
  };

  const performanceMetrics = [
    {
      label: 'Total Enrolled',
      value: workflowData.totalEnrolled.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Completion Rate',
      value: `${((workflowData.completed / workflowData.totalEnrolled) * 100).toFixed(1)}%`,
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      label: 'Avg. Open Rate',
      value: '68.8%',
      change: '-1.5%',
      trend: 'down',
      icon: Mail,
      color: 'purple'
    },
    {
      label: 'Avg. Click Rate',
      value: '50.1%',
      change: '+5.8%',
      trend: 'up',
      icon: MousePointerClick,
      color: 'orange'
    }
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('automation')}
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Workflows
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{workflowData.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{workflowData.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                >
                  <Calendar className="size-4 mr-2" />
                  Last 30 Days
                </Button>
                {showDateDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    {['7days', '30days', '90days', 'all'].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setDateRange(range);
                          setShowDateDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          dateRange === range ? 'bg-blue-50 text-blue-700' : ''
                        } ${range === '7days' ? 'rounded-t-lg' : ''} ${
                          range === 'all' ? 'rounded-b-lg' : ''
                        }`}
                      >
                        {range === '7days' && 'Last 7 Days'}
                        {range === '30days' && 'Last 30 Days'}
                        {range === '90days' && 'Last 90 Days'}
                        {range === 'all' && 'All Time'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="outline">
                <Download className="size-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
              <span className="size-2 rounded-full bg-green-600" />
              Active
            </span>
            <span className="text-sm text-gray-600">
              Started {workflowData.startDate}
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              Avg. time: {workflowData.avgTimeInWorkflow}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <div className={`size-10 rounded-lg flex items-center justify-center ${getColorClass(metric.color)}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="size-4 text-green-600" />
                  ) : (
                    <TrendingDown className="size-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Funnel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Workflow Funnel</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track subscriber progression through each step
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Overall Completion</p>
              <p className="text-2xl font-bold text-green-600">
                {((workflowData.completed / workflowData.totalEnrolled) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="space-y-4">
            {workflowData.steps.map((step, index) => (
              <div key={step.id}>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{step.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{step.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {step.entered.toLocaleString()} entered
                    </p>
                    <p className="text-xs text-gray-600">
                      {step.completed.toLocaleString()} completed ({step.percentage}%)
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>

                {/* Email Stats */}
                {step.type === 'email' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-2">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Sent</p>
                        <p className="font-semibold text-gray-900">{step.sent?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Delivered</p>
                        <p className="font-semibold text-gray-900">{step.delivered?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {step.delivered && step.sent && ((step.delivered / step.sent) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Opened</p>
                        <p className="font-semibold text-gray-900">{step.opened?.toLocaleString()}</p>
                        <p className="text-xs text-green-600">{step.openRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Clicked</p>
                        <p className="font-semibold text-gray-900">{step.clicked?.toLocaleString()}</p>
                        <p className="text-xs text-blue-600">{step.clickRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Drop-off</p>
                        <p className="font-semibold text-red-600">
                          {step.entered && step.completed && (step.entered - step.completed).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.entered && step.completed && (((step.entered - step.completed) / step.entered) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connector Arrow */}
                {index < workflowData.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="h-6 w-px bg-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Over Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Enrollment Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Enrollment Trend</h3>
                <p className="text-sm text-gray-600 mt-1">Daily new subscribers</p>
              </div>
              <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="size-5 text-blue-600" />
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {[45, 52, 48, 61, 55, 67, 72, 68, 59, 64, 71, 78, 82, 89].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>14 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Conversion Funnel</h3>
                <p className="text-sm text-gray-600 mt-1">From enrollment to goal</p>
              </div>
              <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="size-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Enrolled', count: 1245, percentage: 100, color: 'blue' },
                { label: 'Opened First Email', count: 856, percentage: 68.8, color: 'purple' },
                { label: 'Clicked Link', count: 423, percentage: 34.0, color: 'orange' },
                { label: 'Converted to Goal', count: 156, percentage: 12.5, color: 'green' }
              ].map((stage, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        stage.color === 'blue' ? 'from-blue-500 to-blue-400' :
                        stage.color === 'purple' ? 'from-purple-500 to-purple-400' :
                        stage.color === 'orange' ? 'from-orange-500 to-orange-400' :
                        'from-green-500 to-green-400'
                      } transition-all flex items-center justify-end pr-3`}
                      style={{ width: `${stage.percentage}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="size-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Insights & Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>
                    <strong>Strong open rates:</strong> Your email open rates (68.8% avg) are well above industry average. Keep using engaging subject lines.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span>
                    <strong>Optimize timing:</strong> Consider testing different wait durations between emails to improve completion rates.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">!</span>
                  <span>
                    <strong>Drop-off at Step 4:</strong> 2.7% drop-off detected. Review content or consider shortening the wait time.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}