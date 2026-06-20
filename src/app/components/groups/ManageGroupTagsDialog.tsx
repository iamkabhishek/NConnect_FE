import { useState, useEffect } from 'react';
import { Tag, X, Check, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Group } from './GroupsTable';

interface ManageGroupTagsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onUpdateTags?: (groupId: string, tags: string[]) => void;
}

// Mock available tags from workspace - in production, this would come from workspace settings
const AVAILABLE_TAGS = [
  { id: '1', name: 'Marketing', color: 'blue' },
  { id: '2', name: 'Sales', color: 'green' },
  { id: '3', name: 'Newsletter', color: 'indigo' },
  { id: '4', name: 'Premium', color: 'purple' },
  { id: '5', name: 'Trial', color: 'yellow' },
  { id: '6', name: 'Onboarding', color: 'cyan' },
  { id: '7', name: 'VIP', color: 'pink' },
  { id: '8', name: 'Inactive', color: 'orange' },
];

const TAG_COLOR_CLASSES: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
};

export function ManageGroupTagsDialog({ isOpen, onClose, group, onUpdateTags }: ManageGroupTagsDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize selected tags when dialog opens
  useEffect(() => {
    if (isOpen && group) {
      setSelectedTags(group.tags || []);
    }
  }, [isOpen, group]);

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSave = () => {
    if (group) {
      onUpdateTags?.(group.id, selectedTags);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedTags([]);
    setSearchQuery('');
    onClose();
  };

  const filteredTags = AVAILABLE_TAGS.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="size-5 mr-2 text-blue-600" />
            Manage Group Tags
          </DialogTitle>
          <DialogDescription>
            Add or remove tags for {group?.name || 'this group'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Info */}
          <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 flex-1">
              <div 
                className="size-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: group?.color || '#4A90E2' }}
              >
                <Users className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{group?.name}</div>
                <div className="text-xs text-gray-600">
                  {group?.contactCount?.toLocaleString() || 0} contacts
                </div>
              </div>
            </div>
          </div>

          {/* Current Tags */}
          {selectedTags.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Current Tags ({selectedTags.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagName) => {
                  const tag = AVAILABLE_TAGS.find((t) => t.name === tagName);
                  return (
                    <Badge
                      key={tagName}
                      className={`${TAG_COLOR_CLASSES[tag?.color || 'blue']} flex items-center gap-1 px-2 py-1`}
                    >
                      {tagName}
                      <button
                        onClick={() => handleToggleTag(tagName)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div>
            <Label htmlFor="search-tags" className="text-sm font-medium text-gray-700">
              Search Tags
            </Label>
            <Input
              id="search-tags"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search available tags..."
              className="mt-1"
            />
          </div>

          {/* Available Tags */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Available Tags
            </Label>
            <div className="border border-gray-200 rounded-lg p-3 max-h-[240px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleToggleTag(tag.name)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-3 rounded-full ${
                            tag.color === 'purple'
                              ? 'bg-purple-500'
                              : tag.color === 'blue'
                              ? 'bg-blue-500'
                              : tag.color === 'green'
                              ? 'bg-green-500'
                              : tag.color === 'yellow'
                              ? 'bg-yellow-500'
                              : tag.color === 'indigo'
                              ? 'bg-indigo-500'
                              : tag.color === 'pink'
                              ? 'bg-pink-500'
                              : tag.color === 'orange'
                              ? 'bg-orange-500'
                              : 'bg-cyan-500'
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700">{tag.name}</span>
                      </div>
                      {isSelected && <Check className="size-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
              {filteredTags.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No tags found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Tags help you organize and categorize your groups for better management.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Check className="size-4 mr-2" />
              Save Tags
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
