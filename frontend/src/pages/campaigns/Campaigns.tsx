import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '../../api/campaigns';
import { useAuthStore } from '../../store/authStore';
import CreateCampaignModal from './CreateCampaignModal';
import DonateModal from './DonateModal';

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
        <div className="min-h-screen p-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Active Campaigns</h1>
                        <p className="mt-2 text-lg text-slate-500">Your small contribution can bring a big smile.</p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 shadow-md transition-all flex items-center gap-2"
                        >
                            <span>+</span> Create Campaign
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.length === 0 ? (
                        <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div className="text-5xl mb-4">🌱</div>
                            <h3 className="text-xl font-bold text-slate-800">No active campaigns right now</h3>
                            <p className="text-slate-500 mt-2">Check back later or create a new one if you are an admin.</p>
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
                                <div key={campaign.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">

                                    <div className="h-48 overflow-hidden relative bg-slate-200 flex items-center justify-center">
                                        <img
                                            src={validImageUrl}
                                            alt={campaign.title}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = DEFAULT_IMAGE;
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm uppercase">
                                            {campaign.status || 'ACTIVE'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2 className="text-xl font-bold text-slate-800 line-clamp-2">{campaign.title}</h2>
                                        <p className="mt-2 text-slate-500 text-sm line-clamp-3 flex-1">
                                            {campaign.description}
                                        </p>

                                        <div className="mt-6">
                                            <div className="flex justify-between text-sm font-semibold mb-2">
                                                <span className="text-blue-600">৳{raised.toLocaleString()} raised</span>
                                                <span className="text-slate-500">Goal: ৳{goal.toLocaleString()}</span>
                                            </div>

                                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-right mt-1.5 font-bold text-slate-400">
                                                {progressPercentage}% Funded
                                            </p>
                                        </div>

                                        {/* 🌟 THE ULTIMATE FIX: বাটন ক্লিকের ইভেন্টটি একদম নিখুঁত করে দেওয়া হলো */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedCampaign(campaign);
                                            }}
                                            className="mt-6 w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                        >
                                            ❤️ Donate to this Cause
                                        </button>
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

                <DonateModal
                    isOpen={!!selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                    campaign={selectedCampaign}
                />

            </div>
        </div>
    );
}