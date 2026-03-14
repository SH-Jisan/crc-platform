import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../../api/posts';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: Props) {
    const queryClient = useQueryClient();

    const [postType, setPostType] = useState('UPDATE');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaType, setMediaType] = useState('IMAGE');
    const [isGallerySynced, setIsGallerySynced] = useState(false);

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['gallery'] }); // 🌟 গ্যালারিও রিফ্রেশ হবে
            onClose();
            // Reset form
            setTitle(''); setContent(''); setMediaUrl(''); setIsGallerySynced(false);
            alert("Post published successfully! 🎉");
        },
        onError: () => {
            alert("Failed to publish post.");
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            post_type: postType,
            title,
            content,
            media_url: mediaUrl,
            media_type: mediaType,
            is_gallery_synced: isGallerySynced
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-xl font-bold text-stone-800">Create New Post</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">✕</button>
                </div>

                <div className="overflow-y-auto p-6">
                    <form id="post-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-1">Post Type</label>
                                <select value={postType} onChange={(e) => setPostType(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                                    <option value="UPDATE">General Update</option>
                                    <option value="SUCCESS_STORY">Success Story 🌟</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-1">Title (Optional)</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Catchy title..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-1">Content *</label>
                            <textarea required rows={5} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="What's happening in the community? Tell your story..." />
                        </div>

                        <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-4">
                            <h3 className="text-sm font-bold text-stone-700">Attach Media (Optional)</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                                        <option value="IMAGE">Image URL</option>
                                        <option value="VIDEO">Video Link (YouTube)</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder={mediaType === 'VIDEO' ? "https://youtube.com/watch?v=..." : "https://..."} />
                                </div>
                            </div>

                            {/* 🌟 Smart Gallery Sync Toggle */}
                            {mediaType === 'IMAGE' && mediaUrl && (
                                <div className="flex items-center gap-3 pt-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isGallerySynced} onChange={() => setIsGallerySynced(!isGallerySynced)} />
                                        <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                    <div>
                                        <p className="font-bold text-sm text-stone-700">Add to Public Gallery</p>
                                        <p className="text-xs text-stone-500">This image will also appear in the website's gallery.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                    <button type="submit" form="post-form" disabled={mutation.isPending} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-70">
                        {mutation.isPending ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </div>
        </div>
    );
}