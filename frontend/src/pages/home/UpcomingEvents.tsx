import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../../api/events.ts';

export default function UpcomingEvents() {
    const { data: eventsData } = useQuery({ queryKey: ['events'], queryFn: () => getEvents(1, 4) });
    const events = eventsData?.data || [];

    return (
        <div className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left: Events List (7 Columns) */}
                    <div className="lg:col-span-7">
                        <h2 className="text-3xl font-serif font-bold text-[#222222] mb-8 border-b-2 border-slate-100 pb-4 inline-block">Latest Events</h2>
                        <div className="space-y-6">
                            {events.map((event: any) => {
                                const eventDate = new Date(event.event_date);
                                return (
                                    <div key={event.id} className="flex gap-6 items-start group">
                                        <div className="flex flex-col items-center justify-center bg-[#D64A26] min-w-[70px] h-[70px] text-center text-white rounded-sm shadow-sm">
                                            <span className="text-xs font-bold uppercase tracking-wider">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-2xl font-bold leading-none">{eventDate.toLocaleDateString('en-US', { day: '2-digit' })}</span>
                                        </div>
                                        <div className="flex-1 pb-6 border-b border-slate-100">
                                            <h3 className="text-xl font-serif font-bold text-[#222222] mb-2 group-hover:text-[#D64A26] transition-colors">{event.title}</h3>
                                            <p className="text-[#666666] text-sm mb-3">{event.location}</p>
                                            <Link to={`/events`} className="text-xs font-bold text-[#222222] hover:text-[#D64A26] uppercase tracking-widest flex items-center gap-1 transition-colors">
                                                View Calendar <span className="text-[#D64A26] text-base">&rarr;</span>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                            {events.length === 0 && <p className="text-[#666666]">No upcoming events right now.</p>}
                        </div>
                    </div>

                    {/* Right: About Us (5 Columns) */}
                    <div className="lg:col-span-5">
                        <h2 className="text-3xl font-serif font-bold text-[#222222] mb-8 border-b-2 border-slate-100 pb-4 inline-block">About</h2>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-[#222222] mb-6">Come for Road Child (CRC)</h3>
                            <p className="text-[#666666] leading-relaxed mb-6 block prose-p:first-letter:text-[#D64A26] prose-p:first-letter:float-left prose-p:first-letter:text-6xl prose-p:first-letter:font-serif prose-p:first-letter:mr-3 prose-p:first-letter:leading-none prose-p:first-letter:mt-1">
                                <span className="text-[#D64A26] float-left text-6xl font-serif mr-3 leading-none mt-1">C</span>RC is a dedicated social welfare organization focusing on the fundamental rights, education, and health of street children. We believe that every child deserves a chance to build a better future, regardless of their background.
                            </p>
                            <p className="text-[#666666] leading-relaxed">
                                Our university chapter empowers students to engage in field activities, fundraising, and awareness campaigns, fostering a deep sense of social responsibility among the youth and creating the next generation of empathetic leaders.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}