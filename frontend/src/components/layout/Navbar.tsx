import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../api/supabase';
import crcLogo from '../../assets/logo/crc_logo.png';

// SVG Icons
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll for sticky effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        setIsMobileMenuOpen(false);
        navigate('/auth');
    };

    // 🌟 Members link is perfectly placed here!
    const navLinks = [
        { name: 'Events', path: '/events' },
        { name: 'Campaigns', path: '/campaigns' },
        { name: 'Posts', path: '/posts' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Members', path: '/members' },
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/90 backdrop-blur-md border-b border-stone-200/50 py-2 shadow-md'
                    : 'bg-transparent py-3'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo / Brand Name */}
                    <div
                        className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <img 
                            src={crcLogo} 
                            alt="CRC Logo" 
                            className="w-10 h-10 md:w-11 md:h-11 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="hidden sm:flex flex-col">
                            <span className="font-black text-lg md:text-xl text-stone-800 tracking-tight leading-tight">
                                Come for Road Child
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center bg-stone-100/50 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-stone-200/30">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-4 py-2 text-[15px] font-bold transition-all duration-300 group overflow-hidden rounded-xl ${
                                    isActive(link.path)
                                        ? 'bg-white text-[#D64A26] shadow-sm border border-stone-100'
                                        : 'text-stone-500 hover:text-[#D64A26] hover:bg-white/40'
                                }`}
                            >
                                {link.name}
                                {/* Animated underline effect */}
                                {!isActive(link.path) && (
                                    <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-[#D64A26] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full opacity-50"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden lg:flex items-center gap-5">
                        <Link
                            to="/donations"
                            className="relative overflow-hidden group px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-[#D64A26] hover:bg-[#b53d1e] rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            {/* Button Shine Effect */}
                            <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shine_1.5s_ease] bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"></span>
                            
                            <HeartIcon />
                            <span className="relative z-10">Support a Cause</span>
                        </Link>

                        <div className="w-px h-6 bg-stone-200/80"></div>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/dashboard"
                                    className={`p-2 rounded-xl border border-stone-200/60 hover:bg-stone-50 transition-all ${
                                        isActive('/dashboard') ? 'bg-stone-100 text-[#D64A26]' : 'text-stone-600'
                                    }`}
                                    title="Dashboard"
                                >
                                    <UserIcon />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl border border-red-100/50 transition-all duration-300"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-[#D64A26] bg-orange-50 hover:bg-[#D64A26] hover:text-white rounded-xl border border-orange-100/50 transition-all duration-300"
                            >
                                SIGN IN
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2.5 rounded-xl text-stone-600 bg-stone-100/80 border border-stone-200/50 focus:outline-none hover:bg-stone-200/50 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`lg:hidden fixed inset-x-4 top-24 bg-white/95 backdrop-blur-2xl rounded-[2rem] border border-stone-200/50 shadow-[0_20px_50px_rgb(0,0,0,0.15)] overflow-hidden transition-all duration-500 origin-top ${
                    isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className="p-6 flex flex-col gap-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-5 py-3.5 rounded-2xl text-[1.05rem] font-bold transition-all ${
                                isActive(link.path)
                                    ? 'bg-orange-50 text-[#D64A26] border border-orange-100/50'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-[#D64A26]'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px bg-stone-100 my-2"></div>

                    <Link
                        to="/donations"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-4 rounded-2xl text-center text-[1.1rem] font-black text-white bg-[#D64A26] shadow-lg flex items-center justify-center gap-2"
                    >
                        <HeartIcon />
                        SUPPORT A CAUSE
                    </Link>

                    {user ? (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Link
                                to="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="py-3.5 bg-stone-100 text-stone-700 font-bold rounded-2xl flex items-center justify-center gap-2 border border-stone-200/50"
                            >
                                <UserIcon />
                                DASHBOARD
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="py-3.5 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100"
                            >
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mt-2 py-4 rounded-2xl text-center font-black text-[#D64A26] bg-orange-50 border border-orange-100"
                        >
                            SIGN IN
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}