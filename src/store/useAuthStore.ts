import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username, token) => {
        localStorage.setItem('auth_token', token);
        set({ isAuthenticated: true, user: { username } });
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ isAuthenticated: false, user: null });
      },
    }),
    { name: 'auth-storage' }
  )
);
