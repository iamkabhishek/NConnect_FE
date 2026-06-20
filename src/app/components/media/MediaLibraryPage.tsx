import { useState, useRef, useEffect } from 'react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { Button } from '@/app/components/ui/button';
import {
  Image,
  Upload,
  Search,
  LayoutGrid,
  List,
  Trash2,
  Download,
  MoreVertical,
  X,
  Filter,
  Check,
  Copy,
  Eye,
  Edit2,
  ExternalLink,
} from 'lucide-react';

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

interface PendingFile {
  file: File;
  preview: string;
  name: string;
  altText: string;
  description: string;
  size: string;
  type: string;
}

interface MediaLibraryPageProps {
  userName?: string;
  onNavigate?: (page: string) => void;
}

export function MediaLibraryPage({ userName = 'John Doe', onNavigate }: MediaLibraryPageProps) {
  const { selectedWorkspace } = useWorkspace();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editFileName, setEditFileName] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);
  
  // Enhanced upload flow state
  const [uploadStep, setUploadStep] = useState<1 | 2 | 3>(1);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Sample media files with workspace associations
  const allMediaFiles: MediaFile[] = [
    {
      id: 'MED-001',
      name: 'summer-sale-banner.jpg',
      url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
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
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
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
      url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
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
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
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
      url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400',
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
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
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
      url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
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
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
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
    const workspaceMedia = allMediaFiles.filter(file => file.workspaceId === selectedWorkspace?.id);
    setMediaFiles(workspaceMedia);
  }, [selectedWorkspace?.id]);

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === 'all' ||
      (filterType === 'images' && file.type.startsWith('image/'));
    return matchesSearch && matchesType;
  });

  const toggleFileSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const selectAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id));
    }
  };

  const deleteSelectedFiles = () => {
    if (confirm(`Delete ${selectedFiles.length} file(s)?`)) {
      setMediaFiles(mediaFiles.filter((file) => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  // Enhanced upload flow functions
  const openUploadModal = () => {
    setUploadStep(1);
    setPendingFiles([]);
    setUploadedCount(0);
    setShowUploadModal(true);
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const newPendingFiles: PendingFile[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      altText: '',
      description: '',
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
    }));

    setPendingFiles(newPendingFiles);
    setUploadStep(2);
  };

  const updatePendingFileMetadata = (
    index: number,
    field: 'name' | 'altText' | 'description',
    value: string
  ) => {
    setPendingFiles((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, [field]: value } : file
      )
    );
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    if (pendingFiles.length === 1) {
      setUploadStep(1);
    }
  };

  const finalizeUpload = () => {
    const currentDateTime = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newMediaFiles: MediaFile[] = pendingFiles.map((pendingFile, index) => {
      const fileId = 'MED-' + String(mediaFiles.length + index + 1).padStart(3, '0');
      return {
        id: fileId,
        name: pendingFile.name,
        url: pendingFile.preview,
        size: pendingFile.size,
        type: pendingFile.type,
        uploadedAt: currentDateTime,
        modifiedAt: currentDateTime,
        dimensions: '1920x1080', // Would be calculated from actual image
        altText: pendingFile.altText,
        description: pendingFile.description,
      };
    });

    setMediaFiles((prev) => [...newMediaFiles, ...prev]);
    setUploadedCount(newMediaFiles.length);
    setUploadStep(3);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setPendingFiles([]);
    setUploadStep(1);
    setUploadedCount(0);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    // In a real app, you would upload these files to a server
    Array.from(files).forEach((file) => {
      const fileId = 'MED-' + String(mediaFiles.length + 1).padStart(3, '0');
      const currentDateTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const newFile: MediaFile = {
        id: fileId,
        name: file.name,
        url: URL.createObjectURL(file),
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        uploadedAt: currentDateTime,
        modifiedAt: currentDateTime,
        dimensions: '1920x1080', // Would be calculated from the actual image
      };
      setMediaFiles((prev) => [newFile, ...prev]);
    });

    setShowUploadModal(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const copyImageUrl = (url: string) => {
    const tempInput = document.createElement('input');
    tempInput.value = url;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    try {
      document.execCommand('copy');
      const successMsg = document.createElement('div');
      successMsg.textContent = 'URL copied to clipboard!';
      successMsg.style.position = 'fixed';
      successMsg.style.top = '20px';
      successMsg.style.right = '20px';
      successMsg.style.backgroundColor = '#10B981';
      successMsg.style.color = 'white';
      successMsg.style.padding = '12px 24px';
      successMsg.style.borderRadius = '8px';
      successMsg.style.zIndex = '9999';
      successMsg.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      document.body.appendChild(successMsg);

      setTimeout(() => {
        successMsg.remove();
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy URL. Please copy manually: ' + url);
    }

    document.body.removeChild(tempInput);
  };

  const downloadFile = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const viewDetailedPage = (file: MediaFile) => {
    setSelectedFile(file);
    setShowDetailedView(true);
  };

  const openEditModal = (file: MediaFile) => {
    setSelectedFile(file);
    setEditFileName(file.name);
    setEditAltText(file.altText || '');
    setEditDescription(file.description || '');
    setNewImageUrl(null); // Reset new image URL
    setShowEditModal(true);
  };

  const handleEditImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setNewImageUrl(imageUrl);
  };

  const saveFileEdit = () => {
    if (selectedFile && editFileName.trim()) {
      const currentDateTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      
      const updatedFile = {
        ...selectedFile,
        name: editFileName.trim(),
        url: newImageUrl || selectedFile.url, // Use new image if uploaded
        altText: editAltText,
        description: editDescription,
        modifiedAt: currentDateTime,
      };
      
      setMediaFiles(
        mediaFiles.map((file) =>
          file.id === selectedFile.id ? updatedFile : file
        )
      );
      setShowEditModal(false);
      setNewImageUrl(null); // Reset new image URL
      
      if (showDetailedView && selectedFile) {
        setSelectedFile(updatedFile);
      }
    }
  };

  const deleteFile = (fileId: string) => {
    if (confirm('Delete this file?')) {
      setMediaFiles(mediaFiles.filter((file) => file.id !== fileId));
      setShowDetailedView(false);
      setSelectedFile(null);
    }
  };

  // If detailed view is shown, render it instead of the main library
  if (showDetailedView && selectedFile) {
    return (
      <ModuleLayout activeItem="media" userName={userName} onNavigate={onNavigate}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => setShowDetailedView(false)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <X className="size-5" />
            Back to Media Library
          </button>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Image className="size-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{selectedFile.name}</h1>
              </div>
              <p className="text-gray-600">Media ID: {selectedFile.id}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => openEditModal(selectedFile)}
              >
                    <Edit2 className="size-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadFile(selectedFile)}
                  >
                    <Download className="size-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => deleteFile(selectedFile.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image Preview - Left Column (2/3) */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={selectedFile.url}
                        alt={selectedFile.name}
                        className="max-w-full max-h-[600px] rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* File Details - Right Column (1/3) */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">File Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Media ID
                        </label>
                        <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded border">
                          {selectedFile.id}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          File Name
                        </label>
                        <p className="text-gray-900">{selectedFile.name}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          File Size
                        </label>
                        <p className="text-gray-900">{selectedFile.size}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Dimensions
                        </label>
                        <p className="text-gray-900">{selectedFile.dimensions}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Type
                        </label>
                        <p className="text-gray-900">{selectedFile.type}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Uploaded
                        </label>
                        <p className="text-gray-900">{selectedFile.uploadedAt}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Last Modified
                        </label>
                        <p className="text-gray-900">{selectedFile.modifiedAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Image URL</h2>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={selectedFile.url}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm font-mono"
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => copyImageUrl(selectedFile.url)}
                      >
                        <Copy className="size-4 mr-2" />
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Edit Modal - Also render in detailed view */}
        {showEditModal && selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Edit Media File</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="size-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="relative group">
                    <img
                      src={newImageUrl || selectedFile.url}
                      alt={selectedFile.name}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={() => editImageInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Upload className="size-8 text-white mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">Click to upload new image</p>
                      </div>
                    </div>
                    {newImageUrl && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        New Image
                      </div>
                    )}
                  </div>
                  <input
                    ref={editImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEditImageUpload(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Media ID (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Media ID
                  </label>
                  <input
                    type="text"
                    value={selectedFile.id}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600 font-mono"
                  />
                </div>

                {/* File Name (Editable) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter file name"
                  />
                </div>

                {/* Alt Text (Editable) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe this image"
                  />
                </div>

                {/* Description (Editable) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a description"
                  />
                </div>

                {/* File Info */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Size
                    </label>
                    <p className="text-gray-900">{selectedFile.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Dimensions
                    </label>
                    <p className="text-gray-900">{selectedFile.dimensions}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveFileEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!editFileName.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout activeItem="media" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image className="size-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            </div>
            <p className="text-gray-600">Manage your images and files</p>
          </div>
          <Button
            onClick={() => openUploadModal()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="size-4 mr-2" />
            Upload Files
          </Button>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Filter */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <Filter className="size-4 mr-2" />
                      {filterType === 'all' ? 'All Files' : 'Images Only'}
                    </Button>

                    {showFilterDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowFilterDropdown(false)}
                        />
                        <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                          <button
                            onClick={() => {
                              setFilterType('all');
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                              filterType === 'all' ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                          >
                            All Files
                          </button>
                          <button
                            onClick={() => {
                              setFilterType('images');
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                              filterType === 'images' ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                          >
                            Images Only
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Select All */}
                  {filteredFiles.length > 0 && (
                    <Button variant="outline" onClick={selectAllFiles}>
                      {selectedFiles.length === filteredFiles.length ? (
                        <>
                          <Check className="size-4 mr-2" />
                          Deselect All
                        </>
                      ) : (
                        <>Select All</>
                      )}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Delete Selected */}
                  {selectedFiles.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={deleteSelectedFiles}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete ({selectedFiles.length})
                    </Button>
                  )}

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <LayoutGrid className="size-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <List className="size-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Files Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            {/* Files Grid/List */}
            {filteredFiles.length === 0 ? (
              <div className="bg-white rounded-lg border p-12 text-center">
                <Image className="size-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'Upload your first file to get started'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => openUploadModal()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="size-4 mr-2" />
                    Upload Files
                  </Button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`bg-white rounded-lg border overflow-hidden cursor-pointer transition-all ${
                      selectedFiles.includes(file.id)
                        ? 'ring-2 ring-blue-600 border-blue-600'
                        : 'hover:shadow-md'
                    }`}
                  >
                    {/* Image Preview */}
                    <div
                      className="relative aspect-video bg-gray-100 overflow-hidden group"
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Checkbox Overlay */}
                      <div className="absolute top-2 left-2">
                        <div
                          className={`size-6 rounded border-2 flex items-center justify-center transition-all ${
                            selectedFiles.includes(file.id)
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white border-gray-300 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {selectedFiles.includes(file.id) && (
                            <Check className="size-4 text-white" />
                          )}
                        </div>
                      </div>
                      {/* Quick Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewDetailedPage(file);
                          }}
                          className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50"
                        >
                          <ExternalLink className="size-4 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(file);
                          }}
                          className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50"
                        >
                          <Edit2 className="size-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-medium text-gray-900 truncate"
                            title={file.name}
                          >
                            {file.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono mt-1">{file.id}</p>
                        </div>
                        <div className="relative group">
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === file.id ? null : file.id);
                            }}
                          >
                            <MoreVertical className="size-4 text-gray-600" />
                          </button>
                          
                          {/* Background overlay */}
                          {openDropdownId === file.id && (
                            <div
                              className="fixed inset-0 z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                              }}
                            />
                          )}
                          
                          {/* Dropdown */}
                          {openDropdownId === file.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-20">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  viewDetailedPage(file);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <ExternalLink className="size-4" />
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  openEditModal(file);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit2 className="size-4" />
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  copyImageUrl(file.url);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy className="size-4" />
                                Copy URL
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  downloadFile(file);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Download className="size-4" />
                                Download
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  deleteFile(file.id);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t"
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.dimensions}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Modified: {file.modifiedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedFiles.length === filteredFiles.length}
                          onChange={selectAllFiles}
                          className="size-4"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Preview
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Size
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Dimensions
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Uploaded
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Modified
                      </th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => viewDetailedPage(file)}
                      >
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            className="size-4"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="size-12 object-cover rounded border"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-900 font-mono text-sm">{file.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{file.name}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{file.size}</td>
                        <td className="py-3 px-4 text-gray-700">{file.dimensions}</td>
                        <td className="py-3 px-4 text-gray-700">{file.uploadedAt}</td>
                        <td className="py-3 px-4 text-gray-700">{file.modifiedAt}</td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(file)}
                              className="p-1.5 hover:bg-gray-100 rounded"
                            >
                              <Edit2 className="size-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => copyImageUrl(file.url)}
                              className="p-1.5 hover:bg-gray-100 rounded"
                            >
                              <Copy className="size-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => downloadFile(file)}
                              className="p-1.5 hover:bg-gray-100 rounded"
                            >
                              <Download className="size-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="p-1.5 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>

      {/* Upload Modal - Enhanced 3-Step Flow */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {uploadStep === 1 && 'Upload Files'}
                  {uploadStep === 2 && 'Add File Details'}
                  {uploadStep === 3 && 'Upload Complete'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {uploadStep === 1 && 'Select files to upload'}
                  {uploadStep === 2 && `${pendingFiles.length} file(s) selected`}
                  {uploadStep === 3 && `${uploadedCount} file(s) uploaded successfully`}
                </p>
              </div>
              <button
                onClick={closeUploadModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                        uploadStep === step
                          ? 'bg-blue-600 text-white'
                          : uploadStep > step
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {uploadStep > step ? <Check className="size-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          uploadStep > step ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: File Selection */}
              {uploadStep === 1 && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileSelection(e.dataTransfer.files);
                  }}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload
                    className={`size-16 mx-auto mb-4 ${
                      isDragging ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Support for PNG, JPG, JPEG, GIF, WebP (Max 10MB per file)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelection(e.target.files)}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Select Files
                  </Button>
                </div>
              )}

              {/* Step 2: Add Metadata */}
              {uploadStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Add details for each file. You can edit the file name and add alt text and descriptions for better organization.
                  </p>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {pendingFiles.map((file, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex gap-4">
                          {/* Preview */}
                          <div className="flex-shrink-0">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="size-24 object-cover rounded-lg border"
                            />
                          </div>

                          {/* Metadata Fields */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                File Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={file.name}
                                onChange={(e) =>
                                  updatePendingFileMetadata(index, 'name', e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter file name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Alt Text (Optional)
                              </label>
                              <input
                                type="text"
                                value={file.altText}
                                onChange={(e) =>
                                  updatePendingFileMetadata(index, 'altText', e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe this image"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Description (Optional)
                              </label>
                              <textarea
                                value={file.description}
                                onChange={(e) =>
                                  updatePendingFileMetadata(index, 'description', e.target.value)
                                }
                                rows={2}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add a description"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="text-xs text-gray-500">
                                <span>{file.size}</span> • <span>{file.type}</span>
                              </div>
                              <button
                                onClick={() => removePendingFile(index)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                              >
                                <Trash2 className="size-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {uploadStep === 3 && (
                <div className="text-center py-8">
                  <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="size-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload Complete!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {uploadedCount} {uploadedCount === 1 ? 'file has' : 'files have'} been successfully uploaded to your media library.
                  </p>
                  <Button
                    onClick={closeUploadModal}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            {uploadStep !== 3 && (
              <div className="flex gap-3 p-6 border-t bg-gray-50">
                {uploadStep === 1 && (
                  <Button
                    variant="outline"
                    onClick={closeUploadModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                {uploadStep === 2 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setUploadStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={finalizeUpload}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={pendingFiles.some((f) => !f.name.trim())}
                    >
                      Upload {pendingFiles.length} {pendingFiles.length === 1 ? 'File' : 'Files'}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Edit Media File</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preview
                </label>
                <div className="relative group">
                  <img
                    src={newImageUrl || selectedFile.url}
                    alt={selectedFile.name}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => editImageInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Upload className="size-8 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Click to upload new image</p>
                    </div>
                  </div>
                  {newImageUrl && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      New Image
                    </div>
                  )}
                </div>
                <input
                  ref={editImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditImageUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Media ID (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Media ID
                </label>
                <input
                  type="text"
                  value={selectedFile.id}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600 font-mono"
                />
              </div>

              {/* File Name (Editable) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter file name"
                />
              </div>

              {/* Alt Text (Editable) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Alt Text (Optional)
                </label>
                <input
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this image"
                />
              </div>

              {/* Description (Editable) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a description"
                />
              </div>

              {/* File Info */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Size
                  </label>
                  <p className="text-gray-900">{selectedFile.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Dimensions
                  </label>
                  <p className="text-gray-900">{selectedFile.dimensions}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveFileEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!editFileName.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}