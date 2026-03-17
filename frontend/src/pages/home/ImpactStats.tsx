export default function ImpactStats() {
    return (
        <div className="py-20 bg-slate-900 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">Transparency is our priority. See how your contributions are directly impacting the lives of street children.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800">
                    <div className="text-center px-4">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-teal-400">1.5M+</p>
                        <p className="text-slate-300 text-xs md:text-sm font-medium uppercase tracking-wider">Street Children in BD</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-teal-400">500+</p>
                        <p className="text-slate-300 text-xs md:text-sm font-medium uppercase tracking-wider">Children Supported</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-teal-400">50+</p>
                        <p className="text-slate-300 text-xs md:text-sm font-medium uppercase tracking-wider">Active Volunteers</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-teal-400">12</p>
                        <p className="text-slate-300 text-xs md:text-sm font-medium uppercase tracking-wider">Successful Campaigns</p>
                    </div>
                </div>
            </div>
        </div>
    );
}