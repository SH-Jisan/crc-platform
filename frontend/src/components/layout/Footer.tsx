import { Link } from 'react-router-dom';

// SVG Icons
const HeartPulseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>);

export default function Footer() {
    return (
        <footer className="bg-[#222222] text-[#F9F9F9] py-20 relative overflow-hidden">
            {/* Background Blob Elements for premium feel */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#D64A26]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#D64A26]/5 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-b border-white/10 pb-16">

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
                        <p className="text-slate-300/90 text-[15px] leading-relaxed max-w-md mb-8">
                            A heart-driven university chapter dedicated to uplifting underprivileged children through education, nutrition, and compassionate support. Together, we build a future full of smiles.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <button className="px-6 py-2.5 bg-transparent hover:bg-[#D64A26] text-[#D64A26] hover:text-white font-bold rounded-xl border-2 border-[#D64A26] transition-all duration-300 uppercase tracking-wider text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgb(214,74,38,0.3)] hover:-translate-y-0.5">
                                <HeartPulseIcon />
                                Volunteer
                            </button>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-slate-400 hover:bg-[#D64A26] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgb(214,74,38,0.4)]">
                                    <FacebookIcon />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-slate-400 hover:bg-[#D64A26] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgb(214,74,38,0.4)]">
                                    <TwitterIcon />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-slate-400 hover:bg-[#D64A26] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgb(214,74,38,0.4)]">
                                    <InstagramIcon />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 lg:pl-8">
                        <h4 className="text-white font-bold font-serif text-2xl mb-6 relative inline-block">
                            Platform
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#D64A26]"></span>
                        </h4>
                        <ul className="space-y-3.5 text-slate-300">
                            <li><Link to="/events" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span className="text-[#D64A26]/80 text-lg leading-none">&#8250;</span> Initiatives & Events</Link></li>
                            <li><Link to="/campaigns" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span className="text-[#D64A26]/80 text-lg leading-none">&#8250;</span> Active Campaigns</Link></li>
                            <li><Link to="/donations" className="text-[#D64A26] font-bold hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span className="text-[#D64A26] text-lg leading-none">&#8250;</span> Make a Donation</Link></li>
                            <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span className="text-[#D64A26]/80 text-lg leading-none">&#8250;</span> Our Mission</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4 lg:pl-4">
                        <h4 className="text-white font-bold font-serif text-2xl mb-6 relative inline-block">
                            Get in Touch
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#D64A26]"></span>
                        </h4>
                        <ul className="space-y-4 text-slate-300/90 text-[15px] mb-8">
                            <li className="flex items-start gap-4 group">
                                <span className="text-[#D64A26] text-lg mt-0.5 group-hover:-translate-y-1 transition-transform">📍</span>
                                <span>Main Campus Building, Student Hub Area, Dhaka</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <span className="text-[#D64A26] text-lg group-hover:scale-110 transition-transform">📧</span>
                                <a href="mailto:hello@crc-club.edu" className="hover:text-white transition-colors">hello@crc-club.edu</a>
                            </li>
                        </ul>

                        {/* Newsletter Subscription */}
                        <div className="bg-[#1A1A1A]/80 backdrop-blur-sm p-1 rounded-xl flex border border-slate-700/50 focus-within:border-[#D64A26]/50 transition-colors">
                            <input 
                                type="email" 
                                placeholder="Subscribe to newsletter" 
                                className="bg-transparent text-sm text-white px-4 py-2 flex-grow focus:outline-none placeholder-slate-500"
                            />
                            <button className="bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400/80 text-[13px] order-2 md:order-1">
                        © {new Date().getFullYear()} Come for Road Child (CRC). Designed with <span className="text-[#D64A26] mx-0.5">❤️</span> for humanity.
                    </p>
                    <div className="flex gap-6 text-[11px] font-black uppercase tracking-widest text-slate-400 order-1 md:order-2">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <span className="text-slate-600">|</span>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}