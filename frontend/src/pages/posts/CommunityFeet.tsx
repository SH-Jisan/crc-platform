import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, likePost } from '../../api/posts';

// 🌟 YouTube লিংক থেকে ভিডিও আইডি বের করার ম্যাজিক ফাংশন
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

export default function CommunityFeed() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: getPosts,
    });

    // 🌟 THE FIX: ডেটা সরাসরি Array হোক বা { data: [...] } ফরমেটে থাকুক, এটি নিখুঁতভাবে বের করে আনবে
    const posts = Array.isArray(data)
        ? data
        : (Array.isArray(data?.data) ? data.data : []);

    const likeMutation = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 bg-[#FAFAFA] font-sans">
            <div className="max-w-3xl mx-auto">

                {/* 🌟 Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-4 border border-emerald-100 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Community Feed
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight mb-4">
                        Stories & Updates
                    </h1>
                    <p className="text-stone-500 text-lg">Discover the latest activities, success stories, and updates from the CRC family.</p>
                </div>

                {/* 🌟 Posts Feed */}
                <div className="space-y-10">
                    {posts.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-3xl border border-stone-100">
                            <h3 className="text-xl font-bold text-stone-800">No posts yet</h3>
                            <p className="text-stone-500 mt-2">Check back later for exciting community updates!</p>
                        </div>
                    ) : (
                        posts.map((post: any) => {
                            const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            const isSuccessStory = post.post_type === 'SUCCESS_STORY';
                            const youtubeEmbedUrl = post.media_type === 'VIDEO' && post.media_url ? getYouTubeEmbedUrl(post.media_url) : null;

                            return (
                                <div key={post.id} className="bg-white rounded-4xl border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-lg">

                                    {/* Post Header (Author Info & Badge) */}
                                    <div className="p-6 md:p-8 flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-bold text-xl ring-2 ring-stone-50">
                                                {post.author?.full_name?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-stone-900 text-lg leading-tight">{post.author?.full_name || 'CRC Admin'}</h3>
                                                <p className="text-stone-500 text-sm font-medium">{date}</p>
                                            </div>
                                        </div>
                                        {isSuccessStory && (
                                            <span className="shrink-0 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold uppercase rounded-full border border-amber-200/50 flex items-center gap-1.5 shadow-sm">
                                                🌟 Success Story
                                            </span>
                                        )}
                                    </div>

                                    {/* Post Content */}
                                    <div className="px-6 md:px-8 pb-4">
                                        {post.title && <h2 className="text-2xl font-extrabold text-stone-800 mb-3 leading-snug">{post.title}</h2>}
                                        <p className="text-stone-600 leading-relaxed whitespace-pre-wrap text-[1.05rem]">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* 🌟 Vlogging Style Media Rendering */}
                                    {post.media_url && (
                                        <div className="px-6 md:px-8 pb-6">
                                            {post.media_type === 'IMAGE' ? (
                                                <img
                                                    src={post.media_url}
                                                    alt={post.title || "Post media"}
                                                    className="w-full max-h-125 object-cover rounded-2xl border border-stone-100 shadow-sm"
                                                    loading="lazy"
                                                />
                                            ) : post.media_type === 'VIDEO' && youtubeEmbedUrl ? (
                                                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-stone-100 shadow-sm bg-stone-900">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={youtubeEmbedUrl}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ) : (
                                                <a href={post.media_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline break-all text-sm font-medium">
                                                    🔗 View Attached Link
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer / Engagement (Clap/Like Button) */}
                                    <div className="px-6 md:px-8 py-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
                                        <button
                                            onClick={() => likeMutation.mutate(post.id)}
                                            disabled={likeMutation.isPending}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 font-bold transition-all disabled:opacity-50"
                                        >
                                            <ClapIcon />
                                            <span>{post.likes_count || 0} Applauds</span>
                                        </button>
                                        <button className="text-stone-400 hover:text-stone-600 font-medium text-sm transition-colors">
                                            Share
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}