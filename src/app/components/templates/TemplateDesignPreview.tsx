import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { X, Check } from 'lucide-react';

interface TemplateDesignPreviewProps {
  open: boolean;
  onClose: () => void;
  design: {
    id: string;
    name: string;
    category: string;
    thumbnail: string;
    description: string;
  } | null;
  onSelect?: () => void;
}

// Email template previews with actual HTML/CSS designs
const EmailPreviews: { [key: string]: JSX.Element } = {
  'welcome-modern': (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-[600px] mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Our Community!</h1>
          <p className="text-blue-100">We're excited to have you here</p>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <p className="text-gray-700 mb-4">Hi [First Name],</p>
          <p className="text-gray-700 mb-6">
            Thank you for joining us! We're thrilled to welcome you to our community of innovative thinkers and creators.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-gray-700 font-semibold mb-2">What's Next?</p>
            <ul className="text-gray-600 space-y-1 list-disc list-inside">
              <li>Complete your profile</li>
              <li>Explore our features</li>
              <li>Connect with others</li>
            </ul>
          </div>
          
          <div className="text-center">
            <a 
              href="#" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
          <p>© 2025 Your Company. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a> | 
            <a href="#" className="text-blue-600 hover:underline ml-2">Preferences</a>
          </p>
        </div>
      </div>
    </div>
  ),

  'newsletter-classic': (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-[600px] mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="border-b-4 border-blue-600 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Company Newsletter</h1>
          <p className="text-gray-600 text-sm">Monthly Edition - January 2025</p>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">This Month's Highlights</h2>
          
          {/* Article 1 */}
          <div className="mb-6 pb-6 border-b">
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=200&fit=crop" 
              alt="Article" 
              className="w-full h-32 object-cover rounded mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Article Title</h3>
            <p className="text-gray-700 mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
            <a href="#" className="text-blue-600 font-semibold hover:underline">Read More →</a>
          </div>
          
          {/* Article 2 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Updates</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">New feature releases coming next month</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">Team expansion in the APAC region</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">Upcoming webinar series announced</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-900 text-white p-6 text-center text-sm">
          <p>© 2025 Your Company. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            <a href="#" className="hover:text-white">Unsubscribe</a> | 
            <a href="#" className="hover:text-white ml-2">Update Preferences</a>
          </p>
        </div>
      </div>
    </div>
  ),

  'promo-bold': (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-[600px] mx-auto bg-white shadow-lg">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-12 text-center">
          <div className="inline-block bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold mb-4">
            LIMITED TIME OFFER
          </div>
          <h1 className="text-4xl font-bold mb-4">50% OFF</h1>
          <p className="text-xl mb-6">Everything Must Go!</p>
          <p className="text-purple-100 mb-6">Sale ends in 48 hours. Don't miss out!</p>
          <a 
            href="#" 
            className="inline-block bg-yellow-400 text-purple-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 shadow-lg"
          >
            SHOP NOW
          </a>
        </div>
        
        {/* Products */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Deals</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=200&fit=crop" 
                alt="Product" 
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <p className="font-semibold text-gray-900">Product Name</p>
                <p className="text-purple-600 font-bold">$49.99</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=200&fit=crop" 
                alt="Product" 
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <p className="font-semibold text-gray-900">Product Name</p>
                <p className="text-purple-600 font-bold">$39.99</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="#" 
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              View All Deals
            </a>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
          <p>Questions? Contact us at support@company.com</p>
          <p className="mt-2">
            <a href="#" className="text-purple-600 hover:underline">Unsubscribe</a>
          </p>
        </div>
      </div>
    </div>
  ),

  'promo-minimal': (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-[600px] mx-auto bg-white shadow-lg">
        {/* Content */}
        <div className="p-12 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Special Offer</p>
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            New Collection<br />
            <span className="font-bold">Now Available</span>
          </h1>
          
          <div className="my-8">
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop" 
              alt="Product" 
              className="w-full rounded-lg"
            />
          </div>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Discover our latest designs crafted with precision and care. Minimalist elegance meets modern functionality.
          </p>
          
          <a 
            href="#" 
            className="inline-block border-2 border-gray-900 text-gray-900 px-12 py-3 font-semibold hover:bg-gray-900 hover:text-white transition-colors"
          >
            Explore Collection
          </a>
          
          <p className="text-xs text-gray-500 mt-8">
            Free shipping on orders over $100
          </p>
        </div>
        
        {/* Footer */}
        <div className="border-t p-6 text-center text-xs text-gray-500">
          <p>© 2025 Your Brand</p>
          <p className="mt-2">
            <a href="#" className="hover:text-gray-900">Unsubscribe</a> | 
            <a href="#" className="hover:text-gray-900 ml-2">Preferences</a>
          </p>
        </div>
      </div>
    </div>
  ),

  'transactional-clean': (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-[600px] mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="bg-white border-b p-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
          <p className="text-gray-600">Order #12345</p>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">✓ Your order has been confirmed</p>
            <p className="text-green-700 text-sm">Expected delivery: January 20-22, 2025</p>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
          
          {/* Order Items */}
          <div className="border rounded-lg divide-y mb-6">
            <div className="p-4 flex justify-between">
              <div>
                <p className="font-semibold text-gray-900">Product Name</p>
                <p className="text-sm text-gray-600">Quantity: 1</p>
              </div>
              <p className="font-semibold text-gray-900">$49.99</p>
            </div>
            <div className="p-4 flex justify-between">
              <div>
                <p className="font-semibold text-gray-900">Product Name</p>
                <p className="text-sm text-gray-600">Quantity: 2</p>
              </div>
              <p className="font-semibold text-gray-900">$79.98</p>
            </div>
          </div>
          
          {/* Total */}
          <div className="border-t-2 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">$129.97</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">$10.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">$139.97</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="#" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Track Order
            </a>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
          <p>Need help? Contact support@company.com</p>
          <p className="mt-2">© 2025 Your Company</p>
        </div>
      </div>
    </div>
  ),

  'event-elegant': (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-[600px] mx-auto bg-white shadow-lg">
        {/* Header Image */}
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop" 
            alt="Event" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-sm mb-2">You're Invited</p>
            <h1 className="text-3xl font-bold">Annual Gala Event</h1>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <p className="text-gray-700 mb-6">
            Join us for an evening of celebration, networking, and inspiration at our annual gala event.
          </p>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-semibold text-gray-900">January 25, 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="font-semibold text-gray-900">7:00 PM - 11:00 PM</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-semibold text-gray-900">Grand Ballroom, City Center</p>
              <p className="text-sm text-gray-600">123 Main Street, New York, NY</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Event Highlights</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">★</span>
                <span>Keynote speaker presentation</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">★</span>
                <span>Networking reception</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">★</span>
                <span>Three-course dinner</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center">
            <a 
              href="#" 
              className="inline-block bg-red-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-red-700 shadow-lg"
            >
              RSVP Now
            </a>
            <p className="text-sm text-gray-600 mt-3">Please RSVP by January 20</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
          <p>Questions? Contact events@company.com</p>
          <p className="mt-2">© 2025 Your Company</p>
        </div>
      </div>
    </div>
  ),
};

export function TemplateDesignPreview({
  open,
  onClose,
  design,
  onSelect,
}: TemplateDesignPreviewProps) {
  if (!design) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">{design.name}</DialogTitle>
              <DialogDescription>
                {design.description} • Category: {design.category}
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto border rounded-lg bg-gray-50">
          {EmailPreviews[design.id] || (
            <div className="p-8 text-center text-gray-500">
              Preview not available
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onSelect && (
            <Button
              onClick={() => {
                onSelect();
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="size-4 mr-2" />
              Select This Template
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
