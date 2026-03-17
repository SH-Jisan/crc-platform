import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../api/supabase';
import { uploadGalleryImage } from '../../api/gallery';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadGalleryModal({ isOpen, onClose }: Props) {
    const queryClient = useQueryClient();

    // 🌟 Multiple images এর জন্য State
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const resetState = () => {
        setSelectedImages([]);
        setCaption('');
        setIsUploading(false);
    };

    // 🌟 একাধিক ছবি সিলেক্ট করার ফাংশন
    const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedImages((prev) => [...prev, ...filesArray]);
        }
    };

    // 🌟 ভুল করে সিলেক্ট করা ছবি রিমুভ করার ফাংশন
    const removeImage = (indexToRemove: number) => {
        setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    // 🌟 একাধিক ছবি আপলোড করার ম্যাজিক লজিক
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedImages.length === 0) return alert("Please select at least one image!");

        setIsUploading(true);

        try {
            // Promise.all ব্যবহার করে সবগুলো ছবি প্যারালালি (একসাথে) আপলোড করছি
            const uploadPromises = selectedImages.map(async (file) => {

                // ১. Supabase-এ ছবি আপলোড
                const fileExt = file.name.split('.').pop();
                const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error } = await supabase.storage
                    .from('post-media')
                    .upload(fileName, file);

                if (error) throw error;

                // ২. পাবলিক লিংক জেনারেট
                const { data: publicUrlData } = supabase.storage
                    .from('post-media')
                    .getPublicUrl(fileName);

                // ৩. ব্যাকএন্ডে সেভ করা (প্রতিটি ছবির জন্য আলাদা কল)
                return uploadGalleryImage({
                    image_url: publicUrlData.publicUrl,
                    caption: caption.trim() === '' ? undefined : caption
                });
            });

            // সবগুলোর আপলোড শেষ হওয়া পর্যন্ত অপেক্ষা করবে
            await Promise.all(uploadPromises);

            // সফল হলে গ্যালারি রিফ্রেশ এবং মডাল বন্ধ
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
            onClose();
            resetState();
            alert(`Successfully added ${selectedImages.length} image(s) to the gallery! 🖼️`);

        } catch (error) {
            console.error(error);
            alert("Error uploading images to Supabase!");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-xl font-black text-stone-800">Add to Gallery</h2>
                    <button onClick={() => { onClose(); resetState(); }} className="p-2 bg-stone-200/50 hover:bg-stone-200 text-stone-500 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <form id="gallery-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* 🌟 Multiple File Input */}
                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 border-dashed">
                            <label className="block text-sm font-bold text-stone-700 mb-2">Select Images (Multiple allowed)</label>
                            <input
                                type="file"
                                multiple // 🌟 এই ম্যাজিক অ্যাট্রিবিউটটিই একসাথে অনেক ছবি সিলেক্ট করতে দেবে
                                accept="image/*"
                                onChange={handleImageSelection}
                                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-colors cursor-pointer"
                            />
                        </div>

                        {/* 🌟 Image Previews Grid */}
                        {selectedImages.length > 0 && (
                            <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-100">
                                {selectedImages.map((file, index) => (
                                    <div key={index} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shadow-sm flex-shrink-0">
                                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Caption Input */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Caption for these images (Optional)</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
                                placeholder="E.g., Winter Clothes Distribution 2026..."
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                    <button
                        type="submit"
                        form="gallery-form"
                        disabled={selectedImages.length === 0 || isUploading}
                        className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-[0_4px_15px_rgb(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgb(16,185,129,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Uploading {selectedImages.length} images...
                            </>
                        ) : (
                            `Upload ${selectedImages.length > 0 ? selectedImages.length : ''} Photos`
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}