import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent } from '../../api/events';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        location: '',
    });

    // 🌟 ডোনেশনের জন্য নতুন State
    const [isDonationEnabled, setIsDonationEnabled] = useState(false);
    const [goalAmount, setGoalAmount] = useState('');

    const mutation = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            onClose(); // ফর্ম বন্ধ করা

            // ফর্ম রিসেট করা
            setFormData({ title: '', description: '', event_date: '', location: '' });
            setIsDonationEnabled(false);
            setGoalAmount('');

            alert("Event Created Successfully! 🚀");
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || "Something went wrong!");
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🌟 সব ডেটা একসাথে ব্যাকএন্ডে পাঠানো হচ্ছে
        mutation.mutate({
            ...formData,
            is_donation_enabled: isDonationEnabled,
            goal_amount: isDonationEnabled ? Number(goalAmount) : 0,
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            {/* 🌟 max-h-[90vh] এবং overflow-y-auto দেওয়া হয়েছে যাতে ছোট স্ক্রিনে ফর্ম স্ক্রল করা যায় */}
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-800">Create New Event</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Event Title</label>
                        <input
                            required
                            value={formData.title}
                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Winter Clothing Drive"
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Tell us about the event..."
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.event_date}
                                className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Location</label>
                            <input
                                required
                                value={formData.location}
                                className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Campus Area"
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* 🌟 Request Donation Toggle Switch */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl mt-4">
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">Request Donations</p>
                            <p className="text-xs text-slate-500">Allow users to donate money for this event.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isDonationEnabled}
                                onChange={() => setIsDonationEnabled(!isDonationEnabled)}
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    {/* 🌟 Goal Amount Box (Only shows if toggle is ON) */}
                    {isDonationEnabled && (
                        <div className="animate-fade-in mt-4">
                            <label className="block text-sm font-medium text-slate-700">Target Amount (৳) *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={goalAmount}
                                onChange={(e) => setGoalAmount(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. 20000"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-70"
                    >
                        {mutation.isPending ? 'Publishing Event...' : 'Publish Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}