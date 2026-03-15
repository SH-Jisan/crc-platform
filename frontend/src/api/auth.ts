import { apiClient } from './axios';
// auth.ts
export const getCurrentUser = async () => {
    const response = await apiClient.get('/users/me');
    const data = response.data.data;

    return {
        ...data,
        roles: Array.isArray(data?.user_roles)
            ? data.user_roles.map((ur: any) => ur.role?.name).filter(Boolean)
            : []
    };
};

// 🌟 Public Profile API (লগইন ছাড়াই কল করা যাবে)
export const getPublicProfile = async (crcId: string) => {
    const response = await apiClient.get(`/users/public/${crcId}`);
    return response.data.data;
};