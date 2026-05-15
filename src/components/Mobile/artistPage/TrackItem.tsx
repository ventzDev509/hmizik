import React from 'react';
import { Play, Pause, Heart, MoreVertical, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Equalizer from '../../buffer/Equalizer';
import DownloadButton from '../DownloadButton/DownloadButton';


interface TrackItemProps {
    track: any;
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    isLiked?: boolean;
    userPlaylists?: any[];
    onOpenPlaylistSelection?: () => void;
    onPlay?: () => void;
    onToggleLike: () => void;
    onOpenMenu: (e: React.MouseEvent) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
    track, index, isActive, isPlaying, isBuffering, isLiked, onPlay, onToggleLike, onOpenMenu,
}) => {
    return (
        <div
            className={`flex items-center gap-4 p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10' : 'active:bg-white/5'
                }`}
        >
            {}
            <div className="text-xs text-zinc-600 w-5 flex justify-center font-black">
                {isActive && isBuffering ? (
                    <Loader2 size={14} className="text-orange-500 animate-spin" />
                ) : isActive && isPlaying ? (
                    <Equalizer />
                ) : (
                    <span className={isActive ? "text-orange-500" : ""}>{index + 1}</span>
                )}
            </div>

            {}
            <div className="relative w-14 h-14 flex-shrink-0 cursor-pointer group" onClick={onPlay}>
                <img
                    crossOrigin="anonymous"
                    src={track.coverUrl}
                    className={`w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-500 ${isActive ? 'scale-105' : ''}`}
                    alt={track.title}
                />
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                        {isPlaying ? (
                            <Pause size={20} className="text-white fill-white" />
                        ) : (
                            <Play size={20} className="text-white fill-white ml-1" />
                        )}
                    </div>
                )}
            </div>

            {}
            <div className="flex-1 overflow-hidden cursor-pointer" onClick={onPlay}>
                <h4 className={`text-sm font-black truncate uppercase tracking-tight ${isActive ? 'text-orange-500' : 'text-white'}`}>
                    {track.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                        {track.playCount || 0} plays
                    </span>
                    {track.genre && (
                        <>
                            <span className="text-zinc-700 text-[10px]">•</span>
                            <span className="text-[9px] text-zinc-400 font-bold uppercase">{track.genre}</span>
                        </>
                    )}
                </div>
            </div>

            {}
            <div className="flex items-center gap-3">
                {}
                <DownloadButton
                    trackId={track.id}
                    audioUrl={track.audioUrl}
                    coverUrl={track.coverUrl}
                    title={track.title}
                />

                {}
                <motion.div whileTap={{ scale: 0.8 }}>
                    <Heart
                        onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
                        size={18}
                        className={isLiked ? 'fill-orange-500 text-orange-500' : 'text-zinc-500'}
                    />
                </motion.div>

                {}
                <div
                    onClick={(e) => { e.stopPropagation(); onOpenMenu(e); }}
                    className="p-1 hover:bg-white/10 rounded-full transition cursor-pointer"
                >
                    <MoreVertical size={20} className="text-zinc-500" />
                </div>
            </div>
        </div>
    );
};

export default React.memo(TrackItem);