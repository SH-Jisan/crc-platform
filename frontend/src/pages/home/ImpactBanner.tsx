export default function ImpactBanner() {
    return (
        <div className="relative py-32 bg-[#222222] flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-[#D64A26]/80 mix-blend-multiply z-10"></div>
            <div className="relative z-20 px-4">
                <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight max-w-4xl mx-auto drop-shadow-lg">
                    "No one has ever become poor by giving."
                </h2>
            </div>
        </div>
    );
}