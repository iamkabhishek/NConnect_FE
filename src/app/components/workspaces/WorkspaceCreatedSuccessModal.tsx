import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface WorkspaceCreatedSuccessModalProps {
  onClose: () => void;
  workspaceName: string;
}

export function WorkspaceCreatedSuccessModal({ onClose, workspaceName }: WorkspaceCreatedSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="size-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Workspace Created Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Your workspace <strong>"{workspaceName}"</strong> has been created and is ready to use.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You can now start creating campaigns, managing contacts, and sending newsletters.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              View Workspace Settings
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border-t border-blue-100 p-6 rounded-b-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Import or create contacts</li>
            <li>• Set up your email sender profiles</li>
            <li>• Design your first newsletter template</li>
            <li>• Invite team members to collaborate</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
