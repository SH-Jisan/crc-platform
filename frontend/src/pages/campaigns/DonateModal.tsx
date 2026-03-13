import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDonation } from '../../api/donations';

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: any;
}

export default function DonateModal({ isOpen, onClose, campaign }: DonateModalProps) {
    const queryClient = useQueryClient();
    const [amount, setAmount] = useState<number | ''>('');
    const [method, setMethod] = useState('bKash');
    const [transactionId, setTransactionId] = useState('');

    const mutation = useMutation({
        mutationFn: createDonation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            onClose();
            setAmount('');
            setTransactionId('');
            alert("❤️ Thank you for your generous donation!");
        },
        onError: (error: any) => {
            alert(error?.response?.data?.error || error?.response?.data?.message || "Failed to process donation.");
        }
    });

    if (!isOpen || !campaign) return null;

    const presetAmounts = [500, 1000, 2000, 5000];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🌟 Security Check 1: Amount ঠিক আছে কি না
        if (!amount || amount < 10) {
            alert("Please enter a valid amount (Minimum ৳10)");
            return;
        }

        // 🌟 Security Check 2: Campaign ID আছে কি না
        if (!campaign?.id) {
            alert("Campaign ID is missing! Please refresh the page and try again.");
            return;
        }

        // 🌟 The Ultimate Payload
        const donationPayload: any = {
            campaign_id: String(campaign.id), // জোড় করে String/UUID বানিয়ে দেওয়া হলো
            amount: Number(amount),
            method: method,
        };

        // Transaction ID শুধু তখনই পাঠাবো, যখন ইউজার সেটা বক্সে লিখবে
        if (transactionId.trim() !== '') {
            donationPayload.transaction_id = transactionId;
        }

        // রিকোয়েস্ট পাঠানো হচ্ছে
        mutation.mutate(donationPayload);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">

                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1 block">You are supporting</span>
                        <h2 className="text-xl font-bold text-slate-800 leading-tight">{campaign.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors shrink-0">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Select or Enter Amount (৳)</label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {presetAmounts.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset)}
                                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                                        amount === preset
                                            ? 'bg-rose-50 border-rose-500 text-rose-600'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                                    }`}
                                >
                                    ৳{preset}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">৳</span>
                            <input
                                type="number"
                                required
                                min="10"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-slate-800 text-lg"
                                placeholder="Custom Amount"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['bKash', 'Nagad', 'Cash'].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMethod(m)}
                                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                                        method === m
                                            ? 'bg-slate-800 border-slate-800 text-white'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(method === 'bKash' || method === 'Nagad') && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                Please send the money to our official {method} Merchant Number: <strong className="text-slate-800">017XXXXXXXX</strong> and enter the Transaction ID below.
                            </p>
                            <input
                                type="text"
                                required
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm uppercase"
                                placeholder="e.g. 8KDF39J2L"
                            />
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-[0_4px_15px_rgb(244,63,94,0.3)] hover:shadow-[0_6px_20px_rgb(244,63,94,0.45)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 text-lg"
                        >
                            {mutation.isPending ? 'Processing...' : `Donate ৳${amount || '0'} Now`}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}