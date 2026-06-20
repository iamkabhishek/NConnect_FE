import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveRoute(page: string): string {
  if (page === 'landing') return '/';
  if (page === 'welcome' || page === 'signin' || page === 'signup' || page === 'verify-email' || page === 'onboarding') {
    return `/${page}`;
  }
  if (page === 'workflow-wizard') return '/dashboard/workflow-wizard';
  if (page === 'automation-builder') return '/dashboard/automation/builder';
  if (page === 'automation-analytics') return '/dashboard/automation/analytics';
  if (page === 'sender-emails') return '/dashboard/sender-emails';
  if (page === 'templates-create') return '/dashboard/templates/create';
  if (page === 'campaigns-create') return '/dashboard/campaigns/create';
  if (page === 'documentation') return '/docs';
  return `/dashboard/${page}`;
}
