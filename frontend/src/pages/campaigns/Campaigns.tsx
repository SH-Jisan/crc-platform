import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '../../api/campaigns';
import { useAuthStore } from '../../store/authStore';
import CreateCampaignModal from './CreateCampaignModal';
import DonationModal from '../donations/DonationModal.tsx';

export default function Campaigns() {
    const { user } = useAuthStore();
    const isAdmin = user?.roles?.includes('ADMIN');

    // 🌟 Modals States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null); // ডোনেশনের জন্য

    const { data, isLoading, isError } = useQuery({
        queryKey: ['campaigns'],
        queryFn: getCampaigns,
    });

    const campaigns = Array.isArray(data)
        ? data
        : (Array.isArray(data?.data) ? data.data : []);

    if (isLoading) return <div className="p-8 text-center text-slate-500 font-medium">Loading inspiring campaigns...</div>;
    if (isError) return <div className="p-8 text-center text-red-500 font-medium">Failed to load campaigns!</div>;

    const DEFAULT_IMAGE = 'https://placehold.co/800x400/e2e8f0/475569?text=Support+Our+Cause';

    return (
        <div className="min-h-screen py-16 px-6 bg-[#FAFAFA] font-sans selection:bg-[#D64A26]/10 selection:text-[#D64A26]">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#222222] tracking-tight leading-[1.15]">
                            Active <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D64A26] to-[#F1795D]">Campaigns</span>
                        </h1>
                        <p className="mt-5 text-lg text-[#666666] leading-relaxed max-w-xl font-medium">Your small contribution can bring a big smile.</p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="shrink-0 relative overflow-hidden group/btn px-7 py-4 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold tracking-widest uppercase rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span>+</span> Create Campaign
                            </span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.length === 0 ? (
                        <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div className="text-5xl mb-4">🌱</div>
                            <h3 className="text-xl font-bold text-[#222222]">No active campaigns right now</h3>
                            <p className="text-[#666666] mt-2">Check back later or create a new one if you are an admin.</p>
                        </div>
                    ) : (
                        campaigns.map((campaign: any) => {
                            const goal = Number(campaign.goal_amount) || 1;
                            const raised = Number(campaign.raised_amount) || 0;
                            const progressPercentage = Math.min(Math.round((raised / goal) * 100), 100);

                            const validImageUrl = (campaign.image_url && campaign.image_url.trim() !== '')
                                ? campaign.image_url
                                : DEFAULT_IMAGE;

                            return (
                                <div key={campaign.id} className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-100 overflow-hidden shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative">

                                    <div className="h-48 relative overflow-hidden flex items-center justify-center bg-slate-100 rounded-t-xl group/image">
                                        {/* Image Sweep Effect */}

                                        <img
                                            src={validImageUrl}
                                            alt={campaign.title}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = DEFAULT_IMAGE;
                                            }}
                                            className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700"
                                        />
                                        
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#D64A26] uppercase tracking-widest shadow-md border border-white/60 z-20 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#D64A26] animate-pulse"></span>
                                            {campaign.status || 'ACTIVE'}
                                        </div>
                                    </div>

                                    <div className="p-7 flex-1 flex flex-col bg-white">
                                        <h2 className="text-xl font-serif font-bold text-[#222222] line-clamp-2 mb-3 group-hover:text-[#D64A26] transition-colors">{campaign.title}</h2>
                                        <p className="text-[#666666] text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {campaign.description}
                                        </p>

                                        <div className="mt-auto">
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-1.5">
                                                <span className="text-[#D64A26]">৳{raised.toLocaleString()} raised</span>
                                                <span className="text-[#666666]">Goal: ৳{goal.toLocaleString()}</span>
                                            </div>

                                            <div className="w-full bg-[#F4F4F4] rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-[#D64A26] to-[#F1795D] h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(214,74,38,0.4)]"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-[10px] text-right mt-1.5 font-bold text-slate-400 uppercase tracking-widest">
                                                {progressPercentage}% Funded
                                            </p>
                                        </div>

                                        {campaign.is_donation_enabled? (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedCampaign(campaign);
                                                }}
                                                className="relative overflow-hidden group/btn mt-6 w-full py-3 border-2 border-[#D64A26] text-[#D64A26] font-bold rounded-xl hover:bg-gradient-to-r hover:from-[#D64A26] hover:to-[#F1795D] hover:border-transparent hover:text-white transition-all duration-300 uppercase tracking-widest text-xs hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    ❤️ Donate to this Cause
                                                </span>
                                            </button>
                                        ):(
                                            <button
                                                disabled
                                                className="mt-6 w-full py-3 bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-xs rounded-xl cursor-not-allowed border border-slate-200"
                                            >
                                                Donation Disabled
                                            </button>
                                        )}
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>

                {/* Modals */}
                <CreateCampaignModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

                <DonationModal
                    isOpen={!!selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                    item={selectedCampaign}             // 🌟 campaign এর বদলে item
                    donationType="CAMPAIGN"             // 🌟 বলে দিচ্ছি এটি ক্যাম্পেইনের ডোনেশন
                />

            </div>
        </div>
    );
}