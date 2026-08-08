import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomCauses } from '../../api/customCausesDonations.ts';
import { useAuthStore } from '../../store/authStore';
import DonationModal from './DonationModal.tsx';
import CreateCustomCauseDonationModal from './CreateCustomCauseDonationModal.tsx';
import ShareModal from '../../components/common/ShareModal.tsx';

export default function CustomCauseDonation() {
    const { user } = useAuthStore();
    const isAdmin = user?.roles?.includes('ADMIN');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [donationType, setDonationType] = useState<'CLUB' | 'CUSTOM' | null>(null);
    const [selectedCause, setSelectedCause] = useState<any>(null);
    const [shareData, setShareData] = useState<any>(null);

    const { data: causes = [], isLoading } = useQuery({
        queryKey: ['custom-causes'],
        queryFn: getCustomCauses,
    });

    const handleClubDonation = () => {
        setDonationType('CLUB');
        setSelectedCause(null);
    };

    const handleCustomDonation = (cause: any) => {
        setDonationType('CUSTOM');
        setSelectedCause(cause);
    };

    return (
        <div className="min-h-screen py-16 px-6 bg-[#FAFAFA] font-sans">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#222222] tracking-tight mb-4">Support Our Mission</h1>
                        <p className="text-lg text-[#666666] max-w-2xl">Your generous contributions help us run the organization and respond to emergencies quickly.</p>
                    </div>
                    {isAdmin && (
                        <button onClick={() => setIsCreateModalOpen(true)} className="px-6 py-3 bg-[#222222] text-white font-bold rounded-xl hover:bg-[#1A1A1A] shadow-md transition-all cursor-pointer">
                            + Emergency Fund
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* General Club Fund Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-100 shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50"></div>
                        <div className="relative z-10 flex flex-col items-center h-full w-full">
                            <div className="w-20 h-20 bg-orange-100 text-[#D64A26] rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">🌱</div>
                            <h2 className="text-2xl font-bold text-[#222222] mb-3">General Fund</h2>
                            <p className="text-[#666666] mb-8 flex-1">Support the day-to-day operations and ongoing long-term projects of Come for Road Child.</p>
                            
                            <div className="flex items-center gap-2 w-full">
                                <button onClick={handleClubDonation} className="flex-1 py-3.5 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer">
                                    Donate to Club
                                </button>
                                <button
                                    onClick={() => {
                                        const shareUrl = `${window.location.origin}/donations`;
                                        setShareData({
                                            title: 'CRC General Club Fund',
                                            description: 'Support the day-to-day operations and ongoing long-term projects of Come for Road Child.',
                                            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
                                            shareUrl,
                                            type: 'CAUSE'
                                        });
                                    }}
                                    className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#D64A26] rounded-xl font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer"
                                    title="Share Fund"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Funds */}
                    {isLoading ? (
                        <div className="col-span-2 flex items-center justify-center text-slate-500">Loading causes...</div>
                    ) : (
                        causes.map((cause: any) => {
                            const goal = cause.goal_amount ? Number(cause.goal_amount) : 0;
                            const raised = Number(cause.raised_amount) || 0;
                            const progressPercentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

                            return (
                                <div key={cause.id} className="bg-white/95 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-100 shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50"></div>
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-100 text-[#D64A26] text-xs font-bold uppercase rounded-full tracking-wider animate-pulse">Emergency</div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <h2 className="text-2xl font-bold text-[#222222] mb-3 pr-16">{cause.title}</h2>
                                        <p className="text-[#666666] mb-6 flex-1 line-clamp-3 leading-relaxed">{cause.description}</p>

                                        <div className="mt-auto">
                                            <div className="mb-6">
                                                <div className="flex justify-between text-sm font-bold mb-2">
                                                    <span className="text-[#D64A26]">৳{raised.toLocaleString()} raised</span>
                                                    {goal > 0 && <span className="text-slate-500">Goal: ৳{goal.toLocaleString()}</span>}
                                                </div>
                                                {goal > 0 && (
                                                    <div className="w-full bg-[#F4F4F4] rounded-full h-2 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-[#D64A26] to-[#F1795D] shadow-[0_0_8px_rgba(214,74,38,0.4)] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 w-full">
                                                <button onClick={() => handleCustomDonation(cause)} className="flex-1 py-3.5 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer">
                                                    Support Cause
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        const shareUrl = `${window.location.origin}/donations`;
                                                        setShareData({
                                                            title: cause.title,
                                                            description: cause.description,
                                                            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
                                                            shareUrl,
                                                            type: 'CAUSE',
                                                            stats: {
                                                                label1: 'Raised',
                                                                value1: `৳${raised.toLocaleString()}`,
                                                                label2: goal > 0 ? 'Goal' : undefined,
                                                                value2: goal > 0 ? `৳${goal.toLocaleString()}` : undefined,
                                                                progress: goal > 0 ? progressPercentage : undefined
                                                            }
                                                        });
                                                    }}
                                                    className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#D64A26] rounded-xl font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer"
                                                    title="Share Cause"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <CreateCustomCauseDonationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

                <DonationModal
                    isOpen={!!donationType}
                    onClose={() => { setDonationType(null); setSelectedCause(null); }}
                    item={selectedCause}
                    donationType={donationType || 'CLUB'}
                />

                {shareData && (
                    <ShareModal
                        isOpen={!!shareData}
                        onClose={() => setShareData(null)}
                        {...shareData}
                    />
                )}
            </div>
        </div>
    );
}