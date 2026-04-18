import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { IUser } from '../types/user.type';

/* ══════════════════════════════════════════
   AuthContext — Xác thực người dùng
   
   Mock-friendly: không gọi backend.
   Lưu token + user vào localStorage để giữ session qua reload.
   
   Khi backend sẵn sàng:
   - Trong login(), gọi POST /api/auth/login (signature verify)
   - Lấy token + user từ response thay vì tạo mock
   ══════════════════════════════════════════ */

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (walletAddress: string, signature: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Rehydrate từ localStorage khi app load ──
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser) as IUser);
    } catch (err) {
      console.warn('[AuthContext] rehydrate failed:', err);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Mock login: giả lập backend trả token + user ──
  const login = useCallback(async (walletAddress: string, _signature: string) => {
    // TODO: thay bằng POST /api/auth/login khi backend ready
    await new Promise((r) => setTimeout(r, 300));

    const mockToken = `mock-token-${Date.now()}`;
    const mockUser: IUser = {
      _id: `user-${walletAddress.slice(2, 8)}`,
      walletAddress: walletAddress.toLowerCase(),
      name: 'Mock Organizer',
      role: 'organizer',
    };

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    setToken(mockToken);
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ── Hook tiện dụng cho component con ── */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong <AuthProvider>');
  return ctx;
}
