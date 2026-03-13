import { apiClient } from './axios';

// সবগুলো ক্যাম্পেইন ফেচ করা
export const getCampaigns = async () => {
    const response = await apiClient.get('/campaigns');
    return response.data.data;
};

// নতুন ক্যাম্পেইন তৈরি করা (অ্যাডমিনদের জন্য)
export const createCampaign = async (campaignData: any) => {
    const response = await apiClient.post('/campaigns', campaignData);
    return response.data.data;
};