import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface DevNavigationProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'landing', name: 'Landing Page', completed: true },
  { id: 'welcome', name: 'Welcome Screen', completed: true },
  { id: 'signin', name: 'Sign In', completed: true },
  { id: 'signup', name: 'Sign Up', completed: true },
  { id: 'verify-email', name: 'OTP Verification', completed: true },
  { id: 'onboarding', name: 'Onboarding (4 Steps)', completed: true },
  { id: 'dashboard', name: 'Dashboard', completed: true },
  { id: 'contacts', name: 'Contacts Module', completed: true },
  { id: 'groups', name: 'Groups Module', completed: true },
  { id: 'templates', name: 'Templates Module', completed: true },
  { id: 'media', name: 'Media Library', completed: true },
  { id: 'campaigns', name: 'Campaigns Module', completed: true },
  { id: 'automation', name: 'Automation Workflows', completed: true },
  { id: 'sender-emails', name: 'Sender Emails', completed: true },
  { id: 'reports', name: 'Reports & Analytics', completed: true },
  { id: 'users', name: 'User Management', completed: true },
  { id: 'workspaces', name: 'Workspaces Module', completed: true },
  { id: 'settings', name: 'Settings Module', completed: true },
  { id: 'documentation', name: 'Documentation', completed: true },
];

export function DevNavigation({ currentModule, onModuleChange }: DevNavigationProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        size="sm"
      >
        {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        <span className="ml-2">Dev Nav</span>
      </Button>

      {/* Navigation Panel */}
      {isOpen && (
        <div className="fixed top-16 left-4 z-40 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[80vh] overflow-hidden transition-all">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 border-b border-gray-200 bg-purple-50 hover:bg-purple-100 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-purple-900">NConnect Dev Navigation</h2>
                <p className="text-xs text-purple-700 mt-1">Module Switcher</p>
              </div>
              {isExpanded ? (
                <ChevronUp className="size-5 text-purple-900 flex-shrink-0" />
              ) : (
                <ChevronDown className="size-5 text-purple-900 flex-shrink-0" />
              )}
            </div>
          </button>
          
          {isExpanded && (
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              <div className="p-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => onModuleChange(module.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md mb-1 transition-all ${
                      currentModule === module.id
                        ? 'bg-purple-100 text-purple-900 font-semibold border-l-4 border-purple-600'
                        : 'hover:bg-gray-100 text-gray-700'
                    } ${!module.completed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!module.completed}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{module.name}</span>
                      {module.completed && currentModule === module.id && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Active</span>
                      )}
                      {!module.completed && (
                        <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
                <p className="text-xs text-gray-600">
                  <strong>Phase 1:</strong> Authentication Module
                </p>
                <button
                  onClick={() => window.location.href = '/ops'}
                  className="w-full py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-fuchsia-500 hover:to-indigo-500 active:scale-95 transition-all text-center mt-1 cursor-pointer"
                >
                  👑 Go to Operations Cockpit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}