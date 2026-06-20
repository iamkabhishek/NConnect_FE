import { useState, useEffect } from 'react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { GroupsHeader } from './GroupsHeader';
import { GroupsTable, Group } from './GroupsTable';
import { CreateGroupDialog, GroupFormData } from './CreateGroupDialog';
import { EditGroupDialog } from './EditGroupDialog';

// Mock data
const MOCK_GROUPS: Group[] = [
  {
    id: 'WS-1_GRP-001',
    name: 'Premium Subscribers',
    description: 'High-value subscribers on premium plans',
    contactCount: 847,
    color: '#4A90E2',
    createdAt: 'Jan 10, 2025',
    lastUpdated: 'Jan 15, 2025',
    workspaceId: 'workspace-1',
    tags: ['Premium', 'VIP'],
    createdBy: 'John Doe',
    lastModifiedBy: 'John Doe',
  },
  {
    id: 'WS-1_GRP-002',
    name: 'Newsletter Readers',
    description: 'Active readers of weekly newsletter',
    contactCount: 1523,
    color: '#9B59B6',
    createdAt: 'Dec 5, 2024',
    lastUpdated: 'Jan 16, 2025',
    workspaceId: 'workspace-1',
    tags: ['Newsletter', 'Marketing'],
    createdBy: 'Jane Smith',
    lastModifiedBy: 'John Doe',
  },
  {
    id: 'WS-2_GRP-001',
    name: 'Trial Users',
    description: 'Users currently on trial period',
    contactCount: 312,
    color: '#E67E22',
    createdAt: 'Jan 8, 2025',
    lastUpdated: 'Jan 14, 2025',
    workspaceId: 'workspace-2',
    tags: ['Trial', 'Onboarding'],
    createdBy: 'Bob Johnson',
    lastModifiedBy: 'Bob Johnson',
  },
  {
    id: 'WS-1_GRP-003',
    name: 'Inactive Contacts',
    description: 'Contacts with no engagement in 90 days',
    contactCount: 156,
    color: '#E74C3C',
    createdAt: 'Nov 20, 2024',
    lastUpdated: 'Jan 10, 2025',
    workspaceId: 'workspace-1',
    tags: ['Inactive'],
    createdBy: 'Alice Williams',
    lastModifiedBy: 'John Doe',
  },
  {
    id: 'WS-2_GRP-002',
    name: 'New Signups',
    description: 'Contacts added in the last 30 days',
    contactCount: 423,
    color: '#2ECC71',
    createdAt: 'Jan 1, 2025',
    lastUpdated: 'Jan 17, 2025',
    workspaceId: 'workspace-2',
    tags: ['Onboarding'],
    createdBy: 'Charlie Brown',
    lastModifiedBy: 'Charlie Brown',
  },
  {
    id: 'WS-1_GRP-004',
    name: 'Sales Prospects',
    description: 'Potential customers in sales funnel',
    contactCount: 892,
    color: '#26A69A',
    createdAt: 'Dec 15, 2024',
    lastUpdated: 'Jan 16, 2025',
    workspaceId: 'workspace-1',
    tags: ['Sales', 'Marketing'],
    createdBy: 'John Doe',
    lastModifiedBy: 'Jane Smith',
  },
];

interface GroupsModuleProps {
  userName?: string;
  onNavigate?: (page: string) => void;
}

export function GroupsModule({
  userName = 'John Doe',
  onNavigate,
}: GroupsModuleProps) {
  const { selectedWorkspace } = useWorkspace();
  
  // Filter groups by workspace
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Update groups when workspace changes
  useEffect(() => {
    const workspaceGroups = MOCK_GROUPS.filter(g => g.workspaceId === selectedWorkspace?.id);
    setGroups(workspaceGroups);
  }, [selectedWorkspace?.id]);

  // Filter, sort groups
  const filteredAndSortedGroups = groups
    .filter((group) => {
      // Search filter - includes Group ID
      const matchesSearch =
        group.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => group.tags?.includes(tag));

      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'contacts-high':
          return b.contactCount - a.contactCount;
        case 'contacts-low':
          return a.contactCount - b.contactCount;
        case 'date-newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleCreateGroup = (data: GroupFormData) => {
    // Generate Group ID with workspace prefix
    // Example: WS-1_GRP-001, WS-2_GRP-005
    const workspacePrefix = selectedWorkspace?.id ? `WS-${selectedWorkspace.id.split('-')[1]?.toUpperCase() || '1'}` : 'WS-DEFAULT';
    const groupNumber = groups.length + 1;
    const groupId = `${workspacePrefix}_GRP-${String(groupNumber).padStart(3, '0')}`;

    const newGroup: Group = {
      id: groupId,
      name: data.name,
      description: data.description,
      contactCount: data.contactIds.length,
      color: data.color,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      workspaceId: selectedWorkspace?.id || 'workspace-1',
      tags: [],
      createdBy: userName,
      lastModifiedBy: userName,
    };

    setGroups([newGroup, ...groups]);
    console.log('Group created:', newGroup);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setEditDialogOpen(true);
  };

  const handleUpdateGroup = (groupId: string, data: GroupFormData) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              name: data.name,
              description: data.description,
              color: data.color,
              lastUpdated: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              lastModifiedBy: userName,
            }
          : group
      )
    );
    console.log('Group updated:', groupId, data);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter((group) => group.id !== groupId));
      console.log('Group deleted:', groupId);
    }
  };

  const handleUpdateTags = (groupId: string, tags: string[]) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tags,
              lastUpdated: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              lastModifiedBy: userName,
            }
          : group
      )
    );
    console.log('Group tags updated:', groupId, tags);
  };

  return (
    <ModuleLayout activeItem="groups" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <GroupsHeader
          onCreateGroup={() => setCreateDialogOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />

        <GroupsTable
          groups={filteredAndSortedGroups}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
          onUpdateTags={handleUpdateTags}
        />
      </div>

      {/* Dialogs */}
      <CreateGroupDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      <EditGroupDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedGroup(null);
        }}
        onUpdateGroup={handleUpdateGroup}
        group={selectedGroup}
      />
    </ModuleLayout>
  );
}