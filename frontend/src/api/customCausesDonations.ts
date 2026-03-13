import { apiClient } from './axios';

export const getCustomCauses = async () => {
    const response = await apiClient.get('/custom-causes-donation');
    return response.data;
};

export const createCustomCause = async (data: { title: string; description?: string; goal_amount?: number; is_active?: boolean }) => {
    const response = await apiClient.post('/custom-causes-donation', data);
    return response.data;
};