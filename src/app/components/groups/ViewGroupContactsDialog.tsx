import { useState } from 'react';
import { Users, X, Search, Mail, Phone, MapPin, Tag, Download, ChevronDown, ChevronUp, UserPlus, Trash2, UserMinus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Input } from '@/app/components/ui/input';
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
import { AddContactToGroupDialog } from './AddContactToGroupDialog';
import React from 'react';

interface ViewGroupContactsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

// Mock contact data - in production, this would come from the actual contacts in the group
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  location?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  tags?: string[];
  addedDate: string;
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: 'CNT-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    location: 'New York, USA',
    status: 'subscribed',
    tags: ['VIP', 'Premium'],
    addedDate: 'Jan 10, 2025',
  },
  {
    id: 'CNT-002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Tech Solutions Inc',
    location: 'San Francisco, USA',
    status: 'subscribed',
    tags: ['Premium'],
    addedDate: 'Jan 12, 2025',
  },
  {
    id: 'CNT-003',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    company: 'Global Industries',
    location: 'Chicago, USA',
    status: 'subscribed',
    tags: ['Trial'],
    addedDate: 'Jan 14, 2025',
  },
  {
    id: 'CNT-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 456-7890',
    company: 'StartUp Hub',
    location: 'Austin, USA',
    status: 'unsubscribed',
    tags: ['Marketing'],
    addedDate: 'Jan 8, 2025',
  },
  {
    id: 'CNT-005',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@example.com',
    phone: '+1 (555) 567-8901',
    company: 'Enterprise Co',
    location: 'Boston, USA',
    status: 'subscribed',
    tags: ['VIP', 'Newsletter'],
    addedDate: 'Jan 15, 2025',
  },
];

export function ViewGroupContactsDialog({ isOpen, onClose, group }: ViewGroupContactsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [contactToRemove, setContactToRemove] = useState<Contact | null>(null);

  // Filter contacts based on search
  const filteredContacts = MOCK_CONTACTS.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.id.toLowerCase().includes(query) ||
      contact.firstName.toLowerCase().includes(query) ||
      contact.lastName.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query) ||
      contact.phone?.toLowerCase().includes(query) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleExport = () => {
    // In production, this would export contacts to CSV
    alert(`Exporting ${filteredContacts.length} contacts from "${group?.name}"`);
  };

  const handleAddContact = () => {
    // In production, this would open a dialog to add contacts to the group
    setIsAddContactDialogOpen(true);
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

  const toggleExpandContact = (contactId: string) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  const handleRemoveContact = (contact: Contact) => {
    setContactToRemove(contact);
  };

  const confirmRemoveContact = () => {
    if (contactToRemove) {
      // In production, this would call the API to remove the contact from the group
      alert(`Removing "${contactToRemove.firstName} ${contactToRemove.lastName}" from "${group?.name}"`);
      setContactToRemove(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="size-5 mr-2 text-blue-600" />
            Contacts in Group
          </DialogTitle>
          <DialogDescription>
            Viewing {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} in {group?.name || 'this group'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Group Info */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <div className="flex items-center space-x-2">
              <div 
                className="size-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: group?.color || '#4A90E2' }}
              >
                <Users className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{group?.name}</div>
                <div className="text-xs text-gray-600">
                  {group?.contactCount?.toLocaleString() || 0} total contacts
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddContact}
                className="gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
              >
                <UserPlus className="size-4" />
                Add Contact
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="size-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, company, phone, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
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
                  <TableHead>Tags</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="size-12 mb-3 text-gray-300" />
                        <p className="font-medium text-gray-900 mb-1">No contacts found</p>
                        <p className="text-sm">Try adjusting your search query</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => [
                    <TableRow key={contact.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleExpandContact(contact.id)}
                        >
                          {expandedContact === contact.id ? (
                            <ChevronUp className="size-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="size-4 text-gray-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="size-3" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {contact.company || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getStatusBadgeColor(contact.status)}`}
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags && contact.tags.length > 0 ? (
                            contact.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                          {contact.tags && contact.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {contact.addedDate}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveContact(contact)}
                        >
                          <Trash2 className="size-4 text-gray-500" />
                        </Button>
                      </TableCell>
                    </TableRow>,
                    
                    /* Expanded Details Row */
                    expandedContact === contact.id && (
                      <TableRow key={`${contact.id}-expanded`} className="bg-gray-50">
                        <TableCell colSpan={8} className="py-4">
                          <div className="grid grid-cols-2 gap-4 ml-8">
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-1">Contact ID</div>
                              <div className="text-sm text-gray-900">{contact.id}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-1">Email</div>
                              <div className="text-sm text-gray-900 flex items-center gap-1">
                                <Mail className="size-3 text-gray-400" />
                                {contact.email}
                              </div>
                            </div>
                            {contact.phone && (
                              <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">Phone</div>
                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                  <Phone className="size-3 text-gray-400" />
                                  {contact.phone}
                                </div>
                              </div>
                            )}
                            {contact.location && (
                              <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                  <MapPin className="size-3 text-gray-400" />
                                  {contact.location}
                                </div>
                              </div>
                            )}
                            {contact.company && (
                              <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">Company</div>
                                <div className="text-sm text-gray-900">{contact.company}</div>
                              </div>
                            )}
                            {contact.tags && contact.tags.length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">All Tags</div>
                                <div className="flex flex-wrap gap-1">
                                  {contact.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      <Tag className="size-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  ])
                )}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Add Contact Dialog */}
      <AddContactToGroupDialog
        isOpen={isAddContactDialogOpen}
        onClose={() => setIsAddContactDialogOpen(false)}
        group={group}
      />

      {/* Remove Contact Dialog */}
      <AlertDialog open={contactToRemove !== null} onOpenChange={() => setContactToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Contact from Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{contactToRemove?.firstName} {contactToRemove?.lastName}</strong> from <strong>{group?.name}</strong>? This will only remove them from this group, not delete the contact entirely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setContactToRemove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveContact}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove from Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}