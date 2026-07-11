'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getTenants, switchTenant, refreshCognitoTokens, getStoredToken, getMe } from '@/app/lib/api';

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
  role: 'owner' | 'workspace_admin' | 'workspace_member' | 'guest' | 'platform_admin';
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
  customUserId?: string;
  customTenantId?: string | null;
  tenantId?: string | null;
}

interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace) => Promise<void>;
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
  },
  {
    id: 'USR-guest',
    name: 'Guest User',
    email: 'guest@nconnect.app',
    role: 'guest',
    onboarded: true,
    avatar: 'GU',
    permissions: {
      contacts: 'viewer',
      campaigns: 'viewer',
      templates: 'viewer',
      automation: 'viewer',
      settings: 'none',
      users: 'none',
      workspaces: 'none',
      senderEmails: 'viewer',
      reports: 'viewer',
      media: 'viewer',
    }
  }
];

interface WorkspaceProviderProps {
  children: ReactNode;
}



export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspaceInternal] = useState<Workspace | null>(null);
  const [currentUser, setCurrentUserInternal] = useState<UserPersona>(availablePersonas[0]); 
  const [customPersonas, setCustomPersonas] = useState<UserPersona[]>([]);

  // Fetch workspaces on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = getStoredToken();
        if (!token) return;
        
        const data = await getTenants(token);
        const wsList = data.tenants
          .filter((t: any) => t.type === 'workspace')
          .map((t: any) => ({
            id: t.tenantId,
            name: t.name,
            color: t.brandColor || '#8B5CF6',
            description: t.description || '',
            createdAt: t.joinedAt || new Date().toISOString(),
            memberCount: 1, 
          }));
        
        setWorkspaces(wsList);
        
        // Match selected workspace from localStorage or default to first
        const savedWorkspace = localStorage.getItem('nconnect_selected_workspace');
        if (savedWorkspace) {
          const parsed = JSON.parse(savedWorkspace);
          const found = wsList.find((w: any) => w.id === parsed.id);
          if (found) {
            setSelectedWorkspaceInternal(found);
          } else if (wsList.length > 0) {
            setSelectedWorkspaceInternal(wsList[0]);
          }
        } else if (wsList.length > 0) {
          setSelectedWorkspaceInternal(wsList[0]);
        }
      } catch (err) {
        console.error('Failed to fetch workspaces:', err);
      }
    };
    
    fetchWorkspaces();
  }, []);

  // Hydrate from localStorage on client-side mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nconnect_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUserInternal(parsed);
        
        // Background refresh to ensure the name is professional (sync with DB)
        const refreshProfile = async () => {
          try {
            const token = getStoredToken();
            if (token) {
              const me = await getMe(token);
              if (me.name && me.name !== parsed.name) {
                const updatedUser = { ...parsed, name: me.name };
                setCurrentUserInternal(updatedUser);
                localStorage.setItem('nconnect_current_user', JSON.stringify(updatedUser));
              }
            }
          } catch (e) {
            console.error('Failed to background refresh profile:', e);
          }
        };
        refreshProfile();
      } catch (e) {
        console.error('Failed to parse nconnect_current_user', e);
      }
    }
    const savedWorkspace = localStorage.getItem('nconnect_selected_workspace');
    if (savedWorkspace) {
      try {
        setSelectedWorkspaceInternal(JSON.parse(savedWorkspace));
      } catch (e) {
        console.error('Failed to parse nconnect_selected_workspace', e);
      }
    }
    const savedCustomPersonas = localStorage.getItem('nconnect_custom_personas');
    if (savedCustomPersonas) {
      try {
        setCustomPersonas(JSON.parse(savedCustomPersonas));
      } catch (e) {
        console.error('Failed to parse nconnect_custom_personas', e);
      }
    }
  }, []);

  const setCurrentUser = (user: UserPersona) => {
    setCurrentUserInternal(user);
    if (user) {
      localStorage.setItem('nconnect_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nconnect_current_user');
    }
  };

  const setSelectedWorkspace = async (workspace: Workspace) => {
    setSelectedWorkspaceInternal(workspace);
    if (workspace) {
      localStorage.setItem('nconnect_selected_workspace', JSON.stringify(workspace));
      
      try {
        const token = getStoredToken();
        const refreshToken = localStorage.getItem('nconnect_refresh_token');
        if (token && refreshToken) {
          await switchTenant(token, workspace.id);
          const newTokens = await refreshCognitoTokens(refreshToken);
          localStorage.setItem('nconnect_id_token', newTokens.token);
          localStorage.setItem('nconnect_access_token', newTokens.accessToken);
          // Reload to apply new tenant context
          window.location.reload();
        }
      } catch (err) {
        console.error('Failed to switch workspace on backend:', err);
      }
    } else {
      localStorage.removeItem('nconnect_selected_workspace');
    }
  };

  const addWorkspace = (workspace: Workspace) => {
    setWorkspaces([...workspaces, workspace]);
    setSelectedWorkspace(workspace);
  };

  const switchPersona = (email: string) => {
    // Reload custom personas in case they were updated
    const savedCustomPersonas = typeof window !== 'undefined'
      ? localStorage.getItem('nconnect_custom_personas')
      : null;
    let latestCustom: UserPersona[] = customPersonas;
    if (savedCustomPersonas) {
      try {
        latestCustom = JSON.parse(savedCustomPersonas);
        setCustomPersonas(latestCustom);
      } catch (e) {
        console.error(e);
      }
    }

    const allPersonas = [...availablePersonas, ...latestCustom];
    let found = allPersonas.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!found && email) {
      const newPersona: UserPersona = {
        id: 'USR-' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email: email,
        role: 'owner',
        onboarded: false,
        avatar: email.substring(0, 2).toUpperCase(),
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
      const updatedCustom = [...latestCustom, newPersona];
      if (typeof window !== 'undefined') {
        localStorage.setItem('nconnect_custom_personas', JSON.stringify(updatedCustom));
      }
      setCustomPersonas(updatedCustom);
      found = newPersona;
    }

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

  const dynamicPersonas = [...availablePersonas, ...customPersonas];

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspace,
        setSelectedWorkspace,
        workspaces,
        addWorkspace,
        currentUser,
        setCurrentUser,
        personas: dynamicPersonas,
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