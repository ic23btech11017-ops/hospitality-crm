import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: Record<UserRole, User> = {
  admin: { id: 'u1', name: 'Admin User', email: 'admin@hotel.com', role: 'admin', avatar: '' },
  front_desk: { id: 'u2', name: 'Front Desk Staff', email: 'frontdesk@hotel.com', role: 'front_desk', avatar: '' },
  event_manager: { id: 'u3', name: 'Event Manager', email: 'events@hotel.com', role: 'event_manager', avatar: '' },
  manager: { id: 'u4', name: 'General Manager', email: 'manager@hotel.com', role: 'manager', avatar: '' },
};

// Permission matrix
const permissions: Record<UserRole, Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>> = {
  admin: {
    rooms: { view: true, create: true, edit: true, delete: true },
    bookings: { view: true, create: true, edit: true, delete: true },
    events: { view: true, create: true, edit: true, delete: true },
    food: { view: true, create: true, edit: true, delete: true },
    guests: { view: true, create: true, edit: true, delete: true },
    billing: { view: true, create: true, edit: true, delete: true },
    integrations: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
  },
  front_desk: {
    rooms: { view: true, create: false, edit: true, delete: false },
    bookings: { view: true, create: true, edit: true, delete: false },
    events: { view: true, create: false, edit: false, delete: false },
    food: { view: true, create: false, edit: false, delete: false },
    guests: { view: true, create: true, edit: true, delete: false },
    billing: { view: true, create: true, edit: false, delete: false },
    integrations: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
  },
  event_manager: {
    rooms: { view: true, create: false, edit: false, delete: false },
    bookings: { view: true, create: false, edit: false, delete: false },
    events: { view: true, create: true, edit: true, delete: true },
    food: { view: true, create: true, edit: true, delete: true },
    guests: { view: true, create: false, edit: false, delete: false },
    billing: { view: true, create: true, edit: false, delete: false },
    integrations: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
  },
  manager: {
    rooms: { view: true, create: false, edit: false, delete: false },
    bookings: { view: true, create: false, edit: false, delete: false },
    events: { view: true, create: false, edit: false, delete: false },
    food: { view: true, create: false, edit: false, delete: false },
    guests: { view: true, create: false, edit: false, delete: false },
    billing: { view: true, create: false, edit: false, delete: false },
    integrations: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: false, delete: false },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.get<User | null>(STORAGE_KEYS.USER, null));

  useEffect(() => {
    if (user) {
      storage.set(STORAGE_KEYS.USER, user);
    } else {
      storage.remove(STORAGE_KEYS.USER);
    }
  }, [user]);

  const login = useCallback(async (email: string, _password: string, role?: UserRole): Promise<boolean> => {
    // For demo purposes, accept any email with the role parameter
    // In production, this would validate against a backend
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    const selectedRole = role || 'admin';
    const demoUser = demoUsers[selectedRole];
    
    if (demoUser) {
      setUser({ ...demoUser, email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
      if (!user) return false;
      const rolePermissions = permissions[user.role];
      const modulePermissions = rolePermissions[module];
      return modulePermissions?.[action] ?? false;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
