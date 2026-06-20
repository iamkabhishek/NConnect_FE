'use client';

import { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Sparkles, RefreshCw, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface OnboardingUnderReviewProps {
  workspaceName: string;
  workspaceSlug: string;
  ownerName: string;
  slaTier: string;
  onboardingData: any;
  onApproved: () => void;
  onBackToEdit: () => void;
}

export function OnboardingUnderReview({
  workspaceName,
  workspaceSlug,
  ownerName,
  slaTier,
  onboardingData,
  onApproved,
  onBackToEdit,
}: OnboardingUnderReviewProps) {
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'DENIED'>('PENDING');
  const [isChecking, setIsChecking] = useState(false);

  // Synchronize onboarding request into shared queue on mount
  useEffect(() => {
    if (!workspaceSlug) return;

    // Retrieve existing custom queue or initialize
    const rawQueue = localStorage.getItem('nconnect_custom_queue');
    let customQueue = [];
    try {
      if (rawQueue) customQueue = JSON.parse(rawQueue);
    } catch (e) {
      console.error(e);
    }

    // Check if slug already exists in queue, if not append
    const exists = customQueue.some((item: any) => item.domainSlug === workspaceSlug);
    if (!exists) {
      const newRequest = {
        id: 'cust-' + Math.random().toString(36).substring(2, 7),
        workspaceName,
        ownerName,
        domainSlug: workspaceSlug,
        slaTier: slaTier || 'Business',
        status: 'In Review',
        submittedAt: new Date().toISOString(),
        onboardingData: onboardingData || null, // Write full onboarding details
      };
      customQueue.push(newRequest);
      localStorage.setItem('nconnect_custom_queue', JSON.stringify(customQueue));
    }

    // Set initial approval status in localStorage if not set
    const approvalState = localStorage.getItem(`nconnect_approval_${workspaceSlug}`);
    if (!approvalState) {
      localStorage.setItem(`nconnect_approval_${workspaceSlug}`, 'PENDING');
    } else {
      setStatus(approvalState as any);
    }
  }, [workspaceName, workspaceSlug, ownerName, slaTier, onboardingData]);

  // Periodic auto-check status every 2.5 seconds
  useEffect(() => {
    if (status === 'APPROVED') {
      onApproved();
      return;
    }
    if (status === 'DENIED') return;

    const interval = setInterval(() => {
      const currentApproval = localStorage.getItem(`nconnect_approval_${workspaceSlug}`);
      if (currentApproval && currentApproval !== 'PENDING') {
        setStatus(currentApproval as any);
        if (currentApproval === 'APPROVED') {
          toast.success('Your workspace has been APPROVED by the platform owner!');
          setTimeout(() => onApproved(), 1000);
        } else if (currentApproval === 'DENIED') {
          toast.error('Your workspace request was declined.');
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [workspaceSlug, status, onApproved]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    // Mimic quick async check
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsChecking(false);

    const currentApproval = localStorage.getItem(`nconnect_approval_${workspaceSlug}`);
    if (currentApproval) {
      setStatus(currentApproval as any);
      if (currentApproval === 'APPROVED') {
        toast.success('Congratulations! Your workspace has been approved.');
        onApproved();
      } else if (currentApproval === 'DENIED') {
        toast.error('The request has been declined. Please try again.');
      } else {
        toast.info('Your registration is still under review by the platform administrator.');
      }
    } else {
      toast.info('Still awaiting review. Please check back shortly.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {status === 'PENDING' && (
        <>
          {/* Pulsing clock banner */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-ping absolute inline-flex h-32 w-32 rounded-full bg-amber-400 opacity-20"></div>
            </div>
            <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-full p-12 inline-block">
              <Clock className="size-24 text-amber-600 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Your details are under review! ⏳
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Your onboarding details have been submitted. The platform owner is currently reviewing your registration request for{' '}
            <span className="font-bold text-blue-600">'{workspaceName}'</span>.
          </p>

          {/* Interactive instruction banner */}
          <div className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-indigo-50/30 border border-purple-100 rounded-xl p-6 mb-8 text-left shadow-sm">
            <div className="flex gap-3">
              <div className="bg-purple-100 text-purple-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                💡
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm mb-1">Interactive Simulation Info:</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  To approve or deny this request, open the{' '}
                  <a
                    href="/ops"
                    target="_blank"
                    className="font-bold text-purple-700 underline hover:text-purple-800 inline-flex items-center gap-0.5"
                  >
                    Ops Administration Cockpit
                    <ExternalLink className="size-3" />
                  </a>{' '}
                  in a new browser tab, navigate to the <strong className="text-purple-700">Tenant Registry</strong> tab, choose{' '}
                  <strong>{workspaceName}</strong> under the Onboarding Queue, and select either <strong>Approve</strong> or <strong>Deny</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div className="text-left">
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">WORKSPACE STATUS</p>
                <p className="text-sm font-bold text-amber-700">Pending Admin Approval</p>
              </div>
            </div>
            <Button
              onClick={handleCheckStatus}
              disabled={isChecking}
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
            </Button>
          </div>
        </>
      )}

      {status === 'DENIED' && (
        <>
          {/* Denied Warning Card */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-ping absolute inline-flex h-32 w-32 rounded-full bg-red-400 opacity-10"></div>
            </div>
            <div className="relative bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-full p-12 inline-block">
              <ShieldAlert className="size-24 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Registration Request Declined ❌
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Your application for the workspace <span className="font-semibold text-red-600">'{workspaceName}'</span> was declined by the platform owner.
          </p>

          <div className="bg-red-50/50 border border-red-100 text-left rounded-xl p-5 mb-8">
            <p className="text-sm text-red-800 leading-relaxed font-medium">
              We were unable to approve your workspace credentials. This can be caused by using an incorrect or restricted workspace slug. Please edit your workspace details and resubmit the application.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onBackToEdit}
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 text-white h-13 px-8 text-base font-bold flex items-center gap-2 shadow-sm"
            >
              <span>Edit Details & Resubmit</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
