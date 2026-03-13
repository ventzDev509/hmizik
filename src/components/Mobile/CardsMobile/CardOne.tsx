import { useNavigate } from "react-router-dom";
import { useTracks } from "../../../context/TrackContext"; 
import { Play, Loader2, Pause } from "lucide-react"; 
import { useEffect } from "react";
import { useAudio } from "../../../provider/PlayerContext"; 
import { motion, AnimatePresence } from "framer-motion"; // Ajoute sa yo

function CardOne() {
    const navigate = useNavigate();
    const { tracks, loading, fetchTracks } = useTracks();
    const { currentSong, isPlaying, isBuffering, togglePlay } = useAudio();

    useEffect(() => {
        fetchTracks(1);
    }, []);

    if (loading && tracks.length === 0) return null;

    return (
        <section className="mt-8">
            <h2 className="text-xl font-bold mb-4 px-1 text-white/90">Mizik ki fèk ajoute</h2>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide px-1">
                {tracks.map((track) => {
                    const isThisTrackActive = currentSong?.id === track.id;
                    const isThisTrackBuffering = isThisTrackActive && isBuffering;

                    return (
                        <div
                            key={track.id}
                            onClick={() => navigate(`/song?id=${track.id}`)}
                            className="min-w-[155px] snap-start group cursor-pointer"
                        >
                            <div className="relative w-full aspect-square mb-3">
                                <motion.img
                                    animate={{ scale: isThisTrackActive ? 0.95 : 1 }}
                                    src={track.coverUrl || "https://picsum.photos/seed/music/300/300"}
                                    alt={track.title}
                                    className={`w-full h-full object-cover rounded-md shadow-[0_8px_16_rgba(0,0,0,0.4)] transition-all duration-300 ${
                                        isThisTrackActive ? "brightness-75  outline-orange-600" : "group-hover:scale-105"
                                    }`}
                                />

                                {/* OVERLAY ANIMATION */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {isThisTrackBuffering ? (
                                            <motion.div
                                                key="loader"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <Loader2 size={30} className="text-orange-600 animate-spin" />
                                            </motion.div>
                                        ) : isThisTrackActive ? (
                                            <motion.div
                                                key="active-controls"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ 
                                                    scale: 1, 
                                                    opacity: 1,
                                                    boxShadow: isPlaying ? "0px 0px 15px rgba(234, 88, 12, 0.5)" : "0px 0px 0px rgba(0,0,0,0)"
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePlay();
                                                }}
                                                className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                                            >
                                                {isPlaying ? (
                                                    <Pause size={20} className="fill-white text-white" />
                                                ) : (
                                                    <Play size={20} className="fill-white text-white ml-1" />
                                                )}
                                            </motion.div>
                                        ) : (
                                            /* Ikon Play ki parèt sèlman lè w hover sou lòt kat yo */
                                            <motion.div 
                                                className="opacity-0 group-hover:opacity-100 hidden md:flex w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <Play size={20} className="fill-white text-white ml-1" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <h3 className={`text-[13px] font-bold line-clamp-1 transition-colors ${
                                isThisTrackActive ? "text-orange-500" : "text-white/90"
                            }`}>
                                {track.artist?.username || "Atis Enkoni"}
                            </h3>

                            <p className="text-[11px] text-[#b3b3b3] mt-1 leading-tight line-clamp-1 uppercase font-medium tracking-tighter">
                                {track.title}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default CardOne;