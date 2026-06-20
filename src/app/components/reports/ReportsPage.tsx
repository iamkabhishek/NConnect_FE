import { useState, useEffect } from 'react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { Button } from '@/app/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Mail,
  MailOpen,
  MousePointerClick,
  Users,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Eye,
  UserX,
  Globe,
  Monitor,
  Smartphone,
  X,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportsPageProps {
  userName?: string;
  onNavigate?: (page: string) => void;
}

export function ReportsPage({ userName = 'John Doe', onNavigate }: ReportsPageProps) {
  const { selectedWorkspace } = useWorkspace();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCampaignStatuses, setSelectedCampaignStatuses] = useState<string[]>([]);
  const [selectedTemplateTypes, setSelectedTemplateTypes] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Overview metrics
  const overviewMetrics = [
    {
      label: 'Total Sent',
      value: '245,680',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Mail,
      color: 'blue',
    },
    {
      label: 'Open Rate',
      value: '38.4%',
      change: '+2.3%',
      trend: 'up' as const,
      icon: MailOpen,
      color: 'green',
    },
    {
      label: 'Click Rate',
      value: '4.8%',
      change: '-0.5%',
      trend: 'down' as const,
      icon: MousePointerClick,
      color: 'purple',
    },
    {
      label: 'Subscribers',
      value: '12,340',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      color: 'orange',
    },
  ];

  // Campaign performance over time
  const campaignPerformanceData = [
    { date: 'Jan 10', sent: 4200, opened: 1680, clicked: 252 },
    { date: 'Jan 12', sent: 3800, opened: 1520, clicked: 228 },
    { date: 'Jan 14', sent: 5100, opened: 2040, clicked: 306 },
    { date: 'Jan 16', sent: 4500, opened: 1800, clicked: 270 },
    { date: 'Jan 18', sent: 6200, opened: 2480, clicked: 372 },
    { date: 'Jan 20', sent: 5500, opened: 2200, clicked: 330 },
    { date: 'Jan 22', sent: 4800, opened: 1920, clicked: 288 },
  ];

  // Engagement metrics
  const engagementData = [
    { name: 'Opened', value: 38.4, color: '#10B981' },
    { name: 'Clicked', value: 4.8, color: '#8B5CF6' },
    { name: 'Bounced', value: 2.1, color: '#EF4444' },
    { name: 'Unsubscribed', value: 0.3, color: '#F59E0B' },
    { name: 'Not Opened', value: 54.4, color: '#E5E7EB' },
  ];

  // Subscriber growth
  const subscriberGrowthData = [
    { month: 'Aug', subscribers: 8200, new: 420, lost: 120 },
    { month: 'Sep', subscribers: 8920, new: 850, lost: 130 },
    { month: 'Oct', subscribers: 9650, new: 780, lost: 50 },
    { month: 'Nov', subscribers: 10580, new: 980, lost: 50 },
    { month: 'Dec', subscribers: 11420, new: 920, lost: 80 },
    { month: 'Jan', subscribers: 12340, new: 1050, lost: 130 },
  ];

  // Top campaigns
  const topCampaigns = [
    {
      name: 'Holiday Sale - Final Hours',
      sent: 12500,
      openRate: 45.2,
      clickRate: 8.3,
      revenue: '$15,240',
    },
    {
      name: 'New Product Launch',
      sent: 11200,
      openRate: 42.8,
      clickRate: 6.9,
      revenue: '$12,580',
    },
    {
      name: 'Weekly Newsletter #47',
      sent: 9800,
      openRate: 38.5,
      clickRate: 4.2,
      revenue: '$3,120',
    },
    {
      name: 'Customer Survey',
      sent: 8400,
      openRate: 36.1,
      clickRate: 12.5,
      revenue: '$0',
    },
    {
      name: 'Welcome Series - Day 1',
      sent: 7200,
      openRate: 52.3,
      clickRate: 9.8,
      revenue: '$8,940',
    },
  ];

  // Geographic data
  const geographicData = [
    { country: 'United States', opens: 12450, clicks: 850, percentage: 42 },
    { country: 'United Kingdom', opens: 6780, clicks: 425, percentage: 23 },
    { country: 'Canada', opens: 4320, clicks: 280, percentage: 15 },
    { country: 'Australia', opens: 3210, clicks: 195, percentage: 11 },
    { country: 'Germany', opens: 2640, clicks: 150, percentage: 9 },
  ];

  // Device stats
  const deviceData = [
    { name: 'Desktop', value: 45, color: '#4A90E2' },
    { name: 'Mobile', value: 42, color: '#10B981' },
    { name: 'Tablet', value: 13, color: '#F59E0B' },
  ];

  const getMetricColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colors[color as keyof typeof colors];
  };

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const formatCustomDateRange = () => {
    if (!customStartDate || !customEndDate) return 'Custom Range';
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getDisplayLabel = () => {
    if (dateRange === 'custom') {
      return formatCustomDateRange();
    }
    return dateRangeOptions.find((opt) => opt.value === dateRange)?.label || 'Select Range';
  };

  const applyCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
      setShowCustomDatePicker(false);
      setShowDateDropdown(false);
    }
  };

  // Filter options
  const campaignStatusOptions = ['Draft', 'Scheduled', 'Sent', 'Paused', 'Completed'];
  const templateTypeOptions = ['Newsletter', 'Promotional', 'Transactional', 'Announcement', 'Welcome'];
  const groupOptions = ['All Subscribers', 'VIP Members', 'New Customers', 'Inactive Users', 'Beta Testers'];
  const performanceOptions = ['High Open Rate (>40%)', 'Low Open Rate (<20%)', 'High Click Rate (>5%)', 'Low Click Rate (<2%)', 'High Revenue (>$10k)'];
  const tagOptions = ['Marketing', 'Sales', 'Product', 'Customer Success', 'Newsletter'];

  const toggleFilter = (value: string, currentFilters: string[], setFilters: (filters: string[]) => void) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter((f) => f !== value));
    } else {
      setFilters([...currentFilters, value]);
    }
  };

  const getActiveFilterCount = () => {
    return (
      selectedCampaignStatuses.length +
      selectedTemplateTypes.length +
      selectedGroups.length +
      selectedPerformance.length +
      selectedTags.length
    );
  };

  const clearAllFilters = () => {
    setSelectedCampaignStatuses([]);
    setSelectedTemplateTypes([]);
    setSelectedGroups([]);
    setSelectedPerformance([]);
    setSelectedTags([]);
  };

  const applyFilters = () => {
    setShowFilters(false);
    // In a real app, this would trigger data fetching with filters
  };

  const exportReport = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Reports & Analytics', 20, yPosition);
    yPosition += 10;

    // Add date range
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Date Range: ${getDisplayLabel()}`, 20, yPosition);
    yPosition += 15;

    // Add overview metrics
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Overview Metrics', 20, yPosition);
    yPosition += 10;

    overviewMetrics.forEach((metric, index) => {
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${metric.label}: ${metric.value} (${metric.change})`, 20, yPosition);
      yPosition += 7;
    });
    yPosition += 10;

    // Add top campaigns header
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Top Performing Campaigns', 20, yPosition);
    yPosition += 10;

    // Add campaigns table
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    // Table headers
    const startX = 20;
    const colWidths = [70, 25, 25, 25, 25];
    let xPosition = startX;
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Campaign Name', xPosition, yPosition);
    xPosition += colWidths[0];
    pdf.text('Sent', xPosition, yPosition);
    xPosition += colWidths[1];
    pdf.text('Open %', xPosition, yPosition);
    xPosition += colWidths[2];
    pdf.text('Click %', xPosition, yPosition);
    xPosition += colWidths[3];
    pdf.text('Revenue', xPosition, yPosition);
    yPosition += 7;

    // Table data
    pdf.setFont(undefined, 'normal');
    topCampaigns.forEach((campaign) => {
      xPosition = startX;
      
      // Check if we need a new page
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(campaign.name.substring(0, 30), xPosition, yPosition);
      xPosition += colWidths[0];
      pdf.text(campaign.sent.toLocaleString(), xPosition, yPosition);
      xPosition += colWidths[1];
      pdf.text(`${campaign.openRate}%`, xPosition, yPosition);
      xPosition += colWidths[2];
      pdf.text(`${campaign.clickRate}%`, xPosition, yPosition);
      xPosition += colWidths[3];
      pdf.text(campaign.revenue, xPosition, yPosition);
      yPosition += 7;
    });
    yPosition += 10;

    // Add geographic data
    if (yPosition > 240) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Geographic Insights', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    geographicData.forEach((country) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(
        `${country.country}: ${country.opens.toLocaleString()} opens, ${country.clicks.toLocaleString()} clicks (${country.percentage}%)`,
        20,
        yPosition
      );
      yPosition += 7;
    });

    // Save the PDF
    const dateStr = new Date().toISOString().split('T')[0];
    pdf.save(`nconnect-report-${dateStr}.pdf`);
  };

  return (
    <ModuleLayout activeItem="reports" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8" id="report-content">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="size-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            </div>
            <p className="text-gray-600">Track your campaign performance for {selectedWorkspace?.name || 'your workspace'}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="min-w-[180px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  {getDisplayLabel()}
                </div>
                <ChevronDown className="size-4" />
              </Button>

              {showDateDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                      setShowDateDropdown(false);
                      setShowCustomDatePicker(false);
                    }}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                    {dateRangeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setDateRange(option.value as typeof dateRange);
                          setShowDateDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          dateRange === option.value ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setShowCustomDatePicker(true);
                        setShowDateDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg border-t"
                    >
                      Custom Range...
                    </button>
                  </div>
                </>
              )}

              {showCustomDatePicker && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCustomDatePicker(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-20 p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Select Date Range</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomDatePicker(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={applyCustomDateRange}
                        disabled={!customStartDate || !customEndDate}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="size-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={exportReport}>
              <Download className="size-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getMetricColor(metric.color)}`}>
                  <metric.icon className="size-6" />
                </div>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="size-4 text-green-600" />
                  ) : (
                    <TrendingDown className="size-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Campaign Performance Chart */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Campaign Performance</h2>
              <p className="text-sm text-gray-600">Email activity over the last 30 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={campaignPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="sent"
                stackId="1"
                stroke="#4A90E2"
                fill="#4A90E2"
                fillOpacity={0.6}
                name="Sent"
              />
              <Area
                type="monotone"
                dataKey="opened"
                stackId="2"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Opened"
              />
              <Area
                type="monotone"
                dataKey="clicked"
                stackId="3"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Clicked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Engagement Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Engagement Breakdown</h2>
            <p className="text-sm text-gray-600 mb-6">How recipients interact with emails</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {engagementData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Device Breakdown</h2>
            <p className="text-sm text-gray-600 mb-6">Where emails are being opened</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {device.name === 'Desktop' && <Monitor className="size-4 text-gray-600" />}
                    {device.name === 'Mobile' && <Smartphone className="size-4 text-gray-600" />}
                    {device.name === 'Tablet' && <Smartphone className="size-4 text-gray-600" />}
                    <span className="text-sm text-gray-700">{device.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{device.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscriber Growth */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Subscriber Growth</h2>
              <p className="text-sm text-gray-600">Track your audience growth over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subscriberGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" fill="#10B981" name="New Subscribers" radius={[8, 8, 0, 0]} />
              <Bar dataKey="lost" fill="#EF4444" name="Unsubscribed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Campaigns */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Top Performing Campaigns</h2>
          <p className="text-sm text-gray-600 mb-6">Your best campaigns in the last 30 days</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Campaign Name
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Sent
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Open Rate
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Click Rate
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Revenue
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((campaign, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{campaign.name}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">
                      {campaign.sent.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        <MailOpen className="size-4" />
                        {campaign.openRate}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-purple-600 font-medium">
                        <MousePointerClick className="size-4" />
                        {campaign.clickRate}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">
                      {campaign.revenue}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate?.('campaigns-details')}
                      >
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Insights */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Geographic Insights</h2>
          <p className="text-sm text-gray-600 mb-6">Where your audience is located</p>
          <div className="space-y-4">
            {geographicData.map((country, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{country.country}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {country.opens.toLocaleString()} opens • {country.clicks.toLocaleString()}{' '}
                    clicks
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <>
          {/* Slide-out Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Refine your report data
                </p>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Campaign Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="size-4" />
                  Campaign Status
                </h3>
                <div className="space-y-2">
                  {campaignStatusOptions.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCampaignStatuses.includes(status)}
                        onChange={() =>
                          toggleFilter(status, selectedCampaignStatuses, setSelectedCampaignStatuses)
                        }
                        className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                      {selectedCampaignStatuses.includes(status) && (
                        <CheckCircle2 className="size-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Template Type */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MailOpen className="size-4" />
                  Template Type
                </h3>
                <div className="space-y-2">
                  {templateTypeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTemplateTypes.includes(type)}
                        onChange={() =>
                          toggleFilter(type, selectedTemplateTypes, setSelectedTemplateTypes)
                        }
                        className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                      {selectedTemplateTypes.includes(type) && (
                        <CheckCircle2 className="size-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Recipient Groups */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="size-4" />
                  Recipient Groups
                </h3>
                <div className="space-y-2">
                  {groupOptions.map((group) => (
                    <label
                      key={group}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group)}
                        onChange={() => toggleFilter(group, selectedGroups, setSelectedGroups)}
                        className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{group}</span>
                      {selectedGroups.includes(group) && (
                        <CheckCircle2 className="size-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  Performance Metrics
                </h3>
                <div className="space-y-2">
                  {performanceOptions.map((performance) => (
                    <label
                      key={performance}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPerformance.includes(performance)}
                        onChange={() =>
                          toggleFilter(performance, selectedPerformance, setSelectedPerformance)
                        }
                        className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{performance}</span>
                      {selectedPerformance.includes(performance) && (
                        <CheckCircle2 className="size-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="size-4" />
                  Tags
                </h3>
                <div className="space-y-2">
                  {tagOptions.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleFilter(tag, selectedTags, setSelectedTags)}
                        className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag}</span>
                      {selectedTags.includes(tag) && (
                        <CheckCircle2 className="size-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t p-6 space-y-3">
              <Button
                onClick={applyFilters}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Apply Filters
                {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
              </Button>
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full"
                disabled={getActiveFilterCount() === 0}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </ModuleLayout>
  );
}