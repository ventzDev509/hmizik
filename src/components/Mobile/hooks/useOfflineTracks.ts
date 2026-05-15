import { useState, useEffect } from 'react';

export const useOfflineTracks = () => {
  const [offlineTracks, setOfflineTracks] = useState<string[]>([]);

  useEffect(() => {
    const getCachedTracks = async () => {
      if ('caches' in window) {
        
        const cacheNames = ['music-cache', 'music-offline-cache'];
        let allUrls: string[] = [];

        for (const name of cacheNames) {
          const cache = await caches.open(name);
          const requests = await cache.keys();
          const urls = requests.map(request => request.url);
          allUrls = [...allUrls, ...urls];
        }

        
        const uniqueUrls = Array.from(new Set(allUrls));
        
        
        const musicOnly = uniqueUrls.filter(url => url.includes('supabase.co'));
        
        setOfflineTracks(musicOnly);
      }
    };

    getCachedTracks();
    
    
    window.addEventListener('focus', getCachedTracks);
    return () => window.removeEventListener('focus', getCachedTracks);
  }, []);

  return offlineTracks;
};