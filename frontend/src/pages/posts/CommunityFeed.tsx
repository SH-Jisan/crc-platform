import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, likePost } from '../../api/posts';
import MediaCollage from '../../components/media_layouts/MediaCollage.tsx';
import LightboxGallery from '../../components/media_layouts/LightboxGallery.tsx';
import CreatePostModal from './CreatePostModal.tsx';
import { useAuthStore } from '../../store/authStore.ts';


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



export default function CommunityFeed() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const isAdmin = user?.roles?.includes('ADMIN');

    // 🌟 Create Post State
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // 🌟 Lightbox (Zoom) State
    const [activeGallery, setActiveGallery] = useState<{ media: any[], initialIndex: number } | null>(null);

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
    // 🌟 Smart Image Grid Renderer (Removed in favor of Carousel)

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="w-12 h-12 border-4 border-[#D64A26]/20 border-t-[#D64A26] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 bg-[#FAFAFA] font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div className="text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#D64A26] text-sm font-semibold mb-4 border border-orange-100 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#D64A26] animate-pulse"></span>
                            Community Feed
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#222222] tracking-tight mb-4 md:mb-0">
                            Stories & Updates
                        </h1>
                    </div>
                    
                    {isAdmin && (
                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            className="shrink-0 relative overflow-hidden group/btn px-7 py-4 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold tracking-widest uppercase text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Create Story / Post
                            </span>
                        </button>
                    )}
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

                            return (
                                // 🌟 ID যুক্ত করা হয়েছে যাতে লিংকে ক্লিক করলে এখানে স্ক্রল করে চলে আসে
                                <div id={post.id} key={post.id} className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 scroll-mt-24">

                                    <div className="px-6 md:px-8 pt-6 pb-4 flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 text-[#D64A26] flex items-center justify-center font-bold text-xl ring-1 ring-slate-200/60">
                                                {post.author?.full_name?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#222222] text-[1.05rem] leading-tight hover:text-[#D64A26] cursor-pointer transition-colors">{post.author?.full_name || 'CRC Admin'}</h3>
                                                <p className="text-[#666666] text-[0.85rem] font-medium mt-0.5">{date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 md:px-8 pb-5">
                                        {post.title && <h2 className="text-xl font-serif font-bold text-[#222222] mb-2 leading-snug">{post.title}</h2>}
                                        <p className="text-[#666666] leading-relaxed whitespace-pre-wrap text-[1rem]">{post.content}</p>
                                    </div>

                                    {/* 🌟 Media Collage (+N Style) */}
                                    {mediaArr.length > 0 && (
                                        <div className="px-6 md:px-8 pb-6">
                                            <MediaCollage media={mediaArr} onImageClick={(index) => setActiveGallery({ media: mediaArr, initialIndex: index })} />
                                        </div>
                                    )}

                                    {/* Action Footer */}
                                    <div className="px-4 md:px-6 py-3 border-t border-slate-50 flex items-center justify-between">
                                        <button
                                            onClick={() => likeMutation.mutate(post.id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full text-[#666666] hover:text-[#D64A26] hover:bg-orange-50 font-semibold transition-all group"
                                        >
                                            <div className="transition-transform group-hover:-translate-y-0.5"><ClapIcon /></div>
                                            <span>{post.likes_count || 0} Applauds</span>
                                        </button>

                                        {/* 🌟 Specific Post Share Button */}
                                        <button
                                            onClick={() => handleShare(post)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-400 hover:text-[#666666] hover:bg-slate-50 font-medium text-[0.9rem] transition-all"
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

            {/* 🌟 Universal Lightbox Gallery */}
            {activeGallery && (
                <LightboxGallery 
                    media={activeGallery.media} 
                    initialIndex={activeGallery.initialIndex} 
                    onClose={() => setActiveGallery(null)} 
                />
            )}

            {/* 🌟 Create Post Modal */}
            <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />

        </div>
    );
}