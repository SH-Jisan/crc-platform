import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/axios';

export default function RecentActivities() {
    const { data: response } = useQuery({
        queryKey: ['recent-posts'],
        queryFn: async () => {
            const res = await apiClient.get('/posts');
            return res.data;
        }
    });

    const posts = Array.isArray(response?.data) ? response.data.slice(0, 3) : [];

    if (posts.length === 0) return null;

    return (
        <div className="py-24 bg-[#F9F9F9] border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-slate-200 pb-4">
                    <h2 className="text-4xl  font-bold text-[#222222]">Our Recent Activities</h2>
                    <Link to="/posts" className="text-[#D64A26] font-bold uppercase tracking-widest hover:text-[#b53d1e] text-sm mt-4 sm:mt-0">View Community &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post: any) => {
                        const hasMedia = post.media && post.media.length > 0;
                        const firstImage = hasMedia ? post.media.find((m: any) => m.type === 'IMAGE')?.url : null;

                        return (
                            <Link to={`/posts`} key={post.id} className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                                <div className="relative h-56 bg-[#222222] overflow-hidden flex items-center justify-center">
                                    {firstImage ? (
                                        <img src={firstImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <span className="text-white/20  text-5xl">CRC</span>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-[#D64A26] uppercase tracking-widest mb-3">
                                        {post.post_type.replace('_', ' ')}
                                    </div>
                                    <h3 className="text-xl  font-bold text-[#222222] mb-3 group-hover:text-[#D64A26] transition-colors line-clamp-2">
                                        {post.title || 'Community Update'}
                                    </h3>
                                    <p className="text-[#666666] text-sm line-clamp-3 leading-relaxed flex-1">
                                        {post.content}
                                    </p>
                                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                                        <img src={post.author?.avatar_url || `https://ui-avatars.com/api/?name=${post.author?.full_name}&background=D64A26&color=fff`} alt="author" className="w-8 h-8 rounded-full" />
                                        <span className="text-xs font-bold text-[#666666]">{post.author?.full_name}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}