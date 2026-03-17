import { useState, useEffect } from 'react';

// সিম্পল কাউন্টার হুক
const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration]);
    return count;
};

export default function ImpactStats() {
    // ডামি টার্গেট ভ্যালু
    const volunteers = useCounter(54, 2000);
    const campaigns = useCounter(12, 2500);
    const children = useCounter(500, 3000);

    return (
        <div className="py-24 bg-[#222222] text-white relative border-y border-[#333333]">
            {/* 🌟 Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold mb-4">Our Impact in Numbers</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">Transparency is our priority. See how your contributions are directly impacting the lives of street children.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#333333]">
                    <div className="text-center px-4">
                        <p className="text-5xl md:text-6xl font-serif font-bold mb-3 text-[#D64A26]">1.5<span className="text-3xl">M+</span></p>
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Street Children in BD</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-5xl md:text-6xl font-serif font-bold mb-3 text-[#D64A26]">{children}<span className="text-3xl">+</span></p>
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Children Supported</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-5xl md:text-6xl font-serif font-bold mb-3 text-[#D64A26]">{volunteers}<span className="text-3xl">+</span></p>
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Active Volunteers</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-5xl md:text-6xl font-serif font-bold mb-3 text-[#D64A26]">{campaigns}</p>
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Successful Campaigns</p>
                    </div>
                </div>
            </div>
        </div>
    );
}