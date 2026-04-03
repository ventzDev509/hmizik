import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Headphones, MoreVertical, Plus, Loader2, Trash2 } from 'lucide-react';
import type { Album, Track } from '../../../types/Profile';
import { useTracks } from '../../../../context/TrackContext';
import { useState } from 'react';
import { ArtistAnalytics } from '../../../Analystic/ArtistAnalytics';

interface ProfileContentProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tracks: Track[];
    albums: Album[];
    tracksLoading: boolean;
    incrementPlay: (id: string) => void;
    setIsAlbumModalOpen: (open: boolean) => void;
    navigate: (path: string) => void;
    deleteAlbum: (id: string) => Promise<void>;
}

export const ProfileContent = ({
    activeTab,
    setActiveTab,
    tracks,
    albums,
    tracksLoading,
    setIsAlbumModalOpen,
    navigate,
    deleteAlbum
}: ProfileContentProps) => {
    const { deleteTrack } = useTracks();
    const [deletingAlbumId, setDeletingAlbumId] = useState<string | null>(null);

    // Fonksyon pou fòmate tan (segond an minit:segond)
    const formatDuration = (seconds: number | undefined | null) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Jesyon efasman album ak loader
    const handleDeleteAlbum = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Èske w sèten w vle efase album sa a nèt ak tout mizik ki ladan l?")) {
            setDeletingAlbumId(id);
            try {
                await deleteAlbum(id);
            } catch (err) {
                console.error("Erè efasman:", err);
            } finally {
                setDeletingAlbumId(null);
            }
        }
    };

    return (
        <div className="mt-10">
            {/* TABS SELECTION */}
            <div className="sticky top-14 z-40 bg-[#121212] border-b flex border-white/5">
                {['uploads', 'playlists', 'likes'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === tab ? 'text-orange-600' : 'text-zinc-600'
                            }`}
                    >
                        {tab === 'uploads' ? 'Statistik' : tab === 'playlists' ? 'Album yo' : 'Mizik'}
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

                    {/* TAB: MIZIK (UPLOADS) */}
                    {activeTab === 'uploads' ? (
                        <div className="">

                            <ArtistAnalytics tracks={tracks} />
                        </div>



                    ) :

                        /* TAB: ALBUM YO (PLAYLISTS) */
                        activeTab === 'playlists' ? (
                            <motion.div
                                key="albums"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
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
                                        layout
                                        onClick={() => navigate(`/album?id=${album.id}`)}
                                        className="flex flex-col gap-3 group cursor-pointer relative"
                                    >
                                        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-xl">
                                            <img
                                                src={album.coverUrl || "/default-album.png"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt={album.title}
                                            />

                                            {/* Bouton Delete sou Album nan */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <motion.button
                                                    whileTap={{ scale: 0.8 }}
                                                    disabled={deletingAlbumId === album.id}
                                                    onClick={(e) => handleDeleteAlbum(e, album.id)}
                                                    className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    {deletingAlbumId === album.id ? (
                                                        <Loader2 size={14} className="text-white animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} className="text-white" />
                                                    )}
                                                </motion.button>
                                            </div>

                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
                                            <div className="absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg">
                                                <Play size={18} className="fill-white text-white" />
                                            </div>
                                        </div>
                                        <div className="px-1 text-left">
                                            <h4 className="text-[11px] font-black uppercase italic truncate">{album.title}</h4>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">{album.trackCount || 0} Mizik</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tracks"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                {tracksLoading ? (
                                    // Loader pandan mizik yo ap chaje
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="text-orange-600 animate-spin" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Chajman mizik yo...</p>
                                    </div>
                                ) : tracks.length > 0 ? (
                                    tracks.map((track) => (
                                        <motion.div
                                            key={track.id}
                                            layout
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
                                            <div className="flex-1 min-w-0 text-left">
                                                <h4 className="text-sm font-black truncate uppercase italic tracking-tight">{track.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[9px] text-orange-600 font-black uppercase tracking-widest">{track.genre}</span>
                                                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase">
                                                        <Headphones size={10} /> {track.playCount?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-mono text-zinc-500">
                                                    {formatDuration(track.duration)}
                                                </span>

                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteTrack(track.id);
                                                    }}
                                                    className="p-2 hover:bg-red-500/10 rounded-full group/del transition-colors"
                                                >
                                                    <Trash2 size={16} className="text-zinc-600 group-hover/del:text-red-500 transition-colors" />
                                                </motion.button>

                                                <button className="p-2 hover:bg-white/5 rounded-full">
                                                    <MoreVertical size={16} className="text-zinc-500" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                        <Music size={40} />
                                        <p className="text-[10px] font-black mt-4 uppercase">Poko gen okenn mizik</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                </AnimatePresence>
            </div>
        </div>
    );
};