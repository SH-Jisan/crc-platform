import { useState } from 'react';
import EmergencyBar from './EmergencyBar';
import HeroSlider from './HeroSlider';
import FourPillars from './FourPillars';
import FeaturedCause from './FeaturedCause';
import ImpactBanner from './ImpactBanner';
import ImpactStats from './ImpactStats'; // 🌟 ImpactStats ইমপোর্ট করা হলো
import OngoingCauses from './OngoingCauses';
import UpcomingEvents from './UpcomingEvents';
import RecentActivities from './RecentActivities';
import DonationModal from '../donations/DonationModal';

export default function Home() {
    const [selectedCause, setSelectedCause] = useState<any>(null);

    return (
        <div className="relative min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#D64A26]/20 selection:text-[#D64A26] overflow-x-hidden">
            {/* Background Aesthetic Blobs */}
            <div className="absolute top-0 right-[-10%] w-96 h-96 bg-[#D64A26]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none z-0"></div>
            <div className="absolute top-40 -left-10 w-72 h-72 bg-[#1A1A1A]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
            <div className="absolute top-[40%] left-[20%] w-80 h-80 bg-[#D64A26]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

            <div className="relative z-10">            {/* 🚨 1️⃣ Emergency Bar (এটিকে একদম টপ পজিশনে দেওয়া হলো) */}
            <EmergencyBar />

            {/* 2️⃣ Hero Slider */}
            <HeroSlider />

            {/* 3️⃣ Four Pillars */}
            <FourPillars />

            {/* 4️⃣ Urgent Appeal (Large Card) */}
            <FeaturedCause onDonate={(cause: any) => setSelectedCause(cause)} />

            {/* 5️⃣ Impact Banner ("No one has ever become poor...") */}
            <ImpactBanner />

            {/* 🌟 6️⃣ Impact Stats (কাউন্ট-আপ এনিমেশনসহ স্ট্যাটিস্টিকস) */}
            <ImpactStats />

            {/* 7️⃣ Ongoing Causes */}
            <OngoingCauses onDonate={(cause: any) => setSelectedCause(cause)} />

            {/* 8️⃣ Events List & Info */}
            <UpcomingEvents />

            {/* 9️⃣ Recent Activities (Community Posts Overview) */}
            <RecentActivities />

            {/* Universal Donation Modal */}
            <DonationModal
                isOpen={!!selectedCause}
                onClose={() => setSelectedCause(null)}
                item={selectedCause}
                donationType="CUSTOM"
            />
            </div>
        </div>
    );
}