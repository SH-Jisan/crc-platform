const LIKED_POSTS_KEY = 'crc_liked_posts_v1';

export const getLikedPostIds = (): string[] => {
    try {
        const stored = localStorage.getItem(LIKED_POSTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const isPostLikedLocally = (postId: string): boolean => {
    return getLikedPostIds().includes(postId);
};

export const setLocalPostLike = (postId: string, liked: boolean): void => {
    const current = getLikedPostIds();
    let updated: string[];
    if (liked) {
        if (!current.includes(postId)) {
            updated = [...current, postId];
        } else {
            return;
        }
    } else {
        updated = current.filter(id => id !== postId);
    }
    try {
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to write like state to localStorage', e);
    }
};

export const toggleLocalPostLike = (postId: string, currentlyLiked?: boolean): { isNowLiked: boolean; delta: number } => {
    const isLiked = typeof currentlyLiked === 'boolean' ? currentlyLiked : isPostLikedLocally(postId);
    const isNowLiked = !isLiked;
    const delta = isNowLiked ? 1 : -1;

    setLocalPostLike(postId, isNowLiked);
    return { isNowLiked, delta };
};
