import { apiClient } from './axios';

// ইভেন্ট ফেচ করা (Pagination সহ)
export const getEvents = async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/events?page=${page}&limit=${limit}`);
    // আমাদের ব্যাকএন্ডের TransformInterceptor এর কারণে ডাটা response.data.data তে থাকে
    return response.data.data;
};

// ইভেন্টে জয়েন করা
export const joinEvent = async (eventId: string) => {
    const response = await apiClient.post(`/events/${eventId}/join`);
    return response.data.data;
};

export const createEvent = async (eventData: any) =>{
    const response = await apiClient.post('/events', eventData);
    return response.data.data;
}