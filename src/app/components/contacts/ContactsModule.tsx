import { useState, useEffect } from 'react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { ContactsHeader } from './ContactsHeader';
import { ContactsTable, Contact } from './ContactsTable';
import { AddContactDialog } from './AddContactDialog';
import { ImportContactsDialog } from './ImportContactsDialog';
import { FilterDialog, ContactFilters } from './FilterDialog';
import { SortConfig } from './SortMenu';
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

// Mock data
const mockContacts: Contact[] = [
  {
    id: 'WS-1_CONT-001',
    firstName: 'Alice',
    lastName: 'Johnson',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    status: 'subscribed',
    tags: ['customer', 'vip'],
    addedDate: 'Jan 15, 2026',
    lastEngagement: '2 days ago',
    workspaceId: 'workspace-1',
    city: 'New York',
    country: 'United States',
    company: 'Tech Corp',
    source: 'manual',
  },
  {
    id: 'WS-1_CONT-002',
    firstName: 'Bob',
    lastName: 'Smith',
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'subscribed',
    tags: ['newsletter'],
    addedDate: 'Jan 12, 2026',
    lastEngagement: '1 week ago',
    workspaceId: 'workspace-1',
    source: 'import',
  },
  {
    id: 'WS-2_CONT-001',
    firstName: 'Charlie',
    lastName: 'Davis',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    status: 'unsubscribed',
    tags: [],
    addedDate: 'Jan 10, 2026',
    lastEngagement: '2 weeks ago',
    workspaceId: 'workspace-2',
    source: 'manual',
  },
  {
    id: 'WS-1_CONT-003',
    firstName: 'Diana',
    lastName: 'Prince',
    name: 'Diana Prince',
    email: 'diana@example.com',
    phone: '+1 (555) 987-6543',
    status: 'subscribed',
    tags: ['customer', 'beta'],
    addedDate: 'Jan 8, 2026',
    lastEngagement: '3 days ago',
    workspaceId: 'workspace-1',
    jobTitle: 'Marketing Director',
    company: 'Brand Co',
    source: 'api',
  },
  {
    id: 'WS-2_CONT-002',
    firstName: 'Ethan',
    lastName: 'Hunt',
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    status: 'bounced',
    tags: ['prospect'],
    addedDate: 'Jan 5, 2026',
    workspaceId: 'workspace-2',
    source: 'import',
  },
];

interface ContactsModuleProps {
  userName?: string;
  onNavigate?: (page: string) => void;
}

export function ContactsModule({
  userName = 'John Doe',
  onNavigate,
}: ContactsModuleProps) {
  const { selectedWorkspace } = useWorkspace();
  
  // Filter contacts by selected workspace
  const workspaceContacts = mockContacts.filter(c => c.workspaceId === selectedWorkspace?.id);
  
  const [contacts, setContacts] = useState<Contact[]>(workspaceContacts);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(workspaceContacts);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ContactFilters>({
    status: [],
    source: [],
    tags: '',
    city: '',
    country: '',
    dateFrom: '',
    dateTo: '',
    hasPhone: null,
    consentOnly: false,
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'addedDate', direction: 'desc' });

  // Calculate active filters count
  const activeFiltersCount = 
    filters.status.length +
    filters.source.length +
    (filters.tags ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.hasPhone !== null ? 1 : 0) +
    (filters.consentOnly ? 1 : 0);

  // Get all available tags from contacts
  const availableTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  // Apply filters and sort function
  const applyFiltersAndSort = () => {
    let filtered = [...contacts];

    // Apply search query first - now searches across all fields
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((contact) => {
        // Search in name and email
        if (contact.name.toLowerCase().includes(lowercaseQuery)) return true;
        if (contact.email.toLowerCase().includes(lowercaseQuery)) return true;
        
        // Search in phone
        if (contact.phone && contact.phone.toLowerCase().includes(lowercaseQuery)) return true;
        
        // Search in location fields
        if (contact.city && contact.city.toLowerCase().includes(lowercaseQuery)) return true;
        if (contact.country && contact.country.toLowerCase().includes(lowercaseQuery)) return true;
        if (contact.state && contact.state.toLowerCase().includes(lowercaseQuery)) return true;
        if (contact.postalCode && contact.postalCode.toLowerCase().includes(lowercaseQuery)) return true;
        
        // Search in company and job title
        if (contact.company && contact.company.toLowerCase().includes(lowercaseQuery)) return true;
        if (contact.jobTitle && contact.jobTitle.toLowerCase().includes(lowercaseQuery)) return true;
        
        // Search in tags
        if (contact.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) return true;
        
        // Search in status
        if (contact.status.toLowerCase().includes(lowercaseQuery)) return true;
        
        // Search in source
        if (contact.source && contact.source.toLowerCase().includes(lowercaseQuery)) return true;
        
        return false;
      });
    }

    // Apply filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(c => filters.status.includes(c.status));
    }
    if (filters.source.length > 0) {
      filtered = filtered.filter(c => filters.source.includes(c.source));
    }
    if (filters.tags) {
      const filterTags = filters.tags.split(',').map(t => t.trim().toLowerCase());
      filtered = filtered.filter(c => 
        c.tags.some(tag => filterTags.some(ft => tag.toLowerCase().includes(ft)))
      );
    }
    if (filters.city) {
      filtered = filtered.filter(c => c.city?.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.country) {
      filtered = filtered.filter(c => c.country?.toLowerCase().includes(filters.country.toLowerCase()));
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(c => new Date(c.addedDate) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => new Date(c.addedDate) <= new Date(filters.dateTo));
    }
    if (filters.hasPhone !== null) {
      filtered = filtered.filter(c => (filters.hasPhone ? !!c.phone : !c.phone));
    }
    if (filters.consentOnly) {
      filtered = filtered.filter(c => c.status === 'subscribed');
    }

    // Apply sort
    if (sortConfig.field) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof Contact];
        const bValue = b[sortConfig.field as keyof Contact];
        
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        
        // Special handling for date sorting
        if (sortConfig.field === 'addedDate') {
          const aDate = new Date(aValue as string).getTime();
          const bDate = new Date(bValue as string).getTime();
          return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        // String comparison for text fields
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
        
        // Numeric comparison for numbers
        return sortConfig.direction === 'asc' 
          ? (aValue as number) - (bValue as number) 
          : (bValue as number) - (aValue as number);
      });
    }

    setFilteredContacts(filtered);
  };

  // Update contacts when workspace changes
  useEffect(() => {
    const workspaceContacts = mockContacts.filter(c => c.workspaceId === selectedWorkspace?.id);
    setContacts(workspaceContacts);
  }, [selectedWorkspace?.id]);

  // Apply filters and sort whenever they change
  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortConfig, contacts, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddContact = (newContact: Omit<Contact, 'id' | 'addedDate' | 'workspaceId' | 'name'>) => {
    // Generate workspace-prefixed contact ID automatically
    // Format: WS-{workspaceNumber}_CONT-{contactNumber}
    // Example: WS-1_CONT-001, WS-2_CONT-015
    const workspacePrefix = selectedWorkspace?.id ? `WS-${selectedWorkspace.id.split('-')[1]?.toUpperCase() || '1'}` : 'WS-DEFAULT';
    const contactNumber = contacts.length + 1;
    const contactId = `${workspacePrefix}_CONT-${String(contactNumber).padStart(3, '0')}`;
    
    // Compute full name from firstName and lastName
    const fullName = [newContact.firstName, newContact.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';
    
    const contact: Contact = {
      ...newContact,
      id: contactId,
      name: fullName,
      workspaceId: selectedWorkspace?.id || 'default-workspace',
      addedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setAddDialogOpen(true);
  };

  const handleUpdateContact = (updatedData: Omit<Contact, 'id' | 'addedDate' | 'workspaceId' | 'name'>) => {
    if (!editingContact) return;

    // Compute full name from firstName and lastName
    const fullName = [updatedData.firstName, updatedData.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';

    const updatedContacts = contacts.map((c) =>
      c.id === editingContact.id
        ? { ...c, ...updatedData, name: fullName }
        : c
    );

    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    setEditingContact(undefined);
  };

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!contactToDelete) return;

    const updatedContacts = contacts.filter((c) => c.id !== contactToDelete.id);
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    setDeleteDialogOpen(false);
    setContactToDelete(undefined);
  };

  const handleBulkAction = (action: string, contactIds: string[]) => {
    console.log('Bulk action:', action, contactIds);
    alert(`Bulk ${action} for ${contactIds.length} contacts`);
  };

  const handleImport = () => {
    setImportDialogOpen(true);
  };

  const handleExport = () => {
    alert('Export functionality would download CSV with all contacts');
  };

  const handleImportComplete = (count: number) => {
    // In real app, reload contacts from API
    alert(`Successfully imported ${count} contacts!`);
    setImportDialogOpen(false);
  };

  const handleFilterChange = (newFilters: ContactFilters) => {
    setFilters(newFilters);
    applyFiltersAndSort();
  };

  const handleSortChange = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
    applyFiltersAndSort();
  };

  return (
    <ModuleLayout activeItem="contacts" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Contacts Header */}
        <ContactsHeader
          onImport={handleImport}
          onExport={handleExport}
          onAddContact={() => {
            setEditingContact(undefined);
            setAddDialogOpen(true);
          }}
          onSearch={handleSearch}
          onFilterClick={() => setFilterDialogOpen(true)}
          onSortChange={handleSortChange}
          currentSort={sortConfig}
          totalContacts={contacts.length}
          activeFiltersCount={activeFiltersCount}
          workspaceName={selectedWorkspace?.name}
        />

        {/* Contacts Table */}
        <ContactsTable
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onBulkAction={handleBulkAction}
        />
      </div>

      {/* Dialogs */}
      <AddContactDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setEditingContact(undefined);
        }}
        onSave={editingContact ? handleUpdateContact : handleAddContact}
        editContact={editingContact}
        currentWorkspace={selectedWorkspace?.name}
        availableWorkspaces={[]} // Can be populated if multi-workspace selection is needed
        existingContacts={contacts} // Pass all contacts for duplicate checking
      />

      <ImportContactsDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImportComplete={handleImportComplete}
      />

      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleFilterChange}
        currentFilters={filters}
        availableTags={availableTags}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{contactToDelete?.name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModuleLayout>
  );
}