import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostById, likePost } from '../../api/posts';
import MediaCollage from '../../components/media_layouts/MediaCollage.tsx';
import LightboxGallery from '../../components/media_layouts/LightboxGallery.tsx';



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



export default function SinglePost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeGallery, setActiveGallery] = useState<{ media: any[], initialIndex: number } | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['post', id],
        queryFn: () => getPostById(id as string),
    });

    const post = data?.data || data;

    const likeMutation = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', id] });
        }
    });
    const handleShare = async () => {
        if(!post) return;
        const frontendPostUrl = window.location.href;
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
        const shareUrl = `${apiBase}/posts/${post.id}/share?redirect=${encodeURIComponent(frontendPostUrl)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title || 'CRC Community Post',
                    url: shareUrl,
                });
            } catch (error) {}
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Post link copied! 📋');
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="w-12 h-12 border-4 border-[#D64A26]/20 border-t-[#D64A26] rounded-full animate-spin"></div>
        </div>
    );

    if (isError || !post) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-stone-600">
            <h2 className="text-2xl font-bold mb-4">Post not found</h2>
            <button onClick={() => navigate('/posts')} className="px-6 py-2 bg-[#D64A26] hover:bg-[#b53d1e] text-white rounded-xl font-bold shadow-md transition-colors">Go to Feed</button>
        </div>
    );

    const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const mediaArr = Array.isArray(post.media) ? post.media : [];

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 bg-[#FAFAFA] font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <button onClick={() => navigate('/posts')} className="mb-6 flex items-center gap-2 text-stone-500 hover:text-[#D64A26] font-bold transition-colors">
                    <span>←</span> Back to Community Feed
                </button>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 md:px-8 pt-6 pb-4 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-stone-100 text-[#D64A26] flex items-center justify-center font-bold text-2xl ring-1 ring-stone-200/60">
                                {post.author?.full_name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-900 text-xl leading-tight">{post.author?.full_name || 'CRC Admin'}</h3>
                                <p className="text-stone-500 text-[0.9rem] font-medium mt-1">{date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-8 pb-5">
                        {post.title && <h2 className="text-3xl font-serif font-bold text-stone-900 mb-3 leading-snug">{post.title}</h2>}
                        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-[1.1rem]">{post.content}</p>
                    </div>

                    {/* Media Collage (+N Style) */}
                    {mediaArr.length > 0 && (
                        <div className="px-6 md:px-8 pb-6">
                            <MediaCollage media={mediaArr} onImageClick={(index) => setActiveGallery({ media: mediaArr, initialIndex: index })} />
                        </div>
                    )}

                    <div className="px-4 md:px-6 py-4 border-t border-stone-50 flex items-center justify-between">
                        <button
                            onClick={() => likeMutation.mutate(post.id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-stone-500 hover:text-[#D64A26] hover:bg-orange-50 font-semibold transition-all group lg:text-lg"
                        >
                            <div className="transition-transform group-hover:-translate-y-0.5"><ClapIcon /></div>
                            <span>{post.likes_count || 0} Applauds</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-50 font-medium transition-all"
                        >
                            <ShareIcon />
                            Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Universal Lightbox Gallery */}
            {activeGallery && (
                <LightboxGallery 
                    media={activeGallery.media} 
                    initialIndex={activeGallery.initialIndex} 
                    onClose={() => setActiveGallery(null)} 
                />
            )}
        </div>
    );
}