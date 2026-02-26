import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface User {
    id: string;
    email: string;
    characterCreated: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                set({ isLoading: true });
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ isLoading: false, isAuthenticated: false });
                    return;
                }
                try {
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        set({ user: response.data.data, token, isAuthenticated: true });
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    set({ user: null, token: null, isAuthenticated: false });
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }), // only persist token
        }
    )
);
