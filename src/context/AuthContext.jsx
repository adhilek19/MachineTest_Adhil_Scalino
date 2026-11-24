import React, { createContext, useState, useEffect } from 'react';
import { ADMIN_AUTH_KEY, CANDIDATE_NAME } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored auth session', e);
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login handler for Admin Portal
   * Accepts credentials (username/password or candidate identity)
   */
  const login = async (credentials) => {
    const { username = 'admin', password = '' } = credentials;

    // Client-side demonstration session adhering to backend Swagger spec:
    // The backend provides no login or token endpoints. Client-side session enables route-guarded admin portal evaluation.
    if (!username.trim()) {
      throw new Error('Please enter a username');
    }

    const authSession = {
      username: username.trim(),
      displayName: username.toLowerCase() === 'admin' ? `${CANDIDATE_NAME} (Admin)` : username.trim(),
      role: 'admin',
      clientSessionId: 'demo_session_' + Date.now(),
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(authSession));
    setUser(authSession);
    return authSession;
  };

  /**
   * Logout handler
   */
  const logout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
