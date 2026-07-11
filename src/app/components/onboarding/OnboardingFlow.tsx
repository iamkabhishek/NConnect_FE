import { useState, useEffect } from 'react';
import { Progress } from '@/app/components/ui/progress';
import { OnboardingStep1Welcome } from './OnboardingStep1Welcome';
import { OnboardingStep2Personal, PersonalInfoData } from './OnboardingStep2Personal';
import { OnboardingStep3AgencyDetails, AgencyData } from './OnboardingStep3AgencyDetails';
import { OnboardingStep3Workspace, WorkspaceData } from './OnboardingStep3Workspace';
import { OnboardingStep4Plan, PlanData } from './OnboardingStep4Plan';
import { OnboardingStep4UseCase, UseCaseData } from './OnboardingStep4UseCase';
import { OnboardingSuccess } from './OnboardingSuccess';
import { OnboardingUnderReview } from './OnboardingUnderReview';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export interface OnboardingData {
  personal: PersonalInfoData | null;
  agency: AgencyData | null;
  workspace: WorkspaceData | null;
  plan: PlanData | null;
  useCase: UseCaseData | null;
}

import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { onboardingStep1, onboardingStep2, onboardingStep3, getStoredToken, refreshCognitoTokens, updateProfile } from '@/app/lib/api';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { currentUser, setCurrentUser } = useWorkspace();
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizationError, setFinalizationError] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personal: null,
    agency: null,
    workspace: null,
    plan: null,
    useCase: null,
  });

  // Load incomplete onboarding state on mount
  useEffect(() => {
    const savedStep = localStorage.getItem('nconnect_onboarding_step');
    const savedData = localStorage.getItem('nconnect_onboarding_data');
    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
    if (savedData) {
      try {
        setOnboardingData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse cached onboarding data', e);
      }
    }
  }, []);

  const totalSteps = 6; // 5 active progress steps: Personal, Agency, Workspace, Plan, Use Case
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Persist state updates to cache helper
  const saveStepProgress = (nextStep: number, updatedData: OnboardingData) => {
    setCurrentStep(nextStep);
    setOnboardingData(updatedData);
    localStorage.setItem('nconnect_onboarding_step', nextStep.toString());
    localStorage.setItem('nconnect_onboarding_data', JSON.stringify(updatedData));
  };

  const handleStep2Complete = (data: PersonalInfoData) => {
    const updated = { ...onboardingData, personal: data };
    saveStepProgress(3, updated);

    // Dynamically update currentUser name in WorkspaceContext!
    if (currentUser) {
      const finalName = `${data.firstName} ${data.lastName}`;
      const initials = `${data.firstName[0] || ''}${data.lastName[0] || ''}`.toUpperCase().substring(0, 2);
      const updatedUser = {
        ...currentUser,
        name: finalName,
        avatar: initials || currentUser.avatar,
      };
      setCurrentUser(updatedUser);

      // Update in custom personas list too
      const customPersonas = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('nconnect_custom_personas') || '[]')
        : [];
      const updatedPersonas = customPersonas.map((p: any) => 
        p.email.toLowerCase() === currentUser.email.toLowerCase()
          ? { ...p, name: finalName, avatar: initials || p.avatar }
          : p
      );
      localStorage.setItem('nconnect_custom_personas', JSON.stringify(updatedPersonas));
      
      // Also pre-populate the Ops Cockpit owner profile so the header is correct immediately
      const opsProfile = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: currentUser.email,
        designation: data.role || 'Owner',
        phone: data.phone,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('nconnect_ops_owner_profile', JSON.stringify(opsProfile));
    }
  };

  const handleStep3Complete = (data: AgencyData) => {
    const updated = { ...onboardingData, agency: data };
    saveStepProgress(4, updated);
  };

  const handleStep4Complete = (data: WorkspaceData) => {
    const updated = { ...onboardingData, workspace: data };
    saveStepProgress(5, updated); // Move to Step 5: Plan selection
  };

  const handleStep5PlanComplete = (data: PlanData) => {
    const updated = { ...onboardingData, plan: data };
    saveStepProgress(6, updated); // Move to Step 6: Use Case details
  };

  const handleStep6Complete = (data: UseCaseData) => {
    const updated = { ...onboardingData, useCase: data };
    
    // Auto-register to nconnect_custom_queue in the background so it still appears in /ops console
    if (typeof window !== 'undefined') {
      const workspaceSlug = updated.workspace?.identifier || updated.workspace?.slug || 'workspace-slug';
      const workspaceName = updated.workspace?.name || updated.agency?.name || 'My Workspace';
      const ownerName = updated.personal ? `${updated.personal.firstName} ${updated.personal.lastName}` : 'Owner';
      const slaTier = updated.plan?.tier || updated.workspace?.slaTier || 'Business';

      const rawQueue = localStorage.getItem('nconnect_custom_queue');
      let customQueue = [];
      try {
        if (rawQueue) customQueue = JSON.parse(rawQueue);
      } catch (e) {
        console.error(e);
      }

      const exists = customQueue.some((item: any) => item.domainSlug === workspaceSlug);
      if (!exists) {
        const newRequest = {
          id: 'cust-' + Math.random().toString(36).substring(2, 7),
          workspaceName,
          ownerName,
          domainSlug: workspaceSlug,
          slaTier,
          status: 'In Review',
          submittedAt: new Date().toISOString(),
          onboardingData: updated,
        };
        customQueue.push(newRequest);
        localStorage.setItem('nconnect_custom_queue', JSON.stringify(customQueue));
      }

      // Pre-populate approval state as APPROVED for instant user bypass
      localStorage.setItem(`nconnect_approval_${workspaceSlug}`, 'APPROVED');
    }

    saveStepProgress(8, updated); // Under Review (Step 7) bypassed, go straight to Step 8 (Success)
  };

  const handleFinalizeOnboarding = async () => {
    setIsFinalizing(true);
    setFinalizationError(null);

    try {
      const idToken = getStoredToken();
      const refreshToken = localStorage.getItem('nconnect_refresh_token');

      if (!idToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // 1. Submit onboarding steps to the API
      const workspaceName = onboardingData.workspace?.name || 'My Workspace';
      const orgName = onboardingData.agency?.name || workspaceName;

      await onboardingStep1(idToken, onboardingData.personal?.firstName || '', onboardingData.personal?.lastName || '');
      await onboardingStep2(idToken, orgName);
      const completeResult = await onboardingStep3(
        idToken,
        workspaceName,
        onboardingData.workspace?.color,
        onboardingData.workspace?.description
      );

      // 2. Trigger Cognito Refresh to stamp custom:tenantId claim
      let activeIdToken = idToken;
      if (refreshToken) {
        try {
          const refreshResult = await refreshCognitoTokens(refreshToken);
          activeIdToken = refreshResult.token;
          
          // Store refreshed tokens in localStorage
          localStorage.setItem('nconnect_id_token', refreshResult.token);
          localStorage.setItem('nconnect_access_token', refreshResult.accessToken);
          localStorage.setItem('nconnect_refresh_token', refreshResult.refreshToken);
        } catch (refreshErr) {
          console.error('Failed to automatically refresh Cognito token claims:', refreshErr);
          // Non-blocking fallback: proceed with original ID token if refresh fails
        }
      }

      // 3. Update user display name in database if personal details are present
      if (onboardingData.personal) {
        const fullName = `${onboardingData.personal.firstName} ${onboardingData.personal.lastName}`.trim();
        try {
          await updateProfile(activeIdToken, fullName);
        } catch (profileErr) {
          console.error('Failed to sync display name to database:', profileErr);
          // Non-blocking fallback
        }
      }

      // 4. Update current user state in workspace context
      if (currentUser) {
        const finalName = onboardingData.personal
          ? `${onboardingData.personal.firstName} ${onboardingData.personal.lastName}`.trim()
          : currentUser.name;
        const initials = onboardingData.personal
          ? `${onboardingData.personal.firstName[0] || ''}${onboardingData.personal.lastName[0] || ''}`.toUpperCase().substring(0, 2)
          : currentUser.avatar;

        const updatedUser = {
          ...currentUser,
          name: finalName,
          avatar: initials || currentUser.avatar,
          onboarded: true,
          // Sync sequential human-readable tenant code back to context state
          customTenantId: completeResult.customTenantId,
          tenantId: completeResult.tenantId,
        };
        setCurrentUser(updatedUser);

        // Also update in custom personas list
        const customPersonas = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('nconnect_custom_personas') || '[]')
          : [];
        const updatedPersonas = customPersonas.map((p: any) => 
          p.email.toLowerCase() === currentUser.email.toLowerCase()
            ? { ...p, name: finalName, avatar: initials || p.avatar, onboarded: true }
            : p
        );
        localStorage.setItem('nconnect_custom_personas', JSON.stringify(updatedPersonas));
      }

      // 5. Clear onboarding progress caches
      localStorage.removeItem('nconnect_onboarding_step');
      localStorage.removeItem('nconnect_onboarding_data');
      localStorage.removeItem(`nconnect_approval_${onboardingData.workspace?.identifier || onboardingData.workspace?.slug}`);
      
      // 6. Redirect straight to /dashboard
      onComplete();
    } catch (err: any) {
      console.error('Error finalizing onboarding:', err);
      setFinalizationError(err.message || 'An unexpected error occurred during finalization.');
      setIsFinalizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Progress Bar (not on welcome, review, or success screen) */}
      {currentStep > 1 && currentStep < 7 && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep - 1} of {totalSteps - 1}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className={`container mx-auto px-6 ${currentStep > 1 && currentStep < 7 ? 'pt-32 pb-20' : 'py-20'}`}>
        {currentStep === 1 && (
          <OnboardingStep1Welcome onNext={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <OnboardingStep2Personal
            onNext={handleStep2Complete}
            onBack={() => setCurrentStep(1)}
            initialData={onboardingData.personal || undefined}
          />
        )}

        {currentStep === 3 && (
          <OnboardingStep3AgencyDetails
            onNext={handleStep3Complete}
            onBack={() => setCurrentStep(2)}
            initialData={onboardingData.agency || undefined}
          />
        )}

        {currentStep === 4 && (
          <OnboardingStep3Workspace
            onNext={handleStep4Complete}
            onBack={() => setCurrentStep(3)}
            initialData={onboardingData.workspace || undefined}
          />
        )}

        {currentStep === 5 && (
          <OnboardingStep4Plan
            onNext={handleStep5PlanComplete}
            onBack={() => setCurrentStep(4)}
            initialData={onboardingData.plan || undefined}
          />
        )}

        {currentStep === 6 && (
          <OnboardingStep4UseCase
            onComplete={handleStep6Complete}
            onBack={() => setCurrentStep(5)}
            initialData={onboardingData.useCase || undefined}
          />
        )}

        {currentStep === 7 && (
          <OnboardingUnderReview
            workspaceName={onboardingData.workspace?.name || onboardingData.agency?.name || 'My Workspace'}
            workspaceSlug={onboardingData.workspace?.identifier || onboardingData.workspace?.slug || 'workspace-slug'}
            ownerName={onboardingData.personal ? `${onboardingData.personal.firstName} ${onboardingData.personal.lastName}` : 'Owner'}
            slaTier={onboardingData.plan?.tier || onboardingData.workspace?.slaTier || 'Business'}
            onboardingData={onboardingData}
            onApproved={() => saveStepProgress(8, onboardingData)}
            onBackToEdit={() => saveStepProgress(4, onboardingData)} // Back to Step 3: Workspace Config
          />
        )}

        {currentStep === 8 && (
          <OnboardingSuccess
            workspaceName={onboardingData.workspace?.name || 'My Workspace'}
            onContinue={handleFinalizeOnboarding}
          />
        )}
      </div>

      {/* Premium Finalizing Backdrop Overlay */}
      {isFinalizing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/10 border border-white/20 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl text-center relative overflow-hidden backdrop-saturate-150">
            {/* Glowing background gradient balls */}
            <div className="absolute -top-12 -left-12 size-36 bg-fuchsia-500/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 size-36 bg-indigo-500/30 rounded-full blur-2xl animate-pulse delay-75"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="size-16 rounded-full border-t-4 border-r-4 border-fuchsia-500 animate-spin"></div>
                <div className="size-10 rounded-full border-b-4 border-l-4 border-indigo-500 animate-spin absolute top-3 left-3" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Finalizing Workspace</h3>
              <p className="text-gray-300 text-sm animate-pulse">
                Setting up and launching your customized environment. Please do not close this window...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Premium Error Card Overlay */}
      {finalizationError && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-red-100 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-12 -left-12 size-36 bg-red-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-red-50 rounded-full p-4 mb-4 animate-bounce">
                <svg className="size-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Finalization Failed</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {finalizationError}
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setFinalizationError(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalizeOnboarding}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white rounded-lg hover:from-fuchsia-700 hover:to-indigo-700 transition-all font-medium shadow-md shadow-fuchsia-500/10"
                >
                  Retry Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}