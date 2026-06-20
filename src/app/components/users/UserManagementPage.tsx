import { useState, useEffect } from 'react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { Button } from '@/app/components/ui/button';
import { InviteMemberModal } from '@/app/components/workspaces/InviteMemberModal';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  X,
  Mail,
  Shield,
  Crown,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Check,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  Settings,
  FileText,
  Copy,
  CheckCircle,
} from 'lucide-react';

interface ModulePermission {
  module: string;
  fullAccess: boolean;
  creator: boolean;
  editor: boolean;
  viewer: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  location: string;
  workspaceId: string;
  workspaceName: string;
  roleType: 'Full Access' | 'Custom';
  status: 'Active' | 'Pending' | 'Inactive';
  dateAdded: string;
  lastActive: string;
  avatar?: string;
  permissions: ModulePermission[];
}

interface UserManagementPageProps {
  onNavigate: (page: string) => void;
  userName?: string;
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

const adminOnlyModules = ['User Management', 'Workspace Management', 'Reports & Analytics'];

export function UserManagementPage({
  onNavigate,
}: UserManagementPageProps) {
  const { selectedWorkspace, currentUser } = useWorkspace();
  const userName = currentUser?.name || 'John Doe';
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);

  // Page-level access control guard
  if (currentUser.permissions.users === 'none') {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar activeItem="users" onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            userName={userName}
            onSettingsClick={() => onNavigate?.('settings')}
            onAddMemberClick={() => onNavigate?.('users')}
            onCreateWorkspaceClick={() => onNavigate?.('workspaces')}
          />
          <main className="flex-1 overflow-y-auto flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border border-zinc-200/50 backdrop-blur-xl rounded-2xl p-10 shadow-xl shadow-purple-500/5 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 border border-red-200 p-4 rounded-2xl flex items-center justify-center">
                  <Lock className="size-10 text-red-600 animate-pulse" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-zinc-950 mb-2">Access Restricted</h1>
              <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
                Your account permission level for the <strong>User Management</strong> module is currently restricted to 'None'.
              </p>
              <div className="bg-zinc-50 border border-zinc-200/40 rounded-xl p-4 mb-6 text-left">
                <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase mb-1">Active User Profile:</p>
                <p className="font-extrabold text-sm text-zinc-800">{currentUser.name} ({currentUser.role.replace('_', ' ').toUpperCase()})</p>
              </div>
              <Button
                onClick={() => onNavigate?.('dashboard')}
                className="w-full h-11 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Go back to Dashboard
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [workspaceFilter, setWorkspaceFilter] = useState<string>('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // Permissions edit state
  const [editRoleType, setEditRoleType] = useState<'Full Access' | 'Custom'>('Custom');
  const [editPermissions, setEditPermissions] = useState<ModulePermission[]>(defaultPermissions);

  const workspaces = [
    { id: 'WS-001', name: 'Main Workspace', color: '#4A90E2' },
    { id: 'WS-002', name: 'Marketing Team', color: '#E24A90' },
    { id: 'WS-003', name: 'Sales Division', color: '#90E24A' },
  ];

  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      jobTitle: 'Product Manager',
      department: 'Product',
      location: 'New York, USA',
      workspaceId: 'WS-001',
      workspaceName: 'Main Workspace',
      roleType: 'Full Access',
      status: 'Active',
      dateAdded: '2024-01-15',
      lastActive: '2 hours ago',
      permissions: defaultPermissions.map(p => ({ ...p, fullAccess: true })),
    },
    {
      id: 'USR-002',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      jobTitle: 'Content Strategist',
      department: 'Marketing',
      location: 'San Francisco, USA',
      workspaceId: 'WS-002',
      workspaceName: 'Marketing Team',
      roleType: 'Custom',
      status: 'Active',
      dateAdded: '2024-02-20',
      lastActive: '5 minutes ago',
      permissions: [
        { module: 'Contacts', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Groups', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Subscribers', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Templates', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Media Library', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Campaigns', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Automation Workflow', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Sender Emails', fullAccess: false, creator: true, editor: true, viewer: true },
      ],
    },
    {
      id: 'USR-003',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael@example.com',
      phone: '+1 (555) 345-6789',
      jobTitle: 'Sales Analyst',
      department: 'Sales',
      location: 'Chicago, USA',
      workspaceId: 'WS-003',
      workspaceName: 'Sales Division',
      roleType: 'Custom',
      status: 'Active',
      dateAdded: '2024-03-10',
      lastActive: '1 day ago',
      permissions: [
        { module: 'Contacts', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Groups', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Subscribers', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Templates', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Media Library', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Campaigns', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Automation Workflow', fullAccess: false, creator: false, editor: false, viewer: true },
        { module: 'Sender Emails', fullAccess: false, creator: false, editor: false, viewer: true },
      ],
    },
    {
      id: 'USR-004',
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      jobTitle: 'Marketing Manager',
      department: 'Marketing',
      location: 'Los Angeles, USA',
      workspaceId: 'WS-002',
      workspaceName: 'Marketing Team',
      roleType: 'Custom',
      status: 'Pending',
      dateAdded: '2024-03-25',
      lastActive: 'Never',
      permissions: [
        { module: 'Contacts', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Groups', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Subscribers', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Templates', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Media Library', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Campaigns', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Automation Workflow', fullAccess: false, creator: true, editor: true, viewer: true },
        { module: 'Sender Emails', fullAccess: false, creator: true, editor: true, viewer: true },
      ],
    },
  ]);

  //Filter users by current workspace context
  useEffect(() => {
    // Note: In production, users would be fetched per workspace
    // For now, we're filtering client-side for demo purposes
  }, [selectedWorkspace?.id]);

  const filteredUsers = users.filter((user) => {
    // Only show users from the selected workspace
    const matchesWorkspace = user.workspaceId === selectedWorkspace?.id;
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roleType === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesWorkspace && matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteUser = (memberData: any, permissions: ModulePermission[]) => {
    // Find workspace - use selectedWorkspace if available
    const workspace = workspaces.find(w => w.id === selectedWorkspace?.id) || workspaces[0];
    
    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phone: memberData.phone || '',
      jobTitle: memberData.jobTitle || '',
      department: memberData.department || '',
      location: memberData.location || '',
      workspaceId: workspace?.id || 'WS-001',
      workspaceName: workspace?.name || 'Unknown',
      roleType: memberData.roleType,
      status: 'Pending',
      dateAdded: new Date().toISOString().split('T')[0],
      lastActive: 'Never',
      permissions: permissions,
    };
    
    setUsers([...users, newUser]);
    setShowInviteModal(false);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                firstName: editFirstName,
                lastName: editLastName,
                phone: editPhone,
                jobTitle: editJobTitle,
                department: editDepartment,
                location: editLocation,
              }
            : user
        )
      );
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                roleType: editRoleType,
                permissions: editRoleType === 'Full Access'
                  ? defaultPermissions.map(p => ({ ...p, fullAccess: true }))
                  : editPermissions,
              }
            : user
        )
      );
      setShowPermissionsModal(false);
      setSelectedUser(null);
    }
  };

  const handleChangeStatus = (userId: string, newStatus: 'Active' | 'Inactive') => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setOpenDropdown(null);
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter((user) => user.id !== userId));
      setOpenDropdown(null);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditPhone(user.phone);
    setEditJobTitle(user.jobTitle);
    setEditDepartment(user.department);
    setEditLocation(user.location);
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const openPermissionsModal = (user: User) => {
    setSelectedUser(user);
    setEditRoleType(user.roleType);
    setEditPermissions(user.permissions);
    setShowPermissionsModal(true);
    setOpenDropdown(null);
  };

  const openUserDetailModal = (user: User) => {
    setSelectedUser(user);
    setShowUserDetailModal(true);
    setOpenDropdown(null);
  };

  const handlePermissionChange = (
    moduleIndex: number,
    field: 'fullAccess' | 'creator' | 'editor' | 'viewer',
    value: boolean
  ) => {
    const permissions = [...editPermissions];
    
    if (field === 'fullAccess' && value) {
      // If Full Access is checked, check all permissions
      permissions[moduleIndex] = {
        ...permissions[moduleIndex],
        fullAccess: true,
        creator: true,
        editor: true,
        viewer: true,
      };
    } else if (field === 'fullAccess' && !value) {
      // If Full Access is unchecked, uncheck all permissions
      permissions[moduleIndex] = {
        ...permissions[moduleIndex],
        fullAccess: false,
        creator: false,
        editor: false,
        viewer: false,
      };
    } else {
      permissions[moduleIndex] = {
        ...permissions[moduleIndex],
        [field]: value,
      };
      // If any permission is checked, make sure fullAccess is unchecked
      if (value && field !== 'fullAccess') {
        permissions[moduleIndex].fullAccess = false;
      }
    }

    setEditPermissions(permissions);
  };

  const getRoleBadge = (roleType: string) => {
    if (roleType === 'Full Access') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          <Crown className="size-3" />
          Full Access
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
        <Shield className="size-3" />
        Custom
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="size-1.5 rounded-full bg-green-600"></div>
            Active
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="size-1.5 rounded-full bg-yellow-600"></div>
            Pending
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <div className="size-1.5 rounded-full bg-gray-600"></div>
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: filteredUsers.length,
    active: filteredUsers.filter((u) => u.status === 'Active').length,
    pending: filteredUsers.filter((u) => u.status === 'Pending').length,
    fullAccess: filteredUsers.filter((u) => u.roleType === 'Full Access').length,
  };

  return (
    <ModuleLayout activeItem="users" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="size-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            </div>
            <p className="text-gray-600">
                  Manage team members with granular workspace-based access control
                </p>
              </div>
              <Button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="size-4 mr-2" />
                Add User
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="size-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <Check className="size-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <AlertCircle className="size-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Access</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.fullAccess}</p>
                  </div>
                  <Crown className="size-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, job title, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={workspaceFilter}
                  onChange={(e) => setWorkspaceFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Workspaces</option>
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="Full Access">Full Access</option>
                  <option value="Custom">Custom</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Job Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Workspace
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <Users className="size-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 font-medium">No users found</p>
                          <p className="text-gray-500 text-sm mt-1">
                            Try adjusting your search or filters
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Mail className="size-3" />
                                  {user.email}
                                </p>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">
                                  {user.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">
                              {user.jobTitle || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">{user.department || 'N/A'}</p>
                            {user.location && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin className="size-3" />
                                {user.location}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="size-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    workspaces.find((w) => w.id === user.workspaceId)?.color ||
                                    '#4A90E2',
                                }}
                              ></div>
                              <span className="text-sm font-medium text-gray-900">
                                {user.workspaceName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getRoleBadge(user.roleType)}</td>
                          <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.lastActive}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block">
                              <button
                                onClick={() =>
                                  setOpenDropdown(openDropdown === user.id ? null : user.id)
                                }
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <MoreVertical className="size-5 text-gray-600" />
                              </button>
                              {openDropdown === user.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenDropdown(null)}
                                  ></div>
                                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20">
                                    <button
                                      onClick={() => openUserDetailModal(user)}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Eye className="size-4" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => openEditModal(user)}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Edit className="size-4" />
                                      Edit User Info
                                    </button>
                                    <button
                                      onClick={() => openPermissionsModal(user)}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Shield className="size-4" />
                                      Manage Permissions
                                    </button>
                                    <div className="border-t my-1"></div>
                                    {user.status === 'Active' ? (
                                      <button
                                        onClick={() => handleChangeStatus(user.id, 'Inactive')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <AlertCircle className="size-4" />
                                        Deactivate User
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleChangeStatus(user.id, 'Active')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <Check className="size-4" />
                                        Activate User
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleRemoveUser(user.id)}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 border-t"
                                    >
                                      <Trash2 className="size-4" />
                                      Remove User
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <InviteMemberModal
          workspaces={workspaces}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          editFirstName={editFirstName}
          setEditFirstName={setEditFirstName}
          editLastName={editLastName}
          setEditLastName={setEditLastName}
          editPhone={editPhone}
          setEditPhone={setEditPhone}
          editJobTitle={editJobTitle}
          setEditJobTitle={setEditJobTitle}
          editDepartment={editDepartment}
          setEditDepartment={setEditDepartment}
          editLocation={editLocation}
          setEditLocation={setEditLocation}
          handleEditUser={handleEditUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <PermissionsModal
          user={selectedUser}
          editRoleType={editRoleType}
          setEditRoleType={setEditRoleType}
          editPermissions={editPermissions}
          handlePermissionChange={handlePermissionChange}
          handleSavePermissions={handleSavePermissions}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* User Detail Modal */}
      {showUserDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          workspaceColor={
            workspaces.find((w) => w.id === selectedUser.workspaceId)?.color || '#4A90E2'
          }
          onClose={() => {
            setShowUserDetailModal(false);
            setSelectedUser(null);
          }}
          onEdit={() => {
            setShowUserDetailModal(false);
            openEditModal(selectedUser);
          }}
          onManagePermissions={() => {
            setShowUserDetailModal(false);
            openPermissionsModal(selectedUser);
          }}
        />
      )}

    </ModuleLayout>
  );
}

// Separate modal components for better organization

// Edit User Modal Component
interface EditUserModalProps {
  user: User;
  editFirstName: string;
  setEditFirstName: (value: string) => void;
  editLastName: string;
  setEditLastName: (value: string) => void;
  editPhone: string;
  setEditPhone: (value: string) => void;
  editJobTitle: string;
  setEditJobTitle: (value: string) => void;
  editDepartment: string;
  setEditDepartment: (value: string) => void;
  editLocation: string;
  setEditLocation: (value: string) => void;
  handleEditUser: () => void;
  onClose: () => void;
}

function EditUserModal({
  user,
  editFirstName,
  setEditFirstName,
  editLastName,
  setEditLastName,
  editPhone,
  setEditPhone,
  editJobTitle,
  setEditJobTitle,
  editDepartment,
  setEditDepartment,
  editLocation,
  setEditLocation,
  handleEditUser,
  onClose,
}: EditUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit User Information</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="size-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 font-mono">{user.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={editJobTitle}
              onChange={(e) => setEditJobTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={editDepartment}
              onChange={(e) => setEditDepartment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700">
            <Check className="size-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Permissions Modal Component
interface PermissionsModalProps {
  user: User;
  editRoleType: 'Full Access' | 'Custom';
  setEditRoleType: (value: 'Full Access' | 'Custom') => void;
  editPermissions: ModulePermission[];
  handlePermissionChange: (
    moduleIndex: number,
    field: 'fullAccess' | 'creator' | 'editor' | 'viewer',
    value: boolean
  ) => void;
  handleSavePermissions: () => void;
  onClose: () => void;
}

function PermissionsModal({
  user,
  editRoleType,
  setEditRoleType,
  editPermissions,
  handlePermissionChange,
  handleSavePermissions,
  onClose,
}: PermissionsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage User Permissions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure access control for {user.firstName} {user.lastName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  editRoleType === 'Full Access'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {editRoleType}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Role Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEditRoleType('Full Access')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  editRoleType === 'Full Access'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Crown
                  className={`size-5 mb-2 ${
                    editRoleType === 'Full Access' ? 'text-purple-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`font-semibold ${
                    editRoleType === 'Full Access' ? 'text-purple-900' : 'text-gray-900'
                  }`}
                >
                  Full Access
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Complete access to all modules
                </p>
              </button>
              <button
                onClick={() => setEditRoleType('Custom')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  editRoleType === 'Custom'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Settings
                  className={`size-5 mb-2 ${
                    editRoleType === 'Custom' ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`font-semibold ${
                    editRoleType === 'Custom' ? 'text-blue-900' : 'text-gray-900'
                  }`}
                >
                  Custom
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Select specific module permissions
                </p>
              </button>
            </div>
          </div>

          {editRoleType === 'Custom' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Module Permissions
              </label>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-5 gap-2 pb-2 border-b text-xs font-semibold text-gray-600">
                  <div className="col-span-1">Module</div>
                  <div className="text-center">Full Access</div>
                  <div className="text-center">Creator</div>
                  <div className="text-center">Editor</div>
                  <div className="text-center">Viewer</div>
                </div>
                {editPermissions.map((perm, index) => (
                  <div
                    key={perm.module}
                    className="grid grid-cols-5 gap-2 items-center py-2"
                  >
                    <div className="col-span-1">
                      <p className="text-sm font-medium text-gray-900">{perm.module}</p>
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={perm.fullAccess}
                        onChange={(e) =>
                          handlePermissionChange(index, 'fullAccess', e.target.checked, false)
                        }
                        className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={perm.creator}
                        onChange={(e) =>
                          handlePermissionChange(index, 'creator', e.target.checked, false)
                        }
                        disabled={perm.fullAccess}
                        className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={perm.editor}
                        onChange={(e) =>
                          handlePermissionChange(index, 'editor', e.target.checked, false)
                        }
                        disabled={perm.fullAccess}
                        className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={perm.viewer}
                        onChange={(e) =>
                          handlePermissionChange(index, 'viewer', e.target.checked, false)
                        }
                        disabled={perm.fullAccess}
                        className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSavePermissions} className="bg-blue-600 hover:bg-blue-700">
            <Check className="size-4 mr-2" />
            Save Permissions
          </Button>
        </div>
      </div>
    </div>
  );
}

// User Detail Modal Component
interface UserDetailModalProps {
  user: User;
  workspaceColor: string;
  onClose: () => void;
  onEdit: () => void;
  onManagePermissions: () => void;
}

function UserDetailModal({
  user,
  workspaceColor,
  onClose,
  onEdit,
  onManagePermissions,
}: UserDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* User Profile Header */}
          <div className="flex items-start gap-4 mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="size-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-600 flex items-center gap-2 mb-2">
                <Mail className="size-4" />
                {user.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="size-4" />
                {user.phone || 'Not provided'}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : user.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <div
                className="flex items-center justify-end gap-1 px-2 py-1 rounded text-xs font-medium"
                style={{ backgroundColor: `${workspaceColor}20`, color: workspaceColor }}
              >
                <span>{user.workspaceName}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <FileText className="size-4" />
                Job Title
              </p>
              <p className="text-gray-900">{user.jobTitle || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Department</p>
              <p className="text-gray-900">{user.department || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <MapPin className="size-4" />
                Location
              </p>
              <p className="text-gray-900">{user.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Calendar className="size-4" />
                Date Added
              </p>
              <p className="text-gray-900">{user.dateAdded}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Last Active</p>
              <p className="text-gray-900">{user.lastActive}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Shield className="size-4" />
                Role Type
              </p>
              <p className="text-gray-900 font-medium">{user.roleType}</p>
            </div>
          </div>

          {/* Permissions Summary */}
          {user.roleType === 'Custom' && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Settings className="size-4" />
                Module Permissions
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                {user.permissions.filter((p) => p.fullAccess || p.creator || p.editor || p.viewer).map((perm) => (
                  <div key={perm.module} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <span className="text-sm font-medium text-gray-900">{perm.module}</span>
                    <div className="flex gap-2">
                      {perm.fullAccess && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                          Full Access
                        </span>
                      )}
                      {perm.creator && !perm.fullAccess && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          Creator
                        </span>
                      )}
                      {perm.editor && !perm.fullAccess && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Editor
                        </span>
                      )}
                      {perm.viewer && !perm.fullAccess && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                          Viewer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="size-4 mr-2" />
            Edit User
          </Button>
          <Button
            onClick={onManagePermissions}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Shield className="size-4 mr-2" />
            Manage Permissions
          </Button>
        </div>
      </div>
    </div>
  );
}

// Credentials Modal Component
interface CredentialsModalProps {
  email: string;
  password: string;
  onClose: () => void;
}

function CredentialsModal({ email, password, onClose }: CredentialsModalProps) {
  const [copied, setCopied] = useState(false);

  const copyCredentials = () => {
    const credentialsText = `NConnect Login Credentials\n\nLogin Email: ${email}\nTemporary Password: ${password}\n\nPlease change your password upon first login.`;
    const textArea = document.createElement('textarea');
    textArea.value = credentialsText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <CheckCircle className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">User Invited Successfully!</h2>
              <p className="text-blue-100 text-sm">Temporary credentials generated</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Important:</strong> These credentials will only be shown once.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={copyCredentials} className="bg-blue-600 hover:bg-blue-700">
              {copied ? <><CheckCircle className="size-4 mr-2" />Copied!</> : <><Copy className="size-4 mr-2" />Copy All</>}
            </Button>
          </div>
          <div><h3 className="text-lg font-bold text-gray-900 mb-4">Login Credentials</h3></div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Login Email</label>
              <div className="mt-1 bg-white border border-blue-200 rounded-lg px-4 py-3">
                <p className="font-mono text-sm text-gray-900 break-all">{email}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Temporary Password</label>
              <div className="mt-1 bg-white border border-blue-200 rounded-lg px-4 py-3">
                <p className="font-mono text-sm text-gray-900 break-all">{password}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">The user will be required to change their password upon first login.</p>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">Done</Button>
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage;