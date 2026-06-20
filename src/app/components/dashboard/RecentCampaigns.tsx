import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Eye, MoreVertical, CheckCircle, Clock, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'sent' | 'scheduled' | 'draft' | 'failed';
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Weekly Newsletter #45',
    subject: 'Top Stories This Week',
    status: 'sent',
    sentDate: '2026-01-15',
    recipients: 2847,
    openRate: 42.5,
    clickRate: 12.3,
  },
  {
    id: '2',
    name: 'Product Launch Announcement',
    subject: 'Introducing Our New Feature',
    status: 'sent',
    sentDate: '2026-01-14',
    recipients: 3521,
    openRate: 55.8,
    clickRate: 24.1,
  },
  {
    id: '3',
    name: 'Monthly Update - January',
    subject: 'What We Shipped This Month',
    status: 'scheduled',
    sentDate: '2026-01-20',
    recipients: 2847,
    openRate: 0,
    clickRate: 0,
  },
  {
    id: '4',
    name: 'Customer Success Stories',
    subject: 'How Our Users Achieve Results',
    status: 'sent',
    sentDate: '2026-01-12',
    recipients: 1924,
    openRate: 38.2,
    clickRate: 9.8,
  },
  {
    id: '5',
    name: 'Holiday Special Offer',
    subject: 'Save 30% This Weekend Only',
    status: 'draft',
    sentDate: '-',
    recipients: 0,
    openRate: 0,
    clickRate: 0,
  },
];

function StatusBadge({ status }: { status: Campaign['status'] }) {
  const variants = {
    sent: { label: 'Sent', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    scheduled: { label: 'Scheduled', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600 bg-blue-100' },
    draft: { label: 'Draft', variant: 'outline' as const, icon: Clock, color: 'text-gray-600 bg-gray-100' },
    failed: { label: 'Failed', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600 bg-red-100' },
  };

  const { label, icon: Icon, color } = variants[status];

  return (
    <Badge className={`${color} border-0`}>
      <Icon className="size-3 mr-1" />
      {label}
    </Badge>
  );
}

interface RecentCampaignsProps {
  onViewCampaign?: (campaignId: string) => void;
  onViewAll?: () => void;
}

export function RecentCampaigns({ onViewCampaign, onViewAll }: RecentCampaignsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Campaigns</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Recipients</TableHead>
              <TableHead className="text-right">Open Rate</TableHead>
              <TableHead className="text-right">Click Rate</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.subject}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={campaign.status} />
                </TableCell>
                <TableCell className="text-gray-600">
                  {campaign.sentDate !== '-' 
                    ? new Date(campaign.sentDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {campaign.recipients > 0 ? campaign.recipients.toLocaleString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {campaign.status === 'sent' ? (
                    <span
                      className={`font-medium ${
                        campaign.openRate >= 40 ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {campaign.openRate}%
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {campaign.status === 'sent' ? (
                    <span
                      className={`font-medium ${
                        campaign.clickRate >= 15 ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {campaign.clickRate}%
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="size-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onViewCampaign && onViewCampaign(campaign.id)}
                      >
                        <Eye className="size-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      {campaign.status === 'draft' && (
                        <DropdownMenuItem>Continue Editing</DropdownMenuItem>
                      )}
                      {campaign.status === 'scheduled' && (
                        <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}