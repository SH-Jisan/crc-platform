import { useQuery } from '@tanstack/react-query';
import { getCustomCauses } from '../../api/customCausesDonations.ts';

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

export default function FeaturedCause({ onDonate }: { onDonate: (cause: any) => void }) {
    const { data: causesData, isLoading: isCausesLoading } = useQuery({
        queryKey: ['custom-causes'],
        queryFn: getCustomCauses
    });

    const causes = Array.isArray(causesData) ? causesData : (Array.isArray(causesData?.data) ? causesData.data : []);
    const hasActiveEmergency = causes.length > 0 && !isCausesLoading;

    if (!hasActiveEmergency) return null;

    return (
        <div className="py-20 bg-[#F9F9F9] border-y border-slate-200" id="causes-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {causes.slice(0, 1).map((cause: any) => {
                    const goal = cause.goal_amount ? Number(cause.goal_amount) : 0;
                    const raised = Number(cause.raised_amount) || 0;
                    const progressPercentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

                    return (
                        <div key={cause.id} className="flex flex-col lg:flex-row bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl group">
                            <div className="w-full lg:w-1/2 overflow-hidden relative group/image">
                                <div className="w-full h-full relative">
                                    {/* Image Sweep Effect */}
                                    <img
                                        src={cause.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"}
                                        alt="Featured Cause"
                                        className="w-full h-full min-h-87.5 object-cover transform transition-transform duration-700 group-hover/image:scale-105"
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-[#D64A26]/10 text-[#D64A26] text-xs font-bold uppercase tracking-widest mb-6 border border-[#D64A26]/20 w-fit">
                                    <span className="w-2 h-2 rounded-full bg-[#D64A26] animate-pulse"></span> Urgent Appeal
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#222222] mb-4 leading-tight">{cause.title}</h2>
                                <p className="text-[#666666] mb-8 leading-relaxed">{cause.description}</p>

                                <div className="mb-8">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-3xl font-bold text-[#222222]">৳{raised.toLocaleString()}</span>
                                        <span className="text-sm font-bold text-[#666666] uppercase tracking-wider">raised of ৳{goal.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-[#F4F4F4] rounded-full h-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#D64A26] to-[#F1795D] h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(214,74,38,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onDonate(cause)}
                                    className="relative overflow-hidden group/btn w-full sm:w-fit px-8 py-4 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    {/* Button Shine Effect */}
                                    
                                    <span className="relative z-10 flex items-center gap-2">
                                        <HeartIcon /> Donate to this cause
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}