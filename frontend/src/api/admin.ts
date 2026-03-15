import { apiClient } from './axios';

export const getPendingMembers = async () => {
    const response = await apiClient.get('/api/v1/admin/pending-members');
    return response.data;
};

export const updateMemberStatus = async ({ id, status, role }: { id: string, status: 'APPROVED' | 'REJECTED', role: string }) => {
    const response = await apiClient.patch(`/api/v1/admin/members/${id}/status`, { status, role });
    return response.data;
};

// ... ager code ...

export const getApprovedMembers = async () => {
    const response = await apiClient.get('/api/v1/admin/members');
    return response.data;
};

export const updateMemberInfo = async ({ id, data }: { id: string, data: any }) => {
    const response = await apiClient.patch(`/api/v1/admin/members/${id}`, data);
    return response.data;
};