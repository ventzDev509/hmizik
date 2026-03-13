import { useState, useEffect } from 'react';

export const useOfflineTracks = () => {
  const [offlineTracks, setOfflineTracks] = useState<string[]>([]);

  useEffect(() => {
    const getCachedTracks = async () => {
      if ('caches' in window) {
        // Nou tcheke tou de kach yo
        const cacheNames = ['music-cache', 'music-offline-cache'];
        let allUrls: string[] = [];

        for (const name of cacheNames) {
          const cache = await caches.open(name);
          const requests = await cache.keys();
          const urls = requests.map(request => request.url);
          allUrls = [...allUrls, ...urls];
        }

        // Retire double si yon mizik nan de kach yo
        const uniqueUrls = Array.from(new Set(allUrls));
        
        // Filtre pou n pran sèlman URL Supabase yo (mizik)
        const musicOnly = uniqueUrls.filter(url => url.includes('supabase.co'));
        
        setOfflineTracks(musicOnly);
      }
    };

    getCachedTracks();
    
    // Ti kòd anplis: tcheke ankò si itilizatè a soti nan yon lòt tab retounen
    window.addEventListener('focus', getCachedTracks);
    return () => window.removeEventListener('focus', getCachedTracks);
  }, []);

  return offlineTracks;
};