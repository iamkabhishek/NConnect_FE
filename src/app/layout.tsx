import { ReactNode } from 'react';
import { WorkspaceProvider } from '@/app/contexts/WorkspaceContext';
import '../styles/index.css';

export const metadata = {
  title: 'NConnect',
  description: 'Streamline your newsletter campaigns with an intuitive platform.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 bg-gray-50 text-gray-900 antialiased">
        <WorkspaceProvider>
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
