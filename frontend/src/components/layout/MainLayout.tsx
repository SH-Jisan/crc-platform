import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
    return (
        // min-h-screen এবং flex-col নিশ্চিত করবে যে Footer সবসময় পেজের একদম নিচে থাকবে
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            {/* Outlet হলো সেই জায়গা যেখানে তোমার অন্যান্য পেজ (Home, Events, Dashboard) লোড হবে */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}