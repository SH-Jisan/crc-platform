// src/api/users.ts
import { apiClient } from './axios';

export const getPublicMembers = async () => {
    const response = await apiClient.get('/users/public/members');
    return response.data.data;
};