import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export interface ContactFilters {
  status: string[];
  source: string[];
  tags: string;
  city: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  hasPhone: boolean | null;
  consentOnly: boolean;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: ContactFilters) => void;
  currentFilters: ContactFilters;
  availableTags: string[];
}

export function FilterDialog({ open, onClose, onApply, currentFilters, availableTags }: FilterDialogProps) {
  const [filters, setFilters] = useState<ContactFilters>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: ContactFilters = {
      status: [],
      source: [],
      tags: '',
      city: '',
      country: '',
      dateFrom: '',
      dateTo: '',
      hasPhone: null,
      consentOnly: false,
    };
    setFilters(clearedFilters);
    onApply(clearedFilters);
    onClose();
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const toggleSource = (source: string) => {
    setFilters(prev => ({
      ...prev,
      source: prev.source.includes(source)
        ? prev.source.filter(s => s !== source)
        : [...prev.source, source]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-white">
          <DialogHeader>
            <DialogTitle>Filter Contacts</DialogTitle>
            <DialogDescription>
              Apply filters to find specific contacts in your list
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Subscription Status */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Subscription Status</Label>
            <div className="space-y-2">
              {['subscribed', 'unsubscribed', 'bounced', 'not-applicable'].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer capitalize">
                    {status === 'not-applicable' ? 'Not Applicable' : status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Source</Label>
            <div className="space-y-2">
              {['manual', 'import', 'api', 'form'].map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={`source-${source}`}
                    checked={filters.source.includes(source)}
                    onCheckedChange={() => toggleSource(source)}
                  />
                  <Label htmlFor={`source-${source}`} className="text-sm font-normal cursor-pointer capitalize">
                    {source}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="filter-tags" className="text-sm font-semibold">
              Tags
            </Label>
            <Input
              id="filter-tags"
              type="text"
              placeholder="Enter tags to filter (comma separated)"
              className="h-10"
              value={filters.tags}
              onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              Enter one or more tags separated by commas
            </p>
          </div>

          {/* Location Filters */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Location</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-city" className="text-sm">
                  City
                </Label>
                <Input
                  id="filter-city"
                  type="text"
                  placeholder="e.g., New York"
                  className="h-10"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-country" className="text-sm">
                  Country
                </Label>
                <Input
                  id="filter-country"
                  type="text"
                  placeholder="e.g., United States"
                  className="h-10"
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Date Added</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-date-from" className="text-sm">
                  From
                </Label>
                <Input
                  id="filter-date-from"
                  type="date"
                  className="h-10"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-date-to" className="text-sm">
                  To
                </Label>
                <Input
                  id="filter-date-to"
                  type="date"
                  className="h-10"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Additional Filters</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-phone"
                  checked={filters.hasPhone === true}
                  onCheckedChange={(checked) => 
                    setFilters({ ...filters, hasPhone: checked ? true : null })
                  }
                />
                <Label htmlFor="has-phone" className="text-sm font-normal cursor-pointer">
                  Has phone number
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent-only"
                  checked={filters.consentOnly}
                  onCheckedChange={(checked) => 
                    setFilters({ ...filters, consentOnly: checked as boolean })
                  }
                />
                <Label htmlFor="consent-only" className="text-sm font-normal cursor-pointer">
                  Consent obtained only
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between bg-white">
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
