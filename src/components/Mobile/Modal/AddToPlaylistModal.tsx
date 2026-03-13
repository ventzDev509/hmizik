import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { usePlaylists } from '../../../context/PlaylistContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AddToPlaylistModalProps {
    trackId: string;
    onClose: () => void;
}

const LetterCover = ({ name }: { name: string }) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : 'H';
    return (
        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-800 flex items-center justify-center">
            <span className="text-2xl font-black text-white italic drop-shadow-md">{firstLetter}</span>
        </div>
    );
};

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ trackId, onClose }) => {
    const { playlists, addTrackToPlaylist } = usePlaylists();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAdd = async (playlistId: string) => {
        setLoadingId(playlistId);
        try {
            const success = await addTrackToPlaylist(playlistId, trackId);
            if (success) {
                setTimeout(onClose, 400);
            }
        } catch (error) {
            console.error("Erreur nan ajoute:", error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className="bg-[#121212] w-full max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] p-8 relative z-10 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
                <div className="w-14 h-1.5 bg-white/10 rounded-full mx-auto mb-8 sm:hidden" />

                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-center text-white">
                    Ajoute nan <span className="text-orange-500">H-Playlist</span>
                </h3>

                <div className="max-h-[50vh] overflow-y-auto space-y-3 no-scrollbar px-1">
                    {playlists.map((pl: any) => {
                        const trackCount = pl.tracks?.length || pl._count?.tracks || 0;

                        return (
                            <motion.div
                                key={pl.id}
                                whileTap={loadingId ? {} : { scale: 0.96 }}
                                onClick={() => !loadingId && handleAdd(pl.id)}
                                className={`flex items-center gap-4 p-3 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.02] hover:bg-white/[0.07] hover:border-white/10 transition-all group ${
                                    loadingId === pl.id ? 'opacity-70 cursor-wait' : 'cursor-pointer'
                                }`}
                            >
                                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900">
                                    <LetterCover name={pl.name} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-sm text-white truncate uppercase italic">{pl.name}</h4>
                                    <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">
                                        {trackCount} {trackCount <= 1 ? 'Mizik' : 'Mizik'} • H-MIZIK
                                    </p>
                                </div>

                                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all">
                                    <AnimatePresence mode="wait">
                                        {loadingId === pl.id ? (
                                            <motion.div
                                                key="loader"
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            >
                                                <Loader2 size={18} />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="plus">
                                                <Plus size={18} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* RANPLASE BOUTON PA DIV */}
                <div
                    onClick={() => !loadingId && onClose()}
                    className={`w-full mt-8 py-5 rounded-2xl font-black uppercase text-[10px] text-center tracking-[0.3em] text-zinc-500 hover:text-white transition-all cursor-pointer select-none ${
                        loadingId ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'
                    }`}
                >
                    Anile
                </div>
            </motion.div>
        </div>
    );
};

export default AddToPlaylistModal;