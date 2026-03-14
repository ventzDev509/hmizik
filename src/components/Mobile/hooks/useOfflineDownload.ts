import toast from 'react-hot-toast';

export const useOfflineDownload = () => {
    const CACHE_NAME = 'music-cache';

    const downloadTrack = async (audioUrl: string, coverUrl: string, trackTitle: string) => {
        if (!('caches' in window)) {
            toast.error("Navigatè w la pa sipòte mòd offline");
            return;
        }

        try {
            const cache = await caches.open(CACHE_NAME);

            // 1. Telechaje Audio ak Cover an paralèl pou l pi vit
            const [audioRes, coverRes] = await Promise.all([
                fetch(audioUrl),
                coverUrl ? fetch(coverUrl) : Promise.resolve(null)
            ]);

            // Tcheke si download audio a mache
            if (!audioRes.ok) throw new Error("Audio download failed");

            // 2. Mete yo nan Kach (itilize .clone() pou sekirite)
            await cache.put(audioUrl, audioRes.clone());
            
            if (coverRes && coverRes.ok) {
                await cache.put(coverUrl, coverRes.clone());
            }

            // 3. Sere metadata yo nan localStorage
            const offlineMap = JSON.parse(localStorage.getItem('offline_metadata') || '{}');
            offlineMap[audioUrl] = { 
                coverUrl, 
                trackTitle,
                downloadedAt: new Date().toISOString() 
            };
            localStorage.setItem('offline_metadata', JSON.stringify(offlineMap));

            // 4. Voye yon siyal pou di lis offline a chanje
            window.dispatchEvent(new CustomEvent('offline-cache-updated'));

            toast.success(`${trackTitle} disponib offline!`);
            console.log("✅ Mizik ak Foto sere!");

        } catch (e) { 
            console.error("Download Error:", e);
            toast.error("Echèk telechajman. Tcheke entènèt ou.");
        }
    };

    const isOffline = async (url: string) => {
        if (!url) return false;
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(url);
        return !!match;
    };

    const removeTrack = async (audioUrl: string) => {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(audioUrl);
        
        const offlineMap = JSON.parse(localStorage.getItem('offline_metadata') || '{}');
        delete offlineMap[audioUrl];
        localStorage.setItem('offline_metadata', JSON.stringify(offlineMap));
        
        window.dispatchEvent(new CustomEvent('offline-cache-updated'));
        toast.success("Mizik retire nan kach");
    };

    return { downloadTrack, isOffline, removeTrack };
};