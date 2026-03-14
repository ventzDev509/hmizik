import { useState, useEffect, useCallback } from 'react';


export const useOfflineTracks = () => {
  const [offlineTracks, setOfflineTracks] = useState<string[]>([]);

  const getCachedTracks = useCallback(async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = ['music-cache', 'music-offline-cache'];
      let allUrls: string[] = [];

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        // Nou pran URL yo
        const urls = requests.map(request => request.url);
        allUrls = [...allUrls, ...urls];
      }

      const uniqueMusicUrls = Array.from(new Set(allUrls)).filter(url => 
        url.includes('supabase.co') && 
        (url.includes('.mp3') || url.includes('.wav') || url.includes('/tracks/'))
      );

      setOfflineTracks(uniqueMusicUrls);
    } catch (error) {
      console.error("Error retrieving cached tracks:", error);
    }
  }, []);

  useEffect(() => {
    getCachedTracks();

    // Listener pou lè itilizatè a tounen sou paj la
    window.addEventListener('focus', getCachedTracks);
    
    // NOUVO: Koute evènman koutim si ou vle fòse yon update apre yon download fini
    window.addEventListener('offline-cache-updated', getCachedTracks);

    return () => {
      window.removeEventListener('focus', getCachedTracks);
      window.removeEventListener('offline-cache-updated', getCachedTracks);
    };
  }, [getCachedTracks]);

  return offlineTracks;
};