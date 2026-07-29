// frontend/lib/stores/auth.store.ts
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

interface AuthActions {
  setAccessToken: (token: string | null) => void;
  setUser: (user: AuthState['user'] | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));