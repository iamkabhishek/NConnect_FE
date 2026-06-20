'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyEmailPage } from '@/app/components/auth/VerifyEmailPage';
import { useWorkspace, UserPersona } from '@/app/contexts/WorkspaceContext';

function VerifyEmailInner() {
  const router = useRouter();
  const { currentUser, setCurrentUser, personas } = useWorkspace();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'user@example.com';
  const name = searchParams.get('name') || '';

  const handleVerifySuccess = () => {
    // Check if we have a custom user name passed via signup redirect or stored in localStorage
    const savedSignupStr = localStorage.getItem('nconnect_signed_up_user');
    let finalEmail = email;
    if (savedSignupStr) {
      try {
        const saved = JSON.parse(savedSignupStr);
        finalEmail = saved.email || finalEmail;
      } catch (e) {
        console.error(e);
      }
    }

    // First, check if this persona/user already exists in personas or custom personas
    const customPersonas = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('nconnect_custom_personas') || '[]')
      : [];
    
    // Find in both context's personas and customPersonas list
    const existingPersona = personas.find((p: UserPersona) => p.email.toLowerCase() === finalEmail.toLowerCase()) ||
                            customPersonas.find((p: any) => p.email.toLowerCase() === finalEmail.toLowerCase());

    if (existingPersona) {
      // Store in context (which will write to localStorage)
      setCurrentUser(existingPersona);
      
      // Clean up signup scratch state
      localStorage.removeItem('nconnect_signed_up_user');

      if (existingPersona.onboarded) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
      return;
    }

    // Since we now enter full name during onboarding, derive default name from email address prefix
    const emailPrefix = finalEmail.split('@')[0] || 'User';
    const finalName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    // Build a custom user persona
    const customUser: UserPersona = {
      id: `USR-${Date.now()}`,
      name: finalName,
      email: finalEmail,
      role: 'owner', // Default role for new signups
      onboarded: false, // New signup starts with onboarded false
      avatar: finalName.substring(0, 2).toUpperCase(),
      permissions: {
        contacts: 'admin',
        campaigns: 'admin',
        templates: 'admin',
        automation: 'admin',
        settings: 'admin',
        users: 'admin',
        workspaces: 'admin',
        senderEmails: 'admin',
        reports: 'admin',
        media: 'admin',
      }
    };

    // Store in context (which will write to localStorage)
    setCurrentUser(customUser);

    // Save customUser to the custom personas list so the switcher works
    // Avoid duplicate emails
    const filtered = customPersonas.filter((p: any) => p.email.toLowerCase() !== finalEmail.toLowerCase());
    filtered.push(customUser);
    localStorage.setItem('nconnect_custom_personas', JSON.stringify(filtered));
    
    // Clean up signup scratch state
    localStorage.removeItem('nconnect_signed_up_user');

    // Since they are an owner and not onboarded yet, push to /onboarding
    router.push('/onboarding');
  };

  return (
    <VerifyEmailPage
      email={email}
      onVerifySuccess={handleVerifySuccess}
      onBack={() => router.push('/signin')}
    />
  );
}

export default function VerifyEmailRoute() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading verification screen...</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
