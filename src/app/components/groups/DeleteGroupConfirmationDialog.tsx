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
import { Group } from './GroupsTable';

interface DeleteGroupConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onConfirmDelete: (groupId: string) => void;
}

export function DeleteGroupConfirmationDialog({
  isOpen,
  onClose,
  group,
  onConfirmDelete,
}: DeleteGroupConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!group) return;

    setIsDeleting(true);

    // Simulate deletion delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsDeleting(false);
    onConfirmDelete(group.id);
    onClose();
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="size-5 mr-2" />
            Delete Group
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm you want to delete this group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Info */}
          <div className="flex items-center px-3 py-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <div 
                className="size-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: group?.color || '#4A90E2' }}
              >
                <Users className="size-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{group?.name}</div>
                <div className="text-xs text-gray-600">
                  {group?.id} • {group?.contactCount?.toLocaleString() || 0} contacts
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-900">
                  What happens when you delete this group:
                </p>
                <ul className="text-xs text-orange-800 space-y-1 list-disc list-inside">
                  <li>The group "{group?.name}" will be permanently deleted</li>
                  <li>All group configurations and settings will be lost</li>
                  <li>The {group?.contactCount?.toLocaleString() || 0} contacts in this group will NOT be deleted</li>
                  <li>Contacts will remain in your Contacts module and other groups</li>
                  <li>Past campaigns sent to this group will still show in analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> If you want to keep the group but remove contacts, 
              use the "View Contacts" option instead to manage group membership.
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
                  Delete Group
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
