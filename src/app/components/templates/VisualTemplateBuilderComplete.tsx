import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/app/components/ui/button';
import {
  ArrowLeft,
  Save,
  Type,
  Image as ImageIcon,
  Square,
  Minus,
  Space,
  Trash2,
  GripVertical,
  Settings,
  Plus,
  Award,
  PenTool,
  Share2,
  FileImage,
  Heading1,
  Heading2,
  MessageSquareQuote,
  List as ListIcon,
  Columns2,
  Megaphone,
  Video,
  ShoppingBag,
  Bell,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Ticket,
  Download,
  Eye,
  X,
  DollarSign,
  Table as TableIcon,
  Hand,
} from 'lucide-react';
import { Template } from './types';
import { TemplateElement, TemplateElementType } from './template-elements';
import { renderTemplateElement } from './element-renderers';
import { createDefaultElement } from './element-defaults';
import { PropertyPanel } from './PropertyPanel';
import { generateEmailHTML } from './email-html-generator';

const ELEMENT_TYPE = 'template-element';

interface VisualTemplateBuilderProps {
  template: Template | null;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

interface DraggableToolItemProps {
  type: TemplateElementType;
  icon: React.ReactNode;
  label: string;
}

interface DroppableCanvasProps {
  elements: TemplateElement[];
  onAddElement: (element: TemplateElement, index?: number) => void;
  onMoveElement: (fromIndex: number, toIndex: number) => void;
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

interface TemplateElementRendererProps {
  element: TemplateElement;
  index: number;
  onMoveElement: (fromIndex: number, toIndex: number) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

// Draggable tool item from sidebar
function DraggableToolItem({ type, icon, label }: DraggableToolItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ELEMENT_TYPE,
    item: { elementType: type, isNew: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <div className="text-gray-600">{icon}</div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <GripVertical className="size-4 text-gray-400 ml-auto" />
    </div>
  );
}

// Template element renderer with drag and drop
function TemplateElementRenderer({
  element,
  index,
  onMoveElement,
  isSelected,
  onSelect,
  onDelete,
}: TemplateElementRendererProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ELEMENT_TYPE,
    item: { elementType: element.type, index, isNew: false },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ELEMENT_TYPE,
    hover: (item: { index: number; isNew: boolean }) => {
      if (!item.isNew && item.index !== index) {
        onMoveElement(item.index, index);
        item.index = index;
      }
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      onClick={onSelect}
      className={`group relative border-2 transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-transparent hover:border-blue-300'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div
        className={`absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity ${
          isSelected ? 'opacity-100' : ''
        }`}
      >
        <GripVertical className="size-5 text-gray-400" />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={`absolute right-2 top-2 p-1.5 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all ${
          isSelected ? 'opacity-100' : ''
        }`}
      >
        <Trash2 className="size-4" />
      </button>

      <div className="pointer-events-none">{renderTemplateElement(element)}</div>
    </div>
  );
}

// Droppable canvas
function DroppableCanvas({
  elements,
  onAddElement,
  onMoveElement,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
}: DroppableCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ELEMENT_TYPE,
    drop: (item: { elementType: TemplateElementType; isNew: boolean }, monitor) => {
      if (item.isNew && !monitor.didDrop()) {
        const newElement = createDefaultElement(item.elementType);
        onAddElement(newElement);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  if (elements.length === 0) {
    return (
      <div
        ref={drop}
        className={`flex-1 bg-white rounded-lg border-2 border-dashed transition-colors min-h-[400px] ${
          isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <Plus className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Drag elements here to start
            </h3>
            <p className="text-sm text-gray-500">
              Start building your template by dragging elements from the left sidebar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={drop}
      className={`flex-1 space-y-2 transition-colors rounded-lg ${
        isOver ? 'bg-blue-50' : ''
      }`}
    >
      {elements.map((element, index) => (
        <TemplateElementRenderer
          key={element.id}
          element={element}
          index={index}
          onMoveElement={onMoveElement}
          isSelected={element.id === selectedElementId}
          onSelect={() => onSelectElement(element.id)}
          onDelete={() => onDeleteElement(element.id)}
        />
      ))}
      <div
        className={`h-16 border-2 border-dashed rounded-lg transition-colors ${
          isOver ? 'border-blue-500 bg-blue-100' : 'border-transparent'
        }`}
      />
    </div>
  );
}

export function VisualTemplateBuilderComplete({
  template,
  onSave,
  onCancel,
}: VisualTemplateBuilderProps) {
  const [editedTemplate, setEditedTemplate] = useState<Template>(
    template || {
      id: '',
      name: '',
      description: '',
      category: 'newsletter',
      thumbnail: '',
      lastModified: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      usageCount: 0,
      status: 'draft',
      workspaceId: '',
    }
  );

  const [elements, setElements] = useState<TemplateElement[]>(
    template?.elements || []
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleAddElement = useCallback(
    (element: TemplateElement, index?: number) => {
      if (index !== undefined) {
        setElements((prev) => {
          const newElements = [...prev];
          newElements.splice(index, 0, element);
          return newElements;
        });
      } else {
        setElements((prev) => [...prev, element]);
      }
      setSelectedElementId(element.id);
    },
    []
  );

  const handleMoveElement = useCallback((fromIndex: number, toIndex: number) => {
    setElements((prev) => {
      const newElements = [...prev];
      const [removed] = newElements.splice(fromIndex, 1);
      newElements.splice(toIndex, 0, removed);
      return newElements;
    });
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElementId(null);
  }, []);

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<TemplateElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const handleSave = () => {
    const updatedTemplate: Template = {
      ...editedTemplate,
      elements: elements,
      status: 'published',
      lastModified: new Date().toISOString().split('T')[0],
    };
    onSave(updatedTemplate);
  };

  const handleSaveDraft = () => {
    const updatedTemplate: Template = {
      ...editedTemplate,
      elements: elements,
      status: 'draft',
      lastModified: new Date().toISOString().split('T')[0],
    };
    onSave(updatedTemplate);
  };

  const handleExportHTML = () => {
    const html = generateEmailHTML(elements, editedTemplate.name);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editedTemplate.name || 'newsletter'}-template.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onCancel} size="sm">
                <ArrowLeft className="size-4 mr-2" />
                Back to Templates
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">
                {template ? 'Edit Template' : 'Create Template'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
              >
                Save as Draft
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={elements.length === 0}
              >
                <Eye className="size-4 mr-2" />
                Preview Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportHTML}
                disabled={elements.length === 0}
              >
                <Download className="size-4 mr-2" />
                Export HTML
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
              >
                <Save className="size-4 mr-2" />
                Publish Template
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Elements */}
          <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">
                DRAG ELEMENTS
              </h2>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                  Structure
                </div>
                <DraggableToolItem
                  type="heading"
                  icon={<Heading1 className="size-5" />}
                  label="Heading"
                />
                <DraggableToolItem
                  type="subheading"
                  icon={<Heading2 className="size-5" />}
                  label="Subheading"
                />
                <DraggableToolItem
                  type="text"
                  icon={<Type className="size-5" />}
                  label="Text Block"
                />
                <DraggableToolItem
                  type="list"
                  icon={<ListIcon className="size-5" />}
                  label="Bullet List"
                />
                <DraggableToolItem
                  type="divider"
                  icon={<Minus className="size-5" />}
                  label="Divider"
                />
                <DraggableToolItem
                  type="spacer"
                  icon={<Space className="size-5" />}
                  label="Spacer"
                />

                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                  Media & Content
                </div>
                <DraggableToolItem
                  type="logo"
                  icon={<FileImage className="size-5" />}
                  label="Logo"
                />
                <DraggableToolItem
                  type="image"
                  icon={<ImageIcon className="size-5" />}
                  label="Image"
                />
                <DraggableToolItem
                  type="video"
                  icon={<Video className="size-5" />}
                  label="Video"
                />
                <DraggableToolItem
                  type="quote"
                  icon={<MessageSquareQuote className="size-5" />}
                  label="Quote"
                />

                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                  Interactive
                </div>
                <DraggableToolItem
                  type="button"
                  icon={<Square className="size-5" />}
                  label="Button"
                />
                <DraggableToolItem
                  type="cta"
                  icon={<Megaphone className="size-5" />}
                  label="Call to Action"
                />
                <DraggableToolItem
                  type="product"
                  icon={<ShoppingBag className="size-5" />}
                  label="Product Card"
                />
                <DraggableToolItem
                  type="coupon"
                  icon={<Ticket className="size-5" />}
                  label="Coupon Code"
                />

                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                  Layout
                </div>
                <DraggableToolItem
                  type="twocolumn"
                  icon={<Columns2 className="size-5" />}
                  label="Two Columns"
                />
                <DraggableToolItem
                  type="announcement"
                  icon={<Bell className="size-5" />}
                  label="Announcement Bar"
                />
                <DraggableToolItem
                  type="navigation"
                  icon={<Menu className="size-5" />}
                  label="Navigation Menu"
                />

                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                  Branding
                </div>
                <DraggableToolItem
                  type="greeting"
                  icon={<Hand className="size-5" />}
                  label="Greeting"
                />
                <DraggableToolItem
                  type="signature"
                  icon={<PenTool className="size-5" />}
                  label="Signature"
                />
                <DraggableToolItem
                  type="social"
                  icon={<Share2 className="size-5" />}
                  label="Social Media"
                />
                <DraggableToolItem
                  type="footer"
                  icon={<Settings className="size-5" />}
                  label="Footer"
                />

                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                  Commerce
                </div>
                <DraggableToolItem
                  type="pricing"
                  icon={<DollarSign className="size-5" />}
                  label="Pricing Plan"
                />
                <DraggableToolItem
                  type="table"
                  icon={<TableIcon className="size-5" />}
                  label="Table"
                />
              </div>
            </div>
          </div>

          {/* Center Canvas */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              {/* Dark Mode Protection Badge */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Dark Mode Protected:</span> This template will always display in light mode across all email clients
                </p>
              </div>

              <DroppableCanvas
                elements={elements}
                onAddElement={handleAddElement}
                onMoveElement={handleMoveElement}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onDeleteElement={handleDeleteElement}
              />
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <PropertyPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
          />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Email Preview</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ✅ Dark Mode Protected - This email will always display in light mode
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-gray-100">
                <iframe
                  srcDoc={generateEmailHTML(elements, editedTemplate.name)}
                  className="w-full h-full min-h-[600px] bg-white rounded-lg shadow-sm"
                  title="Email Preview"
                />
              </div>
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Note:</span> This template uses meta tags and CSS to force light mode across all email clients.
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Close
                  </Button>
                  <Button onClick={handleExportHTML} className="bg-green-600 hover:bg-green-700">
                    <Download className="size-4 mr-2" />
                    Export HTML
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}