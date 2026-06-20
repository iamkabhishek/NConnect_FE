import { useState } from 'react';
import {
  X,
  UserPlus,
  Shield,
  Crown,
  Mail,
  AlertCircle,
  ChevronRight,
  Phone,
  MapPin,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Copy,
  Send,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ModulePermission {
  module: string;
  fullAccess: boolean;
  creator: boolean;
  editor: boolean;
  viewer: boolean;
}

interface InviteMemberModalProps {
  workspaces?: Array<{ id: string; name: string; color: string }>;
  onClose: () => void;
  onInvite: (memberData: any, permissions: ModulePermission[]) => void;
}

const defaultPermissions: ModulePermission[] = [
  { module: 'Contacts', fullAccess: false, creator: false, editor: false, viewer: false },
  { module: 'Groups', fullAccess: false, creator: false, editor: false, viewer: false },
  { module: 'Subscribers', fullAccess: false, creator: false, editor: false, viewer: false },
  { module: 'Templates', fullAccess: false, creator: false, editor: false, viewer: false },
  { module: 'Media Library', fullAccess: false, creator: false, editor: false, viewer: false },
  { module: 'Campaigns', fullAccess: false, creator: false, editor: false, viewer: false },
  { module: 'Automation Workflow', fullAccess: false, creator: false, editor: false, viewer: false },
  { module: 'Sender Emails', fullAccess: false, creator: false, editor: false, viewer: false },
];

export function InviteMemberModal({ workspaces, onClose, onInvite }: InviteMemberModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  
  // Step 1: Basic Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  
  // Step 2: Job Details
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  
  // Step 3: Permissions
  const [roleType, setRoleType] = useState<'Full Access' | 'Custom'>('Custom');
  const [permissions, setPermissions] = useState<ModulePermission[]>(defaultPermissions);

  const isStep1Valid = firstName.trim() && lastName.trim() && email.trim();

  const handlePermissionChange = (
    index: number,
    field: keyof ModulePermission,
    value: boolean,
    isInvite: boolean
  ) => {
    const newPermissions = [...permissions];
    if (field === 'fullAccess' && value) {
      // If Full Access is checked, check all other permissions
      newPermissions[index] = {
        ...newPermissions[index],
        fullAccess: true,
        creator: true,
        editor: true,
        viewer: true,
      };
    } else if (field === 'fullAccess' && !value) {
      // If Full Access is unchecked, uncheck all permissions
      newPermissions[index] = {
        ...newPermissions[index],
        fullAccess: false,
        creator: false,
        editor: false,
        viewer: false,
      };
    } else {
      newPermissions[index] = {
        ...newPermissions[index],
        [field]: value,
      };
    }
    setPermissions(newPermissions);
  };

  const handleSubmit = () => {
    // Generate unique User ID with workspace prefix
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const userId = `WS-${timestamp.toString().slice(-6)}-USER-${randomNum}`;
    setGeneratedUserId(userId);
    
    const memberData = {
      userId,
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      department,
      location,
      roleType,
    };
    
    const finalPermissions = roleType === 'Full Access' 
      ? defaultPermissions.map(p => ({ ...p, fullAccess: true, creator: true, editor: true, viewer: true }))
      : permissions;
    
    // Show success card first, don't call onInvite yet
    setShowSuccessCard(true);
    
    // Store data to send when user clicks Done
    window.pendingMemberData = { memberData, finalPermissions };
  };

  const generateCredentialsText = () => {
    return `
═══════════════════════════════════
🎉 NEW TEAM MEMBER CREDENTIALS
═══════════════════════════════════

User Profile Created Successfully!

👤 MEMBER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${firstName} ${lastName}
User ID: ${generatedUserId}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}${jobTitle ? `Job Title: ${jobTitle}\n` : ''}${department ? `Department: ${department}\n` : ''}${location ? `Location: ${location}\n` : ''}
🔐 LOGIN METHOD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Method: Secure Passwordless OTP
Email: ${email}

🔑 ACCESS LEVEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: ${roleType}

📝 INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Use your email to securely log in via OTP
2. Access the workspace dashboard
3. Complete your profile setup
4. Start collaborating with your team!

═══════════════════════════════════
Generated on: ${new Date().toLocaleString()}
═══════════════════════════════════
    `.trim();
  };

  const handleCopyText = () => {
    const text = generateCredentialsText();
    
    // Fallback method for clipboard API
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedText(true);
          setTimeout(() => setCopiedText(false), 2000);
        }).catch(() => {
          // Fallback to older method
          fallbackCopyText(text);
        });
      } else {
        // Use fallback method
        fallbackCopyText(text);
      }
    } catch (err) {
      // Use fallback method
      fallbackCopyText(text);
    }
  };

  const fallbackCopyText = (text: string) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.focus();
    textarea.select();
    
    try {
      document.execCommand('copy');
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
    
    // Remove the temporary textarea
    document.body.removeChild(textarea);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Welcome to NConnect - Your Login Credentials');
    const body = encodeURIComponent(generateCredentialsText());
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleDone = () => {
    const { memberData, finalPermissions } = window.pendingMemberData;
    onInvite(memberData, finalPermissions);
    setShowSuccessCard(false);
    onClose();
  };

  if (showSuccessCard) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="size-8" />
              <h2 className="text-2xl font-bold">Profile Created Successfully!</h2>
            </div>
            <p className="text-green-50">
              Team member has been added to the workspace. Share the credentials below.
            </p>
          </div>

          {/* Credentials Card */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
              {/* User ID */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="size-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">User ID</h3>
                </div>
                <div className="bg-white border border-blue-300 rounded-lg px-4 py-3">
                  <code className="text-blue-600 font-mono text-lg font-semibold">
                    {generatedUserId}
                  </code>
                </div>
              </div>

              {/* Member Information */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="size-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Member Information</h3>
                </div>
                <div className="bg-white border border-blue-300 rounded-lg px-4 py-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">{firstName} {lastName}</span>
                    
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900">{email}</span>
                    
                    {phone && (
                      <>
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-semibold text-gray-900">{phone}</span>
                      </>
                    )}
                    
                    {jobTitle && (
                      <>
                        <span className="text-gray-600">Job Title:</span>
                        <span className="font-semibold text-gray-900">{jobTitle}</span>
                      </>
                    )}
                    
                    {department && (
                      <>
                        <span className="text-gray-600">Department:</span>
                        <span className="font-semibold text-gray-900">{department}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="size-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Login Credentials</h3>
                </div>
                <div className="bg-white border border-blue-300 rounded-lg px-4 py-3 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <div className="font-mono text-sm font-semibold text-gray-900">{email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Auth Method</label>
                    <div className="text-sm font-semibold text-gray-900">Secure Passwordless OTP</div>
                  </div>
                </div>
              </div>

              {/* Access Level */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="size-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Access Level</h3>
                </div>
                <div className="bg-white border border-blue-300 rounded-lg px-4 py-3">
                  <span className="font-semibold text-gray-900">{roleType}</span>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Important: Share Credentials Securely
                  </p>
                  <p className="text-sm text-gray-700">
                    These credentials provide access to your workspace. Share them through secure channels only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <Button
              onClick={handleShareEmail}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="size-4 mr-2" />
              Share via Email
            </Button>
            <Button
              onClick={handleCopyText}
              variant="outline"
              className="flex-1"
            >
              <Copy className="size-4 mr-2" />
              {copiedText ? 'Copied!' : 'Copy as Text'}
            </Button>
            <Button
              onClick={handleDone}
              variant="outline"
              className="px-6"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Invite Team Member</h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {currentStep} of 3: {currentStep === 1 ? 'Basic Information' : currentStep === 2 ? 'Job Details' : 'Permissions & Access'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>



              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Mail className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      After creating the member profile, an invitation email will be sent to this address with login credentials and instructions to access the workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Marketing Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Marketing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York, USA"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      Job information helps organize your team and can be updated later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Permissions & Access */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Access Level <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      roleType === 'Full Access'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="roleType"
                      value="Full Access"
                      checked={roleType === 'Full Access'}
                      onChange={(e) =>
                        setRoleType(e.target.value as 'Full Access' | 'Custom')
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="size-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">Full Access (Admin)</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Complete access to all modules including User Management, Workspace Management, and Reports & Analytics
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      roleType === 'Custom'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="roleType"
                      value="Custom"
                      checked={roleType === 'Custom'}
                      onChange={(e) =>
                        setRoleType(e.target.value as 'Full Access' | 'Custom')
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="size-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Custom Permissions</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Define specific permissions for each module with granular control
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {roleType === 'Custom' && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-gray-900">Module Permissions</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Select access level for each module
                    </p>
                  </div>
                  <div className="divide-y">
                    <div className="px-4 py-2 bg-gray-100 grid grid-cols-5 gap-4 text-xs font-semibold text-gray-700">
                      <div>Module</div>
                      <div className="text-center">Full Access</div>
                      <div className="text-center">Creator</div>
                      <div className="text-center">Editor</div>
                      <div className="text-center">Viewer</div>
                    </div>
                    {permissions.map((permission, index) => (
                      <div
                        key={permission.module}
                        className="px-4 py-3 grid grid-cols-5 gap-4 items-center hover:bg-gray-50"
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {permission.module}
                        </div>
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={permission.fullAccess}
                            onChange={(e) =>
                              handlePermissionChange(
                                index,
                                'fullAccess',
                                e.target.checked,
                                true
                              )
                            }
                            className="size-4 text-blue-600 rounded"
                          />
                        </div>
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={permission.creator}
                            onChange={(e) =>
                              handlePermissionChange(index, 'creator', e.target.checked, true)
                            }
                            disabled={permission.fullAccess}
                            className="size-4 text-blue-600 rounded disabled:opacity-50"
                          />
                        </div>
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={permission.editor}
                            onChange={(e) =>
                              handlePermissionChange(index, 'editor', e.target.checked, true)
                            }
                            disabled={permission.fullAccess}
                            className="size-4 text-blue-600 rounded disabled:opacity-50"
                          />
                        </div>
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={permission.viewer}
                            onChange={(e) =>
                              handlePermissionChange(index, 'viewer', e.target.checked, true)
                            }
                            disabled={permission.fullAccess}
                            className="size-4 text-blue-600 rounded disabled:opacity-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Shield className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-semibold">Permission Levels Explained:</p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        <strong>Full Access:</strong> Complete control over the module
                      </li>
                      <li>
                        <strong>Creator:</strong> Can create new items and edit own items
                      </li>
                      <li>
                        <strong>Editor:</strong> Can edit existing items (but not create new)
                      </li>
                      <li>
                        <strong>Viewer:</strong> Read-only access to view items
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {roleType === 'Custom' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Admin-Only Modules
                      </p>
                      <p className="text-sm text-gray-700">
                        User Management, Workspace Management, and Reports & Analytics are only available to Full Access (Admin) users.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6"
            >
              Back
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <div className="flex-1"></div>
          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-blue-600 hover:bg-blue-700 px-6"
              disabled={currentStep === 1 && !isStep1Valid}
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 px-6"
              disabled={!isStep1Valid}
            >
              <UserPlus className="size-4 mr-2" />
              Send Invite
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}