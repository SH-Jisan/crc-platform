import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6"/>
    </svg>
);

export default function MainLayout() {
    const { pathname, search } = useLocation();
    const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const handleScroll = () => {
            setShowScrollTopBtn(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 🌟 Smooth Auto Scroll to Top on page route transition
    useEffect(() => {
        const scrollToTopSmooth = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        };

        scrollToTopSmooth();

        const t1 = setTimeout(scrollToTopSmooth, 50);

        return () => clearTimeout(t1);
    }, [pathname, search]);

    const handleManualScrollTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FAFAFA] relative">
            <Navbar />

            {/* Content Area */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Floating Back to Top Button */}
            <button
                onClick={handleManualScrollTop}
                className={`fixed bottom-8 right-8 z-50 p-3.5 rounded-2xl bg-gradient-to-r from-[#D64A26] to-[#F1795D] text-white shadow-xl shadow-orange-500/25 border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/40 cursor-pointer flex items-center justify-center ${
                    showScrollTopBtn
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
                title="Scroll to Top"
            >
                <ChevronUpIcon />
            </button>

            <Footer />
        </div>
    );
}