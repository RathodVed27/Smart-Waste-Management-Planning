import { createContext, useContext, useState, type ReactNode } from 'react';

export type StaffRole = 'driver' | 'ward-admin' | 'super-admin';
interface AuthValue { role: StaffRole | null; signIn: (role: StaffRole) => void; signOut: () => void; }
const AuthContext = createContext<AuthValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<StaffRole | null>(null);
  return <AuthContext.Provider value={{ role, signIn: setRole, signOut: () => setRole(null) }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; };
