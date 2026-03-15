import { apiClient } from './axios';

export const getPosts = async () => {
    const response = await apiClient.get('/posts');
    return response.data;
};

export const createPost = async (data: any) => {
    const response = await apiClient.post('/posts', data);
    return response.data;
};

export const likePost = async (id: string) => {
    const response = await apiClient.patch(`/posts/${id}/like`);
    return response.data;
};

export const getPostById = async (id: string) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
};