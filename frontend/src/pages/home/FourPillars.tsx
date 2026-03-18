import { Link } from 'react-router-dom';

// ... (Icons unchanged) ...
const MissionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const EventsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5l-2.09 2.09a2.5 2.5 0 0 0 0 3.54L12 12.79" /></svg>;
const VolunteerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;

export default function FourPillars() {
    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* 🌟 Added hover:-translate-y-1 hover:shadow-xl for a floating effect */}
                    <div className="flex flex-col p-8 rounded-2xl border border-slate-100 bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D64A26]/40 group">
                        <div className="w-14 h-14 bg-[#F9F9F9] text-[#D64A26] group-hover:bg-[#D64A26] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"><MissionIcon /></div>
                        <h3 className="text-xl  font-bold text-[#222222] mb-3">Our Mission</h3>
                        <p className="text-[#666666] text-sm mb-6 leading-relaxed flex-1">Dedicated to rescuing, rehabilitating, and educating street children for a better tomorrow.</p>
                        <Link to="/about" className="text-[#D64A26] font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Learn more &rarr;</Link>
                    </div>
                    {/* Repeat similar classes for other pillars */}
                    <div className="flex flex-col p-8 rounded-2xl border border-slate-100 bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D64A26]/40 group">
                        <div className="w-14 h-14 bg-[#F9F9F9] text-[#D64A26] group-hover:bg-[#D64A26] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"><EventsIcon /></div>
                        <h3 className="text-xl  font-bold text-[#222222] mb-3">Events</h3>
                        <p className="text-[#666666] text-sm mb-6 leading-relaxed flex-1">Join our upcoming campaigns, charity dinners, and volunteer briefings to make an impact.</p>
                        <Link to="/events" className="text-[#D64A26] font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">View events &rarr;</Link>
                    </div>
                    <div className="flex flex-col p-8 rounded-2xl border border-slate-100 bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D64A26]/40 group">
                        <div className="w-14 h-14 bg-[#F9F9F9] text-[#D64A26] group-hover:bg-[#D64A26] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"><SupportIcon /></div>
                        <h3 className="text-xl  font-bold text-[#222222] mb-3">Support</h3>
                        <p className="text-[#666666] text-sm mb-6 leading-relaxed flex-1">Your generous donations provide food, shelter, and educational materials for the underprivileged.</p>
                        <button onClick={() => document.getElementById('causes-section')?.scrollIntoView()} className="text-[#D64A26] font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all text-left">Donate now &rarr;</button>
                    </div>
                    <div className="flex flex-col p-8 rounded-2xl border border-slate-100 bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D64A26]/40 group">
                        <div className="w-14 h-14 bg-[#F9F9F9] text-[#D64A26] group-hover:bg-[#D64A26] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"><VolunteerIcon /></div>
                        <h3 className="text-xl  font-bold text-[#222222] mb-3">Volunteer</h3>
                        <p className="text-[#666666] text-sm mb-6 leading-relaxed flex-1">Become a part of our university chapter and actively participate in field work.</p>
                        <Link to="/login" className="text-[#D64A26] font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Join us &rarr;</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}