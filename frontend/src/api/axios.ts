import axios from 'axios';
import { useAuthStore } from "../store/authStore.ts";

// Supabase session theke token neoar jonno ekta helper function

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Protita API call er aage token jure dibe
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token; // 🔥 Zustand theke direct token nilam
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
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
            // Token expire hoye gele ba vhul thakle logout logic ekhane asbe
            console.error('Unauthorized! Please login again.');
            // window.location.href = '/login'; // Force redirect korte pari
        }
        return Promise.reject(error);
    }
);