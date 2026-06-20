import { ArrowUpDown, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export type SortField = 'name' | 'email' | 'addedDate' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface SortMenuProps {
  currentSort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
}

export function SortMenu({ currentSort, onSortChange }: SortMenuProps) {
  const sortOptions: { field: SortField; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'addedDate', label: 'Date Added' },
    { field: 'status', label: 'Status' },
  ];

  const handleSort = (field: SortField) => {
    if (currentSort?.field === field) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Default to ascending for new field
      onSortChange({
        field,
        direction: 'asc',
      });
    }
  };

  // Safety check for undefined currentSort
  if (!currentSort) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowUpDown className="size-4 mr-2" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortOptions.map((option) => {
          const isActive = currentSort.field === option.field;
          const direction = isActive ? currentSort.direction : 'asc';
          
          return (
            <DropdownMenuItem
              key={option.field}
              onClick={() => handleSort(option.field)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                <div className="flex items-center gap-2">
                  {isActive && (
                    <>
                      {direction === 'asc' ? (
                        <ArrowUp className="size-4 text-blue-500" />
                      ) : (
                        <ArrowDown className="size-4 text-blue-500" />
                      )}
                      <Check className="size-4 text-blue-500" />
                    </>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}