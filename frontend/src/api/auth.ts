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