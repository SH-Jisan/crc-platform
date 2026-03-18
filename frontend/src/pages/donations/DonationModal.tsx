import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDonation } from '../../api/donations.ts';

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: any; // Campaign, Event বা Custom Cause এর ডাটা (Club এর ক্ষেত্রে null হতে পারে)
    donationType: 'CAMPAIGN' | 'EVENT' | 'CLUB' | 'CUSTOM'; // 🌟 নতুন Prop
}

export default function DonationModal({ isOpen, onClose, item, donationType }: DonateModalProps) {
    const queryClient = useQueryClient();
    const [amount, setAmount] = useState<number | ''>('');
    const [method, setMethod] = useState('bKash');
    const [transactionId, setTransactionId] = useState('');

    const mutation = useMutation({
        mutationFn: createDonation,
        onSuccess: () => {
            // রিফ্রেশ করার জন্য সব কি (Key) ইনভ্যালিডেট করে দিচ্ছি
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['custom-causes'] });
            onClose();
            setAmount('');
            setTransactionId('');
            alert("❤️ Thank you for your generous donation!");
        },
        onError: (error: any) => {
            alert(error?.response?.data?.error || error?.response?.data?.message || "Failed to process donation.");
        }
    });

    if (!isOpen) return null;

    const presetAmounts = [500, 1000, 2000, 5000];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || amount < 10) {
            alert("Please enter a valid amount (Minimum ৳10)");
            return;
        }

        // 🌟 The Universal Payload
        const donationPayload: any = {
            donation_type: donationType,
            amount: Number(amount),
            method: method,
        };

        // Donation Type অনুযায়ী সঠিক ID টি Payload এ যুক্ত করা হচ্ছে
        if (donationType === 'CAMPAIGN' && item?.id) donationPayload.campaign_id = String(item.id);
        if (donationType === 'EVENT' && item?.id) donationPayload.event_id = String(item.id);
        if (donationType === 'CUSTOM' && item?.id) donationPayload.custom_cause_id = String(item.id);

        if (transactionId.trim() !== '') {
            donationPayload.transaction_id = transactionId;
        }

        mutation.mutate(donationPayload);
    };

    // টাইটেল ডায়নামিক করা হচ্ছে
    const getTitle = () => {
        if (donationType === 'CLUB') return "CRC General Fund";
        return item?.title || "Noble Cause";
    };

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-4xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all">

                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <span className="text-xs font-bold text-[#D64A26] uppercase tracking-widest mb-1 block">
                            {donationType === 'CLUB' ? 'Support Our Club' : 'You are supporting'}
                        </span>
                        <h2 className="text-xl  font-bold text-[#222222] leading-tight line-clamp-2">{getTitle()}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-orange-50 hover:text-[#D64A26] rounded-full transition-colors shrink-0">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#666666] mb-3">Select or Enter Amount (৳)</label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {presetAmounts.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset)}
                                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                                        amount === preset
                                            ? 'bg-orange-50 border-[#D64A26] text-[#D64A26]'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
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
                                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-bold text-[#222222] text-lg bg-[#F4F4F4]/50 placeholder:text-slate-400"
                                placeholder="Custom Amount"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#666666] mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['bKash', 'Nagad', 'Cash'].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMethod(m)}
                                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                                        method === m
                                            ? 'bg-[#222222] border-[#222222] text-white'
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
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26] outline-none transition-all text-sm uppercase"
                                placeholder="e.g. 8KDF39J2L"
                            />
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="relative overflow-hidden group/btn w-full py-4 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {mutation.isPending ? 'Processing...' : `Donate ৳${amount || '0'} Now`}
                            </span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}