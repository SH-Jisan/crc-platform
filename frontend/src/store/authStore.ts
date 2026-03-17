import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    crc_id?: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    roles: string[]; // ['ADMIN', 'MEMBER'] etc.
    status?: string;
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

            logout: async () => {
                try {
                    // 🌟 Supabase থেকে সাইনআউট করানো হচ্ছে
                    const { supabase } = await import('../api/supabase');
                    await supabase.auth.signOut();
                } catch (e) {
                    // 403 বা অন্য কোনো এরর আসলে আমরা সেটা জাস্ট কনসোলে দেখাবো, অ্যাপ ফেইল করবে না
                    console.warn('Supabase logout issue (Ignored):', e);
                } finally {
                    // 🌟 THE FIX: ডাটাবেস যাই বলুক, আমরা লোকাল স্টেট জিরো করে দেবো
                    set({ user: null, token: null, isAuthenticated: false });

                    // ব্রাউজারের ক্যাশ থেকে ইউজার ডাটা মুছে ফেলা
                    localStorage.removeItem('crc-auth-storage');

                    // লগইন পেজে সরাসরি পাঠিয়ে দেওয়া (যাতে কোনো মেমোরি ক্যাশ না থাকে)
                    window.location.href = '/auth';
                }
            },
        }),
        {
            name: 'crc-auth-storage', // LocalStorage e ei name e save thakbe
        }
    )
);