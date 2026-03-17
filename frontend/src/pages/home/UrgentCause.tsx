import { useQuery } from '@tanstack/react-query';
import { getCustomCauses } from '../../api/customCausesDonations.ts';

const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

export default function UrgentCause({ onDonate }: { onDonate: (cause: any) => void }) {
    const { data: causesData, isLoading } = useQuery({ queryKey: ['custom-causes'], queryFn: getCustomCauses });
    const causes = Array.isArray(causesData) ? causesData : (Array.isArray(causesData?.data) ? causesData.data : []);
    const hasActiveEmergency = causes.length > 0 && !isLoading;

    if (!hasActiveEmergency) return null;

    return (
        <>
            <div className="bg-rose-600 text-white px-4 py-2.5 shadow-sm relative z-50 text-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
                    <div className="flex items-center gap-2 font-bold">
                        <AlertCircleIcon /><span className="uppercase tracking-widest text-xs">Urgent Appeal</span>
                    </div>
                    <span className="hidden sm:inline opacity-40">|</span>
                    <p className="font-medium text-rose-50">We are actively responding to an emergency. Please consider donating below.</p>
                </div>
            </div>

            <div className="py-20 bg-slate-50 border-y border-slate-200" id="causes-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {causes.slice(0, 1).map((cause: any) => {
                        const goal = cause.goal_amount ? Number(cause.goal_amount) : 0;
                        const raised = Number(cause.raised_amount) || 0;
                        const progressPercentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

                        return (
                            <div key={cause.id} className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="w-full lg:w-1/2">
                                    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" alt="Featured Cause" className="w-full h-full min-h-[300px] object-cover" />
                                </div>
                                <div className="w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4 border border-rose-100 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span> Urgent Appeal
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-4">{cause.title}</h2>
                                    <p className="text-slate-600 mb-8 leading-relaxed text-sm md:text-base">{cause.description}</p>
                                    <div className="mb-8">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-3xl font-bold text-slate-800">৳{raised.toLocaleString()}</span>
                                            <span className="text-sm font-medium text-slate-500">raised of ৳{goal.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div className="bg-rose-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                    </div>
                                    <button onClick={() => onDonate(cause)} className="w-full sm:w-fit px-8 py-3.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                                        <HeartIcon /> Donate to this cause
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}