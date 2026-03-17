import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Headphones, MoreVertical, Plus, Loader2 } from 'lucide-react';
import type { Album, Track } from '../../../types/Profile';

interface ProfileContentProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tracks: Track[];
    albums: Album[];
    tracksLoading: boolean;
    incrementPlay: (id: string) => void;
    setIsAlbumModalOpen: (open: boolean) => void;
    navigate: (path: string) => void;
}

export const ProfileContent = ({
    activeTab,
    setActiveTab,
    tracks,
    albums,
    tracksLoading,
    incrementPlay,
    setIsAlbumModalOpen,
    navigate
}: ProfileContentProps) => {

    // Fonksyon pou fòmate tan (segond an minit:segond)
    const formatDuration = (seconds: number | undefined | null) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mt-10">
            {/* TABS SELECTION */}
            <div className="sticky top-14 z-40 bg-[#121212] border-b flex border-white/5">
                {['uploads', 'playlists', 'likes'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] relative ${
                            activeTab === tab ? 'text-orange-600' : 'text-zinc-600'
                        }`}
                    >
                        {tab === 'uploads' ? 'Mizik' : tab === 'playlists' ? 'Album yo' : 'Favori'}
                        {activeTab === tab && (
                            <motion.div 
                                layoutId="activeTab" 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" 
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* LIST KONTNI */}
            <div className="py-8 pb-32">
                <AnimatePresence mode="wait">
                    {activeTab === 'uploads' ? (
                        <motion.div 
                            key="tracks" 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }} 
                            className="space-y-3"
                        >
                            {tracks.length > 0 ? (
                                tracks.map((track) => (
                                    <motion.div 
                                        key={track.id} 
                                        onClick={() => incrementPlay(track.id)} 
                                        className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer border border-white/[0.02]"
                                    >
                                        <div className="relative w-14 h-14 flex-shrink-0">
                                            <img 
                                                src={track.coverUrl || "/default-music.png"} 
                                                className="w-full h-full object-cover rounded-xl shadow-lg" 
                                                alt={track.title} 
                                            />
                                            <div className="absolute inset-0 bg-orange-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                <Play size={20} className="fill-white text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black truncate uppercase italic tracking-tight">{track.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[9px] text-orange-600 font-black uppercase tracking-widest">{track.genre}</span>
                                                <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase">
                                                    <Headphones size={10} /> {track.playCount?.toLocaleString() || 0}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-mono text-zinc-500">{formatDuration(track.duration)}</span>
                                            <button className="p-2 hover:bg-white/5 rounded-full">
                                                <MoreVertical size={16} className="text-zinc-500" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                    <Music size={40} />
                                    <p className="text-[10px] font-black mt-4 uppercase">Poko gen mizik</p>
                                </div>
                            )}
                            {tracksLoading && (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="text-orange-600 animate-spin" size={24} />
                                </div>
                            )}
                        </motion.div>
                    ) : activeTab === 'playlists' ? (
                        <motion.div 
                            key="albums" 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="grid grid-cols-2 gap-4"
                        >
                            {/* Bouton Kreye Album */}
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAlbumModalOpen(true)}
                                className="aspect-square bg-white/[0.03] rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-orange-600/30 transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center mb-3">
                                    <Plus size={24} className="text-orange-600" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Nouvo Album</p>
                            </motion.div>

                            {/* Lis Album yo */}
                            {albums?.map((album) => (
                                <motion.div
                                    key={album.id}
                                    onClick={() => navigate(`/album?id=${album.id}`)}
                                    className="flex flex-col gap-3 group cursor-pointer"
                                >
                                    <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-xl">
                                        <img 
                                            src={album.coverUrl || "/default-album.png"} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            alt={album.title} 
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
                                        <div className="absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                            <Play size={18} className="fill-white text-white" />
                                        </div>
                                    </div>
                                    <div className="px-1">
                                        <h4 className="text-[11px] font-black uppercase italic truncate">{album.title}</h4>
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">{album.trackCount || 0} Mizik</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <Music size={40} />
                            <p className="text-[10px] font-black mt-4 uppercase tracking-widest">Favori yo ap disponib talè</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};