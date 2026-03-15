const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export interface MediaItem {
    id?: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

interface MediaCollageProps {
    media: MediaItem[];
    onImageClick?: (index: number) => void;
}

export default function MediaCollage({ media, onImageClick }: MediaCollageProps) {
    if (!media || media.length === 0) return null;

    // Helper to render a specific media item (Image or Video)
    const renderMediaItem = (item: MediaItem, customClasses: string = '') => {
        if (item.type === 'IMAGE') {
            return (
                <img
                    src={item.url}
                    alt="Post media"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onImageClick) onImageClick(media.indexOf(item));
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    className={`object-cover bg-stone-100 cursor-zoom-in hover:opacity-95 transition-opacity select-none ${customClasses}`}
                    style={{ width: '100%', height: '100%' }}
                />
            );
        } else if (item.type === 'VIDEO') {
            const youtubeUrl = getYouTubeEmbedUrl(item.url);
            return youtubeUrl ? (
                <div className={`relative bg-stone-900 ${customClasses}`}>
                    <iframe width="100%" height="100%" src={youtubeUrl} title="YouTube wrapper" frameBorder="0" allowFullScreen className="absolute top-0 left-0 w-full h-full"></iframe>
                </div>
            ) : null;
        }
        return null;
    };

    // 1 Item: Full width
    if (media.length === 1) {
        return (
            <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                {renderMediaItem(media[0], "w-full max-h-[600px] aspect-auto")}
            </div>
        );
    }

    // 2 Items: Side by side
    if (media.length === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full rounded-2xl overflow-hidden border border-stone-100 bg-white">
                {renderMediaItem(media[0], "w-full aspect-square")}
                {renderMediaItem(media[1], "w-full aspect-square")}
            </div>
        );
    }

    // 3 Items: 1 Large on left, 2 Small on right
    if (media.length === 3) {
        return (
            <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full rounded-2xl overflow-hidden border border-stone-100 bg-white min-h-[300px]">
                {renderMediaItem(media[0], "w-full h-full col-span-1 row-span-2")}
                <div className="flex flex-col gap-1 sm:gap-2 h-full">
                    {renderMediaItem(media[1], "w-full flex-1 min-h-0")}
                    {renderMediaItem(media[2], "w-full flex-1 min-h-0")}
                </div>
            </div>
        );
    }

    // 4 or more Items: 2x2 Grid with +N overlay on the 4th item
    return (
        <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full rounded-2xl overflow-hidden border border-stone-100 bg-white">
            {media.slice(0, 4).map((item, idx) => (
                <div key={idx} className="relative w-full aspect-square group overflow-hidden">
                    {renderMediaItem(item, "w-full h-full object-cover absolute inset-0")}
                    
                    {/* +N Overlay for the 4th element if more than 4 total */}
                    {idx === 3 && media.length > 4 && (
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onImageClick) onImageClick(media.indexOf(item)); 
                            }}
                            className="absolute inset-0 bg-black/60 hover:bg-black/70 transition-colors flex items-center justify-center cursor-pointer backdrop-blur-sm z-10"
                        >
                            <span className="text-white text-4xl font-extrabold tracking-tight drop-shadow-md">+{media.length - 4}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
