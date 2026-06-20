import { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Zap, Target, Settings as SettingsIcon,
  Mail, Clock, Users, Filter, Tag, GitBranch, CheckCircle, Eye, Save
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface NavigationProps {
  onNavigate: (page: string) => void;
  onComplete?: () => void;
}

type TriggerType = 'subscriber-join' | 'email-opened' | 'link-clicked' | 'date-based' | 'inactivity' | 'abandoned-cart' | 'post-purchase' | 'product-purchased' | 'form-submitted' | 'tag-added' | 'page-visited' | 'api-webhook';
type ActionType = 'send-email' | 'add-to-group' | 'remove-from-group' | 'add-tag' | 'update-field';

interface WorkflowStep {
  id: string;
  type: 'action' | 'delay';
  actionType?: ActionType;
  config: any;
}

export function WorkflowWizard({ onNavigate, onComplete }: NavigationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Basic Details
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedSender, setSelectedSender] = useState('');
  
  // Step 2: Choose Trigger
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null);
  const [triggerConfig, setTriggerConfig] = useState<any>({});
  
  // Step 3: Build Sequence
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [configuringStepId, setConfiguringStepId] = useState<string | null>(null);
  
  // Step 4: Review
  const [workflowStatus, setWorkflowStatus] = useState<'draft' | 'active'>('draft');

  const steps = [
    { number: 1, title: 'Basic Details', icon: Zap },
    { number: 2, title: 'Choose Trigger', icon: Target },
    { number: 3, title: 'Build Sequence', icon: GitBranch },
    { number: 4, title: 'Review & Activate', icon: CheckCircle },
  ];

  const triggers = [
    {
      id: 'subscriber-join',
      icon: '👤',
      title: 'Subscriber Joins Group',
      description: 'Trigger when someone is added to a specific group',
      popular: true
    },
    {
      id: 'email-opened',
      icon: '📧',
      title: 'Email Opened',
      description: 'Trigger when a subscriber opens a specific email',
      popular: false
    },
    {
      id: 'link-clicked',
      icon: '🖱️',
      title: 'Link Clicked',
      description: 'Trigger when a subscriber clicks a link in an email',
      popular: false
    },
    {
      id: 'date-based',
      icon: '📅',
      title: 'Date Based',
      description: 'Trigger on a specific date or subscriber birthday',
      popular: true
    },
    {
      id: 'inactivity',
      icon: '💤',
      title: 'Inactivity Period',
      description: 'Trigger after subscriber has been inactive for X days',
      popular: false
    },
    {
      id: 'abandoned-cart',
      icon: '🛒',
      title: 'Abandoned Cart',
      description: 'Trigger when a subscriber leaves items in their cart',
      popular: true
    },
    {
      id: 'post-purchase',
      icon: '🛍️',
      title: 'Post-Purchase',
      description: 'Trigger after a subscriber makes a purchase',
      popular: true
    },
    {
      id: 'product-purchased',
      icon: '🎁',
      title: 'Product Purchased',
      description: 'Trigger when a specific product is purchased',
      popular: false
    },
    {
      id: 'form-submitted',
      icon: '📝',
      title: 'Form Submitted',
      description: 'Trigger when a subscriber submits a form',
      popular: false
    },
    {
      id: 'tag-added',
      icon: '🏷️',
      title: 'Tag Added',
      description: 'Trigger when a specific tag is added to a subscriber',
      popular: false
    },
    {
      id: 'page-visited',
      icon: '🌐',
      title: 'Page Visited',
      description: 'Trigger when a subscriber visits a specific page',
      popular: false
    },
    {
      id: 'api-webhook',
      icon: '🔗',
      title: 'API Webhook',
      description: 'Trigger based on an external API webhook',
      popular: false
    }
  ];

  const actionTypes = [
    {
      id: 'send-email',
      icon: '✉️',
      title: 'Send Email',
      description: 'Send a template email to subscriber',
      color: 'blue'
    },
    {
      id: 'add-to-group',
      icon: '➕',
      title: 'Add to Group',
      description: 'Add subscriber to a group',
      color: 'green'
    },
    {
      id: 'remove-from-group',
      icon: '➖',
      title: 'Remove from Group',
      description: 'Remove subscriber from a group',
      color: 'red'
    },
    {
      id: 'add-tag',
      icon: '🏷️',
      title: 'Add Tag',
      description: 'Tag the subscriber',
      color: 'purple'
    }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddStep = (type: 'action' | 'delay', actionType?: ActionType) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type,
      actionType,
      config: {}
    };
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    setWorkflowSteps(workflowSteps.filter(s => s.id !== stepId));
    if (configuringStepId === stepId) {
      setConfiguringStepId(null);
    }
  };

  const handleUpdateStepConfig = (stepId: string, config: any) => {
    setWorkflowSteps(workflowSteps.map(s => 
      s.id === stepId ? { ...s, config } : s
    ));
  };

  const getStepDisplayText = (step: WorkflowStep) => {
    if (step.type === 'delay') {
      return step.config.duration ? `${step.config.duration} ${step.config.unit || 'day'}${step.config.duration > 1 ? 's' : ''}` : 'Not configured';
    }
    
    if (step.actionType === 'send-email') {
      return step.config.template ? `Template: ${step.config.template}` : 'Not configured';
    }
    
    if (step.actionType === 'add-to-group' || step.actionType === 'remove-from-group') {
      return step.config.group ? `Group: ${step.config.group}` : 'Not configured';
    }
    
    if (step.actionType === 'add-tag') {
      return step.config.tag ? `Tag: ${step.config.tag}` : 'Not configured';
    }
    
    return 'Not configured';
  };

  const handleFinish = () => {
    // Save workflow and navigate back
    if (onComplete) {
      onComplete();
    } else {
      onNavigate('automation');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return workflowName.trim() !== '' && selectedSender.trim() !== '';
      case 2:
        return selectedTrigger !== null;
      case 3:
        return workflowSteps.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => onNavigate('automation')}>
              <ArrowLeft className="size-4 mr-2" />
              Back to Workflows
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Step {currentStep} of 4</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`size-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-500'
                          : isActive
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="size-6 text-white" />
                      ) : (
                        <Icon
                          className={`size-6 ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium mt-2 ${
                        isActive ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Let's Start with the Basics
              </h2>
              <p className="text-gray-600">
                Give your automation workflow a name and description
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="e.g., Welcome Series, Re-engagement Campaign"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Describe what this workflow does..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sender Email *
                </label>
                <select
                  value={selectedSender}
                  onChange={(e) => setSelectedSender(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select sender email...</option>
                  <option value="support@nconnect.com">Support Team - support@nconnect.com</option>
                  <option value="hello@nconnect.com">Hello - hello@nconnect.com</option>
                  <option value="marketing@nconnect.com">Marketing - marketing@nconnect.com</option>
                  <option value="john@company.com">John Doe - john@company.com</option>
                  <option value="sales@company.com">Sales Team - sales@company.com</option>
                </select>
                <p className="text-xs text-gray-600 mt-2">
                  All emails sent by this workflow will use this sender address
                </p>
              </div>

              {/* Examples */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Zap className="size-4" />
                  Popular Workflow Ideas
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Welcome Series:</strong> Automated onboarding emails for new subscribers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Re-engagement:</strong> Win back inactive subscribers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Birthday Campaign:</strong> Send personalized birthday wishes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Choose Trigger */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Trigger
              </h2>
              <p className="text-gray-600">
                Select what will start this automation workflow
              </p>
            </div>

            <div className="space-y-3">
              {triggers.map((trigger) => (
                <button
                  key={trigger.id}
                  onClick={() => setSelectedTrigger(trigger.id as TriggerType)}
                  className={`w-full text-left border-2 rounded-lg p-5 transition-all ${
                    selectedTrigger === trigger.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{trigger.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {trigger.title}
                        </h4>
                        {trigger.popular && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{trigger.description}</p>
                    </div>
                    {selectedTrigger === trigger.id && (
                      <CheckCircle className="size-6 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Trigger Configuration */}
            {selectedTrigger === 'subscriber-join' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Select Group
                  </label>
                  <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>Newsletter Subscribers</option>
                    <option>VIP Members</option>
                    <option>Product Updates</option>
                    <option>Weekly Digest</option>
                  </select>
                </div>
              </div>
            )}

            {selectedTrigger === 'date-based' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                      Date Type
                    </label>
                    <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option>Subscriber Birthday</option>
                      <option>Subscription Anniversary</option>
                      <option>Specific Date</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedTrigger === 'inactivity' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Inactive for (days)
                  </label>
                  <input
                    type="number"
                    defaultValue="30"
                    min="1"
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {selectedTrigger === 'abandoned-cart' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Wait time before triggering (hours)
                  </label>
                  <input
                    type="number"
                    defaultValue="2"
                    min="1"
                    max="72"
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-purple-700 mt-2">
                    Trigger workflow if cart remains abandoned for this duration
                  </p>
                </div>
              </div>
            )}

            {selectedTrigger === 'post-purchase' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                      Delay after purchase
                    </label>
                    <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option>Immediately</option>
                      <option>1 hour</option>
                      <option>1 day</option>
                      <option>3 days</option>
                      <option>7 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                      Purchase Type
                    </label>
                    <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option>Any Purchase</option>
                      <option>First Purchase</option>
                      <option>Repeat Purchase</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedTrigger === 'product-purchased' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Select Product
                  </label>
                  <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>Product A</option>
                    <option>Product B</option>
                    <option>Product C</option>
                  </select>
                </div>
              </div>
            )}

            {selectedTrigger === 'form-submitted' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Select Form
                  </label>
                  <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>Contact Form</option>
                    <option>Newsletter Signup</option>
                    <option>Lead Magnet Form</option>
                    <option>Survey Form</option>
                  </select>
                </div>
              </div>
            )}

            {selectedTrigger === 'tag-added' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Select Tag
                  </label>
                  <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>VIP</option>
                    <option>Interested</option>
                    <option>Hot Lead</option>
                    <option>Customer</option>
                  </select>
                </div>
              </div>
            )}

            {selectedTrigger === 'page-visited' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Page URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/pricing"
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-purple-700 mt-2">
                    Enter the URL of the page that triggers this workflow
                  </p>
                </div>
              </div>
            )}

            {selectedTrigger === 'api-webhook' && (
              <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Configure Trigger</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                      Webhook URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://api.nconnect.com/webhook/abc123"
                        className="flex-1 px-4 py-2 border border-purple-300 rounded-lg bg-white"
                      />
                      <Button variant="outline" size="sm" className="shrink-0">
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-purple-700 mt-2">
                      Send POST requests to this URL to trigger the workflow
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Build Sequence */}
        {currentStep === 3 && (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Build Your Sequence
                </h2>
                <p className="text-gray-600">
                  Add actions and delays to create your automation flow
                </p>
              </div>

              {/* Available Actions */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Add Actions:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {actionTypes.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleAddStep('action', action.id as ActionType)}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{action.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">
                            {action.title}
                          </div>
                          <div className="text-xs text-gray-600">{action.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => handleAddStep('delay')}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 hover:bg-green-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">⏰</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 group-hover:text-green-600 text-sm">
                          Add Delay
                        </div>
                        <div className="text-xs text-gray-600">Wait before next action</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Workflow Sequence Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h4 className="font-semibold text-gray-900 mb-4">Your Workflow Sequence:</h4>
              
              {workflowSteps.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Zap className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No actions added yet</p>
                  <p className="text-sm text-gray-500 mt-1">Click on the actions above to build your sequence</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Trigger Display */}
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <div className="font-semibold text-purple-900">TRIGGER</div>
                        <div className="text-sm text-purple-700">
                          {selectedTrigger === 'subscriber-join' && 'Subscriber Joins Group'}
                          {selectedTrigger === 'date-based' && 'Date Based'}
                          {selectedTrigger === 'inactivity' && 'Inactivity Period'}
                          {selectedTrigger === 'email-opened' && 'Email Opened'}
                          {selectedTrigger === 'link-clicked' && 'Link Clicked'}
                          {selectedTrigger === 'abandoned-cart' && 'Abandoned Cart'}
                          {selectedTrigger === 'post-purchase' && 'Post-Purchase'}
                          {selectedTrigger === 'product-purchased' && 'Product Purchased'}
                          {selectedTrigger === 'form-submitted' && 'Form Submitted'}
                          {selectedTrigger === 'tag-added' && 'Tag Added'}
                          {selectedTrigger === 'page-visited' && 'Page Visited'}
                          {selectedTrigger === 'api-webhook' && 'API Webhook'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-gray-300" />
                  </div>

                  {/* Steps */}
                  {workflowSteps.map((step, index) => (
                    <div key={step.id}>
                      <div className={`border-2 rounded-lg p-4 ${
                        step.type === 'delay' 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-blue-50 border-blue-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-2xl">
                              {step.type === 'delay' ? '⏰' : 
                               step.actionType === 'send-email' ? '✉️' :
                               step.actionType === 'add-to-group' ? '➕' :
                               step.actionType === 'remove-from-group' ? '➖' :
                               step.actionType === 'add-tag' ? '🏷️' : '⚙️'}
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold ${
                                step.type === 'delay' ? 'text-green-900' : 'text-blue-900'
                              }`}>
                                {step.type === 'delay' ? 'WAIT' : 
                                 step.actionType === 'send-email' ? 'SEND EMAIL' :
                                 step.actionType === 'add-to-group' ? 'ADD TO GROUP' :
                                 step.actionType === 'remove-from-group' ? 'REMOVE FROM GROUP' :
                                 step.actionType === 'add-tag' ? 'ADD TAG' : 'ACTION'}
                              </div>
                              <div className={`text-sm ${
                                step.type === 'delay' ? 'text-green-700' : 'text-blue-700'
                              }`}>
                                {getStepDisplayText(step)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfiguringStepId(step.id)}
                              className={step.type === 'delay' ? 'border-green-600 text-green-700 hover:bg-green-100' : 'border-blue-600 text-blue-700 hover:bg-blue-100'}
                            >
                              <SettingsIcon className="size-3.5 mr-1" />
                              Configure
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStep(step.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>

                      {index < workflowSteps.length - 1 && (
                        <div className="flex justify-center">
                          <div className="w-px h-6 bg-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Configuration Modal */}
            {configuringStepId && (() => {
              const step = workflowSteps.find(s => s.id === configuringStepId);
              if (!step) return null;

              return (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Configure {step.type === 'delay' ? 'Delay' : 
                          step.actionType === 'send-email' ? 'Email Action' :
                          step.actionType === 'add-to-group' ? 'Add to Group' :
                          step.actionType === 'remove-from-group' ? 'Remove from Group' :
                          step.actionType === 'add-tag' ? 'Add Tag' : 'Action'}
                      </h3>
                      <p className="text-sm text-gray-600">Set up the details for this step</p>
                    </div>

                    {/* Delay Configuration */}
                    {step.type === 'delay' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              defaultValue={step.config.duration || 1}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              onChange={(e) => {
                                handleUpdateStepConfig(step.id, {
                                  ...step.config,
                                  duration: parseInt(e.target.value)
                                });
                              }}
                            />
                            <select
                              defaultValue={step.config.unit || 'day'}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              onChange={(e) => {
                                handleUpdateStepConfig(step.id, {
                                  ...step.config,
                                  unit: e.target.value
                                });
                              }}
                            >
                              <option value="hour">Hours</option>
                              <option value="day">Days</option>
                              <option value="week">Weeks</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Send Email Configuration */}
                    {step.actionType === 'send-email' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Email Template
                          </label>
                          <select
                            defaultValue={step.config.template || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              handleUpdateStepConfig(step.id, {
                                ...step.config,
                                template: e.target.value
                              });
                            }}
                          >
                            <option value="">Select a template...</option>
                            <option value="Welcome Email">Welcome Email</option>
                            <option value="Product Update">Product Update</option>
                            <option value="Newsletter">Newsletter</option>
                            <option value="Promotional">Promotional Offer</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Add to Group Configuration */}
                    {step.actionType === 'add-to-group' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Group
                          </label>
                          <select
                            defaultValue={step.config.group || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              handleUpdateStepConfig(step.id, {
                                ...step.config,
                                group: e.target.value
                              });
                            }}
                          >
                            <option value="">Select a group...</option>
                            <option value="Newsletter Subscribers">Newsletter Subscribers</option>
                            <option value="VIP Members">VIP Members</option>
                            <option value="Product Updates">Product Updates</option>
                            <option value="Engaged Users">Engaged Users</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Remove from Group Configuration */}
                    {step.actionType === 'remove-from-group' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Group
                          </label>
                          <select
                            defaultValue={step.config.group || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              handleUpdateStepConfig(step.id, {
                                ...step.config,
                                group: e.target.value
                              });
                            }}
                          >
                            <option value="">Select a group...</option>
                            <option value="Newsletter Subscribers">Newsletter Subscribers</option>
                            <option value="VIP Members">VIP Members</option>
                            <option value="Product Updates">Product Updates</option>
                            <option value="Trial Users">Trial Users</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Add Tag Configuration */}
                    {step.actionType === 'add-tag' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tag Name
                          </label>
                          <select
                            defaultValue={step.config.tag || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              handleUpdateStepConfig(step.id, {
                                ...step.config,
                                tag: e.target.value
                              });
                            }}
                          >
                            <option value="">Select a tag...</option>
                            <option value="Engaged">Engaged</option>
                            <option value="VIP">VIP</option>
                            <option value="Interested">Interested</option>
                            <option value="Customer">Customer</option>
                            <option value="Lead">Lead</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Modal Actions */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setConfiguringStepId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setConfiguringStepId(null)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Step 4: Review & Activate */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Review Your Workflow
              </h2>
              <p className="text-gray-600">
                Review your automation and choose to save as draft or activate
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              {/* Basic Details */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="size-5 text-blue-600" />
                  Workflow Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">{workflowName}</span>
                  </div>
                  {workflowDescription && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-semibold text-gray-900">{workflowDescription}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sender Email:</span>
                    <span className="font-semibold text-gray-900">{selectedSender || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Steps:</span>
                    <span className="font-semibold text-gray-900">{workflowSteps.length + 1}</span>
                  </div>
                </div>
              </div>

              {/* Trigger */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="size-5 text-purple-600" />
                  Trigger
                </h4>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <div className="font-semibold text-purple-900">
                        {selectedTrigger === 'subscriber-join' && 'Subscriber Joins Group'}
                        {selectedTrigger === 'date-based' && 'Date Based Trigger'}
                        {selectedTrigger === 'inactivity' && 'Inactivity Period'}
                        {selectedTrigger === 'email-opened' && 'Email Opened'}
                        {selectedTrigger === 'link-clicked' && 'Link Clicked'}
                        {selectedTrigger === 'abandoned-cart' && 'Abandoned Cart'}
                        {selectedTrigger === 'post-purchase' && 'Post-Purchase'}
                        {selectedTrigger === 'product-purchased' && 'Product Purchased'}
                        {selectedTrigger === 'form-submitted' && 'Form Submitted'}
                        {selectedTrigger === 'tag-added' && 'Tag Added'}
                        {selectedTrigger === 'page-visited' && 'Page Visited'}
                        {selectedTrigger === 'api-webhook' && 'API Webhook'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GitBranch className="size-5 text-blue-600" />
                  Action Sequence
                </h4>
                <div className="space-y-3">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className={`border rounded-lg p-3 ${
                      step.type === 'delay' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-500">
                          {index + 1}.
                        </span>
                        <div className="text-xl">
                          {step.type === 'delay' ? '⏰' : 
                           step.actionType === 'send-email' ? '✉️' :
                           step.actionType === 'add-to-group' ? '➕' :
                           step.actionType === 'remove-from-group' ? '➖' :
                           step.actionType === 'add-tag' ? '🏷️' : '⚙️'}
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${
                            step.type === 'delay' ? 'text-green-900' : 'text-blue-900'
                          }`}>
                            {step.type === 'delay' ? getStepDisplayText(step) : 
                             step.actionType === 'send-email' ? 'Send Email' :
                             step.actionType === 'add-to-group' ? 'Add to Group' :
                             step.actionType === 'remove-from-group' ? 'Remove from Group' :
                             step.actionType === 'add-tag' ? 'Add Tag' : 'Action'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Selection */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Workflow Status</h4>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    workflowStatus === 'draft' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={workflowStatus === 'draft'}
                      onChange={(e) => setWorkflowStatus('draft')}
                      className="mt-0.5 accent-green-600"
                    />
                    <div>
                      <div className={`font-semibold ${workflowStatus === 'draft' ? 'text-green-900' : 'text-gray-900'}`}>Save as Draft</div>
                      <div className={`text-sm ${workflowStatus === 'draft' ? 'text-green-700' : 'text-gray-600'}`}>
                        Save and continue editing later. Workflow will not run.
                      </div>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    workflowStatus === 'active' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={workflowStatus === 'active'}
                      onChange={(e) => setWorkflowStatus('active')}
                      className="mt-0.5 accent-green-600"
                    />
                    <div>
                      <div className={`font-semibold ${workflowStatus === 'active' ? 'text-green-900' : 'text-gray-900'}`}>Activate Now</div>
                      <div className={`text-sm ${workflowStatus === 'active' ? 'text-green-700' : 'text-gray-600'}`}>
                        Workflow will start running immediately for new triggers.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue
              <ArrowRight className="size-4 ml-2" />
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleFinish}
              >
                <Save className="size-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handleFinish}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="size-4 mr-2" />
                {workflowStatus === 'active' ? 'Activate Workflow' : 'Finish'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}