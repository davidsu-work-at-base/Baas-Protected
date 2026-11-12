import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

const statusOf = (error) => (error && (error.status || (error.response && error.response.status))) || null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = useCallback(async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setAuthError(null);
      return currentUser;
    } catch (error) {
      const status = statusOf(error);
      setUser(null);
      if (status === 403) {
        setAuthError({ type: 'user_not_registered', message: (error && error.message) || '' });
      } else {
        setAuthError(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await checkUserAuth();
      if (active) setIsLoadingAuth(false);
    })();
    return () => {
      active = false;
    };
  }, [checkUserAuth]);

  const logout = (redirectUrl) => base44.auth.logout(redirectUrl);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoadingAuth,
    authError,
    logout,
    checkUserAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};