import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MoreVertical, Play, Pause } from 'lucide-react';
import DownloadButton from '../../DownloadButton/DownloadButton';

interface PlaylistControlsProps {
    track: any;
    isScrolled: boolean;
    isLiked: boolean;
    isPlaying: boolean;
    onToggleLike: () => void;
    onPlayToggle: () => void;
    onOpenMenu: (e: React.MouseEvent) => void;
}

const PlaylistControls: React.FC<PlaylistControlsProps> = ({
    track, isScrolled, isLiked, isPlaying, onToggleLike, onPlayToggle, onOpenMenu
}) => {
    return (
        <div className={`sticky top-16 z-40 flex justify-between items-center px-6 py-4 transition-colors duration-300 ${isScrolled ? 'bg-[#121212]' : 'bg-transparent'}`}>
            <div className="flex items-center gap-6 text-zinc-400">
                <motion.div whileTap={{ scale: 0.8 }} onClick={onToggleLike} className="cursor-pointer p-1">
                    <Heart size={28} className={`transition-all duration-300 ${isLiked ? 'fill-orange-500 text-orange-500' : 'hover:text-white'}`} />
                </motion.div>

                <DownloadButton 
                    trackId={track.id}
                    audioUrl={track.audioUrl}
                    coverUrl={track.coverUrl}
                    title={track.title}
                />

                <MoreVertical size={24} className="hover:text-white transition cursor-pointer" onClick={onOpenMenu} />
            </div>

            <div onClick={onPlayToggle} className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer shadow-orange-500/20">
                {isPlaying ? <Pause size={28} className="fill-black text-black" /> : <Play size={28} className="fill-black text-black ml-1" />}
            </div>
        </div>
    );
};

export default PlaylistControls;