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
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl  font-bold text-[#222222]">Create New Post</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-[#666666] transition-colors">✕</button>
                </div>

                <div className="overflow-y-auto p-6">
                    <form id="post-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1">Post Type</label>
                                <select value={postType} onChange={(e) => setPostType(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none bg-[#F4F4F4]/50 text-[#222222]">
                                    <option value="UPDATE">General Update</option>
                                    <option value="SUCCESS_STORY">Success Story 🌟</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1">Title (Optional)</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none bg-[#F4F4F4]/50 text-[#222222] placeholder:text-slate-400" placeholder="Catchy title..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#666666] mb-1">Content *</label>
                            <textarea required rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none resize-none bg-[#F4F4F4]/50 text-[#222222] placeholder:text-slate-400" placeholder="What's happening in the community?" />
                        </div>

                        {/* 🌟 Multiple Media Section */}
                        <div className="p-5 bg-[#FAFAFA] rounded-xl border border-slate-200/60 space-y-4">
                            <h3 className="text-sm font-bold text-[#222222]">Attach Media</h3>

                            <div>
                                <label className="block text-xs font-semibold text-[#666666] mb-1">YouTube Video Link (Optional)</label>
                                <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none text-sm bg-[#F4F4F4]/50 text-[#222222] placeholder:text-slate-400" placeholder="https://youtube.com/watch?v=..." />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#666666] mb-1">Upload Images (Multiple allowed)</label>
                                <input type="file" multiple accept="image/*" onChange={handleImageSelection} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#D64A26] hover:file:bg-orange-100 transition-colors cursor-pointer" />
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
                                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 mt-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isGallerySynced} onChange={() => setIsGallerySynced(!isGallerySynced)} />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D64A26]"></div>
                                    </label>
                                    <div>
                                        <p className="font-bold text-sm text-[#666666]">Add to Public Gallery</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <button type="submit" form="post-form" disabled={isUploading || mutation.isPending} className="w-full py-4 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2">
                        <span className="relative z-10">{isUploading ? 'Uploading Media...' : mutation.isPending ? 'Publishing Post...' : 'Publish Post'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}