export interface OwnerProfile {
  ownerId: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  alternateEmail: string;
  phone: string;
  alternatePhone: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  companyId: string;
  companyName: string;
  category: string;
  registrationNo: string; // CIN
  gstRegistrationNo: string;
  website: string;
  size: string;
  companyPhoneNumber: string;
  companyEmail: string;
  companyAlternateEmail: string;
}

export interface CorporateAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  isPrimary: boolean;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface WorkspaceTenant {
  id: string;
  companyName: string;
  ownerName: string;
  domainSlug: string;
  slaTier: 'Standard' | 'Pro' | 'Business' | 'Enterprise' | 'Free' | 'Starter';
  status: 'Active' | 'Suspended' | 'In Review';
  seatAllocation: number;
  activeInvitations: number;
  renewalDate: string;
  isParent: boolean;
  parentId?: string; // If this is a child workspace
}

export interface PendingOnboarding {
  id: string;
  workspaceName: string;
  ownerName: string;
  domainSlug: string;
  slaTier: 'Standard' | 'Pro' | 'Business' | 'Enterprise' | 'Free' | 'Starter';
  status: 'In Review' | 'Active';
  submittedAt: string;
}

export interface FeatureUnit {
  id: string;
  name: string;
  code: string; // Uppercase code (e.g., USER_SEAT, STG_100GB)
  category: 'Users' | 'Workspaces' | 'Storage' | 'API Limits' | 'Campaigns' | 'Automations';
  basePrice: number;
  promoPrice: number;
  isAddon: boolean;
  discountCap: number; // Percentage cap
}

export interface SaaSPackage {
  id: string;
  name: string;
  billingCycle: 'monthly' | 'yearly';
  trialDays: number;
  gracePeriodDays: number;
  features: {
    featureCode: string;
    quantity: number;
  }[];
  baseMonthlyPrice: number;
  promoMonthlyPrice: number;
  yearlyPrice: number;
  isPublished: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  deductionType: 'flat' | 'percentage';
  deductionValue: number;
  minOrderSubtotal: number;
  restrictedPlans: string[]; // Plan names or IDs
  redemptionCount: number;
  isActive: boolean;
}

export interface PlatformOperator {
  id: string;
  name: string;
  email: string;
  accessLevel: 'L3 - Full' | 'L2 - Console' | 'L1 - Help Desk';
  status: 'Active' | 'Offline';
  privilegeToken: string;
  isSelf?: boolean;
}
