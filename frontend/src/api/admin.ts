import { apiClient } from './axios';

export const getPendingMembers = async () => {
    const response = await apiClient.get('/api/v1/admin/pending-members');
    return response.data;
};

export const updateMemberStatus = async ({ id, status, role }: { id: string, status: 'APPROVED' | 'REJECTED', role: string }) => {
    const response = await apiClient.patch(`/api/v1/admin/members/${id}/status`, { status, role });
    return response.data;
};