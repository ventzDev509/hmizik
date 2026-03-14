
export const useOfflineDownload = () => {
    const CACHE_NAME = 'music-cache';

    const downloadTrack = async (audioUrl: string, coverUrl: string, trackTitle: string) => {
        if (!('caches' in window)) return;
        try {
            const cache = await caches.open(CACHE_NAME);

            // Telechaje Audio
            const audioRes = await fetch(audioUrl);
            await cache.put(audioUrl, audioRes);

            // Telechaje Cover
            if (coverUrl) {
                const coverRes = await fetch(coverUrl);
                await cache.put(coverUrl, coverRes);

                // --- NOUVO: Sere relasyon an nan localStorage ---
                const offlineMap = JSON.parse(localStorage.getItem('offline_metadata') || '{}');
                offlineMap[audioUrl] = { coverUrl, trackTitle };
                localStorage.setItem('offline_metadata', JSON.stringify(offlineMap));
            }

            console.log("✅ Mizik ak Foto sere!");
        } catch (e) { console.error(e); }
    };
    const isOffline = async (url: string) => {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(url);
        return !!match;
    };

    return { downloadTrack, isOffline };
};