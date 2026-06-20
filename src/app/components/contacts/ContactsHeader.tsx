import { Search, Plus, Upload, Download, Filter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { SortMenu, SortConfig } from './SortMenu';

interface ContactsHeaderProps {
  onImport: () => void;
  onExport: () => void;
  onAddContact: () => void;
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  onSortChange: (sort: SortConfig) => void;
  currentSort: SortConfig;
  totalContacts: number;
  activeFiltersCount: number;
  workspaceName?: string;
}

export function ContactsHeader({
  onImport,
  onExport,
  onAddContact,
  onSearch,
  onFilterClick,
  onSortChange,
  currentSort,
  totalContacts,
  activeFiltersCount,
  workspaceName,
}: ContactsHeaderProps) {
  return (
    <div className="mb-6">
      {/* Title and Total */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">
            Manage your {totalContacts.toLocaleString()} contacts{workspaceName ? ` in ${workspaceName}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onExport}>
            <Download className="size-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onImport}>
            <Upload className="size-4 mr-2" />
            Import
          </Button>
          <Button onClick={onAddContact} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="size-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, phone, city, country, company, tags..."
            className="pl-10 h-11"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <Button variant="outline" onClick={onFilterClick}>
          <Filter className="size-4 mr-2" />
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
        
        <SortMenu onSortChange={onSortChange} currentSort={currentSort} />
      </div>
    </div>
  );
}