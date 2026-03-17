import { useState } from 'react';
import EmergencyBar from './EmergencyBar'; // 🌟 নতুন ইমপোর্ট
import HeroSlider from './HeroSlider';
import FourPillars from './FourPillars';
import FeaturedCause from './FeaturedCause';
import ImpactBanner from './ImpactBanner';
import OngoingCauses from './OngoingCauses';
import UpcomingEvents from './UpcomingEvents';
import RecentActivities from './RecentActivities';
import DonationModal from '../donations/DonationModal';

export default function Home() {
    const [selectedCause, setSelectedCause] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#D64A26]/20 selection:text-[#D64A26]">

            {/* 🚨 1️⃣ Emergency Bar (এটিকে একদম টপ পজিশনে দেওয়া হলো) */}
            <EmergencyBar />

            {/* 2️⃣ Hero Slider */}
            <HeroSlider />

            {/* 3️⃣ Four Pillars */}
            <FourPillars />

            {/* 4️⃣ Urgent Appeal (Large Card) */}
            <FeaturedCause onDonate={(cause: any) => setSelectedCause(cause)} />

            {/* 5️⃣ Impact Banner ("No one has ever become poor...") */}
            <ImpactBanner />

            {/* 6️⃣ Ongoing Causes */}
            <OngoingCauses onDonate={(cause: any) => setSelectedCause(cause)} />

            {/* 7️⃣ Events List & Info */}
            <UpcomingEvents />

            {/* 8️⃣ Recent Activities (Community Posts Overview) */}
            <RecentActivities />

            {/* Universal Donation Modal */}
            <DonationModal
                isOpen={!!selectedCause}
                onClose={() => setSelectedCause(null)}
                item={selectedCause}
                donationType="CUSTOM"
            />
        </div>
    );
}