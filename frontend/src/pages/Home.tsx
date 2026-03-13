import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCustomCauses } from '../api/customCausesDonations.ts';
import DonationModal from './donations/DonationModal.tsx';

// SVG Icons
const HeartPulseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default function Home() {
    const [selectedCause, setSelectedCause] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['custom-causes'],
        queryFn: getCustomCauses,
    });

    const causes = Array.isArray(data)
        ? data
        : (Array.isArray(data?.data) ? data.data : []);


    const hasActiveEmergency = causes.length > 0 && !isLoading;

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-rose-100 selection:text-rose-900">

            {/* 🌟 1. Top Emergency Alert Bar (শুধুমাত্র ইমার্জেন্সি থাকলে দেখাবে) */}
            {hasActiveEmergency && (
                <div className="bg-rose-600 text-white px-4 py-3 shadow-md relative z-50">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                        <div className="flex items-center gap-2 font-bold animate-pulse">
                            <AlertCircleIcon />
                            <span className="uppercase tracking-widest text-sm">Urgent Response Needed</span>
                        </div>
                        <span className="hidden sm:inline opacity-50">|</span>
                        <p className="text-sm font-medium text-rose-50">
                            We are actively collecting funds for emergency relief. Please scroll down to support.
                        </p>
                    </div>
                </div>
            )}

            {/* 🌟 Hero Section */}
            <div className={`relative overflow-hidden pt-20 px-6 ${hasActiveEmergency ? 'pb-48 md:pb-64' : 'pb-24 md:pb-32'}`}>
                <div className="absolute top-0 right-0 w-120 h-120 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-teal-50/60 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-6 border border-emerald-100/50 shadow-sm animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Come for Road Child (CRC)</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-stone-800 tracking-tight leading-[1.15] mb-6">
                        Empowering Lives, <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-500">
                            Inspiring the Future.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join our university social service club to make a real difference. We believe in taking action, supporting the underprivileged, and building a better community together.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                            Get Started <ArrowRightIcon />
                        </Link>
                        <Link to="/events" className="w-full sm:w-auto px-8 py-4 bg-white text-stone-800 font-bold rounded-xl border border-stone-200 hover:bg-stone-50 shadow-sm hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                            Explore Events
                        </Link>
                    </div>
                </div>
            </div>

            {/* 🌟 2. Overlapping Urgent Causes Section (চোখে পড়ার মতো ডিজাইন) */}
            <div className="max-w-6xl mx-auto px-6 relative z-20">
                {isLoading ? (
                    <div className="flex justify-center py-12 -mt-20">
                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : hasActiveEmergency && (
                    <div className="-mt-32 md:-mt-48 mb-24">
                        {/* 🌟 Giant Red Attention Box */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgb(225,29,72,0.15)] border-[3px] border-rose-100 relative overflow-hidden">
                            {/* Decorative Red Background Glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-70"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-70"></div>

                            <div className="relative z-10">
                                {/* Section Header */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                                    <div className="text-center md:text-left">
                                        <div className="inline-flex items-center justify-center md:justify-start gap-2 px-5 py-2.5 rounded-full bg-rose-100 text-rose-700 text-sm font-extrabold mb-4 uppercase tracking-wider shadow-sm border border-rose-200/50">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                                            Emergency Appeal
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">Stand With Us</h2>
                                    </div>
                                    <p className="text-stone-500 max-w-sm text-center md:text-right hidden md:block font-medium leading-relaxed border-l-2 border-rose-100 pl-6">
                                        Our community needs immediate help. Your contribution right now can save lives and bring hope.
                                    </p>
                                </div>

                                {/* Emergency Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {causes.map((cause: any) => {
                                        const goal = cause.goal_amount ? Number(cause.goal_amount) : 0;
                                        const raised = Number(cause.raised_amount) || 0;
                                        const progressPercentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

                                        return (
                                            <div key={cause.id} className="bg-white rounded-4xl p-7 border-2 border-stone-100 hover:border-rose-300 shadow-sm hover:shadow-[0_12px_40px_rgb(225,29,72,0.12)] transition-all duration-400 flex flex-col group">

                                                <div className="flex-1 flex flex-col h-full">
                                                    <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-rose-700 transition-colors line-clamp-2">{cause.title}</h3>
                                                    <p className="text-stone-500 text-[0.95rem] mb-6 flex-1 line-clamp-3 leading-relaxed">{cause.description}</p>

                                                    <div className="mt-auto">
                                                        <div className="mb-5 bg-stone-50 p-4 rounded-2xl border border-stone-100/80">
                                                            <div className="flex justify-between text-xs font-extrabold mb-2.5">
                                                                <span className="text-rose-600 text-sm">৳{raised.toLocaleString()} <span className="text-stone-400 font-semibold text-xs">raised</span></span>
                                                                {goal > 0 && <span className="text-stone-500">Goal: ৳{goal.toLocaleString()}</span>}
                                                            </div>
                                                            {goal > 0 && (
                                                                <div className="w-full bg-stone-200/60 rounded-full h-2 overflow-hidden">
                                                                    <div className="bg-linear-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => setSelectedCause(cause)}
                                                            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgb(225,29,72,0.3)] hover:-translate-y-1"
                                                        >
                                                            <HeartPulseIcon />
                                                            Donate Instantly
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 🌟 Universal Donation Modal for Custom Causes */}
            <DonationModal
                isOpen={!!selectedCause}
                onClose={() => setSelectedCause(null)}
                item={selectedCause}
                donationType="CUSTOM"
            />

        </div>
    );
}