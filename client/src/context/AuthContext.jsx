import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, getOrganization, logoutUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    setLoading(true);
    try {
      // First, get user
      const userRes = await getCurrentUser();
      setUser(userRes.data.user);

      // Second, try to get organization
      try {
        const orgRes = await getOrganization();
        setOrganization(orgRes.data.organization);
      } catch {
        // If organization is 404, they don't have one
        setOrganization(null);
      }
    } catch {
      // User is not authenticated
      setUser(null);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Failed to log out', err);
    } finally {
      setUser(null);
      setOrganization(null);
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    organization,
    loading,
    isAuthenticated: !!user,
    hasOrganization: !!organization,
    refreshAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
