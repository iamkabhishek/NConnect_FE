'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Workspace {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
  memberCount: number;
}

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'workspace_admin' | 'workspace_member';
  onboarded: boolean;
  avatar?: string;
  permissions: {
    contacts: 'none' | 'viewer' | 'editor' | 'admin';
    campaigns: 'none' | 'viewer' | 'editor' | 'admin';
    templates: 'none' | 'viewer' | 'editor' | 'admin';
    automation: 'none' | 'viewer' | 'editor' | 'admin';
    settings: 'none' | 'viewer' | 'editor' | 'admin';
    users: 'none' | 'viewer' | 'editor' | 'admin';
    workspaces: 'none' | 'viewer' | 'editor' | 'admin';
    senderEmails: 'none' | 'viewer' | 'editor' | 'admin';
    reports: 'none' | 'viewer' | 'editor' | 'admin';
    media: 'none' | 'viewer' | 'editor' | 'admin';
  };
}

interface WorkspaceContextType {
  selectedWorkspace: Workspace;
  setSelectedWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  addWorkspace: (workspace: Workspace) => void;
  currentUser: UserPersona;
  setCurrentUser: (user: UserPersona) => void;
  personas: UserPersona[];
  switchPersona: (email: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Mock workspaces data
const defaultWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'My Business Newsletter',
    color: '#8B5CF6', // Violet-fuchsia matching theme
    description: 'Main business communications',
    createdAt: '2024-01-15',
    memberCount: 5,
  },
  {
    id: 'workspace-2',
    name: 'Marketing Team',
    color: '#EC4899', // Fuchsia theme
    description: 'Marketing campaigns and promotions',
    createdAt: '2024-02-20',
    memberCount: 8,
  },
  {
    id: 'workspace-3',
    name: 'Product Updates',
    color: '#3B82F6', // Indigo theme
    description: 'Product announcements and updates',
    createdAt: '2024-03-10',
    memberCount: 3,
  },
];

// Mock user personas for role-based testing
const availablePersonas: UserPersona[] = [
  {
    id: 'USR-owner',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner',
    onboarded: true, // Organization owner onboarding is complete
    avatar: 'JD',
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
  },
  {
    id: 'USR-admin',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'workspace_admin',
    onboarded: true, // Invited workspace admin bypasses onboarding
    avatar: 'JS',
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
  },
  {
    id: 'USR-member',
    name: 'Mark Miller',
    email: 'mark@example.com',
    role: 'workspace_member',
    onboarded: true, // Invited member bypasses onboarding
    avatar: 'MM',
    permissions: {
      contacts: 'editor',
      campaigns: 'viewer', // Custom Viewer access for campaigns
      templates: 'editor', // Custom Editor access for templates
      automation: 'none',  // Restricted: Cannot see or manage workflows
      settings: 'none',    // Restricted: Cannot see or change settings
      users: 'none',       // Restricted: Cannot manage users
      workspaces: 'none',  // Restricted: Cannot manage workspaces
      senderEmails: 'viewer',
      reports: 'viewer',
      media: 'editor',
    }
  }
];

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>(defaultWorkspaces[0]);
  const [currentUser, setCurrentUser] = useState<UserPersona>(availablePersonas[0]); // default to John Doe (Owner)

  const addWorkspace = (workspace: Workspace) => {
    setWorkspaces([...workspaces, workspace]);
    setSelectedWorkspace(workspace);
  };

  const switchPersona = (email: string) => {
    const found = availablePersonas.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      
      // Select appropriate workspace default based on the persona
      if (found.role === 'workspace_admin') {
        // Workspace Admins are assigned to workspace-2 (Marketing Team)
        const marketingWS = workspaces.find(w => w.id === 'workspace-2') || workspaces[0];
        setSelectedWorkspace(marketingWS);
      } else if (found.role === 'workspace_member') {
        // Workspace members are assigned to workspace-3
        const productWS = workspaces.find(w => w.id === 'workspace-3') || workspaces[0];
        setSelectedWorkspace(productWS);
      } else {
        // Owner default
        setSelectedWorkspace(workspaces[0]);
      }
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspace,
        setSelectedWorkspace,
        workspaces,
        addWorkspace,
        currentUser,
        setCurrentUser,
        personas: availablePersonas,
        switchPersona,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}