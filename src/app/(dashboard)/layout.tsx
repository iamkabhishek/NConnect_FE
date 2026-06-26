'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useWorkspace();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'guest') {
      setIsRedirecting(true);
      router.replace('/signup');
    }
  }, [currentUser, router]);

  if (isRedirecting || currentUser?.role === 'guest') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-zinc-500 font-medium">Redirecting to registration...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

