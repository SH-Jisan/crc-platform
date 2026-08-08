import { apiClient } from './axios';

export interface CreateDonationPayload {
    donation_type: 'CAMPAIGN' | 'EVENT' | 'CLUB' | 'CUSTOM';
    amount: number;
    method: string;
    transaction_id?: string;
    campaign_id?: string;
    event_id?: string;
    custom_cause_id?: string;
    is_anonymous?: boolean;
    donor_name?: string;
    donor_email?: string;
    donor_phone?: string;
}

export const createDonation = async (donationData: CreateDonationPayload) => {
    const response = await apiClient.post('/donations', donationData);
    return response.data.data;
};