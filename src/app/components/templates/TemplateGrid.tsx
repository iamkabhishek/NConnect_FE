import { useState } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Star,
  Eye,
  FileText,
  Info,
  Mail,
} from 'lucide-react';
import { Template } from './types';
import { TemplateDetailsDialog } from './TemplateDetailsDialog';

interface TemplateGridProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onToggleFavorite: (templateId: string) => void;
  onPreview: (template: Template) => void;
  onRetire?: (templateId: string) => void;
}

export function TemplateGrid({
  templates,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onPreview,
  onRetire,
}: TemplateGridProps) {
  const [detailsTemplate, setDetailsTemplate] = useState<Template | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleViewDetails = (template: Template) => {
    setDetailsTemplate(template);
    setShowDetailsDialog(true);
  };

  const handleRetire = (templateId: string) => {
    if (onRetire) {
      onRetire(templateId);
    }
  };

  const handleImageError = (templateId: string) => {
    setImageErrors(prev => new Set(prev).add(templateId));
  };

  const getCategoryColor = (category: Template['category']) => {
    const colors = {
      newsletter: 'bg-blue-100 text-blue-700',
      promotional: 'bg-purple-100 text-purple-700',
      transactional: 'bg-gray-100 text-gray-700',
      event: 'bg-red-100 text-red-700',
    };
    return colors[category];
  };

  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <FileText className="size-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or create a new template
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-100">
            {template.thumbnail && !imageErrors.has(template.id) ? (
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={() => handleImageError(template.id)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Mail className="size-16 text-gray-400" />
              </div>
            )}
            {/* Favorite Badge */}
            <button
              onClick={() => onToggleFavorite(template.id)}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <Star
                className={`size-5 ${
                  template.isFavorite
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-400'
                }`}
              />
            </button>
            {/* Preview Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                onClick={() => onPreview(template)}
                variant="secondary"
                size="sm"
              >
                <Eye className="size-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 font-mono mb-2">
                  Template ID: {template.id}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewDetails(template)}>
                    <Info className="size-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Edit className="size-4 mr-2" />
                    Edit Template
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPreview(template)}>
                    <Eye className="size-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleFavorite(template.id)}>
                    <Star className={`size-4 mr-2 ${template.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    {template.isFavorite ? 'Remove from Favourites' : 'Mark as Favourite'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(template)}>
                    <Copy className="size-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(template.id)}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <Badge
                variant="secondary"
                className={getCategoryColor(template.category)}
              >
                {template.category}
              </Badge>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{template.usageCount} uses</span>
                <span>•</span>
                <span>{template.lastModified}</span>
              </div>
            </div>

            {/* Status Badge */}
            {template.status === 'draft' && (
              <Badge variant="outline" className="mt-2 text-orange-600 border-orange-300">
                Draft
              </Badge>
            )}
            {template.status === 'published' && (
              <Badge variant="default" className="mt-2 bg-green-600">
                Published
              </Badge>
            )}
          </div>
        </div>
      ))}
      <TemplateDetailsDialog
        template={detailsTemplate}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        onDelete={onDelete}
        onRetire={handleRetire}
      />
    </div>
  );
}