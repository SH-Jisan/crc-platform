import { Link } from 'react-router-dom';

// SVG Icons
const HeartPulseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-[#222222] text-[#F9F9F9] py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-b border-stone-800 pb-16">

                    {/* About Section */}
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#D64A26] rounded-sm flex items-center justify-center text-white font-bold text-sm">
                                CR
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
                                Come for Road Child
                            </h3>
                        </div>
                        <p className="text-stone-400 text-sm leading-relaxed max-w-md mb-8">
                            A heart-driven university chapter dedicated to uplifting underprivileged children through education, nutrition, and compassionate support. Together, we build a future full of smiles.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 bg-transparent hover:bg-[#D64A26] text-[#D64A26] hover:text-white font-bold rounded border-2 border-[#D64A26] transition-colors uppercase tracking-wider text-sm flex items-center gap-2">
                                <HeartPulseIcon />
                                Volunteer
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-bold font-serif text-xl mb-6">
                            Platform
                        </h4>
                        <ul className="space-y-3 text-stone-400 text-sm">
                            <li><Link to="/events" className="hover:text-[#D64A26] transition-colors flex items-center gap-2"><span className="text-[#D64A26]">&#8250;</span> Initiatives & Events</Link></li>
                            <li><Link to="/campaigns" className="hover:text-[#D64A26] transition-colors flex items-center gap-2"><span className="text-[#D64A26]">&#8250;</span> Active Campaigns</Link></li>
                            <li><Link to="/donation" className="hover:text-white transition-colors text-[#D64A26] font-bold flex items-center gap-2"><span className="text-[#D64A26]">&#8250;</span> Make a Donation</Link></li>
                            <li><Link to="/about" className="hover:text-[#D64A26] transition-colors flex items-center gap-2"><span className="text-[#D64A26]">&#8250;</span> Our Mission</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4">
                        <h4 className="text-white font-bold font-serif text-xl mb-6">
                            Get in Touch
                        </h4>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li className="flex items-start gap-4">
                                <span className="text-[#D64A26] mt-1">📍</span>
                                <span>Main Campus Building, Student Hub Area, Dhaka</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="text-[#D64A26]">📧</span>
                                <a href="mailto:hello@crc-club.edu" className="hover:text-[#D64A26] transition-colors">hello@crc-club.edu</a>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="text-[#D64A26]">📞</span>
                                <span>+880 1234 567890</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-stone-500 text-sm order-2 md:order-1">
                        © {new Date().getFullYear()} Come for Road Child (CRC). Designed with ❤️ for humanity.
                    </p>
                    <div className="flex gap-6 text-xs font-bold uppercase tracking-wider text-stone-500 order-1 md:order-2">
                        <Link to="/privacy" className="hover:text-[#D64A26] transition-colors">Privacy</Link>
                        <span className="text-stone-700">|</span>
                        <Link to="/terms" className="hover:text-[#D64A26] transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}