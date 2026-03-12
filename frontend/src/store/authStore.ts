import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    roles: string[]; // ['ADMIN', 'MEMBER'] etc.
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;

    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,

            login: (user, token) => set({ user, token, isAuthenticated: true }),

            logout: () => {
                // Ekhane Supabase thekeo sign out korar logic thakbe pore
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'crc-auth-storage', // LocalStorage e ei name e save thakbe
        }
    )
);