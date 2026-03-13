import React, { useEffect, useMemo } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import {
    ChevronDown, MoreHorizontal, Shuffle,
    SkipBack, Play, Pause, SkipForward,
    Repeat, Share2, ListMusic, Heart,
    Loader2,
} from 'lucide-react';
import { useImageColors } from "../../utils/GetColor";
import { useTracks } from '../../../context/TrackContext';
import { useAudio } from '../../../provider/PlayerContext';
import { useLikes } from '../../../context/LikeContext';
import QueueModal from '../Modal/QueueModal';

interface PlayerProps {
    onClose: () => void;
}

const PlayerPage: React.FC<PlayerProps> = ({ onClose }) => {
    const { tracks, fetchTracks } = useTracks();
    const { isLiked, toggleLike } = useLikes();
    const [isQueueOpen, setIsQueueOpen] = React.useState(false);
    const {
        currentSong: audioCurrentSong,
        isPlaying,
        isBuffering,
        togglePlay,
        progress,
        currentTime,
        duration,
        next,
        prev,
        isShuffle,
        toggleShuffle,
        repeatMode,
        toggleRepeat,
        seek,
    } = useAudio();

    const searchParams = new URLSearchParams(window.location.search);
    const songId = searchParams.get('id');

    useEffect(() => {
        if (tracks.length === 0) fetchTracks(1);
    }, []);

    const currentSong = useMemo(() => {
        return audioCurrentSong || tracks.find(t => t.id === songId);
    }, [tracks, songId, audioCurrentSong]);

    const liked = currentSong ? isLiked(currentSong.id) : false;
    const { bgColor, imgRef } = useImageColors(currentSong?.coverUrl || "");

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', bgColor || '#1e1e1e');
        return () => {
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#121212');
        };
    }, [bgColor]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100) onClose();
    };

    const triggerVibration = (pattern: number | number[] = 10) => {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate(pattern);
        }
    };

    if (!currentSong) {
        return (
            <div className="fixed inset-0 z-[1000] bg-[#121212] flex items-center justify-center">
                <Loader2 className="text-orange-600 animate-spin" size={40} />
            </div>
        );
    }

    const handleShare = async () => {
        if (!currentSong) return;
        const shareData = {
            title: currentSong.title,
            text: `Koute ${currentSong.title} pa ${typeof currentSong.artist === 'string' ? currentSong.artist : currentSong.artist?.username} sou H-MIZIK!`,
            url: `${window.location.origin}/player?id=${currentSong.id}`,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                triggerVibration(15);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Lyen an kopye nan clipboard ou!");
            }
        } catch (err) {
            console.error("Erè nan pataje:", err);
        }
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{
                y: 0,
                background: `linear-gradient(to bottom, ${bgColor || '#1e1e1e'} 0%, #121212 100%)`
            }}
            exit={{ y: "100%" }}
            transition={{
                y: { type: "spring", damping: 30, stiffness: 300 },
                background: { duration: 0.8, ease: "linear" }
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="fixed inset-0 z-[1000] flex flex-col touch-none"
        >
            <div className="w-full flex justify-center pt-3">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <header className="flex justify-between items-center px-6 pt-4">
                <div onClick={onClose} className="text-white active:scale-90 transition cursor-pointer p-2">
                    <ChevronDown size={30} />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 text-center">K ap jwe</span>
                    <span className="text-xs font-bold text-white uppercase italic tracking-tighter">H-MIZIK Player</span>
                </div>
                <div className="text-white active:scale-90 transition cursor-pointer p-2">
                    <MoreHorizontal size={24} />
                </div>
            </header>

            <div className="flex-[0.8] flex mt-5 items-center justify-center px-10">
                <motion.div
                    animate={{ scale: isPlaying ? 1 : 0.85 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full aspect-square relative shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                >
                    <img
                        ref={imgRef}
                        src={currentSong.coverUrl || "/default-cover.png"}
                        alt={currentSong.title}
                        className="w-full h-full object-cover rounded-lg pointer-events-none"
                    />
                </motion.div>
            </div>

            <div className="px-8 mt-10 flex justify-between items-center">
                <div className="flex flex-col gap-1 overflow-hidden w-[80%]">
                    <h2 className="text-2xl font-black text-white truncate uppercase italic leading-none tracking-tighter">
                        {currentSong.title}
                    </h2>
                    <p className="text-lg font-bold text-white/60 truncate italic">
                        {typeof currentSong.artist === 'string' ? currentSong.artist : currentSong.artist?.username}
                    </p>
                </div>

                <motion.div
                    whileTap={{ scale: 0.8 }}
                    onClick={() => {
                        toggleLike(currentSong.id);
                        triggerVibration(20);
                    }}
                    className="cursor-pointer p-2 relative z-10"
                >
                    <Heart
                        className={`w-8 h-8 transition-colors duration-300 ${liked
                            ? 'fill-orange-500 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]'
                            : 'text-white/60 hover:text-white'
                            }`}
                    />
                </motion.div>
            </div>

            <div className="px-8 mt-8 group">
                <div className="relative w-full h-1.5 flex items-center">
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        value={progress || 0}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            style={{ width: `${progress}%` }}
                            transition={{ type: "tween", ease: "linear" }}
                        />
                    </div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-black text-white/30 tracking-widest font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="px-8 mt-6 flex justify-between items-center mb-10">
                <Shuffle
                    size={22}
                    onClick={() => {
                        toggleShuffle();
                        triggerVibration(10);
                    }}
                    className={`transition-colors cursor-pointer ${isShuffle ? "text-orange-500" : "text-white/40"}`}
                />

                <SkipBack
                    size={35}
                    onClick={() => {
                        prev();
                        triggerVibration(15);
                    }}
                    className="fill-white text-white active:scale-75 transition cursor-pointer"
                />

                <div
                    onClick={() => {
                        togglePlay();
                        triggerVibration([10, 30, 10]);
                    }}
                    className="relative z-10 w-18 h-18 bg-white rounded-full flex items-center justify-center active:scale-90 transition shadow-xl cursor-pointer overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {isBuffering ? (
                            <motion.div key="loader">
                                <Loader2 size={35} className="text-black animate-spin" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={isPlaying ? "pause" : "play"}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isPlaying ? (
                                    <Pause size={35} className="text-black fill-black" />
                                ) : (
                                    <Play size={35} className="text-black fill-black ml-1" />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <SkipForward
                    size={35}
                    onClick={() => {
                        next();
                        triggerVibration(15);
                    }}
                    className="fill-white text-white active:scale-75 transition cursor-pointer"
                />

                <Repeat
                    size={22}
                    onClick={() => {
                        toggleRepeat();
                        triggerVibration(10);
                    }}
                    className={`transition-colors cursor-pointer ${repeatMode !== 'none' ? "text-orange-500" : "text-white/40"}`}
                />
            </div>

            <footer className="px-10 pb-10 mt-auto flex justify-between items-center">
                <Share2 onClick={handleShare}
                    size={20} className="text-white/40 hover:text-white transition cursor-pointer" />
                <ListMusic onClick={() => { setIsQueueOpen(true); triggerVibration(15); }} size={22} className="text-white/40 hover:text-white transition cursor-pointer" />
            </footer>

            <AnimatePresence>
                {isQueueOpen && (
                    <QueueModal
                        isOpen={isQueueOpen}
                        onClose={() => setIsQueueOpen(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PlayerPage;