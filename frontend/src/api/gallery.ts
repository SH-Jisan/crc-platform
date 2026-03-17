import { apiClient } from './axios';

// গ্যালারির ছবিগুলো আনার জন্য (Cursor Pagination সহ)
export const getGallery = async ({ pageParam = undefined }: { pageParam?: string }) => {
    const response = await apiClient.get('/gallery', {
        params: { cursor: pageParam, limit: 12 } // একবারে ১২টি ছবি আনবো
    });
    // Interceptor এর কারণে response.data.data এর ভেতরে আমাদের আসল { data, meta } থাকবে
    return response.data.data;
};

// নতুন ছবি আপলোড করার জন্য
export const uploadGalleryImage = async (data: { image_url: string; caption?: string }) => {
    const response = await apiClient.post('/gallery', data);
    return response.data.data;
};