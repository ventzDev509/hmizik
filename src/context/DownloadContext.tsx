import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// Tip pou done chak telechajman
interface DownloadState {
    progress: number;
    controller: AbortController;
    title: string;
}

interface DownloadContextType {
    activeDownloads: Record<string, DownloadState>;
    downloadTrack: (trackId: string, audioUrl: string, coverUrl: string, title: string) => Promise<void>;
    cancelDownload: (trackId: string) => void;
    isOffline: (url: string) => Promise<boolean>;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Nou estoke telechajman yo pa trackId: { progress, controller, title }
    const [activeDownloads, setActiveDownloads] = useState<Record<string, DownloadState>>({});

    // Fonksyon pou tcheke si yon mizik deja offline (match nan Cache Storage)
    const isOffline = useCallback(async (url: string): Promise<boolean> => {
        try {
            const cache = await caches.open("offline-audio");
            const match = await cache.match(url);
            return !!match;
        } catch {
            return false;
        }
    }, []);

    const downloadTrack = async (trackId: string, audioUrl: string, coverUrl: string, title: string) => {
        if (activeDownloads[trackId]) return;

        const controller = new AbortController();
        const { signal } = controller;

        setActiveDownloads(prev => ({
            ...prev,
            [trackId]: { progress: 0, controller, title }
        }));

        try {
            // 1. Telechaje Cover la an premye (li rapid paske l piti)
            // Nou mete sa nan cache "offline-audio" a tou
            if (coverUrl) {
                const cache = await caches.open("offline-audio");
                const coverResponse = await fetch(coverUrl, { mode: 'no-cors' }); // no-cors si foto a soti sou yon lòt domain
                if (coverResponse.ok || coverResponse.type === 'opaque') {
                    await cache.put(coverUrl, coverResponse);
                }
            }

            // 2. Telechaje Audio a (ak progress)
            const response = await fetch(audioUrl, { signal });
            if (!response.ok) throw new Error("Network response was not ok");

            const contentLength = response.headers.get('content-length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;
            let loaded = 0;

            const reader = response.body?.getReader();
            if (!reader) throw new Error("ReadableStream not supported");

            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                loaded += value.length;

                if (total > 0) {
                    const progress = Math.round((loaded / total) * 100);
                    setActiveDownloads(prev => ({
                        ...prev,
                        [trackId]: { ...prev[trackId], progress }
                    }));
                }
            }

            const blob = new Blob(chunks as unknown as BlobPart[], { type: 'audio/mpeg' });
            const cache = await caches.open("offline-audio");

            // 3. Sove Audio a nan Cache la
            await cache.put(audioUrl, new Response(blob));

            toast.success(`${title} sove offline!`);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                toast.error(`Telechajman ${title} anile.`);
            } else {
                console.error("Download error:", error);
                toast.error("Echèk nan telechajman an.");
            }
        } finally {
            setActiveDownloads(prev => {
                const newState = { ...prev };
                delete newState[trackId];
                return newState;
            });
        }
    };

    const cancelDownload = (trackId: string) => {
        const download = activeDownloads[trackId];
        if (download) {
            download.controller.abort(); 
        }
    };

    return (
        <DownloadContext.Provider value={{ activeDownloads, downloadTrack, cancelDownload, isOffline }}>
            {children}
        </DownloadContext.Provider>
    );
};

// Hook pou itilize Context la fasil
export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) throw new Error("useDownload dwe itilize anndan DownloadProvider");
    return context;
};