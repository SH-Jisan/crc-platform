import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, search } = useLocation();

    // 1️⃣ Disable browser auto scroll restoration globally
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // 2️⃣ Lock scroll position to top (0px) continuously for 1 second on route change to handle async API data loads
    useLayoutEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            const main = document.querySelector('main');
            if (main) main.scrollTop = 0;
            const root = document.getElementById('root');
            if (root) root.scrollTop = 0;
        };

        scrollToTop();

        // Enforce top scroll every 20ms during the 1-second route load window
        const interval = setInterval(scrollToTop, 20);
        const timeout = setTimeout(() => {
            clearInterval(interval);
            scrollToTop();
        }, 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [pathname, search]);

    return null;
}
