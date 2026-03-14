import { useState, useEffect } from 'react';
import { useAudio } from '../../../provider/PlayerContext';
import { useOfflineTracks } from '../hooks/useOfflineTracks';
import { Play, WifiOff, Music, MoreHorizontal, Download, ChevronLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BottomMenu from '../menu/BottomMenu';
import Equalizer from '../../buffer/Equalizer';

// --- KOMPONAN POU IMAJ KI NAN KACH ---
export const OfflineImage = ({ src, className, ...props }: any) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className} bg-zinc-900`}>
      <img
        src={src}
        {...props}
        crossOrigin="anonymous" // OBLIGATWA pou Supabase + Cache
        loading="lazy"
        className={`
          ${className} 
          transition-opacity duration-500
          ${loaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoad={() => setLoaded(true)}
      />
      
      {/* Ti animasyon shimmer la pandan l ap chaje */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      )}
    </div>
  );
};

// --- PAJ OFFLINE PRENSIPAL LA ---
const OfflineMusic = ({ isRedirected = false }: { isRedirected?: boolean }) => {
    const allCachedUrls = useOfflineTracks();
    const { playSong, currentSong } = useAudio();
    const navigate = useNavigate();

    // Filtre pou n pran sèlman URL mizik yo
    const musicTracks = allCachedUrls.filter(url => url.includes('/tracks/'));
    const offlineData = JSON.parse(localStorage.getItem('offline_metadata') || '{}');

    // Chanje koulè "Status Bar" telefòn nan
    useEffect(() => {
        const themeColor = document.querySelector('meta[name="theme-color"]');
        const originalColor = themeColor ? themeColor.getAttribute('content') : '#121212';
        
        if (themeColor) themeColor.setAttribute('content', '#4a1d05');
        return () => {
            if (themeColor) themeColor.setAttribute('content', originalColor || '#121212');
        };
    }, []);

    // --- LOJIK POU JWE AK TOUT QUEUE A (POU NEXT MACHE) ---
    const handlePlayTrack = (index: number) => {
        if (musicTracks.length === 0) return;

        // 1. Prepare "Queue" la (Tout lis la)
        const fullQueue = musicTracks.map((url, i) => {
            const meta = offlineData[url] || {};
            return {
                id: `off-${i}`,
                title: meta.trackTitle || "Mizik san non",
                artist: "H-Mizik Offline",
                coverUrl: meta.coverUrl,
                audioUrl: url
            };
        });

        // 2. Chwazi chante ki klike a
        const selectedSong = fullQueue[index];

        // 3. Jwe li epi pase tout queue a bay PlayerContext la
        // Si PlayerContext ou a byen fèt, l ap jwe queue a nan lòd
        playSong(selectedSong, fullQueue);
    };

    const handleDelete = async (audioUrl: string) => {
        if (window.confirm("Retire mizik sa a nan telefòn ou?")) {
            try {
                const cache = await caches.open('music-cache');
                await cache.delete(audioUrl);
                
                const newMetadata = { ...offlineData };
                delete newMetadata[audioUrl];
                localStorage.setItem('offline_metadata', JSON.stringify(newMetadata));
                
                toast.success("Mizik retire");
                // Nou fòse yon reload pou lis la netwaye
                window.location.reload();
            } catch (e) {
                toast.error("Error lè w ap retire mizik la");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#4a1d05] via-[#1a0b02] to-[#121212] text-zinc-100 font-sans relative">
            
            {/* Header / Nav */}
            <div className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between backdrop-blur-xl bg-black/10">
                <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-black/20 rounded-full active:scale-90 transition-all border border-white/5">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-orange-300/60 font-bold">H-Mizik</span>
                    <span className="text-sm font-black text-white">BIBLIYOTÈK</span>
                </div>
                <div className="w-10 h-10 flex items-center justify-center">
                    {isRedirected && <WifiOff size={18} className="text-orange-500" />}
                </div>
            </div>

            <div className="px-5 pt-10">
                {/* Visual Header */}
                <div className="relative mx-auto w-44 h-44 flex items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-orange-700 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 z-10">
                        <Download size={70} className="text-white animate-bounce-slow" />
                    </div>
                </div>

                <div className="text-center mt-8 mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter">Mizik Offline</h1>
                    <p className="text-orange-200/50 font-medium text-sm mt-1">
                        {musicTracks.length} chante ki sove sou telefòn lan
                    </p>
                    
                    <button 
                        onClick={() => handlePlayTrack(0)}
                        className="mt-6 px-10 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold flex items-center gap-3 mx-auto shadow-2xl transition-all active:scale-95"
                    >
                        <Play size={20} fill="white" />
                        Jwe Tout
                    </button>
                </div>

                {/* Song List */}
                <div className="space-y-2 pb-44 relative z-10">
                    {musicTracks.length === 0 ? (
                        <div className="text-center py-20 opacity-30 italic bg-black/20 rounded-3xl border border-dashed border-white/5">
                            Ou pa gen mizik offline ankò.
                        </div>
                    ) : (
                        musicTracks.map((url, index) => {
                            const metadata = offlineData[url] || {};
                            const isPlaying = currentSong?.audioUrl === url;

                            return (
                                <div 
                                    key={index}
                                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all group border ${
                                        isPlaying ? 'bg-orange-500/10 border-orange-500/20' : 'bg-black/20 border-white/5'
                                    } backdrop-blur-sm active:bg-white/10`}
                                    onClick={() => handlePlayTrack(index)}
                                >
                                    <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800 shadow-md border border-white/5">
                                        <OfflineImage 
                                            url={metadata.coverUrl} 
                                            fallback={<Music size={18} className="m-auto mt-4 text-zinc-700" />} 
                                        />
                                        {isPlaying && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Equalizer />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-[15px] font-bold truncate ${isPlaying ? 'text-orange-400' : 'text-white'}`}>
                                            {metadata.trackTitle || "Mizik san non"}
                                        </h4>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                                            {isPlaying ? 'Ap jwe kounye a' : 'Sove nan kach'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(url); }}
                                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors active:scale-90"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="p-2 text-zinc-600">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Navigasyon anba */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent pt-12">
                <BottomMenu />
            </div>

            {/* Animasyon CSS */}
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default OfflineMusic;