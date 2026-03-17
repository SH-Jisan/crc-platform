export default function ImpactBanner() {
    return (
        // 🌟 'bg-fixed' ক্লাসটি যোগ করা হয়েছে দারুণ প্যারাল্যাক্স ইফেক্টের জন্য
        <div className="relative py-32 bg-[#222222] flex items-center justify-center text-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
            <div className="absolute inset-0 bg-[#D64A26]/80 mix-blend-multiply z-10"></div>
            <div className="absolute inset-0 bg-black/20 z-10"></div> {/* Extra readability */}
            <div className="relative z-20 px-4">
                <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight max-w-4xl mx-auto drop-shadow-xl">
                    "No one has ever become poor by giving."
                </h2>
            </div>
        </div>
    );
}