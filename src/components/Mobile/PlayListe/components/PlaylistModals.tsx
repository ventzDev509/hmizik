import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListPlus, PlusSquare, Loader2 } from 'lucide-react';
import AddToPlaylistModal from '../../Modal/AddToPlaylistModal';

interface PlaylistModalsProps {
    showAction: boolean;
    setShowAction: (val: boolean) => void;
    showPlaylist: boolean;
    setShowPlaylist: (val: boolean) => void;
    song: any;
    isAdding: boolean;
    onAddToQueue: () => void;
    
    userPlaylists?: any[]; 
    onOpenPlaylistSelection?: () => void;
}

const PlaylistModals: React.FC<PlaylistModalsProps> = ({
    showAction, 
    setShowAction, 
    showPlaylist, 
    setShowPlaylist, 
    song, 
    isAdding, 
    onAddToQueue,
    onOpenPlaylistSelection 
}) => {
    if (!song) return null;

    
    const handlePlaylistClick = () => {
        if (onOpenPlaylistSelection) {
            
            onOpenPlaylistSelection();
        } else {
            
            setShowAction(false); 
            setTimeout(() => setShowPlaylist(true), 300);
        }
    };

    return (
        <AnimatePresence>
            {showAction && (
                <div className="fixed inset-0 z-[200] flex items-end justify-center">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => !isAdding && setShowAction(false)} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                    />
                    <motion.div 
                        initial={{ y: "100%" }} 
                        animate={{ y: 0 }} 
                        exit={{ y: "100%" }} 
                        transition={{ type: "spring", damping: 25, stiffness: 300 }} 
                        className="relative w-full bg-[#1c1c1e] rounded-t-[32px] p-6 pb-12 z-[210] border-t border-white/5"
                    >
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
                        
                        <div className="flex items-center gap-4 mb-8 text-left">
                            <img src={song.coverUrl} className="w-16 h-16 rounded-xl object-cover shadow-lg" alt="" />
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-white text-xl font-black truncate italic uppercase tracking-tighter">
                                    {song.title}
                                </h3>
                                <p className="text-zinc-400 font-bold truncate uppercase text-xs">
                                    {typeof song.artist === 'string' ? song.artist : (song.artist?.username || "Artiste")}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={onAddToQueue} 
                                disabled={isAdding} 
                                className="w-full flex items-center gap-4 p-5 bg-white/5 rounded-2xl text-white active:scale-95 transition"
                            >
                                {isAdding ? <Loader2 size={22} className="text-orange-500 animate-spin" /> : <ListPlus size={22} className="text-orange-500" />}
                                <span className="font-black text-lg italic uppercase">
                                    {isAdding ? "Ap ajoute..." : "Ajoute nan keu"}
                                </span>
                            </button>
                            
                            <button 
                                onClick={handlePlaylistClick} 
                                className="w-full flex items-center gap-4 p-5 bg-white/5 rounded-2xl text-white active:scale-95 transition text-left"
                            >
                                <PlusSquare size={22} className="text-orange-500" />
                                <span className="font-black text-lg italic uppercase text-zinc-200">Ajoute nan Playlist</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {}
            {showPlaylist && <AddToPlaylistModal trackId={song.id} onClose={() => setShowPlaylist(false)} />}
        </AnimatePresence>
    );
};

export default PlaylistModals;