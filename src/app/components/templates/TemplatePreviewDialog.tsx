import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Template } from './types';
import {
  Mail,
  Calendar,
  BarChart3,
  Edit,
  Copy,
  Send,
  Star,
  X,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { useState } from 'react';
import { renderTemplateElement } from './element-renderers';

interface TemplatePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
  onEdit?: (template: Template) => void;
  simpleMode?: boolean; // For campaign module - shows only preview without details
}

export function TemplatePreviewDialog({
  open,
  onClose,
  template,
  onEdit,
  simpleMode = false,
}: TemplatePreviewDialogProps) {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  if (!template) return null;

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        {/* Accessible Dialog Title and Description - visually hidden */}
        <DialogHeader className="sr-only">
          <DialogTitle>Preview Template: {template.name}</DialogTitle>
          <DialogDescription>
            Preview and manage the {template.name} email template. View on desktop or mobile, and take actions like editing, duplicating, or using the template.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        {!simpleMode && (
          <div className="border-b border-gray-200 px-6 py-4 bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
                  {template.isFavorite && (
                    <Star className="size-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500 font-mono mb-2">
                  Template ID: {template.id}
                </p>
                <p className="text-gray-600">{template.description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Badges and Stats Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={getCategoryColor(template.category)}
                >
                  {template.category}
                </Badge>
                {template.status === 'published' ? (
                  <Badge variant="default" className="bg-green-600">
                    Published
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-300"
                  >
                    Draft
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>{template.usageCount} uses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>Created {template.createdDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4" />
                  <span>Modified {template.lastModified}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Controls */}
        <div className="border-b border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Preview:</span>
            <div className="flex items-center border border-gray-200 rounded-lg bg-white">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeviceView('desktop');
                }}
                className={deviceView === 'desktop' ? 'bg-gray-100' : ''}
              >
                <Monitor className="size-4 mr-2" />
                Desktop
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeviceView('mobile');
                }}
                className={deviceView === 'mobile' ? 'bg-gray-100' : ''}
              >
                <Smartphone className="size-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>

          {simpleMode ? (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="size-6" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Duplicating template...')}
              >
                <Copy className="size-4 mr-2" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit && onEdit(template)}
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => alert('Creating campaign with this template...')}
                disabled={template.status === 'draft'}
              >
                <Send className="size-4 mr-2" />
                Use Template
              </Button>
            </div>
          )}
        </div>

        {/* Email Preview Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          <div className="flex items-start justify-center min-h-full">
            <div
              className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
                deviceView === 'desktop' ? 'w-full max-w-3xl' : 'w-full max-w-[375px]'
              }`}
            >
              {/* Email Client Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${deviceView === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold transition-all`}>
                    NC
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-gray-900 truncate ${deviceView === 'mobile' ? 'text-sm' : ''}`}>NConnect Newsletter</p>
                    <p className={`text-gray-500 truncate ${deviceView === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                      newsletter@nconnect.com
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">Just now</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 truncate">To: subscriber@example.com</p>
                  <p className={`font-semibold text-gray-900 ${deviceView === 'mobile' ? 'text-sm' : 'text-base'}`}>
                    {template.name} - Your Weekly Update
                  </p>
                </div>
              </div>

              {/* Email Body */}
              <div className={deviceView === 'mobile' ? 'p-4' : 'p-8'}>
                {/* Render actual template elements if they exist */}
                {template.elements && template.elements.length > 0 ? (
                  <div className="space-y-0">
                    {template.elements
                      .sort((a, b) => a.order - b.order)
                      .map((element) => (
                        <div key={element.id}>{renderTemplateElement(element)}</div>
                      ))}
                  </div>
                ) : (
                  <>
                    {/* Default placeholder content when no elements exist */}
                    {/* Hero Image */}
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-auto"
                      />
                    </div>

                    {/* Email Content */}
                    <div className={deviceView === 'mobile' ? 'space-y-4' : 'space-y-6'}>
                      <div>
                        <h1 className={`font-bold text-gray-900 mb-4 ${deviceView === 'mobile' ? 'text-xl' : 'text-3xl'}`}>
                          {template.category === 'newsletter'
                            ? 'Welcome to Our Newsletter!'
                            : template.category === 'promotional'
                            ? 'Exclusive Offer Just for You'
                            : template.category === 'transactional'
                            ? 'Your Order Confirmation'
                            : 'You\'re Invited to Our Event'}
                        </h1>
                        <p className={`text-gray-700 leading-relaxed ${deviceView === 'mobile' ? 'text-base' : 'text-lg'}`}>
                          Hi there! 👋
                        </p>
                      </div>

                      <p className={`text-gray-700 leading-relaxed ${deviceView === 'mobile' ? 'text-sm' : ''}`}>
                        {template.category === 'newsletter'
                          ? 'Thank you for subscribing to our newsletter! We\'re excited to have you as part of our community. You\'ll receive regular updates, exclusive content, and insider tips delivered straight to your inbox.'
                          : template.category === 'promotional'
                          ? 'We have an amazing offer exclusively for you! For a limited time only, enjoy special discounts on our premium products. Don\'t miss out on this incredible opportunity.'
                          : template.category === 'transactional'
                          ? 'Thank you for your order! We\'ve received your purchase and are processing it right away. You\'ll receive a shipping confirmation as soon as your items are on their way.'
                          : 'We\'d love for you to join us at our upcoming event! It\'s going to be an amazing experience with great speakers, networking opportunities, and lots of valuable insights.'}
                      </p>

                      {/* Feature Boxes */}
                      <div className={`grid gap-4 ${deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                        <div className={`bg-blue-50 rounded-lg text-center ${deviceView === 'mobile' ? 'p-3' : 'p-4'}`}>
                          <div className={deviceView === 'mobile' ? 'text-2xl mb-1' : 'text-3xl mb-2'}>📧</div>
                          <p className="text-sm font-medium text-gray-900">
                            Weekly Updates
                          </p>
                        </div>
                        <div className={`bg-purple-50 rounded-lg text-center ${deviceView === 'mobile' ? 'p-3' : 'p-4'}`}>
                          <div className={deviceView === 'mobile' ? 'text-2xl mb-1' : 'text-3xl mb-2'}>🎁</div>
                          <p className="text-sm font-medium text-gray-900">
                            Exclusive Offers
                          </p>
                        </div>
                        <div className={`bg-green-50 rounded-lg text-center ${deviceView === 'mobile' ? 'p-3' : 'p-4'}`}>
                          <div className={deviceView === 'mobile' ? 'text-2xl mb-1' : 'text-3xl mb-2'}>💡</div>
                          <p className="text-sm font-medium text-gray-900">
                            Expert Tips
                          </p>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg ${deviceView === 'mobile' ? 'p-4' : 'p-6'}`}>
                        <p className={`text-gray-900 font-semibold ${deviceView === 'mobile' ? 'mb-2 text-sm' : 'mb-3'}`}>
                          Ready to get started?
                        </p>
                        <Button className={`bg-blue-600 hover:bg-blue-700 w-full ${deviceView === 'mobile' ? 'text-sm py-2' : 'md:w-auto'}`}>
                          Take Action Now →
                        </Button>
                      </div>

                      {/* Additional Content */}
                      <p className={`text-gray-600 leading-relaxed ${deviceView === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                        This is a preview of how your email template will appear to
                        subscribers. In the template editor, you'll be able to customize
                        every element including colors, fonts, images, layout, and content.
                        You can also use merge tags to personalize emails with subscriber
                        data like their name, company, or custom fields.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Email Footer */}
              <div className={`bg-gray-50 border-t border-gray-200 rounded-b-lg ${deviceView === 'mobile' ? 'px-4 py-4' : 'px-8 py-6'}`}>
                <div className={deviceView === 'mobile' ? 'space-y-3' : 'space-y-4'}>
                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href="#"
                      className={`${deviceView === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'} bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors`}
                    >
                      <span className={`text-blue-600 font-bold ${deviceView === 'mobile' ? 'text-sm' : ''}`}>f</span>
                    </a>
                    <a
                      href="#"
                      className={`${deviceView === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'} bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors`}
                    >
                      <span className={`text-blue-400 font-bold ${deviceView === 'mobile' ? 'text-sm' : ''}`}>𝕏</span>
                    </a>
                    <a
                      href="#"
                      className={`${deviceView === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'} bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors`}
                    >
                      <span className={`text-blue-700 font-bold ${deviceView === 'mobile' ? 'text-sm' : ''}`}>in</span>
                    </a>
                  </div>

                  {/* Footer Text */}
                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-600">
                      <strong>NConnect</strong> | 123 Newsletter Street, Email City, EC 12345
                    </p>
                    <p className="text-xs text-gray-500">
                      You're receiving this email because you subscribed to our newsletter.
                    </p>
                    <p className="text-xs text-gray-500">
                      <a href="#" className="text-blue-600 hover:underline">
                        Unsubscribe
                      </a>
                      {' | '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Update Preferences
                      </a>
                      {' | '}
                      <a href="#" className="text-blue-600 hover:underline">
                        View in Browser
                      </a>
                    </p>
                    <p className="text-xs text-gray-400 pt-2">
                      © 2026 NConnect. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}