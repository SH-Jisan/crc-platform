import { apiClient } from './axios';

export const createDonation = async (donationData: {
    campaign_id: string;
    amount: number;
    method: string;
    transaction_id?: string;
}) => {
    const response = await apiClient.post('/donations', donationData);
    return response.data.data;
};