import { apiClient } from './axios';

export const getPosts = async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/posts?page=${page}&limit=${limit}`);
    return response.data.data;
};

export const createPost = async (data: any) => {
    const response = await apiClient.post('/posts', data);
    return response.data.data;
};

export const likePost = async (id: string) => {
    const response = await apiClient.patch(`/posts/${id}/like`);
    return response.data.data;
};

export const getPostById = async (id: string) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data.data;
};