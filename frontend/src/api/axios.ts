import axios from 'axios';
import { useAuthStore } from "../store/authStore.ts";

// 🌟 ১. Base URL ক্লিন এবং সেটআপ করা
let rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// যদি Netlify থেকে আসা লিংকের শেষে ভুল করে স্ল্যাশ (/) থাকে, সেটা কেটে দেবে
if (rawBaseURL.endsWith('/')) {
    rawBaseURL = rawBaseURL.slice(0, -1);
}
// যদি লিংকে /api/v1 না থাকে, তাহলে অটোমেটিক জুড়ে দেবে
const finalBaseURL = rawBaseURL.endsWith('/api/v1') ? rawBaseURL : `${rawBaseURL}/api/v1`;

export const apiClient = axios.create({
    baseURL: finalBaseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Protita API call er aage token jure dibe
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token; // Zustand theke direct token nilam
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 🌟 ২. THE AXIOS TRAP FIX:
        // যদি এপিআই কলের শুরুতে স্ল্যাশ (/) থাকে (যেমন: '/users/me'),
        // সেটাকে কেটে শুধু 'users/me' বানিয়ে দেবে। এতে Axios আর /api/v1 কাটবে না!
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: 401 (Unauthorized) asle automatically logout korabe
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Please login again.');
            // Zustand এর ভেতরের logout ফাংশন কল করা সবচেয়ে নিরাপদ
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);