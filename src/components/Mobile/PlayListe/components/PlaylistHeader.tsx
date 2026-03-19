import React from 'react';
import { motion } from 'framer-motion';

interface PlaylistHeaderProps {
    track: any;
    imgOpacity: any;
    imgScale: any;
    imgRef: React.RefObject<HTMLImageElement | null>;
}

const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ track, imgOpacity, imgScale, imgRef }) => {
    return (
        <motion.div style={{ opacity: imgOpacity, scale: imgScale }} className="flex flex-col items-center px-6 pb-6 pt-6">
            <div className="w-52 h-52 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <img 
                    ref={imgRef} 
                    src={track.coverUrl} 
                    alt={track.title} 
                    className="w-full h-full object-cover rounded-sm" 
                />
            </div>
            <div className="w-full">
                <h3 className="text-2xl font-black mb-2 tracking-tight line-clamp-2 uppercase italic">
                    {track.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">H</div>
                    <span className="text-xs font-bold text-white/80 uppercase">
                        {typeof track.artist === 'string' ? track.artist : track.artist?.username} • {track.genre}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default PlaylistHeader;