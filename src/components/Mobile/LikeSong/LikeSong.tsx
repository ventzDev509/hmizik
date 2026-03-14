import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Play, Pause, Loader2, Music, Shuffle } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useTracks } from '../../../context/TrackContext';
import { useLikes } from '../../../context/LikeContext';
import { useAudio } from '../../../provider/PlayerContext';
import BottomMenu from '../menu/BottomMenu';

const LikedSongsPage = () => {
    const navigate = useNavigate();
    const { tracks } = useTracks();
    const { likedTrackIds, toggleLike } = useLikes();
    const { playSong, isPlaying, currentSong, togglePlay, isBuffering } = useAudio();

    // 1. Filtre mizik ki like yo
    const likedTracks = useMemo(() => {
        return tracks.filter(track => likedTrackIds.includes(track.id));
    }, [tracks, likedTrackIds]);

    const isThisListActive = useMemo(() => {
        return likedTracks.some(t => t.id === currentSong?.id);
    }, [likedTracks, currentSong]);

    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 150], [1, 0]);
    const navBgOpacity = useTransform(scrollY, [100, 200], [0, 1]);
    const titleScale = useTransform(scrollY, [0, 150], [1, 0.8]);

    const triggerVibration = (pattern: number = 10) => {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate(pattern);
        }
    };

    // Fonksyon pou Shuffle
    const handleShufflePlay = () => {
        if (likedTracks.length > 0) {
            const shuffled = [...likedTracks].sort(() => Math.random() - 0.5);
            playSong(shuffled[0], shuffled);
            triggerVibration(30);
        }
    };

    return (
        <div className="bg-[#121212] min-h-screen text-white relative pb-32 overflow-x-hidden">

            {/* TOP NAVIGATION */}
            <motion.nav
                style={{ opacity: navBgOpacity }}
                className="fixed top-0 left-0 right-0 h-16 bg-[#121212]/90 backdrop-blur-xl border-b border-white/5 z-[100] flex items-center px-4 shadow-2xl pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center">
                    <ChevronLeft size={28} onClick={() => navigate(-1)} className="cursor-pointer active:scale-75 transition" />
                    <h2 className="ml-4 font-black text-lg uppercase italic tracking-tighter">Mizik mwen renmen</h2>
                </div>
            </motion.nav>

            <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-orange-600/20 via-orange-900/5 to-transparent z-0 pointer-events-none" />

            <main className="relative z-10 pt-10 px-6">

                {/* HEADER */}
                <motion.header
                    style={{ opacity: headerOpacity, scale: titleScale }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="relative group mb-6">
                        <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                        <div className="w-48 h-48 relative bg-gradient-to-br from-orange-500 to-orange-800 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/10 overflow-hidden">
                            <Heart size={90} className="fill-white text-white drop-shadow-2xl" />
                        </div>
                    </div>

                    <div className="text-left w-full">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2"
                        >
                            Mizik mwen <br /> <span className="text-orange-500">renmen</span>
                        </motion.h1>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] opacity-80">
                            {likedTracks.length} Mizik • H-MIZIK PREMIUM
                        </p>
                    </div>
                </motion.header>

                {/* PLAY & SHUFFLE CONTROLS */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        {/* Bouton Shuffle */}
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            onClick={handleShufflePlay}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 active:bg-orange-500/20 group"
                        >
                            <Shuffle size={20} className="text-zinc-400 group-active:text-orange-500 transition-colors" />
                        </motion.div>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                            <Music size={14} className="text-orange-500" />
                        </div>
                    </div>

                    {/* Gwo Bouton Play/Pause */}
                    <motion.button
                        style={{ border: "none", outline: "none", backgroundColor: "#fff" ,borderRadius:"100%",color:"black"}}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            if (isThisListActive) {
                                togglePlay();
                            } else if (likedTracks.length > 0) {
                                playSong(likedTracks[0], likedTracks);
                            }
                            triggerVibration(20);
                        }}
                        className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
                    >
                        <AnimatePresence mode="wait">
                            {isBuffering && isThisListActive ? (
                                <motion.div key="buffer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <Loader2 size={32} className="text-black animate-spin" />
                                </motion.div>
                            ) : isPlaying && isThisListActive ? (
                                <motion.div key="pause" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <Pause size={32} className="fill-black text-black" />
                                </motion.div>
                            ) : (
                                <motion.div key="play" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                    <Play size={32} className="fill-black text-black ml-1" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* LIST MIZIK YO */}
                <div className="space-y-3 relative">
                    {likedTracks.length === 0 ? (
                        <div className="py-20 flex flex-col items-center text-zinc-600 italic">
                            <Heart size={40} className="mb-4 opacity-10" />
                            <p className="text-sm tracking-wide">Poko gen mizik isit la...</p>
                        </div>
                    ) : (
                        likedTracks.map((track, index) => {
                            const isThisTrackActive = currentSong?.id === track.id;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    key={track.id}
                                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${isThisTrackActive
                                            ? 'bg-orange-500/10 border border-orange-500/20 shadow-lg'
                                            : 'hover:bg-white/5 border border-transparent active:bg-white/10'
                                        }`}
                                >
                                    <div
                                        className="relative w-14 h-14 flex-shrink-0 cursor-pointer overflow-hidden group/item"
                                        onClick={() => isThisTrackActive ? togglePlay() : playSong(track, likedTracks)}
                                    >
                                        <img crossOrigin="anonymous" src={track.coverUrl} className="w-full h-full object-cover rounded-xl shadow-md transition duration-500 group-hover/item:scale-110" alt={track.title} />

                                        {isThisTrackActive && (
                                            <div className="absolute inset-0 bg-orange-950/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                                                {isBuffering ? (
                                                    <Loader2 size={20} className="animate-spin text-white" />
                                                ) : isPlaying ? (
                                                    <Pause size={18} className="text-white fill-white" />
                                                ) : (
                                                    <Play size={18} className="text-white fill-white" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-hidden" onClick={() => isThisTrackActive ? togglePlay() : playSong(track, likedTracks)}>
                                        <h4 className={`text-[15px] font-bold truncate leading-tight ${isThisTrackActive ? 'text-orange-500' : 'text-white'}`}>
                                            {track.title}
                                        </h4>
                                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tighter truncate mt-1">
                                            {typeof track.artist === 'string' ? track.artist : track.artist?.username}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <motion.button
                                            style={{ backgroundColor: "transparent" }}
                                            whileTap={{ scale: 1.6 }}
                                            onClick={() => {
                                                toggleLike(track.id);
                                                triggerVibration(15);
                                            }}
                                            className="p-2 cursor-pointer outline-none border-none bg-transparent"
                                        >
                                            <Heart size={20} className="fill-orange-500 text-orange-500 drop-shadow-[0_0_10px_rgba(234,88,12,0.4)]" />
                                        </motion.button>


                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </main>

            <BottomMenu />
        </div>
    );
};

export default LikedSongsPage;