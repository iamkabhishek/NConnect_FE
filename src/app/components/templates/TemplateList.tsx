import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
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
} from 'lucide-react';
import { Template } from './types';

interface TemplateListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onToggleFavorite: (templateId: string) => void;
  onPreview: (template: Template) => void;
}

export function TemplateList({
  templates,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onPreview,
}: TemplateListProps) {
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Template Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id} className="hover:bg-gray-50">
                <TableCell>
                  <button
                    onClick={() => onToggleFavorite(template.id)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`size-5 ${
                        template.isFavorite
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {template.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getCategoryColor(template.category)}
                  >
                    {template.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {template.status === 'published' ? (
                    <Badge variant="default" className="bg-green-600">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {template.usageCount} {template.usageCount === 1 ? 'use' : 'uses'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {template.lastModified}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(template)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(template)}>
                          <Edit className="size-4 mr-2" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPreview(template)}>
                          <Eye className="size-4 mr-2" />
                          Preview
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
