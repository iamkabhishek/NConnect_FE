import { useState } from 'react';
import { X } from 'lucide-react';
import { CreateWorkspaceStep1Company, CompanySetupData } from './CreateWorkspaceStep1Company';
import { CreateWorkspaceStep2Representative, RepresentativeData } from './CreateWorkspaceStep2Representative';
import { CreateWorkspaceStep3Credentials, CredentialsData } from './CreateWorkspaceStep3Credentials';
import { CreateWorkspaceStep4Branding, BrandingData } from './CreateWorkspaceStep4Branding';
import { CreateWorkspaceStep5Details, WorkspaceDetailsData } from './CreateWorkspaceStep5Details';
import { WorkspaceCreatedSuccessModal } from './WorkspaceCreatedSuccessModal';

interface CreateWorkspaceMultiStepProps {
  onClose: () => void;
  onWorkspaceCreated?: (workspaceData: CompleteWorkspaceData) => void;
}

export interface CompleteWorkspaceData {
  company: CompanySetupData;
  representative: RepresentativeData;
  credentials: CredentialsData;
  branding: BrandingData;
  workspace: WorkspaceDetailsData;
}

export function CreateWorkspaceMultiStep({ onClose, onWorkspaceCreated }: CreateWorkspaceMultiStepProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CompleteWorkspaceData>>({});

  const totalSteps = 5;

  const handleStep1Next = (data: CompanySetupData) => {
    setFormData(prev => ({ ...prev, company: data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: RepresentativeData) => {
    setFormData(prev => ({ ...prev, representative: data }));
    setCurrentStep(3);
  };

  const handleStep3Next = (data: CredentialsData) => {
    setFormData(prev => ({ ...prev, credentials: data }));
    setCurrentStep(4);
  };

  const handleStep4Next = (data: BrandingData) => {
    setFormData(prev => ({ ...prev, branding: data }));
    setCurrentStep(5);
  };

  const handleStep5Complete = (data: WorkspaceDetailsData) => {
    const completeData: CompleteWorkspaceData = {
      company: formData.company!,
      representative: formData.representative!,
      credentials: formData.credentials!,
      branding: data.branding || formData.branding!,
      workspace: data,
    };
    
    setFormData(prev => ({ ...prev, workspace: data }));
    setShowSuccess(true);
    onWorkspaceCreated?.(completeData);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Company Setup';
      case 2: return 'Company Account Representative';
      case 3: return 'Account Credentials';
      case 4: return 'Branding';
      case 5: return 'Workspace Details';
      default: return '';
    }
  };

  if (showSuccess) {
    return <WorkspaceCreatedSuccessModal onClose={handleSuccessClose} workspaceName={formData.workspace?.name || ''} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Workspace</h2>
              <p className="text-sm text-gray-600 mt-1">
                {getStepTitle()} - Step {currentStep} of {totalSteps}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="px-6 pb-4">
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    index < currentStep
                      ? 'bg-blue-600'
                      : index === currentStep - 1
                      ? 'bg-blue-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <CreateWorkspaceStep1Company
              onNext={handleStep1Next}
              initialData={formData.company}
            />
          )}
          
          {currentStep === 2 && (
            <CreateWorkspaceStep2Representative
              onNext={handleStep2Next}
              onBack={handleBack}
              initialData={formData.representative}
            />
          )}
          
          {currentStep === 3 && (
            <CreateWorkspaceStep3Credentials
              onNext={handleStep3Next}
              onBack={handleBack}
              initialData={formData.credentials}
              representativeEmail={formData.representative?.email}
            />
          )}
          
          {currentStep === 4 && (
            <CreateWorkspaceStep4Branding
              onNext={handleStep4Next}
              onBack={handleBack}
              initialData={formData.branding}
            />
          )}
          
          {currentStep === 5 && (
            <CreateWorkspaceStep5Details
              onComplete={handleStep5Complete}
              onBack={handleBack}
              initialData={formData.workspace}
              companyLogo={formData.branding?.logo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
