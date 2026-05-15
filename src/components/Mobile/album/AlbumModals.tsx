import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListPlus, PlusSquare } from 'lucide-react';
import AddToPlaylistModal from '../Modal/AddToPlaylistModal';

interface AlbumModalsProps {
    showActionModal: boolean;
    setShowActionModal: (val: boolean) => void;
    showPlaylistModal: boolean;
    setShowPlaylistModal: (val: boolean) => void;
    selectedTrack: any;
    albumTitle?: string;
    albumCover?: string;
    onAddToQueue: (track: any) => void;
    triggerVibration: (p: number) => void;
}

const AlbumModals: React.FC<AlbumModalsProps> = ({
    showActionModal, setShowActionModal,
    showPlaylistModal, setShowPlaylistModal,
    selectedTrack, albumTitle, albumCover,
    onAddToQueue, triggerVibration
}) => {
    if (!selectedTrack) return null;

    return (
        <AnimatePresence>
            {}
            {showActionModal && (
                <div className="fixed inset-0 z-[200] flex items-end justify-center">
                    {}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setShowActionModal(false)} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                    />
                    
                    {}
                    <motion.div 
                        initial={{ y: "100%" }} 
                        animate={{ y: 0 }} 
                        exit={{ y: "100%" }} 
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full bg-zinc-900 rounded-t-[40px] p-8 pb-14 z-[210]"
                    >
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />
                        
                        <div className="flex items-center gap-5 mb-10">
                            <img 
                                src={selectedTrack.coverUrl || albumCover} 
                                className="w-20 h-20 rounded-2xl object-cover shadow-2xl" 
                                alt="" 
                            />
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-white text-2xl font-black truncate italic uppercase">
                                    {selectedTrack.title}
                                </h3>
                                <p className="text-zinc-500 font-bold uppercase text-xs">
                                    Album: {albumTitle}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <button 
                                onClick={() => { 
                                    triggerVibration(20); 
                                    onAddToQueue(selectedTrack); 
                                    setShowActionModal(false); 
                                }} 
                                className="w-full flex items-center gap-4 p-5 bg-white/5 rounded-3xl text-white active:scale-95 transition-all"
                            >
                                <ListPlus size={22} className="text-orange-500" />
                                <span className="font-black uppercase italic text-sm">Ajoute nan keu</span>
                            </button>
                            
                            <button 
                                onClick={() => { 
                                    setShowActionModal(false); 
                                    setTimeout(() => setShowPlaylistModal(true), 200); 
                                }}
                                className="w-full flex items-center gap-4 p-5 bg-white/5 rounded-3xl text-white active:scale-95 transition-all"
                            >
                                <PlusSquare size={22} className="text-orange-500" />
                                <span className="font-black uppercase italic text-sm">Ajoute nan Playlist</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {}
            {showPlaylistModal && (
                <AddToPlaylistModal 
                    trackId={selectedTrack.id} 
                    onClose={() => setShowPlaylistModal(false)} 
                />
            )}
        </AnimatePresence>
    );
};

export default AlbumModals;