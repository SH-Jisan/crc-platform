import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, likePost } from '../../api/posts';

const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

// SVG Icons
const ClapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function CommunityFeed() {
    const queryClient = useQueryClient();

    // 🌟 Lightbox (Zoom) State
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: getPosts,
    });

    const posts = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

    const likeMutation = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });

    // 🌟 Specific Post Share Logic
// 🌟 Specific Post Share Logic (Updated for OG Tags)
    const handleShare = async (post: any) => {
        // ফ্রন্টএন্ডের আসল লিংক
        const frontendPostUrl = `${window.location.origin}/post/${post.id}`;

        // ব্যাকএন্ডের API Base URL বের করা
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

        // 🌟 ম্যাজিক লিংক: এটি ব্যাকএন্ডে হিট করবে এবং রিডাইরেক্ট করে ফ্রন্টএন্ডে পাঠাবে
        const shareUrl = `${apiBase}/posts/${post.id}/share?redirect=${encodeURIComponent(frontendPostUrl)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title || 'CRC Community Post',
                    text: `Check out this update from CRC: ${post.content.substring(0, 50)}...`,
                    url: shareUrl, // 🌟 এখন ব্যাকএন্ডের লিংক শেয়ার হবে
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Post link copied to clipboard! 📋');
        }
    };
    // 🌟 Smart Image Grid Renderer (Like Facebook/Twitter)
    const renderImageGrid = (images: any[]) => {
        if (!images || images.length === 0) return null;

        if (images.length === 1) {
            return (
                <img
                    src={images[0].url}
                    alt="Post media"
                    onClick={() => setZoomedImage(images[0].url)}
                    className="w-full max-h-[500px] object-cover rounded-2xl border border-stone-100 shadow-sm cursor-zoom-in hover:opacity-95 transition-opacity"
                />
            );
        }

        if (images.length === 2) {
            return (
                <div className="grid grid-cols-2 gap-2">
                    {images.map((img, idx) => (
                        <img
                            key={idx} src={img.url} alt="Post media"
                            onClick={() => setZoomedImage(img.url)}
                            className="w-full aspect-square object-cover rounded-xl cursor-zoom-in hover:opacity-95 transition-opacity"
                        />
                    ))}
                </div>
            );
        }

        if (images.length === 3) {
            return (
                <div className="grid grid-cols-2 gap-2">
                    <img
                        src={images[0].url} alt="Post media" onClick={() => setZoomedImage(images[0].url)}
                        className="w-full h-full object-cover rounded-xl col-span-1 row-span-2 cursor-zoom-in hover:opacity-95 transition-opacity"
                    />
                    <img
                        src={images[1].url} alt="Post media" onClick={() => setZoomedImage(images[1].url)}
                        className="w-full aspect-square object-cover rounded-xl cursor-zoom-in hover:opacity-95 transition-opacity"
                    />
                    <img
                        src={images[2].url} alt="Post media" onClick={() => setZoomedImage(images[2].url)}
                        className="w-full aspect-square object-cover rounded-xl cursor-zoom-in hover:opacity-95 transition-opacity"
                    />
                </div>
            );
        }

        // 4 or more images
        return (
            <div className="grid grid-cols-2 gap-2">
                {images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="relative cursor-zoom-in group" onClick={() => setZoomedImage(img.url)}>
                        <img src={img.url} alt="Post media" className="w-full aspect-square object-cover rounded-xl hover:opacity-95 transition-opacity" />
                        {/* 🌟 +N Overlay for extra images */}
                        {idx === 3 && images.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-[2px] transition-all group-hover:bg-black/70">
                                <span className="text-white text-3xl font-bold tracking-wider">+{images.length - 4}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 bg-[#FAFAFA] font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-4 border border-emerald-100 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Community Feed
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight mb-4">
                        Stories & Updates
                    </h1>
                </div>

                <div className="space-y-10">
                    {posts.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-3xl border border-stone-100">
                            <h3 className="text-xl font-bold text-stone-800">No posts yet</h3>
                        </div>
                    ) : (
                        posts.map((post: any) => {
                            const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                            const mediaArr = Array.isArray(post.media) ? post.media : [];
                            const images = mediaArr.filter((m: any) => m.type === 'IMAGE');
                            const videos = mediaArr.filter((m: any) => m.type === 'VIDEO');

                            return (
                                // 🌟 ID যুক্ত করা হয়েছে যাতে লিংকে ক্লিক করলে এখানে স্ক্রল করে চলে আসে
                                <div id={post.id} key={post.id} className="bg-white rounded-[2rem] border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-lg scroll-mt-24">

                                    <div className="p-6 md:p-8 flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-bold text-xl ring-2 ring-stone-50">
                                                {post.author?.full_name?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-stone-900 text-lg leading-tight">{post.author?.full_name || 'CRC Admin'}</h3>
                                                <p className="text-stone-500 text-sm font-medium">{date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 md:px-8 pb-4">
                                        {post.title && <h2 className="text-2xl font-extrabold text-stone-800 mb-3">{post.title}</h2>}
                                        <p className="text-stone-600 leading-relaxed whitespace-pre-wrap text-[1.05rem]">{post.content}</p>
                                    </div>

                                    {/* 🌟 New Smart Grid Layout for Images */}
                                    {images.length > 0 && (
                                        <div className="px-6 md:px-8 pb-6">
                                            {renderImageGrid(images)}
                                        </div>
                                    )}

                                    {/* Videos Rendering */}
                                    {videos.length > 0 && (
                                        <div className="px-6 md:px-8 pb-6 space-y-4">
                                            {videos.map((vid: any, idx: number) => {
                                                const youtubeUrl = getYouTubeEmbedUrl(vid.url);
                                                return youtubeUrl ? (
                                                    <div key={idx} className="w-full aspect-video rounded-2xl overflow-hidden border border-stone-100 shadow-sm bg-stone-900">
                                                        <iframe width="100%" height="100%" src={youtubeUrl} title="YouTube" frameBorder="0" allowFullScreen></iframe>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    )}

                                    {/* Action Footer */}
                                    <div className="px-6 md:px-8 py-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
                                        <button
                                            onClick={() => likeMutation.mutate(post.id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 font-bold transition-all"
                                        >
                                            <ClapIcon />
                                            <span>{post.likes_count || 0} Applauds</span>
                                        </button>

                                        {/* 🌟 Specific Post Share Button */}
                                        <button
                                            onClick={() => handleShare(post)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 font-medium text-sm transition-all"
                                        >
                                            <ShareIcon />
                                            Share
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* 🌟 Image Zoom Lightbox Modal */}
            {zoomedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 animate-fade-in backdrop-blur-sm"
                    onClick={() => setZoomedImage(null)}
                >
                    <button
                        onClick={() => setZoomedImage(null)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 p-2 rounded-full backdrop-blur-md"
                    >
                        <CloseIcon />
                    </button>
                    <img
                        src={zoomedImage}
                        alt="Zoomed"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform scale-100 animate-zoom-in"
                        onClick={(e) => e.stopPropagation()} // ছবিতে ক্লিক করলে যেন জুম বন্ধ না হয়ে যায়
                    />
                </div>
            )}

        </div>
    );
}