import { useState } from 'react';
import { Trash2, AlertTriangle, Users, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Group } from './GroupsTable';

interface BulkDeleteGroupsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  onConfirmDelete: (groupIds: string[]) => void;
}

export function BulkDeleteGroupsDialog({
  isOpen,
  onClose,
  groups,
  onConfirmDelete,
}: BulkDeleteGroupsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const totalContacts = groups.reduce((sum, group) => sum + group.contactCount, 0);

  const handleDelete = async () => {
    if (groups.length === 0) return;

    setIsDeleting(true);

    // Simulate deletion delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsDeleting(false);
    onConfirmDelete(groups.map(g => g.id));
    onClose();
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="size-5 mr-2" />
            Delete Multiple Groups
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm you want to delete {groups.length} {groups.length === 1 ? 'group' : 'groups'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  You are about to delete {groups.length} {groups.length === 1 ? 'group' : 'groups'}
                </p>
                <p className="text-xs text-gray-600">
                  Affecting {totalContacts.toLocaleString()} total contacts across all groups
                </p>
              </div>
            </div>
          </div>

          {/* Groups List */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Groups to be deleted:
            </p>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
              {groups.map((group) => (
                <div key={group.id} className="px-3 py-2.5 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    >
                      <Users className="size-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {group.name}
                        </p>
                        {group.tags && group.tags.length > 0 && (
                          <div className="flex gap-1">
                            {group.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {group.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{group.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{group.id}</span>
                        <span>•</span>
                        <span>{group.contactCount.toLocaleString()} contacts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-900">
                  What happens when you delete these groups:
                </p>
                <ul className="text-xs text-orange-800 space-y-1 list-disc list-inside">
                  <li>All {groups.length} selected {groups.length === 1 ? 'group' : 'groups'} will be permanently deleted</li>
                  <li>All group configurations and settings will be lost</li>
                  <li>The {totalContacts.toLocaleString()} contacts will NOT be deleted</li>
                  <li>Contacts will remain in your Contacts module and other groups</li>
                  <li>Past campaigns sent to these groups will still show in analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This action will only delete the group containers, not the contacts themselves. 
              Contacts can still be managed in the Contacts module.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4 mr-2" />
                  Delete {groups.length} {groups.length === 1 ? 'Group' : 'Groups'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
