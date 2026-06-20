import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function WelcomeScreen({ onSignIn, onSignUp }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="size-8 text-blue-500" />
            <span className="ml-2 text-2xl font-bold text-gray-900">NConnect</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Newsletter Management Made Simple
            </h1>
            <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
              Create, send, and manage newsletters with ease. Self-hostable, minimalist, and powerful.
            </p>
            
            <div className="flex justify-center gap-4 mb-12">
              <Button 
                onClick={onSignUp}
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white h-14 px-8 text-lg"
              >
                Sign Up
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button 
                onClick={onSignIn}
                variant="outline" 
                size="lg"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg"
              >
                Sign In
              </Button>
            </div>

            {/* Hero Illustration Placeholder */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 shadow-xl">
              <div className="flex items-center justify-center">
                <Mail className="size-32 text-blue-500 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}