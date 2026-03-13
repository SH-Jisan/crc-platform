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
                               className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                               placeholder="e.g. Flood Relief Fund 2026" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                  placeholder="Briefly describe the emergency..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Goal Amount (৳) - Optional</label>
                        <input type="number" min="1" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)}
                               className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                               placeholder="Leave empty for unlimited collection" />
                    </div>

                    <button type="submit" disabled={mutation.isPending}
                            className="w-full py-3 mt-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all disabled:opacity-70">
                        {mutation.isPending ? 'Creating...' : 'Publish Fund'}
                    </button>
                </form>
            </div>
        </div>
    );
}