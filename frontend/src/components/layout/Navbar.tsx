import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../api/supabase';

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
        navigate('/login');
    };

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
                ? 'bg-white/80 backdrop-blur-xl border-b border-stone-200/50 py-3 shadow-[0_2px_20px_rgb(0,0,0,0.03)]' 
                : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo / Brand Name */}
                    <div 
                        className="flex-shrink-0 flex items-center gap-4 cursor-pointer group" 
                        onClick={() => navigate('/')}
                    >
                        <div className="relative">
                            <div className="w-11 h-11 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-[0_4px_15px_rgb(16,185,129,0.25)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                                CR
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="font-black text-xl text-stone-800 tracking-tight leading-tight">
                                Come for Road Child
                            </span>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                                University Chapter
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center bg-stone-100/50 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200/30">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    isActive(link.path)
                                        ? 'bg-white text-emerald-600 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-stone-100'
                                        : 'text-stone-500 hover:text-stone-800'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden lg:flex items-center gap-5">
                        <Link
                            to="/donation"
                            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-linear-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 rounded-xl shadow-[0_4px_15px_rgb(244,63,94,0.3)] hover:shadow-[0_6px_20px_rgb(244,63,94,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            <HeartIcon />
                            Support a Cause
                        </Link>

                        <div className="w-px h-6 bg-stone-200/80"></div>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link 
                                    to="/dashboard" 
                                    className={`p-2 rounded-xl border border-stone-200/60 hover:bg-stone-50 transition-all ${
                                        isActive('/dashboard') ? 'bg-stone-100 text-emerald-600' : 'text-stone-600'
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
                                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-100/50 transition-all duration-300"
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
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
                                    : 'text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px bg-stone-100 my-2"></div>

                    <Link
                        to="/donation"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-4 rounded-2xl text-center text-[1.1rem] font-black text-white bg-linear-to-r from-rose-500 to-rose-400 shadow-lg flex items-center justify-center gap-2"
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
                            className="mt-2 py-4 rounded-2xl text-center font-black text-emerald-700 bg-emerald-50 border border-emerald-100"
                        >
                            SIGN IN
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}