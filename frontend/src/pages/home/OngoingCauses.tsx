import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '../../api/campaigns.ts';

export default function OngoingCauses({ onDonate }: { onDonate: (cause: any) => void }) {
    const { data: campaignsData } = useQuery({ queryKey: ['campaigns'], queryFn: getCampaigns });
    const campaigns = Array.isArray(campaignsData) ? campaignsData : (Array.isArray(campaignsData?.data) ? campaignsData.data : []).slice(0, 4);

    if (campaigns.length === 0) return null;

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-slate-100 pb-4">
                    <h2 className="text-4xl font-serif font-bold text-[#222222]">Ongoing Causes</h2>
                    <Link to="/campaigns" className="text-[#D64A26] font-bold uppercase tracking-widest hover:text-[#b53d1e] text-sm mt-4 sm:mt-0">View All Causes &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {campaigns.map((campaign: any) => {
                        const goal = campaign.goal_amount ? Number(campaign.goal_amount) : 0;
                        const raised = Number(campaign.raised_amount) || 0;
                        const progressPercentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

                        return (
                            <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                                <div className="relative h-48 bg-slate-100 overflow-hidden">
                                    <img src={campaign.image_url || 'https://placehold.co/600x400/e2e8f0/475569?text=Cause'} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-serif font-bold text-[#222222] mb-3 group-hover:text-[#D64A26] transition-colors line-clamp-2">{campaign.title}</h3>
                                    <p className="text-[#666666] text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">{campaign.description}</p>

                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold text-[#222222] mb-2 uppercase tracking-wide">
                                            <span>Raised: <span className="text-[#D64A26]">৳{raised.toLocaleString()}</span></span>
                                            <span>{progressPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-[#F4F4F4] rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-[#D64A26] h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onDonate(campaign)}
                                        className="w-full py-3 border-2 border-[#D64A26] text-[#D64A26] font-bold rounded hover:bg-[#D64A26] hover:text-white transition-colors uppercase tracking-widest text-xs"
                                    >
                                        Donate Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}