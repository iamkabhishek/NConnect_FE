import { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from '@/app/contexts/WorkspaceContext';
import { DevNavigation } from '@/app/components/DevNavigation';
import LandingPage from '@/app/components/landing/LandingPage';
import { WelcomeScreen } from '@/app/components/auth/WelcomeScreen';
import { SignUpPage } from '@/app/components/auth/SignUpPage';
import { SignInPage } from '@/app/components/auth/SignInPage';
import { VerifyEmailPage } from '@/app/components/auth/VerifyEmailPage';

import { OnboardingFlow } from '@/app/components/onboarding/OnboardingFlow';
import { Dashboard } from '@/app/components/dashboard/Dashboard';
import { ContactsModule } from '@/app/components/contacts/ContactsModule';
import { GroupsModule } from '@/app/components/groups/GroupsModule';
import { TemplatesPage } from '@/app/components/templates/TemplatesPage';
import { CreateTemplatePage } from '@/app/components/templates/CreateTemplatePage';
import { CampaignsPage } from '@/app/components/campaigns/CampaignsPage';
import { CreateCampaignPage } from '@/app/components/campaigns/CreateCampaignPage';
import { CampaignDetailsPage } from '@/app/components/campaigns/CampaignDetailsPage';
import { SettingsPage } from '@/app/components/settings/SettingsPage';
import { WorkspacesPage } from '@/app/components/workspaces/WorkspacesPage';
import { ReportsPage } from '@/app/components/reports/ReportsPage';
import { MediaLibraryPage } from '@/app/components/media/MediaLibraryPage';
import { UserManagementPage } from '@/app/components/users/UserManagementPage';
import { AutomationPage } from '@/app/components/automation/AutomationPage';
import { WorkflowBuilderPage } from '@/app/components/automation/WorkflowBuilderPage';
import { WorkflowAnalyticsPage } from '@/app/components/automation/WorkflowAnalyticsPage';
import { WorkflowWizard } from '@/app/components/automation/WorkflowWizard';
import { SenderEmailsPage } from '@/app/components/senders/SenderEmailsPage';
import { DocumentationPage } from '@/app/components/documentation/DocumentationPage';
import { ArticleDetailPage } from '@/app/components/documentation/ArticleDetailPage';

type AuthModule = 
  | 'landing'
  | 'welcome' 
  | 'signup' 
  | 'signin' 
  | 'verify-email' 
  | 'onboarding'
  | 'dashboard'
  | 'contacts'
  | 'groups'
  | 'templates'
  | 'templates-create'
  | 'campaigns'
  | 'campaigns-create'
  | 'campaigns-details'
  | 'settings'
  | 'workspaces'
  | 'reports'
  | 'media'
  | 'users'
  | 'automation'
  | 'automation-builder'
  | 'automation-analytics'
  | 'workflow-wizard'
  | 'sender-emails'
  | 'documentation'
  | 'documentation-article';

function AppContent() {
  const { currentUser } = useWorkspace();
  const [currentModule, setCurrentModule] = useState<AuthModule>('landing');
  const [userEmail, setUserEmail] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [campaignCreationType, setCampaignCreationType] = useState<'scratch' | 'template' | 'quick'>('scratch');

  const handleModuleChange = (module: string) => {
    setCurrentModule(module as AuthModule);
  };

  const handleSignUp = () => {
    setCurrentModule('signup');
  };

  const handleSignIn = () => {
    setCurrentModule('signin');
  };

  const handleSignUpSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentModule('verify-email');
  };

  const handleSignInSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentModule('verify-email');
  };

  const handleVerifySuccess = () => {
    // If the active user persona is Owner and has NOT completed onboarding, go to onboarding.
    // Otherwise, bypass onboarding and go directly to the Dashboard!
    if (currentUser.role === 'owner' && !currentUser.onboarded) {
      setCurrentModule('onboarding');
    } else {
      setCurrentModule('dashboard');
    }
  };

  const handleBackToWelcome = () => {
    setCurrentModule('welcome');
  };

  const handleBackToSignIn = () => {
    setCurrentModule('signin');
  };

  const handleOnboardingComplete = () => {
    alert('Onboarding complete! 🎉\n\nRedirecting you straight to your workspace dashboard.');
    setCurrentModule('dashboard');
  };

  const handleNavigateToCreateTemplate = () => {
    setCurrentModule('templates-create');
  };

  const handleNavigateToTemplates = () => {
    setCurrentModule('templates');
  };

  const handleNavigateToCreateCampaign = () => {
    setCurrentModule('campaigns-create');
  };

  const handleNavigateToCreateCampaignWithType = (type?: 'scratch' | 'template' | 'quick') => {
    console.log('Creating campaign with type:', type);
    setCampaignCreationType(type || 'scratch');
    setCurrentModule('campaigns-create');
  };

  const handleNavigateToCampaigns = () => {
    setCurrentModule('campaigns');
  };

  const handleNavigateToCampaignDetails = (campaignId: string) => {
    setSelectedWorkflowId(campaignId);
    setCurrentModule('campaigns-details');
  };

  return (
    <div className="size-full">
      {/* Dev Navigation */}
      <DevNavigation currentModule={currentModule} onModuleChange={handleModuleChange} />

      {/* Render Current Module with the active user context */}
      {currentModule === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentModule('welcome')} />
      )}

      {currentModule === 'welcome' && (
        <WelcomeScreen onSignIn={handleSignIn} onSignUp={handleSignUp} />
      )}

      {currentModule === 'signup' && (
        <SignUpPage 
          onSignIn={handleSignIn} 
          onSignUpSuccess={handleSignUpSuccess}
          onBack={handleBackToWelcome}
        />
      )}

      {currentModule === 'signin' && (
        <SignInPage 
          onSignUp={handleSignUp} 
          onSignInSuccess={handleSignInSuccess}
          onBack={handleBackToWelcome}
        />
      )}

      {currentModule === 'verify-email' && (
        <VerifyEmailPage 
          email={userEmail}
          onVerifySuccess={handleVerifySuccess}
          onBack={handleBackToSignIn}
        />
      )}

      {currentModule === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {currentModule === 'dashboard' && (
        <Dashboard onNavigate={handleModuleChange} userName={currentUser.name} />
      )}

      {currentModule === 'contacts' && (
        <ContactsModule onNavigate={handleModuleChange} userName={currentUser.name} />
      )}

      {currentModule === 'groups' && (
        <GroupsModule onNavigate={handleModuleChange} userName={currentUser.name} />
      )}

      {currentModule === 'templates' && (
        <TemplatesPage onNavigateToCreate={handleNavigateToCreateTemplate} onNavigate={handleModuleChange} />
      )}

      {currentModule === 'templates-create' && (
        <CreateTemplatePage onCreateTemplate={() => handleNavigateToTemplates()} onNavigate={handleModuleChange} />
      )}

      {currentModule === 'campaigns' && (
        <CampaignsPage 
          onCreateCampaign={handleNavigateToCreateCampaignWithType}
          onViewCampaign={handleNavigateToCampaignDetails}
          onEditCampaign={handleNavigateToCreateCampaign}
          onNavigate={handleModuleChange} 
        />
      )}

      {currentModule === 'campaigns-create' && (
        <CreateCampaignPage 
          creationType={campaignCreationType}
          onCreateCampaign={() => handleNavigateToCampaigns()} 
          onNavigate={handleModuleChange} 
        />
      )}

      {currentModule === 'campaigns-details' && (
        <CampaignDetailsPage campaignId={selectedWorkflowId} onNavigate={handleModuleChange} />
      )}

      {currentModule === 'settings' && (
        <SettingsPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'workspaces' && (
        <WorkspacesPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'reports' && (
        <ReportsPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'media' && (
        <MediaLibraryPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'users' && (
        <UserManagementPage onNavigate={handleModuleChange} userName={currentUser.name} />
      )}

      {currentModule === 'automation' && (
        <AutomationPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'automation-builder' && (
        <WorkflowBuilderPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'automation-analytics' && (
        <WorkflowAnalyticsPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'workflow-wizard' && (
        <WorkflowWizard onNavigate={handleModuleChange} />
      )}

      {currentModule === 'sender-emails' && (
        <SenderEmailsPage onNavigate={handleModuleChange} />
      )}

      {currentModule === 'documentation' && (
        <DocumentationPage 
          onNavigate={handleModuleChange}
          onViewArticle={(articleId) => setCurrentModule('documentation-article')}
        />
      )}

      {currentModule === 'documentation-article' && (
        <ArticleDetailPage 
          onNavigate={handleModuleChange}
          onBackToDocumentation={() => setCurrentModule('documentation')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}