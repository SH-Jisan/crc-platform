import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomCauses } from '../../api/customCausesDonations.ts';
import { useAuthStore } from '../../store/authStore';
import DonationModal from './DonationModal.tsx';
import CreateCustomCauseDonationModal from './CreateCustomCauseDonationModal.tsx';

export default function CustomCauseDonation() {
    const { user } = useAuthStore();
    const isAdmin = user?.roles?.includes('ADMIN');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 🌟 ডোনেশনের জন্য States
    const [donationType, setDonationType] = useState<'CLUB' | 'CUSTOM' | null>(null);
    const [selectedCause, setSelectedCause] = useState<any>(null);

    const { data: causes = [], isLoading } = useQuery({
        queryKey: ['custom-causes'],
        queryFn: getCustomCauses,
    });

    const handleClubDonation = () => {
        setDonationType('CLUB');
        setSelectedCause(null); // ক্লাবের জন্য কোনো স্পেসিফিক আইটেম লাগবে না
    };

    const handleCustomDonation = (cause: any) => {
        setDonationType('CUSTOM');
        setSelectedCause(cause);
    };

    return (
        <div className="min-h-screen py-16 px-6 bg-slate-50 font-sans">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Support Our Mission</h1>
                        <p className="text-lg text-slate-600 max-w-2xl">Your generous contributions help us run the organization and respond to emergencies quickly.</p>
                    </div>
                    {isAdmin && (
                        <button onClick={() => setIsCreateModalOpen(true)} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">
                            + Emergency Fund
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 🌟 General Club Fund Card (Always Visible) */}
                    <div className="bg-white rounded-[2rem] p-8 border border-emerald-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-50"></div>
                        <div className="relative z-10 flex flex-col items-center h-full w-full">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">🌱</div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">General Fund</h2>
                            <p className="text-slate-500 mb-8 flex-1">Support the day-to-day operations and ongoing long-term projects of Come for Road Child.</p>
                            <button onClick={handleClubDonation} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md">
                                Donate to Club
                            </button>
                        </div>
                    </div>

                    {/* 🌟 Dynamic Emergency Funds */}
                    {isLoading ? (
                        <div className="col-span-2 flex items-center justify-center text-slate-500">Loading causes...</div>
                    ) : (
                        causes.map((cause: any) => {
                            const goal = cause.goal_amount ? Number(cause.goal_amount) : 0;
                            const raised = Number(cause.raised_amount) || 0;
                            const progressPercentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

                            return (
                                <div key={cause.id} className="bg-white rounded-[2rem] p-8 border border-rose-100 shadow-sm hover:shadow-xl transition-all flex flex-col relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50 opacity-50"></div>
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold uppercase rounded-full tracking-wider animate-pulse">Emergency</div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-3 pr-16">{cause.title}</h2>
                                        <p className="text-slate-600 mb-6 flex-1 line-clamp-3">{cause.description}</p>

                                        <div className="mt-auto">
                                            <div className="mb-6">
                                                <div className="flex justify-between text-sm font-bold mb-2">
                                                    <span className="text-rose-600">৳{raised.toLocaleString()} raised</span>
                                                    {goal > 0 && <span className="text-slate-500">Goal: ৳{goal.toLocaleString()}</span>}
                                                </div>
                                                {goal > 0 && (
                                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                                    </div>
                                                )}
                                            </div>

                                            <button onClick={() => handleCustomDonation(cause)} className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md">
                                                Support This Cause
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Modals */}
                <CreateCustomCauseDonationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

                <DonationModal
                    isOpen={!!donationType}
                    onClose={() => { setDonationType(null); setSelectedCause(null); }}
                    item={selectedCause}
                    donationType={donationType || 'CLUB'}
                />
            </div>
        </div>
    );
}