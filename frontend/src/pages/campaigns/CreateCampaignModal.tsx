import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCampaign } from '../../api/campaigns';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isDonationEnabled, setIsDonationEnabled] = useState(true); // 🌟 State for Toggle

    const mutation = useMutation({
        mutationFn: createCampaign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setGoalAmount('');
            setImageUrl('');
            setIsDonationEnabled(true);
        },
        onError: (error) => {
            alert("Failed to create campaign!");
            console.error(error);
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            title,
            description,
            goal_amount: isDonationEnabled?  Number(goalAmount) : 0,
            image_url: imageUrl,
            is_donation_enabled: isDonationEnabled, // 🌟 টগলের ডাটা পাঠানো হচ্ছে
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl  font-bold text-[#222222]">Create New Campaign</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-1">Campaign Title *</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                               className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all" placeholder="e.g. Winter Clothes Distribution" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-1">Description</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all" placeholder="Tell us more about this cause..." />
                    </div>

                    <div className={`grid gap-4 ${isDonationEnabled ? 'grid-cols-2' : 'grid-cols-1'}`}>                        {isDonationEnabled && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-semibold text-[#666666] mb-1">Goal Amount (৳) *</label>
                                <input type="number" required min="1" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)}
                                       className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all" placeholder="e.g. 50000" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-[#666666] mb-1">Cover Image URL</label>
                            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                   className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all" placeholder="https://..." />
                        </div>
                    </div>

                    {/* 🌟 Request Donation Toggle Switch */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl mt-4">
                        <div>
                            <p className="font-semibold text-[#222222]">Request Donations</p>
                            <p className="text-xs text-[#666666]">Allow users to donate money for this campaign.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isDonationEnabled}
                                onChange={() => setIsDonationEnabled(!isDonationEnabled)}
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D64A26]"></div>
                        </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-[#666666] font-semibold rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">Cancel</button>
                        <button type="submit" disabled={mutation.isPending} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-widest text-xs shadow-md disabled:opacity-70 flex items-center justify-center gap-2">
                            {mutation.isPending ? 'Creating...' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}