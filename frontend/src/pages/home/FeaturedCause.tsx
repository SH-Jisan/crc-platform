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
                        <div key={cause.id} className="flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-xl border border-slate-100/80 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:border-orange-200/80 group">
                            <div className="w-full lg:w-1/2 overflow-hidden relative group/image">
                                <div className="w-full h-full relative">
                                    <img
                                        src={cause.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"}
                                        alt="Featured Cause"
                                        className="w-full h-full min-h-[22rem] object-cover transform transition-transform duration-700 group-hover/image:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#D64A26] text-xs font-extrabold uppercase tracking-widest mb-6 border border-orange-200/60 w-fit shadow-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#D64A26] animate-ping"></span> Urgent Appeal
                                </div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4 leading-tight tracking-tight group-hover:text-[#D64A26] transition-colors">{cause.title}</h2>
                                <p className="text-slate-600 mb-8 leading-relaxed font-medium">{cause.description}</p>

                                <div className="mb-8 p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Raised</span>
                                            <span className="text-3xl font-extrabold text-[#D64A26]">৳{raised.toLocaleString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Goal</span>
                                            <span className="text-base font-extrabold text-slate-700">৳{goal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden p-0.5">
                                        <div className="bg-gradient-to-r from-[#D64A26] via-[#F1633E] to-[#FA8C6E] h-2 rounded-full transition-all duration-1000 shadow-md shadow-orange-500/50 relative" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <span className="text-xs font-black text-[#D64A26]">{progressPercentage}% Funded</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onDonate(cause)}
                                    className="relative overflow-hidden group/btn w-full sm:w-fit px-8 py-4 bg-gradient-to-r from-[#D64A26] via-[#F1633E] to-[#FA8C6E] hover:shadow-xl hover:shadow-orange-500/30 text-white font-extrabold uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer text-sm"
                                >
                                    <HeartIcon /> Donate to this cause
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}