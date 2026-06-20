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
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { X, Save, Search, SlidersHorizontal, Users } from 'lucide-react';
import { Group } from './GroupsTable';
import { GroupFormData } from './CreateGroupDialog';

interface EditGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdateGroup: (groupId: string, data: GroupFormData) => void;
  group: Group | null;
}

const COLOR_OPTIONS = [
  { name: 'Blue', value: '#4A90E2' },
  { name: 'Purple', value: '#9B59B6' },
  { name: 'Green', value: '#2ECC71' },
  { name: 'Orange', value: '#E67E22' },
  { name: 'Red', value: '#E74C3C' },
  { name: 'Pink', value: '#EC407A' },
  { name: 'Teal', value: '#26A69A' },
  { name: 'Indigo', value: '#5C6BC0' },
];

export function EditGroupDialog({
  open,
  onClose,
  onUpdateGroup,
  group,
}: EditGroupDialogProps) {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    color: '#4A90E2',
    contactIds: [],
  });

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Contact search and filter state
  const [contactSearch, setContactSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Update form when group changes
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        color: group.color,
        contactIds: [],
      });
      // In a real app, you'd fetch the group's contacts here
      setSelectedContacts([]);
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (group) {
      onUpdateGroup(group.id, { ...formData, contactIds: selectedContacts });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      color: '#4A90E2',
      contactIds: [],
    });
    setSelectedContacts([]);
    setContactSearch('');
    setStatusFilter('all');
    setSortBy('name');
    onClose();
  };

  // Mock contacts for demonstration with additional fields
  const availableContacts = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', dateAdded: '2025-01-10', tags: ['premium', 'newsletter'] },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'subscribed', dateAdded: '2025-01-12', tags: ['newsletter'] },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'active', dateAdded: '2025-01-08', tags: ['trial'] },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', status: 'unsubscribed', dateAdded: '2025-01-05', tags: [] },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', status: 'active', dateAdded: '2025-01-15', tags: ['premium'] },
    { id: '6', name: 'Diana Prince', email: 'diana@example.com', status: 'subscribed', dateAdded: '2025-01-14', tags: ['newsletter', 'vip'] },
    { id: '7', name: 'Ethan Hunt', email: 'ethan@example.com', status: 'active', dateAdded: '2025-01-11', tags: ['trial'] },
    { id: '8', name: 'Fiona Gallagher', email: 'fiona@example.com', status: 'subscribed', dateAdded: '2025-01-09', tags: ['premium', 'newsletter'] },
  ];

  // Filter and sort contacts
  const filteredAndSortedContacts = availableContacts
    .filter((contact) => {
      // Search filter
      const matchesSearch =
        contact.id.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.tags.some((tag) => tag.toLowerCase().includes(contactSearch.toLowerCase()));

      // Status filter
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'dateAdded':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setContactSearch('');
    setStatusFilter('all');
    setSortBy('name');
  };

  const hasActiveFilters = contactSearch !== '' || statusFilter !== 'all' || sortBy !== 'name';

  const toggleContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Update group details and manage contacts
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Group ID Display */}
            {group && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Label className="text-xs font-medium text-blue-900">Group ID</Label>
                <div className="text-sm font-mono text-blue-700 mt-1">{group.id}</div>
              </div>
            )}

            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Group Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Premium Subscribers, Newsletter Readers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="What is this group for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label>Group Color</Label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-gray-900 scale-110 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Current Group Info */}
            {group && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Current Contacts</p>
                    <p className="text-xs text-blue-700 mt-1">
                      This group currently has {group.contactCount} contact(s)
                    </p>
                  </div>
                  <Badge variant="secondary">{group.contactCount}</Badge>
                </div>
              </div>
            )}

            {/* Add/Remove Contacts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Manage Contacts</Label>
                <span className="text-sm text-gray-500">
                  {selectedContacts.length} selected for addition
                </span>
              </div>

              {/* Search and Filters */}
              <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, tags, or ID..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">Filters:</span>
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="subscribed">Subscribed</SelectItem>
                      <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="email">Sort by Email</SelectItem>
                      <SelectItem value="dateAdded">Sort by Date</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-600">Active:</span>
                    {contactSearch && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        Search: "{contactSearch}"
                        <button
                          type="button"
                          onClick={() => setContactSearch('')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="size-2.5" />
                        </button>
                      </Badge>
                    )}
                    {statusFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        Status: {statusFilter}
                        <button
                          type="button"
                          onClick={() => setStatusFilter('all')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="size-2.5" />
                        </button>
                      </Badge>
                    )}
                    {sortBy !== 'name' && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        Sort: {sortBy}
                        <button
                          type="button"
                          onClick={() => setSortBy('name')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="size-2.5" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    Showing {filteredAndSortedContacts.length} of {availableContacts.length} contacts
                  </span>
                  {filteredAndSortedContacts.length === 0 && contactSearch && (
                    <span className="text-orange-600">No matches found</span>
                  )}
                </div>
              </div>

              {/* Contacts List */}
              <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                {filteredAndSortedContacts.length > 0 ? (
                  filteredAndSortedContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        {contact.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {contact.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          contact.status === 'active'
                            ? 'default'
                            : contact.status === 'subscribed'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {contact.status}
                      </Badge>
                    </label>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="size-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-medium">No contacts found</p>
                    <p className="text-xs">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Contacts Preview */}
            {selectedContacts.length > 0 && (
              <div className="space-y-2">
                <Label>Contacts to Add</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedContacts.map((contactId) => {
                    const contact = availableContacts.find((c) => c.id === contactId);
                    return (
                      <Badge key={contactId} variant="secondary" className="gap-1 pr-1">
                        {contact?.name}
                        <button
                          type="button"
                          onClick={() => toggleContact(contactId)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="size-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}