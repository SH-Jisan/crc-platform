import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    image?: string;
    shareUrl: string;
    type: 'CAMPAIGN' | 'EVENT' | 'CAUSE' | 'POST';
    stats?: {
        label1?: string;
        value1?: string;
        label2?: string;
        value2?: string;
        progress?: number;
    };
}

export default function ShareModal({
    isOpen,
    onClose,
    title,
    description = 'Join hands with Come for Road Child to empower underprivileged lives.',
    image,
    shareUrl,
    type,
    stats
}: ShareModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen) return null;

    const defaultImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop";
    const bannerImage = image || defaultImage;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy link', err);
        }
    };

    const handleDownloadCard = async () => {
        if (!cardRef.current) return;
        try {
            setIsDownloading(true);
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });
            const link = document.createElement('a');
            const fileName = `CRC-${type.toLowerCase()}-${title.slice(0, 20).replace(/\s+/g, '-')}.png`;
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Error generating card thumbnail', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSocialShare = (platform: 'facebook' | 'whatsapp' | 'twitter' | 'linkedin') => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(`*${title}*\n${description.slice(0, 100)}...`);

        let url = '';
        if (platform === 'facebook') {
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        } else if (platform === 'whatsapp') {
            url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        } else if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        } else if (platform === 'linkedin') {
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        }

        window.open(url, '_blank', 'width=600,height=500');
    };

    const getTypeColor = () => {
        switch (type) {
            case 'CAMPAIGN': return 'from-[#D64A26] to-[#F1795D]';
            case 'EVENT': return 'from-[#3B82F6] to-[#60A5FA]';
            case 'CAUSE': return 'from-[#10B981] to-[#34D399]';
            default: return 'from-[#8B5CF6] to-[#A78BFA]';
        }
    };

    const getTypeBadge = () => {
        switch (type) {
            case 'CAMPAIGN': return '🔥 Urgent Campaign';
            case 'EVENT': return '📅 Upcoming Event';
            case 'CAUSE': return '❤️ Direct Cause';
            default: return '📢 Community Post';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                    <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${getTypeColor()}`}></span>
                        <h3 className="font-bold text-slate-800 text-lg">Share & Spread Hope</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Visual Card Thumbnail Preview for Download & Display */}
                    <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200/80 shadow-inner flex justify-center">
                        <div 
                            ref={cardRef}
                            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-slate-200 text-left font-sans relative"
                        >
                            {/* Card Top Brand Ribbon */}
                            <div className="bg-slate-900 px-5 py-3 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-[#D64A26] text-white flex items-center justify-center font-bold text-xs shadow-md">
                                        CRC
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-slate-200">Come for Road Child</span>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r ${getTypeColor()} text-white shadow-sm`}>
                                    {getTypeBadge()}
                                </span>
                            </div>

                            {/* Banner Image */}
                            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                                <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                                <h4 className="absolute bottom-3 left-4 right-4 text-white font-extrabold text-lg leading-snug drop-shadow-md">
                                    {title}
                                </h4>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-3 bg-white">
                                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed font-medium">
                                    {description}
                                </p>

                                {stats && (
                                    <div className="pt-2 border-t border-slate-100 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                            <span>{stats.label1}: <strong className="text-[#D64A26]">{stats.value1}</strong></span>
                                            {stats.label2 && <span>{stats.label2}: <strong className="text-slate-900">{stats.value2}</strong></span>}
                                        </div>

                                        {typeof stats.progress === 'number' && (
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-[#D64A26] to-[#F1795D] rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, Math.max(0, stats.progress))}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Footer QR & Share Badge */}
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                    <span>Support & Spread Awareness</span>
                                    <span className="text-[#D64A26]">crc-platform.org</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div className="space-y-4">
                        {/* Download Card Button & Direct Share */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={handleDownloadCard}
                                disabled={isDownloading}
                                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {isDownloading ? 'Generating Card...' : 'Download Card Image'}
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className={`px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    isCopied 
                                        ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                                        : 'bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                {isCopied ? 'Link Copied! 📋' : 'Copy Direct Link'}
                            </button>
                        </div>

                        {/* Social Network Share Buttons */}
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wider text-center sm:text-left">
                                Share directly to social media
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    onClick={() => handleSocialShare('facebook')}
                                    className="py-2.5 px-3 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-xl font-bold text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>Facebook</span>
                                </button>
                                <button
                                    onClick={() => handleSocialShare('whatsapp')}
                                    className="py-2.5 px-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl font-bold text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>WhatsApp</span>
                                </button>
                                <button
                                    onClick={() => handleSocialShare('twitter')}
                                    className="py-2.5 px-3 bg-slate-900/10 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl font-bold text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>X (Twitter)</span>
                                </button>
                                <button
                                    onClick={() => handleSocialShare('linkedin')}
                                    className="py-2.5 px-3 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white rounded-xl font-bold text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>LinkedIn</span>
                                </button>
                            </div>
                        </div>

                        {/* Share URL Input Display */}
                        <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                            <input 
                                type="text" 
                                readOnly 
                                value={shareUrl} 
                                className="w-full bg-transparent text-xs text-slate-600 font-mono focus:outline-none px-2 select-all"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
