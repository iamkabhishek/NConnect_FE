import { useState } from 'react';
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
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  ArrowLeft,
  Save,
  Eye,
  Code,
  Layout,
  Settings,
  Image as ImageIcon,
  Type,
  Square,
  AlignLeft,
  Monitor,
  Smartphone,
  Undo,
  Redo,
} from 'lucide-react';
import { Template } from './types';

interface TemplateEditorProps {
  template: Template | null;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
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

  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [htmlContent, setHtmlContent] = useState(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${editedTemplate.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Our Newsletter</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; font-size: 22px; margin: 0 0 20px 0;">Hello there! 👋</h2>
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for subscribing to our newsletter. We're excited to have you as part of our community.
              </p>
              <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                You'll receive regular updates, exclusive content, and insider tips delivered straight to your inbox.
              </p>
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #4A90E2; border-radius: 4px; text-align: center;">
                    <a href="#" style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">Get Started</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                © 2026 NConnect. All rights reserved.
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                <a href="#" style="color: #4A90E2; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #4A90E2; text-decoration: none;">Update Preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`);

  const [subjectLine, setSubjectLine] = useState('Welcome to Our Newsletter!');
  const [preheaderText, setPreheaderText] = useState('Thank you for subscribing');

  const handleSave = () => {
    const updatedTemplate: Template = {
      ...editedTemplate,
      lastModified: new Date().toISOString().split('T')[0],
    };
    onSave(updatedTemplate);
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel} size="sm">
              <ArrowLeft className="size-4 mr-2" />
              Back to Templates
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                {template ? 'Edit Template' : 'Create Template'}
              </h1>
              <Badge
                variant="secondary"
                className={getCategoryColor(editedTemplate.category)}
              >
                {editedTemplate.category}
              </Badge>
              <Badge
                variant="outline"
                className={
                  editedTemplate.status === 'published'
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'text-orange-600 border-orange-300'
                }
              >
                {editedTemplate.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Eye className="size-4 mr-2" />
              Send Test Email
            </Button>
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
              {editedTemplate.status === 'published' ? 'Update' : 'Publish'} Template
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Settings */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <Tabs defaultValue="settings" className="h-full">
            <TabsList className="w-full grid grid-cols-2 p-2 bg-gray-50 border-b">
              <TabsTrigger value="settings">
                <Settings className="size-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="elements">
                <Layout className="size-4 mr-2" />
                Elements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="p-6 space-y-6 m-0">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={editedTemplate.name}
                  onChange={(e) =>
                    setEditedTemplate({ ...editedTemplate, name: e.target.value })
                  }
                  placeholder="Enter template name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedTemplate.description}
                  onChange={(e) =>
                    setEditedTemplate({
                      ...editedTemplate,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editedTemplate.category}
                  onValueChange={(value: any) =>
                    setEditedTemplate({ ...editedTemplate, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="font-semibold text-gray-900">Email Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={subjectLine}
                    onChange={(e) => setSubjectLine(e.target.value)}
                    placeholder="Enter subject line"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preheader">Preheader Text</Label>
                  <Input
                    id="preheader"
                    value={preheaderText}
                    onChange={(e) => setPreheaderText(e.target.value)}
                    placeholder="Preview text..."
                  />
                  <p className="text-xs text-gray-500">
                    Appears after the subject in inbox
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="font-semibold text-gray-900">Template Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{editedTemplate.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Modified:</span>
                    <span className="font-medium">{editedTemplate.lastModified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Count:</span>
                    <span className="font-medium">{editedTemplate.usageCount}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="elements" className="p-6 space-y-4 m-0">
              <p className="text-sm text-gray-600 mb-4">
                Drag elements to add to your template
              </p>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Type className="size-4 mr-2" />
                  Text Block
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <ImageIcon className="size-4 mr-2" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Square className="size-4 mr-2" />
                  Button
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <AlignLeft className="size-4 mr-2" />
                  Divider
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Layout className="size-4 mr-2" />
                  Columns
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-3">Merge Tags</p>
                <div className="space-y-1 text-xs">
                  <code className="block bg-gray-100 px-2 py-1 rounded">
                    {'{{subscriber.name}}'}
                  </code>
                  <code className="block bg-gray-100 px-2 py-1 rounded">
                    {'{{subscriber.email}}'}
                  </code>
                  <code className="block bg-gray-100 px-2 py-1 rounded">
                    {'{{unsubscribe_url}}'}
                  </code>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditorMode('visual')}
                    className={editorMode === 'visual' ? 'bg-gray-100' : ''}
                  >
                    <Layout className="size-4 mr-2" />
                    Visual
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditorMode('code')}
                    className={editorMode === 'code' ? 'bg-gray-100' : ''}
                  >
                    <Code className="size-4 mr-2" />
                    HTML
                  </Button>
                </div>

                {editorMode === 'visual' && (
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="ghost" size="sm">
                      <Undo className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Redo className="size-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className={previewMode === 'desktop' ? 'bg-gray-100' : ''}
                >
                  <Monitor className="size-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className={previewMode === 'mobile' ? 'bg-gray-100' : ''}
                >
                  <Smartphone className="size-4 mr-2" />
                  Mobile
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            {editorMode === 'visual' ? (
              <div className="flex items-start justify-center min-h-full">
                <div
                  className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
                    previewMode === 'desktop' ? 'w-full max-w-3xl' : 'w-full max-w-md'
                  }`}
                >
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full h-[800px] border-0 rounded-lg"
                    title="Template Preview"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-400">template.html</span>
                  </div>
                  <Textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="w-full h-[700px] bg-gray-900 text-green-400 font-mono text-sm p-6 border-0 rounded-none resize-none focus-visible:ring-0"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}