import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomCause } from '../../api/customCausesDonations.ts';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateCustomCauseDonationModal({ isOpen, onClose }: Props) {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goalAmount, setGoalAmount] = useState('');

    const mutation = useMutation({
        mutationFn: createCustomCause,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['custom-causes'] });
            onClose();
            setTitle('');
            setDescription('');
            setGoalAmount('');
            alert("Emergency Fund Created Successfully! 🚀");
        },
        onError: () => {
            alert("Failed to create the fund.");
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            title,
            description,
            goal_amount: goalAmount ? Number(goalAmount) : undefined,
            is_active: true
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Create Emergency Fund</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Cause Title *</label>
                        <input required value={title} onChange={(e) => setTitle(e.target.value)}
                               className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26] outline-none"
                               placeholder="e.g. Flood Relief Fund 2026" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26] outline-none"
                                  placeholder="Briefly describe the emergency..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Goal Amount (৳) - Optional</label>
                        <input type="number" min="1" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)}
                               className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26] outline-none"
                               placeholder="Leave empty for unlimited collection" />
                    </div>

                    <button type="submit" disabled={mutation.isPending}
                            className="relative overflow-hidden group/btn w-full py-3 mt-4 bg-[#D64A26] text-white font-bold rounded-xl hover:bg-[#b53d1e] transition-all shadow-md hover:shadow-lg disabled:opacity-70">
                        <span className="absolute inset-0 w-full h-full -translate-x-full group-hover/btn:animate-[shine_1.5s_ease] bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"></span>
                        <span className="relative z-10">{mutation.isPending ? 'Creating...' : 'Publish Fund'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}