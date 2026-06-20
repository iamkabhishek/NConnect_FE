import { useState } from 'react';
import { UserPlus, X, Search, Users, Mail, Building } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Group } from './GroupsTable';

interface AddContactToGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onAddContacts?: (contactIds: string[]) => void;
}

// Mock contact data - in production, this would come from the workspace's contacts
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  isInGroup: boolean; // Whether the contact is already in the group
}

const MOCK_AVAILABLE_CONTACTS: Contact[] = [
  {
    id: 'CNT-006',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@example.com',
    company: 'Design Studio',
    status: 'subscribed',
    isInGroup: false,
  },
  {
    id: 'CNT-007',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.m@example.com',
    company: 'Marketing Pro',
    status: 'subscribed',
    isInGroup: false,
  },
  {
    id: 'CNT-008',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@example.com',
    company: 'Tech Innovations',
    status: 'subscribed',
    isInGroup: false,
  },
  {
    id: 'CNT-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    status: 'subscribed',
    isInGroup: true, // Already in group
  },
  {
    id: 'CNT-009',
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex.t@example.com',
    company: 'Software Solutions',
    status: 'subscribed',
    isInGroup: false,
  },
  {
    id: 'CNT-010',
    firstName: 'Rachel',
    lastName: 'Green',
    email: 'rachel.green@example.com',
    company: 'Creative Agency',
    status: 'subscribed',
    isInGroup: false,
  },
  {
    id: 'CNT-011',
    firstName: 'Chris',
    lastName: 'Evans',
    email: 'chris.evans@example.com',
    company: 'Media Corp',
    status: 'unsubscribed',
    isInGroup: false,
  },
  {
    id: 'CNT-012',
    firstName: 'Emma',
    lastName: 'Watson',
    email: 'emma.watson@example.com',
    company: 'Global Enterprises',
    status: 'subscribed',
    isInGroup: false,
  },
];

export function AddContactToGroupDialog({
  isOpen,
  onClose,
  group,
  onAddContacts,
}: AddContactToGroupDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Filter contacts based on search
  const filteredContacts = MOCK_AVAILABLE_CONTACTS.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.id.toLowerCase().includes(query) ||
      contact.firstName.toLowerCase().includes(query) ||
      contact.lastName.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query)
    );
  });

  const handleSelectContact = (contactId: string, isInGroup: boolean) => {
    if (isInGroup) return; // Can't select contacts already in group
    
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    const selectableContacts = filteredContacts.filter(c => !c.isInGroup);
    if (selectedContacts.length === selectableContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(selectableContacts.map(c => c.id));
    }
  };

  const handleAddContacts = () => {
    if (selectedContacts.length === 0) return;
    
    // In production, this would call the API to add contacts to the group
    onAddContacts?.(selectedContacts);
    alert(`Adding ${selectedContacts.length} contact(s) to "${group?.name}"`);
    
    // Reset and close
    setSelectedContacts([]);
    setSearchQuery('');
    onClose();
  };

  const handleCancel = () => {
    setSelectedContacts([]);
    setSearchQuery('');
    onClose();
  };

  const getStatusBadgeColor = (status: Contact['status']) => {
    switch (status) {
      case 'subscribed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'unsubscribed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'bounced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const selectableContactsCount = filteredContacts.filter(c => !c.isInGroup).length;
  const allSelectableSelected = selectableContactsCount > 0 && 
    selectedContacts.length === selectableContactsCount;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="size-5 mr-2 text-blue-600" />
            Add Contacts to Group
          </DialogTitle>
          <DialogDescription>
            Select contacts to add to {group?.name || 'this group'}. Contacts already in the group are disabled.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selection Info */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-sm text-gray-600">
              {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
            </div>
            {selectableContactsCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {allSelectableSelected ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>

          {/* Contacts Table */}
          <div className="flex-1 overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="size-12 mb-3 text-gray-300" />
                        <p className="font-medium text-gray-900 mb-1">No contacts found</p>
                        <p className="text-sm">Try adjusting your search query</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className={`${
                        contact.isInGroup
                          ? 'bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'cursor-pointer hover:bg-gray-50'
                      }`}
                      onClick={() => !contact.isInGroup && handleSelectContact(contact.id, contact.isInGroup)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={contact.isInGroup || selectedContacts.includes(contact.id)}
                          disabled={contact.isInGroup}
                          onCheckedChange={() => handleSelectContact(contact.id, contact.isInGroup)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {contact.firstName} {contact.lastName}
                          {contact.isInGroup && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-600"
                            >
                              In Group
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="size-3" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {contact.company ? (
                          <div className="flex items-center gap-1">
                            <Building className="size-3" />
                            {contact.company}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getStatusBadgeColor(contact.status)}`}
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-600">
              {filteredContacts.filter(c => !c.isInGroup).length} available contact
              {filteredContacts.filter(c => !c.isInGroup).length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleAddContacts}
                disabled={selectedContacts.length === 0}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <UserPlus className="size-4 mr-2" />
                Add {selectedContacts.length > 0 ? `(${selectedContacts.length})` : 'Contacts'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
