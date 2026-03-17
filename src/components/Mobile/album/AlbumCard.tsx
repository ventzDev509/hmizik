import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../../../provider/PlayerContext';

interface AlbumCardProps {
    album: {
        id: string;
        title: string;
        coverUrl: string;
        artist?: { username: string } | string;
        tracks?: any[];
        
    };
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
    const navigate = useNavigate();
    const { currentSong, isPlaying, togglePlay, playSong } = useAudio();

    const isThisAlbumActive = currentSong && album.tracks?.some(t => t.id === currentSong.id);

    const handlePlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isThisAlbumActive) {
            togglePlay();
        } else if (album.tracks && album.tracks.length > 0) {
            playSong(album.tracks[0], album.tracks);
        }
    };

    return (
        <div className="flex-shrink-0 w-[160px] snap-start p2">
            <motion.div
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -5 }} // Ti animasyon monte lè w pase sourit
                onClick={() => navigate(`/album?id=${album.id}`)}
                className={`group relative  rounded-md transition-all duration-300 cursor-pointer overflow-hidden ${
                    isThisAlbumActive 
                    ? "bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60 " 
                    : "bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60"
                } border`}
            >
                {/* IMAJ COVER LA */}
                <div className="relative  aspect-square mb-3 overflow-hidden rounded-md shadow-sm">
                    <img
                        src={album.coverUrl}
                        alt={album.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                            isThisAlbumActive ? "scale-110 brightness-50" : "group-hover:scale-110"
                        }`}
                    />

                    {/* BADGE KANTITE MIZIK (Ti detay ki fè l bèl) */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                        <p className="text-[8px] font-black text-white/90 uppercase italic">
                            {album.tracks?.length || 0} Tracks
                        </p>
                    </div>

                    {/* CONTROLS OVERLAY */}
                    <div className="absolute inset-0  flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isThisAlbumActive ? (
                                <motion.div
                                    key="active-btn"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={handlePlayClick}
                                    className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.6)] text-white"
                                >
                                    {isPlaying ? (
                                        <Pause size={22} fill="white" />
                                    ) : (
                                        <Play size={22} fill="white" className="ml-1" />
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                                >
                                    <div 
                                        onClick={handlePlayClick}
                                        className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-500 transition-colors"
                                    >
                                        <Play size={20} fill="white" className="ml-1" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ENFÒMASYON TÈKS */}
                <div className="space-y-1 px-3 pb-2">
                    <h3 className={`text-[14px] font-black truncate uppercase italic tracking-tighter leading-tight ${
                        isThisAlbumActive ? "text-orange-500" : "text-zinc-100"
                    }`}>
                        {album.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                         {/* {isPlaying  &&<div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />} */}
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">
                            {typeof album.artist === 'object' ? album.artist.username : (album.artist || 'Atis')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default AlbumCard;