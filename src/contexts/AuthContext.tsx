import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  // Role helpers
  isOwner: boolean;
  isBranchManager: boolean;
  isStaff: boolean;
  // Current property scope — undefined for owner (sees all), set for branch_manager and staff
  currentPropertyId: string | undefined;
  setCurrentPropertyId: (id: string | undefined) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Demo Users ─────────────────────────────────────────────────────────────
const demoUsers: Record<UserRole, User> = {
  owner: {
    id: 'u-owner',
    name: 'Rajiv Mehta',
    email: 'owner@meridianhotels.com',
    role: 'owner',
    // No propertyId — owner sees the entire chain
  },
  branch_manager: {
    id: 'u-bm-p2',
    name: 'Deepa Krishnan',
    email: 'deepa@meridian-blr.com',
    role: 'branch_manager',
    propertyId: 'p2',
    branchName: 'Meridian Grand Bangalore',
  },
  staff: {
    id: 'u-staff-p1',
    name: 'Arjun Sharma',
    email: 'arjun@meridian-mum.com',
    role: 'staff',
    propertyId: 'p1',
    staffRole: 'front_desk',
    branchName: 'Grand Meridian Mumbai',
  },
};

// ─── Permission Matrix ───────────────────────────────────────────────────────
// Modules: rooms, bookings, events, food, guests, billing, integrations,
//          settings, properties, staff, analytics, reputation, alerts, reports
type Action = 'view' | 'create' | 'edit' | 'delete';
type ModulePermissions = Record<Action, boolean>;

const permissions: Record<UserRole, Record<string, ModulePermissions>> = {
  // Owner: full access to everything
  owner: {
    rooms:        { view: true,  create: true,  edit: true,  delete: true  },
    bookings:     { view: true,  create: true,  edit: true,  delete: true  },
    events:       { view: true,  create: true,  edit: true,  delete: true  },
    food:         { view: true,  create: true,  edit: true,  delete: true  },
    guests:       { view: true,  create: true,  edit: true,  delete: true  },
    billing:      { view: true,  create: true,  edit: true,  delete: true  },
    integrations: { view: true,  create: true,  edit: true,  delete: true  },
    settings:     { view: true,  create: true,  edit: true,  delete: true  },
    properties:   { view: true,  create: true,  edit: true,  delete: true  },
    staff:        { view: true,  create: true,  edit: true,  delete: true  },
    analytics:    { view: true,  create: true,  edit: true,  delete: true  },
    reputation:   { view: true,  create: true,  edit: true,  delete: true  },
    alerts:       { view: true,  create: true,  edit: true,  delete: true  },
    reports:      { view: true,  create: true,  edit: true,  delete: true  },
  },

  // Branch Manager: full operational access for THEIR branch + branch-scoped analytics/reports
  branch_manager: {
    rooms:        { view: true,  create: true,  edit: true,  delete: true  },
    bookings:     { view: true,  create: true,  edit: true,  delete: true  },
    events:       { view: true,  create: true,  edit: true,  delete: true  },
    food:         { view: true,  create: true,  edit: true,  delete: true  },
    guests:       { view: true,  create: true,  edit: true,  delete: true  },
    billing:      { view: true,  create: true,  edit: true,  delete: false },
    integrations: { view: true,  create: false, edit: false, delete: false },
    settings:     { view: true,  create: false, edit: true,  delete: false },
    properties:   { view: false, create: false, edit: false, delete: false }, // no chain-level
    staff:        { view: true,  create: true,  edit: true,  delete: false },
    analytics:    { view: false, create: false, edit: false, delete: false }, // no chain analytics
    reputation:   { view: false, create: false, edit: false, delete: false }, // no chain reputation
    alerts:       { view: false, create: false, edit: false, delete: false }, // no chain alerts
    reports:      { view: true,  create: false, edit: false, delete: false }, // branch reports only
  },

  // Staff: basic operational CRM — no analytics, no reports, no settings
  staff: {
    rooms:        { view: true,  create: false, edit: true,  delete: false },
    bookings:     { view: true,  create: true,  edit: true,  delete: false },
    events:       { view: true,  create: false, edit: false, delete: false },
    food:         { view: true,  create: false, edit: false, delete: false },
    guests:       { view: true,  create: true,  edit: true,  delete: false },
    billing:      { view: true,  create: true,  edit: false, delete: false },
    integrations: { view: false, create: false, edit: false, delete: false },
    settings:     { view: false, create: false, edit: false, delete: false },
    properties:   { view: false, create: false, edit: false, delete: false },
    staff:        { view: false, create: false, edit: false, delete: false },
    analytics:    { view: false, create: false, edit: false, delete: false },
    reputation:   { view: false, create: false, edit: false, delete: false },
    alerts:       { view: false, create: false, edit: false, delete: false },
    reports:      { view: false, create: false, edit: false, delete: false },
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.get<User | null>(STORAGE_KEYS.USER, null));

  useEffect(() => {
    if (user) storage.set(STORAGE_KEYS.USER, user);
    else storage.remove(STORAGE_KEYS.USER);
  }, [user]);

  const login = useCallback(async (email: string, _password: string, role?: UserRole): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const selectedRole = role ?? 'staff';
    const demoUser = demoUsers[selectedRole];
    if (demoUser) {
      setUser({ ...demoUser, email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const hasPermission = useCallback(
    (module: string, action: Action): boolean => {
      if (!user) return false;
      return permissions[user.role]?.[module]?.[action] ?? false;
    },
    [user]
  );

  const isOwner = user?.role === 'owner';
  const isBranchManager = user?.role === 'branch_manager';
  const isStaff = user?.role === 'staff';
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>('p1');
  
  // Use selected override for owner, otherwise fallback to the user's hardcoded property
  const currentPropertyId = isOwner ? selectedPropertyId : user?.propertyId; 

  const setCurrentPropertyId = useCallback((id: string | undefined) => {
    if (isOwner) {
      setSelectedPropertyId(id);
    }
  }, [isOwner]);

  // Reset selected property on user change
  useEffect(() => {
    setSelectedPropertyId('p1');
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user,
      login, logout, hasPermission,
      isOwner, isBranchManager, isStaff,
      currentPropertyId, setCurrentPropertyId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
