import { Link } from 'react-router-dom';

// SVG Icons
const HeartPulseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300 py-20 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    {/* About Section */}
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-[0_4px_20px_rgb(16,185,129,0.2)]">
                                CR
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight">
                                Come for Road Child
                            </h3>
                        </div>
                        <p className="text-stone-400 text-[1.05rem] leading-relaxed max-w-md mb-8">
                            A heart-driven university chapter dedicated to uplifting underprivileged children through education, nutrition, and compassionate support. Together, we build a future full of smiles.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all duration-300 flex items-center gap-2">
                                <HeartPulseIcon />
                                Join as Volunteer
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 border-l-4 border-emerald-500 pl-4">
                            Platform
                        </h4>
                        <ul className="space-y-4 font-bold text-[0.95rem]">
                            <li><Link to="/events" className="hover:text-emerald-400 transition-colors">Initiatives & Events</Link></li>
                            <li><Link to="/campaigns" className="hover:text-emerald-400 transition-colors">Active Campaigns</Link></li>
                            <li><Link to="/donation" className="hover:text-emerald-500 transition-colors text-emerald-400">Make a Donation</Link></li>
                            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Our Mission</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4">
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 border-l-4 border-emerald-500 pl-4">
                            Get in Touch
                        </h4>
                        <ul className="space-y-5 text-stone-400 font-medium">
                            <li className="flex items-start gap-4">
                                <span className="bg-white/5 p-2 rounded-lg text-emerald-500">📍</span>
                                <span>Main Campus Building, Student Hub Area, Dhaka</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="bg-white/5 p-2 rounded-lg text-emerald-500">📧</span>
                                <a href="mailto:hello@crc-club.edu" className="hover:text-emerald-400 transition-colors">hello@crc-club.edu</a>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="bg-white/5 p-2 rounded-lg text-emerald-500">📞</span>
                                <span>+880 1234 567890</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-stone-500 text-sm font-bold order-2 md:order-1">
                        © {new Date().getFullYear()} Come for Road Child (CRC). Designed with ❤️ for humanity.
                    </p>
                    <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-stone-600 order-1 md:order-2">
                        <Link to="/privacy" className="hover:text-stone-400 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-stone-400 transition-colors">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}