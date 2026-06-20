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

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { currentUser, setCurrentUser } = useWorkspace();
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleFinalizeOnboarding = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        onboarded: true
      };
      setCurrentUser(updatedUser);

      // Also update in custom personas list
      const customPersonas = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('nconnect_custom_personas') || '[]')
        : [];
      const updatedPersonas = customPersonas.map((p: any) => 
        p.email.toLowerCase() === currentUser.email.toLowerCase()
          ? { ...p, onboarded: true }
          : p
      );
      localStorage.setItem('nconnect_custom_personas', JSON.stringify(updatedPersonas));
    }

    // Clear cache upon complete
    localStorage.removeItem('nconnect_onboarding_step');
    localStorage.removeItem('nconnect_onboarding_data');
    localStorage.removeItem(`nconnect_approval_${onboardingData.workspace?.identifier || onboardingData.workspace?.slug}`);
    onComplete();
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
    </div>
  );
}