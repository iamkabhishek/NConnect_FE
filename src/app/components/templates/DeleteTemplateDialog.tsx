import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Template } from './types';

interface DeleteTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onConfirmDelete: (templateId: string) => void;
}

export function DeleteTemplateDialog({
  isOpen,
  onClose,
  template,
  onConfirmDelete,
}: DeleteTemplateDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!template) return null;

  const handleDelete = async () => {
    setIsDeleting(true);

    // Simulate deletion delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsDeleting(false);
    onConfirmDelete(template.id);
    onClose();
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const getCategoryColor = (category: Template['category']) => {
    const colors = {
      newsletter: 'bg-blue-100 text-blue-700',
      promotional: 'bg-purple-100 text-purple-700',
      transactional: 'bg-gray-100 text-gray-700',
      event: 'bg-red-100 text-red-700',
    };
    return colors[category];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="size-5 mr-2" />
            Delete Template
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The template will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <Badge
                    variant="secondary"
                    className={getCategoryColor(template.category)}
                  >
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Used {template.usageCount} times</span>
                  <span>•</span>
                  <span>Last modified: {template.lastModified}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-900">
                  What happens when you delete this template:
                </p>
                <ul className="text-xs text-red-800 space-y-1 list-disc list-inside">
                  <li>The template will be permanently deleted</li>
                  <li>All template configurations and HTML will be lost</li>
                  {template.usageCount > 0 && (
                    <li>Past campaigns using this template will remain unchanged</li>
                  )}
                  <li>This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* High Usage Warning */}
          {template.usageCount > 10 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-800">
                <strong>High Usage Alert:</strong> This template has been used {template.usageCount} times. 
                Consider duplicating it before deletion if you might need it later.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
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
                  Delete Template
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
