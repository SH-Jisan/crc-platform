import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { getGallery } from '../../api/gallery';
import UploadGalleryModal from './UploadGalleryModal';

export default function Gallery() {
    const { user } = useAuthStore();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // 🌟 Lightbox (Zoom View) States
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['gallery'],
        queryFn: getGallery,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.meta?.nextCursor || undefined,
    });

    // 🌟 সবগুলো পেজের ছবিগুলোকে একটি সিঙ্গেল অ্যারেতে (Array) আনা হচ্ছে Lightbox এর জন্য
    const allImages = data?.pages.flatMap(page => page.data) || [];

    // 🌟 Keyboard Navigation (Esc, Left Arrow, Right Arrow)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, allImages.length]);

    const showNext = () => {
        if (lightboxIndex !== null && lightboxIndex < allImages.length - 1) {
            setLightboxIndex(lightboxIndex + 1);
        }
    };

    const showPrev = () => {
        if (lightboxIndex !== null && lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        }
    };

    const closeLightbox = () => setLightboxIndex(null);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#D64A26]/20 border-t-[#D64A26] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-2">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-[#222222] tracking-tight mb-2">
                            Club <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D64A26] to-[#F1795D]">Gallery</span>
                        </h1>
                        <p className="text-sm sm:text-base text-[#666666] font-medium max-w-2xl">
                            A collection of memories, events, and the smiles we've shared together.
                        </p>
                    </div>

                    {/* Upload Button */}
                    {user && (
                        <button
                            className="px-6 py-3 bg-[#222222] text-white font-bold rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-[#D64A26] hover:to-[#F1795D] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto overflow-hidden group"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Photos
                        </button>
                    )}
                </div>

                {/* 🌟 Mobile Style Square Grid (Same size for all images) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 sm:gap-2">
                    {allImages.map((item: any, index: number) => (
                        <div
                            key={item.id}
                            className="relative group aspect-square cursor-pointer overflow-hidden bg-slate-100"
                            onClick={() => setLightboxIndex(index)}
                        >
                            <img
                                src={item.image_url}
                                alt={item.caption || 'Gallery Image'}
                                className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-300"
                                loading="lazy"
                            />

                            {/* Hover Overlay Icon (optional) */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {allImages.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 mt-10 mx-2">
                        <p className="text-slate-500 font-medium">No images have been uploaded yet.</p>
                    </div>
                )}

                {/* Load More Button */}
                {hasNextPage && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="px-8 py-3 bg-slate-100 hover:bg-[#FAFAFA] text-[#666666] font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isFetchingNextPage ? 'Loading more...' : 'Load More Photos'}
                        </button>
                    </div>
                )}

                {/* 🌟 FULLSCREEN LIGHTBOX 🌟 */}
                {lightboxIndex !== null && allImages[lightboxIndex] && (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md animate-fade-in">

                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/70 hover:text-white z-50 p-2 bg-black/20 hover:bg-black/50 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Prev Button */}
                        {lightboxIndex > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-3 bg-black/40 hover:bg-black/80 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {/* Next Button */}
                        {lightboxIndex < allImages.length - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); showNext(); }}
                                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-3 bg-black/40 hover:bg-black/80 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        {/* Image Container */}
                        <div className="relative w-full h-full flex items-center justify-center p-4" onClick={closeLightbox}>
                            <img
                                src={allImages[lightboxIndex].image_url}
                                alt="Zoomed"
                                className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
                                onClick={(e) => e.stopPropagation()} // ইমেজে ক্লিক করলে মডাল বন্ধ হবে না
                            />

                            {/* Caption & Info Overlay (Bottom) */}
                            <div className="absolute bottom-6 left-0 right-0 text-center px-4" onClick={(e) => e.stopPropagation()}>
                                {allImages[lightboxIndex].caption && (
                                    <p className="text-white text-sm sm:text-base font-medium mb-1 drop-shadow-lg bg-black/40 inline-block px-4 py-1.5 rounded-full">
                                        {allImages[lightboxIndex].caption}
                                    </p>
                                )}
                                <p className="text-white/60 text-xs mt-1 drop-shadow-md">
                                    Uploaded by <span className="font-semibold text-white/80">{allImages[lightboxIndex].uploader?.full_name?.split(' ')[0]}</span>
                                </p>
                            </div>
                        </div>

                    </div>
                )}

                {/* Upload Modal */}
                <UploadGalleryModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                />
            </div>
        </div>
    );
}