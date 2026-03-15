import { useState, useEffect } from 'react';

const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export interface MediaItem {
    id?: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

interface LightboxGalleryProps {
    media: MediaItem[];
    initialIndex: number;
    onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export default function LightboxGallery({ media, initialIndex, onClose }: LightboxGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, media.length]);

    const handleNext = () => {
        if (currentIndex < media.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (!media || media.length === 0) return null;

    const currentMedia = media[currentIndex];

    return (
        <div 
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="text-white/90 font-medium text-lg px-4 drop-shadow-md">
                    {currentIndex + 1} / {media.length}
                </div>
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors p-2 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md"
                >
                    <CloseIcon />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="relative w-full flex-1 flex items-center justify-center p-4 md:p-12 overflow-hidden">
                
                {/* Previous Button */}
                {currentIndex > 0 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hidden sm:flex"
                    >
                        <ChevronLeft />
                    </button>
                )}

                {/* Media Container */}
                <div className="w-full h-full flex items-center justify-center max-w-6xl relative" onClick={(e) => e.stopPropagation()}>
                    {currentMedia.type === 'IMAGE' ? (
                        <img
                            src={currentMedia.url}
                            alt="Gallery item"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-zoom-in"
                        />
                    ) : currentMedia.type === 'VIDEO' ? (
                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
                            {(() => {
                                const youtubeUrl = getYouTubeEmbedUrl(currentMedia.url);
                                return youtubeUrl ? (
                                    <iframe width="100%" height="100%" src={youtubeUrl} title="YouTube wrapper" frameBorder="0" allowFullScreen></iframe>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/50">Unsupported Video</div>
                                );
                            })()}
                        </div>
                    ) : null}
                </div>

                {/* Next Button */}
                {currentIndex < media.length - 1 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hidden sm:flex"
                    >
                        <ChevronRight />
                    </button>
                )}
            </div>

            {/* Mobile Swipe Indicators / Controls */}
            <div className="sm:hidden absolute bottom-8 left-0 right-0 flex justify-center gap-6 z-10">
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    disabled={currentIndex === 0}
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${currentIndex === 0 ? 'bg-white/5 text-white/30' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                    <ChevronLeft />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    disabled={currentIndex === media.length - 1}
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${currentIndex === media.length - 1 ? 'bg-white/5 text-white/30' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}
