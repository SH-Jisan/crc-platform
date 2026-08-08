import { Link } from 'react-router-dom';

// ... (Icons unchanged) ...
const MissionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const EventsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5l-2.09 2.09a2.5 2.5 0 0 0 0 3.54L12 12.79" /></svg>;
const VolunteerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;

export default function FourPillars() {
    return (
        <div className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col p-8 rounded-[2rem] border border-slate-100/80 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200/80 group relative overflow-hidden">
                        <div className="w-16 h-16 bg-orange-50/80 text-[#D64A26] border border-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#D64A26] group-hover:to-[#F1795D] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"><MissionIcon /></div>
                        <h3 className="text-xl font-extrabold text-[#0F172A] mb-3 group-hover:text-[#D64A26] transition-colors">Our Mission</h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1 font-medium">Dedicated to rescuing, rehabilitating, and educating street children for a better tomorrow.</p>
                        <Link to="/about" className="text-[#D64A26] font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Learn more &rarr;</Link>
                    </div>

                    <div className="flex flex-col p-8 rounded-[2rem] border border-slate-100/80 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200/80 group relative overflow-hidden">
                        <div className="w-16 h-16 bg-orange-50/80 text-[#D64A26] border border-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#D64A26] group-hover:to-[#F1795D] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"><EventsIcon /></div>
                        <h3 className="text-xl font-extrabold text-[#0F172A] mb-3 group-hover:text-[#D64A26] transition-colors">Events</h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1 font-medium">Join our upcoming campaigns, charity dinners, and volunteer briefings to make an impact.</p>
                        <Link to="/events" className="text-[#D64A26] font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">View events &rarr;</Link>
                    </div>

                    <div className="flex flex-col p-8 rounded-[2rem] border border-slate-100/80 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200/80 group relative overflow-hidden">
                        <div className="w-16 h-16 bg-orange-50/80 text-[#D64A26] border border-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#D64A26] group-hover:to-[#F1795D] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"><SupportIcon /></div>
                        <h3 className="text-xl font-extrabold text-[#0F172A] mb-3 group-hover:text-[#D64A26] transition-colors">Support</h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1 font-medium">Your generous donations provide food, shelter, and educational materials for the underprivileged.</p>
                        <button onClick={() => document.getElementById('causes-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-[#D64A26] font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all text-left cursor-pointer">Donate now &rarr;</button>
                    </div>

                    <div className="flex flex-col p-8 rounded-[2rem] border border-slate-100/80 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200/80 group relative overflow-hidden">
                        <div className="w-16 h-16 bg-orange-50/80 text-[#D64A26] border border-orange-100 group-hover:bg-gradient-to-r group-hover:from-[#D64A26] group-hover:to-[#F1795D] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"><VolunteerIcon /></div>
                        <h3 className="text-xl font-extrabold text-[#0F172A] mb-3 group-hover:text-[#D64A26] transition-colors">Volunteer</h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1 font-medium">Become a part of our university chapter and actively participate in field work.</p>
                        <Link to="/login" className="text-[#D64A26] font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Join us &rarr;</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}