import { useState } from 'react';
import { Settings, Plus, Trash2, Image as ImageIcon, Italic, Underline, Bold, Type } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { TemplateElement } from './template-elements';
import { MediaLibraryModal } from './MediaLibraryModal';

interface PropertyPanelProps {
  selectedElement: TemplateElement | undefined;
  onUpdateElement: (id: string, updates: Partial<TemplateElement>) => void;
}

// Font options for email compatibility
const FONT_FAMILIES = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, Times, serif', label: 'Times New Roman' },
  { value: 'Courier New, Courier, monospace', label: 'Courier New' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
];

// Currency options
const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
  { code: 'CAD', symbol: '$', label: 'Canadian Dollar ($)' },
  { code: 'AUD', symbol: '$', label: 'Australian Dollar ($)' },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc (Fr)' },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan (¥)' },
];

export function PropertyPanel({ selectedElement, onUpdateElement }: PropertyPanelProps) {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'main' | 'left' | 'right' | 'thumbnail'>('main');

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-6">
          <div className="text-center py-12">
            <Settings className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-600">
              Select an element to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleMediaSelect = (media: any) => {
    if (selectedElement.type === 'image') {
      onUpdateElement(selectedElement.id, {
        url: media.url,
        alt: media.altText || media.name,
        mediaId: media.id,
      });
    } else if (selectedElement.type === 'logo') {
      onUpdateElement(selectedElement.id, {
        url: media.url,
        alt: media.altText || media.name,
        mediaId: media.id,
      });
    } else if (selectedElement.type === 'signature') {
      onUpdateElement(selectedElement.id, {
        imageUrl: media.url,
        mediaId: media.id,
      });
    } else if (selectedElement.type === 'product') {
      onUpdateElement(selectedElement.id, {
        imageUrl: media.url,
        mediaId: media.id,
      });
    } else if (selectedElement.type === 'video') {
      onUpdateElement(selectedElement.id, {
        thumbnailUrl: media.url,
        mediaId: media.id,
      });
    } else if (selectedElement.type === 'twocolumn') {
      if (mediaTarget === 'left') {
        onUpdateElement(selectedElement.id, {
          leftContent: {
            ...selectedElement.leftContent,
            type: 'image',
            url: media.url,
            alt: media.altText || media.name,
          },
        });
      } else if (mediaTarget === 'right') {
        onUpdateElement(selectedElement.id, {
          rightContent: {
            ...selectedElement.rightContent,
            type: 'image',
            url: media.url,
            alt: media.altText || media.name,
          },
        });
      }
    }
    setShowMediaModal(false);
  };

  const openMediaLibrary = (target: 'main' | 'left' | 'right' | 'thumbnail' = 'main') => {
    setMediaTarget(target);
    setShowMediaModal(true);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="size-5 text-gray-600" />
          <h2 className="text-sm font-bold text-gray-900">
            ELEMENT PROPERTIES
          </h2>
        </div>

        <div className="space-y-6">
          {/* ===== HEADING ELEMENT ===== */}
          {selectedElement.type === 'heading' && (
            <>
              <div className="space-y-2">
                <Label>Heading Text</Label>
                <Textarea
                  value={selectedElement.content}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      content: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Heading Level</Label>
                <Select
                  value={selectedElement.level}
                  onValueChange={(value: 'h1' | 'h2' | 'h3') =>
                    onUpdateElement(selectedElement.id, {
                      level: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">H1 - Large</SelectItem>
                    <SelectItem value="h2">H2 - Medium</SelectItem>
                    <SelectItem value="h3">H3 - Small</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== SUBHEADING ELEMENT ===== */}
          {selectedElement.type === 'subheading' && (
            <>
              <div className="space-y-2">
                <Label>Subheading Text</Label>
                <Textarea
                  value={selectedElement.content}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      content: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 18,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    placeholder="#6b7280"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== TEXT ELEMENT ===== */}
          {selectedElement.type === 'text' && (
            <>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={selectedElement.content}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 16,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    placeholder="#333333"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== IMAGE ELEMENT ===== */}
          {selectedElement.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Image</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMediaLibrary('main')}
                >
                  <ImageIcon className="size-4 mr-2" />
                  Select Image
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={selectedElement.alt}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      alt: e.target.value,
                    })
                  }
                  placeholder="Image description"
                />
              </div>
              <div className="space-y-2">
                <Label>Link URL (optional)</Label>
                <Input
                  value={selectedElement.link || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      link: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
                <p className="text-xs text-gray-500">Add a URL to make the image clickable</p>
              </div>
              <div className="space-y-2">
                <Label>Width (%)</Label>
                <Input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      width: parseInt(e.target.value) || 100,
                    })
                  }
                  min={10}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.borderRadius}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      borderRadius: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  max={50}
                />
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== BUTTON ELEMENT ===== */}
          {selectedElement.type === 'button' && (
            <>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={selectedElement.text}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      text: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Button URL</Label>
                <Input
                  value={selectedElement.url}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      url: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Width (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.buttonWidth}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonWidth: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                />
                <p className="text-xs text-gray-500">Set to 0 for auto sizing</p>
              </div>
              <div className="space-y-2">
                <Label>Button Height (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.buttonHeight}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonHeight: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                />
                <p className="text-xs text-gray-500">Set to 0 for auto sizing</p>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.borderRadius}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      borderRadius: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== DIVIDER ELEMENT ===== */}
          {selectedElement.type === 'divider' && (
            <>
              <div className="space-y-2">
                <Label>Line Style</Label>
                <Select
                  value={selectedElement.style}
                  onValueChange={(value: 'solid' | 'dotted' | 'dashed') =>
                    onUpdateElement(selectedElement.id, {
                      style: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Thickness (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.thickness}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      thickness: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Padding (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.padding}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== LIST ELEMENT ===== */}
          {selectedElement.type === 'list' && (
            <>
              <div className="space-y-2">
                <Label>List Items</Label>
                {selectedElement.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...selectedElement.items];
                        newItems[idx] = e.target.value;
                        onUpdateElement(selectedElement.id, {
                          items: newItems,
                        });
                      }}
                      placeholder={`Item ${idx + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newItems = selectedElement.items.filter((_, i) => i !== idx);
                        onUpdateElement(selectedElement.id, {
                          items: newItems,
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    onUpdateElement(selectedElement.id, {
                      items: [...selectedElement.items, 'New item'],
                    });
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Bullet Style</Label>
                <Select
                  value={selectedElement.bulletStyle}
                  onValueChange={(value: 'disc' | 'circle' | 'square' | 'decimal') =>
                    onUpdateElement(selectedElement.id, {
                      bulletStyle: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disc">Disc (•)</SelectItem>
                    <SelectItem value="circle">Circle (○)</SelectItem>
                    <SelectItem value="square">Square (▪)</SelectItem>
                    <SelectItem value="decimal">Numbers (1, 2, 3...)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 16,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Padding (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.padding}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== TWO COLUMN ELEMENT ===== */}
          {selectedElement.type === 'twocolumn' && (
            <>
              <div className="space-y-3">
                <Label className="font-semibold">Left Column</Label>
                <Select
                  value={selectedElement.leftContent.type}
                  onValueChange={(value: 'text' | 'image' | 'video') => {
                    onUpdateElement(selectedElement.id, {
                      leftContent: {
                        type: value,
                        content: value === 'text' ? 'Left column content' : undefined,
                        url: value === 'image' || value === 'video' ? '' : undefined,
                        alt: value === 'image' ? '' : undefined,
                        width: value === 'image' || value === 'video' ? 100 : undefined,
                        height: value === 'image' || value === 'video' ? 0 : undefined,
                        // Text properties
                        fontSize: value === 'text' ? 16 : undefined,
                        fontFamily: value === 'text' ? 'Arial, sans-serif' : undefined,
                        fontWeight: value === 'text' ? 'normal' : undefined,
                        fontStyle: value === 'text' ? 'normal' : undefined,
                        textDecoration: value === 'text' ? 'none' : undefined,
                        textColor: value === 'text' ? '#333333' : undefined,
                      },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                {selectedElement.leftContent.type === 'text' ? (
                  <>
                    <Textarea
                      value={selectedElement.leftContent.content || ''}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          leftContent: {
                            ...selectedElement.leftContent,
                            content: e.target.value,
                          },
                        })
                      }
                      rows={3}
                    />
                    {/* Text Properties for Left Column */}
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-xs font-semibold text-gray-500 uppercase">Text Styling</Label>
                      <div>
                        <Label className="text-xs">Font Size (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.leftContent.fontSize || 16}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                fontSize: parseInt(e.target.value) || 16,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Font Family</Label>
                        <Select
                          value={selectedElement.leftContent.fontFamily || 'Arial, sans-serif'}
                          onValueChange={(value) =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                fontFamily: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_FAMILIES.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Font Weight</Label>
                        <Select
                          value={selectedElement.leftContent.fontWeight || 'normal'}
                          onValueChange={(value: 'normal' | 'bold') =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                fontWeight: value,
                              },
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
                      <div>
                        <Label className="text-xs">Text Style</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedElement.leftContent.fontStyle === 'italic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              onUpdateElement(selectedElement.id, {
                                leftContent: {
                                  ...selectedElement.leftContent,
                                  fontStyle: selectedElement.leftContent.fontStyle === 'italic' ? 'normal' : 'italic',
                                },
                              })
                            }
                            className="flex-1"
                          >
                            <Italic className="size-4" />
                          </Button>
                          <Button
                            variant={selectedElement.leftContent.textDecoration === 'underline' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              onUpdateElement(selectedElement.id, {
                                leftContent: {
                                  ...selectedElement.leftContent,
                                  textDecoration: selectedElement.leftContent.textDecoration === 'underline' ? 'none' : 'underline',
                                },
                              })
                            }
                            className="flex-1"
                          >
                            <Underline className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Text Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.leftContent.textColor || '#333333'}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                textColor: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : selectedElement.leftContent.type === 'image' ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openMediaLibrary('left')}
                    >
                      <ImageIcon className="size-4 mr-2" />
                      Select Image
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width (%)</Label>
                        <Input
                          type="number"
                          value={selectedElement.leftContent.width || 100}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                width: parseInt(e.target.value) || 100,
                              },
                            })
                          }
                          min={10}
                          max={100}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.leftContent.height || 0}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                height: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          min={0}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Input
                      value={selectedElement.leftContent.url || ''}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          leftContent: {
                            ...selectedElement.leftContent,
                            url: e.target.value,
                          },
                        })
                      }
                      placeholder="Video embed URL"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width (%)</Label>
                        <Input
                          type="number"
                          value={selectedElement.leftContent.width || 100}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                width: parseInt(e.target.value) || 100,
                              },
                            })
                          }
                          min={10}
                          max={100}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.leftContent.height || 0}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              leftContent: {
                                ...selectedElement.leftContent,
                                height: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          min={0}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Right Column</Label>
                <Select
                  value={selectedElement.rightContent.type}
                  onValueChange={(value: 'text' | 'image' | 'video') => {
                    onUpdateElement(selectedElement.id, {
                      rightContent: {
                        type: value,
                        content: value === 'text' ? 'Right column content' : undefined,
                        url: value === 'image' || value === 'video' ? '' : undefined,
                        alt: value === 'image' ? '' : undefined,
                        width: value === 'image' || value === 'video' ? 100 : undefined,
                        height: value === 'image' || value === 'video' ? 0 : undefined,
                        // Text properties
                        fontSize: value === 'text' ? 16 : undefined,
                        fontFamily: value === 'text' ? 'Arial, sans-serif' : undefined,
                        fontWeight: value === 'text' ? 'normal' : undefined,
                        fontStyle: value === 'text' ? 'normal' : undefined,
                        textDecoration: value === 'text' ? 'none' : undefined,
                        textColor: value === 'text' ? '#333333' : undefined,
                      },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                {selectedElement.rightContent.type === 'text' ? (
                  <>
                    <Textarea
                      value={selectedElement.rightContent.content || ''}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          rightContent: {
                            ...selectedElement.rightContent,
                            content: e.target.value,
                          },
                        })
                      }
                      rows={3}
                    />
                    {/* Text Properties for Right Column */}
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-xs font-semibold text-gray-500 uppercase">Text Styling</Label>
                      <div>
                        <Label className="text-xs">Font Size (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.rightContent.fontSize || 16}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                fontSize: parseInt(e.target.value) || 16,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Font Family</Label>
                        <Select
                          value={selectedElement.rightContent.fontFamily || 'Arial, sans-serif'}
                          onValueChange={(value) =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                fontFamily: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_FAMILIES.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Font Weight</Label>
                        <Select
                          value={selectedElement.rightContent.fontWeight || 'normal'}
                          onValueChange={(value: 'normal' | 'bold') =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                fontWeight: value,
                              },
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
                      <div>
                        <Label className="text-xs">Text Style</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedElement.rightContent.fontStyle === 'italic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              onUpdateElement(selectedElement.id, {
                                rightContent: {
                                  ...selectedElement.rightContent,
                                  fontStyle: selectedElement.rightContent.fontStyle === 'italic' ? 'normal' : 'italic',
                                },
                              })
                            }
                            className="flex-1"
                          >
                            <Italic className="size-4" />
                          </Button>
                          <Button
                            variant={selectedElement.rightContent.textDecoration === 'underline' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              onUpdateElement(selectedElement.id, {
                                rightContent: {
                                  ...selectedElement.rightContent,
                                  textDecoration: selectedElement.rightContent.textDecoration === 'underline' ? 'none' : 'underline',
                                },
                              })
                            }
                            className="flex-1"
                          >
                            <Underline className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Text Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.rightContent.textColor || '#333333'}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                textColor: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : selectedElement.rightContent.type === 'image' ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openMediaLibrary('right')}
                    >
                      <ImageIcon className="size-4 mr-2" />
                      Select Image
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width (%)</Label>
                        <Input
                          type="number"
                          value={selectedElement.rightContent.width || 100}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                width: parseInt(e.target.value) || 100,
                              },
                            })
                          }
                          min={10}
                          max={100}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.rightContent.height || 0}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                height: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          min={0}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Input
                      value={selectedElement.rightContent.url || ''}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          rightContent: {
                            ...selectedElement.rightContent,
                            url: e.target.value,
                          },
                        })
                      }
                      placeholder="Video embed URL"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width (%)</Label>
                        <Input
                          type="number"
                          value={selectedElement.rightContent.width || 100}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                width: parseInt(e.target.value) || 100,
                              },
                            })
                          }
                          min={10}
                          max={100}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height (px)</Label>
                        <Input
                          type="number"
                          value={selectedElement.rightContent.height || 0}
                          onChange={(e) =>
                            onUpdateElement(selectedElement.id, {
                              rightContent: {
                                ...selectedElement.rightContent,
                                height: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          min={0}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Column Gap (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.columnGap}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      columnGap: parseInt(e.target.value) || 20,
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== SOCIAL MEDIA ELEMENT ===== */}
          {selectedElement.type === 'social' && (
            <>
              <div className="space-y-2">
                <Label>Platforms</Label>
                {selectedElement.platforms.map((platform, idx) => (
                  <div key={platform.name} className="flex items-center gap-2 p-2 border rounded">
                    <Switch
                      checked={platform.enabled}
                      onCheckedChange={(checked) => {
                        const newPlatforms = [...selectedElement.platforms];
                        newPlatforms[idx] = { ...platform, enabled: checked };
                        onUpdateElement(selectedElement.id, {
                          platforms: newPlatforms,
                        });
                      }}
                    />
                    <span className="text-sm font-medium capitalize flex-1">{platform.name}</span>
                    {platform.enabled && (
                      <Input
                        value={platform.url}
                        onChange={(e) => {
                          const newPlatforms = [...selectedElement.platforms];
                          newPlatforms[idx] = { ...platform, url: e.target.value };
                          onUpdateElement(selectedElement.id, {
                            platforms: newPlatforms,
                          });
                        }}
                        placeholder="URL"
                        className="text-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Icon Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.iconColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        iconColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.iconColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        iconColor: e.target.value,
                      })
                    }
                    placeholder="#4A90E2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Icon Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.iconSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      iconSize: parseInt(e.target.value) || 40,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== PRODUCT ELEMENT ===== */}
          {selectedElement.type === 'product' && (
            <>
              <div className="space-y-2">
                <Label>Product Image</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMediaLibrary('main')}
                >
                  <ImageIcon className="size-4 mr-2" />
                  Select Image
                </Button>
              </div>
              
              {/* Product Name Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Product Name</Label>
              </div>
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={selectedElement.name || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter product name..."
                />
              </div>
              <div className="space-y-2">
                <Label>Name Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.nameFontSize || 20}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      nameFontSize: parseInt(e.target.value) || 20,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Name Font Family</Label>
                <Select
                  value={selectedElement.nameFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      nameFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name Font Weight</Label>
                <Select
                  value={selectedElement.nameFontWeight || 'bold'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      nameFontWeight: value,
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
                <Label>Name Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.nameFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        nameFontStyle: selectedElement.nameFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                    className="flex-1"
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.nameTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        nameTextDecoration: selectedElement.nameTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                    className="flex-1"
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name Color</Label>
                <Input
                  type="color"
                  value={selectedElement.nameColor || '#111827'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      nameColor: e.target.value,
                    })
                  }
                />
              </div>
              
              {/* Description Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Description</Label>
              </div>
              <div className="space-y-2">
                <Label>Description Text</Label>
                <Textarea
                  value={selectedElement.description || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Enter product description..."
                />
              </div>
              <div className="space-y-2">
                <Label>Description Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.descriptionFontSize || 14}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontSize: parseInt(e.target.value) || 14,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description Font Family</Label>
                <Select
                  value={selectedElement.descriptionFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description Font Weight</Label>
                <Select
                  value={selectedElement.descriptionFontWeight || 'normal'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontWeight: value,
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
                <Label>Description Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.descriptionFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionFontStyle: selectedElement.descriptionFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                    className="flex-1"
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.descriptionTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionTextDecoration: selectedElement.descriptionTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                    className="flex-1"
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description Color</Label>
                <Input
                  type="color"
                  value={selectedElement.descriptionColor || '#6b7280'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionColor: e.target.value,
                    })
                  }
                />
              </div>
              
              {/* Pricing Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Pricing</Label>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={selectedElement.currency || 'USD'}
                  onValueChange={(value) => {
                    const currency = CURRENCIES.find(c => c.code === value);
                    onUpdateElement(selectedElement.id, {
                      currency: value,
                      currencySymbol: currency?.symbol || '$',
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedElement.showBasePrice ?? true}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        showBasePrice: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  Show Base Price (Strikethrough)
                </Label>
              </div>
              {selectedElement.showBasePrice && (
                <div className="space-y-2">
                  <Label>Base Price</Label>
                  <Input
                    type="text"
                    value={selectedElement.basePrice || ''}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        basePrice: e.target.value,
                      })
                    }
                    placeholder="149.00"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Offer Price</Label>
                <Input
                  type="text"
                  value={selectedElement.offerPrice || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      offerPrice: e.target.value,
                    })
                  }
                  placeholder="99.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Price Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.priceFontSize || 24}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      priceFontSize: parseInt(e.target.value) || 24,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Price Font Family</Label>
                <Select
                  value={selectedElement.priceFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      priceFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price Font Weight</Label>
                <Select
                  value={selectedElement.priceFontWeight || 'bold'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      priceFontWeight: value,
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
                <Label>Price Color</Label>
                <Input
                  type="color"
                  value={selectedElement.priceColor || '#4A90E2'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      priceColor: e.target.value,
                    })
                  }
                />
              </div>
              
              {/* Button Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Button</Label>
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={selectedElement.buttonText || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonText: e.target.value,
                    })
                  }
                  placeholder="Buy Now"
                />
              </div>
              <div className="space-y-2">
                <Label>Button URL</Label>
                <Input
                  value={selectedElement.buttonUrl || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.buttonFontSize || 16}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonFontSize: parseInt(e.target.value) || 16,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Button Font Family</Label>
                <Select
                  value={selectedElement.buttonFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      buttonFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Button Font Weight</Label>
                <Select
                  value={selectedElement.buttonFontWeight || 'bold'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      buttonFontWeight: value,
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
                <Label>Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.buttonColor || '#4A90E2'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.buttonColor || '#4A90E2'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonColor: e.target.value,
                      })
                    }
                    placeholder="#4A90E2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Button Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.buttonTextColor || '#ffffff'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonTextColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.buttonTextColor || '#ffffff'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonTextColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              
              {/* Layout Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Layout</Label>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align || 'center'}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                  value={selectedElement.padding || 0}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== GREETING ELEMENT (NEW) ===== */}
          {selectedElement.type === 'greeting' && (
            <>
              <div className="space-y-2">
                <Label>Greeting Template</Label>
                <Textarea
                  value={selectedElement.template}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      template: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Hello {{first_name}}"
                />
                <p className="text-xs text-gray-500">Use variables like: {`{{first_name}} {{last_name}} {{email}}`}</p>
              </div>
              <div className="space-y-2">
                <Label>Insert Variable</Label>
                <div className="flex flex-wrap gap-1">
                  {selectedElement.availableFields.map((field) => (
                    <Button
                      key={field}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const template = selectedElement.template + `{{${field}}}`;
                        onUpdateElement(selectedElement.id, { template });
                      }}
                    >
                      {field}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fallback Text</Label>
                <Input
                  value={selectedElement.fallback}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fallback: e.target.value,
                    })
                  }
                  placeholder="Hello there"
                />
                <p className="text-xs text-gray-500">Shown when variables are unavailable</p>
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 18,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <Button
                  variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    onUpdateElement(selectedElement.id, {
                      fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                    })
                  }
                >
                  <Italic className="size-4 mr-2" />
                  Italic
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    placeholder="#333333"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== COUPON ELEMENT ===== */}
          {selectedElement.type === 'coupon' && (
            <>
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <Input
                  value={selectedElement.code || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      code: e.target.value,
                    })
                  }
                  placeholder="SAVE20"
                />
              </div>
              
              {/* Title Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Title</Label>
              </div>
              <div className="space-y-2">
                <Label>Title Text</Label>
                <Input
                  value={selectedElement.title || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      title: e.target.value,
                    })
                  }
                  placeholder="Special Offer"
                />
              </div>
              <div className="space-y-2">
                <Label>Title Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.titleFontSize || 24}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      titleFontSize: parseInt(e.target.value) || 24,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Title Font Family</Label>
                <Select
                  value={selectedElement.titleFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      titleFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title Font Weight</Label>
                <Select
                  value={selectedElement.titleFontWeight || 'bold'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      titleFontWeight: value,
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
                <Label>Title Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.titleFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        titleFontStyle: selectedElement.titleFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                    className="flex-1"
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.titleTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        titleTextDecoration: selectedElement.titleTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                    className="flex-1"
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Description Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Description</Label>
              </div>
              <div className="space-y-2">
                <Label>Description Text</Label>
                <Textarea
                  value={selectedElement.description || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Use this code to get 20% off"
                />
              </div>
              <div className="space-y-2">
                <Label>Description Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.descriptionFontSize || 14}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontSize: parseInt(e.target.value) || 14,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description Font Family</Label>
                <Select
                  value={selectedElement.descriptionFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description Font Weight</Label>
                <Select
                  value={selectedElement.descriptionFontWeight || 'normal'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontWeight: value,
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
                <Label>Description Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.descriptionFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionFontStyle: selectedElement.descriptionFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                    className="flex-1"
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.descriptionTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionTextDecoration: selectedElement.descriptionTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                    className="flex-1"
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Code Styling Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Code Styling</Label>
              </div>
              <div className="space-y-2">
                <Label>Code Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.codeFontSize || 20}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      codeFontSize: parseInt(e.target.value) || 20,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Code Font Family</Label>
                <Select
                  value={selectedElement.codeFontFamily || 'monospace'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      codeFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Code Font Weight</Label>
                <Select
                  value={selectedElement.codeFontWeight || 'bold'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      codeFontWeight: value,
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
              
              {/* Colors Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Colors</Label>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={selectedElement.backgroundColor || '#f0f9ff'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      backgroundColor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={selectedElement.textColor || '#1e40af'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      textColor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Border Color</Label>
                <Input
                  type="color"
                  value={selectedElement.borderColor || '#4A90E2'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      borderColor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Code Background Color</Label>
                <Input
                  type="color"
                  value={selectedElement.codeBackgroundColor || '#4A90E2'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      codeBackgroundColor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Code Text Color</Label>
                <Input
                  type="color"
                  value={selectedElement.codeTextColor || '#ffffff'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      codeTextColor: e.target.value,
                    })
                  }
                />
              </div>
              
              {/* Layout Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Layout</Label>
              </div>
              <div className="space-y-2">
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.borderRadius || 8}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      borderRadius: parseInt(e.target.value) || 8,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align || 'center'}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                  value={selectedElement.padding || 30}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 30,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== PRICING ELEMENT (NEW) ===== */}
          {selectedElement.type === 'pricing' && (
            <>
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input
                  value={selectedElement.name}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      name: e.target.value,
                    })
                  }
                  placeholder="Premium Plan"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={selectedElement.description}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Best value for teams"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={selectedElement.currency}
                  onValueChange={(value) => {
                    const currency = CURRENCIES.find(c => c.code === value);
                    onUpdateElement(selectedElement.id, {
                      currency: value,
                      currencySymbol: currency?.symbol || '$',
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Original Price</Label>
                <Input
                  type="number"
                  value={selectedElement.originalPrice}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      originalPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="149"
                />
              </div>
              <div className="space-y-2">
                <Label>Offer Price</Label>
                <Input
                  type="number"
                  value={selectedElement.offerPrice}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      offerPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="99"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={selectedElement.showOriginalPrice}
                  onCheckedChange={(checked) =>
                    onUpdateElement(selectedElement.id, {
                      showOriginalPrice: checked,
                    })
                  }
                />
                <Label>Show Original Price (strikethrough)</Label>
              </div>
              <div className="space-y-2">
                <Label>Features</Label>
                {selectedElement.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...selectedElement.features];
                        newFeatures[idx] = e.target.value;
                        onUpdateElement(selectedElement.id, {
                          features: newFeatures,
                        });
                      }}
                      placeholder={`Feature ${idx + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFeatures = selectedElement.features.filter((_, i) => i !== idx);
                        onUpdateElement(selectedElement.id, {
                          features: newFeatures,
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    onUpdateElement(selectedElement.id, {
                      features: [...selectedElement.features, 'New feature'],
                    });
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={selectedElement.buttonText}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonText: e.target.value,
                    })
                  }
                  placeholder="Get Started"
                />
              </div>
              <div className="space-y-2">
                <Label>Button URL</Label>
                <Input
                  value={selectedElement.buttonUrl}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
              </div>
              
              {/* Text Styling Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Plan Name Styling</Label>
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.nameFontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      nameFontSize: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.nameFontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      nameFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.nameFontWeight === 'bold' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        nameFontWeight: selectedElement.nameFontWeight === 'bold' ? 'normal' : 'bold',
                      })
                    }
                  >
                    <Bold className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.nameFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        nameFontStyle: selectedElement.nameFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.nameTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        nameTextDecoration: selectedElement.nameTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Description Styling Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Description Styling</Label>
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.descriptionFontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontSize: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.descriptionFontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.descriptionFontWeight === 'bold' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionFontWeight: selectedElement.descriptionFontWeight === 'bold' ? 'normal' : 'bold',
                      })
                    }
                  >
                    <Bold className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.descriptionFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionFontStyle: selectedElement.descriptionFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.descriptionTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionTextDecoration: selectedElement.descriptionTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Features Styling Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Features Styling</Label>
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.featuresFontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      featuresFontSize: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.featuresFontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      featuresFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.featuresFontWeight === 'bold' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        featuresFontWeight: selectedElement.featuresFontWeight === 'bold' ? 'normal' : 'bold',
                      })
                    }
                  >
                    <Bold className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.featuresFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        featuresFontStyle: selectedElement.featuresFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.featuresTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        featuresTextDecoration: selectedElement.featuresTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Color Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Colors</Label>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    placeholder="#333333"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.buttonColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.buttonColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonColor: e.target.value,
                      })
                    }
                    placeholder="#4A90E2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Button Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.buttonTextColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonTextColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.buttonTextColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        buttonTextColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== TABLE ELEMENT (NEW) ===== */}
          {selectedElement.type === 'table' && (
            <>
              <div className="space-y-2">
                <Label>Table Width (%)</Label>
                <Input
                  type="number"
                  value={selectedElement.tableWidth}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      tableWidth: parseInt(e.target.value) || 100,
                    })
                  }
                  min={50}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Headers</Label>
                {selectedElement.headers.map((header, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...selectedElement.headers];
                        newHeaders[idx] = e.target.value;
                        onUpdateElement(selectedElement.id, {
                          headers: newHeaders,
                        });
                      }}
                      placeholder={`Column ${idx + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newHeaders = selectedElement.headers.filter((_, i) => i !== idx);
                        const newRows = selectedElement.rows.map(row => row.filter((_, i) => i !== idx));
                        onUpdateElement(selectedElement.id, {
                          headers: newHeaders,
                          rows: newRows,
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    onUpdateElement(selectedElement.id, {
                      headers: [...selectedElement.headers, `Column ${selectedElement.headers.length + 1}`],
                      rows: selectedElement.rows.map(row => [...row, '']),
                    });
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Column
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Rows</Label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {selectedElement.rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="border rounded p-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Row {rowIdx + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newRows = selectedElement.rows.filter((_, i) => i !== rowIdx);
                            onUpdateElement(selectedElement.id, {
                              rows: newRows,
                            });
                          }}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                      {row.map((cell, cellIdx) => (
                        <Input
                          key={cellIdx}
                          value={cell}
                          onChange={(e) => {
                            const newRows = [...selectedElement.rows];
                            newRows[rowIdx][cellIdx] = e.target.value;
                            onUpdateElement(selectedElement.id, {
                              rows: newRows,
                            });
                          }}
                          placeholder={selectedElement.headers[cellIdx] || `Cell ${cellIdx + 1}`}
                          className="text-xs"
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const newRow = selectedElement.headers.map(() => '');
                    onUpdateElement(selectedElement.id, {
                      rows: [...selectedElement.rows, newRow],
                    });
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Row
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Cell Padding (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.cellPadding}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      cellPadding: parseInt(e.target.value) || 8,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 14,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Header Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.headerBackgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        headerBackgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.headerBackgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        headerBackgroundColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Header Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.headerTextColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        headerTextColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.headerTextColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        headerTextColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Row Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.rowBackgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        rowBackgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.rowBackgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        rowBackgroundColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Row Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.rowTextColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        rowTextColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.rowTextColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        rowTextColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.borderColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        borderColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.borderColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        borderColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== LOGO ELEMENT ===== */}
          {selectedElement.type === 'logo' && (
            <>
              <div className="space-y-2">
                <Label>Logo Image</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMediaLibrary('main')}
                >
                  <ImageIcon className="size-4 mr-2" />
                  Select Logo
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={selectedElement.alt}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      alt: e.target.value,
                    })
                  }
                  placeholder="Company Logo"
                />
              </div>
              <div className="space-y-2">
                <Label>Link URL (optional)</Label>
                <Input
                  value={selectedElement.link || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      link: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
                <p className="text-xs text-gray-500">Add a URL to make the logo clickable</p>
              </div>
              <div className="space-y-2">
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      width: parseInt(e.target.value) || 150,
                    })
                  }
                  min={50}
                  max={500}
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <Switch
                  checked={selectedElement.circular || false}
                  onCheckedChange={(checked) =>
                    onUpdateElement(selectedElement.id, {
                      circular: checked,
                    })
                  }
                />
                <Label>Circular Crop</Label>
              </div>
              <p className="text-xs text-gray-500 -mt-2">
                Enable to display logo in a circular shape
              </p>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== VIDEO ELEMENT ===== */}
          {selectedElement.type === 'video' && (
            <>
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  value={selectedElement.url}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      url: e.target.value,
                    })
                  }
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-xs text-gray-500">Use YouTube or Vimeo embed URL</p>
              </div>
              <div className="space-y-2">
                <Label>Thumbnail Image (optional)</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMediaLibrary('thumbnail')}
                >
                  <ImageIcon className="size-4 mr-2" />
                  Select Thumbnail
                </Button>
                <p className="text-xs text-gray-500">Fallback image if video doesn't load</p>
              </div>
              <div className="space-y-2">
                <Label>Width (%)</Label>
                <Input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      width: parseInt(e.target.value) || 100,
                    })
                  }
                  min={10}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== QUOTE ELEMENT ===== */}
          {selectedElement.type === 'quote' && (
            <>
              <div className="space-y-2">
                <Label>Quote Text</Label>
                <Textarea
                  value={selectedElement.text || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      text: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Enter quote text..."
                />
              </div>
              <div className="space-y-2">
                <Label>Author (optional)</Label>
                <Input
                  value={selectedElement.author || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      author: e.target.value,
                    })
                  }
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize || 18}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 18,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily || 'Georgia, serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight || 'normal'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color || '#333333'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.color || '#333333'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    placeholder="#333333"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor || '#f9fafb'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor || '#f9fafb'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#f9fafb"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.borderColor || '#e5e7eb'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        borderColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.borderColor || '#e5e7eb'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        borderColor: e.target.value,
                      })
                    }
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Border Width (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.borderWidth || 3}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      borderWidth: parseInt(e.target.value) || 3,
                    })
                  }
                  min={0}
                  max={10}
                />
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align || 'left'}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                  value={selectedElement.padding || 0}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== CTA ELEMENT ===== */}
          {selectedElement.type === 'cta' && (
            <>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  type="text"
                  value={selectedElement.title || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter CTA title..."
                />
              </div>
              
              {/* Title Styling Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Title Styling</Label>
              </div>
              <div className="space-y-2">
                <Label>Title Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.titleFontSize || 24}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      titleFontSize: parseInt(e.target.value) || 24,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Title Font Family</Label>
                <Select
                  value={selectedElement.titleFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      titleFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title Font Weight</Label>
                <Select
                  value={selectedElement.titleFontWeight || 'bold'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      titleFontWeight: value,
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
                <Label>Title Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.titleFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        titleFontStyle: selectedElement.titleFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                    className="flex-1"
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.titleTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        titleTextDecoration: selectedElement.titleTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                    className="flex-1"
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Description Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Description</Label>
              </div>
              <div className="space-y-2">
                <Label>Description Text</Label>
                <Textarea
                  value={selectedElement.description || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Enter description..."
                />
              </div>
              <div className="space-y-2">
                <Label>Description Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.descriptionFontSize || 16}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontSize: parseInt(e.target.value) || 16,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description Font Family</Label>
                <Select
                  value={selectedElement.descriptionFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description Font Weight</Label>
                <Select
                  value={selectedElement.descriptionFontWeight || 'normal'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      descriptionFontWeight: value,
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
                <Label>Description Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.descriptionFontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionFontStyle: selectedElement.descriptionFontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                    className="flex-1"
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.descriptionTextDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        descriptionTextDecoration: selectedElement.descriptionTextDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                    className="flex-1"
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Button Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Button</Label>
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  type="text"
                  value={selectedElement.buttonText || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonText: e.target.value,
                    })
                  }
                  placeholder="Click Here"
                />
              </div>
              <div className="space-y-2">
                <Label>Button URL</Label>
                <Input
                  type="url"
                  value={selectedElement.buttonUrl || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.buttonFontSize || 16}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonFontSize: parseInt(e.target.value) || 16,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Button Font Family</Label>
                <Select
                  value={selectedElement.buttonFontFamily || 'Arial, sans-serif'}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      buttonFontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Button Font Weight</Label>
                <Select
                  value={selectedElement.buttonFontWeight || 'bold'}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
                      buttonFontWeight: value,
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
              
              {/* Colors Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Colors</Label>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={selectedElement.backgroundColor || '#f3f4f6'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      backgroundColor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={selectedElement.textColor || '#111827'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      textColor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Button Color</Label>
                <Input
                  type="color"
                  value={selectedElement.buttonColor || '#4A90E2'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonColor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Button Text Color</Label>
                <Input
                  type="color"
                  value={selectedElement.buttonTextColor || '#ffffff'}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      buttonTextColor: e.target.value,
                    })
                  }
                />
              </div>
              
              {/* Layout Section */}
              <div className="border-t pt-3 mt-3">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Layout</Label>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align || 'center'}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                  value={selectedElement.padding || 0}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== ANNOUNCEMENT ELEMENT ===== */}
          {selectedElement.type === 'announcement' && (
            <>
              <div className="space-y-2">
                <Label>Announcement Text</Label>
                <Textarea
                  value={selectedElement.text}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      text: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 14,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Padding (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.padding}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== NAVIGATION ELEMENT ===== */}
          {selectedElement.type === 'navigation' && (
            <>
              <div className="space-y-2">
                <Label>Navigation Links</Label>
                {selectedElement.links.map((link, idx) => (
                  <div key={idx} className="space-y-2 p-3 border rounded">
                    <div>
                      <Label className="text-xs">Link Text</Label>
                      <Input
                        value={link.text}
                        onChange={(e) => {
                          const newLinks = [...selectedElement.links];
                          newLinks[idx].text = e.target.value;
                          onUpdateElement(selectedElement.id, { links: newLinks });
                        }}
                        placeholder="Link text"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...selectedElement.links];
                          newLinks[idx].url = e.target.value;
                          onUpdateElement(selectedElement.id, { links: newLinks });
                        }}
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newLinks = selectedElement.links.filter((_, i) => i !== idx);
                        onUpdateElement(selectedElement.id, { links: newLinks });
                      }}
                      className="w-full text-red-600"
                    >
                      Remove Link
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newLinks = [...selectedElement.links, { text: 'New Link', url: '#' }];
                    onUpdateElement(selectedElement.id, { links: newLinks });
                  }}
                  className="w-full"
                >
                  + Add Link
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 14,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                  value={selectedElement.align}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Padding (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.padding}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== SIGNATURE ELEMENT ===== */}
          {selectedElement.type === 'signature' && (
            <>
              <div className="space-y-2">
                <Label>Select Image</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMediaLibrary('main')}
                >
                  <ImageIcon className="size-4 mr-2" />
                  {selectedElement.imageUrl ? 'Change Image' : 'Select Image'}
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={selectedElement.name}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      name: e.target.value,
                    })
                  }
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={selectedElement.title}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      title: e.target.value,
                    })
                  }
                  placeholder="Your Title"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={selectedElement.company}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      company: e.target.value,
                    })
                  }
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 14,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image Alignment</Label>
                <Select
                  value={selectedElement.imageAlign}
                  onValueChange={(value: 'left' | 'right') =>
                    onUpdateElement(selectedElement.id, {
                      imageAlign: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
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
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* ===== FOOTER ELEMENT ===== */}
          {selectedElement.type === 'footer' && (
            <>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={selectedElement.companyName}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      companyName: e.target.value,
                    })
                  }
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={selectedElement.address}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      address: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Company Address"
                />
              </div>
              <div className="space-y-2">
                <Label>Footer Links</Label>
                {selectedElement.links.map((link, idx) => (
                  <div key={idx} className="space-y-2 p-3 border rounded">
                    <div>
                      <Label className="text-xs">Link Text</Label>
                      <Input
                        value={link.text}
                        onChange={(e) => {
                          const newLinks = [...selectedElement.links];
                          newLinks[idx].text = e.target.value;
                          onUpdateElement(selectedElement.id, { links: newLinks });
                        }}
                        placeholder="Link text"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...selectedElement.links];
                          newLinks[idx].url = e.target.value;
                          onUpdateElement(selectedElement.id, { links: newLinks });
                        }}
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newLinks = selectedElement.links.filter((_, i) => i !== idx);
                        onUpdateElement(selectedElement.id, { links: newLinks });
                      }}
                      className="w-full text-red-600"
                    >
                      Remove Link
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newLinks = [...selectedElement.links, { text: 'New Link', url: '#' }];
                    onUpdateElement(selectedElement.id, { links: newLinks });
                  }}
                  className="w-full"
                >
                  + Add Link
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 12,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) =>
                    onUpdateElement(selectedElement.id, {
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value: 'normal' | 'bold') =>
                    onUpdateElement(selectedElement.id, {
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
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                      })
                    }
                  >
                    <Italic className="size-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline',
                      })
                    }
                  >
                    <Underline className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Switch
                    checked={selectedElement.showUnsubscribe}
                    onCheckedChange={(checked) =>
                      onUpdateElement(selectedElement.id, {
                        showUnsubscribe: checked,
                      })
                    }
                  />
                  Show Unsubscribe Link
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={selectedElement.textColor}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textColor: e.target.value,
                      })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Padding (px)</Label>
                <Input
                  type="number"
                  value={selectedElement.padding}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      padding: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* Note: Other element types (Columns, Spacer) 
              remain unchanged and would go here with their existing property panels */}
        </div>
      </div>

      {/* Media Library Modal - used for selecting images for elements */}
      <MediaLibraryModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelectMedia={handleMediaSelect}
      />
    </div>
  );
}
