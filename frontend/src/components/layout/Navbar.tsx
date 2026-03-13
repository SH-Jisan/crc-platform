import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../api/supabase';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    // Main navigation links array
    const navLinks = [
        { name: 'Events', path: '/events' },
        { name: 'Campaigns', path: '/campaigns' },
        { name: 'Posts', path: '/posts' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Members', path: '/members' },
    ];

    // Active link check korar function
    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo / Brand Name */}
                    <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
                            CRC
                        </div>
                        <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-xl text-slate-800 tracking-tight leading-tight">
                Come for Road Child
              </span>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                University Chapter
              </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    isActive(link.path)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Buttons (Donation, Profile, Auth) */}
                    <div className="hidden lg:flex items-center space-x-4">

                        {/* Highlighted Donation Button */}
                        <Link
                            to="/donation"
                            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            ❤️ Donate Now
                        </Link>

                        <div className="h-6 w-px bg-slate-200 mx-2"></div> {/* Divider */}

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/profile" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2.5 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-4 flex flex-col gap-2 animate-fade-in">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                                isActive(link.path)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="my-2 border-t border-slate-100"></div>

                    <Link
                        to="/donation"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-center px-4 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 shadow-md"
                    >
                        ❤️ Donate Now
                    </Link>

                    {user ? (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-center px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-center px-4 py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mt-2 text-center block px-4 py-3 rounded-xl text-base font-bold text-blue-700 bg-blue-50"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}