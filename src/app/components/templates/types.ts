import { TemplateElement } from './template-elements';

export interface TemplateEngagementMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  totalOpens: number;
  totalClicks: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  totalBounces: number;
  unsubscribeRate: number;
  totalUnsubscribes: number;
  associatedCampaigns: {
    id: string;
    name: string;
    status: string;
    sentDate: string;
    recipients: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    bounceRate: number;
    unsubscribeRate: number;
  }[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'newsletter' | 'promotional' | 'transactional' | 'event';
  thumbnail: string;
  lastModified: string;
  createdDate: string;
  isFavorite: boolean;
  usageCount: number;
  status: 'published' | 'draft' | 'retired';
  workspaceId?: string;
  elements?: TemplateElement[];
  tier?: 'free' | 'premium'; // Free or Premium template
  createdBy?: string;
  lastModifiedBy?: string;
  publishedOn?: string;
  publishedBy?: string;
  retiredOn?: string;
  retiredBy?: string;
  engagementMetrics?: TemplateEngagementMetrics;
}