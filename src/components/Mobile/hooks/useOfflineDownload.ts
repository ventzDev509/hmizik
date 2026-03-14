import { useCallback } from 'react';

export const useOfflineDownload = () => {
    
    const isOffline = useCallback(async (audioUrl: string) => {
        const cache = await caches.open('music-cache');
        const match = await cache.match(audioUrl);
        return !!match;
    }, []);

    const downloadWithProgress = async (
        url: string, 
        cover: string, 
        title: string, 
        trackId: string, 
        onProgress: (p: number) => void
    ) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Repons lan pa bon");

            const contentLength = +(response.headers.get('Content-Length') || 0);
            const reader = response.body?.getReader();
            if (!reader) throw new Error("Reader pa disponib");

            let loaded = 0;
            const chunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                chunks.push(value);
                loaded += value.length;
                
                if (contentLength > 0) {
                    const p = Math.round((loaded / contentLength) * 100);
                    onProgress(p);
                }
            }

            const blob = new Blob(chunks);
            const cacheResponse = new Response(blob, {
                headers: response.headers
            });

            const cache = await caches.open('music-cache');
            await cache.put(url, cacheResponse);

            // Sove Metadata ak trackId
            const metadata = JSON.parse(localStorage.getItem('offline_metadata') || '{}');
            metadata[url] = { 
                trackId, 
                trackTitle: title, 
                coverUrl: cover,
                downloadedAt: new Date().toISOString()
            };
            localStorage.setItem('offline_metadata', JSON.stringify(metadata));

            // Sove imaj la tou nan kach
            const imgCache = await caches.open('images-cache');
            const imgRes = await fetch(cover);
            if (imgRes.ok) await imgCache.put(cover, imgRes);

            return true;
        } catch (error) {
            throw error;
        }
    };

    return { downloadWithProgress, isOffline };
};