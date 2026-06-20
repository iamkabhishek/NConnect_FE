import { useState } from 'react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Briefcase,
  Plus,
  Search,
  Check,
  Settings,
  Users,
  MoreVertical,
  Trash2,
  Edit2,
  Crown,
  Eye,
} from 'lucide-react';
import { CreateWorkspaceMultiStep, CompleteWorkspaceData } from './CreateWorkspaceMultiStep';
import { EditWorkspaceModal } from './EditWorkspaceModal';
import { WorkspaceManagementModal } from './WorkspaceManagementModal';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

// Utility function to generate workspace ID
const generateWorkspaceId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'WS-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

interface Workspace {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  color: string;
  logo?: string;
  logoShape?: 'square' | 'circular';
  role: 'owner' | 'admin' | 'member';
  members: number;
  campaigns: number;
  contacts: number;
  createdAt: string;
  isCurrent: boolean;
}

interface WorkspacesPageProps {
  onNavigate?: (page: string) => void;
  onSwitchWorkspace?: (workspaceId: string) => void;
}

export function WorkspacesPage({ onNavigate, onSwitchWorkspace }: WorkspacesPageProps) {
  const { currentUser, selectedWorkspace, setSelectedWorkspace, addWorkspace } = useWorkspace();
  const userName = currentUser?.name || 'John Doe';
  const workspaceName = selectedWorkspace?.name || 'My Workspace';
  const workspaceColor = selectedWorkspace?.color || '#4A90E2';
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editWorkspaceId, setEditWorkspaceId] = useState<string | null>(null);
  const [manageWorkspaceId, setManageWorkspaceId] = useState<string | null>(null);

  // Workspaces data aligned with global WorkspaceContext
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'workspace-1',
      workspaceId: 'WS-123456',
      name: 'My Business Newsletter',
      category: 'Marketing',
      color: '#8B5CF6',
      role: 'owner',
      members: 5,
      campaigns: 24,
      contacts: 3420,
      createdAt: '2024-01-15',
      isCurrent: true,
    },
    {
      id: 'workspace-2',
      workspaceId: 'WS-654321',
      name: 'Marketing Team',
      category: 'Marketing',
      color: '#EC4899',
      role: 'admin',
      members: 3,
      campaigns: 12,
      contacts: 1250,
      createdAt: '2024-02-20',
      isCurrent: false,
    },
    {
      id: 'workspace-3',
      workspaceId: 'WS-111111',
      name: 'Product Updates',
      category: 'Marketing',
      color: '#3B82F6',
      role: 'member',
      members: 3,
      campaigns: 8,
      contacts: 560,
      createdAt: '2024-03-10',
      isCurrent: false,
    },
    {
      id: 'workspace-4',
      workspaceId: 'WS-222222',
      name: 'E-commerce Store',
      category: 'Marketing',
      color: '#EF4444',
      role: 'member',
      members: 8,
      campaigns: 45,
      contacts: 8920,
      createdAt: '2024-10-15',
      isCurrent: false,
    },
  ]);

  // Dynamically map role and active workspace matching user persona session context
  const mappedWorkspaces = workspaces.map(ws => {
    let computedRole: 'owner' | 'admin' | 'member' = 'member';
    if (currentUser.role === 'owner') {
      computedRole = 'owner';
    } else if (currentUser.role === 'workspace_admin') {
      if (ws.id === 'workspace-2') {
        computedRole = 'admin';
      } else {
        computedRole = 'member';
      }
    } else if (currentUser.role === 'workspace_member') {
      computedRole = 'member';
    }

    return {
      ...ws,
      role: computedRole,
      isCurrent: selectedWorkspace ? selectedWorkspace.id === ws.id : ws.isCurrent,
    };
  });

  // Create workspace form state
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    color: '#4A90E2',
  });

  const colorOptions = [
    '#4A90E2', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  const filteredWorkspaces = mappedWorkspaces.filter((workspace) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Search across multiple attributes
    return (
      // Workspace Name
      workspace.name.toLowerCase().includes(query) ||
      // Workspace ID
      workspace.workspaceId.toLowerCase().includes(query) ||
      // Category
      workspace.category.toLowerCase().includes(query) ||
      // Role
      workspace.role.toLowerCase().includes(query) ||
      // Created Date (formatted)
      new Date(workspace.createdAt).toLocaleDateString().toLowerCase().includes(query) ||
      // Members count (as string)
      workspace.members.toString().includes(query) ||
      // Campaigns count (as string)
      workspace.campaigns.toString().includes(query) ||
      // Contacts count (as string)
      workspace.contacts.toString().includes(query)
    );
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) return;

    const workspace: Workspace = {
      id: `workspace-${workspaces.length + 1}`,
      workspaceId: generateWorkspaceId(),
      name: newWorkspace.name,
      category: 'Marketing',
      color: newWorkspace.color,
      role: currentUser.role === 'owner' ? 'owner' : 'admin',
      members: 1,
      campaigns: 0,
      contacts: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isCurrent: false,
    };

    setWorkspaces([...workspaces, workspace]);

    // Add to global context
    addWorkspace({
      id: workspace.id,
      name: workspace.name,
      color: workspace.color,
      createdAt: workspace.createdAt,
      memberCount: workspace.members,
    });

    setShowCreateModal(false);
    setNewWorkspace({ name: '', color: '#4A90E2' });
  };

  const handleWorkspaceCreated = (workspaceData: CompleteWorkspaceData) => {
    const workspace: Workspace = {
      id: `workspace-${workspaces.length + 1}`,
      workspaceId: workspaceData.workspace.workspaceId,
      name: workspaceData.workspace.name,
      category: workspaceData.workspace.category,
      color: workspaceData.branding?.primaryColor || workspaceData.workspace.color,
      logo: workspaceData.branding?.logo,
      logoShape: workspaceData.branding?.logoShape || 'square',
      role: currentUser.role === 'owner' ? 'owner' : 'admin',
      members: 1,
      campaigns: 0,
      contacts: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isCurrent: false,
    };

    setWorkspaces([...workspaces, workspace]);

    // Add to global context
    addWorkspace({
      id: workspace.id,
      name: workspace.name,
      color: workspace.color,
      createdAt: workspace.createdAt,
      memberCount: workspace.members,
    });

    console.log('Workspace created with data:', workspaceData);
  };

  const handleSwitchWorkspace = (workspaceId: string) => {
    const ws = workspaces.find(w => w.id === workspaceId);
    if (ws) {
      setSelectedWorkspace({
        id: ws.id,
        name: ws.name,
        color: ws.color,
        createdAt: ws.createdAt,
        memberCount: ws.members,
      });
    }

    setWorkspaces(
      workspaces.map((ws) => ({
        ...ws,
        isCurrent: ws.id === workspaceId,
      }))
    );
    onSwitchWorkspace?.(workspaceId);
  };

  const handleDeleteWorkspace = (workspaceId: string) => {
    if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      setWorkspaces(workspaces.filter((ws) => ws.id !== workspaceId));
      setActiveDropdown(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-purple-100 text-purple-700 border-purple-200',
      admin: 'bg-blue-100 text-blue-700 border-blue-200',
      member: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const icons = {
      owner: <Crown className="size-3" />,
      admin: <Settings className="size-3" />,
      member: <Users className="size-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${
          styles[role as keyof typeof styles]
        }`}
      >
        {icons[role as keyof typeof icons]}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar activeItem="workspaces" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          workspaceName={workspaceName}
          workspaceColor={workspaceColor}
          onCreateWorkspaceClick={() => setShowCreateModal(true)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="size-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
                </div>
                <p className="text-gray-600">
                  Manage and switch between your workspaces
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-4 mr-2" />
                Create Workspace
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search by name, ID, category, role, or stats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Workspaces Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={`bg-white border-2 rounded-lg p-6 transition-all hover:shadow-md ${
                    workspace.isCurrent
                      ? 'border-blue-500 ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Workspace Icon */}
                      <div
                        className={`w-12 h-12 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden ${
                          workspace.logo 
                            ? workspace.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'
                            : 'rounded-lg'
                        }`}
                        style={{ backgroundColor: workspace.logo ? 'transparent' : workspace.color }}
                      >
                        {workspace.logo ? (
                          <img 
                            src={workspace.logo} 
                            alt={`${workspace.name} logo`}
                            className={`w-full h-full ${
                              workspace.logoShape === 'circular' ? 'object-cover' : 'object-contain p-1'
                            }`}
                          />
                        ) : (
                          workspace.name.charAt(0)
                        )}
                      </div>

                      {/* Workspace Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {workspace.name}
                          </h3>
                          {workspace.isCurrent && (
                            <Check className="size-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-mono text-gray-500 mb-2">
                          {workspace.workspaceId}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          {getRoleBadge(workspace.role)}
                        </div>
                        <p className="text-xs text-gray-500">
                          Created {new Date(workspace.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === workspace.id ? null : workspace.id)
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="size-5 text-gray-600" />
                      </button>

                      {activeDropdown === workspace.id && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />

                          {/* Dropdown Menu */}
                          <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <button
                              onClick={() => {
                                setManageWorkspaceId(workspace.id);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                            >
                              <Eye className="size-4" />
                              Edit Workspace
                            </button>
                            <button
                              onClick={() => {
                                setManageWorkspaceId(workspace.id);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Settings className="size-4" />
                              Manage Workspace
                            </button>
                            {workspace.role === 'owner' && !workspace.isCurrent && (
                              <button
                                onClick={() => handleDeleteWorkspace(workspace.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg border-t"
                              >
                                <Trash2 className="size-4" />
                                Delete Workspace
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Members</p>
                      <p className="text-lg font-semibold text-gray-900">{workspace.members}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Campaigns</p>
                      <p className="text-lg font-semibold text-gray-900">{workspace.campaigns}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Contacts</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {workspace.contacts.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {workspace.isCurrent ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-center">
                      <p className="text-sm font-medium text-blue-700">Current Workspace</p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSwitchWorkspace(workspace.id)}
                      variant="outline"
                      className="w-full"
                    >
                      Switch to this workspace
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredWorkspaces.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="size-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No workspaces found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create your first workspace to get started'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="size-4 mr-2" />
                    Create Workspace
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <CreateWorkspaceMultiStep
          onClose={() => setShowCreateModal(false)}
          onWorkspaceCreated={handleWorkspaceCreated}
        />
      )}

      {/* Edit Workspace Modal */}
      {editWorkspaceId && (() => {
        const workspaceToEdit = workspaces.find(ws => ws.id === editWorkspaceId);
        if (!workspaceToEdit) return null;
        
        return (
          <EditWorkspaceModal
            workspace={{
              workspaceId: workspaceToEdit.workspaceId,
              name: workspaceToEdit.name,
              logo: workspaceToEdit.logo,
              logoShape: workspaceToEdit.logoShape,
              category: workspaceToEdit.category,
              color: workspaceToEdit.color,
            }}
            onClose={() => setEditWorkspaceId(null)}
            onSave={(updatedData) => {
              setWorkspaces(
                workspaces.map((ws) =>
                  ws.id === editWorkspaceId 
                    ? { 
                        ...ws, 
                        name: updatedData.name,
                        logo: updatedData.logo,
                        logoShape: updatedData.logoShape,
                        category: updatedData.category,
                        color: updatedData.color,
                      } 
                    : ws
                )
              );
              setEditWorkspaceId(null);
            }}
          />
        );
      })()}

      {/* Manage Workspace Modal */}
      {manageWorkspaceId && (() => {
        const workspaceToManage = workspaces.find(ws => ws.id === manageWorkspaceId);
        if (!workspaceToManage) return null;
        
        return (
          <WorkspaceManagementModal
            workspace={workspaceToManage}
            onClose={() => setManageWorkspaceId(null)}
            onUpdate={(updatedData) => {
              setWorkspaces(
                workspaces.map((ws) =>
                  ws.id === manageWorkspaceId 
                    ? { ...ws, ...updatedData } 
                    : ws
                )
              );
            }}
          />
        );
      })()}
    </div>
  );
}