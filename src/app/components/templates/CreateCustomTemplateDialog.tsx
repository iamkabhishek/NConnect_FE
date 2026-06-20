import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Plus, FileText } from 'lucide-react';

interface CreateCustomTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTemplate: (data: CustomTemplateFormData) => void;
  workspaceId: string;
  templateCount: number;
}

export interface CustomTemplateFormData {
  name: string;
  description: string;
  category: string;
}

export function CreateCustomTemplateDialog({
  open,
  onClose,
  onCreateTemplate,
  workspaceId,
  templateCount,
}: CreateCustomTemplateDialogProps) {
  const [formData, setFormData] = useState<CustomTemplateFormData>({
    name: '',
    description: '',
    category: 'newsletter',
  });

  // Generate Template ID based on workspace and template count
  const templateId = `${workspaceId}-template-${templateCount + 1}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTemplate(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: 'newsletter',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Custom Template</DialogTitle>
          <DialogDescription>
            Create a new template from scratch using the Visual Template Builder
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Template ID Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Template ID
                </p>
                <p className="text-lg font-mono font-semibold text-blue-700">
                  {templateId}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This ID will be automatically assigned to your template
                </p>
              </div>
            </div>
          </div>

          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Template Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Welcome Newsletter, Product Launch, Weekly Digest"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500">
              Choose a descriptive name for your template
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Template Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and use case for this template..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
            <p className="text-xs text-gray-500">
              Provide details about when and how this template should be used
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Template Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newsletter">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Newsletter
                  </div>
                </SelectItem>
                <SelectItem value="promotional">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    Promotional
                  </div>
                </SelectItem>
                <SelectItem value="transactional">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                    Transactional
                  </div>
                </SelectItem>
                <SelectItem value="event">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Event
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Select the category that best fits your template
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>What's next?</strong> After creating your template, you'll be
              directed to the Visual Template Builder where you can design your
              email using drag-and-drop elements.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.name || !formData.description}
            >
              <Plus className="size-4 mr-2" />
              Create & Open Builder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
