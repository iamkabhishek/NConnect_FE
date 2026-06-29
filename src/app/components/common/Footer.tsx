import React from 'react';
import { Wrench, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateToAboutUs?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToPrivacyPolicy?: () => void;
  onNavigateToTermsOfService?: () => void;
  onNavigateToDataDeletion?: () => void;
}

export function Footer({
  onNavigateToAboutUs,
  onNavigateToContact,
  onNavigateToPrivacyPolicy,
  onNavigateToTermsOfService,
  onNavigateToDataDeletion,
}: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg">NConnect</h3>
                <p className="text-xs text-gray-400">Digital MEP Testing</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              The complete solution for digitizing MEP equipment testing and commissioning workflows.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm mb-4 text-gray-300">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm mb-4 text-gray-300">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToAboutUs?.();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToContact?.();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm mb-4 text-gray-300">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToPrivacyPolicy?.();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToTermsOfService?.();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToDataDeletion?.();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Data Deletion Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-gray-400">
              © 2024 NConnect. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-900/20 via-gray-800/30 to-green-900/20 border border-orange-500/30 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer group">
              <Heart className="w-3.5 h-3.5 text-red-500 group-hover:scale-125 transition-transform duration-300 fill-red-500" />
              <span className="text-xs bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                Proudly Made In India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
