import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCampaign } from '../../api/campaigns';

export default function CreateCampaignModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goal_amount: '',
        image_url: '', // 🌟 Image URL ফিল্ড যোগ করা হলো
    });

    const mutation = useMutation({
        mutationFn: createCampaign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            onClose();
            setFormData({ title: '', description: '', goal_amount: '', image_url: '' });
            alert("🎉 Campaign Created Successfully!");
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || error?.response?.data?.error || "Something went wrong!");
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            title: formData.title,
            description: formData.description,
            goal_amount: Number(formData.goal_amount),
            image_url: formData.image_url || undefined, // খালি থাকলে undefined পাঠাবে
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all">

                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Start a New Campaign</h2>
                        <p className="text-xs text-slate-500 mt-1">Raise funds for a noble cause.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Campaign Title</label>
                        <input
                            required
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. Winter Clothes for Orphans"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Explain why this campaign is important..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Goal Amount (৳)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">৳</span>
                                <input
                                    type="number"
                                    required
                                    min="100"
                                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="50000"
                                    value={formData.goal_amount}
                                    onChange={(e) => setFormData({...formData, goal_amount: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label>
                            <input
                                type="url"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="https://example.com/image.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md transition-all flex justify-center items-center gap-2"
                        >
                            {mutation.isPending ? 'Creating...' : '🚀 Publish Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}