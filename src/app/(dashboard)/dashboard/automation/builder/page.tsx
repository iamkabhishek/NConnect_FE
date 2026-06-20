'use client';

import { useRouter } from 'next/navigation';
import { WorkflowBuilderPage } from '@/app/components/automation/WorkflowBuilderPage';

export default function WorkflowBuilderPageRoute() {
  const router = useRouter();

  return (
    <WorkflowBuilderPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
