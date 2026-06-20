import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { MoreVertical, Edit, Trash2, Users, Mail, Tag } from 'lucide-react';
import { SendEmailToGroupDialog } from './SendEmailToGroupDialog';
import { ManageGroupTagsDialog } from './ManageGroupTagsDialog';
import { ViewGroupContactsDialog } from './ViewGroupContactsDialog';
import { ScheduleCampaignDialog } from './ScheduleCampaignDialog';
import { DeleteGroupConfirmationDialog } from './DeleteGroupConfirmationDialog';
import { BulkDeleteGroupsDialog } from './BulkDeleteGroupsDialog';

export interface Group {
  id: string;
  name: string;
  description: string;
  contactCount: number;
  color: string;
  createdAt: string;
  lastUpdated: string;
  workspaceId: string;
  tags?: string[];
  createdBy?: string;
  lastModifiedBy?: string;
}

interface GroupsTableProps {
  groups: Group[];
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
  onUpdateTags?: (groupId: string, tags: string[]) => void;
  onBulkAction?: (action: string, groupIds: string[]) => void;
}

export function GroupsTable({ groups, onEditGroup, onDeleteGroup, onUpdateTags, onBulkAction }: GroupsTableProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedGroupForEmail, setSelectedGroupForEmail] = useState<Group | null>(null);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [selectedGroupForTags, setSelectedGroupForTags] = useState<Group | null>(null);
  const [contactsDialogOpen, setContactsDialogOpen] = useState(false);
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<Group | null>(null);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [selectedGroupForCampaign, setSelectedGroupForCampaign] = useState<Group | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroupForDelete, setSelectedGroupForDelete] = useState<Group | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const handleSendEmail = (group: Group) => {
    setSelectedGroupForEmail(group);
    setEmailDialogOpen(true);
  };

  const handleManageTags = (group: Group) => {
    setSelectedGroupForTags(group);
    setTagsDialogOpen(true);
  };

  const handleViewContacts = (group: Group) => {
    setSelectedGroupForContacts(group);
    setContactsDialogOpen(true);
  };

  const handleScheduleCampaign = (group: Group) => {
    setSelectedGroupForCampaign(group);
    setCampaignDialogOpen(true);
  };

  const handleDeleteGroup = (group: Group) => {
    setSelectedGroupForDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleConfirmBulkDelete = (groupIds: string[]) => {
    // Delete all selected groups
    groupIds.forEach(id => onDeleteGroup(id));
    // Clear selection after delete
    setSelectedGroups([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGroups(groups.map((g) => g.id));
    } else {
      setSelectedGroups([]);
    }
  };

  const handleSelectGroup = (groupId: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups([...selectedGroups, groupId]);
    } else {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {selectedGroups.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-blue-900 font-medium">
            {selectedGroups.length} group(s) selected
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // For now, schedule campaign for the first selected group
                // In a full implementation, this could open a dialog for bulk campaigns
                const firstSelectedGroup = groups.find(g => g.id === selectedGroups[0]);
                if (firstSelectedGroup) {
                  handleScheduleCampaign(firstSelectedGroup);
                }
              }}
            >
              <Mail className="size-4 mr-2" />
              Schedule Campaign
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={handleBulkDelete}>
              <Trash2 className="size-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={selectedGroups.length === groups.length && groups.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead>Group Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Contacts</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Users className="size-12 mb-3 text-gray-300" />
                  <p className="font-medium text-gray-900 mb-1">No groups yet</p>
                  <p className="text-sm">Create your first group to organize contacts</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <TableRow key={group.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedGroups.includes(group.id)}
                    onChange={(e) => handleSelectGroup(group.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-xs text-gray-500">{group.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600 text-sm">{group.description}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {group.tags && group.tags.length > 0 ? (
                      group.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No tags</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium">
                    {group.contactCount.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {group.createdAt}
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {group.lastUpdated}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditGroup(group)}>
                        <Edit className="size-4 mr-2" />
                        Edit Group
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleManageTags(group)}>
                        <Tag className="size-4 mr-2" />
                        Manage Tags
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSendEmail(group)}>
                        <Mail className="size-4 mr-2" />
                        Send Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewContacts(group)}>
                        <Users className="size-4 mr-2" />
                        View Contacts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteGroup(group)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <SendEmailToGroupDialog
        isOpen={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        group={selectedGroupForEmail}
      />

      <ManageGroupTagsDialog
        isOpen={tagsDialogOpen}
        onClose={() => setTagsDialogOpen(false)}
        group={selectedGroupForTags}
        onUpdateTags={onUpdateTags}
      />

      <ViewGroupContactsDialog
        isOpen={contactsDialogOpen}
        onClose={() => setContactsDialogOpen(false)}
        group={selectedGroupForContacts}
      />

      <ScheduleCampaignDialog
        isOpen={campaignDialogOpen}
        onClose={() => setCampaignDialogOpen(false)}
        group={selectedGroupForCampaign}
      />

      <DeleteGroupConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        group={selectedGroupForDelete}
        onConfirmDelete={onDeleteGroup}
      />

      <BulkDeleteGroupsDialog
        isOpen={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        groups={groups.filter(g => selectedGroups.includes(g.id))}
        onConfirmDelete={handleConfirmBulkDelete}
      />
    </div>
  );
}