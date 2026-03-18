import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvents, joinEvent } from '../../api/events';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import CreateEventModal from './CreateEventModal';
import DonationModal from '../donations/DonationModal.tsx'; // 🌟 Universal Donate Modal Import

// SVG Icons
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

export default function Events() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 🌟 ডোনেশনের জন্য State
    const [selectedEventForDonation, setSelectedEventForDonation] = useState<any>(null);

    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const isAdmin = user?.roles?.includes('ADMIN');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['events'],
        queryFn: () => getEvents(1, 10),
    });

    const joinMutation = useMutation({
        mutationFn: joinEvent,
        onSuccess: () => {
            alert("Thank you for joining this event. Your support means a lot!");
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: (error: any) => {
            alert(error?.response?.data?.error || "Failed to join event");
        }
    });

    const events = data?.data || [];

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#D64A26]/20 border-t-[#D64A26] rounded-full animate-spin"></div>
                <p className="text-[#666666] font-medium tracking-wide">Gathering community events...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] md:max-w-md w-full text-center border border-rose-50">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-[#222222] mb-2">Oops! Something went wrong</h3>
                <p className="text-[#666666]">We couldn't load the events at this time. Please try again later.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-16 px-6 bg-[#FAFAFA] font-sans selection:bg-[#D64A26]/10 selection:text-[#D64A26]">
            <div className="max-w-6xl mx-auto">
                <CreateEventModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#D64A26] text-sm font-semibold mb-6 border border-orange-100/50 shadow-sm">
                            <HeartIcon />
                            <span>Make a Difference Today</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#222222] tracking-tight leading-[1.15]">
                            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D64A26] to-[#F1795D]">Initiatives</span>
                        </h1>
                        <p className="mt-5 text-lg text-[#666666]/90 leading-relaxed max-w-xl font-medium">
                            Join our efforts to support the community. Whether it's feeding the hungry or helping underprivileged children, your participation matters.
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="shrink-0 relative overflow-hidden group/btn px-7 py-4 bg-gradient-to-r from-[#D64A26] to-[#F1795D] text-white font-bold tracking-widest uppercase rounded-xl hover:from-[#c24220] hover:to-[#e36345] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Create Event
                            </span>
                        </button>
                    )}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length === 0 ? (
                        <div className="col-span-full py-24 px-8 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#222222] mb-3">No upcoming events</h3>
                            <p className="text-[#666666] max-w-md text-lg leading-relaxed">We are currently planning our next community initiatives. Please check back later for new opportunities to help.</p>
                        </div>
                    ) : (
                        events.map((event: any) => {
                            const eventDate = new Date(event.event_date);
                            const day = eventDate.getDate();
                            const month = eventDate.toLocaleString('default', { month: 'short' });

                            // 🌟 Donation Progress Calculation
                            const goal = Number(event.goal_amount) || 1;
                            const raised = Number(event.raised_amount) || 0;
                            const progressPercentage = Math.min(Math.round((raised / goal) * 100), 100);

                            return (
                                <div key={event.id} className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-100 overflow-hidden shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative">

                                    {/* Event Top Banner */}
                                    <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center rounded-t-xl group/image">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#D64A26]/10 via-orange-50/50 to-white/50 group-hover/image:scale-105 transition-transform duration-700"></div>
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                                        {/* Image Sweep Effect */}

                                        <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl text-center shadow-lg border border-white/60 z-20">
                                            <p className="text-xs font-bold text-[#D64A26] uppercase tracking-widest mb-0.5">{month}</p>
                                            <p className="text-2xl font-black text-[#222222] leading-none">{day}</p>
                                        </div>

                                        <span className="absolute top-5 right-5 px-3.5 py-1.5 bg-[#D64A26] backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase rounded-full border border-white/20 shadow-md flex items-center gap-1.5 z-20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                            {event.status}
                                        </span>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-7 flex-1 flex flex-col z-10 bg-white">
                                        <h2 className="text-xl font-serif font-bold text-[#222222] line-clamp-1 mb-3 group-hover:text-[#D64A26] transition-colors">{event.title}</h2>

                                        <p className="text-[#666666]/90 text-sm leading-relaxed line-clamp-2 flex-1 mb-6">
                                            {event.description || "No description provided. Please join to learn more about this community event."}
                                        </p>

                                        <div className="flex items-center gap-3 py-3.5 border-y border-slate-100 text-[#666666]/90 text-[13px] font-bold uppercase tracking-wider mb-6">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg max-w-full border border-slate-100/50">
                                                <LocationIcon />
                                                <span className="truncate">{event.location || "Location to be announced"}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons Container */}
                                        <div className="flex flex-col gap-3 mt-auto">

                                            {/* 🌟 Donation Progress Bar (যদি টগল ON থাকে) */}
                                            {event.is_donation_enabled && (
                                                <div className="mb-2">
                                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-1.5">
                                                        <span className="text-[#D64A26]">৳{raised.toLocaleString()} raised</span>
                                                        <span className="text-stone-400">Goal: ৳{goal.toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-[#F4F4F4] rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-[#D64A26] to-[#F1795D] h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(214,74,38,0.4)]"
                                                            style={{ width: `${progressPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Join Button */}
                                            <button
                                                onClick={() => joinMutation.mutate(event.id)}
                                                disabled={joinMutation.isPending}
                                                className="relative overflow-hidden group/btn w-full py-3 border-2 border-[#D64A26] text-[#D64A26] font-bold rounded-xl hover:bg-gradient-to-r hover:from-[#D64A26] hover:to-[#F1795D] hover:border-transparent hover:text-white transition-all duration-300 uppercase tracking-widest text-xs hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none mt-2"
                                            >
                                                <span className="relative z-10">{joinMutation.isPending ? 'Processing...' : '🙋‍♂️ Join Event'}</span>
                                            </button>

                                            {/* THE DONATION BUTTON */}
                                            {event.is_donation_enabled && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedEventForDonation(event);
                                                    }}
                                                    className="relative overflow-hidden group/btn w-full py-3 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-widest text-xs hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                                >
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        <HeartIcon /> Donate to Event
                                                    </span>
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* 🌟 Universal Donation Modal for EVENTS */}
                <DonationModal
                    isOpen={!!selectedEventForDonation}
                    onClose={() => setSelectedEventForDonation(null)}
                    item={selectedEventForDonation}
                    donationType="EVENT"
                />

            </div>
        </div>
    );
}