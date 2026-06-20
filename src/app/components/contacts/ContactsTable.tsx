import { useState } from 'react';
import { MoreVertical, Mail, Tag, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { SendEmailDialog } from './SendEmailDialog';
import { ManageTagsDialog } from './ManageTagsDialog';

export interface Contact {
  id: string;
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  
  // Demographics
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  language?: string;
  
  // Location
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  
  // Professional
  company?: string;
  jobTitle?: string;
  industry?: string;
  
  // Engagement
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'not-applicable';
  tags: string[];
  preferences?: string; // JSON string of preferences
  notes?: string;
  
  // Consent
  consentObtained?: boolean;
  
  // System fields
  addedDate: string;
  lastEngagement?: string;
  lastModified?: string;
  source?: string; // e.g., 'manual', 'import', 'api'
  workspaceId: string; // Required - must be associated with workspace
  
  // Computed field for display
  name?: string; // Computed from firstName + lastName
}

interface ContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onBulkAction: (action: string, contactIds: string[]) => void;
  onUpdateTags?: (contactId: string, tags: string[]) => void;
}

export function ContactsTable({ contacts, onEdit, onDelete, onBulkAction, onUpdateTags }: ContactsTableProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedContactForEmail, setSelectedContactForEmail] = useState<Contact | null>(null);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [selectedContactForTags, setSelectedContactForTags] = useState<Contact | null>(null);

  const handleSendEmail = (contact: Contact) => {
    setSelectedContactForEmail(contact);
    setEmailDialogOpen(true);
  };

  const handleManageTags = (contact: Contact) => {
    setSelectedContactForTags(contact);
    setTagsDialogOpen(true);
  };

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleAll = () => {
    setSelectedContacts((prev) =>
      prev.length === contacts.length ? [] : contacts.map((c) => c.id)
    );
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'subscribed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'unsubscribed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'bounced':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'not-applicable':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Contact['status']) => {
    switch (status) {
      case 'subscribed':
        return <CheckCircle className="size-3 mr-1" />;
      case 'unsubscribed':
        return <XCircle className="size-3 mr-1" />;
      case 'bounced':
        return <XCircle className="size-3 mr-1" />;
      case 'not-applicable':
        return <XCircle className="size-3 mr-1" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Bulk Actions Bar */}
      {selectedContacts.length > 0 && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('tag', selectedContacts)}
            >
              <Tag className="size-4 mr-2" />
              Add Tags
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('export', selectedContacts)}
            >
              Export Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onBulkAction('delete', selectedContacts);
                setSelectedContacts([]);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Last Engagement</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="text-gray-500">
                    <Mail className="size-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No contacts found</p>
                    <p className="text-sm mt-1">Get started by importing or adding contacts</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContact(contact.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{contact.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">{contact.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex items-center w-fit ${getStatusColor(contact.status)}`}
                    >
                      {getStatusIcon(contact.status)}
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.length === 0 ? (
                        <span className="text-sm text-gray-400">No tags</span>
                      ) : (
                        contact.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{contact.addedDate}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {contact.lastEngagement || '—'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(contact)}>
                          <Edit className="size-4 mr-2" />
                          Edit Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendEmail(contact)}>
                          <Mail className="size-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageTags(contact)}>
                          <Tag className="size-4 mr-2" />
                          Manage Tags
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(contact)}
                          className="text-red-600"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {contacts.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">1-{contacts.length}</span> of{' '}
            <span className="font-medium">{contacts.length}</span> contacts
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Send Email Dialog */}
      <SendEmailDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        contact={selectedContactForEmail}
      />

      {/* Manage Tags Dialog */}
      <ManageTagsDialog
        open={tagsDialogOpen}
        onClose={() => setTagsDialogOpen(false)}
        contact={selectedContactForTags}
        onUpdateTags={onUpdateTags}
      />
    </div>
  );
}