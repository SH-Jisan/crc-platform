import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGallery } from '../../api/gallery.ts';

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

// 🌟 চ্যারিটি ওয়েবসাইটের জন্য চমৎকার কিছু স্লোগান
const charitySlidingTexts = [
    { title: "Empowering Little Lives", subtitle: "Providing education, healthcare, and fundamental rights to street children." },
    { title: "Spread Love and Hope", subtitle: "Your small contribution can bring a big smile to an innocent face." },
    { title: "Building a Better Tomorrow", subtitle: "Together we can ensure a safe and nurturing environment for every child." },
    { title: "Be the Reason They Smile", subtitle: "Join hands with us to rescue and rehabilitate the underprivileged." },
    { title: "Education for All", subtitle: "Breaking the cycle of poverty by lighting the lamp of knowledge." },
    { title: "Every Child Deserves a Chance", subtitle: "Help us ensure a brighter future for the underprivileged children." },
    { title: "Compassion in Action", subtitle: "Your act of kindness can transform lives and build stronger communities." }
];

export default function HeroSlider() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const { data: galleryResponse } = useQuery({
        queryKey: ['gallery', 'home-slider'],
        queryFn: () => getGallery({})
    });

    const galleryImages = galleryResponse?.data || [];

    // গ্যালারির ছবিগুলোর সাথে স্লোগানগুলো যুক্ত করা হচ্ছে (ক্যাপশন ইগনোর করে)
    const slidesData = galleryImages.length > 0
        ? galleryImages.slice(0, 7).map((img: any, index: number) => ({
            image: img.image_url,
            title: charitySlidingTexts[index % charitySlidingTexts.length].title,
            subtitle: charitySlidingTexts[index % charitySlidingTexts.length].subtitle
        }))
        : charitySlidingTexts.slice(0, 3).map(text => ({ image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop", ...text }));

    useEffect(() => {
        if (slidesData.length === 0) return;
        const timer = setInterval(() => setCurrentSlideIndex((prev) => (prev + 1) % slidesData.length), 6000); // 6 সেকেন্ড
        return () => clearInterval(timer);
    }, [slidesData.length]);

    // 🌟 ব্যাকগ্রাউন্ড এনিমেশনের ধরন নির্ধারণ করা
    const getBackgroundAnimationClass = (index: number) => {
        if (index % 4 === 0) return 'box-appear';  // Box appear effect
        if (index % 4 === 1) return 'slice-appear';  // Slice appear effect
        if (index % 4 === 2) return 'smooth-zoom';   // Smooth Zoom
        return 'cinematic-fade';                       // Cinematic Fade Out
    };

    return (
        <div className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-[#222222]">

            {/* 🌟 Custom CSS for Advanced Animations (No external library needed!) */}
            <style>{`
                /* 1. Box Appear Effect */
                @keyframes boxAppear {
                    0% { transform: scale(0.9); opacity: 0; filter: blur(10px); }
                    100% { transform: scale(1); opacity: 1; filter: blur(0px); }
                }
                /* 2. Slice Appear Effect */
                @keyframes sliceAppear {
                    0% { transform: translateY(100%); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                /* 3. Smooth Zoom Effect */
                @keyframes smoothZoom {
                    0% { transform: scale(1.1); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                /* 4. Cinematic Fade Out Effect */
                @keyframes cinematicFade {
                    0% { transform: scale(1.05); filter: blur(10px); opacity: 0; }
                    100% { transform: scale(1); filter: blur(0px); opacity: 1; }
                }
                /* Text Slide Up Sequence */
                @keyframes textRevealUp {
                    0% { transform: translateY(30px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                .box-appear { animation: boxAppear 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .slice-appear { animation: sliceAppear 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .smooth-zoom { animation: smoothZoom 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .cinematic-fade { animation: cinematicFade 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                
                .text-reveal-h1 { animation: textRevealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .text-reveal-p { animation: textRevealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
                .text-reveal-button { animation: textRevealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
            `}</style>

            {slidesData.map((slide: any, index: number) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <div className="absolute inset-0 bg-black/50 z-10"></div>

                    {/* 🌟 Background Image with Dynamic Animation */}
                    {index === currentSlideIndex && (
                        <img src={slide.image} alt="Slide" className={`w-full h-full object-cover ${getBackgroundAnimationClass(index)}`} />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center z-20 px-6 text-center">
                        {/* 🌟 Text Container with 'key' trick to restart animation on every slide change */}
                        {index === currentSlideIndex && (
                            <div key={`text-${currentSlideIndex}`} className="max-w-4xl">
                                <h1 className="text-reveal-h1 text-5xl md:text-7xl font-serif text-white mb-6 leading-tight tracking-wide drop-shadow-lg">
                                    {slide.title}
                                </h1>
                                <p className="text-reveal-p text-xl md:text-2xl text-slate-200 mb-10 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                                    {slide.subtitle}
                                </p>

                                <div className="text-reveal-button">
                                    <button
                                        onClick={() => document.getElementById('causes-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-10 py-4 bg-[#D64A26] text-white font-bold rounded hover:bg-[#b53d1e] transition-colors shadow-lg flex items-center gap-2 mx-auto text-lg uppercase tracking-wider"
                                    >
                                        <HeartIcon /> Support Our Cause
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Slider Indicators */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-30">
                {slidesData.map((_: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentSlideIndex ? 'w-8 bg-[#D64A26]' : 'w-4 bg-white/50 hover:bg-white'}`}
                    />
                ))}
            </div>
        </div>
    );
}