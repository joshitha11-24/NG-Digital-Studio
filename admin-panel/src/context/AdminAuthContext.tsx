import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: 'STUDIO_ADMIN' | 'SUPER_ADMIN';
  studio?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verify stored admin session token with backend on initial load
  useEffect(() => {
    let isMounted = true;

    const verifyActiveSession = async () => {
      const token = sessionStorage.getItem('ng_admin_token') || localStorage.getItem('ng_admin_token');
      const email = sessionStorage.getItem('ng_admin_email') || localStorage.getItem('ng_admin_email');

      if (!token || !email) {
        if (isMounted) {
          setAdminUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-admin-token': token,
            'x-admin-email': email
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.admin && isMounted) {
            setAdminUser(data.admin);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Admin session verification notice:', err);
      }

      // If token verification failed or expired, clean up admin storage
      if (isMounted) {
        sessionStorage.removeItem('ng_admin_token');
        sessionStorage.removeItem('ng_admin_email');
        localStorage.removeItem('ng_admin_token');
        localStorage.removeItem('ng_admin_email');
        setAdminUser(null);
        setLoading(false);
      }
    };

    verifyActiveSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!cleanEmail) {
      setError('Please enter your administrator email.');
      setLoading(false);
      return false;
    }

    if (!cleanPass) {
      setError('Please enter your administrator password.');
      setLoading(false);
      return false;
    }

    try {
      // Separate Administrator Backend Authentication (isolated from Firebase customer auth)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPass
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.admin && data.token) {
        // Persist session token for authenticated admin requests
        sessionStorage.setItem('ng_admin_token', data.token);
        sessionStorage.setItem('ng_admin_email', data.admin.email);
        localStorage.setItem('ng_admin_token', data.token);
        localStorage.setItem('ng_admin_email', data.admin.email);

        setAdminUser(data.admin);
        setLoading(false);
        return true;
      } else {
        const errorMsg = data.message || 'Invalid administrator email or password.';
        setError(errorMsg);
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error('Admin login connection error:', err);
      setError('Unable to connect to administrative authentication service. Please check connection and try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    const token = sessionStorage.getItem('ng_admin_token') || localStorage.getItem('ng_admin_token');
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-admin-token': token
          }
        });
      }
    } catch (e) {
      console.warn('Admin logout notification note:', e);
    }

    sessionStorage.removeItem('ng_admin_token');
    sessionStorage.removeItem('ng_admin_email');
    localStorage.removeItem('ng_admin_token');
    localStorage.removeItem('ng_admin_email');
    setAdminUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, error, login, logout, clearError }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
