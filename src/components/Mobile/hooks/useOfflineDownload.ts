import toast from 'react-hot-toast';

export const useOfflineDownload = () => {
    const CACHE_NAME = 'music-cache';

    const downloadTrack = async (audioUrl: string, coverUrl: string, trackTitle: string) => {
        if (!('caches' in window)) return;
        
        const toastId = toast.loading(`Telechaje: ${trackTitle}...`);

        try {
            // 1. Nou fè Fetch la ak mode 'cors' pou asire n gen aksè ak data a
            // Nou itilize Promise.all pou yo telechaje an menm tan
            const [audioRes, coverRes] = await Promise.all([
                fetch(audioUrl, { mode: 'cors' }),
                coverUrl ? fetch(coverUrl, { mode: 'cors' }) : Promise.resolve(null)
            ]);

            if (!audioRes.ok) throw new Error("Audio telechajman echwe");

            // --- ETAP KRITIK: KONVÈTI NAN BLOB POU FÒSE FINI ---
            // Lè nou fè .blob(), navigatè a DWE fini telechaje chak bit anvan l kontinye
            const audioBlob = await audioRes.blob();
            
            let coverBlob = null;
            if (coverRes && coverRes.ok) {
                coverBlob = await coverRes.blob();
            }

            // 2. Koulye a nou sèten data a la, nou louvri kach la
            const cache = await caches.open(CACHE_NAME);

            // 3. Kreye nouvo Repons ak bon Header pou kach la pa gen "opaque"
            const audioToCache = new Response(audioBlob, {
                headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': audioBlob.size.toString() }
            });

            await cache.put(audioUrl, audioToCache);

            if (coverBlob) {
                const coverToCache = new Response(coverBlob, {
                    headers: { 'Content-Type': 'image/jpeg' }
                });
                await cache.put(coverUrl, coverToCache);
            }

            // 4. Sere metadata yo
            const offlineMap = JSON.parse(localStorage.getItem('offline_metadata') || '{}');
            offlineMap[audioUrl] = { coverUrl, trackTitle };
            localStorage.setItem('offline_metadata', JSON.stringify(offlineMap));

            toast.success(`${trackTitle} sove nèt!`, { id: toastId });
            console.log("✅ Mizik ak Foto sere san erè!");

        } catch (e) { 
            console.error("Download error:", e);
            toast.error("Echèk telechajman. Tcheke si Supabase CORS pèmèt.", { id: toastId });
        }
    };

    const isOffline = async (url: string) => {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(url);
        return !!match;
    };

    return { downloadTrack, isOffline };
};