import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../../api/posts';
import { supabase } from '../../api/supabase'; // 🌟 তোমার প্রজেক্টের Supabase ক্লায়েন্ট

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: Props) {
    const queryClient = useQueryClient();

    const [postType, setPostType] = useState('UPDATE');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isGallerySynced, setIsGallerySynced] = useState(false);

    // 🌟 Multiple Media States
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [videoLink, setVideoLink] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
            onClose();
            setTitle(''); setContent(''); setSelectedImages([]); setVideoLink(''); setIsGallerySynced(false);
            alert("Post published successfully! 🎉");
        },
        onError: () => {
            alert("Failed to publish post.");
        }
    });

    if (!isOpen) return null;

    const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedImages((prev) => [...prev, ...filesArray]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const uploadedMedia = [];

            // 🌟 ১. Supabase Storage-এ একাধিক ছবি আপলোড
            for (const file of selectedImages) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error } = await supabase.storage
                    .from('post-media')
                    .upload(fileName, file);

                if (error) throw error;

                const { data: publicUrlData } = supabase.storage
                    .from('post-media')
                    .getPublicUrl(fileName);

                uploadedMedia.push({ type: 'IMAGE', url: publicUrlData.publicUrl });
            }

            // 🌟 ২. ইউটিউব ভিডিও লিংক যুক্ত করা
            if (videoLink.trim() !== '') {
                uploadedMedia.push({ type: 'VIDEO', url: videoLink });
            }

            // 🌟 ৩. ব্যাকএন্ডে ডেটা পাঠানো
            mutation.mutate({
                post_type: postType,
                title,
                content,
                media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
                is_gallery_synced: isGallerySynced
            });

        } catch (error) {
            alert("Error uploading images to Supabase! Check console.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
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
                            <textarea required rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="What's happening in the community?" />
                        </div>

                        {/* 🌟 Multiple Media Section */}
                        <div className="p-5 bg-stone-50 rounded-xl border border-stone-200/60 space-y-4">
                            <h3 className="text-sm font-bold text-stone-800">Attach Media</h3>

                            <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1">YouTube Video Link (Optional)</label>
                                <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="https://youtube.com/watch?v=..." />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1">Upload Images (Multiple allowed)</label>
                                <input type="file" multiple accept="image/*" onChange={handleImageSelection} className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                            </div>

                            {selectedImages.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {selectedImages.map((file, index) => (
                                        <div key={index} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedImages.length > 0 && (
                                <div className="flex items-center gap-3 pt-3 border-t border-stone-200/60 mt-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isGallerySynced} onChange={() => setIsGallerySynced(!isGallerySynced)} />
                                        <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                    <div>
                                        <p className="font-bold text-sm text-stone-700">Add to Public Gallery</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                    <button type="submit" form="post-form" disabled={isUploading || mutation.isPending} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2">
                        {isUploading ? 'Uploading Media...' : mutation.isPending ? 'Publishing Post...' : 'Publish Post'}
                    </button>
                </div>
            </div>
        </div>
    );
}