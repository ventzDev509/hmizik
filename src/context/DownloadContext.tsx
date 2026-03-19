import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useOfflineDownload } from '../components/Mobile/hooks/useOfflineDownload';

interface DownloadTask {
    trackId: string;
    progress: number;
    title: string;
    abortController: AbortController;
}

interface DownloadContextType {
    activeDownloads: Record<string, DownloadTask>;
    startDownload: (song: any) => Promise<void>;
    cancelDownload: (trackId: string) => void;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeDownloads, setActiveDownloads] = useState<Record<string, DownloadTask>>({});
    const { downloadWithProgress } = useOfflineDownload();

    const startDownload = async (song: any) => {
        if (activeDownloads[song.id]) return;

        const controller = new AbortController();
        
        setActiveDownloads(prev => ({
            ...prev,
            [song.id]: { 
                trackId: song.id, 
                progress: 0, 
                title: song.title, 
                abortController: controller 
            }
        }));

        try {
            await downloadWithProgress(
                song.audioUrl,
                song.coverUrl,
                song.title,
                song.id,
                (p:any) => {
                    setActiveDownloads(prev => ({
                        ...prev,
                        [song.id]: { ...prev[song.id], progress: Math.round(p) }
                    }));
                }
                // Si useOfflineDownload ou a sipòte AbortSignal, pase controller.signal la isit la
            );

            toast.success(`${song.title} fini!`);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                toast.error("Telechajman anile");
            } else {
                toast.error("Erè telechajman");
            }
        } finally {
            setActiveDownloads(prev => {
                const newState = { ...prev };
                delete newState[song.id];
                return newState;
            });
        }
    };

    const cancelDownload = (trackId: string) => {
        const task = activeDownloads[trackId];
        if (task) {
            task.abortController.abort(); // Sa ap sispann request la
            setActiveDownloads(prev => {
                const newState = { ...prev };
                delete newState[trackId];
                return newState;
            });
        }
    };

    return (
        <DownloadContext.Provider value={{ activeDownloads, startDownload, cancelDownload }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownloads = () => {
    const context = useContext(DownloadContext);
    if (!context) throw new Error("useDownloads must be used within DownloadProvider");
    return context;
};