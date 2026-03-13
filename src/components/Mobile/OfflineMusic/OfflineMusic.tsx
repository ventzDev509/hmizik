import { useState, useEffect } from 'react';
import { useAudio } from '../../../provider/PlayerContext';
import { useOfflineTracks } from '../hooks/useOfflineTracks';
import { Play, WifiOff, Music, Trash2 } from 'lucide-react';
import BottomMPlayerMobile from '../menu/BottomPlayerMobile';
import toast from 'react-hot-toast';
interface OfflineMusicProps {
    isRedirected?: boolean;
}
// --- TI KONPONAN POU MONTRÉ IMAJ KI NAN KACH LA ---
const OfflineImage = ({ url, fallback }: { url: string; fallback: any }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let objectUrl: string | null = null;
        const loadImageFromCache = async () => {
            if (!url) {
                setLoading(false);
                return;
            }
            try {
                const cache = await caches.open('music-cache');
                const response = await cache.match(url);
                if (response) {
                    const blob = await response.blob();
                    objectUrl = URL.createObjectURL(blob);
                    setImageSrc(objectUrl);
                }
            } catch (error) {
                console.error("Erè imaj kach:", error);
            } finally {
                setLoading(false);
            }
        };
        loadImageFromCache();
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [url]);

    if (loading) return <div className="animate-pulse bg-zinc-800 w-full h-full" />;
    if (!imageSrc) return fallback;
    return <img src={imageSrc} alt="" className="w-full h-full object-cover" />;
};

// --- PAJ PRINCIPAL LA ---
const OfflineMusic = ({ isRedirected = false }: OfflineMusicProps) => {
    const allCachedUrls = useOfflineTracks();
    const { playSong } = useAudio();

    const musicTracks = allCachedUrls.filter(url => url.includes('/tracks/'));
    const offlineData = JSON.parse(localStorage.getItem('offline_metadata') || '{}');

    const handleDelete = async (audioUrl: string) => {
        if (window.confirm("Èske ou vle retire mizik sa a?")) {
            try {
                const cache = await caches.open('music-cache');
                const metadata = offlineData[audioUrl];
                await cache.delete(audioUrl);
                if (metadata?.coverUrl) await cache.delete(metadata.coverUrl);
                const newMetadata = { ...offlineData };
                delete newMetadata[audioUrl];
                localStorage.setItem('offline_metadata', JSON.stringify(newMetadata));
                toast.success("Mizik la efase");
                window.location.reload();
            } catch (error) {
                toast.error("Erè lè n ap efase");
            }
        }
    };

    return (
        /* 1. Nou chanje 'fixed inset-0' pou 'min-h-screen'. 
           Sa ap pèmèt Fullscreen Player a (ki gen z-50 oswa plis) kouvri paj la nòmalman.
        */
        <div className="min-h-screen bg-black text-white">
            {isRedirected && (
                <div className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl mb-6">
                    <p className="text-orange-400 font-bold text-sm">Mòd Offline</p>
                    <p className="text-orange-200/70 text-xs">Ou ka sèlman koute mizik ou te sove yo.</p>
                </div>
            )}
            <div className="p-5 pb-44">

                <header className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                       {isRedirected && <WifiOff size={24} className="text-white" /> } 
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold truncate">Bibliyotèk Offline</h1>
                        <p className="text-xs text-zinc-500">{musicTracks.length} mizik ki sove</p>
                    </div>
                </header>

                {musicTracks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 opacity-30 text-center">
                        <Music size={60} className="mb-4" />
                        <p>Pa gen mizik offline ankò.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 w-full">
                        {musicTracks.map((url, index) => {
                            const metadata = offlineData[url] || {};
                            const trackTitle = metadata.trackTitle || "Mizik san non";
                            const coverUrl = metadata.coverUrl || "";

                            return (
                                <div
                                    key={index}
                                    className="flex items-center w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl gap-3 overflow-hidden"
                                >
                                    <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                        <OfflineImage
                                            url={coverUrl}
                                            fallback={<Music className="text-zinc-600 m-auto mt-3" size={20} />}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-zinc-100 truncate text-left">
                                            {trackTitle}
                                        </h4>
                                        <p className="text-[10px] text-green-500 font-medium uppercase mt-0.5 text-left">
                                            Offline
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleDelete(url)}
                                            className="p-2 text-zinc-500 active:text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <button
                                            className="w-9 h-9 bg-orange-500 text-black rounded-full flex items-center justify-center active:scale-90"
                                            onClick={() => {
                                                const songObj = {
                                                    id: `off-${index}`,
                                                    title: trackTitle,
                                                    artist: "Atis Offline",
                                                    coverUrl: coverUrl,
                                                    audioUrl: url,
                                                };
                                                playSong(songObj, []);
                                            }}
                                        >
                                            <Play size={18} fill="currentColor" className="ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 2. Player a bezwen yon z-index trè wo pou Fullscreen li ka kouvri tout bagay.
               Si 'BottomMPlayerMobile' la gen pwòp z-index li, nou asire n li pa bloke.
            */}
            <div className="fixed bottom-0 left-0 w-full z-[100]">
                <BottomMPlayerMobile />
            </div>
        </div>
    );
};

export default OfflineMusic;