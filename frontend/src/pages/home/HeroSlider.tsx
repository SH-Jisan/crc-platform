import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGallery } from '../../api/gallery.ts';

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const charitySlidingTexts = [
    { title: "Empowering Little Lives", subtitle: "Providing education, healthcare, and fundamental rights to street children." },
    { title: "Spread Love and Hope", subtitle: "Your small contribution can bring a big smile to an innocent face." },
    { title: "Building a Better Tomorrow", subtitle: "Together we can ensure a safe and nurturing environment for every child." },
    { title: "Be the Reason They Smile", subtitle: "Join hands with us to rescue and rehabilitate the underprivileged." },
    { title: "Education for All", subtitle: "Breaking the cycle of poverty by lighting the lamp of knowledge." }
];

export default function HeroSlider() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const { data: galleryResponse } = useQuery({
        queryKey: ['gallery', 'home-slider'],
        queryFn: () => getGallery({})
    });

    // 🌟 Performance Optimization: React useMemo
    const slidesData = useMemo(() => {
        const galleryImages = galleryResponse?.data || [];
        return galleryImages.length > 0
            ? galleryImages.slice(0, 5).map((img: any, index: number) => ({
                image: img.image_url,
                title: charitySlidingTexts[index % charitySlidingTexts.length].title,
                subtitle: charitySlidingTexts[index % charitySlidingTexts.length].subtitle
            }))
            : charitySlidingTexts.slice(0, 3).map(text => ({
                image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
                ...text
            }));
    }, [galleryResponse?.data]);

    useEffect(() => {
        if (slidesData.length === 0) return;
        const timer = setInterval(() => setCurrentSlideIndex((prev) => (prev + 1) % slidesData.length), 6000);
        return () => clearInterval(timer);
    }, [slidesData.length]);

    const getBackgroundAnimationClass = (index: number) => {
        const animations = [
            'box-appear',
            'slice-appear',
            'smooth-zoom',
            'cinematic-fade',
            'pan-left',
            'pan-right',
            'zoom-out',
            'rotate-zoom',
            'blur-in',
            'slide-up',
            'scale-up-down'
        ];
        return animations[index % animations.length];
    };

    return (
        <div className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-[#222222]">
            <style>{`
                @keyframes boxAppear { 0% { transform: scale(0.9); opacity: 0; filter: blur(10px); } 100% { transform: scale(1); opacity: 1; filter: blur(0px); } }
                @keyframes sliceAppear { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                @keyframes smoothZoom { 0% { transform: scale(1.1); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes cinematicFade { 0% { transform: scale(1.05); filter: blur(10px); opacity: 0; } 100% { transform: scale(1); filter: blur(0px); opacity: 1; } }
                @keyframes panLeft { 0% { transform: scale(1.1) translateX(5%); opacity: 0; } 100% { transform: scale(1) translateX(0); opacity: 1; } }
                @keyframes panRight { 0% { transform: scale(1.1) translateX(-5%); opacity: 0; } 100% { transform: scale(1) translateX(0); opacity: 1; } }
                @keyframes zoomOut { 0% { transform: scale(1.2); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes rotateZoom { 0% { transform: scale(1.2) rotate(2deg); opacity: 0; } 100% { transform: scale(1) rotate(0); opacity: 1; } }
                @keyframes blurIn { 0% { filter: blur(20px); opacity: 0; transform: scale(1.02); } 100% { filter: blur(0px); opacity: 1; transform: scale(1); } }
                @keyframes slideUp { 0% { transform: translateY(10%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                @keyframes scaleUpDown { 0% { transform: scale(0.95); opacity: 0; } 50% { transform: scale(1.02); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes textRevealUp { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

                .box-appear { animation: boxAppear 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .slice-appear { animation: sliceAppear 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .smooth-zoom { animation: smoothZoom 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .cinematic-fade { animation: cinematicFade 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .pan-left { animation: panLeft 2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .pan-right { animation: panRight 2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .zoom-out { animation: zoomOut 2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .rotate-zoom { animation: rotateZoom 2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .blur-in { animation: blurIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .slide-up { animation: slideUp 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                .scale-up-down { animation: scaleUpDown 2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                
                .text-reveal-h1 { animation: textRevealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .text-reveal-p { animation: textRevealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
                .text-reveal-button { animation: textRevealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
            `}</style>

            {slidesData.map((slide: any, index: number) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                    {index === currentSlideIndex && (
                        <img src={slide.image} alt="Slide" className={`w-full h-full object-cover ${getBackgroundAnimationClass(index)}`} />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center z-20 px-6 text-center">
                        {index === currentSlideIndex && (
                            <div key={`text-${currentSlideIndex}`} className="max-w-4xl">
                                <h1 className="text-reveal-h1 text-5xl md:text-7xl font-normal text-white mb-6 leading-tight tracking-wide drop-shadow-lg">
                                    {slide.title}
                                </h1>
                                <p className="text-reveal-p text-xl md:text-2xl text-slate-200 mb-10 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                                    {slide.subtitle}
                                </p>
                                <div className="text-reveal-button">
                                    <button onClick={() => document.getElementById('causes-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-[#D64A26] text-white font-bold rounded-xl hover:bg-[#b53d1e] transition-colors shadow-lg flex items-center gap-2 mx-auto text-lg uppercase tracking-wider">
                                        <HeartIcon /> Support Our Cause
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-30">
                {slidesData.map((_: any, idx: number) => (
                    <button key={idx} onClick={() => setCurrentSlideIndex(idx)} className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentSlideIndex ? 'w-8 bg-[#D64A26]' : 'w-4 bg-white/50 hover:bg-white'}`} />
                ))}
            </div>
        </div>
    );
}