import { apiClient } from './axios';

export const getCurrentUser = async () => {
    // ব্যাকএন্ডের /users/me API-তে রিকোয়েস্ট পাঠাবো।
    // Interceptor অটোমেটিক্যালি Token অ্যাড করে দিবে।
    const response = await apiClient.get('/users/me');
    return response.data.data; // TransformInterceptor এর কারণে data.data হবে
};