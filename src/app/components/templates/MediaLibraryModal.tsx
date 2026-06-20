import { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
  modifiedAt: string;
  dimensions: string;
  altText?: string;
  description?: string;
  workspaceId?: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: MediaFile) => void; // Callback when media is selected
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectMedia,
}: MediaLibraryModalProps) {
  const { selectedWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  // Sample media files with workspace associations
  const allMediaFiles: MediaFile[] = [
    {
      id: 'MED-001',
      name: 'summer-sale-banner.jpg',
      url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      size: '2.4 MB',
      type: 'image/jpeg',
      uploadedAt: '2025-01-15 10:30 AM',
      modifiedAt: '2025-01-16 03:45 PM',
      dimensions: '1920x1080',
      workspaceId: 'workspace-1',
    },
    {
      id: 'MED-002',
      name: 'product-showcase.png',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      size: '1.8 MB',
      type: 'image/png',
      uploadedAt: '2025-01-14 02:15 PM',
      modifiedAt: '2025-01-14 02:15 PM',
      dimensions: '1600x900',
      workspaceId: 'workspace-1',
    },
    {
      id: 'MED-003',
      name: 'newsletter-header.jpg',
      url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
      size: '3.1 MB',
      type: 'image/jpeg',
      uploadedAt: '2025-01-13 09:00 AM',
      modifiedAt: '2025-01-15 11:20 AM',
      dimensions: '2400x1200',
      workspaceId: 'workspace-1',
    },
    {
      id: 'MED-004',
      name: 'team-photo.jpg',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      size: '4.2 MB',
      type: 'image/jpeg',
      uploadedAt: '2025-01-12 04:45 PM',
      modifiedAt: '2025-01-12 04:45 PM',
      dimensions: '2000x1333',
      workspaceId: 'workspace-2',
    },
    {
      id: 'MED-005',
      name: 'logo-transparent.png',
      url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800',
      size: '512 KB',
      type: 'image/png',
      uploadedAt: '2025-01-11 01:20 PM',
      modifiedAt: '2025-01-13 10:30 AM',
      dimensions: '512x512',
      workspaceId: 'workspace-1',
    },
    {
      id: 'MED-006',
      name: 'hero-image.jpg',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      size: '3.8 MB',
      type: 'image/jpeg',
      uploadedAt: '2025-01-10 11:00 AM',
      modifiedAt: '2025-01-10 11:00 AM',
      dimensions: '1920x1280',
      workspaceId: 'workspace-2',
    },
    {
      id: 'MED-007',
      name: 'promo-banner.png',
      url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
      size: '2.1 MB',
      type: 'image/png',
      uploadedAt: '2025-01-09 03:30 PM',
      modifiedAt: '2025-01-11 02:15 PM',
      dimensions: '1200x628',
      workspaceId: 'workspace-1',
    },
    {
      id: 'MED-008',
      name: 'social-post.jpg',
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      size: '1.5 MB',
      type: 'image/jpeg',
      uploadedAt: '2025-01-08 12:00 PM',
      modifiedAt: '2025-01-08 12:00 PM',
      dimensions: '1080x1080',
      workspaceId: 'workspace-2',
    },
  ];

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  // Filter media files by workspace
  useEffect(() => {
    if (selectedWorkspace) {
      const workspaceMedia = allMediaFiles.filter(
        (file) => file.workspaceId === selectedWorkspace.id
      );
      setMediaFiles(workspaceMedia);
    } else {
      setMediaFiles([]);
    }
  }, [selectedWorkspace?.id]);

  const filteredFiles = mediaFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMedia = () => {
    const selected = mediaFiles.find((f) => f.id === selectedMediaId);
    if (selected) {
      onSelectMedia(selected);
      onClose();
      setSelectedMediaId(null);
      setSearchQuery('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media from Library</DialogTitle>
          <DialogDescription>
            Choose an image from your workspace media library
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search media files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="size-16 text-gray-300 mb-4" />
              <p className="text-gray-600">No media files found</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload files to your workspace media library first
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedMediaId(file.id)}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                    selectedMediaId === file.id
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedMediaId === file.id && (
                    <div className="absolute top-2 right-2 size-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{file.dimensions}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSelectMedia}
            disabled={!selectedMediaId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Insert Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}