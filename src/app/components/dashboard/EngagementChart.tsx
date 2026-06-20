import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useState } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

const weeklyData = [
  { date: 'Mon', opens: 245, clicks: 89 },
  { date: 'Tue', opens: 312, clicks: 134 },
  { date: 'Wed', opens: 289, clicks: 98 },
  { date: 'Thu', opens: 398, clicks: 187 },
  { date: 'Fri', opens: 421, clicks: 201 },
  { date: 'Sat', opens: 187, clicks: 67 },
  { date: 'Sun', opens: 156, clicks: 54 },
];

const monthlyData = [
  { date: 'Week 1', opens: 1245, clicks: 489 },
  { date: 'Week 2', opens: 1512, clicks: 634 },
  { date: 'Week 3', opens: 1689, clicks: 798 },
  { date: 'Week 4', opens: 1898, clicks: 887 },
];

const yearlyData = [
  { date: 'Jan', opens: 4200, clicks: 1890 },
  { date: 'Feb', opens: 3800, clicks: 1650 },
  { date: 'Mar', opens: 5100, clicks: 2340 },
  { date: 'Apr', opens: 4900, clicks: 2100 },
  { date: 'May', opens: 5800, clicks: 2650 },
  { date: 'Jun', opens: 6200, clicks: 2890 },
  { date: 'Jul', opens: 5900, clicks: 2780 },
  { date: 'Aug', opens: 6400, clicks: 3120 },
  { date: 'Sep', opens: 7100, clicks: 3450 },
  { date: 'Oct', opens: 6800, clicks: 3290 },
  { date: 'Nov', opens: 7500, clicks: 3670 },
  { date: 'Dec', opens: 8100, clicks: 4010 },
];

const customData = [
  { date: '12/01', opens: 2100, clicks: 890 },
  { date: '12/05', opens: 1950, clicks: 820 },
  { date: '12/10', opens: 2300, clicks: 1020 },
  { date: '12/15', opens: 2450, clicks: 1150 },
  { date: '12/20', opens: 2680, clicks: 1280 },
  { date: '12/25', opens: 1800, clicks: 720 },
  { date: '12/31', opens: 2900, clicks: 1380 },
];

export function EngagementChart() {
  const [dateRange, setDateRange] = useState('week');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 31),
  });
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom');

  const handleApplyCustomRange = () => {
    if (range?.from && range?.to) {
      const label = `${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d')}`;
      setCustomRangeLabel(label);
      setShowDatePicker(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Engagement Analytics</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Track your newsletter performance in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowDatePicker(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="size-4" />
                Select Range
              </Button>
              <Tabs defaultValue="week" className="w-auto">
                <TabsList className="bg-white shadow-sm">
                  <TabsTrigger value="week" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">7D</TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">30D</TabsTrigger>
                  <TabsTrigger value="year" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">1Y</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="week" className="w-full">
            {/* Real-time Metrics Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Total Opens</span>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-2xl font-bold text-blue-900">18.4K</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <span className="inline-block mr-1">↑</span> 12.5% vs last period
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Total Clicks</span>
                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-2xl font-bold text-purple-900">4.2K</p>
                <p className="text-xs text-purple-600 mt-1 flex items-center">
                  <span className="inline-block mr-1">↑</span> 8.3% vs last period
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Avg Open Rate</span>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-2xl font-bold text-green-900">24.8%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <span className="inline-block mr-1">↑</span> 2.1% vs last period
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">Click Rate</span>
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-2xl font-bold text-orange-900">3.4%</p>
                <p className="text-xs text-orange-600 mt-1 flex items-center">
                  <span className="inline-block mr-1">↓</span> 0.3% vs last period
                </p>
              </div>
            </div>

            <TabsContent value="week" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9B59B6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9B59B6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      padding: '12px 16px',
                    }}
                    cursor={{ fill: 'rgba(74, 144, 226, 0.05)' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="opens"
                    stroke="#4A90E2"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOpens)"
                    name="Opens"
                    dot={{ fill: '#4A90E2', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#9B59B6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                    name="Clicks"
                    dot={{ fill: '#9B59B6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="month" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      padding: '12px 16px',
                    }}
                    cursor={{ fill: 'rgba(74, 144, 226, 0.05)' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="opens"
                    stroke="#4A90E2"
                    strokeWidth={3}
                    dot={{ fill: '#4A90E2', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                    name="Opens"
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#9B59B6"
                    strokeWidth={3}
                    dot={{ fill: '#9B59B6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                    name="Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="year" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData}>
                  <defs>
                    <linearGradient id="colorOpensYear" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorClicksYear" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9B59B6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9B59B6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      padding: '12px 16px',
                    }}
                    cursor={{ fill: 'rgba(74, 144, 226, 0.05)' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="opens"
                    stroke="#4A90E2"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOpensYear)"
                    name="Opens"
                    dot={{ fill: '#4A90E2', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#9B59B6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorClicksYear)"
                    name="Clicks"
                    dot={{ fill: '#9B59B6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="custom" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customData}>
                  <defs>
                    <linearGradient id="colorOpensCustom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorClicksCustom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9B59B6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9B59B6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      padding: '12px 16px',
                    }}
                    cursor={{ fill: 'rgba(74, 144, 226, 0.05)' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="opens"
                    stroke="#4A90E2"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOpensCustom)"
                    name="Opens"
                    dot={{ fill: '#4A90E2', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#9B59B6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorClicksCustom)"
                    name="Clicks"
                    dot={{ fill: '#9B59B6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShowDatePicker(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div 
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Select Date Range</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {range?.from && range?.to ? (
                      `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`
                    ) : range?.from ? (
                      'Please select the end date'
                    ) : (
                      'Please select the start date'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <style>{`
                .calendar-picker {
                  --rdp-cell-size: 40px;
                  --rdp-accent-color: #4A90E2;
                  --rdp-background-color: #E3F2FD;
                  margin: 0 auto;
                }
                .calendar-picker .rdp-months {
                  justify-content: center;
                }
                .calendar-picker .rdp-month {
                  margin: 0 1rem;
                }
                .calendar-picker .rdp-day_selected {
                  background-color: #4A90E2;
                  color: white;
                }
                .calendar-picker .rdp-day_selected:hover {
                  background-color: #357ABD;
                }
                .calendar-picker .rdp-day_range_middle {
                  background-color: #E3F2FD;
                  color: #1976D2;
                }
                .calendar-picker .rdp-day_today {
                  font-weight: bold;
                  color: #4A90E2;
                }
                .calendar-picker .rdp-day:hover:not(.rdp-day_selected) {
                  background-color: #F5F5F5;
                }
                .calendar-picker .rdp-button {
                  border-radius: 6px;
                }
                .calendar-picker .rdp-head_cell {
                  color: #666;
                  font-weight: 500;
                  font-size: 0.875rem;
                }
                .calendar-picker .rdp-caption_label {
                  font-weight: 600;
                  font-size: 0.9375rem;
                  color: #1F2937;
                }
                .calendar-picker .rdp-nav_button {
                  width: 32px;
                  height: 32px;
                }
                .calendar-picker .rdp-nav_button:hover {
                  background-color: #F5F5F5;
                }
              `}</style>

              <div className="flex justify-center py-4">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={2}
                  showOutsideDays={false}
                  className="calendar-picker"
                  components={{
                    IconLeft: () => <ChevronLeft className="size-4" />,
                    IconRight: () => <ChevronRight className="size-4" />,
                  }}
                />
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <Button
                  onClick={() => setShowDatePicker(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyCustomRange}
                  disabled={!range?.from || !range?.to}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Range
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}