import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  ArrowLeft,
  Save,
  Eye,
  Type,
  Image as ImageIcon,
  Square,
  Minus,
  Space,
  Columns as ColumnsIcon,
  Trash2,
  GripVertical,
  Settings,
  Plus,
  Award,
  PenTool,
  Share2,
  Link as LinkIcon,
  FileImage,
} from 'lucide-react';
import { Template } from './types';
import { TemplateElement, TemplateElementType } from './template-elements';
import { MediaLibraryModal } from './MediaLibraryModal';

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

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              textAlign: element.align,
              padding: `${element.padding}px`,
            }}
          >
            {element.content || 'Enter your text here...'}
          </div>
        );
      case 'image':
        return (
          <div
            style={{
              textAlign: element.align,
              padding: `${element.padding}px`,
            }}
          >
            {element.url ? (
              <img
                src={element.url}
                alt={element.alt}
                style={{
                  width: `${element.width}%`,
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'inline-block',
                }}
              />
            ) : (
              <div
                className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                style={{
                  width: `${element.width}%`,
                  minHeight: '200px',
                  display: 'inline-block',
                }}
              >
                <div className="text-center">
                  <ImageIcon className="size-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No image selected</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'button':
        return (
          <div
            style={{
              textAlign: element.align,
              padding: `${element.padding}px`,
            }}
          >
            <a
              href={element.url || '#'}
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: element.backgroundColor,
                color: element.textColor,
                textDecoration: 'none',
                borderRadius: `${element.borderRadius}px`,
                fontWeight: 'bold',
              }}
            >
              {element.text || 'Button Text'}
            </a>
          </div>
        );
      case 'divider':
        return (
          <div style={{ padding: `${element.padding}px` }}>
            <hr
              style={{
                border: 'none',
                borderTop: `${element.thickness}px solid ${element.color}`,
                margin: 0,
              }}
            />
          </div>
        );
      case 'spacer':
        return (
          <div
            style={{ height: `${element.height}px` }}
            className="bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center"
          >
            <span className="text-xs text-gray-400">{element.height}px</span>
          </div>
        );
      default:
        return <div>Unknown element type</div>;
    }
  };

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
      {/* Drag Handle */}
      <div
        className={`absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity ${
          isSelected ? 'opacity-100' : ''
        }`}
      >
        <GripVertical className="size-5 text-gray-400" />
      </div>

      {/* Delete Button */}
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

      {/* Element Content */}
      <div className="pointer-events-none">{renderElement()}</div>
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
    <div ref={drop} className={`flex-1 space-y-2 transition-colors rounded-lg ${
      isOver ? 'bg-blue-50' : ''
    }`}>
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
      {/* Drop zone at the end */}
      <div className={`h-16 border-2 border-dashed rounded-lg transition-colors ${
        isOver ? 'border-blue-500 bg-blue-100' : 'border-transparent'
      }`} />
    </div>
  );
}

// Helper function to create default elements
function createDefaultElement(type: TemplateElementType): TemplateElement {
  const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const order = 0;

  switch (type) {
    case 'text':
      return {
        id,
        type: 'text',
        order,
        content: 'Enter your text here...',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#333333',
        align: 'left',
        padding: 20,
      };
    case 'image':
      return {
        id,
        type: 'image',
        order,
        url: '',
        alt: '',
        width: 100,
        align: 'center',
        padding: 20,
      };
    case 'button':
      return {
        id,
        type: 'button',
        order,
        text: 'Click Here',
        url: 'https://example.com',
        backgroundColor: '#4A90E2',
        textColor: '#ffffff',
        align: 'center',
        padding: 20,
        borderRadius: 4,
      };
    case 'divider':
      return {
        id,
        type: 'divider',
        order,
        color: '#e5e7eb',
        thickness: 1,
        padding: 20,
      };
    case 'spacer':
      return {
        id,
        type: 'spacer',
        order,
        height: 40,
      };
    default:
      throw new Error(`Unknown element type: ${type}`);
  }
}

export function VisualTemplateBuilder({
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

  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

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
      lastModified: new Date().toISOString().split('T')[0],
    };
    // In real app, save elements structure as well
    onSave(updatedTemplate);
  };

  const handleMediaSelect = (media: any) => {
    if (selectedElement && selectedElement.type === 'image') {
      handleUpdateElement(selectedElement.id, {
        url: media.url,
        alt: media.altText || media.name,
        mediaId: media.id,
      });
    }
    setShowMediaModal(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Top Bar */}
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
                onClick={() =>
                  setEditedTemplate({ ...editedTemplate, status: 'draft' })
                }
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
              >
                <Save className="size-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Element Tools */}
          <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">
                DRAG ELEMENTS
              </h2>
              <div className="space-y-3">
                <DraggableToolItem
                  type="text"
                  icon={<Type className="size-5" />}
                  label="Text Block"
                />
                <DraggableToolItem
                  type="image"
                  icon={<ImageIcon className="size-5" />}
                  label="Image"
                />
                <DraggableToolItem
                  type="button"
                  icon={<Square className="size-5" />}
                  label="Button"
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
              </div>
            </div>
          </div>

          {/* Center Canvas */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
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
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-6">
              {selectedElement ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="size-5 text-gray-600" />
                    <h2 className="text-sm font-bold text-gray-900">
                      ELEMENT PROPERTIES
                    </h2>
                  </div>

                  {/* Text Element Properties */}
                  {selectedElement.type === 'text' && (
                    <>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={selectedElement.content}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              content: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Font Size (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.fontSize}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              fontSize: parseInt(e.target.value) || 16,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Font Weight</Label>
                        <Select
                          value={selectedElement.fontWeight}
                          onValueChange={(value: 'normal' | 'bold') =>
                            handleUpdateElement(selectedElement.id, {
                              fontWeight: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.color}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              color: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Alignment</Label>
                        <Select
                          value={selectedElement.align}
                          onValueChange={(value: 'left' | 'center' | 'right') =>
                            handleUpdateElement(selectedElement.id, {
                              align: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Padding (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.padding}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              padding: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* Image Element Properties */}
                  {selectedElement.type === 'image' && (
                    <>
                      <div className="space-y-2">
                        <Label>Image</Label>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowMediaModal(true)}
                        >
                          <ImageIcon className="size-4 mr-2" />
                          Select from Media Library
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Alt Text</Label>
                        <Input
                          value={selectedElement.alt}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              alt: e.target.value,
                            })
                          }
                          placeholder="Image description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Width (%)</Label>
                        <Input
                          type="number"
                          value={selectedElement.width}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              width: parseInt(e.target.value) || 100,
                            })
                          }
                          min="1"
                          max="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Alignment</Label>
                        <Select
                          value={selectedElement.align}
                          onValueChange={(value: 'left' | 'center' | 'right') =>
                            handleUpdateElement(selectedElement.id, {
                              align: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Padding (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.padding}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              padding: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* Button Element Properties */}
                  {selectedElement.type === 'button' && (
                    <>
                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                          value={selectedElement.text}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              text: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link URL</Label>
                        <Input
                          value={selectedElement.url}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              url: e.target.value,
                            })
                          }
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.backgroundColor}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              backgroundColor: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.textColor}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              textColor: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Alignment</Label>
                        <Select
                          value={selectedElement.align}
                          onValueChange={(value: 'left' | 'center' | 'right') =>
                            handleUpdateElement(selectedElement.id, {
                              align: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Border Radius (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.borderRadius}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              borderRadius: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Padding (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.padding}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              padding: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* Divider Element Properties */}
                  {selectedElement.type === 'divider' && (
                    <>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.color}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              color: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Thickness (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.thickness}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              thickness: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Padding (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.padding}
                          onChange={(e) =>
                            handleUpdateElement(selectedElement.id, {
                              padding: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* Spacer Element Properties */}
                  {selectedElement.type === 'spacer' && (
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) =>
                          handleUpdateElement(selectedElement.id, {
                            height: parseInt(e.target.value) || 40,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="size-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">
                    Select an element to edit its properties
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelectMedia={handleMediaSelect}
      />
    </DndProvider>
  );
}