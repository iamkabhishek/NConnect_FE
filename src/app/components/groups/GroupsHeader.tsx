import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Search, Plus, Filter, X } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface GroupsHeaderProps {
  onCreateGroup: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

// Available tags for filtering
const AVAILABLE_TAGS = ['Marketing', 'Sales', 'Newsletter', 'Premium', 'Trial', 'Onboarding', 'VIP', 'Inactive'];

export function GroupsHeader({
  onCreateGroup,
  searchQuery,
  onSearchChange,
  sortBy = 'name-asc',
  onSortChange,
  selectedTags = [],
  onTagsChange,
}: GroupsHeaderProps) {
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange?.(newTags);
  };

  const handleClearFilters = () => {
    onSearchChange('');
    onTagsChange?.([]);
    onSortChange?.('name-asc');
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== 'name-asc';

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-600 mt-1">
            Organize contacts into "Workspace"
          </p>
        </div>
        <Button onClick={onCreateGroup} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search, Sort and Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by ID, name, description, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="contacts-high">Contacts (High)</SelectItem>
            <SelectItem value="contacts-low">Contacts (Low)</SelectItem>
            <SelectItem value="date-newest">Date (Newest)</SelectItem>
            <SelectItem value="date-oldest">Date (Oldest)</SelectItem>
          </SelectContent>
        </Select>

        {/* Tags Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {AVAILABLE_TAGS.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <X className="size-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-sm text-gray-600">Active Filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: &quot;{searchQuery}&quot;
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              Tag: {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {sortBy !== 'name-asc' && (
            <Badge variant="secondary" className="gap-1">
              Sort: {sortBy === 'name-desc' ? 'Name (Z-A)' : sortBy === 'contacts-high' ? 'Contacts (High)' : sortBy === 'contacts-low' ? 'Contacts (Low)' : sortBy === 'date-newest' ? 'Date (Newest)' : 'Date (Oldest)'}
              <button
                onClick={() => onSortChange?.('name-asc')}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}