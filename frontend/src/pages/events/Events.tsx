import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvents, joinEvent } from '../../api/events';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import CreateEventModal from './CreateEventModal';

export default function Events() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const isAdmin = user?.roles?.includes('ADMIN');

    // React Query দিয়ে ডেটা ফেচ করা
    const { data, isLoading, isError } = useQuery({
        queryKey: ['events'],
        queryFn: () => getEvents(1, 10),
    });

    // ইভেন্টে জয়েন করার Mutation
    const joinMutation = useMutation({
        mutationFn: joinEvent,
        onSuccess: () => {
            alert("Successfully joined the event!");
            // জয়েন করার পর ইভেন্ট লিস্ট আপডেট করা
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: (error: any) => {
            alert(error?.response?.data?.error || "Failed to join event");
        }
    });

    const events = data?.data || [];

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading amazing events...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Failed to load events!</div>;

    return (
        <div className="min-h-screen p-8 bg-slate-50">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Upcoming Events</h1>
                        <p className="mt-2 text-slate-500">Join our community programs and make a difference.</p>
                    </div>

                    {/* Admin Create Button */}
                    {isAdmin && (
                        <button
                            onClick={()=>setIsModalOpen(true)}
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                            + Create New Event
                        </button>
                    )}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length === 0 ? (
                        <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200">
                            <p className="text-slate-500 text-lg">No upcoming events found.</p>
                        </div>
                    ) : (
                        events.map((event: any) => {
                            // ডেট ফরম্যাট করা
                            const eventDate = new Date(event.event_date);
                            const day = eventDate.getDate();
                            const month = eventDate.toLocaleString('default', { month: 'short' });

                            return (
                                <div key={event.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">

                                    {/* Event Top Banner / Date Badge */}
                                    <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600 relative flex items-center justify-center">
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-center shadow-sm">
                                            <p className="text-sm font-bold text-blue-600 uppercase leading-none">{month}</p>
                                            <p className="text-2xl font-extrabold text-slate-900 leading-none mt-1">{day}</p>
                                        </div>
                                        <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                      {event.status}
                    </span>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{event.title}</h2>
                                        <p className="mt-2 text-slate-600 text-sm line-clamp-2 flex-1">
                                            {event.description || "No description provided."}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm font-medium">
                                            <span>📍</span>
                                            <span className="truncate">{event.location || "Location TBA"}</span>
                                        </div>

                                        {/* Join Button */}
                                        <button
                                            onClick={() => joinMutation.mutate(event.id)}
                                            disabled={joinMutation.isPending}
                                            className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 font-semibold rounded-lg transition-colors"
                                        >
                                            {joinMutation.isPending ? 'Joining...' : 'Join Event'}
                                        </button>
                                        <CreateEventModal
                                            isOpen={isModalOpen}
                                            onClose={() => setIsModalOpen(false)}
                                            />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}